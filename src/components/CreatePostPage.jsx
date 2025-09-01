import React, { useState } from "react";
import axios from "axios";

function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    try {
      setLoading(true);

      // FormData 사용 (파일 업로드 가능)
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (file) {
        formData.append("file", file);
      }

      // API 요청
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/posts`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("게시글이 성공적으로 작성되었습니다!");
      console.log(res.data);

      // 폼 초기화
      setTitle("");
      setContent("");
      setFile(null);
    } catch (error) {
      console.error(error);
      alert("게시글 작성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2>게시글 작성</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
        </div>

        <div>
          <label>내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
            style={{ width: "100%", padding: "8px", minHeight: "150px", marginBottom: "10px" }}
          ></textarea>
        </div>

        <div>
          <label>파일 업로드 (선택)</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ marginBottom: "10px" }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ padding: "10px 20px", cursor: "pointer" }}
        >
          {loading ? "작성 중..." : "작성하기"}
        </button>
      </form>
    </div>
  );
}

export default CreatePostPage;