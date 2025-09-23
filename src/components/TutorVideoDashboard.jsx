import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:8000"); // 서버 주소

export default function TutorVideoDashboard({ tutorId }) {
  const [videos, setVideos] = useState([]);
  const [file, setFile] = useState(null);
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const [peerConnection, setPeerConnection] = useState(null);
  const [loading, setLoading] = useState(false);
  const roomId = tutorId;

  useEffect(() => {
    fetchVideos();
    socket.emit("join-room", { roomId, userId: "tutor_" + tutorId });

    socket.on("user-connected", (userId) => {
      console.log(userId, "접속");
      startCall();
    });

    socket.on("signal", async ({ signal }) => {
      await peerConnection?.setRemoteDescription(signal);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await axios.get(`/api/videos/${tutorId}/videos`);
      setVideos(res.data.videos || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("파일 선택 필요");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("video", file);
      const res = await axios.post(`/api/videos/${tutorId}/upload-video`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(res.data.message);
      setFile(null);
      fetchVideos();
    } catch (err) {
      console.error(err);
      alert("업로드 실패");
    } finally {
      setLoading(false);
    }
  };

  const startCall = async () => {
    const pc = new RTCPeerConnection();
    setPeerConnection(pc);

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideoRef.current.srcObject = stream;
    stream.getTracks().forEach(track => pc.addTrack(track, stream));

    pc.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit("signal", offer);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">튜터 영상 관리 & 실시간 수업</h1>

      {/* 업로드 영역 */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">📤 샘플 영상 업로드</h2>
        <div className="flex gap-4 items-center">
          <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files[0])} />
          <button
            onClick={handleUpload}
            className={`px-4 py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-blue-500"}`}
            disabled={loading}
          >
            {loading ? "업로드 중..." : "업로드"}
          </button>
        </div>
      </div>

      {/* 업로드된 영상 리스트 */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">🎬 업로드된 샘플 영상</h2>
        {videos.length === 0 ? (
          <p className="text-gray-500">업로드된 영상이 없습니다.</p>
        ) : (
          <div className="flex flex-wrap gap-4">
            {videos.map((url, idx) => (
              <video
                key={idx}
                src={url}
                controls
                width="250"
                className="rounded border"
              />
            ))}
          </div>
        )}
      </div>

      {/* 실시간 수업 */}
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-xl font-semibold mb-2">🧑‍🏫 실시간 수업</h2>
        <div className="flex gap-4 flex-wrap">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            width="300"
            className="rounded border"
          />
          <video
            ref={remoteVideoRef}
            autoPlay
            width="300"
            className="rounded border"
          />
        </div>
      </div>
    </div>
  );
}