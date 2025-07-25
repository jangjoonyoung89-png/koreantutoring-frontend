import React, { useEffect, useState, useContext } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { AuthContext } from "../context/AuthContext";

function TutorCalendarDashboard() {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedBookings, setSelectedBookings] = useState([]);

  useEffect(() => {
    async function fetchBookings() {
      const res = await fetch(`http://localhost:8000/api/bookings?tutorId=${user.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setBookings(data);
    }

    if (user?.role === "tutor") {
      fetchBookings();
    }
  }, [user]);

  useEffect(() => {
    const formatted = selectedDate.toISOString().split("T")[0]; // YYYY-MM-DD
    const filtered = bookings.filter((b) => b.date === formatted);
    setSelectedBookings(filtered);
  }, [selectedDate, bookings]);

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 20 }}>
      <h2>📅 튜터 예약 캘린더</h2>
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileClassName={({ date, view }) => {
          if (
            bookings.find((b) => b.date === date.toISOString().split("T")[0])
          ) {
            return "has-booking"; 
          }
        }}
      />
      <div style={{ marginTop: 30 }}>
        <h3>🔎 {selectedDate.toLocaleDateString()} 예약 목록</h3>
        {selectedBookings.length === 0 ? (
          <p>예약이 없습니다.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {selectedBookings.map((b) => (
              <li
                key={b._id}
                style={{
                  padding: "10px 0",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <p>
                  <strong>학생:</strong> {b.student?.full_name || "이름 없음"}
                </p>
                <p>
                  <strong>시간:</strong> {b.time}
                </p>
                <p>
                  <strong>요청사항:</strong> {b.notes || "없음"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <style>
        {`
          .has-booking {
            background-color: #cce5ff !important;
            border-radius: 50%;
          }
        `}
      </style>
    </div>
  );
}

export default TutorCalendarDashboard;