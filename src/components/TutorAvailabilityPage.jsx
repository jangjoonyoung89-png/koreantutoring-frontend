import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const timeSlots = [
  "09:00", "10:00", "11:00",
  "13:00", "14:00", "15:00",
  "16:00", "17:00", "18:00",
];

function TutorAvailabilityPage() {
  const { user } = useContext(AuthContext);
  const [availability, setAvailability] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // 기존 설정 불러오기
    async function fetchAvailability() {
      if (!user || user.role !== "tutor") return;

      const res = await fetch(`http://localhost:8000/api/tutors/${user.id}`);
      const data = await res.json();
      setAvailability(data.availableTimes || []);
    }

    fetchAvailability();
  }, [user]);

  const toggleSlot = (day, slot) => {
    setAvailability(prev => {
      const existingDay = prev.find(d => d.day === day);
      if (!existingDay) {
        return [...prev, { day, slots: [slot] }];
      }

      const hasSlot = existingDay.slots.includes(slot);
      const newSlots = hasSlot
        ? existingDay.slots.filter(s => s !== slot)
        : [...existingDay.slots, slot];

      return prev.map(d => (d.day === day ? { ...d, slots: newSlots } : d));
    });
  };

  const isSelected = (day, slot) => {
    const dayData = availability.find(d => d.day === day);
    return dayData?.slots.includes(slot);
  };

  const handleSubmit = async () => {
    const res = await fetch(`http://localhost:8000/api/tutors/${user.id}/availability`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ availableTimes: availability }),
    });

    if (res.ok) {
      setMessage("✅ 예약 가능 시간이 저장되었습니다.");
    } else {
      setMessage("❌ 저장 실패");
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: 20 }}>
      <h2>🗓️ 예약 가능 시간 설정</h2>
      <p>클릭해서 가능한 요일/시간을 선택하세요.</p>
      {message && <p style={{ color: message.startsWith("✅") ? "green" : "red" }}>{message}</p>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
        {daysOfWeek.map(day => (
          <div key={day}>
            <h4>{day}</h4>
            {timeSlots.map(slot => (
              <button
                key={slot}
                onClick={() => toggleSlot(day, slot)}
                style={{
                  margin: "4px",
                  padding: "6px 10px",
                  background: isSelected(day, slot) ? "#007bff" : "#eee",
                  color: isSelected(day, slot) ? "#fff" : "#000",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                {slot}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div style={{ marginTop: "30px" }}>
        <button onClick={handleSubmit} style={{ padding: "10px 20px", background: "#28a745", color: "#fff", border: "none", borderRadius: "6px" }}>
          저장하기
        </button>
      </div>
    </div>
  );
}

export default TutorAvailabilityPage;
