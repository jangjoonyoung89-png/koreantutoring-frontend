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

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

  // -----------------------------
  // 튜터 데이터 가져오기
  // -----------------------------
  useEffect(() => {
    const fetchTutor = async () => {
      setLoading(true);
      try {
        const data = await getTutorById(id);

        // 업로드 영상 URL 처리
        if (data.sampleVideoUrl && !data.sampleVideoUrl.startsWith("http")) {
          data.sampleVideoUrl = `${BACKEND_URL}${data.sampleVideoUrl}`;
        }

        setTutor(data);
      } catch (err) {
        console.warn("튜터 정보 로딩 실패, 샘플 데이터 사용:", err);

        // 샘플 튜터
        const sampleTutors = [
          {
            _id: "tutor1",
            name: "장준영",
            email: "jang@test.com",
            bio: "한국어 교육 전문가입니다.",
            averageRating: 4.8,
            sampleVideoUrl: "https://www.youtube.com/watch?v=gYbsYQl2TiQ",
            videoLink: "https://meet.jit.si/SampleRoom123", // 실시간 수업 링크 예시
            availableTimes: [
              { day: "Monday", slots: ["10:00", "12:00"] },
              { day: "Wednesday", slots: ["14:00", "16:00"] },
            ],
          },
          {
            _id: "tutor2",
            name: "장서은",
            email: "seo@test.com",
            bio: "비즈니스 한국어 전문 튜터입니다.",
            averageRating: 4.5,
            sampleVideoUrl: "https://www.youtube.com/watch?v=gYbsYQl2TiQ",
            videoLink: "https://meet.jit.si/SampleRoom456", // 실시간 수업 링크 예시
            availableTimes: [
              { day: "Tuesday", slots: ["13:00", "15:00"] },
              { day: "Friday", slots: ["09:00", "11:00"] },
            ],
          },
        ];
        const fallbackTutor = sampleTutors.find((t) => t._id === id) || null;
        setTutor(fallbackTutor);
        if (!fallbackTutor) setMessage("❌ 튜터 정보를 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTutor();
  }, [id, BACKEND_URL]);

  // -----------------------------
  // 날짜 변경 시 가능한 시간 불러오기
  // -----------------------------
  useEffect(() => {
    if (!tutor) return;
    const dayNamesEN = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const selectedDay = dayNamesEN[selectedDate.getDay()];
    const dayAvailability = tutor.availableTimes?.find(
      (d) => d.day === selectedDay
    );
    setAvailableSlots(dayAvailability ? dayAvailability.slots : []);
    setSelectedSlot("");
  }, [selectedDate, tutor]);

  // -----------------------------
  // 날짜 포맷
  // -----------------------------
  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  // -----------------------------
  // 예약하기
  // -----------------------------
  const handleBooking = async () => {
    if (!selectedSlot) {
      setMessage("⏳ 시간을 선택해주세요.");
      return;
    }
    try {
      const bookingData = {
        tutor: tutor._id,
        date: formatDate(selectedDate),
        time: selectedSlot,
        notes: "",
      };
      await createBooking(bookingData);
      setMessage(`✅ ${formatDate(selectedDate)} ${selectedSlot} 예약 완료`);
    } catch (err) {
      console.error("예약 실패:", err);
      setMessage("❌ 예약 실패");
    }
  };

  // -----------------------------
  // 로딩 & 오류 처리
  // -----------------------------
  if (loading) return <p className="text-center mt-6">로딩 중...</p>;
  if (!tutor)
    return (
      <p className="text-center mt-6 text-red-500">
        {message || "튜터 정보를 불러올 수 없습니다."}
      </p>
    );

  // -----------------------------
  // 샘플 영상 처리 (YouTube / MP4)
  // -----------------------------
  let videoElement = <p className="text-gray-500">등록된 영상이 없습니다.</p>;
  if (tutor.sampleVideoUrl) {
    if (tutor.sampleVideoUrl.includes("youtube.com") || tutor.sampleVideoUrl.includes("youtu.be")) {
      let embedUrl = tutor.sampleVideoUrl;
      if (tutor.sampleVideoUrl.includes("watch?v=")) {
        embedUrl = tutor.sampleVideoUrl.replace("watch?v=", "embed/");
      } else if (tutor.sampleVideoUrl.includes("youtu.be")) {
        embedUrl = tutor.sampleVideoUrl.replace("youtu.be/", "www.youtube.com/embed/");
      }
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
    } else {
      videoElement = (
        <video className="w-full h-80 rounded" controls>
          <source src={tutor.sampleVideoUrl} type="video/mp4" />
          브라우저가 video 태그를 지원하지 않습니다.
        </video>
      );
    }
  }

  // -----------------------------
  // 렌더링
  // -----------------------------
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-2">{tutor.name} 튜터 소개</h2>
      <p className="text-gray-700">이메일: {tutor.email || "정보 없음"}</p>
      <p className="text-gray-700">소개: {tutor.bio || "소개 정보 없음"}</p>
      <p className="text-gray-700">평점: {tutor.averageRating ?? "없음"}</p>

      {/* 🎥 샘플 영상 */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">🎥 샘플 영상</h3>
        {videoElement}
      </div>

      {/* 📡 실시간 수업 */}
      <div className="mt-6">
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

      {/* 📅 예약 */}
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
            {availableSlots.map((slot) => (
              <button
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                className={`px-3 py-1 rounded border ${
                  selectedSlot === slot
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleBooking}
        className="mt-6 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow"
      >
        예약하기
      </button>

      {message && <p className="mt-4 text-lg font-medium">{message}</p>}

      {/* 리뷰 */}
      <div className="mt-10">
        <h3 className="text-xl font-bold mb-4">학생 리뷰</h3>
        <ReviewList tutorId={tutor._id} />
      </div>
    </div>
  );
}

<div className="mt-8">
  <QASection tutorId={tutor._id} />
</div>

export default TutorDetailPage;