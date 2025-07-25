import React from "react";
import { Link } from "react-router-dom";

export default function MainPage() {
  return (
    <div>
      
      <nav style={styles.navbar}>
        <div style={styles.logo}>KOREAN TUTORING</div>
        <div style={styles.navLinks}>
          <Link to="/" style={styles.navLink}>HOME</Link>
          <Link to="/tutors" style={styles.navLink}>TUTOR</Link>
          <Link to="/signup" style={styles.navLink}>SIGNUP</Link>
          <Link to="/login" style={styles.navLink}>LOGIN</Link>
        </div>
      </nav>

      
      <section style={styles.banner}>
        <div style={styles.bannerOverlay}>
          <div style={styles.bannerContent}>
            <h1 style={styles.bannerTitle}>외국인을 위한 한국어 튜터링 플랫폼</h1>
            <p style={styles.bannerSubtitle}>
              언제 어디서나 원어민 한국어 선생님과 함께 하는 맞춤형 한국어 학습
            </p>
            <Link to="/signup" style={styles.ctaButton}>
              지금 시작하기
            </Link>
          </div>
        </div>
      </section>

      
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>추천 튜터</h2>
        <div style={styles.tutorList}>
          {[1, 2, 3].map((id) => (
            <div key={id} style={styles.tutorCard}>
              <img
                src={`https://randomuser.me/api/portraits/lego/${id}.jpg`}
                alt="Tutor"
                style={styles.tutorImage}
              />
              <h3 style={styles.tutorName}>장준영 {id}</h3>
              <p style={styles.tutorExperience}>경력: {3 + id}년</p>
              <Link to={`/tutors/${id}`} style={styles.detailLink}>
                자세히 보기 →
              </Link>
            </div>
          ))}
        </div>
      </section>

      
      <footer style={styles.footer}>
        <p>© 20250901 KOREAN TUTORING. 장준영 All rights reserved.</p>
        <p>문의: jjy@mail.kcu.ac</p>
      </footer>
    </div>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "1.2rem 3rem",
    backgroundColor: "#0077cc",
    color: "white",
    alignItems: "center",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  logo: {
    fontWeight: "bold",
    fontSize: "1.8rem",
  },
  navLinks: {
    display: "flex",
    gap: "1.5rem",
  },
  navLink: {
    color: "white",
    textDecoration: "none",
    fontWeight: "500",
    transition: "opacity 0.2s",
  },
  banner: {
    height: "80vh",
    backgroundImage: `url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1350&q=80")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
  },
  bannerOverlay: {
    backgroundColor: "rgba(0,0,0,0.2)",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  bannerContent: {
    color: "white",
    textAlign: "center",
    animation: "fadeIn 1.5s ease-in-out",
  },
  bannerTitle: {
    fontSize: "2.8rem",
    marginBottom: "1rem",
  },
  bannerSubtitle: {
    fontSize: "1.2rem",
    marginBottom: "2rem",
  },
  ctaButton: {
    padding: "14px 30px",
    backgroundColor: "#0077cc",
    color: "white",
    borderRadius: 8,
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "1rem",
    transition: "background-color 0.3s",
  },
  section: {
    maxWidth: 1100,
    margin: "4rem auto",
    padding: "0 2rem",
  },
  sectionTitle: {
    fontSize: "1.8rem",
    marginBottom: "2rem",
    textAlign: "center",
  },
  tutorList: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "2rem",
  },
  tutorCard: {
    border: "1px solid #e0e0e0",
    borderRadius: "16px",
    padding: "24px 20px",
    width: 280,
    textAlign: "center",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    transition: "transform 0.3s, box-shadow 0.3s",
    cursor: "pointer",
  },
  tutorCardHover: {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.12)",
  },
  tutorImage: {
    width: 110,
    height: 110,
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: 16,
    border: "3px solid #0077cc",
  },
  tutorName: {
    fontSize: "1.25rem",
    fontWeight: "600",
    marginBottom: "0.5rem",
    color: "#333",
  },
  tutorExperience: {
    fontSize: "1rem",
    color: "#666",
    marginBottom: "1rem",
  },
  detailLink: {
    color: "#0077cc",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "0.95rem",
    border: "1px solid #0077cc",
    borderRadius: "8px",
    padding: "6px 12px",
    transition: "all 0.2s",
  },
  footer: {
    marginTop: 60,
    padding: "2rem 1rem",
    backgroundColor: "#0077cc",
    color: "white",
    textAlign: "center",
  },
};