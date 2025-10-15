import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import styles from "./RecommendedTutors.module.css";

const tutors = [
  {
    id: 1,
    name: "장준영",
    experience: 5,
    rating: 4.5,
    nationality: "한국",
    languages: ["한국어", "영어"],
    image: "장준영.jpg",
    isRecommended: true,
    isOnline: true,
  },
  {
    id: 2,
    name: "장서은",
    experience: 3,
    rating: 4.8,
    nationality: "한국",
    languages: ["한국어", "영어", "일본어"],
    image: "장서은.jpg",
    isRecommended: false,
    isOnline: false,
  },
  {
    id: 3,
    name: "김수영",
    experience: 7,
    rating: 5.0,
    nationality: "한국",
    languages: ["한국어", "영어"],
    image: "김수영.jpg",
    isRecommended: true,
    isOnline: true,
  },
];

// 별점 렌더링
const renderStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  for (let i = 0; i < fullStars; i++) stars.push(<FaStar key={`full-${i}`} />);
  if (halfStar) stars.push(<FaStarHalfAlt key="half" />);
  for (let i = 0; i < emptyStars; i++) stars.push(<FaRegStar key={`empty-${i}`} />);

  return stars;
};

export default function RecommendedTutors() {
  return (
    <div className={styles.container}>
      <h2>추천 튜터</h2>
      <div className={styles.cardWrapper}>
        {tutors.map((tutor) => (
          <div key={tutor.id} className={styles.card}>
            <div className={styles.avatarWrapper}>
              <img src={`/images/${tutor.image}`} alt={tutor.name} className={styles.avatar} />
              {tutor.isOnline && <span className={styles.onlineBadge}></span>}
              {tutor.isRecommended && <span className={styles.recommendBadge}>추천</span>}
            </div>
            <div className={styles.info}>
              <h3>{tutor.name}</h3>
              <p>경력: {tutor.experience}년</p>
              <p>국적: {tutor.nationality}</p>
              <p>언어: {tutor.languages.join(", ")}</p>
              <div className={styles.rating}>{renderStars(tutor.rating)}</div>
              <a href={`/tutors/${tutor.id}`} className={styles.link}>
                자세히 보기 →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}