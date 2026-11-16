import React, {
  useEffect,
  useState,
  useCallback,
  useContext,
} from "react";

import { Link } from "react-router-dom";
import ReviewForm from "./ReviewForm";
import { AuthContext } from "../context/AuthContext";

import {
  CalendarDaysIcon,
  CalendarIcon,
  ClockIcon,
  UserCircleIcon,
  ArrowRightIcon,
  ExclamationCircleIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

// ======================
// API 기본 주소
// ======================
const API_URL = (
  process.env.REACT_APP_API_URL ||
  "https://api.rokmun.com"
).trim().replace(/\/+$/, "");

// ======================
// 예약 상태 설정
// ======================
const BOOKING_STATUS = {
  pending: {
    label: "예약 대기",
    color: "#B45309",
    backgroundColor: "#FFFBEB",
    borderColor: "#FDE68A",
    message: "튜터의 수업 예약 확정을 기다리고 있습니다.",
    icon: ClockIcon,
  },

  confirmed: {
    label: "예약 확정",
    color: "#15803D",
    backgroundColor: "#F0FDF4",
    borderColor: "#BBF7D0",
    message: "튜터가 수업 예약을 확정했습니다.",
    icon: CheckCircleIcon,
  },

  canceled: {
    label: "예약 취소",
    color: "#DC2626",
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
    message: "취소되었거나 튜터가 거절한 예약입니다.",
    icon: XCircleIcon,
  },

  completed: {
    label: "수업 완료",
    color: "#0077CC",
    backgroundColor: "#EAF4FF",
    borderColor: "#BFDBFE",
    message: "수업이 완료되었습니다.",
    icon: CheckCircleIcon,
  },
};

const UNKNOWN_STATUS = {
  label: "상태 확인 필요",
  color: "#64748B",
  backgroundColor: "#F1F5F9",
  borderColor: "#CBD5E1",
  message: "예약 상태를 확인할 수 없습니다.",
  icon: ExclamationCircleIcon,
};

function StudentBookingList({ studentId }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelingId, setCancelingId] = useState(null);

  const { user, token } = useContext(AuthContext);

  const currentStudentId =
    studentId || user?.id || user?._id;

  // ======================
  // 내 예약 목록 불러오기
  // ======================
  const fetchBookings = useCallback(async () => {
    if (!token) {
      setError("로그인이 필요합니다.");
      setBookings([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${API_URL}/my-bookings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(
          data.detail ||
            data.message ||
            data.error ||
            "예약 정보를 가져오지 못했습니다."
        );

        setBookings([]);
        return;
      }

      const list = data.bookings || data;

      if (!Array.isArray(list)) {
        setError("예약 데이터 형식이 올바르지 않습니다.");
        setBookings([]);
        return;
      }

      setBookings(list);
    } catch (err) {
      console.error("예약 조회 오류:", err);
      setError("서버와 연결할 수 없습니다.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // ======================
  // 예약 취소
  // ======================
  const cancelBooking = async (bookingId) => {
    if (!token || !bookingId || cancelingId) return;

    const targetBooking = bookings.find(
      (booking) =>
        (booking._id || booking.id) === bookingId
    );

    if (
      !targetBooking ||
      !["pending", "confirmed"].includes(
        targetBooking.status
      )
    ) {
      alert("취소할 수 없는 예약입니다.");
      return;
    }

    const confirmCancel = window.confirm(
      "정말 이 예약을 취소하시겠습니까?"
    );

    if (!confirmCancel) return;

    setCancelingId(bookingId);

    try {
      const res = await fetch(
        `${API_URL}/my-bookings/${bookingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(
          data.detail ||
            data.message ||
            data.error ||
            "예약 취소에 실패했습니다."
        );

        return;
      }

      alert("예약이 취소되었습니다.");
      await fetchBookings();
    } catch (err) {
      console.error("예약 취소 오류:", err);
      alert("서버 오류로 예약을 취소할 수 없습니다.");
    } finally {
      setCancelingId(null);
    }
  };

  // ======================
  // 날짜 표시
  // ======================
  const formatDate = (date) => {
    if (!date) return "날짜 미정";

    const match = String(date).match(
      /^(\d{4})-(\d{2})-(\d{2})/
    );

    if (match) {
      return `${match[1]}년 ${Number(match[2])}월 ${Number(match[3])}일`;
    }

    return String(date);
  };

  // ======================
  // 로딩 화면
  // ======================
  if (loading) {
    return (
      <div style={styles.stateBox}>
        <div style={styles.emptyIcon}>
          <CalendarDaysIcon
            style={{ width: 28, height: 28 }}
          />
        </div>

        <p style={styles.emptyTitle}>
          예약 정보를 불러오는 중입니다.
        </p>

        <p style={styles.emptyDescription}>
          잠시만 기다려 주세요.
        </p>
      </div>
    );
  }

  // ======================
  // 오류 화면
  // ======================
  if (error) {
    return (
      <div style={styles.errorBox}>
        <ExclamationCircleIcon
          style={{
            width: 30,
            height: 30,
            color: "#DC2626",
          }}
        />

        <p style={styles.errorText}>{error}</p>

        <button
          type="button"
          onClick={fetchBookings}
          style={styles.retryButton}
        >
          다시 시도
        </button>
      </div>
    );
  }

  // ======================
  // 예약이 없는 경우
  // ======================
  if (bookings.length === 0) {
    return (
      <div style={styles.stateBox}>
        <div style={styles.emptyIcon}>
          <CalendarDaysIcon
            style={{ width: 30, height: 30 }}
          />
        </div>

        <h3 style={styles.emptyTitle}>
          아직 예약한 수업이 없습니다
        </h3>

        <p style={styles.emptyDescription}>
          나에게 맞는 튜터를 만나
          첫 한국어 수업을 시작해 보세요.
        </p>

        <Link to="/tutors" style={styles.primaryButton}>
          튜터 찾아보기

          <ArrowRightIcon
            style={{ width: 17, height: 17 }}
          />
        </Link>
      </div>
    );
  }

  // ======================
  // 실제 예약 목록
  // ======================
  return (
    <div style={styles.bookingList}>

      {/* 예약 건수 */}
      <div style={styles.listSummary}>
        총{" "}
        <strong style={styles.count}>
          {bookings.length}
        </strong>
        개의 예약
      </div>

      {bookings.map((booking) => {
        const bookingId =
          booking._id || booking.id;

        const tutorId =
          booking.tutor?._id ||
          booking.tutor?.id;

        const tutorName =
          booking.tutor?.full_name ||
          booking.tutor?.name ||
          "튜터 정보 없음";

        // ======================
        // 실제 예약 상태 확인
        // ======================
        const bookingStatus = booking.status;

        const statusInfo =
          BOOKING_STATUS[bookingStatus] ||
          UNKNOWN_STATUS;

        const StatusIcon = statusInfo.icon;

        const canCancel =
          bookingStatus === "pending" ||
          bookingStatus === "confirmed";

         // ======================
        // 리뷰 작성 여부 확인
        // ======================
        const hasReviewed =
          booking.reviewed === true ||
          Boolean(booking.review?._id);

        // 완료된 수업 중 아직 리뷰를
        // 작성하지 않은 수업만 작성 가능
        const canReview =
          bookingStatus === "completed" &&
          !hasReviewed;

        return (
          <article
            key={bookingId}
            style={styles.bookingCard}
          >

            {/* ======================
                튜터 정보 및 예약 상태
                ====================== */}
            <div style={styles.bookingHeader}>

              <div style={styles.tutorProfile}>

                <div style={styles.tutorAvatar}>
                  <UserCircleIcon
                    style={{ width: 32, height: 32 }}
                  />
                </div>

                <div>
                  <h3 style={styles.tutorName}>
                    {tutorName}
                  </h3>

                  <p style={styles.tutorLabel}>
                    한국어 튜터
                  </p>
                </div>

              </div>

              {/* 실제 예약 상태 표시 */}
              <span
                style={{
                  ...styles.bookingBadge,
                  color: statusInfo.color,
                  backgroundColor:
                    statusInfo.backgroundColor,
                }}
              >
                {statusInfo.label}
              </span>

            </div>

            {/* ======================
                예약 날짜와 시간
                ====================== */}
            <div style={styles.bookingDetails}>

              <div style={styles.detailItem}>

                <CalendarIcon
                  style={styles.detailIcon}
                />

                <div>
                  <p style={styles.detailLabel}>
                    수업 날짜
                  </p>

                  <p style={styles.detailValue}>
                    {formatDate(booking.date)}
                  </p>
                </div>

              </div>

              <div style={styles.detailItem}>

                <ClockIcon
                  style={styles.detailIcon}
                />

                <div>
                  <p style={styles.detailLabel}>
                    수업 시간
                  </p>

                  <p style={styles.detailValue}>
                    {booking.time || "시간 미정"}
                  </p>
                </div>

              </div>

            </div>

            {/* ======================
                예약 상태 안내
                ====================== */}
            <div
              style={{
                ...styles.statusNotice,
                color: statusInfo.color,
                backgroundColor:
                  statusInfo.backgroundColor,
                borderColor:
                  statusInfo.borderColor,
              }}
            >

              <StatusIcon
                style={{
                  width: 20,
                  height: 20,
                  flexShrink: 0,
                }}
              />

              <span>
                {statusInfo.message}
              </span>

            </div>

  {/* ======================
                수업 완료 및 예약 이력 안내
                ====================== */}
            {bookingStatus === "completed" && (
              <div
                style={{
                  marginTop: "12px",
                  padding: "14px",
                  backgroundColor: "#F0F7FF",
                  border: "1px solid #DBEAFE",
                  borderRadius: "9px",
                }}
              >

                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#0077CC",
                    margin: "0 0 7px",
                  }}
                >
                  수업 완료 기록
                </p>

                {booking.completedAt &&
                  !Number.isNaN(
                    new Date(
                      booking.completedAt
                    ).getTime()
                  ) && (
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#475569",
                        margin: "0 0 7px",
                        lineHeight: 1.6,
                      }}
                    >
                      완료 처리 일시:{" "}
                      {new Date(
                        booking.completedAt
                      ).toLocaleString("ko-KR", {
                        timeZone: "Asia/Seoul",
                      })}
                    </p>
                  )}

                <p
                  style={{
                    fontSize: "12px",
                    color: "#64748B",
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  완료된 수업은 학습 이력으로 보존됩니다.
                  {" "}
                  {hasReviewed
                    ? "이 수업의 리뷰가 작성되었습니다."
                    : "아래에서 수업 리뷰를 작성할 수 있습니다."}
                </p>

              </div>
            )}

            {bookingStatus === "canceled" && (
              <p
                style={{
                  fontSize: "12px",
                  color: "#64748B",
                  margin: "10px 0 0",
                  lineHeight: 1.6,
                }}
              >
                취소된 예약도 예약 이력에 보존됩니다.
              </p>
            )}

            {/* ======================
                수업 요청사항
                ====================== */}
            {booking.notes && (
              <div style={styles.notesBox}>

                <ChatBubbleLeftRightIcon
                  style={{
                    width: 19,
                    height: 19,
                    color: "#64748B",
                    flexShrink: 0,
                  }}
                />

                <div>
                  <strong style={styles.notesTitle}>
                    수업 요청사항
                  </strong>

                  <p style={styles.notesText}>
                    {booking.notes}
                  </p>
                </div>

              </div>
            )}

             {/* ======================
                작성 완료된 리뷰 표시
                ====================== */}
            {bookingStatus === "completed" &&
              hasReviewed && (
                <div
                  style={{
                    ...styles.reviewSection,
                    backgroundColor: "#F8FBFF",
                    padding: "16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "12px",
                    }}
                  >
                    <CheckCircleIcon
                      style={{
                        width: 21,
                        height: 21,
                        color: "#16A34A",
                        flexShrink: 0,
                      }}
                    />

                    <strong
                      style={{
                        fontSize: "14px",
                        color: "#15803D",
                      }}
                    >
                      리뷰 작성 완료
                    </strong>
                  </div>

                  {booking.review && (
                    <>
                      {/* 작성한 평점 */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          marginBottom: "10px",
                        }}
                      >
                        <span
                          aria-label={`평점 ${booking.review.rating}점`}
                          style={{
                            color: "#EAB308",
                            fontSize: "22px",
                            letterSpacing: "2px",
                          }}
                        >
                          {Array.from(
                            { length: 5 },
                            (_, index) =>
                              index <
                              Number(
                                booking.review.rating
                              )
                                ? "★"
                                : "☆"
                          ).join("")}
                        </span>

                        <strong
                          style={{
                            color: "#15365C",
                            fontSize: "14px",
                          }}
                        >
                          {Number(
                            booking.review.rating
                          ).toFixed(1)}
                        </strong>
                      </div>

                      {/* 작성한 리뷰 내용 */}
                      <p
                        style={{
                          fontSize: "13px",
                          color: "#475569",
                          lineHeight: 1.8,
                          margin: "0 0 10px",
                          whiteSpace: "pre-wrap",
                          overflowWrap: "anywhere",
                        }}
                      >
                        {booking.review.comment}
                      </p>

                      {/* 리뷰 작성 날짜 */}
                      {booking.review.createdAt &&
                        !Number.isNaN(
                          new Date(
                            booking.review.createdAt
                          ).getTime()
                        ) && (
                          <p
                            style={{
                              fontSize: "11px",
                              color: "#94A3B8",
                              margin: 0,
                            }}
                          >
                            작성일:{" "}
                            {new Date(
                              booking.review.createdAt
                            ).toLocaleDateString(
                              "ko-KR",
                              {
                                timeZone: "Asia/Seoul",
                              }
                            )}
                          </p>
                        )}
                    </>
                  )}

                  <p
                    style={{
                      fontSize: "12px",
                      color: "#64748B",
                      lineHeight: 1.6,
                      margin: "12px 0 0",
                    }}
                  >
                    이 수업에 대한 리뷰가 등록되었습니다.
                    소중한 학습 경험을 공유해 주셔서
                    감사합니다.
                  </p>
                </div>
              )}

            {/* ======================
                수업 완료 후 리뷰 작성
                아직 리뷰가 없는 수업만 표시
                ====================== */}
            {canReview &&
              bookingId &&
              tutorId &&
              currentStudentId && (
                <details style={styles.reviewSection}>

                  <summary style={styles.reviewSummary}>
                    ⭐ 수업 리뷰 작성하기
                  </summary>

                  <div style={styles.reviewBody}>

                    <p
                      style={{
                        fontSize: "13px",
                        color: "#64748B",
                        lineHeight: 1.7,
                        margin: "0 0 16px",
                      }}
                    >
                      완료된 수업에 대한 경험을 남겨 주세요.
                      작성하신 리뷰는 다른 학습자들이
                      튜터를 선택하는 데 도움이 됩니다.
                    </p>

                    <ReviewForm
                      key={bookingId}
                      bookingId={bookingId}
                      tutorId={tutorId}
                      studentId={currentStudentId}
                      onReviewSubmitted={() =>
                        fetchBookings()
                      }
                    />

                  </div>

                </details>
              )}

            {/* ======================
                예약 취소 버튼
                대기 및 확정 상태만 표시
                ====================== */}
            {canCancel && (
              <div style={styles.bookingActions}>

                <button
                  type="button"
                  onClick={() =>
                    cancelBooking(bookingId)
                  }
                  disabled={
                    !bookingId || cancelingId !== null
                  }
                  style={{
                    ...styles.cancelButton,
                    opacity:
                      cancelingId !== null ? 0.6 : 1,
                    cursor:
                      cancelingId !== null
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  {cancelingId === bookingId
                    ? "취소 처리 중..."
                    : "예약 취소"}
                </button>

              </div>
            )}

          </article>
        );
      })}

    </div>
  );
}

// ======================
// ROKMUN 디자인 스타일
// ======================
const styles = {
  stateBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "16px 12px 20px",
  },

  emptyIcon: {
    width: "58px",
    height: "58px",
    borderRadius: "50%",
    backgroundColor: "#EEF5FD",
    color: "#6597CB",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "13px",
  },

  emptyTitle: {
    fontSize: "17px",
    fontWeight: 700,
    color: "#15365C",
    margin: "0 0 7px",
    lineHeight: 1.5,
    wordBreak: "keep-all",
  },

  emptyDescription: {
    fontSize: "13px",
    color: "#64748B",
    lineHeight: 1.7,
    margin: 0,
    wordBreak: "keep-all",
  },

  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "9px",
    backgroundColor: "#0077CC",
    color: "#FFFFFF",
    padding: "10px 19px",
    borderRadius: "9px",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: 700,
    marginTop: "17px",
    boxShadow: "0 3px 10px rgba(0,119,204,0.14)",
  },

  errorBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    padding: "20px",
    borderRadius: "12px",
    backgroundColor: "#FFF7F7",
    border: "1px solid #FECACA",
  },

  errorText: {
    color: "#B91C1C",
    fontSize: "14px",
    margin: "10px 0",
  },

  retryButton: {
    border: "1px solid #CBD5E1",
    borderRadius: "8px",
    backgroundColor: "#FFFFFF",
    color: "#475569",
    padding: "8px 16px",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
  },

  bookingList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  listSummary: {
    fontSize: "13px",
    color: "#64748B",
  },

  count: {
    color: "#0077CC",
    fontWeight: 800,
  },

  bookingCard: {
    backgroundColor: "#FFFFFF",
    border: "1px solid #E4EBF3",
    borderRadius: "14px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(15,40,75,0.04)",
  },

  bookingHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
    marginBottom: "18px",
  },

  tutorProfile: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  tutorAvatar: {
    width: "50px",
    height: "50px",
    backgroundColor: "#EAF4FF",
    color: "#0077CC",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  tutorName: {
    fontSize: "16px",
    fontWeight: 800,
    color: "#15365C",
    margin: "0 0 3px",
  },

  tutorLabel: {
    fontSize: "12px",
    color: "#64748B",
    margin: 0,
  },

  bookingBadge: {
    borderRadius: "20px",
    padding: "5px 12px",
    fontSize: "11px",
    fontWeight: 700,
  },

  bookingDetails: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(min(100%, 180px), 1fr))",
    gap: "12px",
    backgroundColor: "#F6F9FD",
    borderRadius: "10px",
    padding: "16px",
  },

  detailItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  detailIcon: {
    width: "22px",
    height: "22px",
    color: "#0077CC",
    flexShrink: 0,
  },

  detailLabel: {
    fontSize: "11px",
    color: "#64748B",
    margin: "0 0 3px",
  },

  detailValue: {
    fontSize: "14px",
    fontWeight: 700,
    color: "#15365C",
    margin: 0,
  },

  // ======================
  // 예약 상태 안내 스타일
  // ======================
  statusNotice: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    marginTop: "14px",
    padding: "12px 14px",
    borderRadius: "9px",
    borderWidth: "1px",
    borderStyle: "solid",
    fontSize: "13px",
    fontWeight: 600,
    lineHeight: 1.6,
  },

  notesBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    marginTop: "16px",
    padding: "12px",
    backgroundColor: "#F8FAFC",
    borderRadius: "9px",
  },

  notesTitle: {
    fontSize: "12px",
    color: "#475569",
  },

  notesText: {
    fontSize: "13px",
    color: "#64748B",
    margin: "5px 0 0",
    overflowWrap: "anywhere",
  },

  reviewSection: {
    marginTop: "16px",
    border: "1px solid #E4EBF3",
    borderRadius: "9px",
    overflow: "hidden",
  },

  reviewSummary: {
    padding: "12px 15px",
    color: "#0077CC",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
    backgroundColor: "#F8FBFF",
  },

  reviewBody: {
    padding: "16px",
  },

  bookingActions: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "16px",
  },

  cancelButton: {
    backgroundColor: "#FFFFFF",
    color: "#DC2626",
    border: "1px solid #FECACA",
    borderRadius: "8px",
    padding: "8px 15px",
    fontSize: "12px",
    fontWeight: 600,
  },
};

export default StudentBookingList;