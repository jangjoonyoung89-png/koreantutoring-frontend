import React, { useEffect, useState } from "react";

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("회원 목록 불러오기 실패:", err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">회원 목록</h2>
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user._id} className="border-b pb-2">
            {user.full_name} ({user.email}) - {user.role}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;