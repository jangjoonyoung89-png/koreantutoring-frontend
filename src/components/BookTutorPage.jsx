import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import BookingForm from "./BookingForm";
import TutorCalendarBooking from "./TutorCalendarBooking";

function BookTutorPage() {
  const { id: tutorId } = useParams();
  const { user } = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");

  const handleSlotSelect = (date, time) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <h2>튜터 예약 페이지</h2>
      <TutorCalendarBooking tutorId={tutorId} onSelect={handleSlotSelect} />

      {selectedDate && selectedTime && (
        <>
          <hr />
          <h4>📝 예약 정보 입력</h4>
          <BookingForm
            studentId={user.id}
            tutorId={tutorId}
            defaultDate={selectedDate}
            defaultTime={selectedTime}
          />
        </>
      )}
    </div>
  );
}

export default BookTutorPage;