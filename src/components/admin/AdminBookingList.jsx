import React, { useEffect, useState } from "react";

function AdminBookingList() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("http://localhost:8000/bookings");
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error("예약 목록 조회 실패:", err);
        setError("서버 오류가 발생했습니다.");
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">전체 예약 목록</h2>
      {error && <p className="text-red-500">{error}</p>}
      <table className="w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">튜터</th>
            <th className="border px-2 py-1">학생</th>
            <th className="border px-2 py-1">날짜</th>
            <th className="border px-2 py-1">시간</th>
            <th className="border px-2 py-1">요청사항</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id}>
              <td className="border px-2 py-1">{booking.tutor?.full_name || "N/A"}</td>
              <td className="border px-2 py-1">{booking.student?.full_name || "N/A"}</td>
              <td className="border px-2 py-1">{booking.date}</td>
              <td className="border px-2 py-1">{booking.time}</td>
              <td className="border px-2 py-1">{booking.notes || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminBookingList;