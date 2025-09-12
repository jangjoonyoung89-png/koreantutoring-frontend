import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (user?._id) {
      Promise.all([
        axios.get(`/api/bookings?studentId=${user._id}`),
        axios.get(`/api/materials?studentId=${user._id}`),
        axios.get(`/api/reviews?studentId=${user._id}`),
      ])
        .then(([bookingsRes, materialsRes, reviewsRes]) => {
          setBookings(bookingsRes.data);
          setMaterials(materialsRes.data);
          setReviews(reviewsRes.data);
        })
        .catch((err) => console.error("학생 대시보드 데이터 로딩 오류:", err));
    }
  }, [user]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📘 학생 대시보드</h1>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="bg-blue-100 p-4 rounded-lg shadow text-center">
          <p className="text-xl font-bold">{bookings.length}</p>
          <p className="text-gray-700">예약 수업</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow text-center">
          <p className="text-xl font-bold">{materials.length}</p>
          <p className="text-gray-700">수업 자료</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg shadow text-center">
          <p className="text-xl font-bold">{reviews.length}</p>
          <p className="text-gray-700">작성 리뷰</p>
        </div>
      </div>

      {/* 예약 목록 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">📅 예약한 수업</h2>
        <ul className="space-y-2">
          {bookings.map((b) => (
            <li key={b._id} className="bg-white shadow rounded p-4">
              <p>
                <strong>튜터:</strong> {b.tutor?.full_name || "정보 없음"}
              </p>
              <p>
                <strong>일시:</strong> {b.date} {b.time}
              </p>
              <Link
                to={`/video/${b._id}`}
                className="text-blue-600 hover:underline"
              >
                수업 참여
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 수업 자료 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">📂 수업 자료</h2>
        <ul className="space-y-2">
          {materials.map((file) => (
            <li key={file._id} className="bg-white shadow rounded p-4">
              <p>
                <strong>튜터:</strong> {file.tutor?.full_name || "정보 없음"}
              </p>
              <p>
                <strong>파일:</strong>{" "}
                <a
                  href={file.fileUrl}
                  className="text-blue-500 underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  {file.originalName}
                </a>
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* 리뷰 작성 */}
      <section>
        <h2 className="text-xl font-semibold mb-3">📝 내가 쓴 리뷰</h2>
        <ul className="space-y-2">
          {reviews.map((r) => (
            <li key={r._id} className="bg-white shadow rounded p-4">
              <p>
                <strong>튜터:</strong> {r.tutor?.full_name || "정보 없음"}
              </p>
              <p>
                <strong>별점:</strong> {r.rating} ⭐
              </p>
              <p>
                <strong>내용:</strong> {r.comment}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(r.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}