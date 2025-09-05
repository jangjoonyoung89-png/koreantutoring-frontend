import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link, useParams } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import api from "./api"; // 공통 axios 인스턴스
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import ReviewList from "./components/ReviewList";

// ----------------------
// 일반 사용자 페이지
// ----------------------
import SignupPage from "./components/SignupPage";
import LoginPage from "./components/LoginPage";
import SignupTest from "./components/SignupTest";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import ResetPasswordPage from "./components/ResetPasswordPage";

// ----------------------
// 튜터 관련
// ----------------------
import TutorListPage from "./components/TutorListPage";
import VideoClassPage from "./components/VideoClassPage";

// ----------------------
// 예약 및 결제
// ----------------------
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

// ----------------------
// 게시글
// ----------------------
import PostDetail from "./components/PostDetail";
import CreatePostForm from "./components/CreatePostForm";

// ----------------------
// 튜터 페이지
// ----------------------
import TutorDashboardPage from "./components/TutorDashboardPage";
import TutorBookingList from "./components/TutorBookingList";
import TutorAvailabilityPage from "./components/TutorAvailabilityPage";
import TutorCalendarDashboard from "./components/TutorCalendarDashboard";

// ----------------------
// 관리자 페이지
// ----------------------
import AdminDashboard from "./components/admin/AdminDashboard";
import UserList from "./components/admin/UserList";
import AdminTutorManagement from "./components/admin/AdminTutorManagement";
import TutorList from "./components/admin/TutorList";
import AdminBookingList from "./components/admin/AdminBookingList";
import AdminTutorApprovalPage from "./components/AdminTutorApprovalPage";
import AdminReviewManagement from "./components/admin/AdminReviewManagement";
import AdminLoginPage from "./components/AdminLoginPage";

// ----------------------
// 인증 보호
// ----------------------
import RequireAuth from "./components/RequireAuth";

