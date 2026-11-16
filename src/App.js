import React, { useState, useEffect, useContext } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useParams
} from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import api from "./api";
import { AuthProvider, AuthContext, useAuth } from "./context/AuthContext";
import { AdminAuthProvider, useAdminAuth } from "./context/AdminAuthContext";

// ----------------------
// 페이지 임포트
// ----------------------
import SignupPage from "./components/SignupPage";
import LoginPage from "./components/LoginPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import ResetPasswordPage from "./components/ResetPasswordPage";
import TutorListPage from "./components/TutorListPage";
import BookingForm from "./components/BookingForm";
import StudentMyPage from "./components/StudentMyPage";
import MyPage from "./components/MyPage";
import BookingListWithTutorName from "./components/BookingListWithTutorName";
import PaymentPage from "./components/PaymentPage";
import PaymentSuccess from "./components/PaymentSuccess";
import PaymentList from "./components/PaymentList";
import PaymentHistory from "./components/PaymentHistory";
import ChangePasswordPage from "./components/ChangePasswordPage";
import ProfileEditPage from "./components/ProfileEditPage";
import StudentDashboardPage from "./components/StudentDashboardPage";
import TutorDashboardPage from "./components/TutorDashboardPage";
import TutorProfileEditPage from "./components/TutorProfileEditPage";
import TutorAvailabilityPage from "./components/TutorAvailabilityPage";
import ReviewList from "./components/ReviewList";
import VideoClassPageWrapper from "./components/VideoClassPageWrapper";
import "./App.css";

// ----------------------
// 관리자 페이지
// ----------------------
import AdminDashboard from "./components/admin/AdminDashboard";
import UserList from "./components/admin/UserList";
import AdminTutorManagement from "./components/admin/AdminTutorManagement";
import AdminTutorApprovalPage from "./components/AdminTutorApprovalPage";
import AdminBookingList from "./components/admin/AdminBookingList";
import AdminReviewManagement from "./components/admin/AdminReviewManagement";
import AdminLoginPage from "./components/AdminLoginPage";
import AdminForgotPasswordPage from "./components/AdminForgotPasswordPage";
import AdminResetPasswordPage from "./components/AdminResetPasswordPage";
import AdminQAManagement from "./components/admin/AdminQAManagement";
import RequireAuth from "./components/RequireAuth";

const DEFAULT_IMAGE = "/images/default-tutor.svg";

// ----------------------
// Navbar
// ----------------------
function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav style={styles.navbar}>
      {/* ROKMUN 로고 */}
      <Link
        to="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          textDecoration: "none",
        }}
      >
        <img
          src="/images/rokmun-logo-header.png"
          alt="ROKMUN 로고"
          style={{
            height: "54px",
            width: "auto",
            cursor: "pointer",
            transition: "transform 0.25s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        />
      </Link>

      {/* 상단 메뉴 */}
      <div style={styles.navLinks}>
        <Link
          to="/"
          style={styles.navLink}
          className="nav-menu-link"
        >
          HOME
        </Link>

        <Link
          to="/tutors"
          style={styles.navLink}
          className="nav-menu-link"
        >
          TUTOR
        </Link>

        {/* 로그인하지 않은 사용자 */}
        {!user && (
          <>
            <Link
              to="/signup"
              style={styles.navLink}
              className="nav-menu-link"
            >
              SIGNUP
            </Link>

            <Link
              to="/login"
              style={styles.navLink}
              className="nav-menu-link"
            >
              LOGIN
            </Link>

            <Link
              to="/admin/login"
              style={styles.navLink}
              className="nav-menu-link"
            >
              ADMIN
            </Link>
          </>
        )}

        {/* 학습자 로그인 */}
        {user?.role === "student" && (
          <Link
            to="/student/mypage"
            style={styles.navLink}
            className="nav-menu-link"
          >
            MY PAGE
          </Link>
        )}

        {/* 튜터 로그인 */}
        {user?.role === "tutor" && (
          <Link
            to="/tutor/dashboard"
            style={styles.navLink}
            className="nav-menu-link"
          >
            DASHBOARD
          </Link>
        )}

        {/* 관리자 계정 */}
        {user?.role === "admin" && (
          <Link
            to="/admin/dashboard"
            style={styles.navLink}
            className="nav-menu-link"
          >
            ADMIN
          </Link>
        )}

        {/* 로그인한 사용자 로그아웃 */}
        {user && (
          <Link
            to="/login"
            onClick={logout}
            style={styles.navLink}
            className="nav-menu-link"
          >
            LOGOUT
          </Link>
        )}
      </div>
    </nav>
  );
}

