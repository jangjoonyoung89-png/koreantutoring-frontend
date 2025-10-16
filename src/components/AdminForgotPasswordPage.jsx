import React, { useState } from "react";
import { Link } from "react-router-dom";

function AdminForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const API_URL = (process.env.REACT_APP_API_URL || "http://localhost:8000").trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/admin/auth/request-reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "전송 실패");

      setMessage(data.message || "재설정 링크가 전송되었습니다.");
      setError("");
    } catch (err) {
      setError(err.message || "오류가 발생했습니다.");
      setMessage("");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md p-6 sm:p-8 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">🔑 관리자 비밀번호 찾기</h2>

        {message && <p className="text-green-500 text-center mb-2">{message}</p>}
        {error && <p className="text-red-500 text-center mb-2">{error}</p>}

        <form className="flex flex-col" onSubmit={handleSubmit}>
          <label className="mt-2 mb-1">관리자 이메일 입력</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="mt-4 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
          >
            재설정 링크 전송
          </button>
        </form>

        <div className="text-center mt-4">
          <Link to="/admin/login" className="text-blue-500 hover:underline">
            로그인 화면으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminForgotPasswordPage;