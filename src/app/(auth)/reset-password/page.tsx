"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl text-center">
        <div className="text-4xl mb-4">&#10060;</div>
        <h1 className="text-xl font-bold text-white">Invalid Reset Link</h1>
        <p className="mt-2 text-sm text-gray-400">
          This password reset link is invalid or has expired.
        </p>
        <Link
          href="/forgot-password"
          className="mt-6 inline-block w-full rounded-lg py-2.5 text-sm font-semibold text-white text-center transition-all"
          style={{ background: "linear-gradient(135deg, #3B6FFF, #7C3FFF)" }}
        >
          Request a New Link
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl text-center">
        <div className="text-4xl mb-4">&#10003;</div>
        <h1 className="text-xl font-bold text-white">Password Updated!</h1>
        <p className="mt-2 text-sm text-gray-400">You can now sign in with your new password.</p>
        <Link
          href="/login"
          className="mt-6 inline-block w-full rounded-lg py-2.5 text-sm font-semibold text-white text-center transition-all"
          style={{ background: "linear-gradient(135deg, #3B6FFF, #7C3FFF)" }}
        >
          Go to Sign In
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: newPassword }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Reset failed");
      }
      setDone(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
      <h1 className="text-xl font-bold text-white">Set New Password</h1>
      <p className="mt-1 text-sm text-gray-400">Choose a new password for your account</p>

      {error && (
        <div className="mt-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-300">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">New Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#3B6FFF] focus:outline-none focus:ring-1 focus:ring-[#3B6FFF]"
            placeholder="At least 6 characters"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Confirm Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#3B6FFF] focus:outline-none focus:ring-1 focus:ring-[#3B6FFF]"
            placeholder="Repeat your password"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg py-2.5 text-sm font-semibold text-white disabled:opacity-50 transition-all"
          style={{ background: "linear-gradient(135deg, #3B6FFF, #7C3FFF)" }}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center text-gray-400">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
