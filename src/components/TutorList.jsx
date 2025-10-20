import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api"; // 공통 axios 인스턴스

// ⭐ 별점 표시 함수
function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const stars = [];

  for (let i = 0; i < fullStars; i++) stars.push("★");
  if (halfStar) stars.push("☆");
  while (stars.length < 5) stars.push("☆");

  return stars.join("");
}

function TutorList() {
  const [tutorList, setTutorList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("🎯 튜터 목록 API 호출 시작...");

    api
      .get("/api/tutors/with-rating", {
        headers: { "Cache-Control": "no-store" },
        params: { t: Date.now() }, // 캐시 방지용 쿼리
      })
      .then((res) => {
        console.log("✅ 튜터 데이터 응답:", res.data);
        setTutorList(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ 튜터 목록 요청 오류:", err);
        setError("튜터 목록을 불러오는 데 실패했습니다.");
        setLoading(false);
      });
  }, []);

  if (loading)
    return <p className="text-center text-gray-500 mt-10">로딩 중...</p>;
  if (error)
    return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center mb-8">🌟 튜터 목록</h2>

      {tutorList.length === 0 ? (
        <p className="text-center text-gray-600">등록된 튜터가 없습니다.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {tutorList.map((tutor) => (
            <div
              key={tutor._id}
              className="border rounded-2xl p-5 shadow-md hover:shadow-xl transition-all bg-white flex flex-col"
            >
              <div className="flex items-center mb-4">
                <img
                  src={
                    tutor.img ||
                    tutor.photoUrl ||
                    tutor.profileImage ||
                    "https://via.placeholder.com/80"
                  }
                  alt={`${tutor.name} 프로필`}
                  className="w-20 h-20 rounded-full object-cover border"
                />
                <div className="ml-4">
                  <h3 className="text-xl font-semibold">
                    {tutor.name || "이름 없음"}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {typeof tutor.experience === "number"
                      ? `${tutor.experience}년 경력`
                      : "경력 정보 없음"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {tutor.language || "언어 정보 없음"}
                  </p>
                </div>
              </div>

              <p className="text-gray-700 text-sm mb-3">
                {tutor.bio || "튜터 소개가 아직 없습니다."}
              </p>

              <div className="mt-auto">
                <p className="text-lg font-semibold text-blue-600 mb-1">
                  ₩{tutor.price ?? "가격 정보 없음"}
                </p>

                <p className="text-yellow-500 text-sm">
                  {tutor.averageRating !== null &&
                  tutor.averageRating !== undefined ? (
                    <>
                      {renderStars(tutor.averageRating)}{" "}
                      <span className="text-gray-600 text-xs">
                        ({tutor.averageRating.toFixed(1)})
                      </span>
                    </>
                  ) : (
                    "평점 없음"
                  )}
                </p>

                <Link
                  to={`/tutors/${tutor._id}`}
                  className="block mt-4 w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-all"
                >
                  상세보기
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TutorList;