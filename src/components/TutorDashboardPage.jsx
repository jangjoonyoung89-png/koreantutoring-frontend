import React, { useEffect, useState } from "react";
import {
  FaChalkboardTeacher,
  FaFolderOpen,
  FaStar,
  FaSignOutAlt,
  FaCalendarDay,
  FaClipboardList,
} from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function TutorDashboardPage() {
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  // -----------------------------
  // 대시보드 데이터 로드
  // -----------------------------
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

  // -----------------------------
  // 로그아웃
  // -----------------------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // -----------------------------
  // 자료 업로드
  // -----------------------------
  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return alert("업로드할 파일을 선택하세요.");
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

  // -----------------------------
  // 오늘 예약 수 계산
  // -----------------------------
  const today = new Date().toISOString().split("T")[0];
  const todayBookings = bookings.filter((b) => b.date === today).length;

  // 전체 예약 수
  const totalBookings = bookings.length;

  // 평균 평점 계산
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* =======================
          상단 헤더
          ======================= */}
      <header className="bg-white shadow p-6 flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2 mb-3 sm:mb-0">
          <FaChalkboardTeacher className="text-blue-600" />
          튜터 대시보드
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg shadow transition"
        >
          <FaSignOutAlt /> 로그아웃
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {error && <div className="text-red-600 font-semibold mb-4">{error}</div>}

        {/* =======================
            요약 카드
            ======================= */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-5 rounded-xl shadow flex flex-col items-center justify-center hover:shadow-lg transition">
            <FaCalendarDay className="text-2xl text-blue-500 mb-2" />
            <p className="text-gray-500">오늘 예약</p>
            <p className="text-2xl font-bold">{todayBookings}</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow flex flex-col items-center justify-center hover:shadow-lg transition">
            <FaClipboardList className="text-2xl text-green-500 mb-2" />
            <p className="text-gray-500">전체 예약</p>
            <p className="text-2xl font-bold">{totalBookings}</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow flex flex-col items-center justify-center hover:shadow-lg transition">
            <FaStar className="text-2xl text-yellow-400 mb-2" />
            <p className="text-gray-500">평균 평점</p>
            <p className="text-2xl font-bold">{avgRating}</p>
          </div>
        </section>

        {/* =======================
            예약 카드
            ======================= */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.length > 0 ? (
            bookings.map((b) => (
              <div
                key={b._id}
                className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition flex flex-col justify-between"
              >
                <h3 className="text-lg font-semibold text-gray-700">{b.studentName}</h3>
                <p className="text-gray-500">{b.date} | {b.time}</p>
                <span
                  className={`mt-2 px-2 py-1 rounded text-sm font-medium ${
                    b.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : b.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {b.status}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full">예약이 없습니다.</p>
          )}
        </section>

        {/* =======================
            자료 업로드
            ======================= */}
        <section className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4 text-gray-700">
            <FaFolderOpen className="text-yellow-500" /> 자료 업로드
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="file"
              onChange={handleFileChange}
              className="flex-1 border rounded-lg px-3 py-2 text-gray-700"
            />
            <button
              onClick={handleUpload}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition"
            >
              업로드
            </button>
          </div>
        </section>

        {/* =======================
            리뷰 카드
            ======================= */}
        <section className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4 text-gray-700">
            <FaStar className="text-yellow-400" /> 리뷰
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.length > 0 ? (
              reviews.map((r) => (
                <div key={r._id} className="p-4 border rounded-lg hover:shadow transition">
                  <p className="text-gray-800 font-medium">{r.comment}</p>
                  <p className="text-sm text-gray-500">⭐ {r.rating}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 col-span-full">리뷰 없음</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}