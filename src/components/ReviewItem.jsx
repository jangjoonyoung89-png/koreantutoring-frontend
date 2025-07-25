import React, { useState } from "react";

function ReviewItem({ review, onUpdated, onDeleted }) {
  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comment);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!rating || !comment) {
      setError("평점과 코멘트를 입력하세요.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/api/reviews/${review._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "수정 실패");
        return;
      }

      setIsEditing(false);
      onUpdated(data.review);
    } catch (err) {
      setError("서버 오류가 발생했습니다.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("정말 이 리뷰를 삭제하시겠습니까?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/api/reviews/${review._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        alert("삭제 실패");
        return;
      }

      onDeleted(review._id); 
    } catch (err) {
      console.error("리뷰 삭제 오류:", err);
      alert("서버 오류로 삭제에 실패했습니다.");
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
      {isEditing ? (
        <>
          <label>
            평점:
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            />
          </label>
          <br />
          <label>
            코멘트:
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </label>
          <br />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button onClick={handleSave}>저장</button>
          <button onClick={() => setIsEditing(false)}>취소</button>
        </>
      ) : (
        <>
          <p>평점: {review.rating}</p>
          <p>코멘트: {review.comment}</p>
          <button onClick={() => setIsEditing(true)}>수정</button>
          <button onClick={handleDelete} style={{ marginLeft: 8, color: "red" }}>
            삭제
          </button>
        </>
      )}
    </div>
  );
}

export default ReviewItem;