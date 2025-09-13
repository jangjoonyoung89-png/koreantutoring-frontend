import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

function TutorDashboardPage() {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);

  // 예약 & 리뷰 불러오기
  useEffect(() => {
    async function fetchData() {
      try {
        const resBookings = await fetch(
          `http://localhost:8000/api/bookings?tutorId=${user.id}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        if (!resBookings.ok) throw new Error("예약 정보를 불러오는 데 실패했습니다.");
        const dataBookings = await resBookings.json();
        setBookings(dataBookings);

        const resReviews = await fetch(
          `http://localhost:8000/api/reviews?tutorId=${user.id}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        if (!resReviews.ok) throw new Error("리뷰 정보를 불러오는 데 실패했습니다.");
        const dataReviews = await resReviews.json();
        setReviews(dataReviews);
      } catch (err) {
        setError(err.message || "서버 오류가 발생했습니다.");
      }
    }

    if (user?.role === "tutor") fetchData();
  }, [user]);

  // 예약 승인
  const handleApprove = async (bookingId) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/bookings/${bookingId}/approve`,
        { method: "POST", headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (!res.ok) throw new Error("승인에 실패했습니다.");
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: "approved" } : b))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  // 예약 거절
  const handleReject = async (bookingId) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/bookings/${bookingId}/reject`,
        { method: "POST", headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (!res.ok) throw new Error("거절에 실패했습니다.");
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: "rejected" } : b))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  // 수업 자료 업로드
  const handleFileUpload = async () => {
    if (!file) return alert("파일을 선택해주세요.");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(`http://localhost:8000/api/materials`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });
      if (!res.ok) throw new Error("자료 업로드 실패");
      alert("자료 업로드 완료!");
      setFile(null);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: "40px auto", padding: 20, fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center", marginBottom: 40 }}>🎓 튜터 대시보드</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* 📊 예약 현황 */}
      <section style={cardStyle}>
        <h2>📊 나의 수업 예약 현황</h2>
        {bookings.length === 0 ? (
          <p>예약 내역이 없습니다.</p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th>학생 이름</th>
                <th>날짜</th>
                <th>시간</th>
                <th>요청사항</th>
                <th>상태</th>
                <th>기능</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, i) => (
                <tr
                  key={b._id}
                  style={{ backgroundColor: i % 2 === 0 ? "#f9f9f9" : "white" }}
                >
                  <td>{b.student?.full_name}</td>
                  <td>{new Date(b.date).toLocaleDateString()}</td>
                  <td>{b.time}</td>
                  <td>{b.notes || "없음"}</td>
                  <td style={{ fontWeight: "bold", color: getStatusColor(b.status) }}>
                    {b.status || "pending"}
                  </td>
                  <td>
                    <Link to={`/classroom/${b._id}`} style={linkStyle}>입장</Link>
                    <Link to={`/chat/${b._id}`} style={linkStyle}>채팅</Link>
                    <Link to={`/whiteboard/${b._id}`} style={linkStyle}>화이트보드</Link>
                    {b.status === "pending" && (
                      <>
                        <button style={approveBtn} onClick={() => handleApprove(b._id)}>✔️ 승인</button>
                        <button style={rejectBtn} onClick={() => handleReject(b._id)}>❌ 거절</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* 📁 자료 업로드 */}
      <section style={cardStyle}>
        <h2>📁 수업 자료 업로드</h2>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button style={uploadBtn} onClick={handleFileUpload}>업로드</button>
      </section>

      {/* ⭐ 리뷰 */}
      <section style={cardStyle}>
        <h2>⭐ 학생 리뷰</h2>
        {reviews.length === 0 ? (
          <p>리뷰가 없습니다.</p>
        ) : (
          <ul>
            {reviews.map((r) => (
              <li key={r._id} style={{ marginBottom: 10 }}>
                <strong>{r.studentName}</strong>: {r.comment} ({r.rating}⭐)
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

// 🎨 스타일
const cardStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  marginBottom: "30px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const linkStyle = {
  marginRight: "10px",
  textDecoration: "none",
  color: "#007bff",
};

const approveBtn = {
  background: "#28a745",
  color: "white",
  border: "none",
  padding: "5px 10px",
  borderRadius: "6px",
  cursor: "pointer",
  marginLeft: "8px",
};

const rejectBtn = {
  background: "#dc3545",
  color: "white",
  border: "none",
  padding: "5px 10px",
  borderRadius: "6px",
  cursor: "pointer",
  marginLeft: "5px",
};

const uploadBtn = {
  marginLeft: "10px",
  background: "#007bff",
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: "6px",
  cursor: "pointer",
};

function getStatusColor(status) {
  switch (status) {
    case "approved":
      return "green";
    case "rejected":
      return "red";
    default:
      return "gray";
  }
}

export default TutorDashboardPage;