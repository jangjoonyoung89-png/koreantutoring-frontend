// src/Signup.js
import React, { useState } from 'react';
import axios from 'axios';

function Signup() {
  // 입력값 상태(state) 관리
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // 폼 제출 처리 함수
  const handleSubmit = async (e) => {
    e.preventDefault(); // 페이지 새로고침 막기

    // 간단한 입력 확인
    if (!name || !email || !password) {
      setMessage('모든 항목을 입력해 주세요.');
      return;
    }

    try {
      // 백엔드 회원가입 API 호출
      const response = await axios.post('http://localhost:8000/auth/signup', {
        full_name: name,
        email,
        password,
        role: 'student'
        }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      setMessage(response.data.message); // 성공 메시지 보여주기
      // 입력창 초기화
      setName('');
      setEmail('');
      setPassword('');
    } catch (error) {
      setMessage('회원가입 중 오류가 발생했습니다.');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>이름:</label><br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력하세요"
          />
        </div>
        <div>
          <label>이메일:</label><br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력하세요"
          />
        </div>
        <div>
          <label>비밀번호:</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
          />
        </div>
        <button type="submit">회원가입</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Signup;