// ----------------------
// 
// ----------------------
function MainPage() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const sampleTutors = [
    {
      _id: "sample1",
      name: "장준영",
      experience: 20,
      photoUrl: DEFAULT_IMAGE,
    },
    {
      _id: "sample2",
      name: "장서은",
      experience: 1,
      photoUrl: DEFAULT_IMAGE,
    },
    {
      _id: "sample3",
      name: "김수영",
      experience: 3,
      photoUrl: DEFAULT_IMAGE,
    },
  ];

    api.get("/api/tutors/with-rating")
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) setTutors(res.data);
        else setTutors(sampleTutors);
      })
      .catch(() => setTutors(sampleTutors))
      .finally(() => setLoading(false));
  }, []);

  const displayTutors = tutors.slice(0, 3);

  return (
  <div>
    <section style={styles.banner}>
  <img
    src="/images/rokmun-main-banner.png"
    alt="대한민국으로 향하는 열린 관문 ROKMUN"
    style={styles.bannerImage}
  />
</section>

<section style={styles.bannerMessage}>

  <h1 style={styles.bannerTitle}>
    한국으로 향하는 모든 길이 시작되는 문
  </h1>

  <p style={styles.bannerEnglish}>
    Your Gateway to Korea
  </p>

  <p style={styles.bannerSubtitle}>
    한국어 학습부터 입국·체류·정착까지
  </p>

  <Link to="/signup">
    <button
      style={styles.ctaButton}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
        e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.25)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      지금 시작하기
    </button>
  </Link>

</section>

      <section style={styles.section}>
  <h2 style={styles.sectionTitle}>추천 튜터</h2>

  <div style={styles.tutorList}>
    {loading ? (
      <p>추천 튜터 정보를 불러오는 중...</p>
    ) : (
      displayTutors.map((tutor) => (
        <div
  key={tutor._id}
  style={styles.tutorCard}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "scale(1.03)";
    e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.18)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
  }}
>

          <img
            src={tutor.photoUrl || DEFAULT_IMAGE}
            alt={`${tutor.name} 프로필`}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = DEFAULT_IMAGE;
            }}
            style={styles.tutorImage}
          />

          <h3 style={styles.tutorName}>
            {tutor.name}
          </h3>

          <p style={styles.tutorExperience}>
            경력: {tutor.experience}년
          </p>

          <Link
            to={`/tutors/${tutor._id}`}
            style={styles.detailLink}
          >
            자세히 보기 →
          </Link>

        </div>
      ))
    )}
  </div>
</section>

      <footer style={styles.footer}>
        <p>© 2025 ROKMUN. All rights reserved.</p>
      </footer>
    </div>
  );
}

