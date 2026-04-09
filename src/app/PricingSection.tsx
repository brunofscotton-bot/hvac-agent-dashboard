"use client";

import { useState } from "react";
import Link from "next/link";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 99,
    subtitle: "For solo contractors",
    badge: null,
    minutes: "300 minutes/month",
    techs: "1 technician",
    features: [
      "24/7 AI call answering",
      "English, Spanish & Portuguese",
      "Auto language detection",
      "Google Calendar sync",
      "SMS confirmations (customer + tech)",
      "Address verification via Google Maps",
      "Emergency call triage",
      "15-day call transcript retention",
    ],
    overage: "$0.35/min after 300 min",
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 249,
    subtitle: "For growing teams",
    badge: "Most Popular",
    minutes: "1,500 minutes/month",
    techs: "Up to 5 technicians",
    features: [
      "Everything in Starter, plus:",
      "Jobber integration",
      "Round-robin dispatch",
      "Pricebook & quotes",
      "Priority call routing",
      "30-day call transcript retention",
      "Priority support",
    ],
    overage: "$0.35/min after 1,500 min",
    highlight: true,
  },
  {
    id: "business",
    name: "Business",
    price: 449,
    subtitle: "For established operations",
    badge: null,
    minutes: "Unlimited minutes",
    techs: "Up to 15 technicians",
    features: [
      "Everything in Pro, plus:",
      "Unlimited call minutes",
      "Custom AI training for your business",
      "Dedicated account manager",
      "3-month call transcript retention",
      "SLA guarantee",
      "Multi-location support",
    ],
    overage: null,
    highlight: false,
  },
];

const FAQ = [
  {
    q: "What happens during the 14-day free trial?",
    a: "Your Ringa receptionist goes live in under 5 minutes. Forward your business number to Ringa and every call gets answered, jobs get booked, and techs get dispatched automatically. No credit card required. No setup fees. If you don\u2019t see value in 14 days, walk away with zero cost.",
  },
  {
    q: "How fast is the setup?",
    a: "Under 5 minutes. Enter your company name, add your technicians, and set your hours. Each tech receives an SMS to connect their Google Calendar with one tap. Forward your number to Ringa and you\u2019re live.",
  },
  {
    q: "What if I go over my included minutes?",
    a: "Starter and Pro plans include generous minute allowances. If you go over, additional minutes are billed at $0.35/min. You\u2019ll get an alert at 80% usage so there are no surprises. If you\u2019re consistently going over, upgrading to the next tier is usually more cost-effective.",
  },
  {
    q: "How does trilingual support work?",
    a: "Ringa detects the caller\u2019s language in real time and responds fluently in English, Spanish, or Portuguese. No phone menus, no \u201Cpress 2 for Spanish.\u201D The switch happens mid-call if needed, automatically.",
  },
  {
    q: "Can I keep my current business number?",
    a: "Yes. You simply forward your existing number to Ringa. Your customers call the same number they always have. Nothing changes for them except every call gets answered.",
  },
  {
    q: "What does the Jobber integration do?",
    a: "On the Pro plan and above, Ringa syncs directly with your Jobber account. Jobs booked by Ringa appear in Jobber automatically. No double entry, no manual transfers. Your existing workflow stays intact.",
  },
];

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="9" fill="rgba(74, 222, 128, 0.15)" />
      <path d="M5.5 9L8 11.5L12.5 6.5" stroke="#4ADE80" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PricingSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [annual, setAnnual] = useState(false);

  return (
    <>
      {/* ROI bar */}
      <div className="r-roi-bar">
        <div className="r-roi-item">
          <div className="r-roi-num">$500+</div>
          <div className="r-roi-label">avg. emergency job value</div>
        </div>
        <div className="r-roi-item">
          <div className="r-roi-num">74%</div>
          <div className="r-roi-label">of HVAC calls go unanswered</div>
        </div>
        <div className="r-roi-item">
          <div className="r-roi-num">85%</div>
          <div className="r-roi-label">won&apos;t call back after voicemail</div>
        </div>
      </div>

      {/* Annual toggle */}
      <div className="r-annual-toggle">
        <span className={`r-toggle-label ${!annual ? "active" : ""}`} onClick={() => setAnnual(false)}>
          Monthly
        </span>
        <button
          className={`r-toggle-track ${annual ? "on" : ""}`}
          onClick={() => setAnnual(!annual)}
          aria-label="Toggle annual billing"
        >
          <span className="r-toggle-knob" />
        </button>
        <span className={`r-toggle-label ${annual ? "active" : ""}`} onClick={() => setAnnual(true)}>
          Annual
        </span>
        {annual && <span className="r-annual-save">Save 20%</span>}
      </div>

      {/* Plans grid */}
      <div className="r-plans-grid">
        {PLANS.map((plan) => {
          const displayPrice = annual ? Math.round(plan.price * 0.8) : plan.price;
          return (
            <div key={plan.id} className={`r-plan-card ${plan.highlight ? "highlighted" : ""}`}>
              {plan.badge && <div className="r-plan-badge">{plan.badge}</div>}
              <div className="r-plan-tier">{plan.name}</div>
              <div className="r-plan-subtitle">{plan.subtitle}</div>
              <div className="r-plan-price-big">
                <span className="r-dollar">$</span>
                {displayPrice}
              </div>
              <div className="r-plan-period">
                {annual ? "per month, billed annually" : "per month"}
              </div>

              <div className="r-plan-pills">
                <span className="r-pill">{plan.techs}</span>
                <span className="r-pill">{plan.minutes}</span>
              </div>

              <div className="r-plan-divider" />

              <ul className="r-plan-features-list">
                {plan.features.map((f, i) => (
                  <li key={i} className="r-plan-feature-item">
                    {f.includes("Everything in") ? (
                      <span className="r-plan-inherit">{f}</span>
                    ) : (
                      <>
                        <CheckIcon />
                        <span>{f}</span>
                      </>
                    )}
                  </li>
                ))}
              </ul>

              {plan.overage && <div className="r-plan-overage">{plan.overage}</div>}

              <Link
                href="/signup"
                className={`r-plan-cta ${plan.highlight ? "primary" : "secondary"}`}
              >
                Start 14-day free trial
              </Link>

              <div className="r-plan-trial-note">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                14 days free. No credit card.
              </div>
            </div>
          );
        })}
      </div>

      {/* Enterprise banner */}
      <div className="r-enterprise-banner">
        <p>
          More than 15 technicians or multiple locations?{" "}
          <a href="mailto:hello@ringa.live">Contact sales</a> for a custom plan.
        </p>
      </div>

      {/* Guarantee */}
      <div className="r-guarantee">
        <div className="r-guarantee-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        </div>
        <h3 className="r-guarantee-title">The Ringa Guarantee</h3>
        <p className="r-guarantee-text">
          If Ringa doesn&apos;t book at least one job during your 14-day trial that
          would have otherwise gone to voicemail, we&apos;ll extend your trial for
          another 14 days. No questions asked.
        </p>
      </div>

      {/* FAQ */}
      <div className="r-faq-section">
        <div className="r-section-label" style={{ marginBottom: "32px" }}>Common Questions</div>
        {FAQ.map((item, i) => (
          <div key={i} className="r-faq-item">
            <button className="r-faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              {item.q}
              <svg
                className={`r-faq-arrow ${openFaq === i ? "open" : ""}`}
                width="16" height="16" viewBox="0 0 16 16" fill="none"
              >
                <path d="M4 6l4 4 4-4" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            {openFaq === i && <div className="r-faq-answer">{item.a}</div>}
          </div>
        ))}
      </div>
    </>
  );
}
