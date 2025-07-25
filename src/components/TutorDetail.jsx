import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function TutorDetail() {
  const { id } = useParams();
  console.log("튜터 ID:", id);  

  const [tutor, setTutor] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("유효하지 않은 튜터 ID입니다.");
      return;
    }

    axios
      .get(`/api/tutors/${id}`)
      .then((res) => setTutor(res.data))
      .catch((err) => {
        console.error(err);
        setError("튜터 정보를 불러오는 데 실패했습니다.");
      });
  }, [id]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!tutor) return <p>로딩 중...</p>;

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h2>{tutor.full_name || tutor.name} 튜터 상세 정보</h2>
      <p><strong>이메일:</strong> {tutor.email}</p>
      <p><strong>소개:</strong> {tutor.bio || "소개 없음"}</p>
      <p><strong>수업 가격:</strong> {tutor.price}원</p>
      <p><strong>전문 분야:</strong> {tutor.specialty || "정보 없음"}</p>
      <p><strong>사용 언어:</strong> {tutor.language || "정보 없음"}</p>

      {tutor.videoUrl && (
        <div style={{ marginTop: 20 }}>
          <h4>소개 영상</h4>
          <video src={`http://localhost:8000${tutor.videoUrl}`} controls width="400" />
        </div>
      )}
    </div>
  );
}

export default TutorDetail;