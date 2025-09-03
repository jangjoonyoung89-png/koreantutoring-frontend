import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchTutors } from "../api/tutorApi";
import styles from "../styles";

export default function MainPage() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTutors = async () => {
      const data = await fetchTutors();
      console.log("튜터 데이터 로드:", data);
      setTutors(data);
      setLoading(false);
    };
    loadTutors();
  }, []);

  return (
    <div>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.logo}>KOREAN TUTORING</div>
        <div style={styles.navLinks}>
          <Link to="/" style={styles.navLink}>HOME</Link>
          <Link to="/tutors" style={styles.navLink}>TUTOR</Link>
          <Link to="/signup" style={styles.navLink}>SIGNUP</Link>
          <Link to="/login" style={styles.navLink}>LOGIN</Link>
        </div>
      </nav>

      {/* Banner */}
      <section style={styles.banner}>
        <div style={styles.bannerOverlay}>
          <div style={styles.bannerContent}>
            <h1 style={styles.bannerTitle}>외국인을 위한 한국어 튜터링 플랫폼</h1>
            <p style={styles.bannerSubtitle}>언제 어디서나 원어민 한국어 선생님과 함께 하는 맞춤형 한국어 학습</p>
            <Link to="/signup">
              <button style={styles.ctaButtonEnhanced}>지금 시작하기</button>
            </Link>
          </div>
        </div>
      </section>

      {/* 추천 튜터 */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>추천 튜터</h2>
        {loading ? (
          <p>로딩 중...</p>
        ) : tutors.length === 0 ? (
          <p>추천 튜터가 없습니다.</p>
        ) : (
          <div style={styles.tutorList}>
            {tutors.map((tutor) => (
              <div key={tutor._id} style={styles.tutorCard}>
                <img src={tutor.img} alt={tutor.name} style={styles.tutorImage} />
                <h3 style={styles.tutorName}>{tutor.name}</h3>
                <p style={styles.tutorExperience}>경력: {tutor.experience}년</p>
                <Link to={`/tutors/${tutor._id}`} style={styles.detailLink}>자세히 보기 →</Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>© 20250901 KOREAN TUTORING 장준영. All rights reserved.</p>
        <p>문의: jjy@mail.kcu.ac</p>
      </footer>
    </div>
  );
}