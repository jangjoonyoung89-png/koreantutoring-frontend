import React, {
  useEffect,
  useState,
  useCallback,
} from "react";

import {
  ChatBubbleLeftRightIcon,
  StarIcon,
  UserCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

import {
  StarIcon as SolidStarIcon,
} from "@heroicons/react/24/solid";

const API_URL = (
  process.env.REACT_APP_API_URL ||
  "https://api.rokmun.com"
).trim().replace(/\/+$/, "");

function MyReviewList({ studentId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ======================
  // 내가 작성한 리뷰 조회
  // ======================
  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError("");
    setReviews([]);

    if (!studentId) {
      setError("학습자 정보를 확인할 수 없습니다.");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("로그인이 필요합니다.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/api/reviews/student/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(
          data.detail ||
            data.message ||
            data.error ||
            "리뷰를 불러오지 못했습니다."
        );
        return;
      }

      if (!Array.isArray(data)) {
        setError("리뷰 데이터 형식이 올바르지 않습니다.");
        return;
      }

      setReviews(data);

    } catch (err) {
      console.error("리뷰 조회 오류:", err);
      setError("서버와 연결할 수 없습니다.");

    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // ======================
  // 리뷰 작성 날짜 표시
  // ======================
  const formatDate = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // ======================
  // 로딩 화면
  // ======================
  if (loading) {
    return (
      <div style={styles.stateBox}>
        <div style={styles.emptyIcon}>
          <ChatBubbleLeftRightIcon
            style={{ width: 28, height: 28 }}
          />
        </div>

        <p style={styles.emptyTitle}>
          리뷰를 불러오는 중입니다.
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

        <p style={styles.errorText}>
          {error}
        </p>

        <button
          type="button"
          onClick={fetchReviews}
          style={styles.retryButton}
        >
          다시 시도
        </button>
      </div>
    );
  }

  // ======================
  // 리뷰가 없는 경우
  // ======================
  if (reviews.length === 0) {
    return (
      <div style={styles.stateBox}>
        <div style={styles.emptyIcon}>
          <ChatBubbleLeftRightIcon
            style={{ width: 30, height: 30 }}
          />
        </div>

        <h3 style={styles.emptyTitle}>
          아직 작성한 리뷰가 없습니다
        </h3>

        <p style={styles.emptyDescription}>
          수업을 마친 후 나만의 학습 경험을
          공유해 보세요.
        </p>
      </div>
    );
  }

  // ======================
  // 실제 리뷰 목록
  // ======================
  return (
    <div style={styles.reviewList}>
      <div style={styles.listSummary}>
        총{" "}
        <strong style={styles.count}>
          {reviews.length}
        </strong>
        개의 리뷰
      </div>

      {reviews.map((review) => {
        const tutorName =
          review.tutor?.full_name ||
          review.tutor?.name ||
          "튜터 정보 없음";

        const rating = Number(review.rating);

        const validRating =
          Number.isFinite(rating) &&
          rating >= 1 &&
          rating <= 5;

        const reviewDate = formatDate(
          review.createdAt
        );

        return (
          <article
            key={review._id || review.id}
            style={styles.reviewCard}
          >
            {/* 튜터 정보 */}
            <div style={styles.reviewHeader}>
              <div style={styles.tutorProfile}>
                <div style={styles.tutorAvatar}>
                  <UserCircleIcon
                    style={{
                      width: 32,
                      height: 32,
                    }}
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

              {reviewDate && (
                <span style={styles.reviewDate}>
                  {reviewDate}
                </span>
              )}
            </div>

            {/* 별점 */}
            {validRating && (
              <div style={styles.ratingBox}>
                <div
                  style={styles.stars}
                  role="img"
                  aria-label={`5점 만점에 ${rating}점`}
                >
                  {[1, 2, 3, 4, 5].map((star) =>
                    star <= rating ? (
                      <SolidStarIcon
                        key={star}
                        style={styles.filledStar}
                        aria-hidden="true"
                      />
                    ) : (
                      <StarIcon
                        key={star}
                        style={styles.emptyStar}
                        aria-hidden="true"
                      />
                    )
                  )}
                </div>

                <span style={styles.ratingNumber}>
                  {rating.toFixed(1)}
                </span>

                <span style={styles.ratingTotal}>
                  / 5.0
                </span>
              </div>
            )}

            {/* 리뷰 내용 */}
            <div style={styles.commentBox}>
              <ChatBubbleLeftRightIcon
                style={styles.commentIcon}
              />

              <div style={styles.commentContent}>
                <p style={styles.commentLabel}>
                  나의 수업 후기
                </p>

                <p style={styles.commentText}>
                  {review.comment ||
                    "작성된 후기 내용이 없습니다."}
                </p>
              </div>
            </div>
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

  reviewList: {
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

  reviewCard: {
    backgroundColor: "#FFFFFF",
    border: "1px solid #E4EBF3",
    borderRadius: "14px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(15,40,75,0.04)",
  },

  reviewHeader: {
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

  reviewDate: {
    fontSize: "12px",
    color: "#94A3B8",
  },

  ratingBox: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    marginBottom: "16px",
  },

  stars: {
    display: "flex",
    alignItems: "center",
    gap: "3px",
  },

  filledStar: {
    width: "21px",
    height: "21px",
    color: "#F5B301",
  },

  emptyStar: {
    width: "21px",
    height: "21px",
    color: "#CBD5E1",
  },

  ratingNumber: {
    fontSize: "16px",
    fontWeight: 800,
    color: "#15365C",
    marginLeft: "5px",
  },

  ratingTotal: {
    fontSize: "12px",
    color: "#94A3B8",
  },

  commentBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    backgroundColor: "#F6F9FD",
    borderRadius: "10px",
    padding: "16px",
  },

  commentIcon: {
    width: "22px",
    height: "22px",
    color: "#6597CB",
    flexShrink: 0,
    marginTop: "2px",
  },

  commentContent: {
    flex: 1,
    minWidth: 0,
  },

  commentLabel: {
    fontSize: "12px",
    fontWeight: 700,
    color: "#64748B",
    margin: "0 0 7px",
  },

  commentText: {
    fontSize: "14px",
    color: "#334155",
    lineHeight: 1.8,
    margin: 0,
    whiteSpace: "pre-wrap",
    overflowWrap: "anywhere",
  },
};

export default MyReviewList;