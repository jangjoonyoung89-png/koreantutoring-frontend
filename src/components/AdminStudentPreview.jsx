import React, { useState } from "react";
import { Link } from "react-router-dom";

// 샘플 학생 데이터
const sampleBookings = [
  {
    _id: "b1",
    tutor: { full_name: "장준영" },
    date: "2025-10-09",
    time: "10:00",
    status: "approved",
    reviewSubmitted: false,
  },
  {
    _id: "b2",
    tutor: { full_name: "장서은" },
    date: "2025-10-10",
    time: "14:00",
    status: "pending",
    reviewSubmitted: false,
  },
];

export default function AdminStudentPreview() {
  const [bookings, setBookings] = useState(sampleBookings);
  const [reviewInput, setReviewInput] = useState({});

  const handleSubmitReview = (bookingId) => {
    alert(
      `샘플 리뷰 제출: ${reviewInput[bookingId]?.comment || ""} / ${
        reviewInput[bookingId]?.rating || 5
      }`
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold text-center mb-10">👩‍🎓 학생 대시보드 (미리보기)</h1>

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
                    <strong>튜터:</strong> {b.tutor.full_name}
                  </p>
                  <p>
                    <strong>날짜:</strong> {new Date(b.date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>시간:</strong> {b.time}
                  </p>
                  <p className={`font-bold ${getStatusColor(b.status)}`}>
                    {b.status || "pending"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    to="#"
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    영상
                  </Link>
                  <Link
                    to="#"
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    채팅
                  </Link>
                  <Link
                    to="#"
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    화이트보드
                  </Link>

                  {b.status === "approved" && !b.reviewSubmitted && (
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
                </div>
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