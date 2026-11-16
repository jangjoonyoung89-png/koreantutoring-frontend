import React, {
  useState,
  useEffect,
  useContext,
} from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";

import {
  FaCalendarAlt,
  FaClock,
  FaSave,
  FaArrowLeft,
  FaCheckCircle,
  FaTrashAlt,
} from "react-icons/fa";

import { AuthContext } from "../context/AuthContext";

// -----------------------------
// API 기본 주소
// -----------------------------
const API_URL = (
  process.env.REACT_APP_API_URL ||
  "https://api.rokmun.com"
).trim().replace(/\/+$/, "");

// -----------------------------
// 요일 설정
// -----------------------------
const DAYS = [
  { value: "Monday", label: "월요일" },
  { value: "Tuesday", label: "화요일" },
  { value: "Wednesday", label: "수요일" },
  { value: "Thursday", label: "목요일" },
  { value: "Friday", label: "금요일" },
  { value: "Saturday", label: "토요일" },
  { value: "Sunday", label: "일요일" },
];

// -----------------------------
// 기본 수업 시간
// -----------------------------
const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
];

// -----------------------------
// 기존 일정 정리
// -----------------------------
function normalizeAvailability(data) {
  if (!Array.isArray(data)) return [];

  return DAYS.map(({ value }) => {
    const slots = data
      .filter((item) => item.day === value)
      .flatMap((item) =>
        Array.isArray(item.slots)
          ? item.slots
          : []
      )
      .filter(
        (slot) =>
          typeof slot === "string" &&
          /^([01]\d|2[0-3]):[0-5]\d$/.test(slot)
      );

    return {
      day: value,
      slots: [...new Set(slots)].sort(),
    };
  }).filter((item) => item.slots.length > 0);
}

