import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MaterialsList({ studentId }) {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const token = localStorage.getItem("token"); // 인증이 필요한 경우
        const res = await axios.get(
          `http://localhost:8000/api/materials?studentId=${studentId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMaterials(res.data || []);
      } catch (err) {
        console.error("자료 목록 조회 실패", err);
        setError("자료 목록을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchMaterials();
  }, [studentId]);

  if (loading) return <p>⏳ 자료를 불러오는 중...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">📂 수업 자료</h2>
      {materials.length > 0 ? (
        <ul className="space-y-3">
          {materials.map((file) => (
            <li
              key={file._id}
              className="p-3 border rounded flex justify-between items-center hover:bg-gray-50"
            >
              <span>{file.title}</span>
              <a
                href={file.fileUrl}
                download
                className="text-blue-600 hover:underline"
              >
                다운로드
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">등록된 자료가 없습니다.</p>
      )}
    </div>
  );
}