import React, { useState } from "react";
import AvailableTimeSelect from "./AvailableTimeSelect"; 

function BookingForm({ studentId, tutorId }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!date || !time) {
      setError("날짜와 시간을 선택해주세요.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ student: studentId, tutor: tutorId, date, time, notes }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "예약에 실패했습니다.");
        return;
      }

      setMessage("예약이 완료되었습니다!");
      setDate("");
      setTime("");
      setNotes("");
    } catch (err) {
      setError("서버 오류가 발생했습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
      <h3>튜터 예약</h3>

      <label>
        날짜:
        <input
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setTime(""); 
          }}
          required
        />
      </label>
      <br />

      
      <AvailableTimeSelect
        tutorId={tutorId}
        selectedDate={date}
        onTimeSelect={setTime}
      />
      <br />

      <label>
        요청사항:
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="예: 수업 전에 자료를 보내주세요"
        />
      </label>
      <br />

      <button type="submit">예약하기</button>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

export default BookingForm;