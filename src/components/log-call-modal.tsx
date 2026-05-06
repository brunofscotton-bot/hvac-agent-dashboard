"use client";

import { useState } from "react";
import { X, Save } from "lucide-react";
import { logManualCall } from "@/lib/api";

const OUTCOMES = [
  { value: "APPOINTMENT_BOOKED", label: "Appointment booked", desc: "Call ended with a visit scheduled" },
  { value: "INFO_PROVIDED", label: "Info provided", desc: "Answered questions, no booking yet" },
  { value: "CALLBACK_REQUESTED", label: "Callback requested", desc: "Customer wants me to call back" },
  { value: "CUSTOMER_DECLINED", label: "Customer declined", desc: "Heard pricing/details, decided not to book" },
  { value: "NO_AVAILABILITY", label: "No availability", desc: "Couldn't fit them in the schedule" },
];

export function LogCallModal({
  onClose,
  onLogged,
}: {
  onClose: () => void;
  onLogged: () => void;
}) {
  const [callerPhone, setCallerPhone] = useState("");
  const [duration, setDuration] = useState("");
  const [language, setLanguage] = useState("en");
  const [outcome, setOutcome] = useState("APPOINTMENT_BOOKED");
  const [summary, setSummary] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit() {
    setErr(null);
    if (!callerPhone.trim() || !summary.trim()) {
      setErr("Phone and summary are required.");
      return;
    }
    setSubmitting(true);
    try {
      await logManualCall({
        caller_phone: callerPhone.trim(),
        duration_seconds: duration ? Number(duration) * 60 : undefined,
        language_detected: language,
        outcome,
        summary,
      });
      onLogged();
      onClose();
    } catch (e: any) {
      setErr(e.message || "Failed to log call");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center bg-black/50 p-0 sm:p-4">
      <div className="bg-white w-full max-w-lg sm:rounded-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Log a phone call</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Use this to record a call you took on your personal cell. Tracks lead source for stats.
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Caller's phone</label>
              <input
                type="tel"
                value={callerPhone}
                onChange={(e) => setCallerPhone(e.target.value)}
                placeholder="+14071234567"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Duration (min) <span className="text-gray-400 font-normal">— optional</span></label>
              <input
                type="number"
                min={1}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="5"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
            >
              <option value="en">English</option>
              <option value="pt">Português</option>
              <option value="es">Español</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Outcome</label>
            <div className="mt-2 space-y-1.5">
              {OUTCOMES.map((o) => (
                <label
                  key={o.value}
                  className={`flex items-start gap-2 p-2.5 rounded-lg border cursor-pointer ${
                    outcome === o.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="outcome"
                    value={o.value}
                    checked={outcome === o.value}
                    onChange={(e) => setOutcome(e.target.value)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{o.label}</p>
                    <p className="text-xs text-gray-500">{o.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">What did they want?</label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={3}
              placeholder="e.g. AC not cooling, asked for a quote, will check with spouse..."
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          {outcome === "APPOINTMENT_BOOKED" && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
              💡 If you booked an appointment from this call, also click <strong>"+ New appointment"</strong> on the Appointments page to create the visit. They'll be linked by the customer's phone.
            </div>
          )}

          {err && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{err}</p>}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={submitting}
            className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold disabled:opacity-50 hover:bg-blue-700"
          >
            <Save className="h-4 w-4" />
            {submitting ? "Saving..." : "Log call"}
          </button>
        </div>
      </div>
    </div>
  );
}
