"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

/* ── Ringa Soundwave Logo ─────────────────────────────────────────────── */
function RingaLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="18" width="3.5" height="12" rx="1.75" fill="#7C3FFF" opacity="0.6" />
      <rect x="12" y="12" width="3.5" height="24" rx="1.75" fill="#6B5FFF" opacity="0.8" />
      <rect x="18" y="6" width="3.5" height="36" rx="1.75" fill="#5B7FFF" />
      <rect x="24" y="3" width="3.5" height="42" rx="1.75" fill="#3B6FFF" />
      <rect x="30" y="6" width="3.5" height="36" rx="1.75" fill="#5B7FFF" />
      <rect x="36" y="12" width="3.5" height="24" rx="1.75" fill="#6B5FFF" opacity="0.8" />
      <rect x="42" y="18" width="3.5" height="12" rx="1.75" fill="#7C3FFF" opacity="0.6" />
    </svg>
  );
}

/* ── SVG Icons (replacing emojis) ─────────────────────────────────────── */
function IconPhone() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5B8FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
function IconCalendar() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5B8FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function IconGlobe() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5B8FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}
function IconAlert() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5B8FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
function IconMapPin() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5B8FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function IconZap() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5B8FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
function IconUsers() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5B8FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function IconMessageSquare() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5B8FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export default function LandingPage() {
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const steps = document.querySelectorAll(".r-step");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add("visible"), i * 150);
          }
        });
      },
      { threshold: 0.2 }
    );
    steps.forEach((step) => observer.observe(step));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        .r-landing {
          --blue: #3B6FFF;
          --blue-light: #5B8FFF;
          --purple: #7C3FFF;
          --bg: #1A1F2E;
          --bg2: #232940;
          --bg-card: #252B3D;
          --text: #E8EAF0;
          --text-secondary: #9BA3B8;
          --text-muted: #636D83;
          --border: rgba(255,255,255,0.08);
          --border-light: rgba(255,255,255,0.05);

          background: var(--bg);
          color: var(--text);
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 16px;
          line-height: 1.6;
          overflow-x: hidden;
          min-height: 100vh;
        }

        /* ── NAV ───────────────────────────────────────────── */
        .r-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          padding: 16px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(26,31,46,0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
        }
        .r-nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .r-nav-logo span {
          font-size: 20px;
          font-weight: 700;
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, #fff 0%, var(--blue-light) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .r-nav-links {
          display: flex;
          gap: 32px;
          list-style: none;
        }
        .r-nav-links button {
          color: var(--text-secondary);
          background: none;
          border: none;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          font-family: inherit;
          transition: color 0.2s;
        }
        .r-nav-links button:hover { color: var(--text); }
        .r-nav-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .r-nav-signin {
          color: var(--text-secondary);
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.2s;
        }
        .r-nav-signin:hover { color: var(--text); }
        .r-btn {
          background: var(--blue);
          color: #fff;
          border: none;
          padding: 10px 22px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .r-btn:hover { background: #2D5FE6; transform: translateY(-1px); box-shadow: 0 4px 20px rgba(59,111,255,0.35); }
        .r-btn-lg { padding: 14px 32px; font-size: 15px; border-radius: 10px; }
        .r-btn-outline {
          background: transparent;
          color: var(--text-secondary);
          border: 1px solid var(--border);
          padding: 14px 32px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .r-btn-outline:hover { border-color: rgba(255,255,255,0.2); color: var(--text); }
        .r-btn-ghost {
          background: transparent;
          color: var(--text-secondary);
          border: 1px solid var(--border);
          padding: 12px 0;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }
        .r-btn-ghost:hover { border-color: rgba(255,255,255,0.2); color: var(--text); }

        /* ── HERO ──────────────────────────────────────────── */
        .r-hero {
          position: relative;
          padding: 140px 24px 80px;
          text-align: center;
          overflow: hidden;
        }
        .r-hero::before {
          content: '';
          position: absolute;
          top: -200px;
          left: 50%;
          transform: translateX(-50%);
          width: 900px;
          height: 600px;
          background: radial-gradient(ellipse at center, rgba(59,111,255,0.12) 0%, rgba(124,63,255,0.06) 40%, transparent 70%);
          pointer-events: none;
        }
        .r-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(59,111,255,0.1);
          border: 1px solid rgba(59,111,255,0.2);
          border-radius: 100px;
          padding: 6px 16px;
          font-size: 13px;
          font-weight: 500;
          color: var(--blue-light);
          margin-bottom: 28px;
        }
        .r-badge-dot {
          width: 6px; height: 6px;
          background: var(--blue-light);
          border-radius: 50%;
          animation: r-pulse 2s infinite;
        }
        @keyframes r-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
        .r-hero h1 {
          font-size: clamp(36px, 6vw, 72px);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -0.035em;
          margin-bottom: 20px;
          color: var(--text);
        }
        .r-hero h1 .gradient {
          background: linear-gradient(135deg, var(--blue-light) 0%, var(--purple) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .r-hero-sub {
          font-size: clamp(16px, 2vw, 19px);
          color: var(--text-secondary);
          max-width: 540px;
          margin: 0 auto 36px;
          font-weight: 400;
          line-height: 1.7;
        }
        .r-hero-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }

        /* ── CALL DEMO CARD ────────────────────────────────── */
        .r-demo {
          position: relative;
          margin: 60px auto 0;
          max-width: 420px;
        }
        .r-call-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 24px 28px;
          text-align: left;
          backdrop-filter: blur(12px);
        }
        .r-call-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
          padding-bottom: 14px;
          border-bottom: 1px solid var(--border-light);
        }
        .r-call-status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          color: #4ADE80;
        }
        .r-call-dot {
          width: 6px; height: 6px;
          background: #4ADE80;
          border-radius: 50%;
          animation: r-pulse 1.5s infinite;
        }
        .r-call-time { font-size: 12px; color: var(--text-muted); }
        .r-msgs { display: flex; flex-direction: column; gap: 10px; }
        .r-msg {
          padding: 10px 14px;
          border-radius: 12px;
          font-size: 13.5px;
          line-height: 1.5;
          max-width: 88%;
        }
        .r-msg-ai {
          background: rgba(59,111,255,0.12);
          border: 1px solid rgba(59,111,255,0.15);
          color: var(--text);
          align-self: flex-start;
          border-bottom-left-radius: 4px;
        }
        .r-msg-user {
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border);
          color: var(--text-secondary);
          align-self: flex-end;
          border-bottom-right-radius: 4px;
        }
        .r-msg-label {
          font-size: 10px;
          color: var(--text-muted);
          margin-bottom: 3px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          font-weight: 600;
        }
        .r-booked {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(74,222,128,0.08);
          border: 1px solid rgba(74,222,128,0.15);
          border-radius: 10px;
          padding: 10px 14px;
          margin-top: 14px;
          font-size: 13px;
          font-weight: 500;
          color: #4ADE80;
        }

        /* ── STATS ─────────────────────────────────────────── */
        .r-stats {
          display: flex;
          justify-content: center;
          gap: 48px;
          flex-wrap: wrap;
          padding: 48px 40px 64px;
          border-bottom: 1px solid var(--border);
        }
        .r-stat { text-align: center; }
        .r-stat-num {
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, var(--text), var(--blue-light));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .r-stat-label { font-size: 13px; color: var(--text-muted); margin-top: 2px; }

        /* ── SECTIONS ──────────────────────────────────────── */
        .r-section {
          max-width: 1080px;
          margin: 0 auto;
          padding: 80px 40px;
        }
        .r-section-label {
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--blue-light);
          font-weight: 600;
          margin-bottom: 12px;
        }
        .r-section-title {
          font-size: clamp(26px, 4vw, 40px);
          font-weight: 800;
          letter-spacing: -0.025em;
          line-height: 1.15;
          margin-bottom: 12px;
          color: var(--text);
        }
        .r-section-sub {
          color: var(--text-secondary);
          font-size: 16px;
          max-width: 500px;
          font-weight: 400;
          line-height: 1.7;
          margin-bottom: 48px;
        }

        /* ── FEATURES ──────────────────────────────────────── */
        .r-features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          overflow: hidden;
        }
        .r-feature {
          background: var(--bg-card);
          padding: 32px 28px;
          transition: background 0.2s;
        }
        .r-feature:hover { background: #2C3348; }
        .r-feature-icon {
          width: 44px; height: 44px;
          border-radius: 10px;
          background: rgba(59,111,255,0.1);
          border: 1px solid rgba(59,111,255,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }
        .r-feature h3 {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 8px;
          color: var(--text);
        }
        .r-feature p { color: var(--text-secondary); font-size: 14px; line-height: 1.65; }

        /* ── STEPS ─────────────────────────────────────────── */
        .r-steps {
          display: flex;
          flex-direction: column;
          gap: 0;
          position: relative;
        }
        .r-steps::before {
          content: '';
          position: absolute;
          left: 21px;
          top: 40px;
          bottom: 40px;
          width: 2px;
          background: linear-gradient(to bottom, var(--blue), var(--purple), transparent);
          border-radius: 2px;
        }
        .r-step {
          display: flex;
          gap: 24px;
          padding: 28px 0;
          opacity: 0;
          transform: translateX(-16px);
          transition: all 0.5s ease;
        }
        .r-step.visible { opacity: 1; transform: translateX(0); }
        .r-step-num {
          width: 44px; height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--blue), var(--purple));
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 15px;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
          color: #fff;
        }
        .r-step-content h3 {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 6px;
          color: var(--text);
        }
        .r-step-content p { color: var(--text-secondary); font-size: 15px; line-height: 1.65; }

        /* ── LANG PILLS ────────────────────────────────────── */
        .r-langs {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 48px;
        }
        .r-lang {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(59,111,255,0.08);
          border: 1px solid rgba(59,111,255,0.15);
          border-radius: 100px;
          padding: 8px 18px;
          font-size: 14px;
          font-weight: 500;
          color: var(--text);
        }
        .r-lang-flag { font-size: 18px; }

        /* ── PRICING ───────────────────────────────────────── */
        .r-pricing {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          align-items: start;
        }
        .r-price-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 32px 28px;
          position: relative;
          transition: transform 0.2s, border-color 0.2s;
        }
        .r-price-card:hover { transform: translateY(-4px); }
        .r-price-card.featured {
          border-color: rgba(59,111,255,0.4);
          background: rgba(59,111,255,0.06);
        }
        .r-price-card.featured::before {
          content: 'Most Popular';
          position: absolute;
          top: -11px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, var(--blue), var(--purple));
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 14px;
          border-radius: 100px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .r-plan-name {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 12px;
        }
        .r-plan-price {
          font-size: 44px;
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1;
          margin-bottom: 4px;
          color: var(--text);
        }
        .r-plan-price span {
          font-size: 18px;
          font-weight: 500;
          color: var(--text-muted);
          vertical-align: top;
          margin-top: 8px;
          display: inline-block;
        }
        .r-plan-period { font-size: 13px; color: var(--text-muted); margin-bottom: 24px; }
        .r-plan-features {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 28px;
          padding: 0;
        }
        .r-plan-features li {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: var(--text-secondary);
        }
        .r-check {
          width: 18px; height: 18px;
          background: rgba(74,222,128,0.12);
          color: #4ADE80;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          flex-shrink: 0;
          font-weight: 700;
        }

        /* ── CTA ───────────────────────────────────────────── */
        .r-cta {
          text-align: center;
          padding: 80px 40px;
          border-top: 1px solid var(--border);
          position: relative;
          overflow: hidden;
        }
        .r-cta::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 500px;
          height: 300px;
          background: radial-gradient(ellipse at center, rgba(59,111,255,0.1) 0%, transparent 70%);
          pointer-events: none;
        }
        .r-cta-box {
          max-width: 580px;
          margin: 0 auto;
          position: relative;
        }

        /* ── FOOTER ────────────────────────────────────────── */
        .r-footer {
          border-top: 1px solid var(--border);
          padding: 32px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }
        .r-footer-logo {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .r-footer-logo span {
          font-weight: 700;
          font-size: 16px;
          background: linear-gradient(135deg, #fff, var(--blue-light));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .r-footer-copy { font-size: 13px; color: var(--text-muted); }
        .r-footer-links {
          display: flex;
          gap: 24px;
        }
        .r-footer-links a {
          font-size: 13px;
          color: var(--text-muted);
          text-decoration: none;
          transition: color 0.2s;
        }
        .r-footer-links a:hover { color: var(--text); }

        /* ── RESPONSIVE ────────────────────────────────────── */
        @media (max-width: 768px) {
          .r-nav { padding: 14px 20px; }
          .r-nav-links { display: none; }
          .r-stats { gap: 28px; padding: 36px 20px 48px; }
          .r-section { padding: 60px 20px; }
          .r-steps::before { display: none; }
          .r-pricing { grid-template-columns: 1fr; }
          .r-footer { flex-direction: column; text-align: center; }
        }
      `}</style>

      <div className="r-landing">
        {/* NAV */}
        <nav className="r-nav">
          <div className="r-nav-logo">
            <RingaLogo size={28} />
            <span>ringa</span>
          </div>
          <ul className="r-nav-links">
            <li><button onClick={() => scrollTo("features")}>Features</button></li>
            <li><button onClick={() => scrollTo("how")}>How it works</button></li>
            <li><button onClick={() => scrollTo("pricing")}>Pricing</button></li>
          </ul>
          <div className="r-nav-right">
            <Link href="/login" className="r-nav-signin">Sign In</Link>
            <Link href="/signup" className="r-btn">Start Free Trial</Link>
          </div>
        </nav>

        {/* HERO */}
        <div className="r-hero">
          <div className="r-badge">
            <span className="r-badge-dot" />
            Live on every call, 24/7
          </div>

          <h1>
            Your front desk,<br />
            <span className="gradient">always on.</span>
          </h1>

          <p className="r-hero-sub">
            Ringa answers every call, books every job, and dispatches your techs
            &mdash; in English, Spanish, or Portuguese &mdash; while you focus on
            the work.
          </p>

          <div className="r-hero-actions">
            <Link href="/signup" className="r-btn r-btn-lg">
              Start Free Trial &rarr;
            </Link>
            <button className="r-btn-outline" onClick={() => scrollTo("how")}>
              See how it works
            </button>
          </div>

          {/* Live Call Demo */}
          <div className="r-demo">
            <div className="r-call-card">
              <div className="r-call-header">
                <div className="r-call-status">
                  <span className="r-call-dot" />
                  Live call
                </div>
                <span className="r-call-time">11:47 PM</span>
              </div>
              <div className="r-msgs">
                <div>
                  <div className="r-msg-label">Ringa AI</div>
                  <div className="r-msg r-msg-ai">
                    Hi, thank you for calling Sunshine HVAC. How can I help you tonight?
                  </div>
                </div>
                <div style={{ alignSelf: "flex-end" }}>
                  <div className="r-msg-label" style={{ textAlign: "right" }}>Customer</div>
                  <div className="r-msg r-msg-user">
                    My AC stopped working, it&apos;s 95 degrees inside.
                  </div>
                </div>
                <div>
                  <div className="r-msg-label">Ringa AI</div>
                  <div className="r-msg r-msg-ai">
                    I&apos;m sorry to hear that. Let me verify your address and get a technician scheduled for first thing tomorrow at 8 AM.
                  </div>
                </div>
                <div style={{ alignSelf: "flex-end" }}>
                  <div className="r-msg-label" style={{ textAlign: "right" }}>Customer</div>
                  <div className="r-msg r-msg-user" style={{ fontStyle: "italic", color: "#636D83" }}>
                    switching to Spanish...
                  </div>
                </div>
                <div>
                  <div className="r-msg-label">Ringa AI</div>
                  <div className="r-msg r-msg-ai">
                    Por supuesto, puedo ayudarle en espa&ntilde;ol. &iquest;Cu&aacute;l es su direcci&oacute;n?
                  </div>
                </div>
              </div>
              <div className="r-booked">
                <span>&#10003;</span>
                Job booked &middot; Tomorrow 8:00 AM &middot; Carlos assigned
              </div>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="r-stats">
          <div className="r-stat">
            <div className="r-stat-num">$120K</div>
            <div className="r-stat-label">avg. annual revenue lost to missed calls</div>
          </div>
          <div className="r-stat">
            <div className="r-stat-num">80%</div>
            <div className="r-stat-label">of callers won&apos;t leave a voicemail</div>
          </div>
          <div className="r-stat">
            <div className="r-stat-num">24/7</div>
            <div className="r-stat-label">coverage, zero overtime</div>
          </div>
          <div className="r-stat">
            <div className="r-stat-num">3</div>
            <div className="r-stat-label">languages, automatic detection</div>
          </div>
        </div>

        {/* FEATURES */}
        <section className="r-section" id="features">
          <div className="r-section-label">Features</div>
          <h2 className="r-section-title">
            Everything your front desk<br />should do. Automatically.
          </h2>
          <p className="r-section-sub">
            Built specifically for HVAC companies. No generic chatbots. No call centers. Just a system that works.
          </p>

          <div className="r-features">
            <div className="r-feature">
              <div className="r-feature-icon"><IconPhone /></div>
              <h3>Answers every call</h3>
              <p>Never send a customer to voicemail again. Ringa picks up instantly, 24 hours a day, 365 days a year &mdash; including holidays and heat waves.</p>
            </div>
            <div className="r-feature">
              <div className="r-feature-icon"><IconCalendar /></div>
              <h3>Smart calendar sync</h3>
              <p>One-click Google Calendar connection for each technician. Ringa checks real-time availability, prevents double bookings, and assigns jobs with round-robin fairness.</p>
            </div>
            <div className="r-feature">
              <div className="r-feature-icon"><IconGlobe /></div>
              <h3>Trilingual by default</h3>
              <p>Detects and switches between English, Spanish, and Portuguese mid-call &mdash; automatically. No menus, no &ldquo;press 2 for Spanish.&rdquo;</p>
            </div>
            <div className="r-feature">
              <div className="r-feature-icon"><IconAlert /></div>
              <h3>Emergency triage</h3>
              <p>Recognizes urgent keywords like &ldquo;no heat,&rdquo; &ldquo;gas smell,&rdquo; or &ldquo;flooding&rdquo; and prioritizes the call for immediate dispatch.</p>
            </div>
            <div className="r-feature">
              <div className="r-feature-icon"><IconMapPin /></div>
              <h3>Address verification</h3>
              <p>Every address is validated via Google Maps before the job is booked. No wrong addresses, no wasted drive time, no callbacks.</p>
            </div>
            <div className="r-feature">
              <div className="r-feature-icon"><IconMessageSquare /></div>
              <h3>SMS confirmations</h3>
              <p>Both the customer and the technician receive instant SMS confirmations with appointment details, address, and time &mdash; automatically.</p>
            </div>
            <div className="r-feature">
              <div className="r-feature-icon"><IconUsers /></div>
              <h3>Round-robin dispatch</h3>
              <p>Jobs are distributed fairly across your team. Ringa tracks who was last assigned and rotates automatically &mdash; while always respecting customer time preferences.</p>
            </div>
            <div className="r-feature">
              <div className="r-feature-icon"><IconZap /></div>
              <h3>Setup in 10 minutes</h3>
              <p>Add your company, invite your techs, and go live. Technicians connect their calendar with one tap from an SMS link. No IT team needed.</p>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="r-section" id="how" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="r-section-label">How it works</div>
          <h2 className="r-section-title">
            Three steps to never miss<br />a call again.
          </h2>
          <p className="r-section-sub">
            No IT team required. No contracts. No training sessions.
          </p>

          <div className="r-steps" ref={stepsRef}>
            <div className="r-step">
              <div className="r-step-num">1</div>
              <div className="r-step-content">
                <h3>Set up your account</h3>
                <p>Enter your company name, add your technicians, and set working hours. Each tech receives an SMS to connect their Google Calendar with one tap.</p>
              </div>
            </div>
            <div className="r-step">
              <div className="r-step-num">2</div>
              <div className="r-step-content">
                <h3>Forward your number to Ringa</h3>
                <p>Point your existing business number to Ringa. Customers call the same number they always have. Everything else is automatic.</p>
              </div>
            </div>
            <div className="r-step">
              <div className="r-step-num">3</div>
              <div className="r-step-content">
                <h3>Wake up to a full schedule</h3>
                <p>Every call answered, every job booked, every address verified. Your technicians start the day with a full calendar &mdash; no callbacks required from you.</p>
              </div>
            </div>
          </div>
        </section>

        {/* LANGUAGES */}
        <section className="r-section" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="r-section-label">Multilingual</div>
          <h2 className="r-section-title">
            Speak your customer&apos;s language.<br />Every single time.
          </h2>
          <p className="r-section-sub">
            Ringa detects the caller&apos;s language in real time and responds fluently &mdash; no menus, no delays, no lost customers.
          </p>

          <div className="r-langs">
            <div className="r-lang"><span className="r-lang-flag">{"\uD83C\uDDFA\uD83C\uDDF8"}</span> English</div>
            <div className="r-lang"><span className="r-lang-flag">{"\uD83C\uDDF2\uD83C\uDDFD"}</span> Spanish</div>
            <div className="r-lang"><span className="r-lang-flag">{"\uD83C\uDDE7\uD83C\uDDF7"}</span> Portuguese</div>
          </div>

          <div className="r-call-card" style={{ maxWidth: "480px" }}>
            <div className="r-call-header">
              <div className="r-call-status">
                <span className="r-call-dot" />
                Live call
              </div>
              <span className="r-call-time">2:14 AM</span>
            </div>
            <div className="r-msgs">
              <div>
                <div className="r-msg-label">Ringa AI</div>
                <div className="r-msg r-msg-ai">Hi, Sunshine HVAC, how can I help you?</div>
              </div>
              <div style={{ alignSelf: "flex-end" }}>
                <div className="r-msg-label" style={{ textAlign: "right" }}>Customer</div>
                <div className="r-msg r-msg-user">Meu ar condicionado parou de funcionar.</div>
              </div>
              <div>
                <div className="r-msg-label">Ringa AI</div>
                <div className="r-msg r-msg-ai">Entendi, vou te ajudar agora mesmo. Desde quando o ar condicionado est&aacute; sem funcionar?</div>
              </div>
              <div style={{ alignSelf: "flex-end" }}>
                <div className="r-msg-label" style={{ textAlign: "right" }}>Customer</div>
                <div className="r-msg r-msg-user">Desde hoje &agrave; tarde, t&aacute; muito calor aqui.</div>
              </div>
              <div>
                <div className="r-msg-label">Ringa AI</div>
                <div className="r-msg r-msg-ai">Tudo bem, j&aacute; agendei um t&eacute;cnico para amanh&atilde; &agrave;s 8h. Pode me passar seu endere&ccedil;o?</div>
              </div>
            </div>
            <div className="r-booked">
              <span>&#10003;</span>
              Agendado &middot; Amanh&atilde; 8:00 &middot; Marco designado
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="r-section" id="pricing" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="r-section-label">Pricing</div>
          <h2 className="r-section-title">
            Simple pricing.<br />Pays for itself in one call.
          </h2>
          <p className="r-section-sub">
            No setup fees. No contracts. Cancel anytime.
          </p>

          <div className="r-pricing">
            {/* Starter */}
            <div className="r-price-card">
              <div className="r-plan-name">Starter</div>
              <div className="r-plan-price"><span>$</span>180</div>
              <div className="r-plan-period">per month</div>
              <ul className="r-plan-features">
                <li><span className="r-check">&#10003;</span> 1 technician</li>
                <li><span className="r-check">&#10003;</span> 24/7 call answering</li>
                <li><span className="r-check">&#10003;</span> English, Spanish &amp; Portuguese</li>
                <li><span className="r-check">&#10003;</span> Google Calendar sync</li>
                <li><span className="r-check">&#10003;</span> Round-robin dispatch</li>
                <li><span className="r-check">&#10003;</span> SMS confirmations</li>
                <li><span className="r-check">&#10003;</span> Address verification</li>
                <li><span className="r-check">&#10003;</span> Emergency triage</li>
                <li><span className="r-check">&#10003;</span> Jobber integration</li>
                <li><span className="r-check">&#10003;</span> Analytics dashboard</li>
              </ul>
              <Link href="/signup" className="r-btn-ghost">
                Get started
              </Link>
            </div>

            {/* Professional */}
            <div className="r-price-card featured">
              <div className="r-plan-name">Professional</div>
              <div className="r-plan-price"><span>$</span>250</div>
              <div className="r-plan-period">per month</div>
              <ul className="r-plan-features">
                <li><span className="r-check">&#10003;</span> Up to 5 technicians</li>
                <li><span className="r-check">&#10003;</span> 24/7 call answering</li>
                <li><span className="r-check">&#10003;</span> English, Spanish &amp; Portuguese</li>
                <li><span className="r-check">&#10003;</span> Google Calendar sync</li>
                <li><span className="r-check">&#10003;</span> Round-robin dispatch</li>
                <li><span className="r-check">&#10003;</span> SMS confirmations</li>
                <li><span className="r-check">&#10003;</span> Address verification</li>
                <li><span className="r-check">&#10003;</span> Emergency triage</li>
                <li><span className="r-check">&#10003;</span> Jobber integration</li>
                <li><span className="r-check">&#10003;</span> Analytics dashboard</li>
                <li><span className="r-check">&#10003;</span> Priority support</li>
              </ul>
              <Link href="/signup" className="r-btn r-btn-lg" style={{ width: "100%", justifyContent: "center" }}>
                Get started
              </Link>
            </div>

            {/* Enterprise */}
            <div className="r-price-card">
              <div className="r-plan-name">Enterprise</div>
              <div className="r-plan-price"><span>$</span>400</div>
              <div className="r-plan-period">per month</div>
              <ul className="r-plan-features">
                <li><span className="r-check">&#10003;</span> Up to 15 technicians</li>
                <li><span className="r-check">&#10003;</span> 24/7 call answering</li>
                <li><span className="r-check">&#10003;</span> English, Spanish &amp; Portuguese</li>
                <li><span className="r-check">&#10003;</span> Google Calendar sync</li>
                <li><span className="r-check">&#10003;</span> Round-robin dispatch</li>
                <li><span className="r-check">&#10003;</span> SMS confirmations</li>
                <li><span className="r-check">&#10003;</span> Address verification</li>
                <li><span className="r-check">&#10003;</span> Emergency triage</li>
                <li><span className="r-check">&#10003;</span> Analytics dashboard</li>
                <li><span className="r-check">&#10003;</span> Jobber integration</li>
                <li><span className="r-check">&#10003;</span> Dedicated account manager</li>
              </ul>
              <Link href="/signup" className="r-btn-ghost">
                Contact us
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="r-cta">
          <div className="r-cta-box">
            <div className="r-section-label" style={{ marginBottom: "16px" }}>Get started today</div>
            <h2 className="r-section-title" style={{ marginBottom: "12px" }}>
              Stop losing jobs<br />to voicemail.
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "16px", marginBottom: "32px", lineHeight: "1.7" }}>
              The average HVAC company loses $45,000&ndash;$120,000 per year from missed calls.
              Ringa pays for itself the first week.
            </p>
            <Link href="/signup" className="r-btn r-btn-lg" style={{ fontSize: "16px", padding: "16px 40px" }}>
              Start your free trial &rarr;
            </Link>
            <p style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "14px" }}>
              No credit card required. Live in 10 minutes.
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="r-footer">
          <div className="r-footer-logo">
            <RingaLogo size={22} />
            <span>ringa</span>
          </div>
          <div className="r-footer-links">
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
          </div>
          <div className="r-footer-copy">
            &copy; 2026 Ringa. All rights reserved.
          </div>
        </footer>
      </div>
    </>
  );
}
