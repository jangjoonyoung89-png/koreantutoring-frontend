import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

function TutorDashboardPage() {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);

  // 예약 & 리뷰 불러오기
  useEffect(() => {
    async function fetchData() {
      try {
        const resBookings = await fetch(
          `http://localhost:8000/api/bookings?tutorId=${user.id}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        if (!resBookings.ok) throw new Error("예약 정보를 불러오는 데 실패했습니다.");
        const dataBookings = await resBookings.json();
        setBookings(dataBookings);

        const resReviews = await fetch(
          `http://localhost:8000/api/reviews?tutorId=${user.id}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        if (!resReviews.ok) throw new Error("리뷰 정보를 불러오는 데 실패했습니다.");
        const dataReviews = await resReviews.json();
        setReviews(dataReviews);
      } catch (err) {
        setError(err.message || "서버 오류가 발생했습니다.");
      }
    }

    if (user?.role === "tutor") fetchData();
  }, [user]);

  // 예약 승인
  const handleApprove = async (bookingId) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/bookings/${bookingId}/approve`,
        { method: "POST", headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (!res.ok) throw new Error("승인에 실패했습니다.");
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: "approved" } : b))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  // 예약 거절
  const handleReject = async (bookingId) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/bookings/${bookingId}/reject`,
        { method: "POST", headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (!res.ok) throw new Error("거절에 실패했습니다.");
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: "rejected" } : b))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  // 자료 업로드
  const handleFileUpload = async () => {
    if (!file) return alert("파일을 선택해주세요.");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(`http://localhost:8000/api/materials`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });
      if (!res.ok) throw new Error("자료 업로드 실패");
      alert("자료 업로드 완료!");
      setFile(null);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold text-center mb-10">🎓 튜터 대시보드</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* 예약 현황 */}
      <section className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-2xl font-semibold mb-4">📊 나의 수업 예약 현황</h2>
        {bookings.length === 0 ? (
          <p>예약 내역이 없습니다.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">학생 이름</th>
                  <th className="px-4 py-2 text-left">날짜</th>
                  <th className="px-4 py-2 text-left">시간</th>
                  <th className="px-4 py-2 text-left">요청사항</th>
                  <th className="px-4 py-2 text-left">상태</th>
                  <th className="px-4 py-2 text-left">기능</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, i) => (
                  <tr key={b._id} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="px-4 py-2">{b.student?.full_name}</td>
                    <td className="px-4 py-2">{new Date(b.date).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{b.time}</td>
                    <td className="px-4 py-2">{b.notes || "없음"}</td>
                    <td className={`px-4 py-2 font-bold ${getStatusColor(b.status)}`}>
                      {b.status || "pending"}
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      <Link className="text-blue-500 hover:underline" to={`/classroom/${b._id}`}>입장</Link>
                      <Link className="text-blue-500 hover:underline" to={`/chat/${b._id}`}>채팅</Link>
                      <Link className="text-blue-500 hover:underline" to={`/whiteboard/${b._id}`}>화이트보드</Link>
                      {b.status === "pending" && (
                        <>
                          <button
                            className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                            onClick={() => handleApprove(b._id)}
                          >
                            ✔️ 승인
                          </button>
                          <button
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                            onClick={() => handleReject(b._id)}
                          >
                            ❌ 거절
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 자료 업로드 */}
      <section className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-2xl font-semibold mb-4">📁 수업 자료 업로드</h2>
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
          {file && <span className="text-gray-700">{file.name}</span>}
        </div>
      </section>

      {/* 리뷰 */}
      <section className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-2xl font-semibold mb-4">⭐ 학생 리뷰</h2>
        {reviews.length === 0 ? (
          <p>리뷰가 없습니다.</p>
        ) : (
          <div className="grid gap-4">
            {reviews.map((r) => (
              <div key={r._id} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition">
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

// 상태 색상
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

export default TutorDashboardPage;