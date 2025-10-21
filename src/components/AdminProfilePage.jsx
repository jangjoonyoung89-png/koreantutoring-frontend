import React, { useState } from "react";

export default function AdminProfilePage() {
  const [form, setForm] = useState({ newEmail: "", newPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.newEmail && !form.newPassword) return setError("이메일 또는 비밀번호를 입력하세요.");

    try {
      const res = await fetch(`${API_URL}/admin/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // 로그인 토큰 필요하면 여기에 넣기
          // "Authorization": `Bearer ${localStorage.getItem("adminToken")}`
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) setMessage(data.message);
      else setError(data.message || "업데이트 실패");
    } catch (err) {
      console.error(err);
      setError("서버 오류 발생");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">관리자 계정 변경</h2>
      {message && <p className="text-green-600 mb-2">{message}</p>}
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">새 이메일</label>
          <input
            type="email"
            name="newEmail"
            value={form.newEmail}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">새 비밀번호</label>
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          업데이트
        </button>
      </form>
    </div>
  );
}
