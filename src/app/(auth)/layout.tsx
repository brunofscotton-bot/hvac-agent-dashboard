export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: "linear-gradient(135deg, #0a0e1a 0%, #111827 40%, #1a1040 100%)" }}>
      <div className="w-full max-w-md px-4">
        <div className="mb-10 flex items-center justify-center gap-3">
          {/* Ringa soundwave logo */}
          <svg width="44" height="44" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="18" width="3.5" height="12" rx="1.75" fill="#7C3FFF" opacity="0.6" />
            <rect x="12" y="12" width="3.5" height="24" rx="1.75" fill="#6B5FFF" opacity="0.8" />
            <rect x="18" y="6" width="3.5" height="36" rx="1.75" fill="#5B7FFF" />
            <rect x="24" y="3" width="3.5" height="42" rx="1.75" fill="#3B6FFF" />
            <rect x="30" y="6" width="3.5" height="36" rx="1.75" fill="#5B7FFF" />
            <rect x="36" y="12" width="3.5" height="24" rx="1.75" fill="#6B5FFF" opacity="0.8" />
            <rect x="42" y="18" width="3.5" height="12" rx="1.75" fill="#7C3FFF" opacity="0.6" />
          </svg>
          <span
            className="text-3xl font-bold tracking-tight"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #a8b4ff 50%, #7C3FFF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontFamily: "'Inter', system-ui, sans-serif",
              letterSpacing: "-0.02em",
            }}
          >
            ringa
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}
