"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  Plus,
  Trash2,
  Send,
  X,
  ChevronDown,
  ChevronUp,
  Wrench,
  ClipboardList,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const API_BASE = "/api";

interface QuoteData {
  company_name: string;
  customer: { name: string; phone: string; address: string };
  appointment: { id: string; problem_description: string };
  line_items: LineItem[];
  pricebook: { categories: Category[]; items: PricebookItem[] };
}

interface LineItem {
  id: string;
  name: string;
  description?: string;
  price_good: number;
  price_better: number;
  price_best: number;
}

interface Category {
  id: string;
  name: string;
}

interface PricebookItem {
  id: string;
  category_id: string;
  name: string;
  description?: string;
  price_good: number;
  price_better: number;
  price_best: number;
}

export default function TechQuotePage() {
  const params = useParams();
  const techToken = params.token as string;

  const [data, setData] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPricebook, setShowPricebook] = useState(false);
  const [showCustomItem, setShowCustomItem] = useState(false);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [diagnosisNotes, setDiagnosisNotes] = useState("");
  const [customItem, setCustomItem] = useState({ name: "", price_good: 0, price_better: 0, price_best: 0 });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [confirmSend, setConfirmSend] = useState(false);
  const [addingItem, setAddingItem] = useState(false);

  const loadQuote = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/tech-portal/quote/${techToken}`);
      if (!res.ok) throw new Error("Failed to load quote data");
      const d: QuoteData = await res.json();
      setData(d);
      setDiagnosis(d.appointment.problem_description || "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [techToken]);

  useEffect(() => {
    loadQuote();
  }, [loadQuote]);

  const addFromPricebook = async (item: PricebookItem) => {
    setAddingItem(true);
    try {
      const res = await fetch(`${API_BASE}/tech-portal/quote/${techToken}/line-items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pricebook_item_id: item.id,
          name: item.name,
          description: item.description,
          price_good: item.price_good,
          price_better: item.price_better,
          price_best: item.price_best,
        }),
      });
      if (!res.ok) throw new Error("Failed to add item");
      await loadQuote();
    } catch (e) {
      console.error(e);
    }
    setAddingItem(false);
  };

  const addCustom = async () => {
    if (!customItem.name.trim()) return;
    setAddingItem(true);
    try {
      const res = await fetch(`${API_BASE}/tech-portal/quote/${techToken}/line-items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customItem),
      });
      if (!res.ok) throw new Error("Failed to add item");
      setCustomItem({ name: "", price_good: 0, price_better: 0, price_best: 0 });
      setShowCustomItem(false);
      await loadQuote();
    } catch (e) {
      console.error(e);
    }
    setAddingItem(false);
  };

  const removeItem = async (itemId: string) => {
    try {
      const res = await fetch(`${API_BASE}/tech-portal/quote/${techToken}/line-items/${itemId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to remove item");
      await loadQuote();
    } catch (e) {
      console.error(e);
    }
  };

  const sendQuote = async () => {
    setSending(true);
    try {
      const res = await fetch(`${API_BASE}/tech-portal/quote/${techToken}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diagnosis, diagnosis_notes: diagnosisNotes }),
      });
      if (!res.ok) throw new Error("Failed to send quote");
      setSent(true);
      setConfirmSend(false);
    } catch (e) {
      console.error(e);
    }
    setSending(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
        <AlertCircle className="h-12 w-12 text-red-400" />
        <p className="mt-3 text-gray-600">{error || "Quote not found"}</p>
      </div>
    );
  }

  if (sent) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
        <CheckCircle className="h-16 w-16 text-green-500" />
        <h2 className="mt-4 text-xl font-bold text-gray-800">Quote Sent!</h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          The customer will receive the quote via SMS and can approve it online.
        </p>
      </div>
    );
  }

  const lineItems = data.line_items || [];
  const totalGood = lineItems.reduce((s, i) => s + i.price_good, 0);
  const totalBetter = lineItems.reduce((s, i) => s + i.price_better, 0);
  const totalBest = lineItems.reduce((s, i) => s + i.price_best, 0);
  const groupedItems: Record<string, PricebookItem[]> = {};
  for (const item of data.pricebook.items) {
    if (!groupedItems[item.category_id]) groupedItems[item.category_id] = [];
    groupedItems[item.category_id].push(item);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-4 py-4">
        <div className="mx-auto max-w-lg">
          <div className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-blue-600" />
            <span className="text-lg font-bold text-gray-900">Quote Generator</span>
          </div>
          <p className="mt-0.5 text-sm text-gray-500">{data.company_name}</p>
        </div>
      </div>

      <div className="mx-auto max-w-lg space-y-4 px-4 py-4">
        {/* Customer Info */}
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-700">Customer</h3>
          <div className="mt-2 space-y-1 text-sm text-gray-600">
            <p className="font-medium text-gray-800">{data.customer.name}</p>
            <p>{data.customer.address}</p>
            <p>{data.customer.phone}</p>
          </div>
          <div className="mt-3 rounded-md bg-gray-50 p-2.5">
            <p className="text-xs font-medium text-gray-500">Reported Issue</p>
            <p className="mt-0.5 text-sm text-gray-700">{data.appointment.problem_description}</p>
          </div>
        </div>

        {/* Diagnosis */}
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-700">Diagnosis</h3>
          <input
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder="What did you find?"
          />
          <textarea
            value={diagnosisNotes}
            onChange={(e) => setDiagnosisNotes(e.target.value)}
            rows={3}
            className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder="Additional notes..."
          />
        </div>

        {/* Line Items */}
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">Line Items</h3>
            <span className="text-xs text-gray-400">{lineItems.length} item{lineItems.length !== 1 ? "s" : ""}</span>
          </div>

          {lineItems.length > 0 ? (
            <div className="mt-3 space-y-2">
              {lineItems.map((item) => (
                <div key={item.id} className="flex items-start justify-between rounded-md border border-gray-100 bg-gray-50 p-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                    {item.description && <p className="text-xs text-gray-500">{item.description}</p>}
                    <div className="mt-1 flex gap-3 text-xs text-gray-500">
                      <span>Good: ${item.price_good.toFixed(2)}</span>
                      <span>Better: ${item.price_better.toFixed(2)}</span>
                      <span>Best: ${item.price_best.toFixed(2)}</span>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="ml-2 rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}

              {/* Totals */}
              <div className="mt-2 rounded-md bg-blue-50 p-3">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">Totals:</span>
                </div>
                <div className="mt-1 flex justify-between text-sm">
                  <span className="text-gray-600">Good</span>
                  <span className="font-semibold text-gray-800">${totalGood.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Better</span>
                  <span className="font-semibold text-gray-800">${totalBetter.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Best</span>
                  <span className="font-semibold text-gray-800">${totalBest.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-gray-400">No items added yet. Add from pricebook or create a custom item.</p>
          )}

          <div className="mt-3 flex gap-2">
            <button
              onClick={() => setShowPricebook(true)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
            >
              <ClipboardList className="h-4 w-4" />
              Add from Pricebook
            </button>
            <button
              onClick={() => setShowCustomItem(true)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Plus className="h-4 w-4" />
              Custom Item
            </button>
          </div>
        </div>

        {/* Send Quote */}
        <button
          onClick={() => setConfirmSend(true)}
          disabled={lineItems.length === 0}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          Send Quote to Customer
        </button>
      </div>

      {/* Pricebook Modal */}
      {showPricebook && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center">
          <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-xl bg-white p-5 sm:rounded-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Pricebook</h3>
              <button onClick={() => setShowPricebook(false)} className="rounded p-1 hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="mt-4 space-y-2">
              {data.pricebook.categories.map((cat) => {
                const catItems = groupedItems[cat.id] || [];
                const isExp = expandedCat === cat.id;
                return (
                  <div key={cat.id} className="rounded-lg border border-gray-200">
                    <button
                      onClick={() => setExpandedCat(isExp ? null : cat.id)}
                      className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-800"
                    >
                      {cat.name}
                      {isExp ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                    </button>
                    {isExp && (
                      <div className="border-t border-gray-100 px-4 pb-3">
                        {catItems.map((item) => (
                          <div key={item.id} className="flex items-center justify-between border-b border-gray-50 py-2 last:border-0">
                            <div>
                              <p className="text-sm font-medium text-gray-700">{item.name}</p>
                              <p className="text-xs text-gray-400">
                                ${item.price_good.toFixed(2)} / ${item.price_better.toFixed(2)} / ${item.price_best.toFixed(2)}
                              </p>
                            </div>
                            <button
                              onClick={() => addFromPricebook(item)}
                              disabled={addingItem}
                              className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                              Add
                            </button>
                          </div>
                        ))}
                        {catItems.length === 0 && <p className="py-2 text-xs text-gray-400">No items</p>}
                      </div>
                    )}
                  </div>
                );
              })}
              {data.pricebook.categories.length === 0 && (
                <p className="py-4 text-center text-sm text-gray-400">No pricebook items available</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Custom Item Modal */}
      {showCustomItem && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center">
          <div className="w-full max-w-lg rounded-t-xl bg-white p-5 sm:rounded-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Custom Item</h3>
              <button onClick={() => setShowCustomItem(false)} className="rounded p-1 hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="mt-4 space-y-3">
              <input
                value={customItem.name}
                onChange={(e) => setCustomItem({ ...customItem, name: e.target.value })}
                placeholder="Item name"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-medium text-gray-600">Good $</label>
                  <input
                    type="number"
                    step="0.01"
                    value={customItem.price_good}
                    onChange={(e) => setCustomItem({ ...customItem, price_good: parseFloat(e.target.value) || 0 })}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Better $</label>
                  <input
                    type="number"
                    step="0.01"
                    value={customItem.price_better}
                    onChange={(e) => setCustomItem({ ...customItem, price_better: parseFloat(e.target.value) || 0 })}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Best $</label>
                  <input
                    type="number"
                    step="0.01"
                    value={customItem.price_best}
                    onChange={(e) => setCustomItem({ ...customItem, price_best: parseFloat(e.target.value) || 0 })}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowCustomItem(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600">
                  Cancel
                </button>
                <button
                  onClick={addCustom}
                  disabled={!customItem.name.trim() || addingItem}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {addingItem ? "Adding..." : "Add"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Send Modal */}
      {confirmSend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">Send Quote?</h3>
            <p className="mt-2 text-sm text-gray-600">
              This will send the quote to <strong>{data.customer.name}</strong> via SMS. They will be able to review and approve it online.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setConfirmSend(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600">
                Cancel
              </button>
              <button
                onClick={sendQuote}
                disabled={sending}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
              >
                {sending ? "Sending..." : "Send Quote"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
