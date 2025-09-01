import axios from "axios";

// 환경변수에서 API 주소 가져오기
const API_BASE_URL = process.env.REACT_APP_API_URL;

// 추천 튜터 가져오기
export const fetchTutors = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/tutors`);
    return res.data;
  } catch (err) {
    console.error("API 호출 실패:", err);
    // 샘플 데이터 fallback
    return [
      { _id: "tutor1", name: "홍길동", experience: 10, img: "https://randomuser.me/api/portraits/men/11.jpg" },
      { _id: "tutor2", name: "김영희", experience: 5, img: "https://randomuser.me/api/portraits/women/22.jpg" },
      { _id: "tutor3", name: "이철수", experience: 7, img: "https://randomuser.me/api/portraits/men/33.jpg" },
    ];
  }
};