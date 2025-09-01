import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MaterialsList({ studentId }) {
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const res = await axios.get(`/api/materials?studentId=${studentId}`);
        setMaterials(res.data);
      } catch (err) {
        console.error("자료 목록 조회 실패", err);
      }
    };
    fetchMaterials();
  }, [studentId]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">수업 자료</h2>
      {materials.map((file) => (
        <div key={file._id} className="p-3 border rounded mb-2">
          <p>{file.title}</p>
          <a
            href={file.fileUrl}
            download
            className="text-blue-500 hover:underline"
          >
            파일 다운로드
          </a>
        </div>
      ))}
    </div>
  );
}