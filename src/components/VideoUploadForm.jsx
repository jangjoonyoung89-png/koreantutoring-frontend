import React, { useState } from "react";

export default function VideoUploadForm({ tutorId }) {
  const [videoFile, setVideoFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) {
      alert("비디오 파일을 선택해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("video", videoFile);

    try {
      const res = await fetch(`http://localhost:8000/api/tutors/${tutorId}/upload-video`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("영상 업로드 성공!");
      } else {
        setMessage(data.detail || "업로드 실패");
      }
    } catch (err) {
      setMessage("업로드 중 오류가 발생했습니다.");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <button type="submit">샘플 영상 업로드</button>
      {message && <p>{message}</p>}
    </form>
  );
}