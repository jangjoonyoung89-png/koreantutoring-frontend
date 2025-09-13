import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(true);
  const navigate = useNavigate();

  // 로그아웃 처리
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login");
  };

  // 권한 확인
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      setIsAuthorized(false);
      return;
    }

    try {
      const user = JSON.parse(userData);
      if (user.role !== "admin") {
        setIsAuthorized(false);
      }
    } catch {
      setIsAuthorized(false);
    }
  }, []);

  // 통계 가져오기
  useEffect(() => {
    if (isAuthorized) {
      axios
        .get("http://localhost:8000/api/stats/admin")
        .then((res) => setStats(res.data))
        .catch((err) => {
          console.error("통계 로드 실패", err);
          setStats(null);
        });
    }
  }, [isAuthorized]);

  if (!isAuthorized) return <Navigate to="/admin/login" />;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* 상단 */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">관리자 대시보드</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"
        >
          로그아웃
        </button>
      </div>

      {/* 메뉴 링크 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Link
          to="/admin/users"
          className="bg-white shadow hover:shadow-lg rounded p-4 text-center text-blue-600 font-medium"
        >
          회원 목록
        </Link>
        <Link
          to="/admin/tutors"
          className="bg-white shadow hover:shadow-lg rounded p-4 text-center text-blue-600 font-medium"
        >
          튜터 목록
        </Link>
        <Link
          to="/admin/bookings"
          className="bg-white shadow hover:shadow-lg rounded p-4 text-center text-blue-600 font-medium"
        >
          전체 예약
        </Link>
        <Link
          to="/admin/videos"
          className="bg-white shadow hover:shadow-lg rounded p-4 text-center text-blue-600 font-medium"
        >
          실시간 영상
        </Link>
      </div>

      {/* 통계 카드 */}
      {stats ? (
        <>
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">
            플랫폼 통계
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded shadow p-4 text-center">
              <p className="text-gray-500 mb-2">학생 수</p>
              <p className="text-2xl font-bold">{stats.totalStudents}</p>
            </div>
            <div className="bg-white rounded shadow p-4 text-center">
              <p className="text-gray-500 mb-2">튜터 수</p>
              <p className="text-2xl font-bold">{stats.totalTutors}</p>
            </div>
            <div className="bg-white rounded shadow p-4 text-center">
              <p className="text-gray-500 mb-2">총 예약 수</p>
              <p className="text-2xl font-bold">{stats.totalBookings}</p>
            </div>
            <div className="bg-white rounded shadow p-4 text-center">
              <p className="text-gray-500 mb-2">총 결제 금액</p>
              <p className="text-2xl font-bold">₩{stats.totalPayments}</p>
            </div>
            <div className="bg-white rounded shadow p-4 text-center">
              <p className="text-gray-500 mb-2">총 리뷰 수</p>
              <p className="text-2xl font-bold">{stats.totalReviews}</p>
            </div>
          </div>

          {/* Top 튜터 */}
          <h4 className="text-xl font-semibold text-gray-700 mb-3">
            평점 높은 튜터 Top 5
          </h4>
          <ul className="bg-white rounded shadow divide-y divide-gray-200">
            {stats.topTutors.map((tutor, index) => (
              <li
                key={tutor._id}
                className="flex justify-between items-center px-4 py-2 hover:bg-gray-50"
              >
                <span>
                  {index + 1}. {tutor.full_name}
                </span>
                <span className="text-yellow-500 font-semibold">
                  ⭐ {tutor.averageRating.toFixed(1)}
                </span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="text-gray-500">통계 불러오는 중...</p>
      )}
    </div>
  );
}