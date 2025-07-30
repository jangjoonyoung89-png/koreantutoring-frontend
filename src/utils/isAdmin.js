import jwt_decode from "jwt-decode";

export function isAdmin() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return false;
    const decoded = jwt_decode(token);
    return decoded.role === "admin";
  } catch (err) {
    return false;
  }
}