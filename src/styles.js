const styles = {
  navbar: { display: "flex", justifyContent: "space-between", padding: "1.2rem 3rem", backgroundColor: "#0077cc", color: "white", alignItems: "center", position: "sticky", top: 0, zIndex: 1000 },
  logo: { fontWeight: "bold", fontSize: "1.8rem" },
  navLinks: { display: "flex", gap: "1.5rem" },
  navLink: { color: "white", textDecoration: "none", fontWeight: "500" },
  banner: { height: "80vh", backgroundImage: 'url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1350&q=80")', backgroundSize: "cover", backgroundPosition: "center", position: "relative" },
  bannerOverlay: { backgroundColor: "rgba(0,0,0,0.2)", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" },
  bannerContent: { color: "white", textAlign: "center" },
  bannerTitle: { fontSize: "2.8rem", marginBottom: "1rem" },
  bannerSubtitle: { fontSize: "1.2rem", marginBottom: "2rem" },
  ctaButtonEnhanced: { padding: "14px 30px", backgroundColor: "#2563eb", color: "#fff", borderRadius: "9999px", fontWeight: "700", fontSize: "1rem", border: "none", cursor: "pointer", boxShadow: "0 10px 15px rgba(0,0,0,0.1)" },
  section: { maxWidth: 1100, margin: "4rem auto", padding: "0 2rem" },
  sectionTitle: { fontSize: "1.8rem", marginBottom: "2rem", textAlign: "center" },
  tutorList: { display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "2rem" },
  tutorCard: { border: "1px solid #e0e0e0", borderRadius: "16px", padding: "24px 20px", width: 280, textAlign: "center", backgroundColor: "#ffffff", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", transition: "transform 0.3s, box-shadow 0.3s", cursor: "pointer" },
  tutorImage: { width: 110, height: 110, borderRadius: "50%", objectFit: "cover", marginBottom: 16, border: "3px solid #0077cc" },
  tutorName: { fontSize: "1.25rem", fontWeight: "600", marginBottom: "0.5rem", color: "#333" },
  tutorExperience: { fontSize: "1rem", color: "#666", marginBottom: "1rem" },
  detailLink: { color: "#0077cc", textDecoration: "none", fontWeight: "600", fontSize: "0.95rem", border: "1px solid #0077cc", borderRadius: "8px", padding: "6px 12px" },
  footer: { marginTop: 60, padding: "2rem 1rem", backgroundColor: "#0077cc", color: "white", textAlign: "center" },
};

export default styles;