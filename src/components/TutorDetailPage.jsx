import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import ReviewList from "./ReviewList";
import { getTutorById, createBooking } from "../api/tutorApi";

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
        const data = await getTutorById(id);
        setTutor(data);
      } catch (err) {
        console.warn("튜터 정보 로딩 실패:", err);
        const sampleTutors = [
          {
            _id: "tutor1",
            name: "홍길동",
            email: "hong@example.com",
            bio: "10년 경력의 한국어 전문 튜터입니다.",
            averageRating: 4.8,
            availableTimes: [
              { day: "Monday", slots: ["10:00", "12:00"] },
              { day: "Wednesday", slots: ["14:00", "16:00"] },
            ],
          },
          {
            _id: "tutor2",
            name: "김영희",
            email: "kim@example.com",
            bio: "초보자에게 맞춘 수업을 제공합니다.",
            averageRating: 4.2,
            availableTimes: [
              { day: "Tuesday", slots: ["13:00", "15:00"] },
              { day: "Friday", slots: ["09:00", "11:00"] },
            ],
          },
        ];
        const fallbackTutor = sampleTutors.find(t => t._id === id) || null;
        setTutor(fallbackTutor);
        if (!fallbackTutor) setMessage("❌ 튜터 정보를 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTutor();
  }, [id]);

  useEffect(() => {
    if (!tutor) return;
    const dayNamesEN = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const selectedDay = dayNamesEN[selectedDate.getDay()];
    const dayAvailability = tutor.availableTimes?.find(d => d.day === selectedDay);
    setAvailableSlots(dayAvailability ? dayAvailability.slots : []);
    setSelectedSlot("");
  }, [selectedDate, tutor]);

  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2,"0");
    const d = String(date.getDate()).padStart(2,"0");
    return `${y}-${m}-${d}`;
  };

  const handleBooking = async () => {
    if (!selectedSlot) { setMessage("⏳ 시간을 선택해주세요."); return; }
    try {
      const bookingData = { tutor: tutor._id, date: formatDate(selectedDate), time: selectedSlot, notes: "" };
      await createBooking(bookingData);
      setMessage(`✅ ${formatDate(selectedDate)} ${selectedSlot} 예약 완료`);
    } catch (err) {
      console.error("예약 실패:", err);
      setMessage("❌ 예약 실패");
    }
  };

  if (loading) return <p className="text-center mt-6">로딩 중...</p>;
  if (!tutor) return <p className="text-center mt-6 text-red-500">{message || "튜터 정보를 불러올 수 없습니다."}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-2">{tutor.name} 튜터 소개</h2>
      <p className="text-gray-700">이메일: {tutor.email || "정보 없음"}</p>
      <p className="text-gray-700">소개: {tutor.bio || "소개 정보 없음"}</p>
      <p className="text-gray-700">평점: {tutor.averageRating ?? "없음"}</p>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">📅 예약 날짜 선택</h3>
        <Calendar value={selectedDate} onChange={setSelectedDate} />
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">⏰ 가능 시간</h3>
        {availableSlots.length === 0 ? (
          <p className="text-gray-500">선택한 날짜에는 수업 가능 시간이 없습니다.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {availableSlots.map(slot => (
              <button
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                className={`px-3 py-1 rounded border ${selectedSlot===slot?"bg-blue-500 text-white border-blue-500":"bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"}`}
              >
                {slot}
              </button>
            ))}
          </div>
        )}
      </div>

      <button onClick={handleBooking} className="mt-6 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow">
        예약하기
      </button>

      {message && <p className="mt-4 text-lg font-medium">{message}</p>}

      <div className="mt-10">
        <h3 className="text-xl font-bold mb-4">학생 리뷰</h3>
        <ReviewList tutorId={tutor._id} />
      </div>
    </div>
  );
}

export default TutorDetailPage;