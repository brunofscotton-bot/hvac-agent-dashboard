"use client";

import { useAuth } from "@/lib/auth";
import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { loading, company } = useAuth();

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

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col p-4 pt-16 md:p-8 md:pt-8">
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
