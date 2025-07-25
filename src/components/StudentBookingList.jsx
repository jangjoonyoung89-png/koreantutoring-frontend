import React, { useEffect, useState, useCallback, useContext } from "react";
import ReviewForm from "./ReviewForm"; 
import { AuthContext } from "../context/AuthContext";


function StudentBookingList({ studentId }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);

  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:8000/bookings/student/${studentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "예약 정보를 가져오지 못했습니다.");
        setBookings([]);
      } else {
        setBookings(data.bookings || data);
      }
    } catch (err) {
      setError("서버와 연결할 수 없습니다.");
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const cancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm("정말 이 예약을 취소하시겠습니까?");
    if (!confirmCancel) return;

    try {
      const res = await fetch(`http://localhost:8000/bookings/${bookingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "예약 취소에 실패했습니다.");
      } else {
        alert("예약이 취소되었습니다.");
        fetchBookings(); 
      }
    } catch (err) {
      alert("서버 오류로 예약을 취소할 수 없습니다.");
    }
  };

  return (
    <div>
      <h2>내 예약 목록</h2>
      {loading && <p>불러오는 중...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && bookings.length === 0 && <p>예약 내역이 없습니다.</p>}

      <ul>
        {bookings.map((booking) => (
          <li key={booking._id || booking.id} style={{ marginBottom: "1em" }}>
            <strong>튜터:</strong> {booking.tutor?.name || "정보 없음"} <br />
            <strong>날짜:</strong> {booking.date} <br />
            <strong>시간:</strong> {booking.time} <br />
            <strong>요청사항:</strong> {booking.notes || "-"} <br />
            <div style={{ marginTop: "1em" }}>
              <ReviewForm
                tutorId={booking.tutor._id}
                studentId={user.id}
              />
            </div>
            <button onClick={() => cancelBooking(booking._id)}>예약 취소</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StudentBookingList;