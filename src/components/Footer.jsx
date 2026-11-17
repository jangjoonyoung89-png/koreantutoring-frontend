import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={styles.footer}>

      {/* ROKMUN 브랜드 */}
      <Link to="/" style={styles.brand}>
        ROKMUN
      </Link>

      {/* 브랜드 슬로건 */}
      <p style={styles.slogan}>
        Your Gateway to Korea
      </p>

      {/* 저작권 */}
      <p style={styles.copyright}>
  © 2025 ROKMUN. All rights reserved.
</p>

    </footer>
  );
}

const styles = {
  footer: {
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: "#0C3970",
    color: "#ffffff",
    textAlign: "center",
    padding: "14px 16px",
    flexShrink: 0,
  },

  brand: {
    display: "inline-block",
    color: "#ffffff",
    fontSize: "18px",
    fontWeight: 700,
    lineHeight: "24px",
    textDecoration: "none",
    letterSpacing: "0.5px",
  },

  slogan: {
    color: "#D5E8FF",
    fontSize: "12px",
    lineHeight: "18px",
    margin: "2px 0 0",
  },

  copyright: {
    color: "#B8D6FF",
    fontSize: "11px",
    lineHeight: "16px",
    margin: "6px 0 0",
  },
};