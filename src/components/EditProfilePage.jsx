import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function EditProfilePage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    role: "student",
  });
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch(`http://localhost:8000/api/users/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setFormData(data);
    }

    if (user?.id) fetchUser();
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:8000/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("수정 실패");

      alert("프로필이 수정되었습니다.");
      navigate("/mypage");
    } catch (err) {
      setError(err.message || "오류 발생");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 20 }}>
      <h2>프로필 수정</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>이름</label>
        <input name="full_name" value={formData.full_name} onChange={handleChange} required />
        <br />
        <label>이메일</label>
        <input name="email" value={formData.email} onChange={handleChange} required />
        <br />
        <label>역할</label>
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="student">학생</option>
          <option value="tutor">튜터</option>
        </select>
        <br />
        <button type="submit">저장</button>
      </form>
    </div>
  );
}

export default EditProfilePage;

import EditProfilePage from "./components/EditProfilePage";

<Route
  path="/edit-profile"
  element={
    <RequireAuth>
      <EditProfilePage />
    </RequireAuth>
  }
/>