import React, { useState } from "react";


function ReviewForm({ tutorId, studentId, onReviewSubmitted }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError("리뷰 내용을 입력해주세요.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tutorId, studentId, rating, comment }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "리뷰 작성 실패");
        return;
      }

      setSuccess("리뷰가 등록되었습니다!");
      setComment("");
      setRating(5);
      setError("");
      if (onReviewSubmitted) onReviewSubmitted(data.review);
    } catch {
      setError("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "auto", padding: 20 }}>
      <h3>리뷰 작성</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <label>평점</label>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          {[5, 4, 3, 2, 1].map((score) => (
            <option key={score} value={score}>{score}점</option>
          ))}
        </select>

        <label style={{ display: "block", marginTop: 10 }}>리뷰 내용</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="4"
          style={{ width: "100%" }}
          placeholder="튜터에 대한 수업 후기를 남겨주세요"
        ></textarea>

        <button type="submit" style={{ marginTop: 10 }}>리뷰 등록</button>
      </form>
    </div>
  );
}

export default ReviewForm;