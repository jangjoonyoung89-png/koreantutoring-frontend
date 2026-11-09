import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

// =============================
// ✅ 로컬 fallback 데이터
// =============================
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

// =============================
// ✅ API 기본 설정
// =============================
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL?.trim() || "https://api.rokmun.com";

function TutorDetail() {
  const { id } = useParams();
  const [tutor, setTutor] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("유효하지 않은 튜터 ID입니다.");
      return;
    }

    const fetchTutor = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/tutors/${id}`, {
          withCredentials: true,
        });
        if (res.data) {
          setTutor({ ...res.data, id: res.data._id || res.data.id });
        } else {
          const localTutor = tutorsFallback.find((t) => t.id === id);
          if (localTutor) setTutor(localTutor);
          else setError("해당 튜터를 찾을 수 없습니다.");
        }
      } catch (err) {
        console.warn("API 요청 실패 → fallback 데이터 사용", err.message);
        const localTutor = tutorsFallback.find((t) => t.id === id);
        if (localTutor) setTutor(localTutor);
        else setError("튜터 정보를 불러오는 데 실패했습니다.");
      }
    };

    fetchTutor();
  }, [id]);

  if (error)
    return <p style={{ color: "red", textAlign: "center", marginTop: 50 }}>{error}</p>;
  if (!tutor)
    return <p style={{ textAlign: "center", marginTop: 50 }}>로딩 중...</p>;

  // =============================
  // ✅ UI 렌더링
  // =============================
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        maxWidth: "1100px",
        margin: "40px auto",
        gap: "30px",
        padding: "20px",
        fontFamily: "Pretendard, sans-serif",
      }}
    >
      {/* -----------------------------
          ✅ Left Panel: 프로필 카드
      --------------------------------*/}
      <div
        style={{
          flex: "1 1 350px",
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
          padding: "30px 25px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <img
          src={tutor.img}
          alt={`${tutor.name} 프로필`}
          style={{
            width: 180,
            height: 180,
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: 20,
            boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
          }}
        />
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 5 }}>
          {tutor.name}
        </h2>
        <p style={{ color: "#666", marginBottom: 15 }}>
          {tutor.specialty || "전문 분야 없음"}
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            marginTop: 10,
            fontSize: "0.95rem",
          }}
        >
          <p>
            <strong>언어:</strong> {tutor.language || "정보 없음"}
          </p>
          <p>
            <strong>경력:</strong> {tutor.experience
              ? `${tutor.experience}년`
              : "정보 없음"}
          </p>
          <p>
            <strong>이메일:</strong> {tutor.email || "비공개"}
          </p>
        </div>

        <div
          style={{
            marginTop: 25,
            background: "#f9f9f9",
            padding: "15px 20px",
            borderRadius: "12px",
            width: "100%",
          }}
        >
          <p style={{ marginBottom: 8, fontWeight: 600 }}>💰 수업 가격</p>
          <h3 style={{ fontSize: "1.2rem", color: "#333" }}>
            {tutor.price ? `${tutor.price.toLocaleString()}원 / 시간` : "가격 정보 없음"}
          </h3>
        </div>

        <button
          style={{
            marginTop: 25,
            background: "#4f46e5",
            color: "white",
            border: "none",
            borderRadius: "12px",
            padding: "12px 18px",
            width: "100%",
            fontSize: "1rem",
            cursor: "pointer",
            transition: "0.2s",
          }}
          onClick={() => alert("예약 페이지로 이동 예정입니다.")}
          onMouseOver={(e) => (e.target.style.background = "#4338ca")}
          onMouseOut={(e) => (e.target.style.background = "#4f46e5")}
        >
          수업 예약하기
        </button>
      </div>

      {/* -----------------------------
          ✅ Right Panel: 상세 정보 + 영상
      --------------------------------*/}
      <div
        style={{
          flex: "2 1 600px",
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
          padding: "30px 40px",
          lineHeight: 1.7,
        }}
      >
        <h2 style={{ marginBottom: 20, fontWeight: 700 }}>튜터 소개</h2>
        <p style={{ whiteSpace: "pre-line", color: "#333" }}>
          {tutor.bio || tutor.description || "튜터 소개가 없습니다."}
        </p>

        {tutor.videoUrl && (
          <div style={{ marginTop: 30 }}>
            <h3 style={{ fontWeight: 600, marginBottom: 10 }}>🎬 소개 영상</h3>
            <video
              src={
                tutor.videoUrl.startsWith("http")
                  ? tutor.videoUrl
                  : `${API_BASE_URL}${tutor.videoUrl}`
              }
              controls
              width="100%"
              style={{
                borderRadius: "12px",
                boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
              }}
            >
              지원하지 않는 브라우저입니다.
            </video>
          </div>
        )}

        <div
          style={{
            marginTop: 40,
            borderTop: "1px solid #eee",
            paddingTop: 20,
          }}
        >
          <h3 style={{ fontWeight: 600, marginBottom: 10 }}>🗓️ 수업 가능 시간</h3>
          <p style={{ color: "#666" }}>튜터가 등록한 예약 가능한 시간대가 여기에 표시됩니다.</p>
        </div>
      </div>
    </div>
  );
}

export default TutorDetail;