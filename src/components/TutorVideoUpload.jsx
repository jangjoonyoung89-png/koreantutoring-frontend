import React, { useState } from "react";

function TutorVideoUpload({ tutorId }) {
  const [videoFile, setVideoFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!videoFile) return alert("영상을 선택해 주세요.");

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("tutorId", tutorId);

    try {
      const res = await fetch("http://localhost:8000/api/tutors/upload-video", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ 업로드 완료");
      } else {
        setMessage("❌ 업로드 실패: " + data.error);
      }
    } catch (err) {
      setMessage("❌ 오류 발생: " + err.message);
    }
  };

  return (
    <div>
      <h3>🎬 샘플 영상 업로드</h3>
      <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} />
      <button onClick={handleUpload} style={{ marginLeft: 10 }}>
        업로드
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default TutorVideoUpload;