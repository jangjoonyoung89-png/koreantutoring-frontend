import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { renderStars } from "../utils/renderStars";
import TutorVideoUpload from "./TutorVideoUpload";

function TutorProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tutor, setTutor] = useState(null);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [reviewCount, setReviewCount] = useState(0);

  
  useEffect(() => {
    async function fetchTutor() {
      try {
        const res = await fetch(`http://localhost:8000/api/tutors/${id}`);
        if (!res.ok) throw new Error("튜터 정보를 불러올 수 없습니다.");
        const data = await res.json();
        setTutor(data);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchTutor();
  }, [id]);

  
  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch(`http://localhost:8000/api/reviews/tutor/${id}`);
        if (!res.ok) throw new Error("리뷰를 불러올 수 없습니다.");
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchReviews();
  }, [id]);

  
  useEffect(() => {
    async function fetchAverageRating() {
      try {
        const res = await fetch(`http://localhost:8000/api/reviews/tutor/${id}/average`);
        if (!res.ok) throw new Error("평점 정보를 불러올 수 없습니다.");
        const data = await res.json();
        setAverageRating(data.average);
        setReviewCount(data.count);
      } catch (err) {
        console.error("평점 불러오기 오류:", err);
      }
    }
    fetchAverageRating();
  }, [id]);

  if (error) {
    return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
  }

  if (!tutor) {
    return <p style={{ textAlign: "center" }}>로딩 중...</p>;
  }

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: 20 }}>
      <h2>{tutor.name} 튜터님 프로필</h2>

      <div
        style={{
          background: "#f9f9f9",
          padding: 20,
          borderRadius: 10,
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <p><strong>이메일:</strong> {tutor.email}</p>
        <p><strong>소개:</strong> {tutor.bio || "튜터 소개가 없습니다."}</p>
        {/* specialty, language 필드는 모델에 없으면 제거하세요 */}
        {tutor.specialty && <p><strong>전문 분야:</strong> {tutor.specialty}</p>}
        {tutor.language && <p><strong>수업 언어:</strong> {tutor.language}</p>}
        <p><strong>수업 요금:</strong> {tutor.price ? `${tutor.price}원/시간` : "문의 요망"}</p>
        <p>
          <strong>평점:</strong>{" "}
          {averageRating !== null && reviewCount > 0
            ? renderStars(averageRating)
            : "리뷰 없음"}
        </p>
        <p>
          <strong>평균 평점:</strong>{" "}
          {reviewCount > 0 ? `${reviewCount}개 리뷰` : "아직 리뷰 없음"}
        </p>
      </div>

      <div style={{ marginTop: 20 }}>
        <button
          onClick={() => navigate(`/book/${id}`)}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          📅 수업 예약하기
        </button>
      </div>

      <div style={{ marginTop: 40 }}>
        <h3>📝 리뷰</h3>
        {reviews.length === 0 ? (
          <p>아직 등록된 리뷰가 없습니다.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {reviews.map((review) => (
              <li
                key={review._id}
                style={{ padding: "10px 0", borderBottom: "1px solid #ddd" }}
              >
                <p><strong>{review.student?.full_name || "익명"}</strong> ({review.rating}/5)</p>
                <p>{review.comment}</p>
              </li>
            ))}
          </ul>
        )}

        {tutor.sampleVideoUrl && (
          <div style={{ marginTop: 20 }}>
            <TutorVideoUpload tutorId={id} />
            <h3>📹 샘플 영상</h3>
            <video width="100%" controls>
              <source src={`http://localhost:8000${tutor.sampleVideoUrl}`} type="video/mp4" />
              지원하지 않는 브라우저입니다.
            </video>
          </div>
        )}

        <button
          onClick={() => navigate(`/write-review?tutorId=${id}`)}
          style={{
            marginTop: 10,
            background: "#28a745",
            color: "white",
            padding: "8px 14px",
            borderRadius: 5,
            border: "none",
            cursor: "pointer",
          }}
        >
          ✍️ 리뷰 작성하기
        </button>
      </div>
    </div>
  );
}

export default TutorProfilePage;