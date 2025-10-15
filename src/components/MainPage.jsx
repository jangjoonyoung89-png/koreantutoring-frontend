import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchTutors } from "../api/tutorApi";
import styles from "./MainPage.module.css"; 

export default function MainPage() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  // 기본 샘플 튜터 목록
  const sampleTutors = [
    {
      _id: "sample1",
      name: "장준영",
      experience: 5,
      photoUrl: "/images/korean_teacher1.jpg",
    },
    {
      _id: "sample2",
      name: "장서은",
      experience: 3,
      photoUrl: "/images/korean_teacher2.jpg",
    },
    {
      _id: "sample3",
      name: "김수영",
      experience: 7,
      photoUrl: "/images/korean_teacher3.jpg",
    },
  ];

  useEffect(() => {
    const loadTutors = async () => {
      try {
        const data = await fetchTutors();
        if (Array.isArray(data) && data.length > 0) {
          const tutorsWithPhotos = data.map((tutor, index) => ({
            ...tutor,
            photoUrl: sampleTutors[index % sampleTutors.length].photoUrl,
          }));
          setTutors(tutorsWithPhotos);
        } else {
          setTutors(sampleTutors);
        }
      } catch {
        setTutors(sampleTutors);
      } finally {
        setLoading(false);
      }
    };
    loadTutors();
  }, []);

  const displayTutors = tutors.slice(0, 3);

  const inlineStyles = {
    navbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 20px",
      backgroundColor: "#333",
      color: "#fff",
    },
    logo: {
      fontWeight: "bold",
      fontSize: "20px",
    },
    navLinks: {
      display: "flex",
      gap: "20px",
    },
    navLink: {
      color: "#fff",
      textDecoration: "none",
      fontSize: "18px",
      fontWeight: "500",
    },
    banner: {
      position: "relative",
      height: "350px",
      backgroundImage:
        "url('https://images.unsplash.com/photo-1584697964192-f67d3a6a0f77?auto=format&fit=crop&w=1600&q=80')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      color: "#fff",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      flexDirection: "column",
    },
    bannerOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.4)",
      zIndex: 1,
    },
    bannerContent: {
      position: "relative",
      zIndex: 2,
      maxWidth: "600px",
    },
    bannerTitle: {
      fontSize: "38px",
      fontWeight: "bold",
      textShadow: "2px 2px 6px rgba(0,0,0,0.5)",
      marginBottom: "15px",
    },
    bannerSubtitle: {
      fontSize: "20px",
      fontWeight: "500",
      lineHeight: "1.6",
      color: "#ffdd99",
      textShadow: "1px 1px 4px rgba(0,0,0,0.4)",
    },
    section: {
      padding: "50px 20px",
      textAlign: "center",
    },
    sectionTitle: {
      fontSize: "26px",
      marginBottom: "30px",
      fontWeight: "bold",
    },
    tutorCardImg: {
      width: "180px",
      height: "180px",
      objectFit: "cover",
      borderRadius: "10px",
      marginBottom: "10px",
    },
  };

  return (
    <div>
      {/* 네비게이션 */}
      <nav style={inlineStyles.navbar}>
        <div style={inlineStyles.logo}>KOREAN TUTORING</div>
        <div style={inlineStyles.navLinks}>
          <Link to="/" style={inlineStyles.navLink}>
            HOME
          </Link>
          <Link to="/tutors" style={inlineStyles.navLink}>
            TUTOR
          </Link>
          <Link to="/signup" style={inlineStyles.navLink}>
            SIGNUP
          </Link>
          <Link to="/login" style={inlineStyles.navLink}>
            LOGIN
          </Link>
          <Link to="/admin/login" className={styles.adminButton}>
            ADMIN
          </Link>
        </div>
      </nav>

      {/* 배너 */}
      <section style={inlineStyles.banner}>
        <div style={inlineStyles.bannerOverlay}></div>
        <div style={inlineStyles.bannerContent}>
          <h1 style={inlineStyles.bannerTitle}>
            외국인을 위한 한국어 튜터링 플랫폼
          </h1>
          <p style={inlineStyles.bannerSubtitle}>
            언제 어디서나 원어민 한국어 선생님과 함께 하는 맞춤형 한국어 학습
          </p>
          <div>
            <Link to="/signup">
              <button className={styles.ctaButton}>지금 시작하기</button>
            </Link>
          </div>
        </div>
      </section>

      {/* 추천 튜터 */}
      <section style={inlineStyles.section}>
        <h2 style={inlineStyles.sectionTitle}>추천 튜터</h2>
        {loading ? (
          <p>추천 튜터 정보를 불러오는 중...</p>
        ) : (
          <div className={styles.tutorList}>
            {displayTutors.map((tutor) => (
              <div key={tutor._id} className={styles.tutorCard}>
                <img
                  src={tutor.photoUrl}
                  alt={tutor.name}
                  style={inlineStyles.tutorCardImg}
                />
                <h3>{tutor.name}</h3>
                <p>경력: {tutor.experience}년</p>
                <span>자세히 보기 →</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 푸터 */}
      <footer className={styles.footer}>
        <p>© 2025 KOREAN TUTORING. 장준영 All rights reserved.</p>
        <p>문의: jjy@mail.kcu.ac</p>
      </footer>
    </div>
  );
}