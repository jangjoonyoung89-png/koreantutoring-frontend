import React, { useEffect, useState } from "react";

function PaymentList() {
  const [payments, setPayments] = useState([]);
  const [message, setMessage] = useState("");
  const [sortBy, setSortBy] = useState("date"); 
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchPayments = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:8000/payments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setPayments(data);
    } catch (err) {
      console.error("결제 내역 오류:", err);
      setMessage("서버 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []); 

  const deletePayment = async (id) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:8000/payments/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        setMessage(data.detail || "삭제 실패");
        return;
      }

      setPayments(payments.filter((p) => p.id !== id));
      setMessage("삭제 완료");
    } catch (err) {
      console.error("삭제 오류:", err);
      setMessage("서버 오류가 발생했습니다.");
    }
  };

  const filteredPayments = payments
    .filter((p) => {
      if (startDate && new Date(p.date) < new Date(startDate)) return false;
      if (endDate && new Date(p.date) > new Date(endDate)) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "amount") return b.amount - a.amount;
      return new Date(b.date) - new Date(a.date);
    });

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>결제 내역</h2>

      {message && <p>{message}</p>}

      <div style={{ marginBottom: 10 }}>
        <label>시작일: </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <label style={{ marginLeft: 10 }}>종료일: </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>정렬 기준: </label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="date">날짜</option>
          <option value="amount">금액</option>
        </select>
      </div>

      <ul>
        {filteredPayments.map((payment) => (
          <li key={payment.id} style={{ marginBottom: 10 }}>
            금액: {payment.amount}원, 날짜: {payment.date}
            <button
              onClick={() => deletePayment(payment.id)}
              style={{ marginLeft: 10 }}
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PaymentList;
