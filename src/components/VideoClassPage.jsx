import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function VideoClassPage() {
  const { bookingId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [classInfo, setClassInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [canEnter, setCanEnter] = useState(false);

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const res = await axios.get(`/my-bookings/${bookingId}`);
        const data = res.data;

        // 로그인 사용자 정보와 예약 사용자 비교
        if (!user) {
          setError("로그인이 필요합니다.");
          setLoading(false);
          return;
        }

        const userId = user._id;
        const isStudent = user.role === "student";
        const isTutor = user.role === "tutor";

        const authorized =
          (isStudent && userId === data.studentId) ||
          (isTutor && userId === data.tutorId);

        if (!authorized) {
          setError("접근 권한이 없습니다. 예약된 사용자만 입장 가능합니다.");
          setLoading(false);
          return;
        }

        setClassInfo(data);

        // 수업 시작 시간 체크
        const now = new Date();
        const startTime = new Date(data.time);
        if (now >= startTime) {
          setCanEnter(true);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("수업 정보를 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      }
    };

    fetchClass();
  }, [bookingId, user]);

  if (loading) return <p style={{ textAlign: "center", marginTop: 50 }}>로딩 중...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center", marginTop: 50 }}>{error}</p>;
  if (!classInfo) return null;

  const { tutorName, studentName, time, roomId } = classInfo;
  const jitsiUrl = `https://meet.jit.si/${roomId}`;

  const handleEnter = () => {
    window.open(jitsiUrl, "_blank", "width=1280,height=800");
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: 20 }}>
        🧑‍🏫 실시간 한국어 수업
      </h2>

      <div style={{ marginBottom: 20 }}>
        <p><strong>학생:</strong> {studentName}</p>
        <p><strong>튜터:</strong> {tutorName}</p>
        <p><strong>시간:</strong> {new Date(time).toLocaleString()}</p>
      </div>

      <button
        onClick={handleEnter}
        disabled={!canEnter}
        style={{
          padding: "12px 24px",
          fontSize: "1rem",
          borderRadius: 8,
          backgroundColor: canEnter ? "#2563eb" : "#ccc",
          color: "white",
          border: "none",
          cursor: canEnter ? "pointer" : "not-allowed",
          marginBottom: 20,
          transition: "all 0.3s",
        }}
      >
        {canEnter ? "수업 입장하기" : "입장 가능 시간 전입니다"}
      </button>

      {canEnter && (
        <div style={{ border: "1px solid #ccc", borderRadius: 8, overflow: "hidden" }}>
          <iframe
            src={jitsiUrl}
            allow="camera; microphone; fullscreen; display-capture"
            style={{ width: "100%", height: "600px", border: "none" }}
            title="화상 수업"
          />
        </div>
      )}
    </div>
  );
}