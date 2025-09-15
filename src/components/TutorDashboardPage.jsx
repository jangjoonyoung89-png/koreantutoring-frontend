import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function TutorDashboardPage() {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resBookings = await fetch(
          `http://localhost:8000/api/bookings?tutorId=${user.id}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        if (!resBookings.ok) throw new Error("예약 정보를 불러오는 데 실패했습니다.");
        setBookings(await resBookings.json());

        const resReviews = await fetch(
          `http://localhost:8000/api/reviews?tutorId=${user.id}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        if (!resReviews.ok) throw new Error("리뷰 정보를 불러오는 데 실패했습니다.");
        setReviews(await resReviews.json());
      } catch (err) {
        setError(err.message || "서버 오류");
      }
    };
    if (user?.role === "tutor") fetchData();
  }, [user]);

  const handleApprove = async (bookingId) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/bookings/${bookingId}/approve`,
        { method: "POST", headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (!res.ok) throw new Error("승인 실패");
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: "approved" } : b))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReject = async (bookingId) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/bookings/${bookingId}/reject`,
        { method: "POST", headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (!res.ok) throw new Error("거절 실패");
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: "rejected" } : b))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const handleFileUpload = async () => {
    if (!file) return alert("파일 선택해주세요");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("http://localhost:8000/api/materials", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });
      if (!res.ok) throw new Error("업로드 실패");
      alert("업로드 완료!");
      setFile(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const isClassEnterable = (booking) => {
    const now = new Date();
    const bookingTime = new Date(`${booking.date}T${booking.time}`);
    return now >= bookingTime && booking.status === "approved";
  };

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold text-center mb-10">🎓 튜터 대시보드</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* 예약 현황 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">📊 예약 현황</h2>
        {bookings.length === 0 ? (
          <p>예약 없음</p>
        ) : (
          <div className="grid gap-6">
            {bookings.map((b) => (
              <div
                key={b._id}
                className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0"
              >
                <div className="flex flex-col gap-1">
                  <p>
                    <strong>학생:</strong> {b.student?.full_name}
                  </p>
                  <p>
                    <strong>날짜:</strong> {new Date(b.date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>시간:</strong> {b.time}
                  </p>
                  <p>
                    <strong>요청:</strong> {b.notes || "없음"}
                  </p>
                  <p className={`font-bold ${getStatusColor(b.status)}`}>
                    {b.status || "pending"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/video/${b._id}`}
                    className={`px-3 py-1 rounded text-white ${
                      isClassEnterable(b) ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
                    }`}
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
                  {b.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(b._id)}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        ✔️ 승인
                      </button>
                      <button
                        onClick={() => handleReject(b._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        ❌ 거절
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 자료 업로드 */}
      <section className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-2xl font-semibold mb-4">📁 자료 업로드</h2>
        <div className="flex items-center space-x-3">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="border p-2 rounded"
          />
          <button
            onClick={handleFileUpload}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            업로드
          </button>
          {file && <span>{file.name}</span>}
        </div>
      </section>

      {/* 리뷰 */}
      <section className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-2xl font-semibold mb-4">⭐ 리뷰</h2>
        {reviews.length === 0 ? (
          <p>리뷰 없음</p>
        ) : (
          <div className="grid gap-4">
            {reviews.map((r) => (
              <div
                key={r._id}
                className="p-4 border rounded-lg shadow-sm hover:shadow-md transition"
              >
                <p className="font-semibold">{r.studentName}</p>
                <p>{r.comment}</p>
                <p className="text-yellow-500 font-bold">{'⭐'.repeat(r.rating)}</p>
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
    default:
      return "text-gray-500";
  }
}