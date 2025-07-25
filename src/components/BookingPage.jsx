import React, { useState, useEffect } from "react";

function BookingPage() {
  const [tutorId, setTutorId] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const [disabledTimes, setDisabledTimes] = useState([]);

  useEffect(() => {
    const fetchDisabledTimes = async () => {
      if (!tutorId) return;
      try {
        const res = await fetch(`http://localhost:8000/bookings/tutor/${tutorId}`);
        const data = await res.json();
        setDisabledTimes(data);
      } catch (err) {
        console.error("비활성화 시간 가져오기 오류:", err);
      }
    };

    fetchDisabledTimes();
  }, [tutorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tutorId || !time) {
      setMessage("모든 항목을 입력해 주세요.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tutorId: parseInt(tutorId), time }),
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage(data.detail || "예약 실패");
        return;
      }

      setMessage("예약이 완료되었습니다!");
      setTutorId("");
      setTime("");
    } catch (error) {
      console.error("예약 오류:", error);
      setMessage("서버 오류가 발생했습니다.");
    }
  };

  const isDisabledTime = (inputTime) => {
    return disabledTimes.includes(inputTime);
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>수업 예약</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>튜터 ID:</label>
          <input
            type="number"
            value={tutorId}
            onChange={(e) => setTutorId(e.target.value)}
            placeholder="예: 1"
          />
        </div>
        <div>
          <label>예약 시간:</label>
          <input
            type="datetime-local"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            disabled={isDisabledTime(time)}
          />
          {isDisabledTime(time) && <p style={{ color: "red" }}>이미 예약된 시간입니다.</p>}
        </div>
        <button type="submit" style={{ marginTop: 10 }} disabled={isDisabledTime(time)}>
          예약하기
        </button>
      </form>
    </div>
  );
}

export default BookingPage;