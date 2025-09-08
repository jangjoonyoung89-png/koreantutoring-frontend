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

  // 무조건 샘플 데이터로 초기화
  useEffect(() => {
    const sampleTutors = [
      {
        id: "sample1",
        name: "홍길동",
        bio: "10년 경력의 한국어 전문 튜터입니다.",
        averageRating: 4.5,
        img: "https://via.placeholder.com/200",
        price: 20000,
      },
      {
        id: "sample2",
        name: "김영희",
        bio: "초보자에게 맞춘 수업을 제공합니다.",
        averageRating: 4.0,
        img: "https://via.placeholder.com/200",
        price: 15000,
      },
      {
        id: "sample3",
        name: "이철수",
        bio: "실생활 한국어 회화 중심 수업을 제공합니다.",
        averageRating: 5.0,
        img: "https://via.placeholder.com/200",
        price: 25000,
      },
    ];

    // 무조건 샘플 데이터 사용
    setTutors(sampleTutors);
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">튜터 목록</h2>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tutors.map((t) => (
          <li
            key={t.id}
            className="bg-white border rounded-xl overflow-hidden shadow hover:shadow-lg transition cursor-pointer"
            onClick={() => navigate(`/tutors/${t.id}`)}
          >
            <img
              src={t.img}
              alt={t.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1">{t.name}</h3>
              <p className="text-gray-600 mb-2 line-clamp-2">
                {t.bio || "소개 정보 없음"}
              </p>
              <p className="mb-1">
                💰 가격:{" "}
                <span className="font-medium">
                  {t.price?.toLocaleString() || 0}원
                </span>
              </p>
              <p>
                ⭐ 평점: {renderStars(t.averageRating)}{" "}
                <span className="text-sm text-gray-500">
                  ({t.averageRating.toFixed(1)})
                </span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TutorListPage;