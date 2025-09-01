import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

/**
 * 인증 보호 컴포넌트
 * @param {ReactNode} children - 보호할 컴포넌트
 * @param {string} role - optional, 접근 가능한 사용자 role ("admin", "tutor", 등)
 */
export default function RequireAuth({ children, role }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // 로그인 안 된 경우
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // role이 지정되어 있고, 현재 유저의 role과 다르면 접근 불가
  if (role && user.role !== role) {
    // 예: 튜터 페이지에 일반 학생이 접근 시
    return <Navigate to="/dashboard" replace />;
  }

  // 접근 허용
  return children;
}