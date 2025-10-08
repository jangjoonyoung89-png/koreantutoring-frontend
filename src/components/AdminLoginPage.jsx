import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const API_URL = (process.env.REACT_APP_API_URL || "http://localhost:8000").trim();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/admin/login`, { username, password });
      const { token, user } = res.data;

      if (!user || user.role.toLowerCase() !== "admin") {
        setError("관리자 계정만 로그인할 수 있습니다.");
        setLoading(false);
        return;
      }

      login({ user, token });
      navigate("/admin/dashboard", { replace: true });

    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) setError(err.response.data.message);
      else setError("서버 연결 실패 또는 로그인 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          관리자 로그인
        </h2>
        {error && <p className="text-red-500 text-center mb-4 font-semibold">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-600 text-sm mb-1">아이디</label>
            <input
              type="text"
              placeholder="예: admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 text-sm mb-1">비밀번호</label>
            <input
              type="password"
              placeholder="예: 1234"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full p-3 rounded-lg text-white font-semibold transition-all duration-200 ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLoginPage;