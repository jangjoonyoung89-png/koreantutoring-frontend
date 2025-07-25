import React, { useState } from "react";

function TutorProfileEditPage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("파일을 선택하세요.");
      return;
    }

    const formData = new FormData();
    formData.append("profile", file);

    try {
      const res = await fetch("http://localhost:8000/profile/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("업로드 실패");

      const data = await res.json();
      setMessage("업로드 완료!");
      setImageUrl(`http://localhost:8000/uploads/${data.filename}`);
    } catch (err) {
      setMessage("오류: " + err.message);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", padding: 20 }}>
      <h2>프로필 사진 업로드</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="file" name="profile" accept="image/*" onChange={handleFileChange} />
        <button type="submit" style={{ marginLeft: "10px" }}>업로드</button>
      </form>
      {message && <p style={{ marginTop: "20px", color: "green" }}>{message}</p>}
      {imageUrl && (
        <div style={{ marginTop: 20 }}>
          <img src={imageUrl} alt="프로필 사진" style={{ width: "100%", maxWidth: 300 }} />
        </div>
      )}
    </div>
  );
}

export default TutorProfileEditPage;