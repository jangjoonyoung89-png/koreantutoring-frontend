import React, { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ReviewWritePage() {
  const { bookingId } = useParams();
  const { user } = useContext(AuthContext);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:8000/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bookingId,
        studentId: user.id,
        tutorId: "", 
        rating,
        comment,
      }),
    });

    if (res.ok) {
      alert("리뷰가 등록되었습니다.");
      navigate("/student/dashboard");
    } else {
      alert("리뷰 등록 실패");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: "20px auto" }}>
      <h2>리뷰 작성</h2>
      <label>
        평점:
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          {[5,4,3,2,1].map((num) => (
            <option key={num} value={num}>{num}점</option>
          ))}
        </select>
      </label>
      <br />
      <label>
        코멘트:
        <textarea
          required
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={5}
          style={{ width: "100%" }}
        />
      </label>
      <br />
      <button type="submit">리뷰 제출</button>
    </form>
  );
}