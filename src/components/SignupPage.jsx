import React, { useState } from "react";
import { Link } from "react-router-dom";

function SignupPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    role: "student",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL =
    process.env.REACT_APP_API_URL || "https://api.rokmun.com";

  // 입력값 변경
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
    setSuccess("");
  };

  // 회원 유형 선택
  const handleRoleChange = (role) => {
    setForm((prev) => ({ ...prev, role }));
    setError("");
    setSuccess("");
  };

  // 이메일 형식 확인
  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // 회원가입 처리
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");
    setSuccess("");

    if (!form.fullName.trim()) {
      return setError("이름을 입력하세요. Please enter your name.");
    }

    if (!validateEmail(form.email.trim())) {
      return setError(
        "유효한 이메일을 입력하세요. Please enter a valid email."
      );
    }

    if (form.password.length < 8) {
      return setError(
        "비밀번호는 최소 8자 이상이어야 합니다. Password must be at least 8 characters."
      );
    }

    if (form.password !== form.confirmPassword) {
      return setError(
        "비밀번호가 일치하지 않습니다. Passwords do not match."
      );
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
          full_name: form.fullName.trim(),
          role: form.role,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setSuccess(
          "회원가입이 완료되었습니다! Your account has been created."
        );

        setForm({
          email: "",
          password: "",
          confirmPassword: "",
          fullName: "",
          role: "student",
        });
      } else {
        setError(
          typeof data.detail === "string"
            ? data.detail
            : typeof data.message === "string"
            ? data.message
            : "회원가입에 실패했습니다. Sign up failed."
        );
      }
    } catch (err) {
      console.error("서버 오류:", err);

      setError(
        "서버 연결 오류가 발생했습니다. Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* ROKMUN 브랜드 */}
        <div style={styles.brand}>
          <h1 style={styles.brandTitle}>ROKMUN</h1>

          <p style={styles.brandSlogan}>
            Your Gateway to Korea
          </p>
        </div>

        <div style={styles.divider} />

        {/* 회원가입 제목 */}
        <h2 style={styles.title}>회원가입</h2>

        <p style={styles.subtitle}>
          Create your ROKMUN account
        </p>

        {/* 오류 및 성공 메시지 */}
        {error && (
          <div role="alert" style={styles.errorMessage}>
            {error}
          </div>
        )}

        {success && (
          <div role="status" style={styles.successMessage}>
            {success}
            <br />
            <Link to="/login" style={styles.loginLink}>
              로그인하기 · Log In →
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* 회원 유형 선택 */}
          <fieldset style={styles.fieldset}>
            <legend style={styles.label}>
              회원 유형 · Account Type
            </legend>

            <div style={styles.roleContainer}>

              <button
                type="button"
                aria-pressed={form.role === "student"}
                style={{
                  ...styles.roleCard,
                  ...(form.role === "student"
                    ? styles.selectedRole
                    : {}),
                }}
                onClick={() => handleRoleChange("student")}
              >
                <span style={styles.roleIcon}>🎓</span>

                <span style={styles.roleTitle}>학습자</span>

                <span style={styles.roleEnglish}>
                  Learner
                </span>

                <span style={styles.roleDescription}>
                  한국어 배우기
                </span>
              </button>

              <button
                type="button"
                aria-pressed={form.role === "tutor"}
                style={{
                  ...styles.roleCard,
                  ...(form.role === "tutor"
                    ? styles.selectedRole
                    : {}),
                }}
                onClick={() => handleRoleChange("tutor")}
              >
                <span style={styles.roleIcon}>📖</span>

                <span style={styles.roleTitle}>튜터</span>

                <span style={styles.roleEnglish}>
                  Tutor
                </span>

                <span style={styles.roleDescription}>
                  한국어 가르치기
                </span>
              </button>

            </div>
          </fieldset>

          {/* 이름 */}
          <label htmlFor="fullName" style={styles.label}>
            이름 · Full Name
          </label>

          <input
            id="fullName"
            name="fullName"
            type="text"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Enter your name"
            autoComplete="name"
            style={styles.input}
            required
          />

          {/* 이메일 */}
          <label htmlFor="email" style={styles.label}>
            이메일 · Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="example@email.com"
            autoComplete="email"
            style={styles.input}
            required
          />

          {/* 비밀번호 */}
          <label htmlFor="password" style={styles.label}>
            비밀번호 · Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            minLength={8}
            style={styles.input}
            required
          />

          {/* 비밀번호 확인 */}
          <label
            htmlFor="confirmPassword"
            style={styles.label}
          >
            비밀번호 확인 · Confirm Password
          </label>

          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter your password"
            autoComplete="new-password"
            style={styles.input}
            required
          />

          {/* 회원가입 버튼 */}
          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitButton,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform =
                  "scale(1.02)";
                e.currentTarget.style.boxShadow =
                  "0 6px 16px rgba(0,119,204,0.25)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {loading
              ? "가입 처리 중 · Signing up..."
              : "가입하기 · Sign Up"}
          </button>

        </form>

        {/* 로그인 연결 */}
        <div style={styles.loginArea}>
          <p style={styles.loginText}>
            이미 회원이신가요?
            <br />
            Already have an account?
          </p>

          <Link to="/login" style={styles.loginLink}>
            로그인 · Log In →
          </Link>
        </div>

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "calc(100vh - 70px)",
    backgroundColor: "#f5f7fa",
    padding: "24px 16px",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },

  card: {
  width: "100%",
  maxWidth: "460px",
  padding: "24px",
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  boxShadow: "0 6px 24px rgba(0,0,0,0.08)",
  boxSizing: "border-box",
  fontFamily: "Arial, sans-serif",
},

  brand: {
    textAlign: "center",
  },

  brandTitle: {
    fontSize: "2rem",
    fontWeight: 800,
    color: "#0077cc",
    margin: "0 0 8px",
    letterSpacing: "1px",
  },

  brandSlogan: {
    fontSize: "1rem",
    color: "#0c3970",
    fontWeight: 600,
    margin: 0,
  },

  divider: {
    height: "1px",
    backgroundColor: "#e5e7eb",
    margin: "16px 0",
  },

  title: {
    fontSize: "1.6rem",
    fontWeight: 700,
    textAlign: "center",
    color: "#1f2937",
    margin: "0 0 8px",
  },

  subtitle: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: "14px",
    margin: "0 0 24px",
  },

  fieldset: {
    border: "none",
    padding: 0,
    margin: 0,
    minWidth: 0,
  },

  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: 600,
    fontSize: "14px",
    color: "#374151",
  },

  roleContainer: {
    display: "flex",
    gap: "12px",
    marginBottom: "24px",
  },

  roleCard: {
  flex: 1,
  minWidth: 0,
  padding: "12px 8px",
  border: "2px solid #e5e7eb",
  borderRadius: "12px",
  backgroundColor: "#ffffff",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "5px",
  transition: "all 0.2s ease",
},

  selectedRole: {
    borderColor: "#0077cc",
    backgroundColor: "#eff6ff",
  },

  roleIcon: {
    fontSize: "28px",
    marginBottom: "3px",
  },

  roleTitle: {
    fontSize: "17px",
    fontWeight: 700,
    color: "#0c3970",
  },

  roleEnglish: {
    fontSize: "13px",
    color: "#4b5563",
  },

  roleDescription: {
    fontSize: "12px",
    color: "#6b7280",
    marginTop: "4px",
  },

  input: {
  width: "100%",
  padding: "12px 14px",
  marginBottom: "12px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  fontSize: "14px",
  boxSizing: "border-box",
  backgroundColor: "#ffffff",
  color: "#1f2937",
},

  submitButton: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#0077cc",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: 700,
    marginTop: "6px",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },

  loginArea: {
    textAlign: "center",
    marginTop: "16px",
    paddingTop: "16px",
    borderTop: "1px solid #e5e7eb",
  },

  loginText: {
    color: "#6b7280",
    fontSize: "13px",
    lineHeight: 1.6,
    margin: "0 0 8px",
  },

  loginLink: {
    color: "#0077cc",
    fontWeight: 600,
    fontSize: "14px",
    textDecoration: "none",
  },

  errorMessage: {
    backgroundColor: "#fef2f2",
    color: "#b91c1c",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "13px",
    lineHeight: 1.6,
    marginBottom: "20px",
  },

  successMessage: {
    backgroundColor: "#f0fdf4",
    color: "#15803d",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "13px",
    lineHeight: 1.6,
    marginBottom: "20px",
  },
};

export default SignupPage;