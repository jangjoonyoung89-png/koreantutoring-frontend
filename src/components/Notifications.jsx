import { Link } from 'react-router-dom';


{notifications.map((noti) => (
  <div key={noti._id} className="border p-4 mb-2 rounded shadow">
    <p>{noti.message}</p>

    {noti.bookingId && (
      <Link to={`/video-class/${noti.bookingId}`}>
        <button className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded mt-2">
          수업 입장
        </button>
      </Link>
    )}
  </div>
))}