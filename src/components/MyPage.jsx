import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function MyPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const API_URL = (process.env.REACT_APP_API_URL || "http://localhost:8000").trim();

  // ============================
  // ✅ 사용자 및 예약 정보 불러오기
  // ============================
  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");

    const fetchData = async () => {
      try {
        // 사용자 정보 가져오기
        const resUser = await fetch(`${API_URL}/api/users/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resUser.ok) throw new Error("사용자 정보를 불러오지 못했습니다.");
        const userData = await resUser.json();
        setUserInfo(userData);

        // 예약 정보 가져오기
        const resBookings = await fetch(`${API_URL}/api/bookings?studentId=${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resBookings.ok) throw new Error("예약 정보를 불러오지 못했습니다.");
        const bookingsData = await resBookings.json();
        setBookings(bookingsData);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // ============================
  // ⏳ 로딩 및 에러 처리
  // ============================
  if (loading) {
    return <p className="text-center mt-10 text-gray-600">로딩 중...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  }

  if (!userInfo) {
    return (
      <div className="text-center mt-10">
        <p>로그인이 필요합니다.</p>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          로그인 페이지로 이동
        </button>
      </div>
    );
  }

  // ============================
  // 🎨 페이지 본문
  // ============================
  return (
    <div className="min-h-screen bg-gray-50 px-5 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          📄 마이페이지
        </h2>

        {/* 👤 사용자 정보 */}
        <section className="bg-blue-50 p-5 rounded-xl mb-8 shadow-sm">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">👤 내 정보</h3>
          <div className="space-y-2 text-gray-700">
            <p>
              <strong>이름:</strong> {userInfo.full_name}
            </p>
            <p>
              <strong>이메일:</strong> {userInfo.email}
            </p>
            <p>
              <strong>역할:</strong>{" "}
              {userInfo.role === "student" ? "학생" : "튜터"}
            </p>
          </div>
        </section>

        {/* 📅 예약 목록 */}
        <section className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">📅 내 예약</h3>
          {bookings.length === 0 ? (
            <p className="text-gray-500">예약 내역이 없습니다.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {bookings.map((booking) => (
                <li key={booking.id} className="py-4">
                  <p>
                    <strong>튜터:</strong> {booking.tutor_name}
                  </p>
                  <p>
                    <strong>날짜:</strong> {booking.date}
                  </p>
                  <p>
                    <strong>시간:</strong> {booking.time}
                  </p>
                  <p>
                    <strong>요청사항:</strong> {booking.notes || "없음"}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* 🔘 버튼 영역 */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-10">
          <button
            onClick={() => navigate("/edit-profile")}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            프로필 수정
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            로그아웃
          </button>
          <button
            onClick={() => navigate("/change-password")}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            비밀번호 변경
          </button>
        </div>
      </div>
    </div>
  );
}

export default MyPage;