import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function MyPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.id) return;

    const token = localStorage.getItem("token");

    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/users/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("사용자 정보를 불러오지 못했습니다.");
        const data = await res.json();
        setUserInfo(data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchBookings = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/bookings?studentId=${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("예약 정보를 불러오지 못했습니다.");
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUser();
    fetchBookings();
  }, [user]);

  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
  if (!userInfo) return <p style={{ textAlign: "center" }}>로딩 중...</p>;

  return (
    <div style={{
      maxWidth: 700,
      margin: "0 auto",
      padding: "40px 20px",
      fontFamily: "sans-serif",
      minHeight: "100vh",
      backgroundColor: "#fff",
    }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>📄 마이페이지</h2>

      {/* 사용자 정보 */}
      <div style={{
        background: "#f9f9f9",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        marginBottom: "30px",
      }}>
        <h3>👤 내 정보</h3>
        <p><strong>이름:</strong> {userInfo.full_name}</p>
        <p><strong>이메일:</strong> {userInfo.email}</p>
        <p><strong>역할:</strong> {userInfo.role === "student" ? "학생" : "튜터"}</p>
      </div>

      {/* 예약 목록 */}
      <div style={{
        background: "#f1f5ff",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}>
        <h3>📅 내 예약</h3>
        {bookings.length === 0 ? (
          <p>예약 내역이 없습니다.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {bookings.map((booking) => (
              <li key={booking.id} style={{
                borderBottom: "1px solid #ddd",
                padding: "15px 0",
              }}>
                <p><strong>튜터:</strong> {booking.tutor_name}</p>
                <p><strong>날짜:</strong> {booking.date}</p>
                <p><strong>시간:</strong> {booking.time}</p>
                <p><strong>요청사항:</strong> {booking.notes || "없음"}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 버튼 영역 */}
      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <button
          onClick={() => navigate("/edit-profile")}
          style={btnStyle("#007bff")}
        >
          프로필 수정
        </button>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
          style={btnStyle("#6c757d")}
        >
          로그아웃
        </button>
        <button
          onClick={() => navigate("/change-password")}
          style={{ ...btnStyle("#28a745"), marginTop: "10px" }}
        >
          비밀번호 변경
        </button>
      </div>
    </div>
  );
}


const btnStyle = (bgColor) => ({
  backgroundColor: bgColor,
  color: "#fff",
  padding: "10px 20px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  margin: "5px",
});

export default MyPage;