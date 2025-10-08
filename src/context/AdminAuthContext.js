import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

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
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
  }, []);

  const login = ({ user, token }) => {
    setAdmin(user);
    setAdminToken(token);

    localStorage.setItem("adminToken", token);
    localStorage.setItem("adminUser", JSON.stringify(user));

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const logout = () => {
    setAdmin(null);
    setAdminToken(null);

    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AdminAuthContext.Provider value={{ admin, adminToken, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);