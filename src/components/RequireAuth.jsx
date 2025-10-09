import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useAdminAuth } from "../context/AdminAuthContext";

/**
 * RequireAuth
 * - 로그인 및 역할 기반 접근 제어
 * 
 * Props:
 *  - children: 보호할 컴포넌트
 *  - role: "admin" | "student" | "tutor" | undefined
 */
export default function RequireAuth({ children, role }) {
  const { user } = useContext(AuthContext); // 일반 사용자
  const { admin } = useAdminAuth(); // 관리자
  const location = useLocation();

  // -----------------------------
  // 관리자 전용
  // -----------------------------
  if (role === "admin") {
    if (!admin) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    return children;
  }

  // -----------------------------
  // 일반 사용자 전용
  // -----------------------------
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // -----------------------------
  // 역할 기반 접근 제어
  // -----------------------------
  if (role && user.role !== role) {
    switch (user.role) {
      case "student":
        return <Navigate to="/dashboard/student" replace />;
      case "tutor":
        return <Navigate to="/tutor/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
}