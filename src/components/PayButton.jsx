import React from "react";

export default function PayButton({ tutorId, studentId, time, tutorName, price }) {
  const handlePay = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tutorId,
          studentId,
          time,
          tutorName,
          price,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "결제 실패");

      alert("결제 성공: " + data.message);
    } catch (err) {
      alert("결제 오류: " + err.message);
    }
  };

  return (
    <button onClick={handlePay}>
      결제하기 ({price.toLocaleString()}원)
    </button>
  );
}