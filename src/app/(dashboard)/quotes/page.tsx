"use client";

import { useEffect, useMemo, useState } from "react";
import { FileText, DollarSign, Clock, CheckCircle2, ChevronDown, ChevronUp, Plus, Send, Copy, ExternalLink, X, Trash2, Check } from "lucide-react";
import {
  getQuotes, getQuoteStats, createQuote, sendQuote,
  getCustomers, getPricebookCategories, getPricebookItems, getTechnicians,
  type Quote, type QuoteStats, type PricebookCategory, type PricebookItem, type CustomerInfo, type Technician,
} from "@/lib/api";

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

interface DraftLineItem {
  pricebook_item_id: string;
  name: string;
  price_good: number;
  price_better: number;
  price_best: number;
  quantity: number;
}

function NewQuoteModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [step, setStep] = useState<"customer" | "items" | "review">("customer");
  const [customers, setCustomers] = useState<CustomerInfo[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [categories, setCategories] = useState<PricebookCategory[]>([]);
  const [items, setItems] = useState<PricebookItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [selectedTech, setSelectedTech] = useState<string>("");
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [draftItems, setDraftItems] = useState<DraftLineItem[]>([]);
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      getCustomers(1, ""),
      getTechnicians(),
      getPricebookCategories(),
      getPricebookItems(),
    ]).then(([cs, ts, cats, its]) => {
      setCustomers(cs.items || []);
      setTechnicians(ts);
      setCategories(cats);
      setItems(its);
      if (ts.length > 0) setSelectedTech(ts[0].id);
    }).catch(console.error);
  }, []);

  const filteredItems = useMemo(() => {
    if (!search) return items;
    const s = search.toLowerCase();
    return items.filter(i => i.name.toLowerCase().includes(s) || (i.description || "").toLowerCase().includes(s));
  }, [items, search]);

  const itemsByCategory = useMemo(() => {
    const map: Record<string, PricebookItem[]> = {};
    filteredItems.forEach(item => {
      if (!map[item.category_id]) map[item.category_id] = [];
      map[item.category_id].push(item);
    });
    return map;
  }, [filteredItems]);

  const totals = useMemo(() => ({
    good: draftItems.reduce((sum, i) => sum + i.price_good * i.quantity, 0),
    better: draftItems.reduce((sum, i) => sum + i.price_better * i.quantity, 0),
    best: draftItems.reduce((sum, i) => sum + i.price_best * i.quantity, 0),
  }), [draftItems]);

  function addItem(item: PricebookItem) {
    const existing = draftItems.find(d => d.pricebook_item_id === item.id);
    if (existing) {
      setDraftItems(d => d.map(x => x.pricebook_item_id === item.id ? { ...x, quantity: x.quantity + 1 } : x));
    } else {
      setDraftItems(d => [...d, {
        pricebook_item_id: item.id,
        name: item.name,
        price_good: item.price_good,
        price_better: item.price_better,
        price_best: item.price_best,
        quantity: 1,
      }]);
    }
  }

  function removeItem(id: string) {
    setDraftItems(d => d.filter(x => x.pricebook_item_id !== id));
  }

  function updateQty(id: string, qty: number) {
    if (qty < 1) return;
    setDraftItems(d => d.map(x => x.pricebook_item_id === id ? { ...x, quantity: qty } : x));
  }

  async function submit() {
    if (!selectedCustomer || !diagnosis || draftItems.length === 0) return;
    setSubmitting(true);
    try {
      await createQuote({
        customer_id: selectedCustomer,
        technician_id: selectedTech || undefined,
        diagnosis,
        diagnosis_notes: notes || undefined,
        line_items: draftItems.map(d => ({
          pricebook_item_id: d.pricebook_item_id,
          quantity: d.quantity,
        })),
      });
      onCreated();
      onClose();
    } catch (e) {
      console.error(e);
      alert("Failed to create quote. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center bg-black/50 p-0 sm:p-4">
      <div className="bg-white w-full max-w-3xl sm:rounded-2xl sm:max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">New Quote</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Step {step === "customer" ? "1" : step === "items" ? "2" : "3"} of 3 ·{" "}
              {step === "customer" ? "Customer & diagnosis" : step === "items" ? "Pick services from pricebook" : "Review & save"}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress dots */}
        <div className="px-6 py-3 flex items-center gap-2 border-b border-gray-100">
          {(["customer", "items", "review"] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`h-2 flex-1 rounded-full ${
                step === s || (step === "items" && i < 1) || (step === "review" && i < 2)
                  ? "bg-blue-500"
                  : "bg-gray-200"
              }`} />
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === "customer" && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Customer</label>
                <select
                  value={selectedCustomer}
                  onChange={e => setSelectedCustomer(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                >
                  <option value="">Select a customer...</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name} — {c.phone}</option>
                  ))}
                </select>
              </div>

              {technicians.length > 1 && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Technician</label>
                  <select
                    value={selectedTech}
                    onChange={e => setSelectedTech(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                  >
                    {technicians.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700">Diagnosis</label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={e => setDiagnosis(e.target.value)}
                  placeholder="e.g., Capacitor failed, refrigerant low, blower motor"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Notes <span className="text-gray-400 font-normal">(optional)</span></label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Anything else the customer should know..."
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                />
              </div>
            </div>
          )}

          {step === "items" && (
            <div>
              <div className="flex items-center gap-3 mb-4 sticky top-0 bg-white pb-2">
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search pricebook..."
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                />
                <span className="text-sm text-gray-500 whitespace-nowrap">
                  {draftItems.length} {draftItems.length === 1 ? "item" : "items"}
                </span>
              </div>

              {categories.map(cat => {
                const catItems = itemsByCategory[cat.id] || [];
                if (catItems.length === 0) return null;
                return (
                  <div key={cat.id} className="mb-4">
                    <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">{cat.name}</h3>
                    <div className="space-y-2">
                      {catItems.map(item => {
                        const isAdded = draftItems.some(d => d.pricebook_item_id === item.id);
                        return (
                          <button
                            key={item.id}
                            onClick={() => addItem(item)}
                            className={`w-full text-left p-3 rounded-lg border transition ${
                              isAdded ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:border-blue-400"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm">{item.name}</p>
                                {item.description && <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>}
                              </div>
                              <div className="text-right text-xs text-gray-600 shrink-0">
                                <span className="font-medium">{money(item.price_good)}</span>
                                <span className="mx-1">·</span>
                                <span className="font-medium text-blue-600">{money(item.price_better)}</span>
                                <span className="mx-1">·</span>
                                <span className="font-medium text-purple-600">{money(item.price_best)}</span>
                              </div>
                              {isAdded && <Check className="h-4 w-4 text-blue-600 shrink-0" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {step === "review" && (
            <div>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Customer</p>
                <p className="font-semibold">{customers.find(c => c.id === selectedCustomer)?.name}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Diagnosis</p>
                <p className="font-semibold">{diagnosis}</p>
                {notes && <p className="text-sm text-gray-600 mt-1">{notes}</p>}
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="text-left p-2">Item</th>
                      <th className="text-center p-2">Qty</th>
                      <th className="text-right p-2">Good</th>
                      <th className="text-right p-2">Better</th>
                      <th className="text-right p-2">Best</th>
                      <th className="w-8"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {draftItems.map(item => (
                      <tr key={item.pricebook_item_id} className="border-t border-gray-100">
                        <td className="p-2 font-medium">{item.name}</td>
                        <td className="p-2 text-center">
                          <input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={e => updateQty(item.pricebook_item_id, Number(e.target.value))}
                            className="w-14 text-center rounded border border-gray-300 px-1 py-0.5 text-sm"
                          />
                        </td>
                        <td className="p-2 text-right text-gray-600">{money(item.price_good * item.quantity)}</td>
                        <td className="p-2 text-right text-blue-700 font-semibold">{money(item.price_better * item.quantity)}</td>
                        <td className="p-2 text-right text-purple-700 font-semibold">{money(item.price_best * item.quantity)}</td>
                        <td className="p-2 text-right">
                          <button onClick={() => removeItem(item.pricebook_item_id)} className="text-gray-400 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td className="p-2 font-bold uppercase text-xs tracking-wide" colSpan={2}>Total</td>
                      <td className="p-2 text-right font-bold">{money(totals.good)}</td>
                      <td className="p-2 text-right font-bold text-blue-700">{money(totals.better)}</td>
                      <td className="p-2 text-right font-bold text-purple-700">{money(totals.best)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                The quote will be saved as <span className="font-bold">draft</span>. You can review and click <span className="font-bold">Send to customer</span> to deliver via SMS.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between gap-3">
          {step !== "customer" ? (
            <button
              onClick={() => setStep(step === "review" ? "items" : "customer")}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              ← Back
            </button>
          ) : <div />}

          {step === "customer" && (
            <button
              onClick={() => setStep("items")}
              disabled={!selectedCustomer || !diagnosis}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold disabled:opacity-50 hover:bg-blue-700"
            >
              Next →
            </button>
          )}

          {step === "items" && (
            <button
              onClick={() => setStep("review")}
              disabled={draftItems.length === 0}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold disabled:opacity-50 hover:bg-blue-700"
            >
              Review →
            </button>
          )}

          {step === "review" && (
            <button
              onClick={submit}
              disabled={submitting}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold disabled:opacity-50 hover:bg-blue-700"
            >
              {submitting ? "Saving..." : "Save quote"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function QuoteActions({ quote, onUpdated }: { quote: Quote; onUpdated: () => void }) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const customerUrl = typeof window !== "undefined"
    ? `${window.location.origin}/approve-quote/${quote.id}` // placeholder; we use customer_token via send response
    : "";

  async function handleSend() {
    setSending(true);
    try {
      const res = await sendQuote(quote.id);
      navigator.clipboard.writeText(res.approval_url).catch(() => {});
      setSent(true);
      onUpdated();
      setTimeout(() => setSent(false), 3000);
    } catch (e) {
      console.error(e);
      alert("Failed to send quote.");
    } finally {
      setSending(false);
    }
  }

  if (quote.status === "approved" || quote.status === "completed") {
    return (
      <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 px-3 py-1.5 rounded-lg">
        <CheckCircle2 className="h-4 w-4" />
        Customer approved <span className="font-bold">{quote.selected_tier}</span> tier
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {quote.status === "draft" && (
        <button
          onClick={handleSend}
          disabled={sending}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg font-medium text-xs hover:bg-blue-700 disabled:opacity-50"
        >
          <Send className="h-3.5 w-3.5" />
          {sending ? "Sending..." : "Send to customer (SMS + link)"}
        </button>
      )}
      {quote.status === "sent" && (
        <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg font-medium text-xs">
          <Send className="h-3.5 w-3.5" />
          Sent · waiting on customer approval
        </span>
      )}
      {sent && (
        <span className="inline-flex items-center gap-1 text-xs text-green-700 font-medium">
          <CheckCircle2 className="h-3.5 w-3.5" /> SMS sent · link copied
        </span>
      )}
    </div>
  );
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[] | null>(null);
  const [stats, setStats] = useState<QuoteStats | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);

  function reload() {
    setLoading(true);
    Promise.all([
      getQuotes(statusFilter || undefined),
      getQuoteStats(),
    ])
      .then(([q, s]) => { setQuotes(q); setStats(s); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  useEffect(() => { reload(); /* eslint-disable-next-line */ }, [statusFilter]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Quotes</h1>
          <p className="mt-1 text-gray-500">
            Service estimates linking appointments, customers, and pricebook items.
          </p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          New quote
        </button>
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
            <span className="text-xs font-medium uppercase tracking-wide">Pipeline (better)</span>
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

      {/* List */}
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
              Click <span className="font-semibold">New quote</span> to create one from your pricebook.
            </p>
          </div>
        )}
        {quotes?.map((q) => {
          const expanded = expandedId === q.id;
          const statusStyle = STATUS_STYLES[q.status] || "bg-gray-100 text-gray-700";
          return (
            <div key={q.id} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
              <div className="p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => setExpandedId(expanded ? null : q.id)}
                    className="flex-1 text-left min-w-0"
                  >
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
                    </div>
                  </button>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold text-gray-900">
                      {q.total_amount ? money(q.total_amount) : money(q.totals.better)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {q.total_amount ? "approved" : `Better: ${money(q.totals.better)}`}
                    </p>
                  </div>
                  <button
                    onClick={() => setExpandedId(expanded ? null : q.id)}
                    className="text-gray-400 shrink-0"
                  >
                    {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>
                </div>

                {/* Actions row */}
                <div className="mt-3">
                  <QuoteActions quote={q} onUpdated={reload} />
                </div>
              </div>

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

      {showNewModal && (
        <NewQuoteModal
          onClose={() => setShowNewModal(false)}
          onCreated={reload}
        />
      )}
    </div>
  );
}
