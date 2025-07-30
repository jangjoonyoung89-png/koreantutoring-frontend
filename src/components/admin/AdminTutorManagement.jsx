import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminTutorManagement() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 튜터 목록 불러오기
  const fetchTutors = () => {
    setLoading(true);
    axios
      .get("http://localhost:8000/api/admin/tutors/pending")  // 승인 대기 중인 튜터만 불러오기 가정
      .then((res) => {
        setTutors(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("튜터 목록을 불러오는데 실패했습니다.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTutors();
  }, []);

  // 승인 또는 거절 처리
  const handleDecision = (tutorId, decision) => {
    // decision은 "approve" 또는 "reject"
    axios
      .post(`http://localhost:8000/api/admin/tutors/${tutorId}/${decision}`)
      .then(() => {
        // 성공 시 다시 목록 갱신
        fetchTutors();
      })
      .catch(() => {
        alert("처리에 실패했습니다. 다시 시도해주세요.");
      });
  };

  if (loading) return <p>튜터 목록 불러오는 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">튜터 승인 관리</h2>
      {tutors.length === 0 ? (
        <p>승인 대기 중인 튜터가 없습니다.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">이름</th>
              <th className="border border-gray-300 p-2">이메일</th>
              <th className="border border-gray-300 p-2">상태</th>
              <th className="border border-gray-300 p-2">관리</th>
            </tr>
          </thead>
          <tbody>
            {tutors.map((tutor) => (
              <tr key={tutor._id}>
                <td className="border border-gray-300 p-2">{tutor.full_name}</td>
                <td className="border border-gray-300 p-2">{tutor.email}</td>
                <td className="border border-gray-300 p-2">{tutor.status}</td>
                <td className="border border-gray-300 p-2 space-x-2">
                  <button
                    onClick={() => handleDecision(tutor._id, "approve")}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                  >
                    승인
                  </button>
                  <button
                    onClick={() => handleDecision(tutor._id, "reject")}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    거절
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}