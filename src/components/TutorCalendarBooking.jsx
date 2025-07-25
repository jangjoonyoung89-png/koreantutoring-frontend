import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function TutorCalendarBooking({ tutorId, onSelect }) {
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    async function fetchAvailability() {
      const res = await fetch(`http://localhost:8000/tutors/${tutorId}/availability`);
      const data = await res.json();
      setAvailableTimes(data.availableTimes); // [{ day: "Monday", slots: ["10:00", "11:00"] }]
    }
    fetchAvailability();
  }, [tutorId]);

  const getDayName = (date) =>
    new Date(date).toLocaleDateString("en-US", { weekday: "long" }); // e.g., "Monday"

  const onDateChange = (date) => {
    setSelectedDate(date);
    const dayName = getDayName(date);
    const found = availableTimes.find((item) => item.day === dayName);
    setSlots(found ? found.slots : []);
  };

  return (
    <div>
      <h4>📅 예약 가능한 날짜 선택</h4>
      <Calendar onChange={onDateChange} value={selectedDate} />

      {selectedDate && (
        <div style={{ marginTop: 20 }}>
          <h5>{selectedDate.toLocaleDateString()} 예약 가능한 시간:</h5>
          {slots.length > 0 ? (
            <ul>
              {slots.map((time) => (
                <li key={time}>
                  <button onClick={() => onSelect(selectedDate, time)}>{time}</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>예약 가능한 시간이 없습니다.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default TutorCalendarBooking;
