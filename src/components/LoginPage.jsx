import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { login } = useContext(AuthContext); 
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "로그인 실패");
        return;
      }

      setSuccess("로그인 성공");
      console.log("🔐 로그인된 사용자:", data.user);
      console.log("📦 받은 토큰:", data.token);

      localStorage.setItem("token", data.token);

      login({
        token: data.token,
        user: data.user,
      });

    navigate("/dashboard");

    } catch (err) {
      console.error("서버 오류:", err);
      setError("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>로그인</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleLogin}>
        <label>이메일</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <label>비밀번호</label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" style={{ marginTop: 10 }}>로그인</button>
      </form>
    </div>
  );
}

export default LoginPage;