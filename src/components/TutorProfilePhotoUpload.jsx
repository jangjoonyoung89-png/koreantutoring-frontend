import React, { useState } from "react";

function TutorProfilePhotoUpload() {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    const res = await fetch("http://localhost:8000/tutors/upload-profile", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setImageUrl(data.imageUrl);
  };

  return (
    <div>
      <h3>프로필 사진 업로드</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit">업로드</button>
      </form>
      {imageUrl && (
        <div>
          <p>업로드 완료:</p>
          <img src={`http://localhost:8000${imageUrl}`} alt="프로필" width={200} />
        </div>
      )}
    </div>
  );
}

export default TutorProfilePhotoUpload;