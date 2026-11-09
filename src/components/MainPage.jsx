import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { fetchTutors } from "../api/tutorApi";
import styles from "./MainPage.module.css";

// ======================
// 기본 이미지 설정
// ======================
const DEFAULT_IMAGE = "/images/default-tutor.svg";

// ======================
// 테스트용 추천 튜터 데이터
// ======================
const sampleTutors = [
  {
    _id: "sample1",
    name: "장준영",
    experience: 20,
    photoUrl: DEFAULT_IMAGE,
    isSample: true,
  },
  {
    _id: "sample2",
    name: "장서은",
    experience: 1,
    photoUrl: DEFAULT_IMAGE,
    isSample: true,
  },
  {
    _id: "sample3",
    name: "김수영",
    experience: 3,
    photoUrl: DEFAULT_IMAGE,
    isSample: true,
  },
];

// ======================
// 메인 페이지
// ======================
export default function MainPage() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadTutors = async () => {
      try {
        const data = await fetchTutors();

        if (!active) return;

        if (Array.isArray(data) && data.length > 0) {
          const tutorsWithPhotos = data.map((tutor) => ({
            ...tutor,
            // 홈페이지에서는 기본 회색 이미지 사용
            photoUrl: DEFAULT_IMAGE,
            isSample: false,
          }));

          setTutors(tutorsWithPhotos);
        } else {
          setTutors(sampleTutors);
        }
      } catch (error) {
        console.error("추천 튜터 조회 실패:", error);

        if (active) {
          setTutors(sampleTutors);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadTutors();

    return () => {
      active = false;
    };
  }, []);

  const displayTutors = tutors.slice(0, 3);

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* ======================
          네비게이션
      ====================== */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>ROKMUN</div>

        <div className={styles.navLinks}>
          <Link to="/" className={styles.navLink}>
            홈
          </Link>

          <Link to="/tutors" className={styles.navLink}>
            튜터 찾기
          </Link>

          <Link to="/signup" className={styles.navLink}>
            회원가입
          </Link>

          <Link to="/login" className={styles.navLink}>
            로그인
          </Link>

          <Link
            to="/admin/login"
            className={styles.adminButton}
          >
            관리자
          </Link>
        </div>
      </nav>

      {/* ======================
          메인 배너
      ====================== */}
      <section className={styles.banner}>
        <div className={styles.bannerOverlay}></div>

        <div className={styles.bannerContent}>
          <h1 className={styles.bannerTitle}>
            외국인을 위한 한국어 튜터링 플랫폼
          </h1>

          <p className={styles.bannerSubtitle}>
            언제 어디서나 원어민 한국어 선생님과
            함께 하는 맞춤형 한국어 학습
          </p>

          <Link to="/signup">
            <button className={styles.ctaButton}>
              지금 시작하기
            </button>
          </Link>
        </div>
      </section>

      {/* ======================
          추천 튜터
      ====================== */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          추천 튜터
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">
            추천 튜터 정보를 불러오는 중...
          </p>
        ) : (
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 pb-16">
            {displayTutors.map((tutor) => (
              <TutorCard
                key={tutor._id}
                tutor={tutor}
              />
            ))}
          </div>
        )}
      </section>

      {/* ======================
          푸터
      ====================== */}
      <footer className={styles.footer}>
        <p>
          © 20250901 ROKMUN. 장준영(jjy@mail.kcu.ac)
          All rights reserved.
        </p>
      </footer>
    </div>
  );
}

// ======================
// 추천 튜터 카드
// ======================
function TutorCard({ tutor }) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots] = useState([
    "10:00",
    "12:00",
    "14:00",
  ]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [message, setMessage] = useState("");

  // 테스트 예약 안내
  const handleBooking = () => {
    if (!selectedSlot) {
      setMessage("⏳ 시간을 선택해주세요.");
      return;
    }

    setMessage(
      "현재 예약 기능은 테스트 중입니다. 실제 예약은 생성되지 않습니다."
    );
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transition hover:shadow-xl">

      {/* ======================
          튜터 기본 이미지
      ====================== */}
      <img
        src={DEFAULT_IMAGE}
        alt={`${tutor.name || "튜터"} 프로필`}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.style.visibility = "hidden";
        }}
        className="w-full h-48 object-cover bg-gray-100"
      />

      {/* ======================
          튜터 정보
      ====================== */}
      <div className="p-4">
        <h3 className="text-lg font-semibold">
          {tutor.name || "이름 없음"}
        </h3>

        <p className="text-sm text-gray-600 mb-2">
          {typeof tutor.experience === "number"
            ? `경력: ${tutor.experience}년`
            : "경력 정보 없음"}
        </p>

        {/* 예약 버튼 */}
        <button
          onClick={() => {
            setBookingOpen(!bookingOpen);
            setMessage("");
          }}
          className="w-full py-2 mb-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {bookingOpen ? "예약 닫기" : "예약하기"}
        </button>

        {/* ======================
            예약 달력
        ====================== */}
        {bookingOpen && (
          <div className="p-3 bg-gray-50 rounded shadow-inner">
            <Calendar
              value={selectedDate}
              onChange={(date) => {
                setSelectedDate(date);
                setSelectedSlot("");
                setMessage("");
              }}
              minDate={new Date()}
              className="mb-3"
            />

            <h4 className="font-semibold mb-2">
              ⏰ 가능 시간 (테스트용)
            </h4>

            <div className="flex flex-wrap gap-2 mb-3">
              {availableSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => {
                    setSelectedSlot(slot);
                    setMessage("");
                  }}
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
              예약 테스트
            </button>

            {message && (
              <p className="mt-2 text-sm text-gray-700 font-medium">
                {message}
              </p>
            )}
          </div>
        )}

        {/* ======================
            상세 페이지
        ====================== */}
        {tutor.isSample ? (
          <p className="block mt-3 text-gray-500 text-sm">
            테스트용 튜터입니다.
          </p>
        ) : (
          <Link
            to={`/tutors/${tutor._id}`}
            className="block mt-3 text-blue-600 font-medium hover:underline"
          >
            자세히 보기 →
          </Link>
        )}
      </div>
    </div>
  );
}