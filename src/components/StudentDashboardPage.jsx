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
      axios
        .get(`/api/bookings?studentId=${user._id}`)
        .then((res) => setBookings(res.data))
        .catch((err) => console.error(err));

      axios
        .get(`/api/materials?studentId=${user._id}`)
        .then((res) => setMaterials(res.data))
        .catch((err) => console.error(err));

      axios
        .get(`/api/reviews?studentId=${user._id}`)
        .then((res) => setReviews(res.data))
        .catch((err) => console.error(err));
    }
  }, [user]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📘 학생 대시보드</h1>

      {/* 예약 목록 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">📅 예약한 수업</h2>
        <ul className="space-y-2">
          {bookings.map((b) => (
            <li key={b._id} className="bg-white shadow rounded p-4">
              <p>
                <strong>튜터:</strong> {b.tutor.full_name}
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
                <strong>튜터:</strong> {file.tutor.full_name}
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
                <strong>튜터:</strong> {r.tutor.full_name}
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