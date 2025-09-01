import { useParams } from "react-router-dom";

const postData = [
  { id: 1, title: "첫번째 게시글", author: "홍길동", content: "이것은 첫 번째 게시글입니다." },
  { id: 2, title: "두번째 게시글", author: "김철수", content: "두 번째 게시글 내용입니다." },
  { id: 3, title: "React 대시보드 만들기", author: "장준영", content: "React로 만든 대시보드 게시글입니다." },
];

function PostDetail() {
  const { id } = useParams();
  const post = postData.find((p) => p.id === parseInt(id));

  if (!post) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <p className="text-red-500 text-xl font-semibold">
            게시글을 찾을 수 없습니다.
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-6 text-blue-600 hover:underline"
          >
            ← 뒤로가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-xl shadow-md max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">{post.title}</h1>
        <p className="text-sm text-gray-500 mb-6">작성자: {post.author}</p>
        <div className="text-gray-700 leading-relaxed whitespace-pre-line">
          {post.content}
        </div>

        {/* ← 뒤로가기 버튼 */}
        <button
          onClick={() => window.history.back()}
          className="mt-6 text-blue-600 hover:underline"
        >
          ← 뒤로가기
        </button>
      </div>
    </div>
  );
}

export default PostDetail;