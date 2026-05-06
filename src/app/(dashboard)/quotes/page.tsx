"use client";

import { useEffect, useState } from "react";
import { FileText, DollarSign, Clock, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { getQuotes, getQuoteStats, type Quote, type QuoteStats } from "@/lib/api";

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  sent: "bg-blue-100 text-blue-700",
  approved: "bg-green-100 text-green-700",
  completed: "bg-emerald-100 text-emerald-700",
  declined: "bg-red-100 text-red-700",
  expired: "bg-amber-100 text-amber-700",
};

const TIER_LABELS = { good: "Good", better: "Better", best: "Best" } as const;

function formatDate(d: string | null | undefined) {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function money(n: number | null | undefined) {
  if (n === null || n === undefined) return "-";
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[] | null>(null);
  const [stats, setStats] = useState<QuoteStats | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getQuotes(statusFilter || undefined),
      getQuoteStats(),
    ])
      .then(([q, s]) => {
        setQuotes(q);
        setStats(s);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [statusFilter]);

  return (
    <div>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Quotes</h1>
        <p className="mt-1 text-gray-500">
          Service estimates linking appointments, technicians, customers, and pricebook items.
        </p>
      </div>

      {/* Stats cards */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2 text-gray-500">
            <FileText className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Total</span>
          </div>
          <p className="mt-2 text-2xl font-bold">{stats?.total ?? "-"}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2 text-gray-500">
            <Clock className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Pending</span>
          </div>
          <p className="mt-2 text-2xl font-bold">
            {stats ? (stats.by_status.draft || 0) + (stats.by_status.sent || 0) : "-"}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2 text-gray-500">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Approved revenue</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-600">{stats ? money(stats.revenue_approved) : "-"}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2 text-gray-500">
            <DollarSign className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Pipeline (better tier)</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-blue-600">{stats ? money(stats.pipeline_value) : "-"}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="mt-6 flex items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent to customer</option>
          <option value="approved">Approved</option>
          <option value="completed">Completed</option>
          <option value="declined">Declined</option>
        </select>
        <span className="text-sm text-gray-500">
          {loading ? "Loading..." : `${quotes?.length ?? 0} quotes`}
        </span>
      </div>

      {/* Quotes list */}
      <div className="mt-4 space-y-3">
        {loading && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-400">
            Loading quotes...
          </div>
        )}
        {!loading && quotes?.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <FileText className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-3 text-gray-600 font-medium">No quotes yet</p>
            <p className="mt-1 text-sm text-gray-500">
              Quotes are created by technicians during a service visit, linking pricebook items to an appointment.
            </p>
          </div>
        )}
        {quotes?.map((q) => {
          const expanded = expandedId === q.id;
          const statusStyle = STATUS_STYLES[q.status] || "bg-gray-100 text-gray-700";
          return (
            <div key={q.id} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
              <button
                onClick={() => setExpandedId(expanded ? null : q.id)}
                className="w-full p-4 flex items-start gap-3 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-900 truncate">{q.diagnosis}</h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide ${statusStyle}`}>
                      {q.status}
                    </span>
                    {q.selected_tier && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide bg-purple-100 text-purple-700">
                        {TIER_LABELS[q.selected_tier]}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-sm text-gray-600 flex flex-wrap gap-x-4 gap-y-1">
                    <span><span className="text-gray-400">Customer:</span> {q.customer?.name || "-"}</span>
                    <span><span className="text-gray-400">Tech:</span> {q.technician?.name || "-"}</span>
                    <span><span className="text-gray-400">Created:</span> {formatDate(q.created_at)}</span>
                    {q.appointment && (
                      <span><span className="text-gray-400">Visit:</span> {formatDate(q.appointment.scheduled_date)}</span>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-bold text-gray-900">
                    {q.total_amount ? money(q.total_amount) : money(q.totals.better)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {q.total_amount ? "approved" : `Better: ${money(q.totals.better)}`}
                  </p>
                </div>
                {expanded ? <ChevronUp className="h-5 w-5 text-gray-400 shrink-0" /> : <ChevronDown className="h-5 w-5 text-gray-400 shrink-0" />}
              </button>

              {expanded && (
                <div className="border-t border-gray-100 bg-gray-50 p-4 space-y-4">
                  {/* Linked entities */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Customer</p>
                      <p className="font-semibold">{q.customer?.name || "-"}</p>
                      {q.customer && <p className="text-xs text-gray-500 mt-0.5">{q.customer.phone}</p>}
                      {q.customer && <p className="text-xs text-gray-500">{q.customer.address}</p>}
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Technician</p>
                      <p className="font-semibold">{q.technician?.name || "-"}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Linked appointment</p>
                      {q.appointment ? (
                        <>
                          <p className="font-semibold text-xs">{q.appointment.problem_description}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{formatDate(q.appointment.scheduled_date)} · <span className="capitalize">{q.appointment.status.toLowerCase()}</span></p>
                        </>
                      ) : (
                        <p className="text-sm text-gray-400">No appointment linked</p>
                      )}
                    </div>
                  </div>

                  {/* Line items */}
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Line items (from pricebook)</p>
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                          <tr>
                            <th className="text-left px-3 py-2">Item</th>
                            <th className="text-right px-3 py-2">Qty</th>
                            <th className="text-right px-3 py-2">Good</th>
                            <th className="text-right px-3 py-2">Better</th>
                            <th className="text-right px-3 py-2">Best</th>
                          </tr>
                        </thead>
                        <tbody>
                          {q.line_items.map((item) => (
                            <tr key={item.id} className="border-t border-gray-100">
                              <td className="px-3 py-2">
                                <p className="font-medium">{item.name}</p>
                                {item.description && <p className="text-xs text-gray-500">{item.description}</p>}
                              </td>
                              <td className="px-3 py-2 text-right">{item.quantity}</td>
                              <td className="px-3 py-2 text-right text-gray-600">{money(item.price_good * item.quantity)}</td>
                              <td className="px-3 py-2 text-right text-blue-700 font-semibold">{money(item.price_better * item.quantity)}</td>
                              <td className="px-3 py-2 text-right text-purple-700 font-semibold">{money(item.price_best * item.quantity)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-50 text-sm">
                          <tr className="border-t border-gray-200">
                            <td className="px-3 py-2 font-bold uppercase text-xs tracking-wide">Total</td>
                            <td></td>
                            <td className="px-3 py-2 text-right font-bold">{money(q.totals.good)}</td>
                            <td className="px-3 py-2 text-right font-bold text-blue-700">{money(q.totals.better)}</td>
                            <td className="px-3 py-2 text-right font-bold text-purple-700">{money(q.totals.best)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  {q.diagnosis_notes && (
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Diagnostic notes</p>
                      <p className="text-sm text-gray-700">{q.diagnosis_notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
