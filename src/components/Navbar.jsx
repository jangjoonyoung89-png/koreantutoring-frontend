import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  (
    <div style={styles.navLinks}>
      <Link to="/tutors" style={styles.navLink}>튜터 찾기</Link>
      <Link to="/student/mypage" style={styles.navLink}>마이페이지</Link>
      <Link to="/tutor/dashboard" style={styles.navLink}>튜터 대시보드</Link>
      <Link to="/admin/login" style={styles.navLink}>관리자</Link>
      <Link to="/login" style={styles.navLink}>로그인</Link>
      <Link to="/signup" style={styles.navLink}>회원가입</Link>
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
}; 