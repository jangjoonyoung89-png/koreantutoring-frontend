import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import api from "./api"; // 공통 axios 인스턴스

// 일반 사용자 페이지
import SignupPage from "./components/SignupPage";
import LoginPage from "./components/LoginPage";
import SignupTest from "./components/SignupTest";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import ResetPasswordPage from "./components/ResetPasswordPage";

// 튜터 관련
import TutorListPage from "./components/TutorListPage";
import TutorDetail from "./components/TutorDetailPage";
import VideoClassPage from "./components/VideoClassPage";

// 예약 및 결제
import BookingPage from "./components/BookingPage";
import BookingPageWithDisabledTimesWrapper from "./components/BookingPageWithDisabledTimesWrapper";
import BookTutorPage from "./components/BookTutorPage";
import BookingForm from "./components/BookingForm";
import StudentMyPage from "./components/StudentMyPage";
import MyPage from "./components/MyPage";
import BookingList from "./components/BookingList";
import BookingListWithTutorName from "./components/BookingListWithTutorName";
import PaymentPage from "./components/PaymentPage";
import PaymentSuccess from "./components/PaymentSuccess";
import PaymentList from "./components/PaymentList";
import PaymentHistory from "./components/PaymentHistory";
import ChangePasswordPage from "./components/ChangePasswordPage";
import ProfileEditPage from "./components/ProfileEditPage";
import Dashboard from "./components/Dashboard";
import PostDetail from "./components/PostDetail";
import CreatePostForm from "./components/CreatePostForm";

// 튜터 페이지
import TutorDashboardPage from "./components/TutorDashboardPage";
import TutorBookingList from "./components/TutorBookingList";
import TutorAvailabilityPage from "./components/TutorAvailabilityPage";
import TutorCalendarDashboard from "./components/TutorCalendarDashboard";

// 관리자 페이지
import AdminDashboard from "./components/admin/AdminDashboard";
import UserList from "./components/admin/UserList";
import AdminTutorManagement from "./components/admin/AdminTutorManagement";
import TutorList from "./components/admin/TutorList";
import AdminBookingList from "./components/admin/AdminBookingList";
import AdminTutorApprovalPage from "./components/AdminTutorApprovalPage";
import AdminReviewManagement from "./components/admin/AdminReviewManagement";
import AdminLoginPage from "./components/AdminLoginPage";

// 인증 보호
import RequireAuth from "./components/RequireAuth";

// ----------------------
// 상단 네비게이션 바
// ----------------------
function Navbar() {
  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>KOREAN TUTORING</div>
      <div style={styles.navLinks}>
        <Link to="/" style={styles.navLink}>HOME</Link>
        <Link to="/tutors" style={styles.navLink}>TUTOR</Link>
        <Link to="/signup" style={styles.navLink}>SIGNUP</Link>
        <Link to="/login" style={styles.navLink}>LOGIN</Link>
      </div>
    </nav>
  );
}

