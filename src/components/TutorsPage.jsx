import React, { useEffect, useState } from "react";
import RecommendedTutors from "../components/RecommendedTutors";

function TutorsPage() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3002/api/tutors")
      .then((res) => res.json())
      .then((data) => setTutors(data))
      .catch((err) => console.error("튜터 로드 실패:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>로딩 중...</p>;

  return (
    <div>
      <h1>모든 튜터</h1>
      <RecommendedTutors tutors={tutors} />
    </div>
  );
}

export default TutorsPage;