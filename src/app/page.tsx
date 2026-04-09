"use client";

import { useState } from "react";
import Link from "next/link";
import { StepAnimator, ScrollButton } from "./LandingInteractive";
import PricingSection from "./PricingSection";
import LangSwitcher from "./LangSwitcher";
import { LANDING_TEXT, type LandingLang } from "./landing-i18n";

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

/* ── SVG Icons ─────────────────────────────────────── */
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
  const [lang, setLang] = useState<LandingLang>("en");
  const t = (key: string) => LANDING_TEXT[lang][key] || LANDING_TEXT.en[key] || key;

  return (
    <>
      {/* Mounts the IntersectionObserver for step animations */}
      <StepAnimator />

      <div className="r-landing">
        {/* NAV */}
        <nav className="r-nav">
          <div className="r-nav-logo">
            <RingaLogo size={28} />
            <span>ringa</span>
          </div>
          <ul className="r-nav-links">
            <li><ScrollButton targetId="features">{t("nav_features")}</ScrollButton></li>
            <li><ScrollButton targetId="how">{t("nav_how")}</ScrollButton></li>
            <li><ScrollButton targetId="pricing">{t("nav_pricing")}</ScrollButton></li>
          </ul>
          <div className="r-nav-right">
            <LangSwitcher lang={lang} onChange={setLang} />
            <Link href="/login" className="r-nav-signin">{t("nav_signin")}</Link>
            <Link href="/signup" className="r-btn">{t("nav_cta")}</Link>
          </div>
        </nav>

        {/* HERO */}
        <div className="r-hero">
          <div className="r-badge">
            <span className="r-badge-dot" />
            {t("badge")}
          </div>

          <h1>
            {t("hero_1")}<br />
            <span className="gradient">{t("hero_2")}</span>
          </h1>

          <p className="r-hero-sub">{t("hero_sub")}</p>

          <div className="r-hero-actions">
            <Link href="/signup" className="r-btn r-btn-lg">
              {t("hero_cta")}
            </Link>
            <ScrollButton targetId="how" className="r-btn-outline">
              {t("hero_cta2")}
            </ScrollButton>
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
            <div className="r-stat-num">{t("stat1_num")}</div>
            <div className="r-stat-label">{t("stat1_label")}</div>
          </div>
          <div className="r-stat">
            <div className="r-stat-num">{t("stat2_num")}</div>
            <div className="r-stat-label">{t("stat2_label")}</div>
          </div>
          <div className="r-stat">
            <div className="r-stat-num">{t("stat3_num")}</div>
            <div className="r-stat-label">{t("stat3_label")}</div>
          </div>
          <div className="r-stat">
            <div className="r-stat-num">{t("stat4_num")}</div>
            <div className="r-stat-label">{t("stat4_label")}</div>
          </div>
        </div>

        {/* FEATURES */}
        <section className="r-section" id="features">
          <div className="r-section-label">{t("features_label")}</div>
          <h2 className="r-section-title">
            {t("features_title_1")}<br />{t("features_title_2")}
          </h2>
          <p className="r-section-sub">{t("features_sub")}</p>

          <div className="r-features">
            {[
              { icon: <IconPhone />, key: "feat1" },
              { icon: <IconCalendar />, key: "feat2" },
              { icon: <IconGlobe />, key: "feat3" },
              { icon: <IconAlert />, key: "feat4" },
              { icon: <IconMapPin />, key: "feat5" },
              { icon: <IconMessageSquare />, key: "feat6" },
              { icon: <IconUsers />, key: "feat7" },
              { icon: <IconZap />, key: "feat8" },
              { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5B8FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>, key: "feat9" },
            ].map(({ icon, key }) => (
              <div key={key} className="r-feature">
                <div className="r-feature-icon">{icon}</div>
                <h3>{t(`${key}_title`)}</h3>
                <p>{t(`${key}_desc`)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="r-section" id="how" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="r-section-label">{t("how_label")}</div>
          <h2 className="r-section-title">
            {t("how_title_1")}<br />{t("how_title_2")}
          </h2>
          <p className="r-section-sub">{t("how_sub")}</p>

          <div className="r-steps">
            {[1, 2, 3].map((n) => (
              <div key={n} className="r-step">
                <div className="r-step-num">{n}</div>
                <div className="r-step-content">
                  <h3>{t(`how_step${n}_title`)}</h3>
                  <p>{t(`how_step${n}_desc`)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* LANGUAGES */}
        <section className="r-section" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="r-section-label">{t("lang_label")}</div>
          <h2 className="r-section-title">
            {t("lang_title_1")}<br />{t("lang_title_2")}
          </h2>
          <p className="r-section-sub">{t("lang_sub")}</p>

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
            One missed call costs more<br />than a full year of Ringa.
          </h2>
          <p className="r-section-sub">
            Your Ringa receptionist goes live in under 5 minutes. No contracts. No setup fees. Cancel anytime.
          </p>

          <PricingSection />
        </section>

        {/* CTA */}
        <div className="r-cta">
          <div className="r-cta-box">
            <div className="r-section-label" style={{ marginBottom: "16px" }}>{t("cta_label")}</div>
            <h2 className="r-section-title" style={{ marginBottom: "12px" }}>
              {t("cta_title_1")}<br />{t("cta_title_2")}
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "16px", marginBottom: "32px", lineHeight: "1.7" }}>
              {t("cta_sub")}
            </p>
            <Link href="/signup" className="r-btn r-btn-lg" style={{ fontSize: "16px", padding: "16px 40px" }}>
              {t("cta_btn")}
            </Link>
            <p style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "14px" }}>
              {t("cta_note")}
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
