import axios from "axios";

// 환경변수에서 API 주소 가져오기
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api/tutors";

// 전체 튜터 가져오기
export const fetchTutors = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}`);
    return res.data;
  } catch (err) {
    console.error("튜터 API 호출 실패:", err);
    // 샘플 데이터 fallback
    return [
      { _id: "tutor1", name: "홍길동", experience: 10, photoUrl: "https://randomuser.me/api/portraits/men/11.jpg" },
      { _id: "tutor2", name: "김영희", experience: 5, photoUrl: "https://randomuser.me/api/portraits/women/22.jpg" },
      { _id: "tutor3", name: "이철수", experience: 7, photoUrl: "https://randomuser.me/api/portraits/men/33.jpg" },
    ];
  }
};

// ID로 튜터 가져오기
export const getTutorById = async (id) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/${id}`);
    return res.data;
  } catch (err) {
    console.warn("튜터 상세 API 실패:", err);
    throw err;
  }
};

// 예약 생성
export const createBooking = async (bookingData) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/bookings`, bookingData);
    return res.data;
  } catch (err) {
    console.error("예약 API 실패:", err);
    throw err;
  }
};

export default { fetchTutors, getTutorById, createBooking };