import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchTutors } from "../api/tutorApi";
import styles from "./MainPage.module.css";

export default function MainPage() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  const sampleTutors = [
    { _id: "sample1", name: "장준영", experience: 5, photoUrl: "/images/korean_teacher1.jpg" },
    { _id: "sample2", name: "장서은", experience: 3, photoUrl: "/images/korean_teacher2.jpg" },
    { _id: "sample3", name: "김수영", experience: 7, photoUrl: "/images/korean_teacher3.jpg" },
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

  return (
    <div>
      {/* ✅ 네비게이션 */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>KOREAN TUTORING</div>
        <div className={styles.navLinks}>
          <Link to="/" className={styles.navLink}>홈</Link>
          <Link to="/tutors" className={styles.navLink}>튜터 찾기</Link>
          <Link to="/signup" className={styles.navLink}>회원가입</Link>
          <Link to="/login" className={styles.navLink}>로그인</Link>
          <Link to="/admin/login" className={styles.adminButton}>관리자</Link>
        </div>
      </nav>

      {/* ✅ 메인 배너 */}
      <section className={styles.banner}>
        <div className={styles.bannerOverlay}></div>
        <div className={styles.bannerContent}>
          <h1 className={styles.bannerTitle}>외국인을 위한 한국어 튜터링 플랫폼</h1>
          <p className={styles.bannerSubtitle}>
            언제 어디서나 원어민 한국어 선생님과 함께 하는 맞춤형 한국어 학습
          </p>
          <Link to="/signup">
            <button className={styles.ctaButton}>지금 시작하기</button>
          </Link>
        </div>
      </section>

      {/* ✅ 추천 튜터 섹션 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>추천 튜터</h2>
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

      {/* ✅ 푸터 */}
      <footer className={styles.footer}>
        <p>© 20250901 KOREAN TUTORING. 장준영 All rights reserved.</p>
        <p>문의: jjy@mail.kcu.ac</p>
      </footer>
    </div>
  );
}