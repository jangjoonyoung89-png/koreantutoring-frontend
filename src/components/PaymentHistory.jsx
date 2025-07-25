import React, { useEffect, useState } from "react";

function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:8000/payments", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          setMessage(data.detail || "불러오기 실패");
          return;
        }

        setPayments(data);
      } catch (err) {
        console.error("결제 내역 오류:", err);
        setMessage("서버 오류가 발생했습니다.");
      }
    };

    fetchPayments();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>결제 내역</h2>
      {message && <p>{message}</p>}
      {payments.length === 0 ? (
        <p>결제 내역이 없습니다.</p>
      ) : (
        <ul>
          {payments.map((pay) => (
            <li key={pay.id}>
              💳 튜터 ID: {pay.tutorId} / 금액: ₩{pay.amount} / 시간: {pay.time}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PaymentHistory;