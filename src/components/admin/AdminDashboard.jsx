import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8000/api/stats/admin")
      .then(res => setStats(res.data))
      .catch(err => console.error("통계 로드 실패", err));
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">관리자 대시보드</h2>

      <ul className="space-y-3 mb-6">
        <li>
          <Link to="/admin/users" className="text-blue-600 underline">회원 목록 보기</Link>
        </li>
        <li>
          <Link to="/admin/tutors" className="text-blue-600 underline">튜터 목록 보기</Link>
        </li>
        <li>
          <Link to="/admin/bookings" className="text-blue-600 underline">전체 예약 보기</Link>
        </li>
      </ul>

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