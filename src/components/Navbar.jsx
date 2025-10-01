import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div style={styles.navLinks}>
      {/* 누구나 볼 수 있는 메뉴 */}
      <Link to="/tutors" style={styles.navLink}>튜터 찾기</Link>

      {/* 학생 전용 */}
      {user?.role === "student" && (
        <Link to="/student/mypage" style={styles.navLink}>마이페이지</Link>
      )}

      {/* 튜터 전용 */}
      {user?.role === "tutor" && (
        <Link to="/tutor/dashboard" style={styles.navLink}>튜터 대시보드</Link>
      )}

      {/* 관리자 전용 */}
      {user?.role === "admin" && (
        <Link to="/admin/dashboard" style={styles.navLink}>ADMIN</Link>
        <Link to="/admin/qa" style={{ ...styles.navLink, color: "#ffdd57" }}>ADMIN Q&A</Link>
      )}

      {/* 로그인/로그아웃 */}
      {user ? (
        <button onClick={logout} style={styles.logoutBtn}>로그아웃</button>
      ) : (
        <>
          <Link to="/login" style={styles.navLink}>로그인</Link>
          <Link to="/signup" style={styles.navLink}>회원가입</Link>
        </>
      )}
    </div>
  );
}

const styles = {
  navLinks: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    padding: "10px",
    backgroundColor: "#f5f5f5",
  },
  navLink: {
    color: "#333",
    textDecoration: "none",
    fontWeight: "bold",
  },
  logoutBtn: {
    background: "transparent",
    border: "none",
    color: "#333",
    fontWeight: "bold",
    cursor: "pointer",
  },
};