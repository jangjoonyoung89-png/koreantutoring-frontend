import React, { useState } from "react";
import axios from "axios";

export default function SignupTest() {
  const [email, setEmail] = useState("test@email.com");
  const [password, setPassword] = useState("12345678");
  const [fullName, setFullName] = useState("홍길동");
  const [role, setRole] = useState("student");

  const handleSignup = async () => {
    try {
      const res = await axios.post("http://localhost:8000/auth/SignupPage", {
        email,
        password,
        full_name: fullName,
        role,
      });
      alert("✅ 회원가입 성공");
    } catch (err) {
      console.error("에러 상세:", err);
      alert("❌ 에러: " + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>회원가입 테스트</h2>
      <div>
        <label>이메일</label><br />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%" }}
        />
      </div>
      <div>
        <label>비밀번호</label><br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%" }}
        />
      </div>
      <div>
        <label>이름</label><br />
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          style={{ width: "100%" }}
        />
      </div>
      <div>
        <label>역할 (role)</label><br />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ width: "100%" }}
        >
          <option value="student">학생</option>
          <option value="tutor">튜터</option>
        </select>
      </div>
      <button onClick={handleSignup} style={{ marginTop: 20, width: "100%" }}>
        회원가입 요청 보내기
      </button>
    </div>
  );
}