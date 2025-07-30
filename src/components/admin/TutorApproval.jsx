import React, { useEffect, useState } from "react";
import axios from "axios";

function TutorApproval() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  const fetchTutors = async () => {
    try {
      const response = await axios.get("/admin/tutors"); // 백엔드의 도메인/포트를 포함하세요.
      setTutors(response.data);
    } catch (err) {
      setError("튜터 목록을 불러오는데 실패했습니다.");
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTutors();
  }, []);

  
  const handleApprove = async (id) => {
    try {
      await axios.patch(`/admin/tutors/${id}/approve`);
      
      setTutors(tutors.filter((tutor) => tutor._id !== id));
    } catch (err) {
      console.error("승인 실패", err);
      alert("승인에 실패했습니다.");
    }
  };

  
  const handleReject = async (id) => {
    try {
      await axios.patch(`/admin/tutors/${id}/reject`);
      
      setTutors(tutors.filter((tutor) => tutor._id !== id));
    } catch (err) {
      console.error("거절 실패", err);
      alert("거절에 실패했습니다.");
    }
  };

  if (loading) return <div>로딩중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>튜터 승인 관리</h2>
      {tutors.length === 0 ? (
        <p>승인 대기 중인 튜터가 없습니다.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>이름</th>
              <th>이메일</th>
              <th>행동</th>
            </tr>
          </thead>
          <tbody>
            {tutors.map((tutor) => (
              <tr key={tutor._id}>
                <td>{tutor.name}</td>
                <td>{tutor.email}</td>
                <td>
                  <button onClick={() => handleApprove(tutor._id)}>
                    승인
                  </button>{" "}
                  <button onClick={() => handleReject(tutor._id)}>
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

export default TutorApproval;