import React, { useState, useEffect } from "react";
import api from "../../api";

export default function AdminQAManagement() {
  const [qaList, setQaList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQA = async () => {
      try {
        const res = await api.get("/api/admin/qa"); // 백엔드 Q&A API
        setQaList(res.data);
      } catch (err) {
        console.error("Q&A 불러오기 실패", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQA();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">관리자 Q&A 게시판</h2>

      {loading ? (
        <p>로딩 중...</p>
      ) : qaList.length === 0 ? (
        <p>등록된 Q&A가 없습니다.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border px-4 py-2">번호</th>
              <th className="border px-4 py-2">질문</th>
              <th className="border px-4 py-2">답변</th>
            </tr>
          </thead>
          <tbody>
            {qaList.map((qa, idx) => (
              <tr key={qa._id}>
                <td className="border px-4 py-2">{idx + 1}</td>
                <td className="border px-4 py-2">{qa.question}</td>
                <td className="border px-4 py-2">{qa.answer || "미답변"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}