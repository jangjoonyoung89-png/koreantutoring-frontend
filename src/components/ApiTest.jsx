import React, { useEffect, useState } from 'react';

function ApiTest() {
  const [tutors, setTutors] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://koreantutoring-backend.onrender.com/api/tutors') 
      .then(res => {
        if (!res.ok) throw new Error('API 호출 실패');
        return res.json();
      })
      .then(data => setTutors(data))
      .catch(err => setError(err.message));
  }, []);

  if (error) return <div>에러 발생: {error}</div>;

  return (
    <div>
      <h1>튜터 목록 테스트</h1>
      <ul>
        {tutors.map(tutor => (
          <li key={tutor._id}>{tutor.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default ApiTest;