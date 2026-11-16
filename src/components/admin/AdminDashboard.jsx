import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAdminAuth } from "../../context/AdminAuthContext";

// ===================================================
// 🌐 ROKMUN API 주소
// ===================================================
const API_URL = (
  process.env.REACT_APP_API_URL ||
  "https://api.rokmun.com"
).trim().replace(/\/+$/, "");

// ===================================================
// 🛡️ ROKMUN 관리자 대시보드
// ===================================================
export default function AdminDashboardPage() {
  const {
    admin,
    adminToken,
    isAuthenticated,
    loading: authLoading,
    logout,
  } = useAdminAuth();

  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ===================================================
  // 🚪 관리자 로그아웃
  // ===================================================
  const handleLogout = () => {
    logout();

    navigate("/admin/login", {
      replace: true,
    });
  };

  // ===================================================
  // 📊 관리자 통계 불러오기
  // ===================================================
  useEffect(() => {
    if (!isAuthenticated || !adminToken) {
      return;
    }

    let active = true;

    const fetchStats = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await axios.get(
          `${API_URL}/admin/stats`,
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
          }
        );

        if (active) {
          setStats(res.data.stats || res.data);
        }
      } catch (err) {
        console.error(
          "관리자 통계 조회 실패:",
          err
        );

        if (active) {
          setError(
            err.response?.data?.message ||
              "통계 정보를 불러오지 못했습니다."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      active = false;
    };
  }, [isAuthenticated, adminToken]);

  // ===================================================
  // ⏳ 인증 상태 확인
  // ===================================================
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">
          관리자 인증 정보를 확인하고 있습니다...
        </p>
      </div>
    );
  }

  // ===================================================
  // 🔐 관리자 접근 권한
  // ===================================================
  if (!isAuthenticated || admin?.role !== "admin") {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  // ===================================================
  // 💅 화면 구성
  // ===================================================
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
      <div className="max-w-7xl mx-auto">

        {/* 상단 관리자 배너 */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-500 text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">

            <div>
              <p className="text-blue-100 text-sm font-semibold tracking-widest mb-2">
                ROKMUN ADMIN CENTER
              </p>

              <h1 className="text-3xl font-bold mb-2">
                관리자 대시보드
              </h1>

              <p className="text-blue-100">
                {admin?.full_name || "관리자"}님,
                환영합니다.
              </p>

              <p className="text-blue-100 text-sm mt-2">
                ROKMUN의 회원, 튜터, 예약 및
                운영 현황을 관리합니다.
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="bg-white text-blue-800 px-5 py-3 rounded-xl font-semibold hover:bg-blue-50 transition shadow"
            >
              로그아웃
            </button>

          </div>
        </div>

        {/* 관리자 주요 메뉴 */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          운영 관리
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">

          <MenuCard
            to="/admin/tutor-approval"
            icon="👩‍🏫"
            label="튜터 승인 관리"
            description="신규 튜터 승인 및 거절"
            highlight
          />

          <MenuCard
            to="/admin/users"
            icon="👥"
            label="회원 관리"
            description="학습자 및 튜터 회원 조회"
          />

          <MenuCard
            to="/admin/tutors"
            icon="🎓"
            label="튜터 관리"
            description="등록된 튜터 정보 관리"
          />

          <MenuCard
            to="/admin/bookings"
            icon="📅"
            label="예약 관리"
            description="전체 수업 예약 현황"
          />

          <MenuCard
            to="/admin/reviews"
            icon="⭐"
            label="리뷰 관리"
            description="학습자 수업 후기 관리"
          />

          <MenuCard
            to="/admin/qa"
            icon="💬"
            label="문의 관리"
            description="회원 문의 및 답변 관리"
          />

        </div>

        {/* 플랫폼 통계 */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          플랫폼 운영 현황
        </h2>

        {loading ? (
          <div className="bg-white rounded-2xl p-8 shadow-sm border text-center">
            <p className="text-gray-500">
              통계 정보를 불러오는 중입니다...
            </p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-red-600">
            {error}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">

            <StatCard
              label="전체 튜터"
              count={stats.totalTutors ?? 0}
              unit="명"
            />

            <StatCard
              label="승인된 튜터"
              count={stats.totalApprovedTutors ?? 0}
              unit="명"
            />

            <StatCard
              label="전체 예약"
              count={stats.totalBookings ?? 0}
              unit="건"
            />

            <StatCard
              label="전체 리뷰"
              count={stats.totalReviews ?? 0}
              unit="건"
            />

            <StatCard
              label="평균 평점"
              count={Number(
                stats.averageRating ?? 0
              ).toFixed(1)}
              unit="점"
            />

          </div>
        ) : (
          <div className="bg-white rounded-xl p-6 text-center text-gray-500">
            표시할 통계 정보가 없습니다.
          </div>
        )}

        {/* 하단 */}
        <footer className="text-center text-sm text-gray-400 py-8">
          ROKMUN · 대한민국으로 향하는 모든 길
        </footer>

      </div>
    </div>
  );
}

// ===================================================
// 🧩 관리자 메뉴 카드
// ===================================================
const MenuCard = ({
  to,
  icon,
  label,
  description,
  highlight = false,
}) => (
  <Link
    to={to}
    className={`block rounded-2xl p-5 border shadow-sm hover:shadow-md transition ${
      highlight
        ? "bg-blue-50 border-blue-200 hover:bg-blue-100"
        : "bg-white border-gray-200 hover:border-blue-300"
    }`}
  >
    <div className="flex items-center gap-4">

      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-100 text-2xl">
        {icon}
      </div>

      <div className="flex-1">
        <h3 className="font-bold text-gray-800 mb-1">
          {label}
        </h3>

        <p className="text-sm text-gray-500">
          {description}
        </p>
      </div>

      <span className="text-blue-600 font-bold">
        →
      </span>

    </div>
  </Link>
);

// ===================================================
// 📊 통계 카드
// ===================================================
const StatCard = ({
  label,
  count,
  unit,
}) => (
  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">

    <p className="text-sm text-gray-500 mb-3">
      {label}
    </p>

    <div className="flex items-baseline gap-1">
      <span className="text-3xl font-bold text-blue-700">
        {typeof count === "number"
          ? count.toLocaleString()
          : count}
      </span>

      <span className="text-sm text-gray-500">
        {unit}
      </span>
    </div>

  </div>
);