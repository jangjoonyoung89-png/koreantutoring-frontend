import React, { useState } from "react";
import axios from "axios";

function PostCreateForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (image) {
        formData.append("image", image);
      }

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/posts`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setMessage("게시글이 성공적으로 등록되었습니다!");
      setTitle("");
      setContent("");
      setImage(null);
    } catch (error) {
      console.error(error);
      setMessage("게시글 등록에 실패했습니다.");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2>게시글 작성</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label>내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="5"
            required
          ></textarea>
        </div>

        <div>
          <label>이미지 업로드</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <button type="submit">등록</button>
      </form>
    </div>
  );
}

export default PostCreateForm;