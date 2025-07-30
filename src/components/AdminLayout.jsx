import React from "react";
import { Navigate } from "react-router-dom";

export default function AdminLayout({ children }) {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");
  const isAdmin = userData && JSON.parse(userData)?.role === "admin";

  if (!token || !isAdmin) {
    return <Navigate to="/admin/login" />;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav className="space-y-2">
          <a href="/admin/dashboard" className="block hover:underline">대시보드</a>
          <a href="/admin/users" className="block hover:underline">회원 목록</a>
          <a href="/admin/tutors" className="block hover:underline">튜터 목록</a>
          <a href="/admin/bookings" className="block hover:underline">예약 목록</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100">
        {/* Topbar */}
        <div className="flex justify-between items-center bg-white px-6 py-4 shadow">
          <h1 className="text-xl font-semibold">관리자 페이지</h1>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/admin/login";
            }}
          >
            로그아웃
          </button>
        </div>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}