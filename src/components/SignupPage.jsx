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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(form.email)) return setError("유효한 이메일을 입력하세요.");
    if (form.password.length < 8) return setError("비밀번호는 최소 8자 이상이어야 합니다.");
    if (!form.fullName) return setError("이름을 입력하세요.");

    // ✅ 반드시 try 다음에 catch 붙이기!
    try {
      const res = await fetch("http://localhost:8000/auth/signup", {
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
        setSuccess("회원가입 완료!");
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

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>회원가입</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <label>이메일</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} required />
        <label>비밀번호</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} required />
        <label>이름</label>
        <input name="fullName" type="text" value={form.fullName} onChange={handleChange} required />
        <label>역할</label>
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="student">학생</option>
          <option value="tutor">튜터</option>
        </select>
        <button type="submit" style={{ marginTop: 10 }}>가입하기</button>
      </form>
    </div>
  );
}

export default SignupPage;
