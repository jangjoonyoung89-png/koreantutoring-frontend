import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { renderStars } from "../utils/renderStars";

function TutorListPage() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const data = await api.getTutorsWithRating();
        const mapped = data.map((t) => ({
          ...t,
          id: t._id || t.id, // _id → id 통일
          averageRating: t.averageRating || 0, // 평점 없으면 0
        }));
        setTutors(mapped);
      } catch (err) {
        console.error("❌ 튜터 목록 불러오기 실패:", err);
        setError("튜터 목록을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  if (loading) return <p className="text-center mt-6">⏳ 로딩 중...</p>;
  if (error) return <p className="text-center text-red-500 mt-6">{error}</p>;
  if (!tutors.length) return <p className="text-center mt-6">튜터가 없습니다.</p>;

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
              src={t.img || "/default-profile.png"}
              alt={t.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1">{t.name}</h3>
              <p className="text-gray-600 mb-2 line-clamp-2">{t.bio}</p>
              <p className="mb-1">
                💰 가격: <span className="font-medium">{t.price?.toLocaleString() || 0}원</span>
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