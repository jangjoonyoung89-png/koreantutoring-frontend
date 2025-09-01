import React from "react";
import { Link } from "react-router-dom";

const styles = {
  section: { padding: "2rem" },
  sectionTitle: { fontSize: "1.5rem", marginBottom: "1rem" },
  tutorList: { display: "flex", gap: "1rem", flexWrap: "wrap" },
  tutorCard: { border: "1px solid #ccc", borderRadius: "8px", padding: "1rem", width: "200px" },
  tutorImage: { width: "100%", borderRadius: "50%" },
  tutorName: { fontSize: "1.2rem", margin: "0.5rem 0" },
  tutorExperience: { marginBottom: "0.5rem" },
  detailLink: { color: "blue", textDecoration: "underline" },
};

function RecommendedTutors({ tutors }) {
  if (!tutors || tutors.length === 0) return <p>튜터 정보가 없습니다.</p>;

  return (
    <section style={styles.section}>
      <h2 style={styles.sectionTitle}>추천 튜터</h2>
      <div style={styles.tutorList}>
        {tutors.map((tutor) => (
          <div key={tutor._id} style={styles.tutorCard}>
            <img
              src={tutor.img || "https://via.placeholder.com/150"}
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
      <div style={{ marginTop: "1rem" }}>
        <Link to="/tutors" style={{ textDecoration: "underline", color: "green" }}>
          모든 튜터 보기 →
        </Link>
      </div>
    </section>
  );
}

export default RecommendedTutors;