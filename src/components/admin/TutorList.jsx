import React, { useEffect, useState } from "react";

function TutorList() {
  const [tutors, setTutors] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/tutors");
        const data = await res.json();
        setTutors(data);
      } catch (err) {
        console.error("튜터 불러오기 실패:", err);
        setError("서버 오류가 발생했습니다.");
      }
    };

    fetchTutors();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">튜터 목록</h2>
      {error && <p className="text-red-500">{error}</p>}
      <table className="w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">이름</th>
            <th className="border px-2 py-1">이메일</th>
            <th className="border px-2 py-1">상태</th>
            <th className="border px-2 py-1">소개</th>
          </tr>
        </thead>
        <tbody>
          {tutors.map((tutor) => (
            <tr key={tutor._id}>
              <td className="border px-2 py-1">{tutor.full_name}</td>
              <td className="border px-2 py-1">{tutor.email}</td>
              <td className="border px-2 py-1">{tutor.status || "확인 필요"}</td>
              <td className="border px-2 py-1">{tutor.bio?.slice(0, 30)}...</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TutorList;