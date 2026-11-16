import React, {
  createContext,
  useState,
  useEffect,
  useContext,
} from "react";
import axios from "axios";

// ----------------------------
// 📌 AdminAuthContext 생성
// ----------------------------
export const AdminAuthContext = createContext();

// ----------------------------
// 🌐 API 기본 URL
// ----------------------------
const API_URL =
  process.env.REACT_APP_API_URL?.trim() ||
  "https://api.rokmun.com";

// ----------------------------
// 📌 AdminAuthProvider
// ----------------------------
export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [adminToken, setAdminToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ----------------------------
  // 🚪 관리자 로그아웃
  // ----------------------------
  const logout = () => {
    setAdmin(null);
    setAdminToken(null);
    setError(null);

    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    delete axios.defaults.headers.common["Authorization"];

    console.log("🚪 관리자 로그아웃 완료");
  };

  // ----------------------------
  // ✅ 관리자 정보 복원
  // ----------------------------
  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    const storedAdmin = localStorage.getItem("adminUser");

    if (storedToken && storedAdmin) {
      try {
        const parsedAdmin = JSON.parse(storedAdmin);

        if (parsedAdmin?.role === "admin") {
          setAdminToken(storedToken);
          setAdmin(parsedAdmin);

          axios.defaults.headers.common["Authorization"] =
            `Bearer ${storedToken}`;
        } else {
          logout();
        }
      } catch (err) {
        console.error("⚠️ 관리자 복원 실패:", err);
        logout();
      }
    }

    setLoading(false);
  }, []);

  // ----------------------------
  // ✅ 관리자 로그인 정보 저장
  // ----------------------------
  const login = ({ user, token }) => {
    if (!user || !token || user.role !== "admin") {
      setError("유효하지 않은 관리자 로그인 정보입니다.");
      return false;
    }

    setError(null);

    // 상태 저장
    setAdmin(user);
    setAdminToken(token);

    // localStorage 저장
    localStorage.setItem("adminToken", token);
    localStorage.setItem("adminUser", JSON.stringify(user));

    // axios 인증 헤더 설정
    axios.defaults.headers.common["Authorization"] =
      `Bearer ${token}`;

    console.log("✅ 관리자 로그인 성공:", user.email);

    return true;
  };

  // ----------------------------
  // 🔐 관리자 토큰 유효성 검사
  // ----------------------------
  useEffect(() => {
    if (!adminToken) return;

    const checkToken = async () => {
      try {
        await axios.get(`${API_URL}/admin/verify-token`, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });
      } catch (err) {
        if (
          err.response?.status === 401 ||
          err.response?.status === 403
        ) {
          console.warn("⚠️ 관리자 토큰이 유효하지 않습니다.");
          logout();
        } else {
          console.warn("⚠️ 관리자 토큰 검사 실패:", err.message);
        }
      }
    };

    const interval = setInterval(
      checkToken,
      1000 * 60 * 10
    );

    return () => clearInterval(interval);
  }, [adminToken]);

  // ----------------------------
  // 📌 Provider 반환
  // ----------------------------
  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        adminToken,
        loading,
        error,
        login,
        logout,
        isAuthenticated: !!adminToken && !!admin,
      }}
    >
      {!loading && children}
    </AdminAuthContext.Provider>
  );
}

// ----------------------------
// 📌 관리자 인증 Hook
// ----------------------------
export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error(
      "useAdminAuth는 AdminAuthProvider 내부에서만 사용해야 합니다."
    );
  }

  return context;
};