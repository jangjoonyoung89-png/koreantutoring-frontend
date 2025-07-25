import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function TutorBookingList() {
  const { user } = useContext(AuthContext); 
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.id) return;

    const token = localStorage.getItem("token");

    async function fetchBookings() {
      try {
        const res = await fetch(`http://localhost:8000/api/bookings?tutorId=${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("예약 현황을 불러오지 못했습니다.");
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchBookings();
  }, [user]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (bookings.length === 0) return <p>예약 내역이 없습니다.</p>;

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: 20, fontFamily: "sans-serif" }}>
      <h2>📅 내 예약 현황</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {bookings.map((booking) => (
          <li
            key={booking._id}
            style={{
              borderBottom: "1px solid #ddd",
              padding: "15px 0",
            }}
          >
            <p><strong>예약 날짜:</strong> {booking.date}</p>
            <p><strong>예약 시간:</strong> {booking.time}</p>
            <p><strong>학생 이름:</strong> {booking.student.full_name}</p>
            <p><strong>요청사항:</strong> {booking.notes || "없음"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TutorBookingList;