// ----------------------
// TutorDetailPage
// ----------------------
function TutorDetailPage() {
  const { id } = useParams();
  const { user, token } = useContext(AuthContext);

  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedDate, setSelectedDate] = useState(
    new Date()
  );

  const [slots, setSlots] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");

  const [slotsLoading, setSlotsLoading] = useState(true);
  const [slotsError, setSlotsError] = useState("");
  const [refreshSlots, setRefreshSlots] = useState(0);

  const [booking, setBooking] = useState(false);
  const [message, setMessage] = useState("");
  const [bookingError, setBookingError] = useState("");

  const API_URL = (
    process.env.REACT_APP_API_URL ||
    "https://api.rokmun.com"
  ).trim().replace(/\/+$/, "");

  // ----------------------
  // 날짜 형식 변환
  // ----------------------
  const formatDate = (date) =>
    `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(
      date.getDate()
    ).padStart(2, "0")}`;

  const dateString = formatDate(selectedDate);

  // ----------------------
  // 튜터 정보 조회
  // ----------------------
  useEffect(() => {
    let active = true;

    const fetchTutor = async () => {
      setLoading(true);
      setError("");
      setTutor(null);
      setMessage("");
      setBookingError("");

      try {
        const res = await api.get(
          `/api/tutors/${id}`
        );

        if (!active) return;

        setTutor(res.data);
      } catch (err) {
        if (!active) return;

        console.error("튜터 조회 실패:", err);

        setError(
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.response?.data?.detail ||
          "튜터 정보를 불러올 수 없습니다."
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchTutor();

    return () => {
      active = false;
    };
  }, [id]);

  // ----------------------
  // 날짜별 실제 예약 가능 시간 조회
  // ----------------------
  useEffect(() => {
    let active = true;

    const fetchSlots = async () => {
      setSlotsLoading(true);
      setSlotsError("");
      setSlots([]);
      setAvailableSlots([]);
      setSelectedSlot("");

      try {
        const res = await api.get(
          `/api/tutors/${id}/available-slots`,
          {
            params: {
              date: dateString,
            },
          }
        );

        if (!active) return;

        const data = res.data;

        if (
          !Array.isArray(data.slots) ||
          !Array.isArray(data.availableSlots)
        ) {
          throw new Error(
            "예약 가능 시간 응답 형식이 올바르지 않습니다."
          );
        }

        setSlots(data.slots);
        setAvailableSlots(
          data.availableSlots
        );
      } catch (err) {
        if (!active) return;

        console.error(
          "예약 가능 시간 조회 실패:",
          err
        );

        setSlots([]);
        setAvailableSlots([]);

        setSlotsError(
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.response?.data?.detail ||
          "수업 가능 시간을 불러오지 못했습니다."
        );
      } finally {
        if (active) {
          setSlotsLoading(false);
        }
      }
    };

    fetchSlots();

    return () => {
      active = false;
    };
  }, [id, dateString, refreshSlots]);

  // ----------------------
  // 날짜 변경
  // ----------------------
  const handleDateChange = (date) => {
    if (!(date instanceof Date) || booking) {
      return;
    }

    if (formatDate(date) === dateString) {
      return;
    }

    setSelectedDate(date);
    setSelectedSlot("");
    setSlots([]);
    setAvailableSlots([]);
    setSlotsLoading(true);
    setSlotsError("");
    setMessage("");
    setBookingError("");
  };

  // ----------------------
  // 이미지 주소 처리
  // ----------------------
  const getImageUrl = (photo) => {
    if (!photo) return DEFAULT_IMAGE;

    if (
      /^https?:\/\//i.test(photo) ||
      photo.startsWith("data:image") ||
      photo.startsWith("/images/")
    ) {
      return photo;
    }

    return `${API_URL}/${photo.replace(
      /^\/+/,
      ""
    )}`;
  };

  // ----------------------
  // 소개 영상 주소 처리
  // ----------------------
  const getVideoUrl = (url) => {
    if (!url) return "";

    if (/^https?:\/\//i.test(url)) {
      return url;
    }

    return `${API_URL}/${url.replace(
      /^\/+/,
      ""
    )}`;
  };

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return "";

    try {
      const parsed = new URL(url);

      const host =
        parsed.hostname.toLowerCase();

      let videoId = "";

      if (
        host === "youtube.com" ||
        host === "www.youtube.com" ||
        host === "m.youtube.com"
      ) {
        if (parsed.pathname === "/watch") {
          videoId =
            parsed.searchParams.get("v");
        } else if (
          parsed.pathname.startsWith("/embed/") ||
          parsed.pathname.startsWith("/shorts/")
        ) {
          videoId =
            parsed.pathname.split("/")[2];
        }
      } else if (host === "youtu.be") {
        videoId =
          parsed.pathname.split("/")[1];
      }

      if (
        videoId &&
        /^[a-zA-Z0-9_-]{11}$/.test(videoId)
      ) {
        return `https://www.youtube.com/embed/${videoId}`;
      }

      return "";
    } catch {
      return "";
    }
  };

  // ----------------------
  // 실제 수업 예약
  // ----------------------
  const handleBooking = async () => {
    if (booking || slotsLoading) return;

    setMessage("");
    setBookingError("");

    if (!user || !token) {
      setBookingError(
        "로그인 후 수업을 예약할 수 있습니다."
      );
      return;
    }

    if (user.role !== "student") {
      setBookingError(
        "학습자 계정으로만 수업을 예약할 수 있습니다."
      );
      return;
    }

    if (!selectedSlot) {
      setBookingError(
        "수업 시간을 선택해 주세요."
      );
      return;
    }

    if (
      slotsError ||
      !availableSlots.includes(selectedSlot)
    ) {
      setBookingError(
        "현재 예약할 수 없는 시간입니다. 다른 시간을 선택해 주세요."
      );
      return;
    }

    if (!tutor?._id) {
      setBookingError(
        "튜터 정보를 확인할 수 없습니다."
      );
      return;
    }

    const bookedDate = dateString;
    const bookedTime = selectedSlot;

    setBooking(true);

    try {
      await api.post(
        "/api/tutors/bookings",
        {
          tutorId: tutor._id,
          date: bookedDate,
          time: bookedTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        `${bookedDate} ${bookedTime} 수업 예약 신청이 완료되었습니다.`
      );

      setSelectedSlot("");

      // 예약 성공 직후 해당 시간 차단
      setSlots((prev) =>
        prev.map((slot) =>
          slot.time === bookedTime
            ? {
                ...slot,
                available: false,
                booked: true,
                status: "booked",
              }
            : slot
        )
      );

      setAvailableSlots((prev) =>
        prev.filter(
          (time) => time !== bookedTime
        )
      );

      // 서버에서 실제 예약 상태 다시 조회
      setSlotsLoading(true);
      setRefreshSlots((prev) => prev + 1);

    } catch (err) {
      console.error("예약 실패:", err);

      setBookingError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "수업 예약에 실패했습니다."
      );

      // 다른 학습자가 먼저 예약한 경우
      if (err.response?.status === 409) {
        setSelectedSlot("");
        setSlotsLoading(true);
        setRefreshSlots((prev) => prev + 1);
      }

    } finally {
      setBooking(false);
    }
  };

  // ----------------------
  // 로딩 화면
  // ----------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-start pt-20">
        <div className="bg-white border border-gray-200 rounded-xl px-8 py-6 text-blue-700 shadow-sm">
          튜터 정보를 불러오는 중입니다.
        </div>
      </div>
    );
  }

  // ----------------------
  // 오류 화면
  // ----------------------
  if (error || !tutor) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-16">
        <div className="max-w-xl mx-auto bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">

          <h2 className="text-xl font-bold text-gray-800 mb-3">
            튜터 정보를 확인할 수 없습니다.
          </h2>

          <p className="text-sm text-gray-500 mb-6">
            {error ||
              "등록된 튜터가 없습니다."}
          </p>

          <Link
            to="/tutors"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold"
          >
            튜터 목록으로 돌아가기
          </Link>

        </div>
      </div>
    );
  }

  // ----------------------
  // 표시할 정보
  // ----------------------
  const reviewCount =
    Number(tutor.reviewCount) || 0;

  const averageRating =
    Number(tutor.averageRating) || 0;

  const hasPrice =
    tutor.price !== undefined &&
    tutor.price !== null &&
    tutor.price !== "" &&
    Number.isFinite(Number(tutor.price)) &&
    Number(tutor.price) >= 0;

  const videoUrl = getVideoUrl(
    tutor.sampleVideoUrl
  );

  const youtubeEmbedUrl =
    getYoutubeEmbedUrl(videoUrl);

  const isStudent =
    user?.role === "student";

  const canBook =
    isStudent &&
    !!token &&
    !!selectedSlot &&
    availableSlots.includes(selectedSlot) &&
    !booking &&
    !slotsLoading &&
    !slotsError;

  // ----------------------
  // 공개 튜터 상세 화면
  // ----------------------
  return (
    <div className="min-h-screen bg-gray-50">

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* 튜터 목록 돌아가기 */}
        <Link
          to="/tutors"
          className="inline-block text-sm text-gray-600 hover:text-blue-700 font-medium"
        >
          ← 튜터 목록으로 돌아가기
        </Link>

        {/* ROKMUN 튜터 헤더 */}
        <section className="bg-gradient-to-r from-blue-800 to-blue-500 rounded-2xl p-7 sm:p-9 text-white shadow-lg">

          <p className="text-xs sm:text-sm font-semibold tracking-widest text-blue-100 mb-5">
            ROKMUN KOREAN TUTOR
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-6">

            <img
              src={getImageUrl(tutor.photo)}
              alt={`${tutor.name} 프로필`}
              className="w-28 h-28 rounded-full object-cover bg-white border-4 border-white shadow"
              onError={(e) => {
                if (
                  !e.currentTarget.src.endsWith(
                    DEFAULT_IMAGE
                  )
                ) {
                  e.currentTarget.src =
                    DEFAULT_IMAGE;
                }
              }}
            />

            <div className="flex-1">

              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                {tutor.name}
              </h1>

              <p className="text-blue-100 mb-4">
                한국어 튜터
              </p>

              {tutor.approved === true &&
                tutor.rejected !== true && (
                  <span className="inline-block bg-white bg-opacity-20 rounded-full px-4 py-2 text-xs font-semibold">
                    ✓ ROKMUN 승인 튜터
                  </span>
                )}

            </div>

            <div className="bg-white bg-opacity-10 rounded-xl p-5">

              <p className="text-blue-100 text-xs mb-2">
                시간당 수업료
              </p>

              <p className="text-2xl font-bold">
                {hasPrice
                  ? `${Number(
                      tutor.price
                    ).toLocaleString("ko-KR")}원`
                  : "수업료 미등록"}
              </p>

              {hasPrice && (
                <p className="text-blue-100 text-xs mt-1">
                  1시간 기준
                </p>
              )}

            </div>

          </div>

        </section>

        {/* 본문 레이아웃 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* 왼쪽: 튜터 정보 */}
          <div className="lg:col-span-2 space-y-6">

            {/* 자기소개 */}
            <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">

              <h2 className="text-xl font-bold text-gray-800 mb-5">
                튜터 소개
              </h2>

              <p className="text-gray-600 text-sm sm:text-base leading-8 whitespace-pre-wrap">
                {tutor.bio ||
                  "아직 등록된 튜터 소개가 없습니다."}
              </p>

              {tutor.specialty && (
                <div className="border-t border-gray-100 mt-6 pt-5">

                  <p className="text-sm font-semibold text-gray-800 mb-2">
                    전문 분야
                  </p>

                  <p className="text-sm text-gray-600">
                    {tutor.specialty}
                  </p>

                </div>
              )}

              {tutor.language && (
                <div className="mt-5">

                  <p className="text-sm font-semibold text-gray-800 mb-2">
                    수업 언어
                  </p>

                  <p className="text-sm text-gray-600">
                    {tutor.language}
                  </p>

                </div>
              )}

            </section>

            {/* 평점 */}
            <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

              <h2 className="text-xl font-bold text-gray-800 mb-4">
                튜터 평가
              </h2>

              {reviewCount > 0 ? (
                <div className="flex items-center gap-3 flex-wrap">

                  <span className="text-yellow-400 text-2xl">
                    ★
                  </span>

                  <span className="text-2xl font-bold text-gray-800">
                    {averageRating.toFixed(1)}
                  </span>

                  <span className="text-sm text-gray-400">
                    / 5.0
                  </span>

                  <span className="text-sm text-gray-500">
                    리뷰 {reviewCount}개
                  </span>

                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-5 text-sm text-gray-500">
                  아직 등록된 리뷰가 없습니다.
                </div>
              )}

            </section>

            {/* 소개 영상 */}
            <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

              <h2 className="text-xl font-bold text-gray-800 mb-4">
                튜터 소개 영상
              </h2>

              {youtubeEmbedUrl ? (
                <div
                  className="relative w-full overflow-hidden rounded-xl bg-black"
                  style={{
                    paddingTop: "56.25%",
                  }}
                >
                  <iframe
                    src={youtubeEmbedUrl}
                    title="튜터 소개 영상"
                    className="absolute inset-0 w-full h-full"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              ) : videoUrl ? (
                <video
                  src={videoUrl}
                  controls
                  preload="metadata"
                  className="w-full rounded-xl bg-black"
                >
                  동영상을 재생할 수 없는 브라우저입니다.
                </video>
              ) : (
                <div className="bg-slate-50 rounded-xl p-10 text-center">

                  <div className="text-4xl mb-3">
                    ▶
                  </div>

                  <p className="text-sm text-gray-500">
                    아직 등록된 소개 영상이 없습니다.
                  </p>

                </div>
              )}

            </section>

            {/* 학생 리뷰 */}
            <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

              <h2 className="text-xl font-bold text-gray-800 mb-5">
                학습자 리뷰
              </h2>

              <ReviewList tutorId={tutor._id} />

            </section>

          </div>

          {/* 오른쪽: 예약 관리 */}
          <div className="lg:col-span-1">

            <section className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-5 lg:sticky lg:top-6">

              <h2 className="text-xl font-bold text-gray-800">
                수업 예약
              </h2>

              {/* 수업료 */}
              <div className="bg-blue-50 rounded-xl p-4">

                <p className="text-xs text-blue-600 mb-1">
                  시간당 수업료
                </p>

                <p className="text-2xl font-bold text-blue-700">
                  {hasPrice
                    ? `${Number(
                        tutor.price
                      ).toLocaleString("ko-KR")}원`
                    : "미등록"}
                </p>

              </div>

              {/* 날짜 선택 */}
              <div>

                <h3 className="text-sm font-bold text-gray-700 mb-3">
                  1. 수업 날짜 선택
                </h3>

                <div className="flex justify-center overflow-hidden">

                  <Calendar
                    value={selectedDate}
                    minDate={new Date()}
                    locale="ko-KR"
                    onChange={handleDateChange}
                    tileDisabled={() => booking}
                    className="w-full rounded-xl"
                  />

                </div>

              </div>

              {/* 실제 예약 가능 시간 선택 */}
              <div>

                <h3 className="text-sm font-bold text-gray-700 mb-2">
                  2. 수업 시간 선택
                </h3>

                <p className="text-xs text-gray-400 mb-3">
                  {dateString} · 한국 시간
                </p>

                {slotsLoading ? (
                  <div className="bg-blue-50 rounded-xl p-4 text-center text-sm text-blue-600">
                    예약 가능 시간을 확인하는 중입니다...
                  </div>
                ) : slotsError ? (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">

                    <p>{slotsError}</p>

                    <button
                      type="button"
                      onClick={() => {
                        setSlotsLoading(true);
                        setRefreshSlots(
                          (prev) => prev + 1
                        );
                      }}
                      className="mt-3 text-blue-700 font-semibold underline"
                    >
                      다시 조회하기
                    </button>

                  </div>
                ) : slots.length > 0 ? (
                  <>

                    <div className="grid grid-cols-2 gap-2">

                      {slots.map((slot) => {
                        const isBooked =
                          slot.booked === true ||
                          slot.status === "booked";

                        const isPast =
                          slot.past === true ||
                          slot.status === "past";

                        const isAvailable =
                          slot.available === true &&
                          !isBooked &&
                          !isPast &&
                          availableSlots.includes(
                            slot.time
                          );

                        const isSelected =
                          selectedSlot ===
                          slot.time;

                        return (
                          <button
                            key={slot.time}
                            type="button"
                            disabled={
                              booking ||
                              !isAvailable
                            }
                            onClick={() => {
                              if (!isAvailable) {
                                return;
                              }

                              setSelectedSlot(
                                slot.time
                              );
                              setMessage("");
                              setBookingError("");
                            }}
                            className={`rounded-lg px-3 py-3 text-sm font-medium border transition flex flex-col items-center justify-center gap-1 ${
                              !isAvailable
                                ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                                : isSelected
                                ? "bg-blue-600 border-blue-600 text-white"
                                : "bg-white border-gray-200 text-gray-700 hover:bg-blue-50"
                            }`}
                          >

                            <span
                              className={
                                !isAvailable
                                  ? "line-through"
                                  : ""
                              }
                            >
                              {slot.time}
                            </span>

                            {isBooked ? (
                              <span className="text-xs text-gray-400">
                                예약 마감
                              </span>
                            ) : isPast ? (
                              <span className="text-xs text-gray-400">
                                지난 시간
                              </span>
                            ) : isAvailable ? (
                              <span
                                className={`text-xs ${
                                  isSelected
                                    ? "text-blue-100"
                                    : "text-green-600"
                                }`}
                              >
                                예약 가능
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400">
                                예약 불가
                              </span>
                            )}

                          </button>
                        );
                      })}

                    </div>

                    {availableSlots.length === 0 && (
                      <div className="mt-3 bg-gray-50 rounded-xl p-3 text-xs text-gray-500 text-center">
                        선택한 날짜의 모든 수업 시간이 마감되었습니다.
                      </div>
                    )}

                  </>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-4 text-center text-sm text-gray-500">
                    선택한 날짜에는 수업 가능 시간이 없습니다.
                  </div>
                )}

              </div>

              {/* 로그인하지 않은 경우 */}
              {!user && (
                <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700">

                  수업을 예약하려면 학습자로 로그인해 주세요.

                  <Link
                    to="/login"
                    className="block font-semibold mt-2 underline"
                  >
                    로그인하기 →
                  </Link>

                </div>
              )}

              {/* 튜터 또는 관리자 */}
              {user && !isStudent && (
                <div className="bg-amber-50 rounded-xl p-4 text-xs text-amber-700 leading-relaxed">
                  현재 튜터 또는 관리자 계정으로 접속 중입니다.
                  수업 예약은 학습자 계정에서만 가능합니다.
                </div>
              )}

              {/* 예약 버튼 */}
              <button
                type="button"
                onClick={handleBooking}
                disabled={!canBook}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-xl py-4 font-bold transition"
              >
                {booking
                  ? "예약 신청 중..."
                  : slotsLoading
                  ? "예약 시간 확인 중..."
                  : slotsError
                  ? "예약 시간 조회 실패"
                  : availableSlots.length === 0
                  ? "예약 가능한 시간 없음"
                  : !isStudent || !token
                  ? "학습자 로그인 필요"
                  : !selectedSlot
                  ? "수업 시간을 선택해 주세요"
                  : "수업 예약하기"}
              </button>

              {/* 예약 성공 */}
              {message && (
                <div
                  role="status"
                  className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700"
                >

                  {message}

                  <Link
                    to="/student/mypage"
                    className="block mt-3 font-semibold underline"
                  >
                    내 예약 확인하기 →
                  </Link>

                </div>
              )}

              {/* 예약 실패 */}
              {bookingError && (
                <div
                  role="alert"
                  className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700"
                >
                  {bookingError}
                </div>
              )}

              <p className="text-xs text-gray-400 text-center leading-relaxed">
                ROKMUN에서 나에게 맞는 한국어 수업을 시작하세요.
              </p>

            </section>

          </div>

        </div>

        {/* 하단 브랜드 */}
        <footer className="text-center text-xs text-gray-400 py-8">
          ROKMUN · 대한민국으로 향하는 모든 길
        </footer>

      </main>

    </div>
  );
}
// ----------------------
// App
// ----------------------
export default function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <Navbar />
          <AppRoutes />
        </BrowserRouter>
      </AdminAuthProvider>
    </AuthProvider>
  );
}

