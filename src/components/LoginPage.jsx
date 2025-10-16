import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const API_URL = (process.env.REACT_APP_API_URL || "http://localhost:8000").trim();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError("");
    setSuccess("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = form.email.trim();
    const password = form.password.trim();

    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "로그인 실패");
        return;
      }

      const role = data.user.role?.trim().toLowerCase();

      if (role === "admin") {
        alert("⚠️ 관리자 계정은 관리자 전용 로그인 페이지에서 로그인해주세요.");
        navigate("/admin/login");
        return;
      }

      setSuccess("로그인 성공");
      localStorage.setItem("token", data.token);
      login({ user: data.user, token: data.token });

      if (role === "tutor") {
        navigate("/tutor/dashboard");
      } else {
        navigate("/student/mypage");
      }

    } catch (err) {
      console.error("서버 오류:", err);
      setError("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md p-6 sm:p-8 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">로그인</h2>
        {error && <p className="text-red-500 text-center mb-2">{error}</p>}
        {success && <p className="text-green-500 text-center mb-2">{success}</p>}
        <form className="flex flex-col" onSubmit={handleLogin}>
          <label className="mt-2 mb-1">이메일</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <label className="mt-2 mb-1">비밀번호</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="mt-4 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
          >
            로그인
          </button>
        </form>
        <div className="text-center mt-4">
          <Link to="/forgot-password" className="text-blue-500 hover:underline">
            비밀번호 찾기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;