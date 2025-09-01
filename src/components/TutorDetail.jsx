import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

// 로컬 fallback 데이터 (문자열 ID 기준)
const tutorsFallback = [
  {
    id: "66bca24e6f6e3b1f44a9a111",
    name: "장준영 1",
    experience: 4,
    description: "한국어 교육 전문가입니다.",
    img: "https://tinyurl.com/lego1",
    email: "sample1@test.com",
    specialty: "TOPIK 대비",
    language: "한국어, 영어",
    price: 30000,
    bio: "한국어 교육 전문가입니다.",
    videoUrl: "",
  },
  {
    id: "66bca24e6f6e3b1f44a9a222",
    name: "장준영 2",
    experience: 5,
    description: "다양한 레벨의 학생들을 지도해 왔습니다.",
    img: "https://tinyurl.com/lego2",
    email: "sample2@test.com",
    specialty: "비즈니스 한국어",
    language: "한국어, 일본어",
    price: 35000,
    bio: "다양한 레벨의 학생들을 지도해 왔습니다.",
    videoUrl: "",
  },
  {
    id: "66bca24e6f6e3b1f44a9a333",
    name: "장준영 3",
    experience: 6,
    description: "맞춤형 수업을 제공합니다.",
    img: "https://tinyurl.com/lego3",
    email: "sample3@test.com",
    specialty: "회화 중심",
    language: "한국어, 중국어",
    price: 28000,
    bio: "맞춤형 수업을 제공합니다.",
    videoUrl: "",
  },
];

// 환경변수 또는 기본 API 주소
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL?.trim() || "https://koreantutoring-backend.onrender.com";

function TutorDetail() {
  const { id } = useParams(); // URL에서 튜터 ID
  const [tutor, setTutor] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("유효하지 않은 튜터 ID입니다.");
      return;
    }

    const fetchTutor = async () => {
      try {
        // API 요청
        const res = await axios.get(`${API_BASE_URL}/api/tutors/${id}`, {
          withCredentials: true,
        });

        if (res.data) {
          // _id → id 변환 (MongoDB ObjectId인 경우)
          setTutor({ ...res.data, id: res.data._id || res.data.id });
        } else {
          // API에 데이터 없으면 로컬 fallback
          const localTutor = tutorsFallback.find((t) => t.id === id);
          if (localTutor) setTutor(localTutor);
          else setError("해당 튜터를 찾을 수 없습니다.");
        }
      } catch (err) {
        console.error("API 요청 실패:", err.message);
        // API 실패 시 로컬 fallback
        const localTutor = tutorsFallback.find((t) => t.id === id);
        if (localTutor) setTutor(localTutor);
        else setError("튜터 정보를 불러오는 데 실패했습니다.");
      }
    };

    fetchTutor();
  }, [id]);

  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
  if (!tutor) return <p style={{ textAlign: "center" }}>로딩 중...</p>;

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 20 }}>
      <h2 style={{ marginBottom: 20 }}>{tutor.name} 튜터 상세 정보</h2>

      <img
        src={tutor.img || ""}
        alt={`${tutor.name || "튜터"} 프로필`}
        style={{
          width: 150,
          height: 150,
          borderRadius: "50%",
          objectFit: "cover",
          marginBottom: 15,
        }}
      />

      <p><strong>이메일:</strong> {tutor.email || "정보 없음"}</p>
      <p><strong>소개:</strong> {tutor.bio || tutor.description || "소개 없음"}</p>
      <p><strong>수업 가격:</strong> {tutor.price ? `${tutor.price}원` : "가격 정보 없음"}</p>
      <p><strong>전문 분야:</strong> {tutor.specialty || "정보 없음"}</p>
      <p><strong>사용 언어:</strong> {tutor.language || "정보 없음"}</p>

      {tutor.videoUrl && (
        <div style={{ marginTop: 20 }}>
          <h4>소개 영상</h4>
          <video src={`${API_BASE_URL}${tutor.videoUrl}`} controls width="400">
            지원하지 않는 브라우저입니다.
          </video>
        </div>
      )}
    </div>
  );
}

export default TutorDetail;