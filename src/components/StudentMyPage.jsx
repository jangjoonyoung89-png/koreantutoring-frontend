import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import StudentBookingList from "./StudentBookingList";
import MyReviewList from "./MyReviewList";

function StudentMyPage() {
  const { user } = useContext(AuthContext);

  if (!user || user.role !== "student") {
    return <p>접근 권한이 없습니다.</p>;
  }

  return (
    <div>
      <h1>{user.name}님의 마이페이지</h1>

      {/* 예약 리스트 */}
      <StudentBookingList studentId={user.id} />

      {/* 내가 작성한 리뷰 */}
      <MyReviewList studentId={user.id} />
    </div>
  );
}

export default StudentMyPage;