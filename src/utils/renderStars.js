import React from "react";

/**
 * 평점 숫자를 별로 시각화
 * @param {number} rating - 0~5 사이의 평점
 * @returns {JSX.Element}
 */
export function renderStars(rating) {
  if (typeof rating !== "number" || rating < 0) rating = 0;
  if (rating > 5) rating = 5;

  const fullStars = Math.floor(rating);           // 예: 4
  const halfStar = rating % 1 >= 0.5;            // 0.5 이상이면 반별 표시
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  const stars = [];

  // 1️⃣ 꽉 찬 별
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <span key={"full_" + i} style={{ color: "#ffc107" }}>
        ★
      </span>
    );
  }

  // 2️⃣ 반별 (간단히 빈 별로 표시)
  if (halfStar) {
    stars.push(
      <span key="half" style={{ color: "#ffc107" }}>
        ☆
      </span>
    );
  }

  // 3️⃣ 빈 별
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <span key={"empty_" + i} style={{ color: "#e4e5e9" }}>
        ★
      </span>
    );
  }

  return <>{stars}</>;
}