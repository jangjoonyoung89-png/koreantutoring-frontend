import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api"; // 공통 axios 인스턴스

function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push("★");
  }
  if (halfStar) stars.push("☆");
  while (stars.length < 5) {
    stars.push("☆");
  }
  return stars.join("");
}

function TutorList() {
  const [tutorList, setTutorList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("튜터 목록 API 호출 시작...");

    api.get("/api/tutors/with-rating", {
      headers: { "Cache-Control": "no-store" },
      params: { t: Date.now() }, // 캐시 방지용 쿼리
    })
      .then((res) => {
        console.log("튜터 데이터 응답:", res.data);
        setTutorList(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("튜터 목록 요청 오류:", err);
        setError("튜터 목록을 불러오는 데 실패했습니다.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>튜터 목록</h2>
      {tutorList.length === 0 ? (
        <p>등록된 튜터가 없습니다.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tutorList.map((tutor) => (
            <li
              key={tutor._id}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 12,
                borderBottom: "1px solid #ddd",
                paddingBottom: 12,
              }}
            >
              <img
                src={tutor.img || tutor.photoUrl || tutor.profileImage || "https://via.placeholder.com/50"}
                alt={`${tutor.name} 프로필`}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  marginRight: 15,
                  objectFit: "cover",
                }}
              />
              <div style={{ flexGrow: 1 }}>
                <strong>{tutor.name}</strong> (
                {typeof tutor.experience === "number" ? tutor.experience : "경력 정보 없음"}년 경력)
                <p style={{ margin: "4px 0" }}>{tutor.bio || "소개 없음"}</p>
                <p>₩{tutor.price ?? "가격 정보 없음"}</p>
                <p>
                  평점:{" "}
                  {tutor.averageRating !== null && tutor.averageRating !== undefined ? (
                    <>
                      {renderStars(tutor.averageRating)} ({tutor.averageRating})
                    </>
                  ) : (
                    "평점 없음"
                  )}
                </p>
              </div>
              <Link to={`/tutors/${tutor._id}`}>상세보기</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TutorList;