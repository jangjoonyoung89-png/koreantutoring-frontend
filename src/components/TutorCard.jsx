import React from "react";

export default function TutorCard({ name, experience, image }) {
  return (
    <div className="border rounded-lg p-6 shadow-md flex flex-col items-center">
      {/* 프로필 이미지 */}
      <img
        src={image}
        alt={name}
        className="w-24 h-24 rounded-full border-2 border-blue-500 object-cover mb-4"
      />
      <h3 className="text-lg font-bold">{name}</h3>
      <p className="text-gray-600">경력: {experience}년</p>
      <button className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        자세히 보기 →
      </button>
    </div>
  );
}