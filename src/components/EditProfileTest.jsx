import React, { useState, useEffect } from "react";

function EditProfileTest() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8000/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setForm({
          full_name: data.full_name || "",
          email: data.email || "",
          password: "", 
        });
      })
      .catch((err) => {
        console.error("내 정보 불러오기 실패", err);
        setMessage("서버 오류가 발생했습니다.");
      });
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:8000/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.detail || "수정 실패");
        return;
      }

      setMessage("수정이 완료되었습니다.");
    } catch (err) {
      console.error("수정 오류", err);
      setMessage("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>프로필 수정</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>이름:</label>
          <input
            type="text"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>이메일:</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>비밀번호:</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="새 비밀번호"
          />
        </div>
        <button type="submit" style={{ marginTop: 10 }}>
          수정하기
        </button>
      </form>
    </div>
  );
}

export default EditProfileTest;