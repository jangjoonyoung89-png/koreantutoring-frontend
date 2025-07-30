import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { renderStars } from "../utils/renderStars";

function TutorListPage() {
  const [tutors, setTutors] = useState([]);
  const [search, setSearch] = useState("");
  const [sortByRating, setSortByRating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const res = await axios.get("/api/tutors/with-rating");
        if (!Array.isArray(res.data)) {
          throw new Error("튜터 목록을 받을 수 없습니다.");
        }
        setTutors(res.data);
      } catch (err) {
        console.error(err);
        setError("튜터 정보를 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  const safeSearch = (search || "").toLowerCase();

  const filteredTutors = tutors.filter(
    (tutor) =>
      tutor.name &&
      tutor.name.toLowerCase().includes(safeSearch)
  );

  const sortedTutors = sortByRating
    ? [...filteredTutors].sort(
        (a, b) => (b.averageRating || 0) - (a.averageRating || 0)
      )
    : filteredTutors;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">튜터 목록</h2>

      <div className="mb-4 flex items-center gap-3">
        <input
          type="text"
          placeholder="튜터 이름 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md w-60"
        />
        <button
          onClick={() => setSortByRating(!sortByRating)}
          className="bg-gray-200 px-3 py-2 rounded-md hover:bg-gray-300"
        >
          {sortByRating ? "기본 정렬" : "평점순 정렬"}
        </button>
      </div>

      {loading ? (
        <p>로딩 중...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : sortedTutors.length === 0 ? (
        <p>튜터가 없습니다.</p>
      ) : (
        <ul className="grid gap-4">
          {sortedTutors.map((tutor) => (
            <li
              key={tutor._id}
              className="flex items-start gap-4 border p-4 rounded-lg transition transform hover:shadow-lg hover:scale-[1.02] bg-white"
            >
              <img
                src={tutor.photoUrl || "/default-profile.png"}
                alt={tutor.name}
                className="w-24 h-24 object-cover rounded-full border shadow"
              />

              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-1">{tutor.name}</h3>
                <p className="mb-1">
                  <strong>소개:</strong> {tutor.bio || "소개가 없습니다."}
                </p>
                <p className="mb-1">
                  <strong>가격:</strong>{" "}
                  {tutor.price ? `${tutor.price}원` : "가격 정보 없음"}
                </p>
                <p className="mb-2">
                  <strong>평점:</strong>{" "}
                  {tutor.averageRating ? (
                    <>
                      {renderStars(tutor.averageRating)} ({tutor.averageRating})
                    </>
                  ) : (
                    "평점 없음"
                  )}
                </p>

                <button
                  onClick={() => navigate(`/tutors/${tutor._id}`)}
                  className="mt-2 inline-flex items-center bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold px-4 py-2 rounded shadow-md hover:scale-105 transform transition duration-300"
                >
                  자세히 보기
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TutorListPage;