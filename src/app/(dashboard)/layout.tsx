"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { Sidebar } from "@/components/sidebar";
import { updateCompany } from "@/lib/api";
import { useState } from "react";

function CallForwardingBanner({ onDismiss }: { onDismiss: () => void }) {
  const [confirming, setConfirming] = useState(false);

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      await updateCompany({ call_forwarding_confirmed: true });
      onDismiss();
    } catch {
      /* ignore */
    }
    setConfirming(false);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between gap-3 bg-amber-500 px-4 py-2.5 text-sm font-medium text-white shadow-md">
      <div className="flex items-center gap-2">
        <span className="text-base">⚠️</span>
        <span>
          <strong>Call forwarding not set up.</strong> Your Ringa receptionist won&apos;t receive calls until you forward your business number to Ringa.{" "}
          <Link href="/onboarding" className="underline hover:text-amber-100">
            See setup guide →
          </Link>
        </span>
      </div>
      <button
        onClick={handleConfirm}
        disabled={confirming}
        className="shrink-0 rounded-md bg-white/20 px-3 py-1 text-xs font-semibold hover:bg-white/30 disabled:opacity-60"
      >
        {confirming ? "Saving..." : "✓ Forwarding is set up"}
      </button>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { loading, company, refresh } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!company) {
    return null; // AuthProvider will redirect to /login
  }

  const showBanner =
    !dismissed &&
    company.onboarding_completed &&
    !company.call_forwarding_confirmed;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className={`flex-1 flex flex-col p-4 pt-16 md:p-8 md:pt-8 ${showBanner ? "pt-24 md:pt-20" : ""}`}>
        {showBanner && (
          <CallForwardingBanner
            onDismiss={() => {
              setDismissed(true);
              refresh();
            }}
          />
        )}
        <div className="flex-1">{children}</div>
        <footer className="mt-12 border-t border-gray-100 pt-4 pb-2 text-center text-xs text-gray-400">
          &copy; 2026 Ringa &middot;{" "}
          <a href="/terms" className="hover:text-gray-600 underline">Terms of Service</a> &middot;{" "}
          <a href="/privacy" className="hover:text-gray-600 underline">Privacy Policy</a>
        </footer>
      </main>
    </div>
  );
}
