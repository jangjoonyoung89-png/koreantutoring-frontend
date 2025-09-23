import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchTutors } from "../api/tutorApi";
import styles from "./MainPage.module.css"; // CSS 모듈 import

export default function MainPage() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  // 무조건 나오는 샘플 얼굴 (randomuser.me)
  const sampleTutors = [
    {
      _id: "sample1",
      name: "장준영",
      experience: 5,
      photoUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      _id: "sample2",
      name: "장서은",
      experience: 3,
      photoUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      _id: "sample3",
      name: "김수영",
      experience: 7,
      photoUrl: "https://randomuser.me/api/portraits/women/68.jpg",
    },
  ];

  // API 호출 + fallback
  useEffect(() => {
    const loadTutors = async () => {
      try {
        const data = await fetchTutors();
        if (Array.isArray(data) && data.length > 0) {
          const tutorsWithPhotos = data.map((tutor, index) => ({
            ...tutor,
            photoUrl:
              sampleTutors[index % sampleTutors.length].photoUrl, // 무조건 샘플 이미지 사용
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

  // 최대 3명 표시
  const displayTutors = tutors.slice(0, 3);

  // inline 스타일
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
      height: "300px",
      backgroundColor: "#555",
      color: "#fff",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      flexDirection: "column",
    },
    bannerContent: {
      maxWidth: "600px",
    },
    bannerTitle: {
      fontSize: "36px",
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
    ctaButton: {
      marginTop: "20px",
      padding: "10px 20px",
      fontSize: "16px",
      backgroundColor: "#ff6600",
      color: "#fff",
      border: "none",
      cursor: "pointer",
      borderRadius: "5px",
    },
    section: {
      padding: "40px 20px",
      textAlign: "center",
    },
    sectionTitle: {
      fontSize: "24px",
      marginBottom: "20px",
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
                <img src={tutor.photoUrl} alt={tutor.name} />
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
        <p>© 2025 KOREAN TUTORING 장준영. All rights reserved.</p>
        <p>문의: jjy@mail.kcu.ac</p>
      </footer>
    </div>
  );
}