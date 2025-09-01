import axios from "axios";

// ======================
// API 기본 설정
// ======================
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  "https://koreantutoring-backend.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // 인증 쿠키 사용
});

// ======================
// 토큰 인증 헤더 설정
// ======================
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// ======================
// 인증 관련
// ======================
export const signup = async (userData) => {
  const { data } = await api.post("/auth/signup", userData);
  return data;
};

export const login = async (credentials) => {
  const { data } = await api.post("/auth/login", credentials);
  return data;
};

// ======================
// 튜터 관련
// ======================
export const getTutors = async () => {
  const { data } = await api.get("/api/tutors");
  return data;
};

export const getTutorById = async (id) => {
  const { data } = await api.get(`/api/tutors/${id}`);
  return data;
};

export const getTutorsWithRating = async () => {
  const { data } = await api.get("/api/tutors/with-rating");
  return data;
};

export const getTutorAvailability = async (id) => {
  const { data } = await api.get(`/api/tutors/${id}/availability`);
  return data;
};

export const updateTutorAvailability = async (id, availableTimes) => {
  const { data } = await api.patch(`/api/tutors/${id}/availability`, { availableTimes });
  return data;
};

export const uploadTutorVideo = async (id, file) => {
  const formData = new FormData();
  formData.append("video", file);

  const { data } = await api.post(`/api/tutors/${id}/upload-video`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// ======================
// 예약 관련
// ======================
export const getBookings = async () => {
  const { data } = await api.get("/my-bookings");
  return data;
};

export const createBooking = async (bookingData) => {
  const { data } = await api.post("/bookings", bookingData);
  return data;
};

export const cancelBooking = async (id) => {
  const { data } = await api.delete(`/bookings/${id}`);
  return data;
};

// ======================
// 리뷰 관련
// ======================
export const getReviews = async (tutorId) => {
  const { data } = await api.get(`/api/reviews?tutor=${tutorId}`);
  return data;
};

export const createReview = async (reviewData) => {
  const { data } = await api.post("/api/reviews", reviewData);
  return data;
};

// ======================
// 자료 업로드 / 게시판
// ======================
export const uploadMaterial = async (file, title, bookingId) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title);
  formData.append("bookingId", bookingId);

  const { data } = await api.post("/api/materials", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const getMaterials = async () => {
  const { data } = await api.get("/api/materials");
  return data;
};

// ======================
// 결제 관련
// ======================
export const createPayment = async (paymentData) => {
  const { data } = await api.post("/payments", paymentData);
  return data;
};

export const verifyPayment = async (paymentId) => {
  const { data } = await api.get(`/payments/verify/${paymentId}`);
  return data;
};

// ======================
// 비디오 클래스
// ======================
export const getVideoClasses = async () => {
  const { data } = await api.get("/videos");
  return data;
};

export const getVideoById = async (id) => {
  const { data } = await api.get(`/videos/${id}`);
  return data;
};

// ======================
// 기본 export
// ======================
export default api;