// ----------------------
// Routes
// ----------------------
function AppRoutes() {
  const { user } = useContext(AuthContext);
  const { admin } = useAdminAuth();

  return (
    <Routes>
      {/* 메인 */}
      <Route path="/" element={<MainPage />} />
      <Route path="/tutors" element={<TutorListPage />} />
      <Route path="/tutors/:id" element={<TutorDetailPage />} />

      {/* 회원가입/로그인 */}
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* 학생 전용 */}
      <Route path="/book" element={<RequireAuth role="student"><BookingForm /></RequireAuth>} />
      <Route path="/student/mypage" element={<RequireAuth role="student"><StudentMyPage /></RequireAuth>} />
      <Route path="/mypage" element={<RequireAuth><MyPage /></RequireAuth>} />
      <Route path="/my-bookings" element={<RequireAuth><BookingListWithTutorName /></RequireAuth>} />
      <Route path="/payment" element={<RequireAuth role="student"><PaymentPage /></RequireAuth>} />
      <Route path="/payments/success" element={<RequireAuth role="student"><PaymentSuccess /></RequireAuth>} />
      <Route path="/payment-list" element={<RequireAuth role="student"><PaymentList /></RequireAuth>} />
      <Route path="/payments/history" element={<RequireAuth role="student"><PaymentHistory /></RequireAuth>} />
      <Route path="/change-password" element={<RequireAuth><ChangePasswordPage /></RequireAuth>} />
      <Route path="/edit-profile" element={<RequireAuth><ProfileEditPage /></RequireAuth>} />

      {/* 학생/튜터 대시보드 */}
<Route
  path="/dashboard/student"
  element={
    <RequireAuth role="student">
      <StudentDashboardPage />
    </RequireAuth>
  }
/>

<Route
  path="/tutor/dashboard"
  element={
    <RequireAuth role="tutor">
      <TutorDashboardPage />
    </RequireAuth>
  }
/>

{/* 튜터 프로필 관리 */}
<Route
  path="/tutor/profile/edit"
  element={
    <RequireAuth role="tutor">
      <TutorProfileEditPage />
    </RequireAuth>
  }
/>

{/* 튜터 수업 가능 시간 관리 */}
<Route
  path="/tutor/availability"
  element={
    <RequireAuth role="tutor">
      <TutorAvailabilityPage />
    </RequireAuth>
  }
/>

      {/* 실시간 수업 */}
      <Route path="/video/:bookingId" element={<RequireAuth><VideoClassPageWrapper /></RequireAuth>} />

      {/* 관리자 전용 */}
      <Route path="/admin/dashboard" element={<RequireAuth role="admin"><AdminDashboard /></RequireAuth>} />
      <Route path="/admin/users" element={<RequireAuth role="admin"><UserList /></RequireAuth>} />
      <Route path="/admin/tutors" element={<RequireAuth role="admin"><AdminTutorManagement /></RequireAuth>} />
      <Route path="/admin/tutor-approval" element={<RequireAuth role="admin"><AdminTutorApprovalPage /></RequireAuth>} />
      <Route path="/admin/bookings" element={<RequireAuth role="admin"><AdminBookingList /></RequireAuth>} />
      <Route path="/admin/reviews" element={<RequireAuth role="admin"><AdminReviewManagement /></RequireAuth>} />
      <Route path="/admin/qa" element={<RequireAuth role="admin"><AdminQAManagement /></RequireAuth>} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/forgot-password" element={<AdminForgotPasswordPage />} />
      <Route path="/admin/reset-password" element={<AdminResetPasswordPage />} />

      {/* /dashboard 접근 리다이렉트 */}
      <Route path="/dashboard" element={
        admin ? <Navigate to="/admin/dashboard" replace /> :
        user ? (
          user.role === "student" ? <Navigate to="/dashboard/student" replace /> :
          user.role === "tutor" ? <Navigate to="/tutor/dashboard" replace /> :
          <Navigate to="/" replace />
        ) : <Navigate to="/login" replace />
      } />
    </Routes>
  );
}

