"use client";

import { useEffect, useState } from "react";
import { Phone, Clock, Globe, ChevronDown, ChevronUp } from "lucide-react";
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

function TranscriptLine({ line }: { line: string }) {
  const isCustomer = line.startsWith("Customer:");
  const isAgent = line.startsWith("Agent:");

  if (isCustomer) {
    return (
      <p className="py-0.5">
        <span className="font-medium text-blue-600">Customer:</span>
        <span className="text-gray-700">{line.slice("Customer:".length)}</span>
      </p>
    );
  }
  if (isAgent) {
    return (
      <p className="py-0.5">
        <span className="font-medium text-gray-500">Agent:</span>
        <span className="text-gray-700">{line.slice("Agent:".length)}</span>
      </p>
    );
  }
  return <p className="py-0.5 text-gray-700">{line}</p>;
}

export default function CallsPage() {
  const [calls, setCalls] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    getRecentCalls(50)
      .then(setCalls)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "\u2014";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Call History</h1>
      <p className="mt-1 text-gray-500">All incoming calls handled by the AI agent</p>

      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-[700px] w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-600">Date</th>
              <th className="px-4 py-3 font-medium text-gray-600">Caller</th>
              <th className="px-4 py-3 font-medium text-gray-600">Duration</th>
              <th className="px-4 py-3 font-medium text-gray-600">Language</th>
              <th className="px-4 py-3 font-medium text-gray-600">Outcome</th>
              <th className="px-4 py-3 font-medium text-gray-600">Summary</th>
              <th className="w-10 px-2 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">Loading...</td>
              </tr>
            ) : calls.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  No calls recorded yet. Calls will appear here once the AI agent starts handling phone calls.
                </td>
              </tr>
            ) : (
              calls.map((call) => {
                const isExpanded = expandedId === call.id;
                return (
                  <tr key={call.id} className="group">
                    <td colSpan={7} className="p-0">
                      <div
                        className="flex cursor-pointer items-center hover:bg-gray-50"
                        onClick={() => toggleExpand(call.id)}
                      >
                        <div className="whitespace-nowrap px-4 py-3 flex-shrink-0" style={{ width: "140px" }}>
                          {new Date(call.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </div>
                        <div className="px-4 py-3 flex-shrink-0" style={{ width: "140px" }}>
                          <div className="flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5 text-gray-400" />
                            {call.caller_phone ?? "Unknown"}
                          </div>
                        </div>
                        <div className="px-4 py-3 flex-shrink-0" style={{ width: "90px" }}>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-gray-400" />
                            {formatDuration(call.duration_seconds)}
                          </div>
                        </div>
                        <div className="px-4 py-3 flex-shrink-0" style={{ width: "110px" }}>
                          <div className="flex items-center gap-1">
                            <Globe className="h-3.5 w-3.5 text-gray-400" />
                            {langLabels[call.language_detected ?? ""] ?? call.language_detected ?? "\u2014"}
                          </div>
                        </div>
                        <div className="px-4 py-3 flex-shrink-0" style={{ width: "140px" }}>
                          <div className="flex flex-wrap items-center gap-1">
                            {call.outcome ? (
                              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${outcomeColors[call.outcome] ?? ""}`}>
                                {outcomeLabels[call.outcome] ?? call.outcome}
                              </span>
                            ) : (
                              "\u2014"
                            )}
                            {call.duration_seconds != null && call.duration_seconds < 30 && (
                              <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
                                Short
                              </span>
                            )}
                            {call.outcome === "dropped" && (
                              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                                Review
                              </span>
                            )}
                            {call.outcome === "callback_requested" && (
                              <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
                                Callback
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="min-w-0 flex-1 px-4 py-3 text-gray-600 truncate">
                          {call.summary ?? "\u2014"}
                        </div>
                        <div className="px-2 py-3 flex-shrink-0">
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-gray-400" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium text-gray-700">Transcript</h4>
                            <span className="text-xs text-gray-400">Transcript expires after 15 days</span>
                          </div>
                          {call.transcript ? (
                            <div className="max-h-80 overflow-y-auto rounded-md bg-white border border-gray-200 p-4 text-sm leading-relaxed">
                              {call.transcript.split("\n").map((line, i) => (
                                <TranscriptLine key={i} line={line} />
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-400 italic">No transcript available</p>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
