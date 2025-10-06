import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

function AdminLoginPage() {
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [error, setError] = useState(""); 
  const [loading, setLoading] = useState(false); 

  const navigate = useNavigate();
  const { login } = useAdminAuth();

  const API_URL = (process.env.REACT_APP_API_URL || "http://localhost:8000").trim();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 서버 관리자 로그인 API 호출
      const res = await axios.post(`${API_URL}/admin/login`, { username, password });

      const { token, user } = res.data;

      // 관리자 role 확인
      if (!user || user.role.toLowerCase() !== "admin") {
        setError("관리자 계정만 로그인할 수 있습니다.");
        setLoading(false);
        return;
      }

      // 전역 AdminAuthContext에 저장
      login({ user, token });

      // 관리자 대시보드 이동
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      console.error("Admin login error:", err);
      if (err.response) setError(err.response.data?.message || "로그인 실패");
      else setError("서버 연결 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">관리자 로그인</h2>

      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="text"
          placeholder="아이디 (예: admin)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border p-3 rounded focus:outline-none focus:ring focus:border-blue-400"
          required
        />

        <input
          type="password"
          placeholder="비밀번호 (예: 1234)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-3 rounded focus:outline-none focus:ring focus:border-blue-400"
          required
        />

        <button
          type="submit"
          className={`w-full p-3 rounded text-white font-semibold ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={loading}
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
}

export default AdminLoginPage;