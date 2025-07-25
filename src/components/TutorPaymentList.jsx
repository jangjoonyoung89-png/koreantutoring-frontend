import React, { useEffect, useState } from "react";

function TutorPaymentList({ tutorId }) {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/payments/bytutor?tutor=${tutorId}`);
        const data = await res.json();
        setPayments(data);
      } catch (err) {
        console.error("결제 내역 불러오기 실패:", err);
      }
    };

    fetchPayments();
  }, [tutorId]);

  return (
    <div>
      <h2>💰 결제 내역</h2>
      {payments.length === 0 ? (
        <p>결제 내역이 없습니다.</p>
      ) : (
        <ul>
          {payments.map((payment) => (
            <li key={payment._id} style={{ marginBottom: "1rem" }}>
              <strong>학생:</strong> {payment.student?.name} <br />
              <strong>금액:</strong> ₩{payment.amount} <br />
              <strong>시간:</strong> {payment.time} <br />
              <strong>결제일:</strong> {new Date(payment.createdAt).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TutorPaymentList;