// ----------------------
// Styles
// ----------------------
const styles = {
  navbar: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "7px 2rem",
  backgroundColor: "#0077cc",
  color: "#ffffff",
},
  logo: {
    fontSize: "1.6rem",
    fontWeight: "bold",
  },
  navLinks: {
    display: "flex",
    gap: "1.5rem",
  },
  navLink: {
  color: "#ffffff",
  textDecoration: "none",
  fontSize: "18px",
  fontWeight: 600,
  display: "inline-block",
  transition: "transform 0.2s ease",
},
  banner: {
  width: "100%",
  margin: 0,
  padding: 0,
  backgroundColor: "#eaf2f8",
},

bannerImage: {
  width: "100%",
  height: "auto",
  display: "block",
},

bannerMessage: {
  backgroundColor: "#0c3970",
  textAlign: "center",
  color: "#ffffff",
  padding: "2rem 1.5rem",
},

bannerTitle: {
  fontSize: "clamp(1.5rem, 3vw, 2.4rem)",
  fontWeight: 700,
  margin: "0 0 0.75rem",
  lineHeight: 1.4,
  wordBreak: "keep-all",
},

bannerEnglish: {
  fontSize: "1.5rem",
  fontWeight: 600,
  margin: "0 0 1rem",
  color: "#ffffff",
},

