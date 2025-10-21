import React, { useState } from "react";

function ScheduleLesson({ tutorId, studentId }) {
  const [startTime, setStartTime] = useState("");
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

  const handleSchedule = async () => {
    const res = await fetch(`${API_URL}/lesson/schedule`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tutorId,
        studentId,
        topic: "Korean Tutoring 수업",
        startTime,
        duration: 60,
      }),
    });

    const data = await res.json();
    if (res.ok) alert("수업 예약 완료!");
    else alert(data.detail);
  };

  return (
    <div>
      <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
      <button onClick={handleSchedule}>예약</button>
    </div>
  );
}

export default ScheduleLesson;