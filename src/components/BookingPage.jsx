import React, { useState, useEffect } from "react";
import api from "../api"; // 통합 API 모듈 사용

function BookingPage() {
  const [tutorId, setTutorId] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const [disabledTimes, setDisabledTimes] = useState([]);

  // ---------------------------
  // 1️⃣ 선택한 튜터의 비활성화 시간 불러오기
  // ---------------------------
  useEffect(() => {
    const fetchDisabledTimes = async () => {
      if (!tutorId) {
        setDisabledTimes([]);
        return;
      }
      try {
        const { data } = await api.get(`/bookings/tutor/${tutorId}`);
        setDisabledTimes(data); // ['2025-08-15T10:00', ...]
      } catch (err) {
        console.error("비활성화 시간 가져오기 오류:", err);
      }
    };

    fetchDisabledTimes();
  }, [tutorId]);

  // ---------------------------
  // 2️⃣ 예약 생성
  // ---------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tutorId || !time) {
      setMessage("모든 항목을 입력해 주세요.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const bookingData = {
        tutor: tutorId,
        time,
      };

      await api.post("/bookings", bookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("✅ 예약이 완료되었습니다!");
      setTutorId("");
      setTime("");
      setDisabledTimes((prev) => [...prev, time]);
    } catch (err) {
      console.error("예약 오류:", err);
      setMessage(err.response?.data?.message || "서버 오류가 발생했습니다.");
    }
  };

  const isDisabledTime = (inputTime) => disabledTimes.includes(inputTime);

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>수업 예약</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 10 }}>
          <label>튜터 ID:</label>
          <input
            type="text"
            value={tutorId}
            onChange={(e) => setTutorId(e.target.value)}
            placeholder="예: 66bca24e6f6e3b1f44a9a111"
            style={{ width: "100%", padding: 5, marginTop: 5 }}
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>예약 시간:</label>
          <input
            type="datetime-local"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            style={{ width: "100%", padding: 5, marginTop: 5 }}
          />
          {isDisabledTime(time) && (
            <p style={{ color: "red", marginTop: 5 }}>이미 예약된 시간입니다.</p>
          )}
        </div>
        <button
          type="submit"
          style={{ marginTop: 10, padding: "8px 12px", cursor: "pointer" }}
          disabled={isDisabledTime(time)}
        >
          예약하기
        </button>
      </form>
    </div>
  );
}

export default BookingPage;