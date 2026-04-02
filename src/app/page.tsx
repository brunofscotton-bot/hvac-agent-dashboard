"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export default function LandingPage() {
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll animation for steps
    const steps = document.querySelectorAll(".ringa-step");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(
              () => entry.target.classList.add("visible"),
              i * 150
            );
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
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        .ringa-landing *,
        .ringa-landing *::before,
        .ringa-landing *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .ringa-landing {
          --bg: #07070F;
          --bg2: #0D0D1A;
          --blue: #3B6FFF;
          --purple: #7C3FFF;
          --blue-light: #5B8FFF;
          --text: #F0F0FF;
          --muted: #8080A8;
          --border: rgba(255,255,255,0.07);
          --card: rgba(255,255,255,0.04);

          background: var(--bg);
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          line-height: 1.6;
          overflow-x: hidden;
          min-height: 100vh;
          position: relative;
        }

        /* NOISE OVERLAY */
        .ringa-landing::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
          opacity: 0.4;
        }

        /* GLOW ORBS */
        .ringa-landing .orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
          z-index: 0;
          opacity: 0.18;
        }
        .ringa-landing .orb-1 { width: 600px; height: 600px; background: var(--blue); top: -200px; left: -150px; }
        .ringa-landing .orb-2 { width: 500px; height: 500px; background: var(--purple); top: 200px; right: -200px; }
        .ringa-landing .orb-3 { width: 400px; height: 400px; background: var(--blue); bottom: 100px; left: 30%; opacity: 0.1; }

        /* NAV */
        .ringa-landing .ringa-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          padding: 20px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
          background: rgba(7,7,15,0.7);
        }

        .ringa-landing .logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 22px;
          letter-spacing: -0.5px;
          background: linear-gradient(135deg, #fff 0%, var(--blue-light) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .ringa-landing .nav-links {
          display: flex;
          gap: 36px;
          list-style: none;
        }

        .ringa-landing .nav-links button {
          color: var(--muted);
          background: none;
          border: none;
          text-decoration: none;
          font-size: 14px;
          font-weight: 400;
          transition: color 0.2s;
          letter-spacing: 0.01em;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
        }

        .ringa-landing .nav-links button:hover { color: var(--text); }

        .ringa-landing .nav-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .ringa-landing .nav-signin {
          color: var(--muted);
          background: none;
          border: none;
          font-size: 14px;
          font-weight: 400;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: color 0.2s;
          text-decoration: none;
        }

        .ringa-landing .nav-signin:hover { color: var(--text); }

        .ringa-landing .nav-cta {
          background: linear-gradient(135deg, var(--blue), var(--purple));
          color: #fff;
          border: none;
          padding: 10px 22px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: opacity 0.2s, transform 0.2s;
          text-decoration: none;
          display: inline-block;
        }

        .ringa-landing .nav-cta:hover { opacity: 0.85; transform: translateY(-1px); }

        /* HERO */
        .ringa-landing .hero {
          position: relative;
          z-index: 1;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 120px 24px 80px;
        }

        .ringa-landing .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(59,111,255,0.12);
          border: 1px solid rgba(59,111,255,0.3);
          border-radius: 100px;
          padding: 6px 16px;
          font-size: 13px;
          color: var(--blue-light);
          margin-bottom: 32px;
          animation: ringa-fadeUp 0.6s ease both;
        }

        .ringa-landing .badge-dot {
          width: 6px; height: 6px;
          background: var(--blue-light);
          border-radius: 50%;
          animation: ringa-pulse 2s infinite;
        }

        @keyframes ringa-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        .ringa-landing .hero-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(42px, 7vw, 88px);
          line-height: 1.0;
          letter-spacing: -0.03em;
          margin-bottom: 24px;
          animation: ringa-fadeUp 0.6s 0.1s ease both;
          color: var(--text);
        }

        .ringa-landing .hero-title .gradient {
          background: linear-gradient(135deg, var(--blue-light) 0%, var(--purple) 60%, #B06FFF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .ringa-landing .hero-sub {
          font-size: clamp(17px, 2.5vw, 20px);
          color: var(--muted);
          max-width: 540px;
          margin: 0 auto 44px;
          font-weight: 300;
          line-height: 1.65;
          animation: ringa-fadeUp 0.6s 0.2s ease both;
        }

        .ringa-landing .hero-actions {
          display: flex;
          gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
          animation: ringa-fadeUp 0.6s 0.3s ease both;
        }

        .ringa-landing .btn-primary {
          background: linear-gradient(135deg, var(--blue), var(--purple));
          color: #fff;
          border: none;
          padding: 15px 32px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 0 40px rgba(59,111,255,0.3);
          text-decoration: none;
          display: inline-block;
        }

        .ringa-landing .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 60px rgba(59,111,255,0.4);
        }

        .ringa-landing .btn-ghost {
          background: transparent;
          color: var(--muted);
          border: 1px solid var(--border);
          padding: 15px 32px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 400;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-block;
        }

        .ringa-landing .btn-ghost:hover { color: var(--text); border-color: rgba(255,255,255,0.15); }

        /* PHONE MOCKUP */
        .ringa-landing .hero-visual {
          position: relative;
          margin-top: 72px;
          animation: ringa-fadeUp 0.8s 0.4s ease both;
          z-index: 1;
        }

        .ringa-landing .call-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 28px 32px;
          max-width: 380px;
          margin: 0 auto;
          backdrop-filter: blur(20px);
          text-align: left;
          position: relative;
          overflow: hidden;
        }

        .ringa-landing .call-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(59,111,255,0.5), transparent);
        }

        .ringa-landing .call-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .ringa-landing .call-status {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #4ADE80;
          font-weight: 500;
        }

        .ringa-landing .call-status-dot {
          width: 7px; height: 7px;
          background: #4ADE80;
          border-radius: 50%;
          animation: ringa-pulse 1.5s infinite;
        }

        .ringa-landing .call-time { font-size: 12px; color: var(--muted); }

        .ringa-landing .call-messages { display: flex; flex-direction: column; gap: 12px; }

        .ringa-landing .msg {
          padding: 10px 14px;
          border-radius: 12px;
          font-size: 13.5px;
          line-height: 1.5;
          max-width: 85%;
          animation: ringa-fadeIn 0.4s ease both;
        }

        .ringa-landing .msg-ai {
          background: rgba(59,111,255,0.15);
          border: 1px solid rgba(59,111,255,0.2);
          color: var(--text);
          align-self: flex-start;
          border-bottom-left-radius: 4px;
        }

        .ringa-landing .msg-user {
          background: rgba(255,255,255,0.06);
          border: 1px solid var(--border);
          color: var(--muted);
          align-self: flex-end;
          border-bottom-right-radius: 4px;
        }

        .ringa-landing .msg-label {
          font-size: 10px;
          color: var(--muted);
          margin-bottom: 4px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .ringa-landing .booked-badge {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(74,222,128,0.08);
          border: 1px solid rgba(74,222,128,0.2);
          border-radius: 10px;
          padding: 12px 14px;
          margin-top: 16px;
          font-size: 13px;
          color: #4ADE80;
        }

        /* STATS */
        .ringa-landing .stats {
          position: relative;
          z-index: 1;
          padding: 24px 40px 80px;
          display: flex;
          justify-content: center;
          gap: 60px;
          flex-wrap: wrap;
          border-bottom: 1px solid var(--border);
        }

        .ringa-landing .stat { text-align: center; }

        .ringa-landing .stat-number {
          font-family: 'Syne', sans-serif;
          font-size: 36px;
          font-weight: 800;
          background: linear-gradient(135deg, var(--text), var(--blue-light));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.02em;
        }

        .ringa-landing .stat-label { font-size: 13px; color: var(--muted); margin-top: 4px; }

        /* SECTION */
        .ringa-landing .ringa-section {
          position: relative;
          z-index: 1;
          max-width: 1100px;
          margin: 0 auto;
          padding: 100px 40px;
        }

        .ringa-landing .section-label {
          font-size: 12px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--blue-light);
          margin-bottom: 16px;
          font-weight: 500;
        }

        .ringa-landing .section-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(28px, 4vw, 46px);
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.1;
          margin-bottom: 16px;
          color: var(--text);
        }

        .ringa-landing .section-sub {
          color: var(--muted);
          font-size: 17px;
          max-width: 500px;
          font-weight: 300;
          line-height: 1.65;
          margin-bottom: 60px;
        }

        /* FEATURES GRID */
        .ringa-landing .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1px;
          background: var(--border);
          border: 1px solid var(--border);
          border-radius: 20px;
          overflow: hidden;
        }

        .ringa-landing .feature {
          background: var(--bg);
          padding: 36px 32px;
          transition: background 0.2s;
        }

        .ringa-landing .feature:hover { background: var(--card); }

        .ringa-landing .feature-icon {
          width: 44px; height: 44px;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(59,111,255,0.2), rgba(124,63,255,0.2));
          border: 1px solid rgba(59,111,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          margin-bottom: 20px;
        }

        .ringa-landing .feature h3 {
          font-family: 'Syne', sans-serif;
          font-size: 17px;
          font-weight: 600;
          margin-bottom: 10px;
          letter-spacing: -0.01em;
          color: var(--text);
        }

        .ringa-landing .feature p { color: var(--muted); font-size: 14px; line-height: 1.65; font-weight: 300; }

        /* HOW IT WORKS */
        .ringa-landing .steps {
          display: flex;
          flex-direction: column;
          gap: 0;
          position: relative;
        }

        .ringa-landing .steps::before {
          content: '';
          position: absolute;
          left: 22px;
          top: 44px;
          bottom: 44px;
          width: 1px;
          background: linear-gradient(to bottom, var(--blue), var(--purple), transparent);
        }

        .ringa-landing .ringa-step {
          display: flex;
          gap: 28px;
          padding: 32px 0;
          opacity: 0;
          transform: translateX(-20px);
          transition: all 0.5s ease;
        }

        .ringa-landing .ringa-step.visible { opacity: 1; transform: translateX(0); }

        .ringa-landing .step-num {
          width: 44px; height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--blue), var(--purple));
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 15px;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
          color: #fff;
        }

        .ringa-landing .step-content h3 {
          font-family: 'Syne', sans-serif;
          font-size: 19px;
          font-weight: 600;
          margin-bottom: 8px;
          letter-spacing: -0.01em;
          color: var(--text);
        }

        .ringa-landing .step-content p { color: var(--muted); font-size: 15px; font-weight: 300; line-height: 1.65; }

        /* LANGUAGES */
        .ringa-landing .lang-pills {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 60px;
        }

        .ringa-landing .lang-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 100px;
          padding: 8px 18px;
          font-size: 14px;
          color: var(--muted);
          transition: all 0.2s;
        }

        .ringa-landing .lang-pill.active {
          background: rgba(59,111,255,0.12);
          border-color: rgba(59,111,255,0.3);
          color: var(--text);
        }

        .ringa-landing .lang-flag { font-size: 18px; }

        /* PRICING */
        .ringa-landing .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          align-items: start;
        }

        .ringa-landing .pricing-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 36px 32px;
          position: relative;
          transition: transform 0.2s, border-color 0.2s;
        }

        .ringa-landing .pricing-card:hover { transform: translateY(-4px); }

        .ringa-landing .pricing-card.featured {
          border-color: rgba(59,111,255,0.4);
          background: rgba(59,111,255,0.06);
        }

        .ringa-landing .pricing-card.featured::before {
          content: 'Most Popular';
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, var(--blue), var(--purple));
          color: #fff;
          font-size: 11px;
          font-weight: 600;
          padding: 4px 14px;
          border-radius: 100px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .ringa-landing .plan-name {
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 16px;
        }

        .ringa-landing .plan-price {
          font-family: 'Syne', sans-serif;
          font-size: 48px;
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1;
          margin-bottom: 6px;
          color: var(--text);
        }

        .ringa-landing .plan-price span {
          font-size: 20px;
          font-weight: 400;
          color: var(--muted);
          vertical-align: top;
          margin-top: 10px;
          display: inline-block;
        }

        .ringa-landing .plan-period { font-size: 13px; color: var(--muted); margin-bottom: 28px; }

        .ringa-landing .plan-features {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 32px;
        }

        .ringa-landing .plan-features li {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: var(--muted);
        }

        .ringa-landing .plan-features li .check {
          width: 18px; height: 18px;
          background: rgba(74,222,128,0.15);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          flex-shrink: 0;
        }

        /* CTA SECTION */
        .ringa-landing .cta-section {
          position: relative;
          z-index: 1;
          text-align: center;
          padding: 100px 40px;
          border-top: 1px solid var(--border);
        }

        .ringa-landing .cta-box {
          max-width: 640px;
          margin: 0 auto;
          position: relative;
        }

        .ringa-landing .cta-glow {
          position: absolute;
          width: 400px; height: 200px;
          background: linear-gradient(135deg, var(--blue), var(--purple));
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.15;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        /* FOOTER */
        .ringa-landing .ringa-footer {
          position: relative;
          z-index: 1;
          border-top: 1px solid var(--border);
          padding: 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
        }

        .ringa-landing .footer-logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 18px;
          background: linear-gradient(135deg, #fff, var(--blue-light));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .ringa-landing .footer-copy { font-size: 13px; color: var(--muted); }

        /* ANIMATIONS */
        @keyframes ringa-fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes ringa-fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* TYPING ANIMATION */
        .ringa-landing .typing { display: inline-flex; align-items: center; gap: 4px; }
        .ringa-landing .dot {
          width: 4px; height: 4px;
          background: var(--blue-light);
          border-radius: 50%;
          animation: ringa-typing 1.2s infinite;
        }
        .ringa-landing .dot:nth-child(2) { animation-delay: 0.2s; }
        .ringa-landing .dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes ringa-typing {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .ringa-landing .ringa-nav { padding: 16px 20px; }
          .ringa-landing .nav-links { display: none; }
          .ringa-landing .stats { gap: 32px; padding: 40px 20px 60px; }
          .ringa-landing .ringa-section { padding: 60px 20px; }
          .ringa-landing .steps::before { display: none; }
          .ringa-landing .ringa-footer { flex-direction: column; gap: 16px; text-align: center; }
        }
      `}</style>

      <div className="ringa-landing">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        {/* NAV */}
        <nav className="ringa-nav">
          <div className="logo">Ringa</div>
          <ul className="nav-links">
            <li><button onClick={() => scrollTo("features")}>Features</button></li>
            <li><button onClick={() => scrollTo("how")}>How it works</button></li>
            <li><button onClick={() => scrollTo("pricing")}>Pricing</button></li>
          </ul>
          <div className="nav-right">
            <Link href="/login" className="nav-signin">Sign In</Link>
            <Link href="/signup" className="nav-cta">Start Free Trial</Link>
          </div>
        </nav>

        {/* HERO */}
        <div className="hero">
          <div className="badge">
            <span className="badge-dot" />
            Live on every call, 24/7
          </div>

          <h1 className="hero-title">
            Your front desk,<br />
            <span className="gradient">always on.</span>
          </h1>

          <p className="hero-sub">
            Ringa answers every call, books every job, and dispatches your techs
            &mdash; in English, Spanish, or Portuguese &mdash; while you focus on
            the work.
          </p>

          <div className="hero-actions">
            <Link href="/signup" className="btn-primary">
              Start Free Trial &rarr;
            </Link>
            <button className="btn-ghost" onClick={() => scrollTo("how")}>
              See it in action
            </button>
          </div>

          <div className="hero-visual">
            <div className="call-card">
              <div className="call-header">
                <div className="call-status">
                  <span className="call-status-dot" />
                  Live call
                </div>
                <span className="call-time">11:47 PM</span>
              </div>
              <div className="call-messages">
                <div>
                  <div className="msg-label">Ringa AI</div>
                  <div className="msg msg-ai">
                    Hi, thank you for calling Sunshine HVAC. How can I help you
                    tonight?
                  </div>
                </div>
                <div style={{ alignSelf: "flex-end" }}>
                  <div className="msg-label" style={{ textAlign: "right" }}>
                    Customer
                  </div>
                  <div className="msg msg-user">
                    My AC stopped working, it&apos;s 95 degrees inside.
                  </div>
                </div>
                <div>
                  <div className="msg-label">Ringa AI</div>
                  <div className="msg msg-ai">
                    I&apos;m sorry to hear that. I can get a technician to you
                    first thing tomorrow at 8 AM. Can I get your address?
                  </div>
                </div>
                <div style={{ alignSelf: "flex-end" }}>
                  <div className="msg-label" style={{ textAlign: "right" }}>
                    Customer
                  </div>
                  <div
                    className="msg msg-user"
                    style={{
                      fontStyle: "italic",
                      fontSize: "13px",
                      color: "#9090B8",
                    }}
                  >
                    switching to Spanish...
                  </div>
                </div>
                <div>
                  <div className="msg-label">Ringa AI</div>
                  <div className="msg msg-ai">
                    Por supuesto, puedo ayudarle en espa&ntilde;ol. &iquest;Cu&aacute;l
                    es su direcci&oacute;n?
                  </div>
                </div>
              </div>
              <div className="booked-badge">
                <span>&#10003;</span>
                Job booked &middot; Tomorrow 8:00 AM &middot; Carlos assigned
              </div>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="stats">
          <div className="stat">
            <div className="stat-number">$120K</div>
            <div className="stat-label">
              avg. annual revenue lost to missed calls
            </div>
          </div>
          <div className="stat">
            <div className="stat-number">80%</div>
            <div className="stat-label">
              of callers won&apos;t leave a voicemail
            </div>
          </div>
          <div className="stat">
            <div className="stat-number">24/7</div>
            <div className="stat-label">coverage, zero overtime</div>
          </div>
          <div className="stat">
            <div className="stat-number">3</div>
            <div className="stat-label">languages, automatic detection</div>
          </div>
        </div>

        {/* FEATURES */}
        <section className="ringa-section" id="features">
          <div className="section-label">Features</div>
          <h2 className="section-title">
            Everything your front desk
            <br />
            should do. Automatically.
          </h2>
          <p className="section-sub">
            Built specifically for HVAC companies. No generic chatbots. No call
            centers. Just a system that works.
          </p>

          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">{"\uD83D\uDCDE"}</div>
              <h3>Answers every call</h3>
              <p>
                Never send a customer to voicemail again. Ringa picks up
                instantly, 24 hours a day, 365 days a year &mdash; including
                holidays and heat waves.
              </p>
            </div>
            <div className="feature">
              <div className="feature-icon">{"\uD83D\uDDD3\uFE0F"}</div>
              <h3>Books directly on your calendar</h3>
              <p>
                Syncs with each technician&apos;s Google Calendar in real time.
                No double bookings, no manual entry, no morning catch-up calls.
              </p>
            </div>
            <div className="feature">
              <div className="feature-icon">{"\uD83C\uDF0E"}</div>
              <h3>Trilingual by default</h3>
              <p>
                Detects and switches between English, Spanish, and Portuguese
                mid-call &mdash; automatically. No menus, no &ldquo;press 2 for
                Spanish.&rdquo;
              </p>
            </div>
            <div className="feature">
              <div className="feature-icon">{"\uD83D\uDEA8"}</div>
              <h3>Emergency triage</h3>
              <p>
                Recognizes urgent keywords like &ldquo;no heat,&rdquo;
                &ldquo;gas smell,&rdquo; or &ldquo;no AC&rdquo; and routes
                emergency calls to your on-call tech immediately.
              </p>
            </div>
            <div className="feature">
              <div className="feature-icon">{"\uD83D\uDCCD"}</div>
              <h3>Address verification</h3>
              <p>
                Every address is validated via Google Maps before the job is
                booked. No wrong addresses, no wasted drive time.
              </p>
            </div>
            <div className="feature">
              <div className="feature-icon">{"\u26A1"}</div>
              <h3>Setup in minutes</h3>
              <p>
                Add your company name, technician names, and connect Google
                Calendar. Ringa is live and answering calls within 10 minutes.
              </p>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section
          className="ringa-section"
          id="how"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <div className="section-label">How it works</div>
          <h2 className="section-title">
            Three steps to never miss
            <br />a call again.
          </h2>
          <p className="section-sub">
            No IT team required. No contracts. No training sessions.
          </p>

          <div className="steps" ref={stepsRef}>
            <div className="ringa-step">
              <div className="step-num">1</div>
              <div className="step-content">
                <h3>Set up your account</h3>
                <p>
                  Enter your company name, add your technicians, set their
                  working hours, and connect Google Calendar. Takes less than 10
                  minutes from signup to live.
                </p>
              </div>
            </div>
            <div className="ringa-step">
              <div className="step-num">2</div>
              <div className="step-content">
                <h3>Forward your number to Ringa</h3>
                <p>
                  Point your existing business number to Ringa. Customers call
                  the same number they always have. Everything else is automatic.
                </p>
              </div>
            </div>
            <div className="ringa-step">
              <div className="step-num">3</div>
              <div className="step-content">
                <h3>Wake up to a full schedule</h3>
                <p>
                  Every call answered, every job booked, every address verified.
                  Your technicians start the day with a full calendar &mdash; no
                  calls required from you.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* LANGUAGES */}
        <section
          className="ringa-section"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <div className="section-label">Multilingual</div>
          <h2 className="section-title">
            Speak your customer&apos;s language.
            <br />
            Every single time.
          </h2>
          <p className="section-sub">
            Ringa detects the caller&apos;s language in real time and responds
            fluently &mdash; no menus, no delays, no lost customers.
          </p>

          <div className="lang-pills">
            <div className="lang-pill active">
              <span className="lang-flag">{"\uD83C\uDDFA\uD83C\uDDF8"}</span>{" "}
              English
            </div>
            <div className="lang-pill active">
              <span className="lang-flag">{"\uD83C\uDDF2\uD83C\uDDFD"}</span>{" "}
              Spanish
            </div>
            <div className="lang-pill active">
              <span className="lang-flag">{"\uD83C\uDDE7\uD83C\uDDF7"}</span>{" "}
              Portuguese
            </div>
          </div>

          <div className="call-card" style={{ maxWidth: "480px" }}>
            <div className="call-header">
              <div className="call-status">
                <span className="call-status-dot" />
                Live call
              </div>
              <span className="call-time">2:14 AM</span>
            </div>
            <div className="call-messages">
              <div>
                <div className="msg-label">Ringa AI</div>
                <div className="msg msg-ai">
                  Hi, Sunshine HVAC, how can I help you?
                </div>
              </div>
              <div style={{ alignSelf: "flex-end" }}>
                <div className="msg-label" style={{ textAlign: "right" }}>
                  Customer
                </div>
                <div className="msg msg-user">
                  Meu ar condicionado parou de funcionar.
                </div>
              </div>
              <div>
                <div className="msg-label">Ringa AI</div>
                <div className="msg msg-ai">
                  Entendi, vou te ajudar agora mesmo. Desde quando o ar
                  condicionado est&aacute; sem funcionar?
                </div>
              </div>
              <div style={{ alignSelf: "flex-end" }}>
                <div className="msg-label" style={{ textAlign: "right" }}>
                  Customer
                </div>
                <div className="msg msg-user">
                  Desde hoje &agrave; tarde, t&aacute; muito calor aqui.
                </div>
              </div>
              <div>
                <div className="msg-label">Ringa AI</div>
                <div className="msg msg-ai">
                  Tudo bem, j&aacute; agendei um t&eacute;cnico para
                  amanh&atilde; &agrave;s 8h. Pode me passar seu
                  endere&ccedil;o?
                </div>
              </div>
            </div>
            <div className="booked-badge">
              <span>&#10003;</span>
              Agendado &middot; Amanh&atilde; 8:00 &middot; Marco designado
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section
          className="ringa-section"
          id="pricing"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <div className="section-label">Pricing</div>
          <h2 className="section-title">
            Simple pricing.
            <br />
            Pays for itself in one call.
          </h2>
          <p className="section-sub">
            No setup fees. No contracts. Cancel anytime.
          </p>

          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="plan-name">Starter</div>
              <div className="plan-price">
                <span>$</span>149
              </div>
              <div className="plan-period">per month</div>
              <ul className="plan-features">
                <li>
                  <span className="check">&#10003;</span> 1 technician
                </li>
                <li>
                  <span className="check">&#10003;</span> English, Spanish &amp;
                  Portuguese
                </li>
                <li>
                  <span className="check">&#10003;</span> 24/7 call answering
                </li>
                <li>
                  <span className="check">&#10003;</span> Google Calendar sync
                </li>
                <li>
                  <span className="check">&#10003;</span> Address verification
                </li>
                <li>
                  <span className="check">&#10003;</span> Emergency triage
                </li>
                <li>
                  <span className="check">&#10003;</span> Analytics dashboard
                </li>
              </ul>
              <Link
                href="/signup"
                className="btn-ghost"
                style={{ width: "100%", padding: "12px", textAlign: "center" }}
              >
                Get started
              </Link>
            </div>

            <div className="pricing-card featured">
              <div className="plan-name">Professional</div>
              <div className="plan-price">
                <span>$</span>249
              </div>
              <div className="plan-period">per month</div>
              <ul className="plan-features">
                <li>
                  <span className="check">&#10003;</span> Up to 5 technicians
                </li>
                <li>
                  <span className="check">&#10003;</span> English, Spanish &amp;
                  Portuguese
                </li>
                <li>
                  <span className="check">&#10003;</span> 24/7 call answering
                </li>
                <li>
                  <span className="check">&#10003;</span> Google Calendar sync
                </li>
                <li>
                  <span className="check">&#10003;</span> Address verification
                </li>
                <li>
                  <span className="check">&#10003;</span> Emergency triage
                </li>
                <li>
                  <span className="check">&#10003;</span> SMS confirmations
                </li>
                <li>
                  <span className="check">&#10003;</span> Analytics dashboard
                </li>
              </ul>
              <Link
                href="/signup"
                className="btn-primary"
                style={{ width: "100%", padding: "12px", textAlign: "center" }}
              >
                Get started
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="cta-section">
          <div className="cta-box">
            <div className="cta-glow" />
            <div className="section-label" style={{ marginBottom: "20px" }}>
              Get started today
            </div>
            <h2 className="section-title" style={{ marginBottom: "16px" }}>
              Stop losing jobs
              <br />
              to voicemail.
            </h2>
            <p
              style={{
                color: "var(--muted)",
                fontSize: "16px",
                marginBottom: "36px",
                fontWeight: 300,
              }}
            >
              The average HVAC company loses $45,000&ndash;$120,000 per year
              from missed calls. Ringa pays for itself the first week.
            </p>
            <Link
              href="/signup"
              className="btn-primary"
              style={{ fontSize: "16px", padding: "16px 40px" }}
            >
              Start your free trial &rarr;
            </Link>
            <p
              style={{
                color: "var(--muted)",
                fontSize: "13px",
                marginTop: "16px",
              }}
            >
              No credit card required. Live in 10 minutes.
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="ringa-footer">
          <div className="footer-logo">Ringa</div>
          <div className="footer-copy">
            &copy; 2026 Ringa. All rights reserved.
          </div>
        </footer>
      </div>
    </>
  );
}
