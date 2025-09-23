import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import VideoClassPage from "./VideoClassPage";

// 샘플 테스트용 데이터
const sampleBooking = {
  _id: "sample-booking-1",
  tutorName: "장준영",
  studentName: "홍길동",
  time: new Date(Date.now() - 1000 * 60).toISOString(), // 지금보다 1분 전
  roomId: "SampleRoom123", // Jitsi 테스트 룸
  videoLink: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"
};

export default function VideoClassPageWrapper() {
  const { bookingId } = useParams();
  const { user } = useContext(AuthContext);

  const [classInfo, setClassInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [canEnter, setCanEnter] = useState(false);

  useEffect(() => {
    // 샘플 테스트용: bookingId가 "sample-booking-1"이면 sampleBooking 반환
    if (bookingId === "sample-booking-1") {
      if (!user) {
        setError("로그인 필요");
        setLoading(false);
        return;
      }

      setClassInfo(sampleBooking);
      const now = new Date();
      const startTime = new Date(sampleBooking.time);
      if (now >= startTime) setCanEnter(true);
      setLoading(false);
    } else {
      setError("샘플 예약이 아닙니다.");
      setLoading(false);
    }
  }, [bookingId, user]);

  if (loading) return <p style={{ textAlign: "center", marginTop: 50 }}>로딩 중...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center", marginTop: 50 }}>{error}</p>;
  if (!classInfo) return null;

  const { tutorName, studentName, time, roomId, videoLink } = classInfo;
  const jitsiUrl = roomId ? `https://meet.jit.si/${roomId}` : "";

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: 20 }}>🧑‍🏫 실시간 수업 (샘플)</h2>
      <p><strong>학생:</strong> {studentName}</p>
      <p><strong>튜터:</strong> {tutorName}</p>
      <p><strong>시간:</strong> {new Date(time).toLocaleString()}</p>

      {/* 샘플 영상 */}
      {videoLink && (
        <div style={{ border: "1px solid #ccc", borderRadius: 8, overflow: "hidden", marginTop: 20 }}>
          <video
            src={videoLink}
            controls
            style={{ width: "100%", height: "auto", borderRadius: 8 }}
          />
        </div>
      )}

      {/* Jitsi 입장 버튼 */}
      {!videoLink && (
        <button
          onClick={() => window.open(jitsiUrl, "_blank", "width=1280,height=800")}
          disabled={!canEnter || !roomId}
          style={{
            padding: "12px 24px",
            fontSize: "1rem",
            borderRadius: 8,
            backgroundColor: canEnter ? "#2563eb" : "#ccc",
            color: "white",
            border: "none",
            cursor: canEnter ? "pointer" : "not-allowed",
            marginTop: 20,
          }}
        >
          {canEnter ? "수업 입장하기" : "입장 가능 시간 전"}
        </button>
      )}

      {/* Jitsi iframe */}
      {canEnter && roomId && !videoLink && (
        <div style={{ border: "1px solid #ccc", borderRadius: 8, overflow: "hidden", marginTop: 20 }}>
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