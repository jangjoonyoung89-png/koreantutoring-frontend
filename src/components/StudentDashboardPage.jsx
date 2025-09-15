import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
  CalendarDaysIcon,
  BookOpenIcon,
  StarIcon,
  PlayCircleIcon,
  FolderIcon,
  ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/24/outline";

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");

  // 데이터 불러오기
  useEffect(() => {
    if (!user?._id) return;

    async function fetchData() {
      try {
        const [bookingsRes, materialsRes, reviewsRes] = await Promise.all([
          axios.get(`/api/bookings?studentId=${user._id}`),
          axios.get(`/api/materials?studentId=${user._id}`),
          axios.get(`/api/reviews?studentId=${user._id}`),
        ]);
        setBookings(bookingsRes.data);
        setMaterials(materialsRes.data);
        setReviews(reviewsRes.data);
      } catch (err) {
        console.error("학생 대시보드 데이터 로딩 오류:", err);
        setError("데이터를 불러오는 데 실패했습니다.");
      }
    }

    fetchData();
  }, [user]);

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans">
      {/* 헤더 */}
      <h1 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-2">
        📘 학생 대시보드
      </h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard count={bookings.length} label="예약 수업" icon={<CalendarDaysIcon className="h-10 w-10 text-blue-600" />} colorFrom="blue-100" colorTo="blue-200" />
        <StatCard count={materials.length} label="수업 자료" icon={<FolderIcon className="h-10 w-10 text-green-600" />} colorFrom="green-100" colorTo="green-200" />
        <StatCard count={reviews.length} label="작성 리뷰" icon={<StarIcon className="h-10 w-10 text-yellow-600" />} colorFrom="yellow-100" colorTo="yellow-200" />
      </div>

      {/* 예약 목록 */}
      <DashboardSection title="예약한 수업" icon={<BookOpenIcon className="h-6 w-6 text-blue-600" />}>
        {bookings.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {bookings.map((b) => (
              <Card key={b._id}>
                <p className="font-medium text-gray-800"><strong>튜터:</strong> {b.tutor?.full_name || "정보 없음"}</p>
                <p className="text-gray-600"><strong>일시:</strong> {b.date} {b.time}</p>
                <Link
                  to={`/video/${b._id}`}
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <PlayCircleIcon className="h-5 w-5" />
                  수업 참여
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">아직 예약된 수업이 없습니다.</p>
        )}
      </DashboardSection>

      {/* 수업 자료 */}
      <DashboardSection title="수업 자료" icon={<FolderIcon className="h-6 w-6 text-green-600" />}>
        {materials.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {materials.map((file) => (
              <Card key={file._id}>
                <p className="font-medium text-gray-800"><strong>튜터:</strong> {file.tutor?.full_name || "정보 없음"}</p>
                <p className="text-gray-600">
                  <strong>파일:</strong>{" "}
                  <a
                    href={file.fileUrl}
                    className="text-blue-600 underline hover:text-blue-800"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {file.originalName || "자료"}
                  </a>
                </p>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">아직 업로드된 수업 자료가 없습니다.</p>
        )}
      </DashboardSection>

      {/* 리뷰 작성 */}
      <DashboardSection title="내가 쓴 리뷰" icon={<ChatBubbleBottomCenterTextIcon className="h-6 w-6 text-yellow-600" />}>
        {reviews.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {reviews.map((r) => (
              <Card key={r._id}>
                <p className="font-medium text-gray-800"><strong>튜터:</strong> {r.tutor?.full_name || "정보 없음"}</p>
                <p className="flex items-center gap-1 text-yellow-600"><strong>별점:</strong> {r.rating} ⭐</p>
                <p className="text-gray-700"><strong>내용:</strong> {r.comment}</p>
                <p className="text-sm text-gray-500 mt-2">{new Date(r.createdAt).toLocaleString()}</p>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">아직 작성한 리뷰가 없습니다.</p>
        )}
      </DashboardSection>
    </div>
  );
}

// ---------------------
// 재사용 컴포넌트
// ---------------------
const StatCard = ({ count, label, icon, colorFrom, colorTo }) => (
  <div className={`bg-gradient-to-r from-${colorFrom} to-${colorTo} p-6 rounded-2xl shadow hover:shadow-lg transition`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-3xl font-bold">{count}</p>
        <p className="text-gray-700">{label}</p>
      </div>
      {icon}
    </div>
  </div>
);

const DashboardSection = ({ title, icon, children }) => (
  <section className="mb-12">
    <h2 className="text-2xl font-semibold mb-5 flex items-center gap-2">{icon}{title}</h2>
    {children}
  </section>
);

const Card = ({ children }) => (
  <div className="bg-white rounded-xl shadow hover:shadow-md p-5 transition">{children}</div>
);