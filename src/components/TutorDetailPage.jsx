import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReviewList from "../components/ReviewListPage"; 

function TutorDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tutor, setTutor] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTutor() {
      try {
        const res = await fetch(`http://localhost:8000/api/tutors/${id}`);
        if (!res.ok) throw new Error("튜터 정보를 불러올 수 없습니다.");
        const data = await res.json();
        setTutor(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    }

    fetchTutor();
  }, [id]);

  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
  if (!tutor) return <p style={{ textAlign: "center" }}>로딩 중...</p>;

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 20 }}>
      <h2>{tutor.full_name} 튜터 소개</h2>
      <p><strong>이메일:</strong> {tutor.email}</p>
      <p><strong>전문 분야:</strong> {tutor.specialty || "일반 한국어"}</p>
      <p><strong>소개:</strong> {tutor.bio || "소개 정보 없음"}</p>

      {/* ✅ 평균 별점이 있을 경우 표시 */}
      {tutor.averageRating && (
        <p><strong>평균 별점:</strong> ⭐ {tutor.averageRating.toFixed(1)}</p>
      )}

      <button
        onClick={() => navigate(`/book/${tutor._id}`)}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        예약하기
      </button>

      {/* ✅ 리뷰 리스트 출력 */}
      <div style={{ marginTop: "40px" }}>
        <h3>학생 리뷰</h3>
        <ReviewList tutorId={tutor._id} />
      </div>
    </div>
  );
}

export default TutorDetailPage;