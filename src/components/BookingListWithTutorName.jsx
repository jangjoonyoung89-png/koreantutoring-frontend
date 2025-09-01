import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import PayButton from "./PayButton";
import { Link } from "react-router-dom";

function BookingListWithTutorName() {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(null);
  const [newTime, setNewTime] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(`http://localhost:8000/bookings?studentId=${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("예약 불러오기 실패");

        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error("불러오기 오류:", err);
        setMessage("서버 오류가 발생했습니다.");
      }
    };

    if (user?.id) fetchBookings();
  }, [user, token]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("정말 이 예약을 취소하시겠습니까?")) return;

    try {
      const res = await fetch(`http://localhost:8000/bookings/${bookingId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.detail || "예약 취소에 실패했습니다.");
        return;
      }

      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
    } catch (err) {
      console.error("예약 취소 오류:", err);
      alert("서버 오류로 취소에 실패했습니다.");
    }
  };

  const handleUpdate = async (bookingId) => {
    if (!newTime) {
      setMessage("새로운 시간을 입력하세요.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/bookings/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ time: newTime }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.detail || "수정 실패");
        return;
      }

      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, time: newTime } : b
        )
      );
      setEditId(null);
      setNewTime("");
    } catch (err) {
      console.error("수정 오류:", err);
      setMessage("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "auto", padding: 20 }}>
      <h2>📚 내 예약 목록</h2>
      {message && <p style={{ color: "red" }}>{message}</p>}
      {bookings.length === 0 ? (
        <p>예약 내역이 없습니다.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {bookings.map((booking) => (
            <li
              key={booking._id}
              style={{
                borderBottom: "1px solid #ddd",
                padding: "15px 0",
              }}
            >
              <p><strong>날짜:</strong> {booking.date}</p>
              <p><strong>튜터:</strong> {booking.tutor?.full_name || "알 수 없음"}</p>
              <p><strong>요청사항:</strong> {booking.notes || "없음"}</p>

              {editId === booking._id ? (
                <>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                  />
                  <button onClick={() => handleUpdate(booking._id)}>저장</button>
                  <button onClick={() => setEditId(null)}>취소</button>
                </>
              ) : (
                <>
                  <p><strong>시간:</strong> {booking.time}</p>
                  <button
                    onClick={() => {
                      setEditId(booking._id);
                      setNewTime(booking.time);
                    }}
                  >
                    시간 수정
                  </button>

                  <PayButton
                    tutorId={booking.tutor._id}
                    studentId={user.id}
                    time={booking.time}
                    tutorName={booking.tutor.name}
                    price={booking.price}
                  />

                  {/* ✅ 실시간 수업 참여 버튼 */}
                  <Link
                    to={`/video-class/${booking._id}`}
                    style={{
                      display: "inline-block",
                      marginLeft: "10px",
                      padding: "6px 12px",
                      backgroundColor: "#4CAF50",
                      color: "white",
                      textDecoration: "none",
                      borderRadius: "5px",
                      fontWeight: "bold",
                      transition: "transform 0.2s",
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                    onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                  >
                    실시간 수업 참여
                  </Link>
                </>
              )}

              <button
                onClick={() => handleCancel(booking._id)}
                style={{ marginLeft: 10 }}
              >
                예약 취소
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BookingListWithTutorName;