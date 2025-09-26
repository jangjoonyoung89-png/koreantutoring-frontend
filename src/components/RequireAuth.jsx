import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

/**
 * 인증 보호 컴포넌트 (Route Guard)
 *
 * @param {ReactNode} children - 보호할 컴포넌트
 * @param {string} role - optional, 접근 가능한 사용자 role ("admin", "tutor", "student")
 *
 * 사용 예시:
 *   <Route
 *     path="/admin/dashboard"
 *     element={
 *       <RequireAuth role="admin">
 *         <AdminDashboard />
 *       </RequireAuth>
 *     }
 *   />
 */
export default function RequireAuth({ children, role }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // 1️⃣ 로그인 안 된 경우 → 로그인 페이지로
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2️⃣ role이 지정되어 있고, 현재 유저의 role과 다르면 접근 불가
  if (role && user.role !== role) {
    // 잘못된 접근 시 자기 대시보드로 돌려보냄
    return <Navigate to="/dashboard" replace />;
    // 👉 만약 무조건 홈으로 보내고 싶다면:
    // return <Navigate to="/" replace />;
  }

  // 3️⃣ 접근 허용 → children 페이지 렌더링
  return children;
}