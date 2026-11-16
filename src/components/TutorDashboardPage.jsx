import React, { useContext, useEffect, useState } from "react";
import {
  FaFolderOpen,
  FaStar,
  FaCalendarDay,
  FaClipboardList,
  FaUserEdit,
  FaClock,
  FaVideo,
  FaCheckCircle,
  FaUser,
} from "react-icons/fa";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// =============================
// API 기본 주소
// =============================
const API_URL = (
  process.env.REACT_APP_API_URL ||
  "https://api.rokmun.com"
).trim().replace(/\/+$/, "");

export default function TutorDashboardPage() {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [tutor, setTutor] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 예약 처리 상태
  const [processingBooking, setProcessingBooking] = useState(null);
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingError, setBookingError] = useState("");

  // 자료 업로드 상태
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState("");

  // =============================
  // 대시보드 데이터 조회
  // =============================
  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError("로그인 정보가 없습니다. 다시 로그인해 주세요.");
      return;
    }

    let active = true;

    const fetchDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await axios.get(
          `${API_URL}/api/tutors/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!active) return;

        setTutor(res.data.tutor || null);

        setBookings(
          Array.isArray(res.data.bookings)
            ? res.data.bookings
            : []
        );

        setReviews(
          Array.isArray(res.data.reviews)
            ? res.data.reviews
            : []
        );
      } catch (err) {
        if (!active) return;

        console.error("튜터 대시보드 조회 실패:", err);

        setError(
          err.response?.data?.message ||
          err.response?.data?.detail ||
          err.response?.data?.error ||
          "대시보드 정보를 불러오지 못했습니다."
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchDashboard();

    return () => {
      active = false;
    };
  }, [token]);

  // =============================
  // 튜터 이름 및 승인 상태
  // =============================
  const tutorName =
    tutor?.name ||
    user?.full_name ||
    user?.name ||
    "튜터";

  const approved =
    tutor?.approved ?? user?.tutorVerified ?? false;

  const rejected = tutor?.rejected === true;

   // =============================
  // 수업 완료 가능 시간 확인
  // =============================

  const LESSON_DURATION_MINUTES = 60;

  const [currentTime, setCurrentTime] = useState(
    Date.now()
  );

  // 30초마다 현재 시간 갱신
  // 수업 종료 시 새로고침 없이 버튼 표시
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 30000);

    return () => clearInterval(timer);
  }, []);

  const canCompleteBooking = (
    booking,
    now = currentTime
  ) => {
    if (
      !booking ||
      booking.status !== "confirmed" ||
      !booking.date ||
      !booking.time
    ) {
      return false;
    }

    // 날짜 및 시간 형식 확인
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(booking.date) ||
      !/^([01]\d|2[0-3]):[0-5]\d$/.test(
        booking.time
      )
    ) {
      return false;
    }

    // 한국 시간 기준 수업 시작 시각
    const lessonStart = new Date(
      `${booking.date}T${booking.time}:00+09:00`
    ).getTime();

    if (Number.isNaN(lessonStart)) {
      return false;
    }

    // 수업 종료 시각
    const lessonEnd =
      lessonStart +
      LESSON_DURATION_MINUTES * 60 * 1000;

    return now >= lessonEnd;
  };

  // =============================
  // 예약 확정 / 거절 / 수업 완료
  // =============================

  const handleBookingAction = async (
    booking,
    action
  ) => {
    if (
      processingBooking ||
      !token ||
      !approved ||
      rejected ||
      !booking?._id
    ) {
      return;
    }

    // 허용된 예약 처리 기능 확인
    if (
      !["confirm", "reject", "complete"].includes(
        action
      )
    ) {
      return;
    }

    // 예약 확정 및 거절은 대기 상태에서만 가능
    if (
      (action === "confirm" ||
        action === "reject") &&
      booking.status !== "pending"
    ) {
      return;
    }

    // 수업 완료는 확정 상태에서만 가능
    if (action === "complete") {
      if (
        booking.status !== "confirmed" ||
        !canCompleteBooking(booking, Date.now())
      ) {
        setBookingError(
          "수업 종료 후에 완료 처리할 수 있습니다."
        );
        return;
      }
    }

    // 처리 기능별 안내 문구
    const actionLabels = {
      confirm: "확정",
      reject: "거절",
      complete: "완료 처리",
    };

    const label = actionLabels[action];

    const confirmMessage =
      action === "complete"
        ? `이 수업을 완료 처리하시겠습니까?\n\n` +
          `수업 날짜: ${booking.date}\n` +
          `수업 시간: ${booking.time}\n\n` +
          `실제로 수업을 마친 경우에만 완료해 주세요.`
        : `이 수업 예약을 ${label}하시겠습니까?\n\n` +
          `수업 날짜: ${booking.date}\n` +
          `수업 시간: ${booking.time}`;

    const confirmed = window.confirm(
      confirmMessage
    );

    if (!confirmed) return;

    setProcessingBooking(booking._id);
    setBookingMessage("");
    setBookingError("");

    try {
      // 예약 확정 / 거절 / 수업 완료 API
      const res = await axios.patch(
        `${API_URL}/bookings/${booking._id}/${action}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updated = res.data.booking;

      // 서버 응답 확인
      if (
        !updated ||
        updated._id !== booking._id
      ) {
        throw new Error(
          "예약 응답을 확인할 수 없습니다."
        );
      }

      // 처리된 예약 상태 검증
      const expectedStatuses = {
        confirm: "confirmed",
        reject: "canceled",
        complete: "completed",
      };

      if (
        updated.status !==
        expectedStatuses[action]
      ) {
        throw new Error(
          "변경된 예약 상태를 확인할 수 없습니다."
        );
      }

      // 변경된 예약 상태를 화면에 즉시 반영
      setBookings((prev) =>
        prev.map((b) =>
          b._id === updated._id
            ? { ...b, ...updated }
            : b
        )
      );

      // 처리 성공 안내
      setBookingMessage(
        res.data.message ||
          (action === "complete"
            ? "수업이 완료 처리되었습니다."
            : `수업 예약이 ${label}되었습니다.`)
      );

    } catch (err) {
      console.error(
        "예약 처리 실패:",
        err
      );

      setBookingError(
        err.response?.data?.message ||
          err.response?.data?.detail ||
          "예약 처리에 실패했습니다. 새로고침 후 상태를 확인해 주세요."
      );

    } finally {
      setProcessingBooking(null);
    }
  };

  // =============================
  // 로그아웃
  // =============================
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  // =============================
  // 자료 파일 선택
  // =============================
  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] || null);
    setUploadMessage("");
    setUploadError("");
  };

  // =============================
  // 자료 업로드
  // =============================
  const handleUpload = async () => {
    setUploadMessage("");
    setUploadError("");

    if (!file) {
      setUploadError("업로드할 파일을 선택해 주세요.");
      return;
    }

    if (!token) {
      setUploadError("다시 로그인해 주세요.");
      return;
    }

    if (!approved || rejected) {
      setUploadError("튜터 승인 후 이용할 수 있습니다.");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(
        `${API_URL}/api/materials/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUploadMessage("자료가 정상적으로 업로드되었습니다.");
      setFile(null);
    } catch (err) {
      console.error("자료 업로드 실패:", err);

      setUploadError(
        err.response?.data?.message ||
        err.response?.data?.detail ||
        err.response?.data?.error ||
        "자료 업로드에 실패했습니다."
      );
    } finally {
      setUploading(false);
    }
  };

  // =============================
  // 오늘 날짜 (한국 시간 기준)
  // =============================
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  // =============================
  // 예약 통계
  // =============================
  const todayBookings = bookings.filter(
    (b) =>
      b.date === today &&
      b.status !== "canceled"
  ).length;

  const totalBookings = bookings.length;

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (sum, r) => sum + (Number(r.rating) || 0),
            0
          ) / reviews.length
        ).toFixed(1)
      : "0.0";

  // =============================
  // 예약 상태 표시
  // =============================
  const statusInfo = {
    pending: {
      label: "예약 대기",
      style: "bg-amber-50 text-amber-700",
    },
    confirmed: {
      label: "예약 확정",
      style: "bg-green-50 text-green-700",
    },
    canceled: {
      label: "예약 취소",
      style: "bg-red-50 text-red-600",
    },
    completed: {
      label: "수업 완료",
      style: "bg-blue-50 text-blue-700",
    },
  };

  // =============================
  // 화면 렌더링
  // =============================
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* =========================
            상단 ROKMUN 헤더
            ========================= */}
        <section className="bg-gradient-to-r from-blue-800 to-blue-500 rounded-2xl shadow-lg p-7 sm:p-9 text-white">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">

            <div>
              <p className="text-sm font-semibold tracking-widest text-blue-100 mb-2">
                ROKMUN TUTOR CENTER
              </p>

              <h1 className="text-3xl font-bold mb-3">
                튜터 대시보드
              </h1>

              <p className="text-lg text-blue-50">
                {tutorName}님, 환영합니다.
              </p>

              <p className="text-sm text-blue-100 mt-2">
                ROKMUN에서 수업과 학습자를 관리하세요.
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="bg-white text-blue-800 px-5 py-3 rounded-xl font-semibold hover:bg-blue-50 transition shadow"
            >
              로그아웃
            </button>

          </div>
        </section>

        {/* =========================
            오류 및 로딩 안내
            ========================= */}
        {loading && (
          <div className="bg-blue-50 border border-blue-100 text-blue-700 rounded-xl p-4 text-sm">
            튜터 정보를 불러오는 중입니다.
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
            {error}
          </div>
        )}

        {/* =========================
            튜터 프로필 요약
            ========================= */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">

            <div className="flex items-center gap-4">

              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">

                {tutor?.photo ? (
                  <img
                    src={
                      /^https?:\/\//i.test(tutor.photo) ||
                      tutor.photo.startsWith("data:image") ||
                      tutor.photo.startsWith("/images/")
                        ? tutor.photo
                        : `${API_URL}/${tutor.photo.replace(/^\/+/, "")}`
                    }
                    alt={`${tutorName} 프로필`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      if (
                        !e.currentTarget.src.endsWith(
                          "/images/default-tutor.svg"
                        )
                      ) {
                        e.currentTarget.src =
                          "/images/default-tutor.svg";
                      }
                    }}
                  />
                ) : (
                  <FaUser className="text-4xl text-slate-400" />
                )}

              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">

                  <h2 className="text-xl font-bold text-gray-800">
                    {tutorName}
                  </h2>

                  {loading ? (
                    <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                      확인 중
                    </span>
                  ) : rejected ? (
                    <span className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded-full">
                      승인 거절
                    </span>
                  ) : approved ? (
                    <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full">
                      <FaCheckCircle />
                      승인 완료
                    </span>
                  ) : (
                    <span className="text-xs bg-amber-50 text-amber-700 px-3 py-1 rounded-full">
                      승인 대기
                    </span>
                  )}

                </div>

                <p className="text-gray-500 text-sm mt-2">
                  {tutor?.bio || "등록된 소개가 없습니다."}
                </p>

                <p className="text-gray-400 text-xs mt-2">
                  {user?.email || ""}
                </p>
              </div>

            </div>

            {approved && !rejected && tutor?._id && (
              <Link
                to={`/tutors/${tutor._id}`}
                className="text-center bg-blue-50 text-blue-700 px-5 py-3 rounded-xl text-sm font-semibold hover:bg-blue-100 transition"
              >
                내 튜터 페이지 보기
              </Link>
            )}

          </div>
        </section>

        {/* =========================
            운영 관리 메뉴
            ========================= */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            수업 운영 관리
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            <ManagementCard
              icon={<FaUserEdit />}
              title="프로필 관리"
              description="사진, 자기소개 및 수업료 설정"
              to="/tutor/profile/edit"
            />

            <ManagementCard
              icon={<FaClock />}
              title="수업 가능 시간"
              description="예약 가능한 요일과 시간 설정"
              to="/tutor/availability"
            />

            <ManagementCard
              icon={<FaVideo />}
              title="소개 영상 관리"
              description="튜터 소개 영상 등록 및 수정"
            />

          </div>
        </section>

        {/* =========================
            운영 통계
            ========================= */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            수업 운영 현황
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            <StatCard
              icon={<FaCalendarDay />}
              label="오늘 예약"
              value={
                loading || error
                  ? "—"
                  : todayBookings
              }
              unit="건"
            />

            <StatCard
              icon={<FaClipboardList />}
              label="전체 예약"
              value={
                loading || error
                  ? "—"
                  : totalBookings
              }
              unit="건"
            />

            <StatCard
              icon={<FaStar />}
              label="평균 평점"
              value={
                loading || error
                  ? "—"
                  : avgRating
              }
              unit="점"
            />

          </div>
        </section>

        {/* =========================
            예약 관리
            ========================= */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            예약 관리
          </h2>

          {/* 예약 처리 성공 메시지 */}
          {bookingMessage && (
            <p
              role="status"
              className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-4 text-sm"
            >
              {bookingMessage}
            </p>
          )}

          {/* 예약 처리 오류 메시지 */}
          {bookingError && (
            <p
              role="alert"
              className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-4 text-sm"
            >
              {bookingError}
            </p>
          )}

          {loading ? (
            <EmptyState
              icon={<FaCalendarDay />}
              title="예약 정보를 불러오는 중입니다."
            />
          ) : error ? (
            <EmptyState
              icon={<FaCalendarDay />}
              title="예약 정보를 확인할 수 없습니다."
              description="서버 연결 상태를 확인해 주세요."
            />
          ) : bookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {bookings.map((b) => {
                const status = statusInfo[b.status] || {
                  label: b.status || "상태 미정",
                  style: "bg-gray-100 text-gray-600",
                };

                return (
                  <div
                    key={b._id}
                    className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
                  >
                    <div className="flex items-center justify-between gap-3">

                      <h3 className="font-bold text-gray-800">
                        {b.student?.full_name ||
                          b.student?.name ||
                          b.studentName ||
                          "학습자"}
                      </h3>

                      <span
                        className={`text-xs px-3 py-1 rounded-full ${status.style}`}
                      >
                        {status.label}
                      </span>

                    </div>

                    <p className="text-sm text-gray-500 mt-3">
                      {b.date} · {b.time}
                    </p>

                    {b.notes && (
                      <p className="text-sm text-gray-600 mt-2">
                        {b.notes}
                      </p>
                    )}

                    {/* =========================
                        예약 확정 / 거절 버튼
                        ========================= */}
                    {approved &&
                      !rejected &&
                      b.status === "pending" && (
                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">

                          <button
                            type="button"
                            disabled={processingBooking !== null}
                            onClick={() =>
                              handleBookingAction(b, "confirm")
                            }
                            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                          >
                            <FaCheckCircle />

                            {processingBooking === b._id
                              ? "처리 중..."
                              : "예약 확정"}
                          </button>

                          <button
                            type="button"
                            disabled={processingBooking !== null}
                            onClick={() =>
                              handleBookingAction(b, "reject")
                            }
                            className="border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-sm font-semibold transition"
                          >
                            예약 거절
                          </button>

                        </div>
                      )}

                    {/* =========================
                        예약 확정 및 수업 완료 처리
                        ========================= */}
                    {b.status === "confirmed" && (
                      <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">

                        <p className="text-sm text-green-700 flex items-center gap-2">
                          <FaCheckCircle />
                          수업 예약이 확정되었습니다.
                        </p>

                        {approved && !rejected && (
                          <>
                            {canCompleteBooking(b) ? (
                              <>
                                <p className="text-sm text-blue-700">
                                  수업 종료 시간이 지났습니다.
                                </p>

                                <button
                                  type="button"
                                  disabled={
                                    processingBooking !== null
                                  }
                                  onClick={() =>
                                    handleBookingAction(
                                      b,
                                      "complete"
                                    )
                                  }
                                  className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                                >
                                  <FaCheckCircle />

                                  {processingBooking === b._id
                                    ? "처리 중..."
                                    : "수업 완료 처리"}
                                </button>
                              </>
                            ) : (
                              <p className="text-xs text-gray-500 flex items-center gap-2">
                                <FaClock />
                                수업 종료 후 완료 처리할 수 있습니다.
                              </p>
                            )}
                          </>
                        )}

                      </div>
                    )}

                    {/* =========================
                        수업 완료 안내
                        ========================= */}
                    {b.status === "completed" && (
                      <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">

                        <p className="text-sm text-blue-700 flex items-center gap-2 font-semibold">
                          <FaCheckCircle />
                          수업이 정상적으로 완료되었습니다.
                        </p>

                        {b.completedAt && (
                          <p className="text-xs text-gray-500">
                            완료 처리 일시:{" "}
                            {new Date(
                              b.completedAt
                            ).toLocaleString("ko-KR", {
                              timeZone: "Asia/Seoul",
                            })}
                          </p>
                        )}

                        <p className="text-xs text-gray-500">
                          완료된 수업은 예약 이력에 보존됩니다.
                        </p>

                      </div>
                    )}

                    {/* 예약 취소 안내 */}
                    {b.status === "canceled" && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500">
                          취소된 예약입니다.
                        </p>
                      </div>
                    )}

                  </div>
                );
              })}

            </div>
          ) : (
            <EmptyState
              icon={<FaCalendarDay />}
              title="아직 예약된 수업이 없습니다."
              description="학습자가 수업을 예약하면 이곳에 표시됩니다."
            />
          )}
        </section>

        {/* =========================
            자료 업로드
            ========================= */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3 mb-2">
            <FaFolderOpen className="text-blue-600" />
            수업 자료 관리
          </h2>

          <p className="text-sm text-gray-500 mb-5">
            학습자에게 제공할 수업 자료를 업로드하세요.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">

            <input
              type="file"
              onChange={handleFileChange}
              disabled={uploading || !approved || rejected}
              className="flex-1 min-w-0 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600"
            />

            <button
              onClick={handleUpload}
              disabled={
                uploading ||
                !file ||
                !approved ||
                rejected
              }
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              {uploading ? "업로드 중..." : "업로드"}
            </button>

          </div>

          {(!approved || rejected) && (
            <p className="text-sm text-amber-600 mt-3">
              관리자 승인 후 자료를 등록할 수 있습니다.
            </p>
          )}

          {uploadMessage && (
            <p className="bg-green-50 text-green-700 rounded-lg p-3 mt-4 text-sm">
              {uploadMessage}
            </p>
          )}

          {uploadError && (
            <p className="bg-red-50 text-red-700 rounded-lg p-3 mt-4 text-sm">
              {uploadError}
            </p>
          )}

        </section>

        {/* =========================
            학습자 리뷰
            ========================= */}
        <section>

          <h2 className="text-xl font-bold text-gray-800 mb-4">
            학습자 리뷰
          </h2>

          {loading ? (
            <EmptyState
              icon={<FaStar />}
              title="리뷰를 불러오는 중입니다."
            />
          ) : error ? (
            <EmptyState
              icon={<FaStar />}
              title="리뷰를 확인할 수 없습니다."
            />
          ) : reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {reviews.map((r) => (
                <div
                  key={r._id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
                >

                  <div className="flex items-center gap-2 mb-3">

                    <FaStar className="text-yellow-400" />

                    <span className="font-semibold text-gray-700">
                      {r.rating}점
                    </span>

                  </div>

                  <p className="text-gray-700 text-sm leading-relaxed">
                    {r.comment || "등록된 리뷰 내용이 없습니다."}
                  </p>

                </div>
              ))}

            </div>
          ) : (
            <EmptyState
              icon={<FaStar />}
              title="아직 등록된 리뷰가 없습니다."
              description="학습자가 수업 후 리뷰를 작성하면 이곳에 표시됩니다."
            />
          )}

        </section>

        {/* =========================
            하단 브랜드
            ========================= */}
        <footer className="text-center text-xs text-gray-400 py-6">
          ROKMUN · 대한민국으로 향하는 모든 길
        </footer>

      </main>
    </div>
  );
}

// =============================
// 운영 관리 카드
// =============================
function ManagementCard({
  icon,
  title,
  description,
  to,
}) {
  const content = (
    <>
      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl flex-shrink-0">
        {icon}
      </div>

      <div className="flex-1">
        <h3 className="font-bold text-gray-800">
          {title}
        </h3>

        <p className="text-xs text-gray-500 mt-1">
          {description}
        </p>
      </div>

      {to ? (
        <span className="text-xs font-semibold text-blue-600 whitespace-nowrap">
          관리하기 →
        </span>
      ) : (
        <span className="text-xs text-gray-400">
          준비 중
        </span>
      )}
    </>
  );

  const cardClass =
    "bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4";

  if (to) {
    return (
      <Link
        to={to}
        className={`${cardClass} hover:border-blue-300 hover:shadow-md hover:bg-blue-50 transition cursor-pointer no-underline`}
      >
        {content}
      </Link>
    );
  }

  return (
    <div className={cardClass}>
      {content}
    </div>
  );
}

// =============================
// 통계 카드
// =============================
function StatCard({
  icon,
  label,
  value,
  unit,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

      <div className="flex items-center gap-3 mb-4">

        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
          {icon}
        </div>

        <p className="text-sm text-gray-500">
          {label}
        </p>

      </div>

      <div className="flex items-baseline gap-2">

        <span className="text-3xl font-bold text-blue-700">
          {value}
        </span>

        <span className="text-sm text-gray-500">
          {unit}
        </span>

      </div>

    </div>
  );
}

// =============================
// 빈 목록 안내
// =============================
function EmptyState({
  icon,
  title,
  description,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center shadow-sm">

      <div className="text-4xl text-slate-300 flex justify-center mb-4">
        {icon}
      </div>

      <p className="font-semibold text-gray-700">
        {title}
      </p>

      {description && (
        <p className="text-sm text-gray-400 mt-2">
          {description}
        </p>
      )}

    </div>
  );
}