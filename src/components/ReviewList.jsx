import React, { useEffect, useState } from "react";
import { getReviews } from "../api";

function ReviewList({ tutorId }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    getReviews(tutorId).then(setReviews).catch(console.error);
  }, [tutorId]);

  if (!reviews.length) return <p>리뷰가 없습니다.</p>;

  return (
    <ul>
      {reviews.map(r => (
        <li key={r._id}>
          <strong>{r.studentName || "학생"}</strong>: {r.comment} (⭐ {r.rating})
        </li>
      ))}
    </ul>
  );
}

export default ReviewList;