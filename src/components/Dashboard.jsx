import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const displayName =
    user?.full_name?.trim() !== "" ? user.full_name : user?.email || "사용자";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">📊 대시보드</h2>
        <p className="text-lg text-gray-600 mb-6">
          환영합니다,{" "}
          <span className="text-blue-600 font-semibold">{displayName}</span>!
        </p>
        <button
          aria-label="로그아웃"
          onClick={handleLogout}
          className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg shadow transition duration-200"
        >
          로그아웃
        </button>

        {/* 게시판 컴포넌트 삽입 */}
        <Board />
      </div>
    </div>
  );
}

function Board() {
  const navigate = useNavigate();

  // 임시 게시글 데이터 (나중에 API 연동 가능)
  const posts = [
    { id: 1, title: "첫번째 게시글", author: "홍길동" },
    { id: 2, title: "두번째 게시글", author: "김철수" },
    { id: 3, title: "React 대시보드 만들기", author: "장준영" },
  ];

  const handleClick = (id) => {
    navigate(`/posts/${id}`);
  };

  return (
    <div className="mt-8 text-left">
      <h3 className="text-xl font-semibold mb-4 border-b pb-2">게시판</h3>
      <ul>
        {posts.map((post) => (
          <li
            key={post.id}
            onClick={() => handleClick(post.id)}
            className="mb-3 p-3 border rounded hover:bg-gray-50 cursor-pointer transition"
          >
            <strong className="text-blue-600 hover:underline">{post.title}</strong>
            <div className="text-sm text-gray-500 mt-1">작성자: {post.author}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;