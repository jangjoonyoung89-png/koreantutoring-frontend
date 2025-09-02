import React, { useState } from "react";

function SignupPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
    role: "student",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 환경변수에서 API URL 불러오기 (없으면 localhost 기본값 사용)
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(form.email)) return setError("유효한 이메일을 입력하세요.");
    if (form.password.length < 8)
      return setError("비밀번호는 최소 8자 이상이어야 합니다.");
    if (!form.fullName) return setError("이름을 입력하세요.");

    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          full_name: form.fullName,
          role: form.role,
        }),
      });

      if (res.ok) {
        setSuccess("✅ 회원가입 완료!");
        setForm({ email: "", password: "", fullName: "", role: "student" });
      } else {
        const data = await res.json();
        setError(data.detail || "회원가입 실패");
      }
    } catch (err) {
      console.error("서버 오류:", err);
      setError("서버 오류가 발생했습니다.");
    }
  };

  const formStyle = {
    maxWidth: "400px",
    margin: "40px auto",
    padding: "30px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    borderRadius: "10px",
    backgroundColor: "#fff",
    fontFamily: "Arial, sans-serif",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginTop: "5px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold",
    fontSize: "14px",
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer",
  };

  const messageStyle = (color) => ({
    color,
    marginBottom: "15px",
    fontWeight: "bold",
  });

  return (
    <div style={formStyle}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>회원가입</h2>
      {error && <p style={messageStyle("red")}>{error}</p>}
      {success && <p style={messageStyle("green")}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <label style={labelStyle}>이메일</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          style={inputStyle}
          required
        />

        <label style={labelStyle}>비밀번호</label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          style={inputStyle}
          required
        />

        <label style={labelStyle}>이름</label>
        <input
          name="fullName"
          type="text"
          value={form.fullName}
          onChange={handleChange}
          style={inputStyle}
          required
        />

        <label style={labelStyle}>역할</label>
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="student">학생</option>
          <option value="tutor">튜터</option>
        </select>

        <button type="submit" style={buttonStyle}>
          가입하기
        </button>
      </form>
    </div>
  );
}

export default SignupPage;