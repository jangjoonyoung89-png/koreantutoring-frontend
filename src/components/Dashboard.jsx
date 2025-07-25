import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    navigate("/login"); 
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>대시보드</h2>
      <p>환영합니다, {user?.full_name || user?.email}!</p>
      <button onClick={handleLogout}>로그아웃</button>
    </div>
  );
}

export default Dashboard;