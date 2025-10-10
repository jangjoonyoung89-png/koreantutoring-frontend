import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

// ----------------------------
// 📌 AdminAuthContext 생성
// ----------------------------
export const AdminAuthContext = createContext();

// ----------------------------
// 📌 AdminAuthProvider 컴포넌트
// ----------------------------
export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);        // 관리자 정보
  const [adminToken, setAdminToken] = useState(null); // JWT 토큰
  const [loading, setLoading] = useState(true);    // 초기 로딩 상태
  const [error, setError] = useState(null);        // 오류 메시지

  // ----------------------------
  // ✅ 초기 실행: localStorage에서 관리자 정보 복원
  // ----------------------------
  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    const storedAdmin = localStorage.getItem("adminUser");

    if (storedToken && storedAdmin) {
      try {
        setAdminToken(storedToken);
        setAdmin(JSON.parse(storedAdmin));

        // axios 기본 헤더에 Authorization 설정
        axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      } catch (err) {
        console.error("⚠️ 관리자 복원 실패:", err);
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
      }
    }

    setLoading(false);
  }, []);

  // ----------------------------
  // ✅ 관리자 로그인
  // ----------------------------
  const login = async (email, password) => {
    try {
      setError(null);
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/login`, {
        email,
        password,
      });

      const { user, token } = res.data;

      if (!token) {
        throw new Error("로그인 실패: 서버에서 토큰이 반환되지 않았습니다.");
      }

      // 상태 저장
      setAdmin(user);
      setAdminToken(token);

      // localStorage 저장
      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminUser", JSON.stringify(user));

      // axios 헤더 설정
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      console.log("✅ 관리자 로그인 성공:", user.email);
      return true;
    } catch (err) {
      console.error("❌ 관리자 로그인 실패:", err.response?.data || err.message);
      setError(err.response?.data?.detail || "로그인 실패. 다시 시도하세요.");
      return false;
    }
  };

  // ----------------------------
  // ✅ 로그아웃
  // ----------------------------
  const logout = () => {
    setAdmin(null);
    setAdminToken(null);
    setError(null);

    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    delete axios.defaults.headers.common["Authorization"];
    console.log("🚪 관리자 로그아웃 완료");
  };

  // ----------------------------
  // ✅ 자동 토큰 유효성 검사
  // ----------------------------
  useEffect(() => {
    if (!adminToken) return;

    const checkToken = async () => {
      try {
        await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/verify-token`);
      } catch (err) {
        console.warn("⚠️ 관리자 토큰이 만료됨. 자동 로그아웃 수행");
        logout();
      }
    };

    const interval = setInterval(checkToken, 1000 * 60 * 10); // 10분마다 검사
    return () => clearInterval(interval);
  }, [adminToken]);

  // ----------------------------
  // ✅ Provider 반환
  // ----------------------------
  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        adminToken,
        loading,
        error,
        login,
        logout,
        isAuthenticated: !!adminToken, // 로그인 여부
      }}
    >
      {!loading && children}
    </AdminAuthContext.Provider>
  );
}

// ----------------------------
// 📌 Hook: useAdminAuth()
// ----------------------------
export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth는 AdminAuthProvider 내부에서만 사용해야 합니다.");
  }
  return context;
};