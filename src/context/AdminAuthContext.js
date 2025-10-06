import React, { createContext, useState, useEffect, useContext } from "react";

export const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null); 
  const [adminToken, setAdminToken] = useState(null);

  // 페이지 새로고침 시 localStorage에서 정보 불러오기
  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    const storedAdmin = localStorage.getItem("adminUser");

    if (storedToken && storedAdmin) {
      setAdminToken(storedToken);
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  // 로그인 함수
  const login = ({ user, token }) => {
    setAdmin(user);
    setAdminToken(token);

    localStorage.setItem("adminToken", token);
    localStorage.setItem("adminUser", JSON.stringify(user));
  };

  // 로그아웃 함수
  const logout = () => {
    setAdmin(null);
    setAdminToken(null);

    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
  };

  return (
    <AdminAuthContext.Provider value={{ admin, adminToken, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

// hook으로 쉽게 사용
export const useAdminAuth = () => useContext(AdminAuthContext);