import React, { useEffect, useState, useContext } from "react";
import { useParams, Navigate } from "react-router-dom";
import api from "../api";
import VideoClassPage from "./VideoClassPage";
import { AuthContext } from "../context/AuthContext";

export default function VideoClassPageWrapper() {
  const { bookingId } = useParams();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/bookings/${bookingId}`);
        const bookingData = res.data;

        // 로그인한 사용자와 예약 소유자 확인
        if (!user || (user.role === "student" && bookingData.student !== user._id) || (user.role === "tutor" && bookingData.tutor !== user._id)) {
          setError("❌ 접근 권한이 없습니다.");
        } else {
          setBooking(bookingData);
        }
      } catch {
        setError("❌ 예약 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, user]);

  if (loading) return <p className="text-center mt-6">로딩 중...</p>;
  if (error) return <p className="text-center mt-6 text-red-500">{error}</p>;
  if (!booking) return <Navigate to="/dashboard" replace />;

  return <VideoClassPage videoLink={booking.videoLink} booking={booking} />;
}