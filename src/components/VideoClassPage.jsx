import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function VideoClassPage() {
  const { bookingId } = useParams();
  const [classInfo, setClassInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get(`/my-bookings/${bookingId}`)
      .then(res => {
        setClassInfo(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("수업 정보를 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      });
  }, [bookingId]);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const { tutorName, studentName, time, roomId } = classInfo;
  const jitsiUrl = `https://meet.jit.si/${roomId}`;

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h2>화상 수업</h2>
      <p><strong>학생:</strong> {studentName}</p>
      <p><strong>튜터:</strong> {tutorName}</p>
      <p><strong>시간:</strong> {time}</p>

      <div style={{ marginTop: 20 }}>
        <iframe
          src={jitsiUrl}
          allow="camera; microphone; fullscreen; display-capture"
          style={{ width: "100%", height: "600px", border: 0 }}
          title="화상 수업"
        />
      </div>
    </div>
  );
}