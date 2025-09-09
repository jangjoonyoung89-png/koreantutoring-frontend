import React from "react";

export default function KoreanTutoringIcon({ size = 128 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 512 512"
    >
      {/* 책 모양 */}
      <rect x="60" y="120" width="180" height="250" fill="#2563eb" rx="16" />
      <rect x="260" y="120" width="180" height="250" fill="#3b82f6" rx="16" />

      {/* 말풍선 */}
      <path
        d="M120 420h272c20 0 36-16 36-36V220c0-20-16-36-36-36H120c-20 0-36 16-36 36v164c0 20 16 36 36 36z"
        fill="#ffffff"
        stroke="#2563eb"
        strokeWidth="8"
      />

      {/* 꼬리 */}
      <polygon points="200,420 160,480 200,450" fill="#ffffff" stroke="#2563eb" strokeWidth="8" />

      {/* 글자 '한국어' */}
      <text
        x="50%"
        y="310"
        textAnchor="middle"
        fontSize="60"
        fontWeight="bold"
        fill="#2563eb"
      >
        한국어
      </text>
    </svg>
  );
}