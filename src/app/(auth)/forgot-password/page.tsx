"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl text-center">
        <div className="text-4xl mb-4">📬</div>
        <h1 className="text-xl font-bold text-white">Check your inbox</h1>
        <p className="mt-2 text-sm text-gray-400">
          If an account with that email exists, we&apos;ve sent a password reset link to{" "}
          <span className="font-medium text-white">{email}</span>.
        </p>
        <p className="mt-3 text-sm text-gray-400">
          We also sent it via SMS to the phone number on file as a backup.
        </p>
        <p className="mt-4 text-xs text-gray-500">
          The link expires in 1 hour. Didn&apos;t receive it? Check your spam folder or make sure your account details are correct.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block w-full rounded-lg py-2.5 text-sm font-semibold text-white text-center transition-all"
          style={{ background: "linear-gradient(135deg, #3B6FFF, #7C3FFF)" }}
        >
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
      <h1 className="text-xl font-bold text-white">Reset your password</h1>
      <p className="mt-1 text-sm text-gray-400">
        Enter your email and we&apos;ll send you a reset link
      </p>

      {error && (
        <div className="mt-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-300">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#3B6FFF] focus:outline-none focus:ring-1 focus:ring-[#3B6FFF]"
            placeholder="you@company.com"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg py-2.5 text-sm font-semibold text-white disabled:opacity-50 transition-all"
          style={{ background: "linear-gradient(135deg, #3B6FFF, #7C3FFF)" }}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-400">
        Remember your password?{" "}
        <Link href="/login" className="font-medium text-[#5B8FFF] hover:text-white transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
