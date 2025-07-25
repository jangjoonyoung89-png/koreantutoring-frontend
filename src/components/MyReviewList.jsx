import React, { useEffect, useState } from "react";

function MyReviewList({ studentId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`http://localhost:8000/reviews/student/${studentId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "리뷰를 불러오지 못했습니다.");
        } else {
          setReviews(data);
        }
      } catch (err) {
        setError("서버 연결 실패");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [studentId]);

  return (
    <div>
      <h3>내가 작성한 리뷰</h3>
      {loading && <p>불러오는 중...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && reviews.length === 0 && <p>작성한 리뷰가 없습니다.</p>}

      <ul>
        {reviews.map((review) => (
          <li key={review._id} style={{ marginBottom: "1em" }}>
            <strong>튜터:</strong> {review.tutor?.name || "알 수 없음"} <br />
            <strong>별점:</strong> {review.rating} <br />
            <strong>내용:</strong> {review.comment}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyReviewList;