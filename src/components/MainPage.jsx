import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchTutors } from "../api/tutorApi";

export default function MainPage() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTutorId, setExpandedTutorId] = useState(null);

  // 🎨 샘플 한국인 얼굴 이미지
  const sampleTutors = [
    {
      _id: "sample1",
      name: "장준영",
      experience: 5,
      photoUrl:
        "https://images.unsplash.com/photo-1588776814546-0f7f2b8fa3a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      _id: "sample2",
      name: "장서은",
      experience: 3,
      photoUrl:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      _id: "sample3",
      name: "김수영",
      experience: 7,
      photoUrl:
        "https://images.unsplash.com/photo-1588776814500-b94d93eaf38c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
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

  // inline styles
  const styles = {
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
    },
    tutorCard: (isExpanded) => ({
      width: "150px",
      border: "1px solid #ddd",
      borderRadius: "10px",
      padding: "10px",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      transition: "transform 0.3s, box-shadow 0.3s",
      transform: isExpanded ? "scale(1.2)" : "scale(1)",
      zIndex: isExpanded ? 10 : 1,
      position: "relative",
      cursor: "pointer",
    }),
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
      {/* 상단 네비게이션 */}
      <nav style={styles.navbar}>
        <div style={styles.logo}>KOREAN TUTORING</div>
        <div style={styles.navLinks}>
          <Link to="/" style={styles.navLink}>
            HOME
          </Link>
          <Link to="/tutors" style={styles.navLink}>
            TUTOR
          </Link>
          <Link to="/signup" style={styles.navLink}>
            SIGNUP
          </Link>
          <Link to="/login" style={styles.navLink}>
            LOGIN
          </Link>
        </div>
      </nav>

      {/* 배너 */}
      <section style={styles.banner}>
        <div style={styles.bannerContent}>
          <h1>외국인을 위한 한국어 튜터링 플랫폼</h1>
          <p>언제 어디서나 원어민 한국어 선생님과 함께 하는 맞춤형 한국어 학습</p>
          <Link to="/signup">
            <button style={styles.ctaButtonEnhanced}>지금 시작하기</button>
          </Link>
        </div>
      </section>

      {/* 추천 튜터 */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>추천 튜터</h2>
        {loading ? (
          <p>추천 튜터 정보를 불러오는 중...</p>
        ) : (
          <div style={styles.tutorList}>
            {displayTutors.map((tutor) => {
              const isExpanded = expandedTutorId === tutor._id;
              return (
                <div
                  key={tutor._id}
                  style={styles.tutorCard(isExpanded)}
                  onMouseEnter={() => setExpandedTutorId(tutor._id)}
                  onMouseLeave={() => setExpandedTutorId(null)}
                >
                  <img
                    src={tutor.photoUrl}
                    alt={tutor.name}
                    style={styles.tutorImg}
                  />
                  <h3 style={styles.tutorName}>{tutor.name}</h3>
                  <p style={styles.tutorExperience}>
                    경력: {tutor.experience}년
                  </p>
                  <span
                    style={styles.detailLink}
                    onClick={() =>
                      setExpandedTutorId(isExpanded ? null : tutor._id)
                    }
                  >
                    자세히 보기 →
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 푸터 */}
      <footer style={styles.footer}>
        <p>© 20250901 KOREAN TUTORING 장준영. All rights reserved.</p>
        <p>문의: jjy@mail.kcu.ac</p>
      </footer>
    </div>
  );
}