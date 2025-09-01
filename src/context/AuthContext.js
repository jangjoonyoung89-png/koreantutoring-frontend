import React, { createContext, useState, useEffect } from "react";

// 1️⃣ Context 생성
export const AuthContext = createContext();

// 2️⃣ Provider 컴포넌트
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);   // 로그인 사용자 정보
  const [token, setToken] = useState(null); // JWT 토큰

  // 3️⃣ 초기 로드 시 localStorage에서 데이터 불러오기
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 4️⃣ 로그인 함수
  const login = ({ user, token }) => {
    setUser(user);
    setToken(token);

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  };

  // 5️⃣ 로그아웃 함수
  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // 6️⃣ Context value 전달
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}