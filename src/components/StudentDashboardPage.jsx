import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function StudentDashboardPage() {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [reviewInput, setReviewInput] = useState({});
  const [materials, setMaterials] = useState([]);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 예약 정보
        const resBookings = await fetch(
          `${BACKEND_URL}/api/bookings?studentId=${user.id}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        if (!resBookings.ok) throw new Error("예약 정보 불러오기 실패");
        const bookingsData = await resBookings.json();
        setBookings(bookingsData);

        // 리뷰 정보
        const resReviews = await fetch(
          `${BACKEND_URL}/api/reviews?studentId=${user.id}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        if (!resReviews.ok) throw new Error("리뷰 정보 불러오기 실패");
        const reviewsData = await resReviews.json();
        setReviews(reviewsData);

        // 자료 정보
        const resMaterials = await fetch(`${BACKEND_URL}/api/materials`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!resMaterials.ok) throw new Error("자료 불러오기 실패");
        setMaterials(await resMaterials.json());
      } catch (err) {
        setError(err.message);
      }
    };
    if (user?.role === "student") fetchData();
  }, [user, BACKEND_URL]);

  const handleSubmitReview = async (bookingId) => {
    const rating = reviewInput[bookingId]?.rating || 5;
    const comment = reviewInput[bookingId]?.comment || "";
    try {
      const res = await fetch(`${BACKEND_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ bookingId, studentId: user.id, comment, rating }),
      });
      if (!res.ok) throw new Error("리뷰 등록 실패");
      alert("리뷰 등록 완료!");
      // 제출 후 UI 자동 갱신
      setReviews((prev) => [...prev, { bookingId, rating, comment }]);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDownload = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold text-center mb-10">👩‍🎓 학생 대시보드</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* 예약 목록 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">📊 예약 현황</h2>
        {bookings.length === 0 ? (
          <p>예약 없음</p>
        ) : (
          <div className="grid gap-6">
            {bookings.map((b) => {
              const tutorReview = reviews.find((r) => r.bookingId === b._id);
              return (
                <div
                  key={b._id}
                  className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0"
                >
                  <div className="flex flex-col gap-1">
                    <p>
                      <strong>튜터:</strong> {b.tutor?.full_name || "정보 없음"}
                    </p>
                    <p>
                      <strong>날짜:</strong> {new Date(b.date).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>시간:</strong> {b.time}
                    </p>
                    <p className={`font-bold ${getStatusColor(b.status)}`}>{b.status || "pending"}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    <Link
                      to={`/video/${b._id}`}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      영상
                    </Link>
                    <Link
                      to={`/chat/${b._id}`}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      채팅
                    </Link>
                    <Link
                      to={`/whiteboard/${b._id}`}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      화이트보드
                    </Link>
                    {/* 리뷰 작성 */}
                    {!tutorReview && b.status === "approved" && (
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder="리뷰"
                          className="border p-1 rounded"
                          value={reviewInput[b._id]?.comment || ""}
                          onChange={(e) =>
                            setReviewInput((prev) => ({
                              ...prev,
                              [b._id]: { ...prev[b._id], comment: e.target.value },
                            }))
                          }
                        />
                        <input
                          type="number"
                          min={1}
                          max={5}
                          value={reviewInput[b._id]?.rating || 5}
                          onChange={(e) =>
                            setReviewInput((prev) => ({
                              ...prev,
                              [b._id]: { ...prev[b._id], rating: Number(e.target.value) },
                            }))
                          }
                          className="border p-1 rounded w-16"
                        />
                        <button
                          onClick={() => handleSubmitReview(b._id)}
                          className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          리뷰 제출
                        </button>
                      </div>
                    )}
                    {tutorReview && (
                      <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded">리뷰 완료</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 자료 섹션 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">📁 자료</h2>
        {materials.length === 0 ? (
          <p>자료 없음</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {materials.map((m) => (
              <div key={m._id} className="bg-white p-3 rounded shadow flex flex-col justify-between">
                <p className="font-medium">{m.title}</p>
                <button
                  onClick={() => handleDownload(`${BACKEND_URL}${m.fileUrl}`)}
                  className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  다운로드
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function getStatusColor(status) {
  switch (status) {
    case "approved":
      return "text-green-600";
    case "rejected":
      return "text-red-600";
    case "completed":
      return "text-blue-600";
    default:
      return "text-gray-500";
  }
}