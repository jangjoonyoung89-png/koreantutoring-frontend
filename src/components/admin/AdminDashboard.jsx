import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(true);
  const navigate = useNavigate();

  // 로그아웃 함수
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login");
  };

  // 관리자 권한 확인
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

  // 권한이 확인되면 통계 데이터 불러오기
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

  // 권한 없으면 로그인 페이지로 이동
  if (!isAuthorized) {
    return <Navigate to="/admin/login" />;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* 상단 제목과 로그아웃 버튼 */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">관리자 대시보드</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          로그아웃
        </button>
      </div>

      {/* 관리자 메뉴 링크 */}
      <ul className="space-y-3 mb-6">
        <li>
          <Link to="/admin/users" className="text-blue-600 underline">
            회원 목록 보기
          </Link>
        </li>
        <li>
          <Link to="/admin/tutors" className="text-blue-600 underline">
            튜터 목록 보기
          </Link>
        </li>
        <li>
          <Link to="/admin/bookings" className="text-blue-600 underline">
            전체 예약 보기
          </Link>
        </li>
      </ul>

      {/* 통계 정보 */}
      {stats ? (
        <>
          <h3 className="text-xl font-semibold mb-2">플랫폼 통계</h3>
          <ul className="list-disc ml-6 mb-4">
            <li>학생 수: {stats.totalStudents}</li>
            <li>튜터 수: {stats.totalTutors}</li>
            <li>총 예약 수: {stats.totalBookings}</li>
            <li>총 결제 금액: ₩{stats.totalPayments}</li>
            <li>총 리뷰 수: {stats.totalReviews}</li>
          </ul>

          <h4 className="text-lg font-medium mb-2">평점 높은 튜터 Top 5</h4>
          <ul className="ml-6">
            {stats.topTutors.map((tutor, i) => (
              <li key={tutor._id}>
                {i + 1}. {tutor.full_name} - ⭐ {tutor.averageRating.toFixed(1)}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>통계 불러오는 중...</p>
      )}
    </div>
  );
}