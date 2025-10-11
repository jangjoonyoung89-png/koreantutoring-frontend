import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ======================
// ⭐ 별점 렌더링 유틸
// ======================
const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  return (
    <>
      {"★".repeat(fullStars)}
      {halfStar ? "½" : ""}
      {"☆".repeat(emptyStars)}
    </>
  );
};

// ======================
// 🎓 TutorListPage 컴포넌트
// ======================
function TutorListPage() {
  const [tutors, setTutors] = useState([]);
  const navigate = useNavigate();

  // 샘플 데이터 초기화
  useEffect(() => {
    const sampleTutors = [
      {
        id: "sample1",
        name: "장선미",
        bio: "10년 경력의 한국어 전문 튜터입니다.",
        averageRating: 4.5,
        img: "/images/korean_teacher1.jpg", // public/images 폴더에 이미지
        price: 20000,
      },
      {
        id: "sample2",
        name: "장선경",
        bio: "초보자에게 맞춘 수업을 제공합니다.",
        averageRating: 4.0,
        img: "/images/korean_teacher2.jpg",
        price: 15000,
      },
      {
        id: "sample3",
        name: "권외석",
        bio: "실생활 한국어 회화 중심 수업을 제공합니다.",
        averageRating: 5.0,
        img: "/images/korean_teacher3.jpg",
        price: 25000,
      },
    ];

    setTutors(sampleTutors);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 제목 섹션 */}
      <div className="text-center py-10">
        <h1 className="text-3xl font-bold text-gray-800">🎓 튜터 목록</h1>
        <p className="text-gray-500 mt-2">
          나에게 맞는 한국어 튜터를 찾아보세요.
        </p>
      </div>

      {/* 카드 리스트 */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-6 pb-16">
        {tutors.map((tutor) => (
          <div
            key={tutor.id}
            onClick={() => navigate(`/tutors/${tutor.id}`)}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 overflow-hidden cursor-pointer"
          >
            {/* 프로필 이미지 */}
            <div className="h-52 w-full bg-gray-100 overflow-hidden">
              <img
                src={tutor.img}
                alt={tutor.name}
                className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* 내용 */}
            <div className="p-5">
              <h2 className="text-lg font-semibold text-gray-800 mb-1">
                {tutor.name}
              </h2>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {tutor.bio || "소개 정보 없음"}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-700">
                <span>
                  💰{" "}
                  <span className="font-medium text-blue-700">
                    {tutor.price.toLocaleString()}원
                  </span>
                </span>
                <span className="text-yellow-500">
                  ⭐ {renderStars(tutor.averageRating)}{" "}
                  <span className="text-gray-500 text-xs ml-1">
                    ({tutor.averageRating.toFixed(1)})
                  </span>
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/tutors/${tutor.id}`);
                }}
                className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-medium transition"
              >
                자세히 보기
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TutorListPage;