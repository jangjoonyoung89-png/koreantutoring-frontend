import React, { useEffect, useState } from "react";

function TutorUploadBoard() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [posts, setPosts] = useState([]);

  const tutorId = localStorage.getItem("userId"); // 튜터 ID 불러오기

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("tutorId", tutorId);
    if (file) formData.append("file", file);

    const res = await fetch("http://localhost:8000/api/posts", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("자료 업로드 완료");
      setTitle("");
      setContent("");
      setFile(null);
      fetchPosts(); // 목록 새로고침
    } else {
      alert("업로드 실패");
    }
  };

  const fetchPosts = async () => {
    const res = await fetch("http://localhost:8000/api/posts");
    const data = await res.json();
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: 20 }}>
      <h2>📁 수업 자료 게시판</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <textarea
          placeholder="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ marginBottom: 8 }}
        />
        <button type="submit">자료 업로드</button>
      </form>

      <ul>
        {posts.map((post) => (
          <li key={post._id} style={{ borderBottom: "1px solid #ccc", marginBottom: 10 }}>
            <h4>{post.title}</h4>
            <p>{post.content}</p>
            {post.filePath && (
              <a
                href={`http://localhost:8000/${post.filePath}`}
                target="_blank"
                rel="noreferrer"
                style={{ color: "blue" }}
              >
                파일 다운로드
              </a>
            )}
            <p style={{ fontSize: 12, color: "gray" }}>
              등록일: {new Date(post.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TutorUploadBoard;