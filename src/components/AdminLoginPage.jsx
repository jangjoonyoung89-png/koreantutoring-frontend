import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminLoginPage() {
  const [username, setUsername] = useState("admin"); // 기본 테스트용
  const [password, setPassword] = useState("1234");  // 기본 테스트용
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 🔹 관리자 로그인 API 호출
      const res = await axios.post("http://localhost:8000/admin/login", {
        username,
        password,
      });

      // 🔹 토큰 저장 (튜터/학생과 구분되도록 별도 key 사용)
      localStorage.setItem("adminToken", res.data.token);

      // 🔹 axios 기본 헤더 세팅
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${res.data.token}`;

      // 🔹 관리자 대시보드로 이동 (튜터 대시보드 절대 아님!)
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      console.error("Admin login error:", err);

      if (err.response) {
        setError(err.response.data?.message || "로그인 실패");
      } else {
        setError("서버 연결 실패");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4 text-center">관리자 로그인</h2>

      {error && (
        <p className="text-red-500 text-sm mb-2 text-center">{error}</p>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="text"
          placeholder="아이디 (예: admin)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="password"
          placeholder="비밀번호 (예: 1234)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <button
          type="submit"
          className={`w-full p-2 rounded text-white ${
            loading ? "bg-gray-500" : "bg-blue-600"
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