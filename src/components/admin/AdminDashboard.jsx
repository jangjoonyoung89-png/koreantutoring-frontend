import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(true);
  const navigate = useNavigate();

  // ---------------------
  // 로그아웃
  // ---------------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login");
  };

  // ---------------------
  // 권한 확인
  // ---------------------
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

  // ---------------------
  // 통계 가져오기
  // ---------------------
  useEffect(() => {
    if (!isAuthorized) return;
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:8000/api/stats/admin", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStats(res.data))
      .catch((err) => {
        console.error("통계 로드 실패", err);
        setStats(null);
      });
  }, [isAuthorized]);

  if (!isAuthorized) return <Navigate to="/admin/login" />;

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans max-w-7xl mx-auto">
      {/* 상단 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">🛠️ 관리자 대시보드</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow transition"
        >
          로그아웃
        </button>
      </div>

      {/* 메뉴 링크 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <MenuCard to="/admin/users" label="회원 목록" />
        <MenuCard to="/admin/tutors" label="튜터 목록" />
        <MenuCard to="/admin/bookings" label="전체 예약" />
        <MenuCard to="/admin/videos" label="실시간 영상" />
      </div>

      {/* 통계 카드 */}
      {stats ? (
        <>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            플랫폼 통계
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            <StatCard label="학생 수" count={stats.totalStudents} />
            <StatCard label="튜터 수" count={stats.totalTutors} />
            <StatCard label="총 예약 수" count={stats.totalBookings} />
            <StatCard
              label="총 결제 금액"
              count={
                typeof stats.totalPayments === "number"
                  ? `₩${stats.totalPayments.toLocaleString()}`
                  : "₩0"
              }
            />
            <StatCard label="총 리뷰 수" count={stats.totalReviews} />
          </div>

          {/* 평점 높은 튜터 Top 5 */}
          <Section title="⭐ 평점 높은 튜터 Top 5">
            {stats.topTutors && stats.topTutors.length > 0 ? (
              <ul className="bg-white rounded-xl shadow divide-y divide-gray-200">
                {stats.topTutors.map((tutor, idx) => (
                  <li
                    key={tutor._id}
                    className="flex justify-between items-center px-4 py-3 hover:bg-gray-50 transition"
                  >
                    <span>
                      {idx + 1}. {tutor.full_name || tutor.name}
                    </span>
                    <span className="text-yellow-500 font-semibold">
                      ⭐ {tutor.averageRating?.toFixed(1) || 0}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">등록된 튜터가 없습니다.</p>
            )}
          </Section>
        </>
      ) : (
        <p className="text-gray-500">통계 불러오는 중...</p>
      )}
    </div>
  );
}

// ---------------------
// 재사용 컴포넌트
// ---------------------
const MenuCard = ({ to, label }) => (
  <Link
    to={to}
    className="bg-white shadow hover:shadow-lg rounded-xl p-4 text-center text-blue-600 font-medium transition"
  >
    {label}
  </Link>
);

const StatCard = ({ label, count }) => (
  <div className="bg-white rounded-xl shadow p-5 text-center hover:shadow-lg transition">
    <p className="text-gray-500 mb-2">{label}</p>
    <p className="text-2xl font-bold">{count}</p>
  </div>
);

const Section = ({ title, children }) => (
  <section className="mb-12">
    <h3 className="text-xl font-semibold text-gray-700 mb-4">{title}</h3>
    {children}
  </section>
);