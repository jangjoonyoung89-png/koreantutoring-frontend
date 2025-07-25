import React, { useEffect, useState } from "react";

function BookingPageWithDisabledTimes({ tutorId }) {
  const [reservedTimesByDate, setReservedTimesByDate] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [message, setMessage] = useState("");

  const availableTimes = [
    "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "12:30",
    "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30",
    "17:00", "17:30", "18:00",
  ];

  useEffect(() => {
    
    async function fetchReservedTimes() {
      try {
        const response = await fetch(`http://localhost:8000/bookings/tutor/${tutorId}/reserved-times`);
        const data = await response.json();
        setReservedTimesByDate(data);
      } catch (error) {
        console.error("예약된 시간 불러오기 실패:", error);
      }
    }

    if (tutorId) {
      fetchReservedTimes();
    }
  }, [tutorId]);

  const onDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedTime("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      setMessage("날짜와 시간을 선택해주세요.");
      return;
    }

    const timeISO = `${selectedDate}T${selectedTime}`;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tutorId, time: timeISO }),
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.detail || "예약 실패");
      } else {
        setMessage("예약이 완료되었습니다!");
        setSelectedDate("");
        setSelectedTime("");
        const refreshed = await fetch(`http://localhost:8000/bookings/tutor/${tutorId}/reserved-times`);
        const refreshedData = await refreshed.json();
        setReservedTimesByDate(refreshedData);
      }
    } catch (error) {
      console.error("예약 오류:", error);
      setMessage("서버 오류가 발생했습니다.");
    }
  };

  const reservedTimesForSelectedDate = reservedTimesByDate[selectedDate] || [];

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>튜터 예약하기</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>예약 날짜:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={onDateChange}
            required
          />
        </div>
        <div>
          <label>예약 시간:</label>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            required
            disabled={!selectedDate}
          >
            <option value="">-- 시간 선택 --</option>
            {availableTimes.map((time) => (
              <option
                key={time}
                value={time}
                disabled={reservedTimesForSelectedDate.includes(time)}
              >
                {time} {reservedTimesForSelectedDate.includes(time) ? "(예약됨)" : ""}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" style={{ marginTop: 10 }}>
          예약하기
        </button>
      </form>
    </div>
  );
}

export default BookingPageWithDisabledTimes;