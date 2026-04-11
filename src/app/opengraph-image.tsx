import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Ringa — Your front desk, always on";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          background: "#0a0e1a",
          backgroundImage:
            "radial-gradient(ellipse at top left, rgba(59,111,255,0.25) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(124,63,255,0.2) 0%, transparent 50%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            marginBottom: "40px",
          }}
        >
          {/* Soundwave SVG rects */}
          <svg width="60" height="60" viewBox="0 0 48 48" fill="none">
            <rect x="6" y="18" width="3.5" height="12" rx="1.75" fill="#7C3FFF" opacity="0.6" />
            <rect x="12" y="12" width="3.5" height="24" rx="1.75" fill="#6B5FFF" opacity="0.8" />
            <rect x="18" y="6" width="3.5" height="36" rx="1.75" fill="#5B7FFF" />
            <rect x="24" y="3" width="3.5" height="42" rx="1.75" fill="#3B6FFF" />
            <rect x="30" y="6" width="3.5" height="36" rx="1.75" fill="#5B7FFF" />
            <rect x="36" y="12" width="3.5" height="24" rx="1.75" fill="#6B5FFF" opacity="0.8" />
            <rect x="42" y="18" width="3.5" height="12" rx="1.75" fill="#7C3FFF" opacity="0.6" />
          </svg>
          <span
            style={{
              fontSize: "44px",
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-1px",
            }}
          >
            ringa
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: "86px",
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.05,
            letterSpacing: "-3px",
            marginBottom: "8px",
            display: "flex",
          }}
        >
          Your front desk,
        </div>
        <div
          style={{
            fontSize: "86px",
            fontWeight: 800,
            background: "linear-gradient(135deg, #5B7FFF 0%, #7C3FFF 100%)",
            backgroundClip: "text",
            color: "transparent",
            lineHeight: 1.05,
            letterSpacing: "-3px",
            marginBottom: "40px",
            display: "flex",
          }}
        >
          always on.
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "28px",
            color: "rgba(255,255,255,0.7)",
            lineHeight: 1.4,
            maxWidth: "900px",
            display: "flex",
          }}
        >
          AI receptionist for HVAC companies. Answers every call, books every job, dispatches your techs — 24/7.
        </div>

        {/* Badge */}
        <div
          style={{
            marginTop: "48px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            padding: "12px 22px",
            borderRadius: "999px",
            background: "rgba(59,111,255,0.15)",
            border: "1px solid rgba(59,111,255,0.35)",
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#4ADE80",
            }}
          />
          <span style={{ fontSize: "20px", color: "#ffffff", fontWeight: 500 }}>
            Live on every call, 24/7 · English · Español · Português
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
