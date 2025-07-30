import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminTutorApprovalPage = () => {
  const [tutors, setTutors] = useState([]);

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/tutors/pending");
      setTutors(res.data);
    } catch (err) {
      console.error("❌ 튜터 목록 불러오기 실패:", err);
    }
  };

  const handleApprove = async (tutorId) => {
    try {
      await axios.patch(`http://localhost:8000/api/tutors/${tutorId}/approve`);
      fetchTutors();
    } catch (err) {
      console.error("❌ 승인 실패:", err);
    }
  };

  const handleReject = async (tutorId) => {
    try {
      await axios.patch(`http://localhost:8000/api/tutors/${tutorId}/reject`);
      fetchTutors();
    } catch (err) {
      console.error("❌ 거절 실패:", err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">튜터 승인 요청 목록</h1>
      {tutors.length === 0 ? (
        <p>승인 대기 중인 튜터가 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {tutors.map((tutor) => (
            <li
              key={tutor._id}
              className="p-4 border rounded shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{tutor.name}</p>
                <p className="text-sm text-gray-600">{tutor.email}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleApprove(tutor._id)}
                  className="px-3 py-1 bg-green-500 text-white rounded"
                >
                  승인
                </button>
                <button
                  onClick={() => handleReject(tutor._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  거절
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminTutorApprovalPage;