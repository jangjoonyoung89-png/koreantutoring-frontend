import React, { useState } from "react";
import axios from "axios";

export default function CreatePostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (file) formData.append("file", file);

    try {
      await axios.post("/api/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Post created successfully!");
      setTitle("");
      setContent("");
      setFile(null);
    } catch (error) {
      console.error(error);
      alert("Failed to create post.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Content:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      <div>
        <label>File:</label>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      </div>
      <button type="submit">Create Post</button>
    </form>
  );
}