export default function TutorAvailabilityPage() {
  const { user, token } = useContext(AuthContext);

  const navigate = useNavigate();

  const [tutor, setTutor] = useState(null);

  const [availability, setAvailability] =
    useState([]);

  const [savedAvailability, setSavedAvailability] =
    useState([]);

  const [selectedDay, setSelectedDay] =
    useState("Monday");

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");

  // -----------------------------
  // 로그인한 튜터 정보 조회
  // -----------------------------
  useEffect(() => {
    if (!user || !token) {
      setLoading(false);
      setError(
        "로그인 정보가 없습니다. 다시 로그인해 주세요."
      );
      return;
    }

    if (user.role !== "tutor") {
      setLoading(false);
      setError(
        "튜터 계정으로만 접근할 수 있습니다."
      );
      return;
    }

    let active = true;

    const fetchAvailability = async () => {
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

        const normalized =
          normalizeAvailability(
            data.availableTimes
          );

        setTutor(data);
        setAvailability(normalized);
        setSavedAvailability(normalized);

        if (normalized.length > 0) {
          setSelectedDay(normalized[0].day);
        }
      } catch (err) {
        if (!active) return;

        console.error(
          "수업 가능 시간 조회 실패:",
          err
        );

        setError(
          err.response?.data?.message ||
          err.response?.data?.error ||
          "수업 가능 시간을 불러오지 못했습니다."
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchAvailability();

    return () => {
      active = false;
    };
  }, [user, token]);

  // -----------------------------
  // 승인 여부
  // -----------------------------
  const approved =
    tutor?.approved === true &&
    tutor?.rejected !== true;

  // -----------------------------
  // 요일별 선택된 시간
  // -----------------------------
  const getDaySlots = (day) => {
    return (
      availability.find(
        (item) => item.day === day
      )?.slots || []
    );
  };

  const selectedSlots =
    getDaySlots(selectedDay);

  // 기존에 저장된 별도 시간도 유지
  const displaySlots = [
    ...new Set([
      ...TIME_SLOTS,
      ...selectedSlots,
    ]),
  ].sort();

  // -----------------------------
  // 시간 선택 및 해제
  // -----------------------------
  const toggleSlot = (day, slot) => {
    if (!approved || saving) return;

    setAvailability((prev) => {
      const existing = prev.find(
        (item) => item.day === day
      );

      const currentSlots =
        existing?.slots || [];

      const nextSlots =
        currentSlots.includes(slot)
          ? currentSlots.filter(
              (time) => time !== slot
            )
          : [...currentSlots, slot].sort();

      const next = prev.filter(
        (item) => item.day !== day
      );

      if (nextSlots.length > 0) {
        next.push({
          day,
          slots: nextSlots,
        });
      }

      return normalizeAvailability(next);
    });

    setMessage("");
    setError("");
  };

  // -----------------------------
  // 선택 요일 전체 시간 해제
  // -----------------------------
  const clearDay = () => {
    if (!approved || saving) return;

    setAvailability((prev) =>
      prev.filter(
        (item) => item.day !== selectedDay
      )
    );

    setMessage("");
    setError("");
  };

  // -----------------------------
  // 전체 일정 초기화
  // -----------------------------
  const clearAll = () => {
    if (!approved || saving) return;

    if (
      !window.confirm(
        "모든 수업 가능 시간을 해제하시겠습니까? 저장해야 실제 일정에 반영됩니다."
      )
    ) {
      return;
    }

    setAvailability([]);
    setMessage("");
    setError("");
  };

  // -----------------------------
  // 저장된 일정으로 되돌리기
  // -----------------------------
  const resetChanges = () => {
    setAvailability(savedAvailability);
    setMessage("");
    setError("");
  };

  // -----------------------------
  // 변경 여부
  // -----------------------------
  const hasChanges =
    JSON.stringify(
      normalizeAvailability(availability)
    ) !==
    JSON.stringify(
      normalizeAvailability(savedAvailability)
    );

  // -----------------------------
  // 등록된 시간 개수
  // -----------------------------
  const totalSlots = availability.reduce(
    (sum, item) => sum + item.slots.length,
    0
  );

  // -----------------------------
  // 수업 가능 시간 저장
  // -----------------------------
  const handleSubmit = async () => {
    setError("");
    setMessage("");

    if (!token || !tutor?._id) {
      setError(
        "튜터 정보를 확인할 수 없습니다."
      );
      return;
    }

    if (!approved) {
      setError(
        "관리자 승인 후 일정을 등록할 수 있습니다."
      );
      return;
    }

    if (!hasChanges) {
      setMessage(
        "변경된 수업 가능 시간이 없습니다."
      );
      return;
    }

    const normalized =
      normalizeAvailability(availability);

    setSaving(true);

    try {
      // 실제 Tutor 문서의 _id 사용
      await axios.patch(
        `${API_URL}/api/tutors/${tutor._id}/availability`,
        {
          availableTimes: normalized,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAvailability(normalized);
      setSavedAvailability(normalized);

      setMessage(
        "수업 가능 시간이 정상적으로 저장되었습니다."
      );
    } catch (err) {
      console.error(
        "수업 가능 시간 저장 실패:",
        err
      );

      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "수업 가능 시간 저장에 실패했습니다."
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

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* 대시보드 돌아가기 */}
        <button
          type="button"
          onClick={() =>
            navigate("/tutor/dashboard")
          }
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-700 font-medium"
        >
          <FaArrowLeft />
          튜터 대시보드로 돌아가기
        </button>

        {/* ROKMUN 헤더 */}
        <section className="bg-gradient-to-r from-blue-800 to-blue-500 rounded-2xl p-7 sm:p-9 text-white shadow-lg">

          <p className="text-sm tracking-widest text-blue-100 font-semibold mb-3">
            ROKMUN TUTOR CENTER
          </p>

          <h1 className="text-3xl font-bold flex items-center gap-3 mb-3">
            <FaCalendarAlt />
            수업 가능 시간 관리
          </h1>

          <p className="text-sm text-blue-100 leading-relaxed">
            학습자가 예약할 수 있는 요일과 시간을
            자유롭게 설정하세요.
          </p>

        </section>

        {/* 로딩 안내 */}
        {loading && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 text-blue-700 text-sm">
            수업 가능 시간을 불러오는 중입니다.
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

        {/* 저장 성공 */}
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

            {/* 튜터 및 일정 요약 */}
            <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">

                <div>

                  <h2 className="text-xl font-bold text-gray-800">
                    {tutor.name} 튜터
                  </h2>

                  <p className="text-sm text-gray-500 mt-2">
                    매주 반복되는 수업 가능 일정을 설정합니다.
                  </p>

                  <span
                    className={`inline-block text-xs rounded-full px-3 py-1 mt-3 ${
                      approved
                        ? "bg-green-50 text-green-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {approved
                      ? "승인 완료"
                      : tutor.rejected
                      ? "승인 거절"
                      : "승인 대기"}
                  </span>

                </div>

                <div className="flex gap-3">

                  <div className="bg-blue-50 rounded-xl px-5 py-4 text-center">

                    <p className="text-xs text-blue-600 mb-1">
                      수업 가능 요일
                    </p>

                    <p className="text-2xl font-bold text-blue-700">
                      {availability.length}일
                    </p>

                  </div>

                  <div className="bg-slate-50 rounded-xl px-5 py-4 text-center">

                    <p className="text-xs text-gray-500 mb-1">
                      주간 시간대
                    </p>

                    <p className="text-2xl font-bold text-gray-800">
                      {totalSlots}개
                    </p>

                  </div>

                </div>

              </div>

            </section>

            {!approved && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-700 text-sm">
                관리자 승인 후 수업 가능 시간을
                등록하거나 수정할 수 있습니다.
              </div>
            )}

            {/* 요일 및 시간 선택 */}
            <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-7">

              {/* 요일 선택 */}
              <div>

                <h2 className="text-lg font-bold text-gray-800 mb-2">
                  1. 수업 가능 요일 선택
                </h2>

                <p className="text-sm text-gray-500 mb-5">
                  설정할 요일을 선택해 주세요.
                </p>

                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">

                  {DAYS.map((day) => {
                    const count =
                      getDaySlots(day.value).length;

                    const active =
                      selectedDay === day.value;

                    return (
                      <button
                        key={day.value}
                        type="button"
                        disabled={saving}
                        onClick={() =>
                          setSelectedDay(day.value)
                        }
                        className={`rounded-xl border px-2 py-4 text-center transition ${
                          active
                            ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                            : "bg-white border-gray-200 text-gray-700 hover:bg-blue-50"
                        }`}
                      >

                        <span className="block text-sm font-bold">
                          {day.label}
                        </span>

                        <span
                          className={`block text-xs mt-2 ${
                            active
                              ? "text-blue-100"
                              : count > 0
                              ? "text-blue-600"
                              : "text-gray-400"
                          }`}
                        >
                          {count > 0
                            ? `${count}개`
                            : "미설정"}
                        </span>

                      </button>
                    );
                  })}

                </div>

              </div>

              <div className="border-t border-gray-100" />

              {/* 시간 선택 */}
              <div>

                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">

                  <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <FaClock className="text-blue-600" />
                    2. 수업 가능 시간 선택
                  </h2>

                  <span className="text-xs bg-blue-50 text-blue-700 px-3 py-2 rounded-lg">
                    한국 시간 (KST)
                  </span>

                </div>

                <p className="text-sm text-gray-500 mb-5">

                  <strong className="text-blue-700">
                    {
                      DAYS.find(
                        (day) =>
                          day.value === selectedDay
                      )?.label
                    }
                  </strong>

                  에 수업할 수 있는 시작 시간을 선택하세요.

                </p>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">

                  {displaySlots.map((slot) => {
                    const selected =
                      selectedSlots.includes(slot);

                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={!approved || saving}
                        aria-pressed={selected}
                        onClick={() =>
                          toggleSlot(
                            selectedDay,
                            slot
                          )
                        }
                        className={`rounded-xl border py-4 text-sm font-semibold transition disabled:opacity-50 ${
                          selected
                            ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                            : "bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                        }`}
                      >
                        {selected ? "✓ " : ""}
                        {slot}
                      </button>
                    );
                  })}

                </div>

                <div className="flex items-center justify-between mt-5 gap-3">

                  <p className="text-xs text-gray-500">
                    선택된 시간: {selectedSlots.length}개
                  </p>

                  <button
                    type="button"
                    disabled={
                      !approved ||
                      saving ||
                      selectedSlots.length === 0
                    }
                    onClick={clearDay}
                    className="text-xs text-red-600 hover:underline disabled:text-gray-300"
                  >
                    이 요일 전체 해제
                  </button>

                </div>

              </div>

            </section>

            {/* 등록 일정 요약 */}
            <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">

              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">

                <h2 className="text-xl font-bold text-gray-800">
                  주간 수업 일정
                </h2>

                <button
                  type="button"
                  disabled={
                    !approved ||
                    saving ||
                    availability.length === 0
                  }
                  onClick={clearAll}
                  className="text-xs text-red-600 hover:underline disabled:text-gray-300 flex items-center gap-1"
                >
                  <FaTrashAlt />
                  전체 일정 해제
                </button>

              </div>

              <p className="text-sm text-gray-500 mb-5">
                설정한 수업 가능 시간은 매주 반복됩니다.
                저장 버튼을 눌러야 실제 일정에 반영됩니다.
              </p>

              <div className="space-y-3">

                {DAYS.map((day) => {
                  const slots =
                    getDaySlots(day.value);

                  return (
                    <div
                      key={day.value}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 border border-gray-100 rounded-xl p-4"
                    >

                      <span className="w-20 flex-shrink-0 text-sm font-bold text-gray-700">
                        {day.label}
                      </span>

                      {slots.length > 0 ? (
                        <div className="flex flex-wrap gap-2">

                          {slots.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              disabled={
                                !approved || saving
                              }
                              onClick={() =>
                                toggleSlot(
                                  day.value,
                                  slot
                                )
                              }
                              title="클릭하여 시간 해제"
                              className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-xs font-medium hover:bg-blue-100 disabled:opacity-50"
                            >
                              {slot} ×
                            </button>
                          ))}

                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">
                          수업 가능 시간 없음
                        </span>
                      )}

                    </div>
                  );
                })}

              </div>

            </section>

            {/* 저장 영역 */}
            <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">

              {hasChanges && (
                <div className="bg-amber-50 text-amber-700 rounded-xl p-4 text-sm">
                  아직 저장하지 않은 변경 사항이 있습니다.
                </div>
              )}

              {message && (
                <div
                  role="status"
                  className="bg-green-50 text-green-700 rounded-xl p-4 text-sm flex items-center gap-2"
                >
                  <FaCheckCircle />
                  {message}
                </div>
              )}

              {error && (
                <div
                  role="alert"
                  className="bg-red-50 text-red-700 rounded-xl p-4 text-sm"
                >
                  {error}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={
                    !approved ||
                    saving ||
                    !hasChanges
                  }
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl py-4 px-6 font-semibold flex items-center justify-center gap-2 transition"
                >
                  <FaSave />

                  {saving
                    ? "저장 중..."
                    : "수업 가능 시간 저장"}
                </button>

                <button
                  type="button"
                  disabled={saving || !hasChanges}
                  onClick={resetChanges}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 rounded-xl py-4 px-6 font-semibold transition"
                >
                  변경 사항 취소
                </button>

              </div>

            </section>

            {/* 공개 페이지 확인 */}
            {approved && tutor._id && (
              <section className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                <div>

                  <h3 className="font-bold text-blue-800">
                    학습자에게 보이는 수업 일정
                  </h3>

                  <p className="text-sm text-blue-600 mt-1">
                    저장한 수업 가능 시간을 공개 페이지에서
                    확인하세요.
                  </p>

                </div>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => {
                    if (
                      hasChanges &&
                      !window.confirm(
                        "저장하지 않은 변경 사항이 있습니다. 이동하시겠습니까?"
                      )
                    ) {
                      return;
                    }

                    navigate(
                      `/tutors/${tutor._id}`
                    );
                  }}
                  className="bg-white border border-blue-200 text-blue-700 rounded-xl px-5 py-3 text-sm font-semibold hover:bg-blue-100 transition"
                >
                  공개 튜터 페이지 보기
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