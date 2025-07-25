import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-white px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-4 text-center">
        외국인을 위한 1:1 한국어 튜터링 플랫폼
      </h1>
      <p className="text-lg md:text-xl text-gray-600 mb-8 text-center max-w-xl">
        한국어가 처음이라도 걱정 마세요! 언제 어디서든 원하는 튜터와 1:1 온라인 수업을 예약하고 편리하게 결제할 수 있어요.
      </p>

      <div className="flex flex-col md:flex-row gap-4">
        <Link
          to="/signup"
          className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-700 transition"
        >
          회원가입
        </Link>
        <Link
          to="/login"
          className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-full shadow-md hover:bg-blue-50 transition"
        >
          로그인
        </Link>
        <Link
          to="/tutors"
          className="bg-green-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-green-600 transition"
        >
          튜터 둘러보기
        </Link>
      </div>

      <div className="mt-16 text-sm text-gray-400">© 2025 Korean Tutoring Platform</div>
    </div>
  );
}
