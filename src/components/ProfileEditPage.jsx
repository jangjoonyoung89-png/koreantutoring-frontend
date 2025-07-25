import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProfileEditPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    role: "student",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const token = localStorage.getItem("token");

    async function fetchUser() {
      try {
        const res = await fetch(`http://localhost:8000/api/users/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("사용자 정보를 불러오지 못했습니다.");
        const data = await res.json();
        setFormData({
          full_name: data.full_name,
          email: data.email,
          role: data.role,
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchUser();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:8000/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("프로필 수정에 실패했습니다.");
      alert("프로필이 성공적으로 수정되었습니다.");
      navigate("/mypage");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>로딩 중...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 20, fontFamily: "sans-serif" }}>
      <h2 style={{ textAlign: "center", marginBottom: 30 }}>프로필 수정</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 15 }}>
          <label htmlFor="full_name" style={{ display: "block", marginBottom: 5 }}>
            이름
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            value={formData.full_name}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label htmlFor="email" style={{ display: "block", marginBottom: 5 }}>
            이메일
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label htmlFor="role" style={{ display: "block", marginBottom: 5 }}>
            역할
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
          >
            <option value="student">학생</option>
            <option value="tutor">튜터</option>
          </select>
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            width: "100%",
            fontSize: 16,
          }}
        >
          저장하기
        </button>
      </form>
    </div>
  );
}

export default ProfileEditPage;