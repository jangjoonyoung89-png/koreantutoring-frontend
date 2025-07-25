import React, { useState } from "react";

function PaymentPage() {
  const [tutorId, setTutorId] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const handlePayment = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:8000/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tutorId,
          amount: parseInt(amount, 10),
          userId: 101, // 추후 백엔드 토큰에서 자동 추출 가능
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage(data.detail || "결제 실패");
        return;
      }

      setMessage("결제가 완료되었습니다.");
    } catch (err) {
      console.error("결제 오류:", err);
      setMessage("서버 오류 발생");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>결제하기</h2>
      {message && <p>{message}</p>}
      <input
        placeholder="튜터 ID"
        value={tutorId}
        onChange={(e) => setTutorId(e.target.value)}
      />
      <input
        placeholder="금액"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handlePayment}>결제</button>
    </div>
  );
}

export default PaymentPage;