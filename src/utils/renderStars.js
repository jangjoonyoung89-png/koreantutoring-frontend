export function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push("⭐");
  }

  if (hasHalfStar) {
    stars.push("⭐️"); 
  }

  return stars.join("");
}