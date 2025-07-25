import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function TutorDashboardPage() {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch(`http://localhost:8000/api/bookings?tutorId=${user.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.detail || "예약 정보를 불러오는 데 실패했습니다.");
        }

        const data = await res.json();
        setBookings(data);
      } catch (err) {
        setError(err.message || "서버 오류가 발생했습니다.");
      }
    }

    if (user?.role === "tutor") {
      fetchBookings();
    }
  }, [user]);

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: 20 }}>
      <h2>📊 나의 수업 예약 현황</h2>

      {/* ✅ 에러 메시지 렌더링 */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {bookings.length === 0 ? (
        <p>예약 내역이 없습니다.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>학생 이름</th>
              <th>날짜</th>
              <th>시간</th>
              <th>요청사항</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td>{b.student?.full_name}</td>
                <td>{b.date}</td>
                <td>{b.time}</td>
                <td>{b.notes || "없음"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TutorDashboardPage;