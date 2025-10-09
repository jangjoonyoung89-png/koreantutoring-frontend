import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import ReviewList from "./ReviewList";
import QASection from "./QASection";
import { getTutorById, createBooking } from "../api/tutorApi";
import axios from "axios";

// ============================
// 결제 모달
// ============================
function PaymentModal({ isOpen, onClose, onPaid, amount }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // 실제 PG사 연동 모킹
      await new Promise((res) => setTimeout(res, 1500));
      onPaid();
      onClose();
      alert("✅ 결제 완료!");
    } catch {
      alert("❌ 결제 실패");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full">
        <h3 className="text-xl font-bold mb-4">결제하기</h3>
        <p className="mb-4">결제 금액: {amount.toLocaleString()}원</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
          >
            취소
          </button>
          <button
            onClick={handlePayment}
            className={`px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "결제 중..." : "결제하기"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================
// TutorDetailPage
// ============================
export default function TutorDetailPage() {
  const { id } = useParams();
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [message, setMessage] = useState("");
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [pendingBooking, setPendingBooking] = useState(null);
  const [calendarEvents, setCalendarEvents] = useState([]); // 예약 자동 표시

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

  // -----------------------------
  // 튜터 정보 로드
  // -----------------------------
  useEffect(() => {
    const fetchTutor = async () => {
      setLoading(true);
      try {
        const data = await getTutorById(id);
        if (!data.hourlyRate) data.hourlyRate = 50000; // 기본 요금
        if (data.sampleVideoUrl && !data.sampleVideoUrl.startsWith("http")) {
          data.sampleVideoUrl = `${BACKEND_URL}${data.sampleVideoUrl}`;
        }
        setTutor(data);
      } catch {
        // 샘플 튜터
        setTutor({
          _id: "tutor1",
          name: "장준영",
          email: "jang@test.com",
          bio: "한국어 교육 전문가입니다.",
          averageRating: 4.8,
          sampleVideoUrl: "https://www.youtube.com/watch?v=gYbsYQl2TiQ",
          videoLink: "https://meet.jit.si/SampleRoom123",
          hourlyRate: 50000,
          availableTimes: [
            { day: "Monday", slots: ["10:00", "12:00"] },
            { day: "Wednesday", slots: ["14:00", "16:00"] },
          ],
        });
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTutor();
  }, [id, BACKEND_URL]);

  // -----------------------------
  // 날짜 선택 시 가능 시간 업데이트
  // -----------------------------
  useEffect(() => {
    if (!tutor) return;
    const dayNamesEN = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const selectedDay = dayNamesEN[selectedDate.getDay()];
    const dayAvailability = tutor.availableTimes?.find((d) => d.day === selectedDay);
    setAvailableSlots(dayAvailability ? dayAvailability.slots : []);
    setSelectedSlot("");
  }, [selectedDate, tutor]);

  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  // -----------------------------
  // 예약 + 결제
  // -----------------------------
  const handleBooking = async () => {
    if (!selectedSlot) {
      setMessage("⏳ 시간을 선택해주세요.");
      return;
    }
    const bookingData = {
      tutor: tutor._id,
      date: formatDate(selectedDate),
      time: selectedSlot,
      notes: "",
      amount: tutor.hourlyRate,
    };
    try {
      const res = await createBooking(bookingData); 
      setPendingBooking(res);
      setPaymentModalOpen(true); 
    } catch {
      setMessage("❌ 예약 실패");
    }
  };

  const handlePaid = async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/bookings/${pendingBooking._id}/pay`);
      setCalendarEvents([...calendarEvents, { date: pendingBooking.date, time: pendingBooking.time }]);
      setMessage(`✅ ${pendingBooking.date} ${pendingBooking.time} 예약 및 결제 완료!`);
      setPendingBooking(null);
    } catch {
      alert("결제 후 상태 업데이트 실패");
    }
  };

  if (loading) return <p className="text-center mt-6">로딩 중...</p>;
  if (!tutor) return <p className="text-center mt-6 text-red-500">{message || "튜터 정보를 불러올 수 없습니다."}</p>;

  // -----------------------------
  // 샘플 영상 처리
  // -----------------------------
  let videoElement = <p className="text-gray-500">등록된 영상이 없습니다.</p>;
  if (tutor.sampleVideoUrl) {
    let embedUrl = tutor.sampleVideoUrl;
    if (embedUrl.includes("watch?v=")) embedUrl = embedUrl.replace("watch?v=", "embed/");
    if (embedUrl.includes("youtu.be")) embedUrl = embedUrl.replace("youtu.be/", "www.youtube.com/embed/");
    videoElement = (
      <iframe
        className="w-full h-80 rounded-lg shadow-md"
        src={embedUrl}
        title="튜터 소개 영상"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  // -----------------------------
  // 렌더링
  // -----------------------------
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl space-y-8">
      {/* 튜터 정보 */}
      <div>
        <h2 className="text-2xl font-bold">{tutor.name} 튜터 소개</h2>
        <p className="text-gray-700">이메일: {tutor.email || "정보 없음"}</p>
        <p className="text-gray-700">소개: {tutor.bio || "소개 정보 없음"}</p>
        <p className="text-gray-700">평점: {tutor.averageRating ?? "없음"}</p>
        <p className="text-gray-700">시간당 요금: {tutor.hourlyRate.toLocaleString()}원</p>
      </div>

      {/* 샘플 영상 */}
      <div>
        <h3 className="font-semibold mb-2">🎥 샘플 영상</h3>
        {videoElement}
      </div>

      {/* 실시간 수업 */}
      <div>
        <h3 className="font-semibold mb-2">📡 실시간 수업</h3>
        {tutor.videoLink ? (
          <a
            href={tutor.videoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
          >
            🎥 실시간 수업 입장하기
          </a>
        ) : (
          <p className="text-gray-500">실시간 수업 링크가 아직 없습니다.</p>
        )}
      </div>

      {/* 캘린더 */}
      <div>
        <h3 className="font-semibold mb-2">📅 예약 날짜 선택</h3>
        <Calendar
          value={selectedDate}
          onChange={setSelectedDate}
          tileContent={({ date }) => {
            const hasBooking = calendarEvents.find(e => e.date === formatDate(date));
            return hasBooking ? <span className="text-red-500 ml-1">●</span> : null;
          }}
        />
      </div>

      {/* 가능 시간 */}
      <div>
        <h3 className="font-semibold mb-2">⏰ 가능 시간</h3>
        {availableSlots.length === 0 ? (
          <p className="text-gray-500">선택한 날짜에는 수업 가능 시간이 없습니다.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {availableSlots.map(slot => (
              <button
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                className={`px-3 py-1 rounded border font-medium ${
                  selectedSlot === slot
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
                }`}
              >
                {slot} ({tutor.hourlyRate.toLocaleString()}원)
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleBooking}
        className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow"
      >
        예약하기
      </button>

      {message && <p className="mt-2 text-lg font-medium">{message}</p>}

      {/* 리뷰 */}
      <div>
        <h3 className="text-xl font-bold mb-4">학생 리뷰</h3>
        <ReviewList tutorId={tutor._id} />
      </div>

      {/* Q&A */}
      <div>
        <QASection tutorId={tutor._id} />
      </div>

      {/* 결제 모달 */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onPaid={handlePaid}
        amount={tutor.hourlyRate}
      />
    </div>
  );
}