import React, {
  useState,
  useContext,
} from "react";

import { AuthContext } from "../context/AuthContext";

// ======================
// ROKMUN API 기본 주소
// ======================
const API_URL = (
  process.env.NODE_ENV === "production"
    ? "https://api.rokmun.com"
    : process.env.REACT_APP_API_URL ||
      "https://api.rokmun.com"
).trim().replace(/\/+$/, "");

// ======================
// ROKMUN 수업 리뷰 작성
// ======================
function ReviewForm({
  bookingId,
  tutorId,
  studentId,
  onReviewSubmitted,
}) {
  const { user, token } =
    useContext(AuthContext);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] =
    useState(false);
  const [submitted, setSubmitted] =
    useState(false);

  const MAX_COMMENT_LENGTH = 1000;

  const currentStudentId =
    user?.id || user?._id || studentId;

  // ======================
  // 리뷰 등록
  // ======================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting || submitted) return;

    setError("");
    setSuccess("");

    // 1. 로그인 확인
    if (!token || !user) {
      setError(
        "로그인 후 리뷰를 작성해 주세요."
      );
      return;
    }

    // 2. 학습자 권한 확인
    if (user.role !== "student") {
      setError(
        "학습자만 리뷰를 작성할 수 있습니다."
      );
      return;
    }

    // 3. 예약 정보 확인
    if (
      !bookingId ||
      !tutorId ||
      !currentStudentId
    ) {
      setError(
        "수업 예약 정보를 확인할 수 없습니다."
      );
      return;
    }

    // 4. 별점 확인
    if (
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      setError(
        "별점을 1점부터 5점까지 선택해 주세요."
      );
      return;
    }

    // 5. 리뷰 내용 확인
    const trimmedComment = comment.trim();

    if (!trimmedComment) {
      setError(
        "리뷰 내용을 입력해 주세요."
      );
      return;
    }

    if (
      trimmedComment.length >
      MAX_COMMENT_LENGTH
    ) {
      setError(
        "리뷰는 1,000자 이내로 작성해 주세요."
      );
      return;
    }

    setSubmitting(true);

    try {
      // 6. ROKMUN 서버에 리뷰 전송
      const res = await fetch(
        `${API_URL}/api/reviews`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            bookingId,
            tutorId,
            rating,
            comment: trimmedComment,
          }),
        }
      );

      const data = await res
        .json()
        .catch(() => ({}));

      // 7. 서버 오류 처리
      if (!res.ok) {
        setError(
          data.message ||
            data.detail ||
            data.error ||
            "리뷰 등록에 실패했습니다."
        );
        return;
      }

      // 8. 리뷰 등록 성공
      setSuccess(
        "수업 리뷰가 성공적으로 등록되었습니다."
      );

      setSubmitted(true);
      setComment("");
      setRating(5);

      // 기존 리뷰 등록 완료 콜백 유지
      if (
        typeof onReviewSubmitted ===
        "function"
      ) {
        try {
          onReviewSubmitted(data.review);
        } catch (callbackError) {
          console.error(
            "리뷰 등록 후 화면 갱신 오류:",
            callbackError
          );
        }
      }

    } catch (err) {
      console.error(
        "리뷰 등록 오류:",
        err
      );

      setError(
        "서버와 연결할 수 없습니다. 잠시 후 다시 시도해 주세요."
      );

    } finally {
      setSubmitting(false);
    }
  };

  // ======================
  // 리뷰 등록 완료 화면
  // ======================
  if (submitted) {
    return (
      <div style={styles.successBox}>
        <div style={styles.successIcon}>
          ✓
        </div>

        <h3 style={styles.successTitle}>
          리뷰 등록 완료
        </h3>

        <p style={styles.successText}>
          {success}
        </p>

        <p style={styles.successDescription}>
          소중한 수업 경험을 공유해 주셔서
          감사합니다.
        </p>
      </div>
    );
  }

  // ======================
  // 리뷰 작성 화면
  // ======================
  return (
    <div style={styles.container}>

      <div style={styles.header}>
        <h3 style={styles.title}>
          수업 리뷰 작성
        </h3>

        <p style={styles.description}>
          수업은 어떠셨나요?
          수업에서 배운 내용과 경험을
          공유해 주세요.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          style={styles.errorBox}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        {/* ======================
            별점 선택
            ====================== */}
        <div style={styles.ratingBox}>

          <p style={styles.label}>
            수업 만족도
          </p>

          <div
            style={styles.starRow}
            role="group"
            aria-label="수업 만족도 별점"
          >
            {[1, 2, 3, 4, 5].map(
              (score) => (
                <button
                  key={score}
                  type="button"
                  disabled={submitting}
                  aria-label={`${score}점`}
                  aria-pressed={
                    rating === score
                  }
                  onClick={() =>
                    setRating(score)
                  }
                  style={{
                    ...styles.starButton,

                    color:
                      score <= rating
                        ? "#F5B301"
                        : "#CBD5E1",

                    cursor: submitting
                      ? "not-allowed"
                      : "pointer",
                  }}
                >
                  ★
                </button>
              )
            )}
          </div>

          <div style={styles.ratingValue}>
            {rating}점 / 5점
          </div>

          <p style={styles.ratingDescription}>
            {
              {
                1: "아쉬웠어요",
                2: "조금 아쉬웠어요",
                3: "보통이에요",
                4: "만족스러웠어요",
                5: "매우 만족스러웠어요",
              }[rating]
            }
          </p>

        </div>

        {/* ======================
            리뷰 내용
            ====================== */}
        <div style={styles.commentSection}>

          <label
            htmlFor={`review-${bookingId}`}
            style={styles.label}
          >
            수업 후기
          </label>

          <textarea
            id={`review-${bookingId}`}
            value={comment}
            onChange={(e) =>
              setComment(e.target.value)
            }
            rows={5}
            maxLength={MAX_COMMENT_LENGTH}
            disabled={submitting}
            placeholder={
              "수업에서 배운 내용이나 좋았던 점을 작성해 주세요."
            }
            style={styles.textarea}
          />

          <div style={styles.characterCount}>
            {comment.length} /{" "}
            {MAX_COMMENT_LENGTH}자
          </div>

        </div>

        {/* ======================
            리뷰 작성 안내
            ====================== */}
        <div style={styles.noticeBox}>
          완료된 수업에 대한 리뷰만
          작성할 수 있습니다.
          리뷰는 수업당 한 번 등록할 수
          있습니다.
        </div>

        {/* ======================
            리뷰 등록 버튼
            ====================== */}
        <button
          type="submit"
          disabled={
            submitting ||
            submitted ||
            !comment.trim() ||
            !bookingId ||
            !token ||
            user?.role !== "student"
          }
          style={{
            ...styles.submitButton,

            opacity:
              submitting ||
              !comment.trim() ||
              !bookingId ||
              !token ||
              user?.role !== "student"
                ? 0.6
                : 1,

            cursor:
              submitting ||
              !comment.trim() ||
              !bookingId ||
              !token ||
              user?.role !== "student"
                ? "not-allowed"
                : "pointer",
          }}
        >
          {submitting
            ? "리뷰 등록 중..."
            : "리뷰 등록하기"}
        </button>

      </form>
    </div>
  );
}

