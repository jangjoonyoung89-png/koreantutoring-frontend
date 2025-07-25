import React, { useEffect, useState } from "react";

function AvailableTimeSelect({ tutorId, selectedDate, onTimeSelect }) {
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!tutorId || !selectedDate) return;

    const fetchAvailableTimes = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`http://localhost:8000/availability/${tutorId}/${selectedDate}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.detail || "시간 정보를 불러오지 못했습니다.");
          setAvailableTimes([]);
        } else {
          setAvailableTimes(data.availableTimes);
        }
      } catch (err) {
        setError("서버와 연결할 수 없습니다.");
        setAvailableTimes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableTimes();
  }, [tutorId, selectedDate]);

  return (
    <div>
      <label>
        시간 선택:
        <select onChange={(e) => onTimeSelect(e.target.value)} disabled={loading || !availableTimes.length}>
          <option value="">-- 시간 선택 --</option>
          {availableTimes.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
      </label>
      {loading && <p>시간을 불러오는 중...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default AvailableTimeSelect;