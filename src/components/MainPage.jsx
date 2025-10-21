import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { fetchTutors } from "../api/tutorApi";
import styles from "./MainPage.module.css";

export default function MainPage() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  // 샘플 튜터 사진 및 정보
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
    <div className="bg-gray-50 min-h-screen">
      {/* 네비게이션 */}
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

      {/* 배너 */}
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

      {/* 추천 튜터 섹션 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>추천 튜터</h2>
        {loading ? (
          <p className="text-center text-gray-500">추천 튜터 정보를 불러오는 중...</p>
        ) : (
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 pb-16">
            {displayTutors.map((tutor) => (
              <TutorCard key={tutor._id} tutor={tutor} />
            ))}
          </div>
        )}
      </section>

      {/* 푸터 */}
      <footer className={styles.footer}>
        <p>© 20250901 KOREAN TUTORING. 장준영 All rights reserved.</p>
        <p>문의: jjy@mail.kcu.ac</p>
      </footer>
    </div>
  );
}

// ----------------------
// TutorCard 컴포넌트 (예약 기능 포함)
// ----------------------
function TutorCard({ tutor }) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState(["10:00", "12:00", "14:00"]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [message, setMessage] = useState("");

  const handleBooking = () => {
    if (!selectedSlot) return setMessage("⏳ 시간을 선택해주세요.");
    setMessage(`✅ ${selectedDate.toLocaleDateString()} ${selectedSlot} 예약 완료`);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transition hover:shadow-xl">
      {/* 프로필 이미지 */}
      <img src={tutor.photoUrl} alt={tutor.name} className="w-full h-48 object-cover" />

      {/* 내용 */}
      <div className="p-4">
        <h3 className="text-lg font-semibold">{tutor.name}</h3>
        <p className="text-sm text-gray-600 mb-2">경력: {tutor.experience}년</p>

        {/* 예약 버튼 */}
        <button
          onClick={() => setBookingOpen(!bookingOpen)}
          className="w-full py-2 mb-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {bookingOpen ? "예약 닫기" : "예약하기"}
        </button>

        {/* 예약 달력/시간 선택 */}
        {bookingOpen && (
          <div className="p-3 bg-gray-50 rounded shadow-inner">
            <Calendar value={selectedDate} onChange={setSelectedDate} className="mb-3" />
            <h4 className="font-semibold mb-2">⏰ 가능 시간</h4>
            <div className="flex flex-wrap gap-2 mb-3">
              {availableSlots.map(slot => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`px-3 py-1 rounded border ${
                    selectedSlot === slot
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-gray-100 border-gray-300"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
            <button
              onClick={handleBooking}
              className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              예약 완료
            </button>
            {message && <p className="mt-2 text-sm text-green-700 font-medium">{message}</p>}
          </div>
        )}

        {/* 튜터 상세 페이지 링크 */}
        <Link to={`/tutors/${tutor._id}`} className="block mt-3 text-blue-600 font-medium hover:underline">
          자세히 보기 →
        </Link>
      </div>
    </div>
  );
}