bannerSubtitle: {
  fontSize: "1.2rem",
  margin: "0 0 1.75rem",
  lineHeight: 1.5,
  wordBreak: "keep-all",
},
  ctaButton: {
    padding: "0.75rem 2rem",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    fontWeight: 700,
    fontSize: "1rem",
    borderRadius: "9999px",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s, transform 0.25s ease, box-shadow 0.25s ease",
  },
  section: {
    maxWidth: "1100px",
    margin: "2.5rem auto",
    padding: "0 2rem",
  },
  sectionTitle: {
    fontSize: "2rem",
    fontWeight: 700,
    textAlign: "center",
    marginBottom: "2rem",
    color: "#333333",
  },
  tutorList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "2rem",
    justifyContent: "center",
  },
  tutorCard: {
    width: "220px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
    backgroundColor: "#fff",
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
  },
  tutorImage: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "8px",
  },
  tutorName: {
    fontSize: "18px",
    fontWeight: 600,
    marginBottom: "4px",
  },
  tutorExperience: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "8px",
  },
  detailLink: {
    fontSize: "14px",
    color: "#2563eb",
    textDecoration: "none",
  },
  footer: {
  textAlign: "center",
  padding: "1.2rem 0",
  backgroundColor: "#0077cc",
  marginTop: "4rem",
  color: "#ffffff",
},
};