import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { renderStars } from "../utils/renderStars";
import TutorVideoUpload from "./TutorVideoUpload";

// 샘플 데이터 (MongoDB ObjectId 형식)
const sampleTutors = [
  {
    _id: "66bca24e6f6e3b1f44a9a111",
    name: "장준영",
    email: "sample1@test.com",
    experience: 4,
    bio: "한국어 교육 전문가입니다.",
    specialty: "TOPIK 대비",
    language: "한국어, 영어",
    price: 30000,
    img: "https://tinyurl.com/lego1",
  },
  {
    _id: "66bca24e6f6e3b1f44a9a222",
    name: "장서은",
    email: "sample2@test.com",
    experience: 5,
    bio: "다양한 레벨의 학생들을 지도해 왔습니다.",
    specialty: "비즈니스 한국어",
    language: "한국어, 일본어",
    price: 35000,
    img: "https://tinyurl.com/lego2",
  },
  {
    _id: "66bca24e6f6e3b1f44a9a333",
    name: "김수영",
    email: "sample3@test.com",
    experience: 6,
    bio: "맞춤형 수업을 제공합니다.",
    specialty: "회화 중심",
    language: "한국어, 중국어",
    price: 28000,
    img: "https://tinyurl.com/lego3",
  },
];

function TutorProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tutor, setTutor] = useState(null);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [reviewCount, setReviewCount] = useState(0);

  const API_BASE_URL =
    process.env.REACT_APP_API_URL || "https://api.rokmun.com";

  async function fetchData(url) {
    const res = await fetch(url, {
      credentials: "include",
      headers: { "Cache-Control": "no-store" },
    });
    if (!res.ok) throw new Error("API 요청 실패");
    return res.json();
  }

  // ======================
  // 튜터 정보 불러오기
  // ======================
  useEffect(() => {
    async function fetchTutor() {
      try {
        const data = await fetchData(`${API_BASE_URL}/api/tutors/${id}`);
        setTutor(data);
        setError("");
      } catch (err) {
        console.warn("API 실패 → 샘플 데이터 사용");

        // 문자열 ID 비교만
        const sampleTutor = sampleTutors.find((t) => t._id === id);

        if (sampleTutor) {
          setTutor(sampleTutor);
          setError("");
        } else {
          setError("튜터 정보를 찾을 수 없습니다.");
        }
      }
    }
    if (id) fetchTutor();
  }, [id, API_BASE_URL]);

  // ======================
  // 리뷰 목록 불러오기
  // ======================
  useEffect(() => {
    async function fetchReviews() {
      try {
        const data = await fetchData(`${API_BASE_URL}/api/reviews/tutor/${id}`);
        setReviews(data);
      } catch (err) {
        console.error("리뷰 요청 실패:", err);
      }
    }
    if (id) fetchReviews();
  }, [id, API_BASE_URL]);

  // ======================
  // 평균 평점 불러오기
  // ======================
  useEffect(() => {
    async function fetchAverageRating() {
      try {
        const data = await fetchData(`${API_BASE_URL}/api/reviews/tutor/${id}/average`);
        setAverageRating(data.average);
        setReviewCount(data.count);
      } catch (err) {
        console.error("평점 요청 실패:", err);
      }
    }
    if (id) fetchAverageRating();
  }, [id, API_BASE_URL]);

  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
  if (!tutor) return <p style={{ textAlign: "center" }}>로딩 중...</p>;

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: 20 }}>
      <h2>{tutor.name} 튜터님 프로필</h2>

      <div style={{ background: "#f9f9f9", padding: 20, borderRadius: 10, boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
        {tutor.img && <img src={tutor.img} alt={tutor.name} style={{ width: 150, height: 150, borderRadius: "50%", objectFit: "cover", marginBottom: 20 }} />}
        <p><strong>이메일:</strong> {tutor.email}</p>
        <p><strong>소개:</strong> {tutor.bio || "튜터 소개가 없습니다."}</p>
        {tutor.specialty && <p><strong>전문 분야:</strong> {tutor.specialty}</p>}
        {tutor.language && <p><strong>수업 언어:</strong> {tutor.language}</p>}
        <p><strong>수업 요금:</strong> {tutor.price ? `${tutor.price}원/시간` : "문의 요망"}</p>
        <p><strong>평점:</strong> {averageRating !== null && reviewCount > 0 ? renderStars(averageRating) : "리뷰 없음"}</p>
        <p><strong>리뷰 개수:</strong> {reviewCount > 0 ? `${reviewCount}개 리뷰` : "아직 리뷰 없음"}</p>
      </div>

      <div style={{ marginTop: 20 }}>
        <button onClick={() => navigate(`/book/${id}`)} style={{ backgroundColor: "#007bff", color: "white", padding: "10px 20px", border: "none", borderRadius: 6, cursor: "pointer" }}>
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
              <li key={review._id} style={{ padding: "10px 0", borderBottom: "1px solid #ddd" }}>
                <p><strong>{review.student?.full_name || "익명"}</strong> ({review.rating}/5)</p>
                <p>{review.comment}</p>
              </li>
            ))}
          </ul>
        )}

        <div style={{ marginTop: 20 }}>
          <TutorVideoUpload
            tutorId={id}
            onUploadSuccess={(newVideoUrl) => setTutor((prev) => ({ ...prev, sampleVideoUrl: newVideoUrl }))}
          />
          {tutor.sampleVideoUrl && (
            <>
              <h3>📹 샘플 영상</h3>
              <video width="100%" controls>
                <source src={tutor.sampleVideoUrl.startsWith("http") ? tutor.sampleVideoUrl : `${API_BASE_URL}${tutor.sampleVideoUrl}`} type="video/mp4" />
                지원하지 않는 브라우저입니다.
              </video>
            </>
          )}
        </div>

        <button onClick={() => navigate(`/write-review?tutorId=${id}`)} style={{ marginTop: 10, background: "#28a745", color: "white", padding: "8px 14px", borderRadius: 5, border: "none", cursor: "pointer" }}>
          ✍️ 리뷰 작성하기
        </button>
      </div>
    </div>
  );
}

export default TutorProfilePage;