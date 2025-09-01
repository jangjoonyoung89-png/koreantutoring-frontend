import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function PostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/posts');
      setPosts(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const submitPost = async () => {
    if (!title) {
      alert('제목을 입력하세요.');
      return;
    }
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (file) formData.append('file', file);

    try {
      await axios.post('http://localhost:8000/api/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('게시글이 등록되었습니다.');
      setTitle('');
      setContent('');
      setFile(null);
      fetchPosts();
    } catch (error) {
      alert('오류가 발생했습니다.');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>수업 자료 게시판 글쓰기</h2>
      <input
        type="text"
        placeholder="제목"
        value={title}
        onChange={e => setTitle(e.target.value)}
      /><br />
      <textarea
        placeholder="내용"
        value={content}
        onChange={e => setContent(e.target.value)}
      /><br />
      <input type="file" onChange={e => setFile(e.target.files[0])} /><br />
      <button onClick={submitPost}>작성 완료</button>

      <hr />
      <h3>게시글 목록</h3>
      <ul>
        {posts.map(post => (
          <li key={post._id}>
            <strong>{post.title}</strong> ({new Date(post.createdAt).toLocaleString()})<br />
            {post.content}<br />
            {post.filePath && (
              <a href={`http://localhost:8000${post.filePath}`} target="_blank" rel="noreferrer">
                자료 다운로드
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}