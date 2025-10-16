import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";

function AdminResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const API_URL = (process.env.REACT_APP_API_URL || "http://localhost:8000").trim();

  useEffect(() => {
    if (!token) {
      setError("유효하지 않은 접근입니다.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("비밀번호가 일치하지 않습니다.");
      setMessage("");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/admin/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "오류 발생");

      setMessage("비밀번호가 성공적으로 변경되었습니다. 3초 후 로그인 화면으로 이동합니다.");
      setError("");
      setTimeout(() => navigate("/admin/login"), 3000);
    } catch (err) {
      setError(err.message || "오류가 발생했습니다.");
      setMessage("");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md p-6 sm:p-8 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">🔒 관리자 비밀번호 재설정</h2>

        {error && <p className="text-red-500 text-center mb-2">{error}</p>}
        {message && <p className="text-green-500 text-center mb-2">{message}</p>}

        {!message && !error && (
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <label className="mt-2 mb-1">새 비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <label className="mt-2 mb-1">비밀번호 확인</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button
              type="submit"
              className="mt-4 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
            >
              재설정
            </button>
          </form>
        )}

        <div className="text-center mt-4">
          <Link to="/admin/login" className="text-blue-500 hover:underline">
            로그인 화면으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminResetPasswordPage;