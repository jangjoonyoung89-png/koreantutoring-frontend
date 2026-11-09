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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
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

  // 화면 크기 변화 감지 (반응형)
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 모바일 메뉴 닫기
  const closeMobileMenu = () => setMobileMenuOpen(false);

  // 메뉴 링크 배열 (중복 제거)
  const commonLinks = [{ to: "/tutors", label: "튜터 찾기" }];
  const studentLinks = [{ to: "/student/mypage", label: "마이페이지" }];
  const tutorLinks = [{ to: "/tutor/dashboard", label: "튜터 대시보드" }];
  const authLinks = [
    { to: "/login", label: "로그인" },
    { to: "/signup", label: "회원가입" },
  ];

  return (
    <nav style={styles.navbar}>
      {/* 로고 */}
      <div style={styles.logo}>ROKMUN</div>

      {/* 모바일 메뉴 버튼 */}
      {windowWidth <= 768 && (
        <button
          style={styles.mobileMenuButton}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
        >
          {mobileMenuOpen ? <XMarkIcon style={styles.icon} /> : <Bars3Icon style={styles.icon} />}
        </button>
      )}

      {/* 메뉴 링크 */}
      <div
        style={{
          ...styles.navLinks,
          ...(windowWidth <= 768
            ? mobileMenuOpen
              ? styles.navLinksMobileOpen
              : styles.navLinksMobileClosed
            : {}),
        }}
      >
        {/* 공통 링크 */}
        {commonLinks.map((link) => (
          <Link key={link.to} to={link.to} style={styles.navLink} onClick={closeMobileMenu}>
            {link.label}
          </Link>
        ))}

        {/* 학생 전용 */}
        {user?.role === "student" &&
          studentLinks.map((link) => (
            <Link key={link.to} to={link.to} style={styles.navLink} onClick={closeMobileMenu}>
              {link.label}
            </Link>
          ))}

        {/* 튜터 전용 */}
        {user?.role === "tutor" &&
          tutorLinks.map((link) => (
            <Link key={link.to} to={link.to} style={styles.navLink} onClick={closeMobileMenu}>
              {link.label}
            </Link>
          ))}

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
          authLinks.map((link) => (
            <Link key={link.to} to={link.to} style={styles.navLink} onClick={closeMobileMenu}>
              {link.label}
            </Link>
          ))
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
  // 🔹 모바일 메뉴
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
    zIndex: 40,
  },
};