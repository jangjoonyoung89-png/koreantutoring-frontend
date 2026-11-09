import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

// ======================
// API 및 기본 이미지 설정
// ======================
const API_URL = "https://api.rokmun.com";

const DEFAULT_IMAGE = "/images/default-tutor.svg";

// ======================
// 튜터 이미지 주소 처리
// ======================
const getTutorImage = (tutor) => {
  const image =
    tutor.img ||
    tutor.photo ||
    tutor.photoUrl ||
    tutor.profileImage ||
    tutor.profileImageUrl ||
    tutor.image;

  if (!image || typeof image !== "string") {
    return DEFAULT_IMAGE;
  }

  const value = image.trim();

  if (!value) return DEFAULT_IMAGE;

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  if (value.startsWith("data:image/")) {
    return value;
  }

  // 프론트엔드 public 폴더의 이미지
  if (value.startsWith("/images/")) {
    return value;
  }

  // 백엔드 업로드 이미지
  return `${API_URL}/${value.replace(/^\/+/, "")}`;
};

// ======================
// 별점 표시 함수
// ======================
const renderStars = (rating) => {
  const value = Math.max(
    0,
    Math.min(5, Number(rating) || 0)
  );

  const fullStars = Math.floor(value);
  const halfStar = value - fullStars >= 0.5 ? 1 : 0;
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
// 튜터 목록 페이지
// ======================
function TutorListPage() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ======================
  // 실제 튜터 데이터 조회
  // ======================
  useEffect(() => {
    let active = true;

    const fetchTutors = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/api/tutors");

        if (!active) return;
        if (!Array.isArray(response.data)) {
          throw new Error("튜터 데이터 형식 오류");
        }

        setTutors(response.data);
      } catch (err) {
        console.error("튜터 목록 조회 실패:", err);

        if (active) {
          setError(
            "튜터 목록을 불러오지 못했습니다."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchTutors();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* 상단 타이틀 */}
      <div className="text-center py-10 px-4">
        <h1 className="text-3xl font-bold text-gray-800">
          🎓 튜터 목록
        </h1>

        <p className="text-gray-500 mt-2 text-base">
          나에게 맞는 한국어 튜터를 찾아보세요.
        </p>
      </div>

      {/* 로딩 */}
      {loading && (
        <p className="text-center text-gray-500 py-10">
          튜터 목록을 불러오는 중입니다...
        </p>
      )}

      {/* 오류 */}
      {!loading && error && (
        <p className="text-center text-red-500 py-10">
          {error}
        </p>
      )}

      {/* 튜터 목록 */}
      {!loading && !error && (
        <>
          {tutors.length === 0 ? (
            <p className="text-center text-gray-500 py-10">
              등록된 튜터가 없습니다.
            </p>
          ) : (
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-6 pb-16">

              {tutors.map((tutor) => {
                const tutorId = tutor._id || tutor.id;

                const rating = Number(
                  tutor.averageRating
                );

                const hasRating =
                  tutor.averageRating != null &&
                  Number.isFinite(rating);

                const price = Number(tutor.price);

                return (
                  <div
                    key={tutorId}
                    onClick={() =>
                      navigate(`/tutors/${tutorId}`)
                    }
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 overflow-hidden cursor-pointer"
                  >

                    {/* 프로필 이미지 */}
                    <div className="h-52 w-full bg-gray-100 overflow-hidden">
                      <img
                        src={getTutorImage(tutor)}
                        alt={`${tutor.name || "튜터"} 프로필`}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src =
                            DEFAULT_IMAGE;
                        }}
                        className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* 튜터 내용 */}
                    <div className="p-5">

                      <h2 className="text-lg font-semibold text-gray-800 mb-1">
                        {tutor.name || "이름 없음"}
                      </h2>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {tutor.bio || "소개 정보 없음"}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-700">

                        <span>
                          💰{" "}
                          <span className="font-medium text-blue-700">
                            {Number.isFinite(price)
                              ? `${price.toLocaleString()}원`
                              : "가격 정보 없음"}
                          </span>
                        </span>

                        <span className="text-yellow-500">
                          {hasRating ? (
                            <>
                              {renderStars(rating)}{" "}
                              <span className="text-gray-500 text-xs ml-1">
                                ({rating.toFixed(1)})
                              </span>
                            </>
                          ) : (
                            <span className="text-gray-500 text-xs">
                              평점 없음
                            </span>
                          )}
                        </span>
                      </div>

                      {/* 상세보기 버튼 */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/tutors/${tutorId}`);
                        }}
                        className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-medium transition"
                      >
                        자세히 보기
                      </button>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default TutorListPage;