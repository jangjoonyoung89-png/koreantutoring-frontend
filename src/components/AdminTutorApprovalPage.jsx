import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

// ===================================================
// 🌐 ROKMUN API 주소
// ===================================================
const API_URL = (
  process.env.REACT_APP_API_URL ||
  "https://api.rokmun.com"
).trim().replace(/\/+$/, "");

// 자동 갱신 주기: 30초
const REFRESH_INTERVAL = 30000;

// ===================================================
// 🛡️ 튜터 승인 관리 페이지
// ===================================================
const AdminTutorApprovalPage = () => {
  const { adminToken } = useAdminAuth();

  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [processingId, setProcessingId] = useState(null);

  const processingRef = useRef(false);
  const requestIdRef = useRef(0);
  const mountedRef = useRef(true);

  // ===================================================
  // 📋 승인 대기 튜터 목록 조회
  // ===================================================
  const fetchTutors = useCallback(
    async (silent = false) => {
      const requestId = ++requestIdRef.current;

      if (!adminToken) {
        setError("관리자 인증 정보가 없습니다.");
        setLoading(false);
        return;
      }

      // 자동 갱신 시 기존 화면 유지
      if (!silent) {
        setLoading(true);
        setError("");
      }

      try {
        const res = await axios.get(
          `${API_URL}/admin/tutors/pending`,
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
          }
        );

        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.tutors;

        if (!Array.isArray(data)) {
          throw new Error(
            "튜터 목록의 응답 형식이 올바르지 않습니다."
          );
        }

        if (
          mountedRef.current &&
          requestId === requestIdRef.current
        ) {
          setTutors(data);
          setError("");
        }
      } catch (err) {
        console.error(
          "튜터 승인 목록 조회 실패:",
          err
        );

        if (
          mountedRef.current &&
          requestId === requestIdRef.current
        ) {
          setError(
            err.response?.data?.message ||
              err.response?.data?.detail ||
              "승인 대기 목록을 불러오지 못했습니다."
          );
        }
      } finally {
        if (
          mountedRef.current &&
          requestId === requestIdRef.current
        ) {
          setLoading(false);
        }
      }
    },
    [adminToken]
  );

  // ===================================================
  // 🔄 최초 조회 및 30초 자동 갱신
  // ===================================================
  useEffect(() => {
    mountedRef.current = true;

    fetchTutors();

    const interval = setInterval(() => {
      // 승인·거절 처리 중에는 자동 갱신 중단
      if (processingRef.current) return;

      // 브라우저 탭이 보일 때만 갱신
      if (document.visibilityState !== "visible") {
        return;
      }

      fetchTutors(true);
    }, REFRESH_INTERVAL);

    // 다른 탭에서 돌아오면 즉시 갱신
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "visible" &&
        !processingRef.current
      ) {
        fetchTutors(true);
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      mountedRef.current = false;
      requestIdRef.current += 1;

      clearInterval(interval);

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [fetchTutors]);

  // ===================================================
  // ✅ 튜터 승인 및 거절
  // ===================================================
  const handleDecision = async (tutor, action) => {
    if (!adminToken || processingRef.current) {
      return;
    }

    const isApprove = action === "approve";
    const actionLabel = isApprove ? "승인" : "거절";
    const tutorName = tutor.name || "해당 튜터";

    const confirmed = window.confirm(
      `${tutorName} 튜터를 ${actionLabel}하시겠습니까?`
    );

    if (!confirmed) return;

    processingRef.current = true;

    // 이전 목록 조회 응답 무효화
    requestIdRef.current += 1;

    setProcessingId(tutor._id);
    setError("");
    setSuccess("");

    try {
      await axios.patch(
        `${API_URL}/admin/tutors/${tutor._id}/${action}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (!mountedRef.current) return;

      setSuccess(
        `${tutorName} 튜터가 정상적으로 ${actionLabel}되었습니다.`
      );

      // 처리된 튜터를 목록에서 제거
      setTutors((prev) =>
        prev.filter((item) => item._id !== tutor._id)
      );

      // 승인·거절 직후 최신 목록 조회
      await fetchTutors(true);
    } catch (err) {
      console.error(
        `튜터 ${actionLabel} 실패:`,
        err
      );

      if (mountedRef.current) {
        setError(
          err.response?.data?.message ||
            err.response?.data?.detail ||
            `튜터 ${actionLabel} 처리에 실패했습니다.`
        );
      }
    } finally {
      processingRef.current = false;

      if (mountedRef.current) {
        setProcessingId(null);
      }
    }
  };

  // ===================================================
  // 💅 화면 구성
  // ===================================================
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
      <div className="max-w-6xl mx-auto">

        {/* 관리자 대시보드 이동 */}
        <Link
          to="/admin/dashboard"
          className="inline-block text-blue-600 hover:text-blue-800 font-medium mb-5"
        >
          ← 관리자 대시보드
        </Link>

        {/* 상단 배너 */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-500 text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-lg">

          <p className="text-blue-100 text-sm font-semibold tracking-widest mb-2">
            ROKMUN ADMIN CENTER
          </p>

          <h1 className="text-3xl font-bold mb-3">
            튜터 승인 관리
          </h1>

          <p className="text-blue-100">
            신규 가입 튜터의 정보를 확인하고
            승인 또는 거절할 수 있습니다.
          </p>

        </div>

        {/* 승인 대기 현황 */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">

          <p className="text-gray-500 text-sm mb-2">
            승인 대기 튜터
          </p>

          <div className="flex items-baseline gap-2">

            <span className="text-4xl font-bold text-blue-700">
              {loading || error ? "—" : tutors.length}
            </span>

            <span className="text-gray-500">
              명
            </span>

          </div>

        </div>

        {/* 성공 메시지 */}
        {success && (
          <div
            role="status"
            className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-6"
          >
            ✓ {success}
          </div>
        )}

        {/* 오류 메시지 */}
        {error && (
          <div
            role="alert"
            className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6"
          >
            {error}
          </div>
        )}

        {/* 승인 요청 목록 */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          승인 요청 목록
        </h2>

        {loading ? (

          /* 최초 로딩 */
          <div className="bg-white rounded-2xl border p-12 text-center">

            <p className="text-gray-500">
              승인 대기 목록을 불러오는 중입니다...
            </p>

          </div>

        ) : error ? (

          /* 오류 발생 시 자동 재조회 */
          <div className="bg-white rounded-2xl border p-10 text-center">

            <p className="text-gray-600 mb-2">
              목록을 확인할 수 없습니다.
            </p>

            <p className="text-gray-400 text-sm">
              잠시 후 자동으로 다시 연결합니다.
            </p>

          </div>

        ) : tutors.length === 0 ? (

          /* 승인 대기 튜터 없음 */
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">

            <div className="text-5xl mb-4">
              ✓
            </div>

            <h3 className="text-lg font-bold text-gray-800 mb-2">
              승인 대기 중인 튜터가 없습니다.
            </h3>

            <p className="text-gray-500 text-sm">
              신규 튜터가 가입하면 이곳에
              승인 요청이 자동으로 표시됩니다.
            </p>

          </div>

        ) : (

          /* 승인 대기 튜터 카드 */
          <div className="space-y-4">

            {tutors.map((tutor) => {
              const isProcessing =
                processingId === tutor._id;

              return (
                <div
                  key={tutor._id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
                >

                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-5">

                    {/* 튜터 정보 */}
                    <div className="flex items-center gap-4">

                      <img
                        src={
                          tutor.photoUrl ||
                          "/images/default-tutor.svg"
                        }
                        alt={tutor.name || "튜터"}
                        className="w-16 h-16 rounded-full object-cover bg-blue-50"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src =
                            "/images/default-tutor.svg";
                        }}
                      />

                      <div>

                        <div className="flex flex-wrap items-center gap-2 mb-1">

                          <h3 className="text-lg font-bold text-gray-800">
                            {tutor.name || "이름 미등록"}
                          </h3>

                          <span className="bg-amber-50 text-amber-700 text-xs px-2 py-1 rounded-full font-medium">
                            승인 대기
                          </span>

                        </div>

                        <p className="text-sm text-gray-500">
                          {tutor.email ||
                            tutor.userId?.email ||
                            "이메일 정보 없음"}
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                          {tutor.bio ||
                            "등록된 소개가 없습니다."}
                        </p>

                      </div>

                    </div>

                    {/* 승인 및 거절 버튼 */}
                    <div className="flex gap-3">

                      <button
                        onClick={() =>
                          handleDecision(tutor, "approve")
                        }
                        disabled={!!processingId}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition disabled:opacity-50"
                      >
                        {isProcessing
                          ? "처리 중..."
                          : "승인"}
                      </button>

                      <button
                        onClick={() =>
                          handleDecision(tutor, "reject")
                        }
                        disabled={!!processingId}
                        className="border border-red-200 text-red-600 hover:bg-red-50 px-6 py-3 rounded-xl font-semibold transition disabled:opacity-50"
                      >
                        거절
                      </button>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        )}

        {/* 하단 */}
        <footer className="text-center text-sm text-gray-400 py-10">
          ROKMUN · 대한민국으로 향하는 모든 길
        </footer>

      </div>
    </div>
  );
};

export default AdminTutorApprovalPage;