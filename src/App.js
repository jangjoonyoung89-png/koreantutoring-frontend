import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate, useParams } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import api from "./api";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";

// ----------------------
// 페이지 임포트
// ----------------------
import SignupPage from "./components/SignupPage";
import LoginPage from "./components/LoginPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import ResetPasswordPage from "./components/ResetPasswordPage";
import TutorListPage from "./components/TutorListPage";
import BookingForm from "./components/BookingForm";
import StudentMyPage from "./components/StudentMyPage";
import MyPage from "./components/MyPage";
import BookingListWithTutorName from "./components/BookingListWithTutorName";
import PaymentPage from "./components/PaymentPage";
import PaymentSuccess from "./components/PaymentSuccess";
import PaymentList from "./components/PaymentList";
import PaymentHistory from "./components/PaymentHistory";
import ChangePasswordPage from "./components/ChangePasswordPage";
import ProfileEditPage from "./components/ProfileEditPage";
import StudentDashboardPage from "./components/StudentDashboardPage";
import TutorDashboardPage from "./components/TutorDashboardPage";
import ReviewList from "./components/ReviewList";
import VideoClassPageWrapper from "./components/VideoClassPageWrapper";

// ----------------------
// 관리자 페이지
// ----------------------
import AdminDashboard from "./components/admin/AdminDashboard";
import UserList from "./components/admin/UserList";
import AdminTutorManagement from "./components/admin/AdminTutorManagement";
import AdminTutorApprovalPage from "./components/AdminTutorApprovalPage";
import AdminBookingList from "./components/admin/AdminBookingList";
import AdminReviewManagement from "./components/admin/AdminReviewManagement";
import AdminLoginPage from "./components/AdminLoginPage";
import AdminQAManagement from "./components/admin/AdminQAManagement";
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
        <Link to="/admin/login" style={{ ...styles.navLink, color: "#ffdd57" }}>ADMIN</Link>
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
    api.get("/api/tutors/with-rating")
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) setTutors(res.data);
        else setTutors(sampleTutors);
      })
      .catch(() => setTutors(sampleTutors))
      .finally(() => setLoading(false));
  }, []);

  const displayTutors = tutors.slice(0, 3);

  return (
    <div>
      <section style={styles.banner}>
        <div style={styles.bannerOverlay}>
          <div style={styles.bannerContent}>
            <h1 style={styles.bannerTitle}>외국인을 위한 한국어 튜터링 플랫폼</h1>
            <p style={styles.bannerSubtitle}>언제 어디서나 원어민 한국어 선생님과 함께 하는 맞춤형 한국어 학습</p>
            <Link to="/signup"><button style={styles.ctaButton}>지금 시작하기</button></Link>
          </div>
        </div>
      </section>
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>추천 튜터</h2>
        <div style={styles.tutorList}>
          {loading ? (
            <p>추천 튜터 정보를 불러오는 중...</p>
          ) : (
            displayTutors.map((tutor) => (
              <div key={tutor._id} style={styles.tutorCard}>
                <img src={tutor.photoUrl || "https://via.placeholder.com/100"} alt={tutor.name} style={styles.tutorImage} />
                <h3 style={styles.tutorName}>{tutor.name}</h3>
                <p style={styles.tutorExperience}>경력: {tutor.experience}년</p>
                <Link to={`/tutors/${tutor._id}`} style={styles.detailLink}>자세히 보기 →</Link>
              </div>
            ))
          )}
        </div>
      </section>
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

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchTutor = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/tutors/${id}`);
        let data = res.data;
        if (data.sampleVideoUrl && !data.sampleVideoUrl.startsWith("http")) {
          data.sampleVideoUrl = `${BACKEND_URL}${data.sampleVideoUrl}`;
        }
        setTutor(data);
      } catch {
        setTutor({
          _id: id,
          name: "샘플 튜터",
          email: "sample@example.com",
          bio: "샘플 튜터 소개",
          averageRating: 4.5,
          sampleVideoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          videoLink: "https://meet.jit.si/sampleRoom",
          availableTimes: [
            { day: "Monday", slots: ["10:00", "12:00"] },
            { day: "Wednesday", slots: ["14:00", "16:00"] },
          ],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchTutor();
  }, [id, BACKEND_URL]);

  useEffect(() => {
    if (!tutor) return;
    const dayNamesEN = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const selectedDay = dayNamesEN[selectedDate.getDay()];
    const dayAvailability = tutor.availableTimes?.find((d) => d.day === selectedDay);
    setAvailableSlots(dayAvailability ? dayAvailability.slots : []);
    setSelectedSlot("");
  }, [selectedDate, tutor]);

  const formatDate = (date) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;

  const handleBooking = async () => {
    if (!selectedSlot) {
      setMessage("⏳ 시간을 선택해주세요.");
      return;
    }
    try {
      await api.post("/api/bookings", { tutor: tutor._id, date: formatDate(selectedDate), time: selectedSlot });
      setMessage(`✅ ${formatDate(selectedDate)} ${selectedSlot} 예약 완료`);
    } catch {
      setMessage("❌ 예약 실패");
    }
  };

  let videoElement = <p style={{color:"#888"}}>등록된 영상이 없습니다.</p>;
  if (tutor?.sampleVideoUrl) {
    let embedUrl = tutor.sampleVideoUrl;
    if (tutor.sampleVideoUrl.includes("youtube.com"))
      embedUrl = tutor.sampleVideoUrl.replace("watch?v=", "embed/");
    else if (tutor.sampleVideoUrl.includes("youtu.be"))
      embedUrl = tutor.sampleVideoUrl.replace("youtu.be/", "www.youtube.com/embed/");
    videoElement = (
      <iframe
        className="w-full h-80 rounded"
        src={embedUrl}
        title="튜터 소개 영상"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    );
  }

  if (loading) return <p className="text-center mt-6">로딩 중...</p>;
  if (!tutor) return <p className="text-center mt-6 text-red-500">{message || "튜터 정보를 불러올 수 없습니다."}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-2">{tutor.name} 튜터 소개</h2>
      <p className="text-gray-700">이메일: {tutor.email}</p>
      <p className="text-gray-700">소개: {tutor.bio}</p>
      <p className="text-gray-700">평점: {tutor.averageRating}</p>

      <div style={{marginTop:20}}>
        <h3>🎥 튜터 소개 영상</h3>
        {videoElement}
      </div>

      <div style={{marginTop:20}}>
        <h3>📡 실시간 수업</h3>
        {tutor.videoLink ? (
          <a href={tutor.videoLink} target="_blank" rel="noopener noreferrer" style={{padding:"10px 20px", background:"#2563eb", color:"#fff", borderRadius:8, display:"inline-block", marginTop:10}}>
            실시간 수업 입장하기
          </a>
        ) : <p style={{color:"#888"}}>실시간 수업 링크가 아직 없습니다.</p>}
      </div>

      <div style={{marginTop:20}}>
        <h3>📅 예약 날짜 선택</h3>
        <Calendar value={selectedDate} onChange={setSelectedDate} />
      </div>

      <div style={{marginTop:10}}>
        <h3>⏰ 가능 시간</h3>
        {availableSlots.length === 0 ? (
          <p>선택한 날짜에는 수업 가능 시간이 없습니다.</p>
        ) : (
          <div className="flex gap-2 flex-wrap">
            {availableSlots.map((slot) => (
              <button key={slot} onClick={() => setSelectedSlot(slot)} className={`px-3 py-1 rounded border ${selectedSlot === slot ? "bg-blue-500 text-white" : "bg-gray-100"}`}>
                {slot}
              </button>
            ))}
          </div>
        )}
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
// App
// ----------------------
export default function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <Navbar />
          <AppRoutes />
        </BrowserRouter>
      </AdminAuthProvider>
    </AuthProvider>
  );
}

// ----------------------
// Routes 분리
// ----------------------
function AppRoutes() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      {/* 메인 */}
      <Route path="/" element={<MainPage />} />
      <Route path="/tutors" element={<TutorListPage />} />
      <Route path="/tutors/:id" element={<TutorDetailPage />} />

      {/* 회원가입/로그인 */}
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* 학생 전용 */}
      <Route path="/book" element={<RequireAuth role="student"><BookingForm /></RequireAuth>} />
      <Route path="/student/mypage" element={<RequireAuth role="student"><StudentMyPage /></RequireAuth>} />
      <Route path="/mypage" element={<RequireAuth><MyPage /></RequireAuth>} />
      <Route path="/my-bookings" element={<RequireAuth><BookingListWithTutorName /></RequireAuth>} />
      <Route path="/payment" element={<RequireAuth role="student"><PaymentPage /></RequireAuth>} />
      <Route path="/payments/success" element={<RequireAuth role="student"><PaymentSuccess /></RequireAuth>} />
      <Route path="/payment-list" element={<RequireAuth role="student"><PaymentList /></RequireAuth>} />
      <Route path="/payments/history" element={<RequireAuth role="student"><PaymentHistory /></RequireAuth>} />
      <Route path="/change-password" element={<RequireAuth><ChangePasswordPage /></RequireAuth>} />
      <Route path="/edit-profile" element={<RequireAuth><ProfileEditPage /></RequireAuth>} />

      {/* 학생/튜터 대시보드 */}
      <Route path="/dashboard/student" element={<RequireAuth role="student"><StudentDashboardPage /></RequireAuth>} />
      <Route path="/tutor/dashboard" element={<RequireAuth role="tutor"><TutorDashboardPage /></RequireAuth>} />

      {/* 실시간 수업 */}
      <Route path="/video/:bookingId" element={<RequireAuth><VideoClassPageWrapper /></RequireAuth>} />

      {/* 관리자 전용 */}
      <Route path="/admin/dashboard" element={<RequireAuth role="admin"><AdminDashboard /></RequireAuth>} />
      <Route path="/admin/users" element={<RequireAuth role="admin"><UserList /></RequireAuth>} />
      <Route path="/admin/tutors" element={<RequireAuth role="admin"><AdminTutorManagement /></RequireAuth>} />
      <Route path="/admin/tutor-approval" element={<RequireAuth role="admin"><AdminTutorApprovalPage /></RequireAuth>} />
      <Route path="/admin/bookings" element={<RequireAuth role="admin"><AdminBookingList /></RequireAuth>} />
      <Route path="/admin/reviews" element={<RequireAuth role="admin"><AdminReviewManagement /></RequireAuth>} />
      <Route path="/admin/qa" element={<RequireAuth role="admin"><AdminQAManagement /></RequireAuth>} />
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* 잘못된 /dashboard 접근 리다이렉트 */}
      <Route path="/dashboard" element={
        user ? (
          user.role === "student" ? <Navigate to="/dashboard/student" replace /> :
          user.role === "tutor" ? <Navigate to="/tutor/dashboard" replace /> :
          user.role === "admin" ? <Navigate to="/admin/dashboard" replace /> :
          <Navigate to="/" replace />
        ) : <Navigate to="/login" replace />
      } />
    </Routes>
  );
}

// ----------------------
// Styles
// ----------------------
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
  banner: {
    height: "80vh",
    backgroundImage: 'url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1350&q=80")',
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
    maxWidth: "1100px",
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
    width: "220px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
    backgroundColor: "#fff",
  },
  tutorImage: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "8px",
  },
  tutorName: {
    fontSize: "18px",
    fontWeight: 600,
    marginBottom: "4px",
  },
  tutorExperience: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "8px",
  },
  detailLink: {
    fontSize: "14px",
    color: "#2563eb",
    textDecoration: "none",
  },
  footer: {
    textAlign: "center",
    padding: "2rem 0",
    backgroundColor: "#0077cc",
    marginTop: "4rem",
    color: "#ffffff",
  },
};