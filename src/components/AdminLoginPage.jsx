import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

function AdminLoginPage() {
  // ------------------------------
  // 🧠 상태 관리
  // ------------------------------
  const [email, setEmail] = useState(""); // 이메일
  const [password, setPassword] = useState(""); // 비밀번호
  const [error, setError] = useState(""); // 에러 메시지
  const [loading, setLoading] = useState(false); // 로딩 상태

  const { login } = useAdminAuth(); // 관리자 인증 컨텍스트
  const navigate = useNavigate();

  // ------------------------------
  // 🌐 API 기본 URL
  // ------------------------------
  const API_URL = (
  process.env.REACT_APP_API_URL || "https://api.rokmun.com"
).trim();

  // ------------------------------
  // 🔐 로그인 처리 함수
  // ------------------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 서버에 로그인 요청
      const res = await axios.post(`${API_URL}/admin/login`, {
  email: email.trim().toLowerCase(),
  password,
});

      const { token, user } = res.data;

      // 관리자 계정인지 확인
      if (!user || user.role?.toLowerCase() !== "admin") {
        setError("관리자 계정만 로그인할 수 있습니다.");
        setLoading(false);
        return;
      }

      // 로그인 성공 시 Context 및 로컬 스토리지에 저장
      login({ user, token });

      // 로그인 성공 후 이동
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      console.error("❌ 관리자 로그인 오류:", err);

      // 백엔드에서 반환한 에러 메시지 처리
      if (err.response?.data?.detail || err.response?.data?.message) {
  setError(
    err.response.data.detail || err.response.data.message
  );
}
      else if (err.code === "ERR_NETWORK") {
        setError("서버 연결에 실패했습니다. 서버가 실행 중인지 확인하세요.");
      } else {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------
  // 💅 UI 렌더링
  // ------------------------------
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        {/* 제목 */}
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          🛡 관리자 로그인
        </h2>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-md mb-4 text-center font-medium border border-red-300">
            {error}
          </div>
        )}

        {/* 로그인 폼 */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* 이메일 입력 */}
          <div>
            <label className="block text-gray-600 text-sm mb-1">이메일</label>
            <input
              type="email"
              placeholder="예: admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
          </div>

          {/* 비밀번호 입력 */}
          <div>
            <label className="block text-gray-600 text-sm mb-1">비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 rounded-lg text-white font-semibold transition-all duration-200 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow-md"
            }`}
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        {/* 추가 안내 */}
        <p className="text-center text-gray-500 text-sm mt-5">
          관리 전용 페이지입니다. 일반 사용자는 접근할 수 없습니다.
        </p>

        {/* 비밀번호 찾기 링크 */}
        <div className="text-center mt-3">
          <Link
            to="/admin/forgot-password"
            className="text-blue-500 hover:underline text-sm"
          >
            비밀번호 찾기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;