// ----------------------
// 메인 페이지
// ----------------------
function MainPage() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("추천 튜터 API 호출 시작...");

    // sampleTutors를 useEffect 내부로 이동
    const sampleTutors = [
      { _id: "sample1", name: "장준영", experience: 5, photoUrl: "https://via.placeholder.com/100" },
      { _id: "sample2", name: "장서은", experience: 3, photoUrl: "https://via.placeholder.com/100" },
      { _id: "sample3", name: "김수영", experience: 7, photoUrl: "https://via.placeholder.com/100" },
    ];

    api.get("/api/tutors/with-rating", { params: { t: Date.now() } })
      .then((res) => {
        console.log("튜터 데이터 불러오기 성공:", res.data);
        if (Array.isArray(res.data) && res.data.length > 0) {
          setTutors(res.data);
        } else {
          console.warn("API에서 튜터가 없어서 샘플 데이터 사용");
          setTutors(sampleTutors);
        }
      })
      .catch((err) => {
        console.error("튜터 API 호출 에러:", err);
        setTutors(sampleTutors); // API 실패 시 샘플 데이터 사용
      })
      .finally(() => setLoading(false));
  }, []);

  // 화면에 표시할 튜터 (최대 3명)
  const displayTutors = tutors.length > 0 ? tutors.slice(0, 3) : [
    { _id: "sample1", name: "김한국", experience: 5, photoUrl: "https://via.placeholder.com/100" },
    { _id: "sample2", name: "이서울", experience: 3, photoUrl: "https://via.placeholder.com/100" },
    { _id: "sample3", name: "박부산", experience: 7, photoUrl: "https://via.placeholder.com/100" },
  ];

  return (
    <div>
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
        <div style={styles.tutorList}>
          {loading ? (
            <p>추천 튜터 정보를 불러오는 중...</p>
          ) : (
            displayTutors.map((tutor) => (
              <div key={tutor._id} style={styles.tutorCard}>
                <img
                  src={tutor.photoUrl || tutor.profileImage || "https://via.placeholder.com/100"}
                  alt={tutor.name}
                  style={styles.tutorImage}
                />
                <h3 style={styles.tutorName}>{tutor.name}</h3>
                <p style={styles.tutorExperience}>경력: {tutor.experience}년</p>
                <Link to={`/tutors/${tutor._id}`} style={styles.detailLink}>
                  자세히 보기 →
                </Link>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>© 20250901 KOREAN TUTORING. 장준영 All rights reserved.</p>
        <p>문의: jjy@mail.kcu.ac</p>
      </footer>
    </div>
  );
}

// ----------------------
// 전체 라우팅
// ----------------------
export default function App() {
  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/create-post" element={<CreatePostForm />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup-test" element={<SignupTest />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/tutors" element={<TutorListPage />} />
        <Route path="/tutors/:id" element={<TutorDetail />} />
        <Route path="/video" element={<VideoClassPage />} />
        <Route path="/admin" element={<RequireAuth role="admin"><AdminDashboard /></RequireAuth>} />
        <Route path="/admin/users" element={<RequireAuth role="admin"><UserList /></RequireAuth>} />
        <Route path="/admin/tutors" element={<RequireAuth role="admin"><AdminTutorManagement /></RequireAuth>} />
        <Route path="/admin/tutor-list" element={<RequireAuth role="admin"><TutorList /></RequireAuth>} />
        <Route path="/admin/bookings" element={<RequireAuth role="admin"><AdminBookingList /></RequireAuth>} />
        <Route path="/admin/tutor-approval" element={<RequireAuth role="admin"><AdminTutorApprovalPage /></RequireAuth>} />
        <Route path="/admin/reviews" element={<RequireAuth role="admin"><AdminReviewManagement /></RequireAuth>} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/book" element={<RequireAuth><BookingForm /></RequireAuth>} />
        <Route path="/booking" element={<RequireAuth><BookingPage /></RequireAuth>} />
        <Route path="/booking/:tutorId" element={<RequireAuth><BookingPageWithDisabledTimesWrapper /></RequireAuth>} />
        <Route path="/book/:id" element={<RequireAuth><BookTutorPage /></RequireAuth>} />
        <Route path="/student/mypage" element={<RequireAuth><StudentMyPage /></RequireAuth>} />
        <Route path="/mypage" element={<RequireAuth><MyPage /></RequireAuth>} />
        <Route path="/mybookings" element={<RequireAuth><BookingList /></RequireAuth>} />
        <Route path="/my-bookings" element={<RequireAuth><BookingListWithTutorName /></RequireAuth>} />
        <Route path="/payment" element={<RequireAuth><PaymentPage /></RequireAuth>} />
        <Route path="/payments/success" element={<RequireAuth><PaymentSuccess /></RequireAuth>} />
        <Route path="/payment-list" element={<RequireAuth><PaymentList /></RequireAuth>} />
        <Route path="/payments/history" element={<RequireAuth><PaymentHistory /></RequireAuth>} />
        <Route path="/change-password" element={<RequireAuth><ChangePasswordPage /></RequireAuth>} />
        <Route path="/edit-profile" element={<RequireAuth><ProfileEditPage /></RequireAuth>} />
        <Route path="/tutor/dashboard" element={<RequireAuth role="tutor"><TutorDashboardPage /></RequireAuth>} />
        <Route path="/tutor/bookings" element={<RequireAuth role="tutor"><TutorBookingList /></RequireAuth>} />
        <Route path="/tutor-availability" element={<RequireAuth role="tutor"><TutorAvailabilityPage /></RequireAuth>} />
        <Route path="/tutor/calendar" element={<RequireAuth role="tutor"><TutorCalendarDashboard /></RequireAuth>} />
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/posts/:id" element={<RequireAuth><PostDetail /></RequireAuth>} />
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// ----------------------
// 스타일 객체
// ----------------------
const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "1rem 2rem",
    backgroundColor: "#0077cc",
    color: "white",
    alignItems: "center",
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  navLinks: {
    display: "flex",
    gap: "1rem",
  },
  navLink: {
    color: "white",
    textDecoration: "none",
    fontWeight: "600",
  },
  banner: {
    height: "80vh",
    backgroundImage:
      'url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1350&q=80")',
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
  },
  bannerTitle: {
    fontSize: "2.8rem",
    marginBottom: "1rem",
  },
  bannerSubtitle: {
    fontSize: "1.2rem",
    marginBottom: "2rem",
  },
  ctaButtonEnhanced: {
    padding: "14px 30px",
    backgroundColor: "#2563eb",
    color: "#fff",
    borderRadius: "9999px",
    fontWeight: "700",
    fontSize: "1rem",
    border: "none",
    cursor: "pointer",
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
  },
  footer: {
    marginTop: 60,
    padding: "2rem 1rem",
    backgroundColor: "#0077cc",
    color: "white",
    textAlign: "center",
  },
};