import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminReviewManagement() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 리뷰 목록 불러오기
  const fetchReviews = () => {
    setLoading(true);
    axios
      .get("http://localhost:8000/api/admin/reviews")
      .then((res) => {
        setReviews(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("리뷰 목록을 불러오는데 실패했습니다.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // 리뷰 삭제 처리
  const handleDelete = (reviewId) => {
    if (!window.confirm("이 리뷰를 삭제하시겠습니까?")) return;

    axios
      .delete(`http://localhost:8000/api/admin/reviews/${reviewId}`)
      .then(() => {
        alert("리뷰가 삭제되었습니다.");
        fetchReviews();
      })
      .catch(() => {
        alert("삭제 실패했습니다. 다시 시도해주세요.");
      });
  };

  if (loading) return <p>리뷰 목록 불러오는 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">관리자 리뷰 관리</h2>

      {reviews.length === 0 ? (
        <p>등록된 리뷰가 없습니다.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">작성자</th>
              <th className="border border-gray-300 p-2">튜터</th>
              <th className="border border-gray-300 p-2">내용</th>
              <th className="border border-gray-300 p-2">평점</th>
              <th className="border border-gray-300 p-2">작성일</th>
              <th className="border border-gray-300 p-2">관리</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review._id}>
                <td className="border border-gray-300 p-2">{review.studentName}</td>
                <td className="border border-gray-300 p-2">{review.tutorName}</td>
                <td className="border border-gray-300 p-2 max-w-xs truncate" title={review.comment}>{review.comment}</td>
                <td className="border border-gray-300 p-2 text-center">{review.rating}</td>
                <td className="border border-gray-300 p-2">{new Date(review.createdAt).toLocaleDateString()}</td>
                <td className="border border-gray-300 p-2 text-center">
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}