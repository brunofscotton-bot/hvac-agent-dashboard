import Link from "next/link";
import { StepAnimator, ScrollButton } from "./LandingInteractive";

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
            <li><ScrollButton targetId="features">Features</ScrollButton></li>
            <li><ScrollButton targetId="how">How it works</ScrollButton></li>
            <li><ScrollButton targetId="pricing">Pricing</ScrollButton></li>
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
            <ScrollButton targetId="how" className="r-btn-outline">
              See how it works
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

          <div className="r-steps">
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
