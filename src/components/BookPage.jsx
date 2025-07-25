import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function BookPage() {
  const [date, setDate] = useState(new Date());

  return (
    <div>
      <h3>예약 날짜 선택</h3>
      <Calendar onChange={setDate} value={date} />
      <p>선택한 날짜: {date.toDateString()}</p>
    </div>
  );
}