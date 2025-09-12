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
        // 예약
        const resBookings = await fetch(
          `http://localhost:8000/api/bookings?tutorId=${user.id}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        if (!resBookings.ok) {
          const data = await resBookings.json();
          throw new Error(data.detail || "예약 정보를 불러오는 데 실패했습니다.");
        }
        const dataBookings = await resBookings.json();
        setBookings(dataBookings);

        // 리뷰
        const resReviews = await fetch(
          `http://localhost:8000/api/reviews?tutorId=${user.id}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        if (!resReviews.ok) throw new Error("리뷰 정보를 불러오는 데 실패했습니다.");
        const dataReviews = await resReviews.json();
        setReviews(dataReviews);
      } catch (err) {
        setError(err.message || "서버 오류가 발생했습니다.");
      }
    }

    if (!user || user.role !== "tutor") return; // ✅ 조건부 훅 호출 방지
    fetchData();
  }, [user]);

  // 예약 승인
  const handleApprove = async (bookingId) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/bookings/${bookingId}/approve`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
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
        {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
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
    <div style={{ maxWidth: 1000, margin: "40px auto", padding: 20 }}>
      <h2>📊 나의 수업 예약 현황</h2>
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
              <th>상태</th>
              <th>기능</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id} style={{ borderBottom: "1px solid #ccc" }}>
                <td>{b.student?.full_name}</td>
                <td>{new Date(b.date).toLocaleDateString()}</td>
                <td>{b.time}</td>
                <td>{b.notes || "없음"}</td>
                <td
                  style={{
                    color:
                      b.status === "approved"
                        ? "green"
                        : b.status === "rejected"
                        ? "red"
                        : "black",
                  }}
                >
                  {b.status || "pending"}
                </td>
                <td>
                  <Link to={`/classroom/${b._id}`}>입장</Link> |{" "}
                  <Link to={`/chat/${b._id}`}>채팅</Link> |{" "}
                  <Link to={`/whiteboard/${b._id}`}>화이트보드</Link>
                  {b.status === "pending" && (
                    <>
                      {" "} |{" "}
                      <button onClick={() => handleApprove(b._id)}>✔️ 승인</button>{" "}
                      <button onClick={() => handleReject(b._id)}>❌ 거절</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 수업 자료 업로드 */}
      <section style={{ marginTop: 40 }}>
        <h2>📁 수업 자료 업로드</h2>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={handleFileUpload}>업로드</button>
      </section>

      {/* 학생 리뷰 확인 */}
      <section style={{ marginTop: 40 }}>
        <h2>⭐ 학생 리뷰</h2>
        {reviews.length === 0 ? (
          <p>리뷰가 없습니다.</p>
        ) : (
          <ul>
            {reviews.map((r) => (
              <li key={r._id}>
                {r.studentName}: {r.comment} ({r.rating}⭐)
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default TutorDashboardPage;