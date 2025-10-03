import React, { createContext, useState, useEffect, useContext } from "react";

export const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null); 
  const [adminToken, setAdminToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    const storedAdmin = localStorage.getItem("adminUser");

    if (storedToken && storedAdmin) {
      setAdminToken(storedToken);
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  const login = ({ user, token }) => {
    setAdmin(user);   // { id, username, role: "admin" }
    setAdminToken(token);

    localStorage.setItem("adminToken", token);
    localStorage.setItem("adminUser", JSON.stringify(user));
  };

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

export const useAdminAuth = () => useContext(AdminAuthContext);