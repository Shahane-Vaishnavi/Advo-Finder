import { useState, useEffect } from "react";

import { NAV_LINKS } from "../data/navLinks";
import { QUICK_ACTIONS } from "../data/quickActions";
import { CELLS } from "../data/cells";
import { WHATS_NEW } from "../data/whatsNew";
import { SUCCESS_STORIES } from "../data/successStories";
import { IMPORTANT_LINKS } from "../data/importantLinks";
import { FOOTER_COL1, FOOTER_COL2 } from "../data/footerLinks";
import { SLIDES } from "../data/slides";

export default function WomenHelperUI() {
  const [slide, setSlide] = useState(0);
  const [newsIdx, setNewsIdx] = useState(0);
  const [searchVal, setSearchVal] = useState("");

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 4000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNewsIdx((n) => (n + 1) % WHATS_NEW.length), 2500);
    return () => clearInterval(t);
  }, []);

  const cur = SLIDES[slide];

  return (
    <div style={{ background: "#f4f6f9", minHeight: "100vh", fontFamily: "sans-serif" }}>

      {/* 🔵 TOP HEADER */}
      <header style={{ background: "#0b4d8f", color: "white", padding: "12px 20px" }}>
        <h2 style={{ margin: 0 }}>Women Safety & Support Portal</h2>
      </header>

      {/* 🔵 NAVBAR */}
      <nav
        style={{
          display: "flex",
          gap: "20px",
          background: "white",
          padding: "12px 20px",
          borderBottom: "1px solid #ddd",
          flexWrap: "wrap",
        }}
      >
        {NAV_LINKS.map((n) => (
          <span key={n.label} style={{ cursor: "pointer", fontWeight: 500 }}>
            {n.label}
          </span>
        ))}
      </nav>

      {/* 🔍 SEARCH BAR */}
      <div style={{ padding: "20px", background: "white", borderBottom: "1px solid #eee" }}>
        <input
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          placeholder="Search women safety services, helplines, schemes..."
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        />
      </div>

      {/* 🖼 HERO SLIDER */}
      <div style={{ padding: "20px" }}>
        <div
          style={{
            background: "white",
            borderRadius: "10px",
            overflow: "hidden",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <img src={cur.image} alt="" style={{ width: "100%", height: "250px", objectFit: "cover" }} />
          <div style={{ padding: "15px" }}>
            <h3 style={{ margin: 0 }}>{cur.title}</h3>
            <p style={{ margin: "6px 0", color: "#555" }}>{cur.desc}</p>
          </div>
        </div>
      </div>

      {/* ⚡ QUICK ACTIONS */}
      <section style={{ padding: "20px" }}>
        <h3 style={{ marginBottom: "10px" }}>Quick Actions</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "15px",
          }}
        >
          {QUICK_ACTIONS.map((q) => (
            <div
              key={q.label}
              style={{
                background: "white",
                borderRadius: "10px",
                padding: "15px",
                textAlign: "center",
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                cursor: "pointer",
              }}
            >
              <img src={q.icon} width="40" alt="" />
              <p style={{ marginTop: "8px", fontWeight: 500 }}>{q.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🟦 SERVICE CELLS */}
      <section style={{ padding: "20px" }}>
        <h3 style={{ marginBottom: "10px" }}>Women Services</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "15px",
          }}
        >
          {CELLS.map((c) => (
            <div
              key={c.title}
              style={{
                background: "white",
                padding: "15px",
                borderRadius: "10px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                cursor: "pointer",
              }}
            >
              <h4 style={{ margin: 0 }}>{c.title}</h4>
              <p style={{ margin: "8px 0", color: "#555" }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🟡 WHAT’S NEW */}
      <section style={{ padding: "20px" }}>
        <h3>What's New</h3>
        <div
          style={{
            background: "white",
            padding: "15px",
            borderRadius: "10px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <p style={{ margin: 0, color: "#444" }}>{WHATS_NEW[newsIdx].text}</p>
        </div>
      </section>

      {/* 💖 SUCCESS STORIES */}
      <section style={{ padding: "20px" }}>
        <h3>Success Stories</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "15px",
          }}
        >
          {SUCCESS_STORIES.map((s) => (
            <div
              key={s.title}
              style={{
                background: "white",
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              <img src={s.image} alt="" style={{ width: "100%", height: "160px", objectFit: "cover" }} />
              <div style={{ padding: "10px" }}>
                <h4 style={{ margin: "0 0 6px" }}>{s.title}</h4>
                <p style={{ margin: 0, color: "#555" }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🔗 IMPORTANT LINKS */}
      <section style={{ padding: "20px" }}>
        <h3>Important Links</h3>
        <ul style={{ background: "white", borderRadius: "10px", padding: "15px", listStyle: "none" }}>
          {IMPORTANT_LINKS.map((l) => (
            <li key={l.label} style={{ margin: "8px 0", cursor: "pointer" }}>
              {l.label}
            </li>
          ))}
        </ul>
      </section>

      {/* ⚫ FOOTER */}
      <footer style={{ background: "#0b4d8f", color: "white", padding: "25px" }}>
        <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
          <div>
            <h4>Resources</h4>
            <ul>
              {FOOTER_COL1.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Support</h4>
            <ul>
              {FOOTER_COL2.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        </div>

        <p style={{ marginTop: "20px", opacity: 0.8 }}>© 2026 Women Safety Portal</p>
      </footer>
    </div>
  );
}