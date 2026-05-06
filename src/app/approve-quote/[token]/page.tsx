"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { CheckCircle2, Phone, Wrench, Loader2, Printer } from "lucide-react";
import { getPublicQuote, approvePublicQuote, type PublicQuote } from "@/lib/api";

function money(n: number | null | undefined) {
  if (n === null || n === undefined) return "-";
  return `$${Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const TIER_INFO = {
  good: { label: "Good", desc: "Standard option — gets the job done.", color: "#6B7280" },
  better: { label: "Better", desc: "Upgraded parts and longer warranty.", color: "#3B82F6" },
  best: { label: "Best", desc: "Premium parts, longest warranty, top performance.", color: "#7C3FFF" },
} as const;

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function ApproveQuotePage() {
  const params = useParams<{ token: string }>();
  const searchParams = useSearchParams();
  const isPreview = searchParams.get("preview") === "1";
  const token = params.token;

  const [quote, setQuote] = useState<PublicQuote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<"good" | "better" | "best" | null>(null);
  const [approving, setApproving] = useState(false);
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    if (!token) return;
    getPublicQuote(token)
      .then((q) => {
        setQuote(q);
        // Default-select the recommended tier
        if (q.selected_tier) {
          setSelectedTier(q.selected_tier);
          if (q.status === "approved" || q.status === "completed") setApproved(true);
        } else {
          setSelectedTier("better"); // default fallback
        }
      })
      .catch(() => setError("Quote not found or no longer available."))
      .finally(() => setLoading(false));
  }, [token]);

  async function handleApprove() {
    if (!selectedTier || !token) return;
    setApproving(true);
    try {
      await approvePublicQuote(token, selectedTier);
      setApproved(true);
    } catch {
      alert("Could not approve quote. Please try again or call the company.");
    } finally {
      setApproving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">Quote not found</p>
          <p className="text-sm text-gray-500 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  const primary = quote.company.brand_primary_color || "#1E72BD";
  const accent = quote.company.brand_accent_color || "#F47621";
  const taxPct = quote.tax_rate ? (quote.tax_rate * 100).toFixed(quote.tax_rate < 0.1 ? 2 : 1) : "0";

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          @page { margin: 1cm; size: letter; }
          .quote-print { padding: 0 !important; }
        }
        .print-only { display: none; }
        @media print { .print-only { display: block !important; } }
      `}</style>

      {/* Preview banner — only for tech */}
      {isPreview && (
        <div className="no-print bg-amber-100 border-b border-amber-300 px-4 py-3 flex items-center justify-between gap-3 sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest bg-amber-500 text-white px-2 py-0.5 rounded">Preview</span>
            <span className="text-sm text-amber-900">This is what your customer will see. Use Cmd/Ctrl+P to save as PDF.</span>
          </div>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-sm font-semibold text-amber-900 hover:bg-amber-50"
          >
            <Printer className="h-4 w-4" />
            Print / Save as PDF
          </button>
        </div>
      )}

      {/* Header with company branding */}
      <header
        className="text-white px-6 py-8 sm:py-12 print:py-6"
        style={{ background: `linear-gradient(135deg, ${primary} 0%, ${accent} 100%)` }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest opacity-80">Service Estimate</p>
              <h1 className="mt-2 text-3xl sm:text-4xl font-black leading-tight">{quote.company.name}</h1>
              {quote.company.tagline && (
                <p className="mt-2 text-base sm:text-lg opacity-90">{quote.company.tagline}</p>
              )}
            </div>
            <div className="text-right text-xs opacity-80 print-only">
              <p>{new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
              {quote.company.phone && <p className="mt-1">{quote.company.phone}</p>}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 -mt-6 quote-print pb-20">
        {/* Hero card with greeting */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 mb-6 print:shadow-none print:border-gray-300">
          {quote.customer && (
            <p className="text-sm text-gray-500">Hi {quote.customer.name},</p>
          )}
          <h2 className="mt-1 text-xl sm:text-2xl font-bold text-gray-900">
            Your service estimate is ready.
          </h2>
          <p className="mt-3 text-gray-600">
            We've prepared three options for you to choose from. Each tier reflects different parts, warranties, and quality levels. Pick the one that works best for you.
          </p>

          {/* Diagnosis */}
          <div className="mt-5 p-4 rounded-xl bg-gray-50 border border-gray-200">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">Diagnosis</p>
            <p className="font-semibold text-gray-900">{quote.diagnosis}</p>
            {quote.diagnosis_notes && (
              <p className="text-sm text-gray-600 mt-2">{quote.diagnosis_notes}</p>
            )}
          </div>

          {/* Service info row */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quote.technician && (
              <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200">
                <Wrench className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Your technician</p>
                  <p className="font-semibold text-sm text-gray-900">{quote.technician.name}</p>
                </div>
              </div>
            )}
            {quote.company.phone && (
              <a href={`tel:${quote.company.phone}`} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                <Phone className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Questions? Call us</p>
                  <p className="font-semibold text-sm text-gray-900">{quote.company.phone}</p>
                </div>
              </a>
            )}
          </div>
        </div>

        {/* Approved state */}
        {approved && quote.selected_tier && !isPreview && (
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 sm:p-8 mb-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto" />
            <h3 className="mt-3 text-2xl font-bold text-green-900">You're all set!</h3>
            <p className="mt-2 text-green-700">
              You approved the <span className="font-bold uppercase">{quote.selected_tier}</span> option for{" "}
              <span className="font-bold">{money(quote.total_amount)}</span>.
            </p>
            <p className="mt-3 text-sm text-green-700">
              {quote.company.name} will be in touch shortly to schedule the work.
            </p>
          </div>
        )}

        {/* Tier selection */}
        {(!approved || isPreview) && (
          <>
            <div className="space-y-3 mb-6">
              {(["good", "better", "best"] as const).map((tier) => {
                const info = TIER_INFO[tier];
                const subtotal = quote.subtotals[tier];
                const tax = quote.tax[tier];
                const total = quote.totals[tier];
                const isSelected = selectedTier === tier;
                const isRecommended = quote.selected_tier === tier;
                return (
                  <button
                    key={tier}
                    onClick={() => !isPreview && setSelectedTier(tier)}
                    disabled={isPreview}
                    className={`w-full text-left rounded-2xl border-2 p-5 transition-all relative ${
                      isSelected ? "shadow-lg" : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                    style={isSelected ? { borderColor: info.color, background: `${info.color}08` } : {}}
                  >
                    {isRecommended && (
                      <span className="absolute -top-3 left-5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full text-white" style={{ background: info.color }}>
                        ★ Recommended
                      </span>
                    )}
                    <div className="flex items-start gap-4">
                      <div
                        className="h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5"
                        style={{ borderColor: isSelected ? info.color : "#D1D5DB", background: isSelected ? info.color : "white" }}
                      >
                        {isSelected && <CheckIcon className="h-3.5 w-3.5 text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-2 flex-wrap">
                          <h4 className="text-xl font-black uppercase" style={{ color: info.color }}>
                            {info.label}
                          </h4>
                          <p className="text-2xl font-black text-gray-900">{money(total)}</p>
                        </div>
                        <p className="text-sm text-gray-600 mt-0.5">{info.desc}</p>
                        {Number(quote.tax_rate) > 0 && (
                          <p className="text-xs text-gray-400 mt-1">
                            ({money(subtotal)} subtotal + {money(tax)} tax @ {taxPct}%)
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Line items detail */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6 print:shadow-none">
              <div className="p-5 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">What's included</h3>
                <p className="text-sm text-gray-500 mt-0.5">Same scope of work, different quality tiers.</p>
              </div>
              <div className="divide-y divide-gray-100">
                {quote.line_items.map((item, idx) => (
                  <div key={idx} className="p-5">
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        {item.description && <p className="text-sm text-gray-600 mt-0.5">{item.description}</p>}
                        {item.quantity > 1 && <p className="text-xs text-gray-500 mt-1">Quantity: {item.quantity}</p>}
                      </div>
                      <div className="text-right text-sm shrink-0">
                        {selectedTier && (
                          <p className="font-bold text-lg text-gray-900">
                            {money(item[`price_${selectedTier}`] * item.quantity)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tax breakdown for selected tier */}
              {selectedTier && (
                <div className="bg-gray-50 p-5 border-t border-gray-200">
                  <div className="flex justify-between text-sm text-gray-700 mb-1">
                    <span>Subtotal</span>
                    <span>{money(quote.subtotals[selectedTier])}</span>
                  </div>
                  {Number(quote.tax_rate) > 0 && (
                    <div className="flex justify-between text-sm text-gray-700 mb-2">
                      <span>Sales tax ({taxPct}%)</span>
                      <span>{money(quote.tax[selectedTier])}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-black pt-2 border-t border-gray-300" style={{ color: TIER_INFO[selectedTier].color }}>
                    <span>Total</span>
                    <span>{money(quote.totals[selectedTier])}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Sticky approve button */}
            {!isPreview && (
              <div className="sticky bottom-4 sm:bottom-6 no-print">
                <button
                  onClick={handleApprove}
                  disabled={!selectedTier || approving}
                  className="w-full py-5 rounded-2xl font-black text-white text-lg shadow-2xl transition-all disabled:opacity-50 disabled:shadow-none"
                  style={{ background: selectedTier ? TIER_INFO[selectedTier].color : "#9CA3AF" }}
                >
                  {approving ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Approving...
                    </span>
                  ) : selectedTier ? (
                    `Approve ${TIER_INFO[selectedTier].label} option · ${money(quote.totals[selectedTier])}`
                  ) : (
                    "Choose an option to continue"
                  )}
                </button>
                <p className="text-xs text-center text-gray-500 mt-3">
                  By approving, you authorize {quote.company.name} to perform the selected service. You'll be billed after the work is complete.
                </p>
              </div>
            )}

            {/* Print signature line */}
            <div className="print-only mt-12 pt-6 border-t border-gray-300">
              <div className="grid grid-cols-2 gap-12">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-8">Customer signature</p>
                  <div className="border-b border-gray-400 h-1"></div>
                  <p className="text-xs text-gray-500 mt-2">Date: ___________________</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-8">Technician signature</p>
                  <div className="border-b border-gray-400 h-1"></div>
                  <p className="text-xs text-gray-500 mt-2">{quote.technician?.name || ""}</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="text-center mt-12 pb-6 text-xs text-gray-400 no-print">
          Powered by <a href="https://ringa.live" className="hover:underline">Ringa</a>
        </div>
      </main>
    </div>
  );
}
