import React, { useContext, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Cog6ToothIcon, UserIcon, QuestionMarkCircleIcon, BriefcaseIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const adminRef = useRef(null);

  // 클릭 외부 영역 닫기
  useEffect(() => {
    function handleClickOutside(event) {
      if (adminRef.current && !adminRef.current.contains(event.target)) {
        setAdminMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>KOREAN TUTORING</div>
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
          <div style={{ position: "relative" }} ref={adminRef}>
            <button
              onClick={() => setAdminMenuOpen(!adminMenuOpen)}
              style={{ ...styles.navLink, display: "flex", alignItems: "center" }}
            >
              <Cog6ToothIcon style={{ width: 20, height: 20, marginRight: 5 }} />
              ADMIN ▾
            </button>
            {adminMenuOpen && (
              <div style={styles.adminDropdown}>
                <Link to="/admin/dashboard" style={styles.dropdownLink} onClick={() => setAdminMenuOpen(false)}>
                  <BriefcaseIcon style={{ width: 16, height: 16, marginRight: 5 }} /> 관리자 대시보드
                </Link>
                <Link to="/admin/qa" style={styles.dropdownLink} onClick={() => setAdminMenuOpen(false)}>
                  <QuestionMarkCircleIcon style={{ width: 16, height: 16, marginRight: 5 }} /> Q&A 관리
                </Link>
                <Link to="/admin/users" style={styles.dropdownLink} onClick={() => setAdminMenuOpen(false)}>
                  <UserIcon style={{ width: 16, height: 16, marginRight: 5 }} /> 사용자 관리
                </Link>
              </div>
            )}
          </div>
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
    </nav>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    backgroundColor: "#0077cc",
    color: "#ffffff",
  },
  logo: {
    fontSize: "1.6rem",
    fontWeight: "bold",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  navLink: {
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: 600,
    cursor: "pointer",
    transition: "color 0.2s",
  },
  logoutBtn: {
    background: "transparent",
    border: "none",
    color: "#ffffff",
    fontWeight: "bold",
    cursor: "pointer",
  },
  adminDropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    backgroundColor: "#ffffff",
    color: "#333",
    borderRadius: 6,
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
    marginTop: 5,
    minWidth: 180,
    display: "flex",
    flexDirection: "column",
    zIndex: 20,
  },
  dropdownLink: {
    padding: "8px 12px",
    textDecoration: "none",
    color: "#333",
    display: "flex",
    alignItems: "center",
    gap: 5,
    fontWeight: 500,
    cursor: "pointer",
    transition: "background 0.2s",
  },
};