// ----------------------
// Navbar
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
// MainPage
// ----------------------
function MainPage() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sampleTutors = [
      { _id: "sample1", name: "장준영", experience: 5, photoUrl: "https://via.placeholder.com/100" },
      { _id: "sample2", name: "장서은", experience: 3, photoUrl: "https://via.placeholder.com/100" },
      { _id: "sample3", name: "김수영", experience: 7, photoUrl: "https://via.placeholder.com/100" },
    ];

    api.get("/api/tutors/with-rating", { params: { t: Date.now() } })
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) setTutors(res.data);
        else setTutors(sampleTutors);
      })
      .catch(() => setTutors(sampleTutors))
      .finally(() => setLoading(false));
  }, []);

  const displayTutors = tutors.slice(0, 3);

  return (
    <div>
      {/* Banner */}
      <section style={styles.banner}>
        <div style={styles.bannerOverlay}>
          <div style={styles.bannerContent}>
            <h1 style={styles.bannerTitle}>외국인을 위한 한국어 튜터링 플랫폼</h1>
            <p style={styles.bannerSubtitle}>언제 어디서나 원어민 한국어 선생님과 함께 하는 맞춤형 한국어 학습</p>
            <Link to="/signup"><button style={styles.ctaButton}>지금 시작하기</button></Link>
          </div>
        </div>
      </section>

      {/* 추천 튜터 */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>추천 튜터</h2>
        <div style={styles.tutorList}>
          {loading ? <p>추천 튜터 정보를 불러오는 중...</p> :
            displayTutors.map(tutor => (
              <div key={tutor._id} style={styles.tutorCard}>
                <img src={tutor.photoUrl || "https://via.placeholder.com/100"} alt={tutor.name} style={styles.tutorImage} />
                <h3 style={styles.tutorName}>{tutor.name}</h3>
                <p style={styles.tutorExperience}>경력: {tutor.experience}년</p>
                <Link to={`/tutors/${tutor._id}`} style={styles.detailLink}>자세히 보기 →</Link>
              </div>
            ))
          }
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
// TutorDetailPage
// ----------------------
function TutorDetailPage() {
  const { id } = useParams();
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchTutor = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/tutors/${id}`);
        setTutor(res.data);
      } catch {
        setTutor({
          _id: id,
          name: "샘플 튜터",
          email: "sample@example.com",
          bio: "샘플 튜터 소개",
          averageRating: 4.5,
          availableTimes: [
            { day: "Monday", slots: ["10:00", "12:00"] },
            { day: "Wednesday", slots: ["14:00", "16:00"] },
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    fetchTutor();
  }, [id]);

  useEffect(() => {
    if (!tutor) return;
    const dayNamesEN = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const selectedDay = dayNamesEN[selectedDate.getDay()];
    const dayAvailability = tutor.availableTimes?.find(d => d.day === selectedDay);
    setAvailableSlots(dayAvailability ? dayAvailability.slots : []);
    setSelectedSlot("");
  }, [selectedDate, tutor]);

  const formatDate = date => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;

  const handleBooking = async () => {
    if (!selectedSlot) { setMessage("⏳ 시간을 선택해주세요."); return; }
    try {
      await api.post("/api/bookings", { tutor: tutor._id, date: formatDate(selectedDate), time: selectedSlot });
      setMessage(`✅ ${formatDate(selectedDate)} ${selectedSlot} 예약 완료`);
    } catch {
      setMessage("❌ 예약 실패");
    }
  };

  if (loading) return <p className="text-center mt-6">로딩 중...</p>;
  if (!tutor) return <p className="text-center mt-6 text-red-500">{message || "튜터 정보를 불러올 수 없습니다."}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-2">{tutor.name} 튜터 소개</h2>
      <p className="text-gray-700">이메일: {tutor.email}</p>
      <p className="text-gray-700">소개: {tutor.bio}</p>
      <p className="text-gray-700">평점: {tutor.averageRating}</p>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">📅 예약 날짜 선택</h3>
        <Calendar value={selectedDate} onChange={setSelectedDate} />
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">⏰ 가능 시간</h3>
        {availableSlots.length === 0 ? <p>선택한 날짜에는 수업 가능 시간이 없습니다.</p> :
          <div className="flex gap-2 flex-wrap">
            {availableSlots.map(slot => (
              <button key={slot} onClick={() => setSelectedSlot(slot)}
                className={`px-3 py-1 rounded border ${selectedSlot===slot?"bg-blue-500 text-white":"bg-gray-100"}`}>
                {slot}
              </button>
            ))}
          </div>
        }
      </div>

      <button onClick={handleBooking} className="mt-4 px-4 py-2 bg-green-600 text-white rounded">예약하기</button>
      {message && <p className="mt-2">{message}</p>}

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">학생 리뷰</h3>
        <ReviewList tutorId={tutor._id} />
      </div>
    </div>
  );
}

// ----------------------
// 전체 App
// ----------------------
export default function App() {
  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/tutors" element={<TutorListPage />} />
        <Route path="/tutors/:id" element={<TutorDetailPage />} />

        {/* 회원가입/로그인 */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup-test" element={<SignupTest />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* 예약/결제 */}
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

        {/* 튜터 페이지 */}
        <Route path="/tutor/dashboard" element={<RequireAuth role="tutor"><TutorDashboardPage /></RequireAuth>} />
        <Route path="/tutor/bookings" element={<RequireAuth role="tutor"><TutorBookingList /></RequireAuth>} />
        <Route path="/tutor-availability" element={<RequireAuth role="tutor"><TutorAvailabilityPage /></RequireAuth>} />
        <Route path="/tutor/calendar" element={<RequireAuth role="tutor"><TutorCalendarDashboard /></RequireAuth>} />
        <Route path="/video" element={<VideoClassPage />} />
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />

        {/* 관리자 */}
        <Route path="/admin" element={<RequireAuth role="admin"><AdminDashboard /></RequireAuth>} />
        <Route path="/admin/users" element={<RequireAuth role="admin"><UserList /></RequireAuth>} />
        <Route path="/admin/tutors" element={<RequireAuth role="admin"><AdminTutorManagement /></RequireAuth>} />
        <Route path="/admin/tutor-list" element={<RequireAuth role="admin"><TutorList /></RequireAuth>} />
        <Route path="/admin/bookings" element={<RequireAuth role="admin"><AdminBookingList /></RequireAuth>} />
        <Route path="/admin/tutor-approval" element={<RequireAuth role="admin"><AdminTutorApprovalPage /></RequireAuth>} />
        <Route path="/admin/reviews" element={<RequireAuth role="admin"><AdminReviewManagement /></RequireAuth>} />
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* 게시글 */}
        <Route path="/create-post" element={<CreatePostForm />} />
        <Route path="/posts/:id" element={<RequireAuth><PostDetail /></RequireAuth>} />

        {/* 기본 fallback */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    backgroundColor: "#0077cc",
    color: "#ffffff",
  },
  logo: {
    fontSize: "1.6rem",
    fontWeight: "bold",
  },
  navLinks: {
    display: "flex",
    gap: "1.5rem",
  },
  navLink: {
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: 600,
    transition: "color 0.2s",
  },
  navLinkHover: {
    color: "#ffdd57",
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
    backgroundColor: "rgba(0,0,0,0.25)",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  bannerContent: {
    textAlign: "center",
    color: "#ffffff",
    maxWidth: "800px",
    padding: "0 1rem",
  },
  bannerTitle: {
    fontSize: "3rem",
    fontWeight: "700",
    marginBottom: "1rem",
    lineHeight: 1.2,
  },
  bannerSubtitle: {
    fontSize: "1.2rem",
    marginBottom: "2rem",
    lineHeight: 1.5,
  },
  ctaButton: {
    padding: "0.75rem 2rem",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    fontWeight: 700,
    fontSize: "1rem",
    borderRadius: "9999px",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  section: {
    maxWidth: 1100,
    margin: "4rem auto",
    padding: "0 2rem",
  },
  sectionTitle: {
    fontSize: "2rem",
    fontWeight: 700,
    textAlign: "center",
    marginBottom: "2rem",
    color: "#333333",
  },
  tutorList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "2rem",
    justifyContent: "center",
  },
  tutorCard: {
    width: 280,
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "24px 16px",
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    transition: "transform 0.2s",
  },
  tutorCardHover: {
    transform: "translateY(-5px)",
  },
  tutorImage: {
    width: 110,
    height: 110,
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "16px",
    border: "3px solid #0077cc",
  },
  tutorName: {
    fontSize: "1.25rem",
    fontWeight: 600,
    color: "#333333",
    marginBottom: "0.5rem",
  },
  tutorExperience: {
    fontSize: "1rem",
    color: "#666666",
    marginBottom: "1rem",
  },
  detailLink: {
    display: "inline-block",
    padding: "6px 12px",
    fontSize: "0.95rem",
    fontWeight: 600,
    color: "#0077cc",
    border: "1px solid #0077cc",
    borderRadius: "8px",
    textDecoration: "none",
    transition: "all 0.2s",
  },
  footer: {
    marginTop: "60px",
    padding: "2rem 1rem",
    backgroundColor: "#0077cc",
    color: "#ffffff",
    textAlign: "center",
    fontSize: "0.9rem",
    lineHeight: 1.5,
  },
};