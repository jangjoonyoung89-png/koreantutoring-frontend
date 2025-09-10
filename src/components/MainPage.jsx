import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchTutors } from "../api/tutorApi";
import styles from "./MainPage.module.css"; // CSS 모듈 import

export default function MainPage() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  // 샘플 한국인 얼굴 이미지
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
      photoUrl: "https://randomuser.me/api/portraits/men/55.jpg",
    },
  ];

  // API fetch + fallback
  useEffect(() => {
    const loadTutors = async () => {
      try {
        const data = await fetchTutors();
        if (Array.isArray(data) && data.length > 0) {
          const tutorsWithPhotos = data.map((tutor, index) => ({
            ...tutor,
            photoUrl:
              tutor.photoUrl ||
              sampleTutors[index % sampleTutors.length].photoUrl,
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
    ctaButtonEnhanced: {
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
    tutorList: {
      display: "flex",
      justifyContent: "center",
      gap: "30px",
      flexWrap: "wrap",
      overflow: "visible", // 카드 확대 시 잘리지 않게
    },
    tutorImg: {
      width: "100px",
      height: "100px",
      borderRadius: "50%",
      objectFit: "cover",
      display: "block",
      margin: "0 auto 10px auto",
    },
    tutorName: {
      fontSize: "18px",
      margin: "10px 0 5px 0",
    },
    tutorExperience: {
      fontSize: "14px",
      marginBottom: "10px",
    },
    detailLink: {
      textDecoration: "none",
      color: "#0077cc",
      cursor: "pointer",
    },
    footer: {
      padding: "20px",
      textAlign: "center",
      backgroundColor: "#333",
      color: "#fff",
      marginTop: "40px",
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
          <Link to="/signup">
           <button className={styles.ctaButton}>지금 시작하기</button>
          </Link>
        </div>
      </section>

      {/* 추천 튜터 */}
      <section style={inlineStyles.section}>
        <h2 style={inlineStyles.sectionTitle}>추천 튜터</h2>
        {loading ? (
          <p>추천 튜터 정보를 불러오는 중...</p>
        ) : (
          <div style={inlineStyles.tutorList}>
            {displayTutors.map((tutor) => (
              <div key={tutor._id} className={styles.tutorCard}>
                <img
                  src={tutor.photoUrl}
                  alt={tutor.name}
                  style={inlineStyles.tutorImg}
                />
                <h3 style={inlineStyles.tutorName}>{tutor.name}</h3>
                <p style={inlineStyles.tutorExperience}>
                  경력: {tutor.experience}년
                </p>
                <span style={inlineStyles.detailLink}>자세히 보기 →</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 푸터 */}
      <footer style={inlineStyles.footer}>
        <p>© 20250901 KOREAN TUTORING 장준영. All rights reserved.</p>
        <p>문의: jjy@mail.kcu.ac</p>
      </footer>
    </div>
  );
}