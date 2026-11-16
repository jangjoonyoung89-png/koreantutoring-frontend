import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import StudentBookingList from "./StudentBookingList";
import MyReviewList from "./MyReviewList";

import {
  UserCircleIcon,
  CalendarDaysIcon,
  StarIcon,
  AcademicCapIcon,
  PencilSquareIcon,
  LockClosedIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

function StudentMyPage() {
  const { user } = useContext(AuthContext);
  const [reviewRefreshKey, setReviewRefreshKey] = useState(0);
  if (!user || user.role !== "student") {
    return (
      <div style={styles.accessDenied}>
        <h2>접근 권한이 없습니다.</h2>
        <p>학습자 계정으로 로그인해 주세요.</p>

        <Link to="/login" style={styles.primaryButton}>
          로그인
        </Link>
      </div>
    );
  }

  const studentName =
    user.full_name || user.name || "학습자";

  const studentId = user.id || user._id;

  return (
    <main style={styles.page}>
      <div style={styles.container}>

        {/* 상단 페이지 제목 */}
        <div style={styles.pageHeading}>
          <p style={styles.eyebrow}>ROKMUN · MY PAGE</p>

          <h1 style={styles.pageTitle}>
            나의 학습 공간
          </h1>

          <p style={styles.pageDescription}>
            한국어 학습 여정을 한곳에서 관리하세요.
          </p>
        </div>

        {/* 학습자 프로필 */}
        <section style={styles.profileCard}>
          <div style={styles.profileContent}>
            <div style={styles.profileIcon}>
              <UserCircleIcon
                style={{ width: 58, height: 58 }}
              />
            </div>

            <div style={styles.profileInfo}>
              <span style={styles.memberBadge}>
                STUDENT
              </span>

              <h2 style={styles.welcomeTitle}>
                {studentName}님, 환영합니다!
              </h2>

              <p style={styles.welcomeText}>
                ROKMUN과 함께 새로운 한국어 학습을
                시작해 보세요.
              </p>

              {user.email && (
                <p style={styles.email}>
                  {user.email}
                </p>
              )}
            </div>
          </div>

          <Link
            to="/tutors"
            style={styles.profileButton}
          >
            튜터 찾아보기

            <ArrowRightIcon
              style={{ width: 18, height: 18 }}
            />
          </Link>
        </section>

        {/* 바로가기 메뉴 */}
        <section style={styles.quickLinks}>

          <Link
            to="/tutors"
            style={styles.quickCard}
          >
            <div style={styles.quickIcon}>
              <AcademicCapIcon
                style={{ width: 28, height: 28 }}
              />
            </div>

            <div style={styles.quickText}>
              <h3 style={styles.quickTitle}>
                튜터 찾기
              </h3>

              <p style={styles.quickDescription}>
                나에게 맞는 한국어 튜터
              </p>
            </div>

            <ArrowRightIcon style={styles.arrow} />
          </Link>

          <Link
            to="/edit-profile"
            style={styles.quickCard}
          >
            <div style={styles.quickIcon}>
              <PencilSquareIcon
                style={{ width: 28, height: 28 }}
              />
            </div>

            <div style={styles.quickText}>
              <h3 style={styles.quickTitle}>
                프로필 수정
              </h3>

              <p style={styles.quickDescription}>
                나의 회원 정보 관리
              </p>
            </div>

            <ArrowRightIcon style={styles.arrow} />
          </Link>

          <Link
            to="/change-password"
            style={styles.quickCard}
          >
            <div style={styles.quickIcon}>
              <LockClosedIcon
                style={{ width: 28, height: 28 }}
              />
            </div>

            <div style={styles.quickText}>
              <h3 style={styles.quickTitle}>
                비밀번호 변경
              </h3>

              <p style={styles.quickDescription}>
                안전한 계정 관리
              </p>
            </div>

            <ArrowRightIcon style={styles.arrow} />
          </Link>

        </section>

        {/* 예약 목록 */}
        <section style={styles.contentCard}>
          <div style={styles.cardHeader}>
            <div style={styles.cardIcon}>
              <CalendarDaysIcon
                style={{ width: 25, height: 25 }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <h2 style={styles.cardTitle}>
                나의 수업 예약
              </h2>

              <p style={styles.cardDescription}>
                예약한 한국어 수업을 확인하고
                관리할 수 있습니다.
              </p>
            </div>

            <Link
              to="/tutors"
              style={styles.textLink}
            >
              새 수업 예약 →
            </Link>
          </div>

          <div style={styles.cardBody}>
             <StudentBookingList
              studentId={studentId}
              onReviewSubmitted={() =>
                setReviewRefreshKey((prev) => prev + 1)
              }
            />
          </div>
        </section>

        {/* 리뷰 목록 */}
        <section style={styles.contentCard}>
          <div style={styles.cardHeader}>
            <div style={styles.cardIcon}>
              <StarIcon
                style={{ width: 25, height: 25 }}
              />
            </div>

            <div>
              <h2 style={styles.cardTitle}>
                나의 수업 리뷰
              </h2>

              <p style={styles.cardDescription}>
                내가 작성한 수업 후기와 평점을
                확인할 수 있습니다.
              </p>
            </div>
          </div>

          <div style={styles.cardBody}>
            <MyReviewList
              key={reviewRefreshKey}
              studentId={studentId}
            />
          </div>
        </section>

        {/* 하단 안내 */}
        <footer style={styles.footer}>
          <strong style={styles.footerBrand}>
            ROKMUN
          </strong>

          <p style={styles.footerText}>
            Your Gateway to Korea
          </p>
        </footer>

      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "calc(100vh - 70px)",
    backgroundColor: "#F4F7FB",
    padding: "36px 20px 24px",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },

  container: {
    maxWidth: "1120px",
    margin: "0 auto",
  },

  pageHeading: {
    marginBottom: "26px",
  },

  eyebrow: {
    color: "#0077CC",
    fontSize: "12px",
    fontWeight: 800,
    letterSpacing: "2px",
    margin: "0 0 8px",
  },

  pageTitle: {
    fontSize: "clamp(25px, 4vw, 34px)",
    fontWeight: 800,
    color: "#15365C",
    margin: "0 0 8px",
    lineHeight: 1.3,
  },

  pageDescription: {
    fontSize: "15px",
    color: "#64748B",
    margin: 0,
  },

  profileCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "24px",
    background:
      "linear-gradient(120deg, #0C3970 0%, #0077CC 100%)",
    color: "#FFFFFF",
    borderRadius: "20px",
    padding: "clamp(24px, 4vw, 36px)",
    boxShadow: "0 8px 24px rgba(12,57,112,0.14)",
    marginBottom: "24px",
  },

  profileContent: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
    flex: "1 1 400px",
  },

  profileIcon: {
    width: "82px",
    height: "82px",
    borderRadius: "50%",
    backgroundColor: "rgba(255,255,255,0.16)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    border: "1px solid rgba(255,255,255,0.25)",
  },

  profileInfo: {
    flex: 1,
    minWidth: "200px",
  },

  memberBadge: {
    display: "inline-block",
    backgroundColor: "rgba(255,255,255,0.17)",
    color: "#FFFFFF",
    padding: "5px 11px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "1px",
    marginBottom: "8px",
  },

  welcomeTitle: {
    fontSize: "clamp(20px, 3vw, 28px)",
    fontWeight: 800,
    color: "#FFFFFF",
    margin: "0 0 8px",
    lineHeight: 1.4,
    wordBreak: "keep-all",
  },

  welcomeText: {
    color: "#E1EEFF",
    fontSize: "14px",
    lineHeight: 1.6,
    margin: 0,
    wordBreak: "keep-all",
  },

  email: {
    color: "#C9E1FF",
    fontSize: "13px",
    margin: "7px 0 0",
    overflowWrap: "anywhere",
  },

  profileButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    backgroundColor: "#FFFFFF",
    color: "#0C3970",
    textDecoration: "none",
    padding: "13px 20px",
    borderRadius: "10px",
    fontWeight: 700,
    fontSize: "14px",
    flexShrink: 0,
  },

  quickLinks: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
    gap: "16px",
    marginBottom: "28px",
  },

  quickCard: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    backgroundColor: "#FFFFFF",
    border: "1px solid #E4EBF3",
    borderRadius: "14px",
    padding: "20px 16px",
    textDecoration: "none",
    color: "#15365C",
    boxShadow: "0 3px 12px rgba(15,40,75,0.04)",
  },

  quickIcon: {
    width: "48px",
    height: "48px",
    backgroundColor: "#EAF4FF",
    color: "#0077CC",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  quickText: {
    flex: 1,
  },

  quickTitle: {
    fontSize: "15px",
    fontWeight: 700,
    margin: "0 0 5px",
    color: "#15365C",
  },

  quickDescription: {
    fontSize: "12px",
    color: "#64748B",
    margin: 0,
    lineHeight: 1.5,
  },

  arrow: {
    width: "17px",
    height: "17px",
    color: "#94A3B8",
    flexShrink: 0,
  },

  contentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "18px",
    border: "1px solid #E4EBF3",
    boxShadow: "0 4px 16px rgba(15,40,75,0.05)",
    marginBottom: "24px",
    overflow: "hidden",
  },

  cardHeader: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "14px",
    padding: "24px",
    borderBottom: "1px solid #E9EEF5",
  },

  cardIcon: {
    width: "46px",
    height: "46px",
    backgroundColor: "#EAF4FF",
    color: "#0077CC",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  cardTitle: {
    fontSize: "19px",
    fontWeight: 800,
    color: "#15365C",
    margin: "0 0 5px",
  },

  cardDescription: {
    fontSize: "13px",
    color: "#64748B",
    lineHeight: 1.5,
    margin: 0,
    wordBreak: "keep-all",
  },

  textLink: {
    color: "#0077CC",
    fontSize: "13px",
    fontWeight: 700,
    textDecoration: "none",
    whiteSpace: "nowrap",
  },

  cardBody: {
    padding: "24px",
    color: "#475569",
    fontSize: "14px",
    lineHeight: 1.8,
    minHeight: "100px",
    overflowX: "auto",
  },

  footer: {
    textAlign: "center",
    padding: "20px 0 10px",
  },

  footerBrand: {
    fontSize: "17px",
    color: "#0C3970",
    letterSpacing: "2px",
  },

  footerText: {
    color: "#94A3B8",
    fontSize: "12px",
    margin: "6px 0 0",
  },

  accessDenied: {
    padding: "60px 20px",
    textAlign: "center",
    color: "#15365C",
  },

  primaryButton: {
    display: "inline-block",
    backgroundColor: "#0077CC",
    color: "#FFFFFF",
    padding: "12px 24px",
    borderRadius: "8px",
    textDecoration: "none",
    marginTop: "16px",
  },
};

export default StudentMyPage;