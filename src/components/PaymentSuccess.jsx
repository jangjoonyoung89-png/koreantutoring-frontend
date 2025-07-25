import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const paymentId = localStorage.getItem("paymentId"); // 준비 API 호출 시 저장해둔 paymentId
  const pg_token = searchParams.get("pg_token");

  useEffect(() => {
    if (!paymentId || !pg_token) {
      setError("결제 승인에 필요한 정보가 없습니다.");
      setLoading(false);
      return;
    }

    axios
      .post(
        "/api/payments/approve",
        { paymentId: parseInt(paymentId), pg_token },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      )
      .then((res) => {
        setLoading(false);
        alert("결제가 성공적으로 완료되었습니다.");
        localStorage.removeItem("paymentId");
        navigate("/dashboard");
      })
      .catch((err) => {
        setError(err.response?.data?.detail || "결제 승인 실패");
        setLoading(false);
      });
  }, [paymentId, pg_token, navigate]);

  if (loading) return <div>결제 승인 중...</div>;
  if (error) return <div>오류: {error}</div>;

  return null;
}

export default PaymentSuccess;