// ======================
// ROKMUN 디자인 스타일
// ======================
const styles = {
  container: {
    width: "100%",
    maxWidth: "560px",
    margin: "0 auto",
    boxSizing: "border-box",
  },

  header: {
    marginBottom: "20px",
  },

  title: {
    fontSize: "18px",
    fontWeight: 800,
    color: "#15365C",
    margin: "0 0 7px",
  },

  description: {
    fontSize: "13px",
    color: "#64748B",
    lineHeight: 1.7,
    margin: 0,
    wordBreak: "keep-all",
  },

  ratingBox: {
    backgroundColor: "#F6F9FD",
    border: "1px solid #E4EBF3",
    borderRadius: "12px",
    padding: "20px 12px",
    textAlign: "center",
    marginBottom: "20px",
  },

  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: 700,
    color: "#15365C",
    margin: "0 0 10px",
  },

  starRow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "5px",
    margin: "8px 0",
  },

  starButton: {
    border: "none",
    backgroundColor: "transparent",
    fontSize: "36px",
    lineHeight: 1.2,
    padding: "2px",
    transition: "color 0.15s ease",
  },

  ratingValue: {
    color: "#15365C",
    fontSize: "17px",
    fontWeight: 800,
    marginTop: "8px",
  },

  ratingDescription: {
    color: "#64748B",
    fontSize: "12px",
    margin: "5px 0 0",
  },

  commentSection: {
    marginBottom: "16px",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px",
    border: "1px solid #CBD5E1",
    borderRadius: "9px",
    fontSize: "14px",
    fontFamily: "inherit",
    color: "#15365C",
    lineHeight: 1.7,
    resize: "vertical",
    minHeight: "110px",
    backgroundColor: "#FFFFFF",
  },

  characterCount: {
    fontSize: "11px",
    color: "#94A3B8",
    textAlign: "right",
    marginTop: "6px",
  },

  noticeBox: {
    backgroundColor: "#F0F7FF",
    border: "1px solid #DBEAFE",
    color: "#475569",
    borderRadius: "8px",
    padding: "12px",
    fontSize: "12px",
    lineHeight: 1.7,
    marginBottom: "16px",
    wordBreak: "keep-all",
  },

  submitButton: {
    width: "100%",
    backgroundColor: "#0077CC",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "9px",
    padding: "13px",
    fontSize: "14px",
    fontWeight: 700,
    boxShadow:
      "0 3px 10px rgba(0,119,204,0.14)",
  },

  errorBox: {
    backgroundColor: "#FEF2F2",
    border: "1px solid #FECACA",
    color: "#B91C1C",
    borderRadius: "8px",
    padding: "12px",
    fontSize: "13px",
    lineHeight: 1.6,
    marginBottom: "16px",
  },

  successBox: {
    backgroundColor: "#F0FDF4",
    border: "1px solid #BBF7D0",
    borderRadius: "12px",
    padding: "24px 16px",
    textAlign: "center",
  },

  successIcon: {
    width: "48px",
    height: "48px",
    backgroundColor: "#DCFCE7",
    color: "#15803D",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "26px",
    fontWeight: 800,
    margin: "0 auto 12px",
  },

  successTitle: {
    color: "#15803D",
    fontSize: "18px",
    fontWeight: 800,
    margin: "0 0 8px",
  },

  successText: {
    color: "#166534",
    fontSize: "13px",
    lineHeight: 1.6,
    margin: "0 0 6px",
  },

  successDescription: {
    color: "#64748B",
    fontSize: "12px",
    lineHeight: 1.6,
    margin: 0,
  },
};

export default ReviewForm;