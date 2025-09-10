import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

export default function AdminVideoChannels() {
  const [channels, setChannels] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      setIsAuthorized(false);
      return;
    }

    try {
      const user = JSON.parse(userData);
      if (user.role !== "admin") setIsAuthorized(false);
    } catch {
      setIsAuthorized(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      axios
        .get("http://localhost:8000/api/admin/video-channels")
        .then((res) => setChannels(res.data))
        .catch((err) => console.error("영상 채널 불러오기 실패", err));
    }
  }, [isAuthorized]);

  if (!isAuthorized) return <Navigate to="/admin/login" />;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">실시간 영상 채널</h2>
      {channels.length === 0 ? (
        <p>현재 활성화된 영상 채널이 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {channels.map((channel) => (
            <div key={channel._id} className="border rounded p-2">
              <h3 className="font-semibold mb-2">{channel.name}</h3>
              <video
                src={channel.streamUrl}
                controls
                autoPlay
                className="w-full h-64"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}