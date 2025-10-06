import axios from "axios";

const API_URL = (process.env.REACT_APP_API_URL || "http://localhost:8000").trim();

/**
 * 관리자 로그인 요청
 * @param {string} username - 관리자 아이디
 * @param {string} password - 관리자 비밀번호
 */
export const adminLogin = async (username, password) => {
  const res = await axios.post(`${API_URL}/admin/login`, { username, password });
  return res.data;
};

/**
 * 관리자 전체 튜터 목록 불러오기
 */
export const getAllTutors = async () => {
  const token = localStorage.getItem("adminToken");
  const res = await axios.get(`${API_URL}/admin/tutors`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

/**
 * 튜터 승인 / 거절
 * @param {string} tutorId - 대상 튜터 ID
 * @param {"approve"|"reject"} action - 승인 또는 거절
 */
export const updateTutorStatus = async (tutorId, action) => {
  const token = localStorage.getItem("adminToken");
  const res = await axios.put(
    `${API_URL}/admin/tutors/${tutorId}/${action}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};