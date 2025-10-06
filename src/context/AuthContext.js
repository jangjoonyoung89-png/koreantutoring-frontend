import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);   // 로그인된 사용자 정보 (role 포함)
  const [token, setToken] = useState(null); // JWT 토큰

  // -----------------------------
  // 앱 로드 시 localStorage에서 복원
  // -----------------------------
  useEffect(() => {
    // 일반 사용자용 token 또는 관리자용 token 중 하나 불러오기
    const storedToken =
      localStorage.getItem("token") || localStorage.getItem("adminToken");
    const storedUser =
      localStorage.getItem("user") || localStorage.getItem("adminUser");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
  }, []);

  // -----------------------------
  // 로그인 (모든 역할 공통)
  // -----------------------------
  const login = ({ user, token }) => {
    setUser(user);
    setToken(token);

    // 역할별 저장 키 분리
    if (user.role === "admin") {
      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminUser", JSON.stringify(user));
    } else {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    }

    // Axios 기본 Authorization 헤더 설정
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  // -----------------------------
  // 로그아웃 (모든 사용자/관리자 공통)
  // -----------------------------
  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    delete axios.defaults.headers.common["Authorization"];
  };

  // -----------------------------
  // Context 값 반환
  // -----------------------------
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);