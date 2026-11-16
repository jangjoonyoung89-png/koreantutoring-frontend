import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import {
  FaUserEdit,
  FaUser,
  FaSave,
  FaArrowLeft,
  FaCheckCircle,
  FaImage,
} from "react-icons/fa";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// -----------------------------
// API 기본 주소
// -----------------------------
const API_URL = (
  process.env.REACT_APP_API_URL ||
  "https://api.rokmun.com"
).trim().replace(/\/+$/, "");

const DEFAULT_IMAGE = "/images/default-tutor.svg";

// -----------------------------
// 프로필 사진 주소 처리
// -----------------------------
function getImageUrl(photo) {
  if (!photo) return DEFAULT_IMAGE;

  if (
    /^https?:\/\//i.test(photo) ||
    photo.startsWith("data:image") ||
    photo.startsWith("/images/")
  ) {
    return photo;
  }

  return `${API_URL}/${photo.replace(/^\/+/, "")}`;
}

export default function TutorProfileEditPage() {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [tutor, setTutor] = useState(null);

  const [form, setForm] = useState({
    name: "",
    bio: "",
    price: "",
    photo: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // -----------------------------
  // 내 튜터 프로필 조회
  // -----------------------------
  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError("로그인 정보가 없습니다. 다시 로그인해 주세요.");
      return;
    }

    let active = true;

    const fetchProfile = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await axios.get(
          `${API_URL}/api/tutors/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!active) return;

        const data = res.data;

        setTutor(data);

        setForm({
          name: data.name || "",
          bio: data.bio || "",
          price: data.price ?? "",
          photo: data.photo || "",
        });
      } catch (err) {
        if (!active) return;

        console.error("프로필 조회 실패:", err);

        setError(
          err.response?.data?.message ||
          err.response?.data?.error ||
          "튜터 프로필을 불러오지 못했습니다."
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProfile();

    return () => {
      active = false;
    };
  }, [token]);

  // -----------------------------
  // 입력값 변경
  // -----------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  // -----------------------------
  // 승인 상태 확인
  // -----------------------------
  const approved =
    tutor?.approved === true &&
    tutor?.rejected !== true;

  // -----------------------------
  // 프로필 저장
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!token) {
      setError("다시 로그인해 주세요.");
      return;
    }

    if (!approved) {
      setError("관리자 승인 후 프로필을 수정할 수 있습니다.");
      return;
    }

    if (!form.name.trim()) {
      setError("튜터 이름을 입력해 주세요.");
      return;
    }

    if (!form.bio.trim()) {
      setError("자기소개를 입력해 주세요.");
      return;
    }

    const price = Number(form.price);

    if (
      form.price === "" ||
      !Number.isFinite(price) ||
      !Number.isInteger(price) ||
      price < 0
    ) {
      setError("올바른 시간당 수업료를 입력해 주세요.");
      return;
    }

    const photo = form.photo.trim();

    if (photo) {
      try {
        const url = new URL(photo);

        if (!["http:", "https:"].includes(url.protocol)) {
          throw new Error("Invalid URL");
        }
      } catch {
        if (!photo.startsWith("/images/") &&
            !photo.startsWith("/uploads/")) {
          setError(
            "올바른 프로필 사진 주소를 입력해 주세요."
          );
          return;
        }
      }
    }

    setSaving(true);

    try {
      const res = await axios.patch(
        `${API_URL}/api/tutors/me`,
        {
          name: form.name.trim(),
          bio: form.bio.trim(),
          price,
          photo,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedTutor = res.data.tutor;

      setTutor(updatedTutor);

      setForm({
        name: updatedTutor.name || "",
        bio: updatedTutor.bio || "",
        price: updatedTutor.price ?? "",
        photo: updatedTutor.photo || "",
      });

      setMessage(
        "프로필이 정상적으로 저장되었습니다."
      );
    } catch (err) {
      console.error("프로필 저장 실패:", err);

      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "프로필 저장에 실패했습니다."
      );
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------
  // 화면
  // -----------------------------
  return (
    <div className="min-h-screen bg-gray-50">

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* 대시보드 돌아가기 */}
        <button
          type="button"
          onClick={() => navigate("/tutor/dashboard")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-700 font-medium"
        >
          <FaArrowLeft />
          튜터 대시보드로 돌아가기
        </button>

        {/* ROKMUN 헤더 */}
        <section className="bg-gradient-to-r from-blue-800 to-blue-500 rounded-2xl p-7 sm:p-9 shadow-lg text-white">

          <p className="text-sm tracking-widest text-blue-100 font-semibold mb-3">
            ROKMUN TUTOR CENTER
          </p>

          <h1 className="text-3xl font-bold flex items-center gap-3 mb-3">
            <FaUserEdit />
            프로필 관리
          </h1>

          <p className="text-blue-100 text-sm leading-relaxed">
            나만의 튜터 프로필을 만들고
            학습자에게 자신을 소개하세요.
          </p>

        </section>

        {/* 로딩 안내 */}
        {loading && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-blue-700 text-sm">
            튜터 프로필을 불러오는 중입니다.
          </div>
        )}

        {/* 오류 안내 */}
        {error && (
          <div
            role="alert"
            className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm"
          >
            {error}
          </div>
        )}

        {/* 저장 성공 안내 */}
        {message && (
          <div
            role="status"
            className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 text-sm flex items-center gap-2"
          >
            <FaCheckCircle />
            {message}
          </div>
        )}

        {!loading && tutor && (
          <>

            {/* 프로필 요약 */}
            <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

              <div className="flex flex-col sm:flex-row sm:items-center gap-5">

                <div className="w-24 h-24 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center flex-shrink-0">

                  {form.photo ? (
                    <img
                      key={form.photo}
                      src={getImageUrl(form.photo)}
                      alt="튜터 프로필 미리보기"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = DEFAULT_IMAGE;
                      }}
                    />
                  ) : (
                    <FaUser className="text-4xl text-slate-400" />
                  )}

                </div>

                <div>

                  <div className="flex items-center gap-2 flex-wrap">

                    <h2 className="text-xl font-bold text-gray-800">
                      {form.name || "튜터"}
                    </h2>

                    {approved ? (
                      <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full">
                        <FaCheckCircle />
                        승인 완료
                      </span>
                    ) : (
                      <span className="text-xs bg-amber-50 text-amber-700 px-3 py-1 rounded-full">
                        {tutor.rejected
                          ? "승인 거절"
                          : "승인 대기"}
                      </span>
                    )}

                  </div>

                  <p className="text-sm text-gray-500 mt-2">
                    {user?.email || ""}
                  </p>

                  <p className="text-xs text-gray-400 mt-2">
                    저장한 프로필은 학습자에게 공개됩니다.
                  </p>

                </div>

              </div>

            </section>

            {/* 승인 대기 안내 */}
            {!approved && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-700 text-sm">
                관리자 승인 후 프로필을 수정할 수 있습니다.
              </div>
            )}

            {/* 프로필 수정 폼 */}
            <form
              onSubmit={handleSubmit}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8 space-y-7"
            >

              <h2 className="text-xl font-bold text-gray-800">
                기본 프로필 정보
              </h2>

              {/* 튜터 이름 */}
              <div>

                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  튜터 이름
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  disabled={!approved || saving}
                  required
                  maxLength={80}
                  placeholder="학습자에게 표시할 이름"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />

                <p className="text-xs text-gray-400 mt-2">
                  공개 튜터 페이지에 표시되는 이름입니다.
                </p>

              </div>

              {/* 자기소개 */}
              <div>

                <label
                  htmlFor="bio"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  자기소개
                </label>

                <textarea
                  id="bio"
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  disabled={!approved || saving}
                  required
                  rows={7}
                  maxLength={2000}
                  placeholder="한국어 교육 경력, 수업 방식, 전문 분야 등을 소개해 주세요."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />

                <div className="flex justify-between gap-3 mt-2">

                  <p className="text-xs text-gray-400">
                    학습자가 수업을 선택할 때 참고하는 정보입니다.
                  </p>

                  <span className="text-xs text-gray-400">
                    {form.bio.length}/2000
                  </span>

                </div>

              </div>

              {/* 시간당 수업료 */}
              <div>

                <label
                  htmlFor="price"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  시간당 수업료
                </label>

                <div className="relative">

                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="1"
                    value={form.price}
                    onChange={handleChange}
                    disabled={!approved || saving}
                    required
                    placeholder="예: 30000"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-20 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />

                  <span className="absolute right-4 top-3 text-sm text-gray-500">
                    원 / 시간
                  </span>

                </div>

                <p className="text-xs text-gray-400 mt-2">
                  학습자에게 공개할 시간당 수업료를 입력해 주세요.
                </p>

              </div>

              {/* 프로필 사진 */}
              <div>

                <label
                  htmlFor="photo"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
                >
                  <FaImage className="text-blue-600" />
                  프로필 사진 주소
                </label>

                <input
                  id="photo"
                  name="photo"
                  type="text"
                  value={form.photo}
                  onChange={handleChange}
                  disabled={!approved || saving}
                  placeholder="https://example.com/profile.jpg"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />

                <p className="text-xs text-gray-400 mt-2">
                  사진 URL을 입력하면 상단에서 미리 볼 수 있습니다.
                  비워 두면 기본 프로필 이미지가 표시됩니다.
                </p>

                {form.photo && (
                  <button
                    type="button"
                    disabled={!approved || saving}
                    onClick={() => {
                      setForm((prev) => ({
                        ...prev,
                        photo: "",
                      }));
                      setMessage("");
                      setError("");
                    }}
                    className="text-xs text-red-600 hover:underline mt-3"
                  >
                    프로필 사진 제거
                  </button>
                )}

              </div>

              {/* 저장 버튼 */}
              <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row gap-3">

                <button
                  type="submit"
                  disabled={saving || !approved}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl px-6 py-3 font-semibold flex items-center justify-center gap-2 transition"
                >
                  <FaSave />
                  {saving
                    ? "저장 중..."
                    : "프로필 저장"}
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => navigate("/tutor/dashboard")}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl px-6 py-3 font-semibold transition"
                >
                  대시보드 돌아가기
                </button>

              </div>

            </form>

            {/* 공개 페이지 확인 */}
            {approved && tutor._id && (
              <section className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                <div>
                  <h3 className="font-bold text-blue-800">
                    학습자에게 보이는 내 프로필
                  </h3>

                  <p className="text-sm text-blue-600 mt-1">
                    저장한 프로필이 어떻게 표시되는지 확인하세요.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/tutors/${tutor._id}`)}
                  className="bg-white border border-blue-200 text-blue-700 rounded-xl px-5 py-3 text-sm font-semibold hover:bg-blue-100 transition"
                >
                  공개 프로필 보기
                </button>

              </section>
            )}

          </>
        )}

        <footer className="text-center text-xs text-gray-400 py-6">
          ROKMUN · 대한민국으로 향하는 모든 길
        </footer>

      </main>

    </div>
  );
}