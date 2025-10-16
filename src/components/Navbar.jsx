import React, { useContext, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  Cog6ToothIcon,
  UserIcon,
  QuestionMarkCircleIcon,
  BriefcaseIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const adminRef = useRef(null);

  // 외부 클릭 시 관리자 메뉴 닫기
  useEffect(() => {
    function handleClickOutside(event) {
      if (adminRef.current && !adminRef.current.contains(event.target)) {
        setAdminMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 링크 클릭 시 모바일 메뉴 자동 닫기
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav style={styles.navbar}>
      {/* 로고 */}
      <div style={styles.logo}>KOREAN TUTORING</div>

      {/* 모바일 메뉴 버튼 */}
      <button
        style={styles.mobileMenuButton}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? (
          <XMarkIcon style={styles.icon} />
        ) : (
          <Bars3Icon style={styles.icon} />
        )}
      </button>

      {/* PC & 모바일 메뉴 */}
      <div
        style={{
          ...styles.navLinks,
          ...(mobileMenuOpen ? styles.navLinksMobileOpen : styles.navLinksMobileClosed),
        }}
      >
        {/* 누구나 볼 수 있는 메뉴 */}
        <Link to="/tutors" style={styles.navLink} onClick={closeMobileMenu}>
          튜터 찾기
        </Link>

        {/* 학생 전용 */}
        {user?.role === "student" && (
          <Link to="/student/mypage" style={styles.navLink} onClick={closeMobileMenu}>
            마이페이지
          </Link>
        )}

        {/* 튜터 전용 */}
        {user?.role === "tutor" && (
          <Link to="/tutor/dashboard" style={styles.navLink} onClick={closeMobileMenu}>
            튜터 대시보드
          </Link>
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
                <Link
                  to="/admin/dashboard"
                  style={styles.dropdownLink}
                  onClick={() => {
                    setAdminMenuOpen(false);
                    closeMobileMenu();
                  }}
                >
                  <BriefcaseIcon style={{ width: 16, height: 16, marginRight: 5 }} /> 관리자 대시보드
                </Link>
                <Link
                  to="/admin/qa"
                  style={styles.dropdownLink}
                  onClick={() => {
                    setAdminMenuOpen(false);
                    closeMobileMenu();
                  }}
                >
                  <QuestionMarkCircleIcon style={{ width: 16, height: 16, marginRight: 5 }} /> Q&A 관리
                </Link>
                <Link
                  to="/admin/users"
                  style={styles.dropdownLink}
                  onClick={() => {
                    setAdminMenuOpen(false);
                    closeMobileMenu();
                  }}
                >
                  <UserIcon style={{ width: 16, height: 16, marginRight: 5 }} /> 사용자 관리
                </Link>
              </div>
            )}
          </div>
        )}

        {/* 로그인 / 로그아웃 */}
        {user ? (
          <button onClick={logout} style={styles.logoutBtn}>
            로그아웃
          </button>
        ) : (
          <>
            <Link to="/login" style={styles.navLink} onClick={closeMobileMenu}>
              로그인
            </Link>
            <Link to="/signup" style={styles.navLink} onClick={closeMobileMenu}>
              회원가입
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

// --------------------------
// 🎨 스타일 정의
// --------------------------
const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 1.5rem",
    backgroundColor: "#0077cc",
    color: "#ffffff",
    position: "sticky",
    top: 0,
    zIndex: 50,
  },
  logo: {
    fontSize: "1.6rem",
    fontWeight: "bold",
    letterSpacing: "0.5px",
  },
  icon: {
    width: 26,
    height: 26,
    color: "#fff",
  },
  mobileMenuButton: {
    background: "none",
    border: "none",
    color: "#fff",
    display: "none",
    cursor: "pointer",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "1.2rem",
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

  // 🔹 모바일용 스타일
  navLinksMobileClosed: {
    display: "none",
  },
  navLinksMobileOpen: {
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    top: "70px",
    left: 0,
    width: "100%",
    backgroundColor: "#0077cc",
    padding: "1rem 0",
    gap: "1rem",
    alignItems: "center",
  },
};

// --------------------------
// 🧩 반응형 스타일 (CSS-in-JS 방식)
// --------------------------
if (window.innerWidth <= 768) {
  styles.mobileMenuButton.display = "block";
  styles.navLinks.display = "none";
}