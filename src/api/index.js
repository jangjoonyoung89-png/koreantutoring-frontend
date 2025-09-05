import axios from "axios";

// ----------------------
// API 기본 URL 설정
// ----------------------
const API_BASE_URL = process.env.REACT_APP_API_URL || "https://api.koreantutoring.co.kr";

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000, // 5초
});

// ----------------------
// 튜터 관련 API
// ----------------------

// 1️⃣ 전체 튜터 목록 (평점 포함)
export const getTutorsWithRating = async () => {
  try {
    const res = await api.get("/api/tutors/with-rating");
    return res.data; // 배열 반환
  } catch (err) {
    console.error("API 호출 실패 (getTutorsWithRating):", err);
    return []; // 실패 시 빈 배열 반환
  }
};

// 2️⃣ 특정 튜터 상세 정보
export const getTutorById = async (id) => {
  try {
    const res = await api.get(`/api/tutors/${id}`);
    return res.data;
  } catch (err) {
    console.error(`API 호출 실패 (getTutorById ${id}):`, err);
    return null;
  }
};

// 3️⃣ 튜터 생성
export const createTutor = async (tutorData) => {
  try {
    const res = await api.post("/api/tutors", tutorData);
    return res.data;
  } catch (err) {
    console.error("API 호출 실패 (createTutor):", err);
    return null;
  }
};

// 4️⃣ 튜터 수정
export const updateTutor = async (id, tutorData, token) => {
  try {
    const res = await api.put(`/api/tutors/${id}`, tutorData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error(`API 호출 실패 (updateTutor ${id}):`, err);
    return null;
  }
};

// 5️⃣ 튜터 삭제
export const deleteTutor = async (id, token) => {
  try {
    const res = await api.delete(`/api/tutors/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error(`API 호출 실패 (deleteTutor ${id}):`, err);
    return null;
  }
};

// ----------------------
// 기타 export
// ----------------------
export default {
  getTutorsWithRating,
  getTutorById,
  createTutor,
  updateTutor,
  deleteTutor,
};