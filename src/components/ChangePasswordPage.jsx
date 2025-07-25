import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function ChangePasswordPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.newPassword !== form.confirmNewPassword) {
      return setError("새 비밀번호가 일치하지 않습니다.");
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/api/users/${user.id}/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "비밀번호 변경 실패");
      }

      alert("비밀번호가 변경되었습니다. 다시 로그인해 주세요.");
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", padding: 20 }}>
      <h2>🔒 비밀번호 변경</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>현재 비밀번호</label>
        <input type="password" name="currentPassword" value={form.currentPassword} onChange={handleChange} required />
        <br />
        <label>새 비밀번호</label>
        <input type="password" name="newPassword" value={form.newPassword} onChange={handleChange} required />
        <br />
        <label>새 비밀번호 확인</label>
        <input type="password" name="confirmNewPassword" value={form.confirmNewPassword} onChange={handleChange} required />
        <br />
        <button type="submit">비밀번호 변경</button>
      </form>
    </div>
  );
}

export default ChangePasswordPage;