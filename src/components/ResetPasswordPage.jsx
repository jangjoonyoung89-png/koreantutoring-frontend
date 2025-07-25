import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("유효하지 않은 접근입니다.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "오류 발생");

      setMessage("비밀번호가 성공적으로 변경되었습니다.");
      setTimeout(() => navigate("/login"), 3000); // 3초 뒤 로그인 페이지로
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", padding: 20 }}>
      <h2>🔒 비밀번호 재설정</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message ? (
        <p style={{ color: "green" }}>{message}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>새 비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <br />
          <label>비밀번호 확인</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          <br />
          <button type="submit">재설정</button>
        </form>
      )}
    </div>
  );
}

export default ResetPasswordPage;