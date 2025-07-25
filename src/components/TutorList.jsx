import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function TutorList() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/tutors")  // 백엔드 주소 확인 필요
      .then((res) => {
        if (!res.ok) throw new Error("튜터 목록을 불러오는데 실패했습니다.");
        return res.json();
      })
      .then((data) => {
        setTutors(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>튜터 목록</h2>
      <ul>
        {tutors.map((tutor) => (
          <li key={tutor._id}>
            <strong>{tutor.name}</strong> - {tutor.bio} (₩{tutor.price}){" "}
            <Link to={`/tutors/${tutor._id}`}>상세보기</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TutorList;