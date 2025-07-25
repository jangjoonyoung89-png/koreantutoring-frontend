import React, { useEffect, useState } from "react";
import ReviewForm from "./ReviewForm";
import ReviewItem from "./ReviewItem";

function ReviewListPage({ tutorId, studentId }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const res = await fetch(`http://localhost:8000/api/reviews?tutorId=${tutorId}`);
      const data = await res.json();
      setReviews(data);
    };

    fetchReviews();
  }, [tutorId]);

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>리뷰 목록</h2>

      {/* ✅ 리뷰 작성 폼 */}
      <ReviewForm
        tutorId={tutorId}
        studentId={studentId}
        onReviewSubmitted={(newReview) => setReviews([...reviews, newReview])}
      />

      {/* ✅ 리뷰 목록 출력 */}
      {reviews.map((r) => (
        <ReviewItem
          key={r._id}
          review={r}
          onUpdated={(updated) => {
            setReviews(reviews.map((rev) => (rev._id === updated._id ? updated : rev)));
          }}
          onDeleted={(deletedId) => {
            setReviews(reviews.filter((rev) => rev._id !== deletedId));
          }}
        />
      ))}
    </div>
  );
}

export default ReviewListPage;