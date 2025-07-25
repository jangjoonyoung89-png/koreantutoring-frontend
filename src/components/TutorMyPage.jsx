import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import TutorBookingDashboard from "./TutorBookingDashboard";
import TutorPaymentList from "./TutorPaymentList";

function TutorMyPage() {
  const { user } = useContext(AuthContext);

  if (!user || user.role !== "tutor") {
    return <p>접근 권한이 없습니다.</p>;
  }

  return (
    <div>
      <h1>{user.name} 튜터님의 마이페이지</h1>
      <TutorBookingDashboard tutorId={user.id} />
      <TutorPaymentList tutorId={user.id} />
    </div>
  );
}

export default TutorMyPage;