import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminLoginPage() {
  const [username, setUsername] = useState("");  // 입력 초기값
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useAuth();

  // 환경변수에서 API URL 가져오기 (배포/로컬 모두 대응)
  const API_URL = (process.env.REACT_APP_API_URL || "http://localhost:8000").trim();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // -----------------------------
      // 관리자 로그인 API 호출
      // -----------------------------
      const res = await axios.post(`${API_URL}/admin/login`, {
        username,
        password,
      });

      // 샘플 계정용 처리
      const token = res.data.token || "admin-token";
      const user = { username, role: "admin" };

      // -----------------------------
      // role 체크 (관리자가 아니면 거부)
      // -----------------------------
      if (user.role.toLowerCase() !== "admin") {
        setError("관리자 계정만 로그인할 수 있습니다.");
        return;
      }

      // -----------------------------
      // 토큰 저장 (학생/튜터와 구분)
      // -----------------------------
      localStorage.setItem("adminToken", token);

      // axios 기본 헤더 설정
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // 전역 상태에도 관리자 등록
      setUser(user);

      // 관리자 대시보드로 이동
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
          className={`w-full p-2 rounded text-white ${loading ? "bg-gray-500" : "bg-blue-600"}`}
          disabled={loading}
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
}

export default AdminLoginPage;