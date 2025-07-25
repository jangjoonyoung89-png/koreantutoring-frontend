import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { renderStars } from "../utils/renderStars";

function TutorListPage() {
  const [tutors, setTutors] = useState([]);
  const [search, setSearch] = useState("");
  const [sortByRating, setSortByRating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    <div style={{ padding: "20px" }}>
      <h2>튜터 목록</h2>

      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="튜터 이름 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "8px",
            width: "200px",
            marginRight: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <button onClick={() => setSortByRating(!sortByRating)}>
          {sortByRating ? "기본 정렬" : "평점순 정렬"}
        </button>
      </div>

      {loading ? (
        <p>로딩 중...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : sortedTutors.length === 0 ? (
        <p>튜터가 없습니다.</p>
      ) : (
        <ul style={{ padding: 0, listStyle: "none" }}>
          {sortedTutors.map((tutor) => (
            <li
              key={tutor._id}
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "6px",
              }}
            >
              <Link
                to={`/tutors/${tutor._id}`}
                style={{ textDecoration: "none", color: "#007bff" }}
              >
                <h3>{tutor.name}</h3>
              </Link>
              <p><strong>소개:</strong> {tutor.bio || "소개가 없습니다."}</p>
              <p><strong>가격:</strong> {tutor.price ? `${tutor.price}원` : "가격 정보 없음"}</p>
              <p>
                <strong>평점:</strong>{" "}
                {tutor.averageRating ? (
                  <>
                    {renderStars(tutor.averageRating)} ({tutor.averageRating})
                  </>
                ) : (
                  "평점 없음"
                )}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TutorListPage;