"use client";

import { useEffect, useState } from "react";
import { Phone, Clock, Globe } from "lucide-react";
import { getRecentCalls, type CallLog } from "@/lib/api";

const outcomeColors: Record<string, string> = {
  appointment_booked: "bg-green-100 text-green-700",
  callback_requested: "bg-yellow-100 text-yellow-700",
  info_provided: "bg-blue-100 text-blue-700",
  no_availability: "bg-orange-100 text-orange-700",
  customer_declined: "bg-gray-100 text-gray-700",
  dropped: "bg-red-100 text-red-700",
  transferred: "bg-purple-100 text-purple-700",
};

const outcomeLabels: Record<string, string> = {
  appointment_booked: "Booked",
  callback_requested: "Callback",
  info_provided: "Info Only",
  no_availability: "No Slots",
  customer_declined: "Declined",
  dropped: "Dropped",
  transferred: "Transferred",
};

const langLabels: Record<string, string> = {
  en: "English",
  pt: "Portuguese",
  es: "Spanish",
};

export default function CallsPage() {
  const [calls, setCalls] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecentCalls(50)
      .then(setCalls)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "—";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Call History</h1>
      <p className="mt-1 text-gray-500">All incoming calls handled by the AI agent</p>

      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-600">Date</th>
              <th className="px-4 py-3 font-medium text-gray-600">Caller</th>
              <th className="px-4 py-3 font-medium text-gray-600">Duration</th>
              <th className="px-4 py-3 font-medium text-gray-600">Language</th>
              <th className="px-4 py-3 font-medium text-gray-600">Outcome</th>
              <th className="px-4 py-3 font-medium text-gray-600">Summary</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">Loading...</td>
              </tr>
            ) : calls.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  No calls recorded yet. Calls will appear here once the AI agent starts handling phone calls.
                </td>
              </tr>
            ) : (
              calls.map((call) => (
                <tr key={call.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-3">
                    {new Date(call.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-gray-400" />
                      {call.caller_phone ?? "Unknown"}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-gray-400" />
                      {formatDuration(call.duration_seconds)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Globe className="h-3.5 w-3.5 text-gray-400" />
                      {langLabels[call.language_detected ?? ""] ?? call.language_detected ?? "—"}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {call.outcome ? (
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${outcomeColors[call.outcome] ?? ""}`}>
                        {outcomeLabels[call.outcome] ?? call.outcome}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="max-w-[300px] truncate px-4 py-3 text-gray-600">
                    {call.summary ?? "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
