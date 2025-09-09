import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ======================
// 별점 렌더링 유틸
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
// TutorListPage 컴포넌트
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
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">튜터 목록</h2>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tutors.map((tutor) => (
          <li
            key={tutor.id}
            className="bg-white border rounded-xl overflow-hidden shadow transition-transform transform hover:scale-105 hover:shadow-2xl cursor-pointer"
            onClick={() => navigate(`/tutors/${tutor.id}`)}
          >
            {/* 튜터 사진 */}
            <img
              src={tutor.img}
              alt={tutor.name}
              className="w-full h-48 object-cover transition-transform duration-200"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1">{tutor.name}</h3>
              <p className="text-gray-600 mb-2 line-clamp-2">
                {tutor.bio || "소개 정보 없음"}
              </p>
              <p className="mb-1">
                💰 가격:{" "}
                <span className="font-medium">{tutor.price?.toLocaleString() || 0}원</span>
              </p>
              <p>
                ⭐ 평점: {renderStars(tutor.averageRating)}{" "}
                <span className="text-sm text-gray-500">({tutor.averageRating.toFixed(1)})</span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TutorListPage;