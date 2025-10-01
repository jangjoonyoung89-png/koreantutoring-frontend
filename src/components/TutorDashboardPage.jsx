import React, { useEffect, useState } from "react";
import {
  FaChalkboardTeacher,
  FaFolderOpen,
  FaStar,
  FaSignOutAlt,
} from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function TutorDashboardPage() {
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  // 예약 / 리뷰 불러오기
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:8000/api/tutor/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setBookings(res.data.bookings || []);
        setReviews(res.data.reviews || []);
      })
      .catch(() => {
        setError("예약 정보를 불러오는 데 실패했습니다.");
      });
  }, []);

  // 로그아웃
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login"); // 로그인 페이지로 이동
  };

  // 파일 선택
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // 자료 업로드
  const handleUpload = async () => {
    if (!file) {
      alert("업로드할 파일을 선택하세요.");
      return;
    }
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:8000/api/materials/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("업로드 완료!");
      setFile(null);
    } catch (err) {
      console.error(err);
      alert("업로드 실패");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 상단 헤더 */}
      <div className="bg-white shadow p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaChalkboardTeacher className="text-blue-600" />
          튜터 대시보드
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow"
        >
          <FaSignOutAlt /> 로그아웃
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* 에러 메시지 */}
        {error && <div className="text-red-600 font-semibold mb-4">{error}</div>}

        {/* 예약 현황 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4 text-gray-700">
            📊 예약 현황
          </h2>
          {bookings.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {bookings.map((b) => (
                <li
                  key={b._id}
                  className="py-3 flex justify-between items-center hover:bg-gray-50 px-2 rounded-lg"
                >
                  <span>
                    {b.studentName} - {b.date}
                  </span>
                  <span className="text-sm text-gray-500">{b.status}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">예약 없음</p>
          )}
        </div>

        {/* 자료 업로드 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4 text-gray-700">
            <FaFolderOpen className="text-yellow-500" /> 자료 업로드
          </h2>
          <div className="flex items-center gap-3">
            <input
              type="file"
              onChange={handleFileChange}
              className="flex-1 border rounded-lg px-3 py-2 text-gray-700"
            />
            <button
              onClick={handleUpload}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow"
            >
              업로드
            </button>
          </div>
        </div>

        {/* 리뷰 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4 text-gray-700">
            <FaStar className="text-yellow-400" /> 리뷰
          </h2>
          {reviews.length > 0 ? (
            <ul className="space-y-3">
              {reviews.map((r) => (
                <li
                  key={r._id}
                  className="p-4 border rounded-lg hover:shadow transition"
                >
                  <p className="text-gray-800 font-medium">{r.comment}</p>
                  <p className="text-sm text-gray-500">⭐ {r.rating}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">리뷰 없음</p>
          )}
        </div>
      </div>
    </div>
  );
}