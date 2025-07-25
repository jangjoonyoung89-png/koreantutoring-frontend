import React, { useEffect, useState } from "react";

function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");
  

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:8000/bookings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error("예약 목록 불러오기 실패:", error);
        setMessage("서버 오류가 발생했습니다.");
      }
    };

    fetchBookings();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>내 예약 목록</h2>
      {message && <p>{message}</p>}
      <ul>
        {bookings.map((booking) => (
          <li key={booking.id}>
            튜터 ID: {booking.tutorId}, 시간: {booking.time}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BookingList;