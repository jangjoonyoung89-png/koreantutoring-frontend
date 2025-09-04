import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchTutors } from "../api/tutorApi";
import styles from "../styles";

export default function MainPage() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ 샘플 튜터 데이터 (항상 fallback)
  const sampleTutors = [
    {
      _id: "sample1",
      name: "장준영",
      experience: 5,
      photoUrl: "https://via.placeholder.com/100",
    },
    {
      _id: "sample2",
      name: "장서은",
      experience: 3,
      photoUrl: "https://via.placeholder.com/100",
    },
    {
      _id: "sample3",
      name: "김수영",
      experience: 7,
      photoUrl: "https://via.placeholder.com/100",
    },
  ];

  useEffect(() => {
    const loadTutors = async () => {
      try {
        const data = await fetchTutors();
        console.log("튜터 데이터 로드:", data);

        // API에서 유효한 배열이 오면 그걸 사용, 아니면 샘플 사용
        if (Array.isArray(data) && data.length > 0) {
          setTutors(data);
        } else {
          console.warn("API에서 튜터가 없어서 샘플 데이터 사용");
          setTutors(sampleTutors);
        }
      } catch (error) {
        console.error("튜터 불러오기 실패:", error);
        setTutors(sampleTutors); // ❌ API 실패 시 샘플 사용
      } finally {
        setLoading(false);
      }
    };
    loadTutors();
  }, []);

  // ✅ tutors 있으면 앞에서 3명만 표시, 없으면 샘플 사용
  const displayTutors = Array.isArray(tutors) && tutors.length > 0 ? tutors.slice(0, 3) : sampleTutors;

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
            <p style={styles.bannerSubtitle}>
              언제 어디서나 원어민 한국어 선생님과 함께 하는 맞춤형 한국어 학습
            </p>
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
          <p>추천 튜터 정보를 불러오는 중...</p>
        ) : (
          <div style={styles.tutorList}>
            {displayTutors.map((tutor) => (
              <div key={tutor._id} style={styles.tutorCard}>
                <img
                  src={tutor.photoUrl || tutor.profileImage || tutor.img || "https://via.placeholder.com/100"}
                  alt={tutor.name}
                  style={styles.tutorImage}
                />
                <h3 style={styles.tutorName}>{tutor.name}</h3>
                <p style={styles.tutorExperience}>경력: {tutor.experience}년</p>
                <Link to={`/tutors/${tutor._id}`} style={styles.detailLink}>
                  자세히 보기 →
                </Link>
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