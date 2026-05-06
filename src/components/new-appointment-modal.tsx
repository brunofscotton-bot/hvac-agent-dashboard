"use client";

import { useEffect, useState } from "react";
import { X, Plus, Send } from "lucide-react";
import {
  createAppointment, getCustomers, getTechnicians,
  type CustomerInfo, type Technician,
} from "@/lib/api";

export function NewAppointmentModal({
  onClose,
  onCreated,
  initialCustomerId,
}: {
  onClose: () => void;
  onCreated: () => void;
  initialCustomerId?: string;
}) {
  const [customers, setCustomers] = useState<CustomerInfo[]>([]);
  const [techs, setTechs] = useState<Technician[]>([]);

  // Mode: pick existing customer OR create new
  const [mode, setMode] = useState<"existing" | "new">(initialCustomerId ? "existing" : "new");
  const [customerId, setCustomerId] = useState(initialCustomerId || "");
  const [searchCust, setSearchCust] = useState("");

  // New customer fields
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newLang, setNewLang] = useState<"en" | "pt" | "es">("en");

  // Appointment fields
  const [techId, setTechId] = useState("");
  const [scheduled, setScheduled] = useState(""); // datetime-local
  const [problem, setProblem] = useState("");
  const [equipment, setEquipment] = useState("");
  const [urgency, setUrgency] = useState("NORMAL");
  const [notifyCustomer, setNotifyCustomer] = useState(true);
  const [notifyTech, setNotifyTech] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getCustomers(1, ""), getTechnicians()])
      .then(([cs, ts]) => {
        setCustomers(cs.items || []);
        setTechs(ts);
        if (ts.length === 1) setTechId(ts[0].id);
      })
      .catch(console.error);
  }, []);

  // Default scheduled to next round 30 min
  useEffect(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() + 60);
    d.setMinutes(Math.ceil(d.getMinutes() / 30) * 30);
    d.setSeconds(0);
    const pad = (n: number) => String(n).padStart(2, "0");
    setScheduled(
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
    );
  }, []);

  const filteredCustomers = searchCust
    ? customers.filter(
        (c) =>
          c.name.toLowerCase().includes(searchCust.toLowerCase()) ||
          c.phone.includes(searchCust)
      )
    : customers;

  async function submit() {
    setErr(null);
    if (!scheduled || !problem.trim()) {
      setErr("Date and problem description are required");
      return;
    }
    if (mode === "existing" && !customerId) {
      setErr("Pick a customer");
      return;
    }
    if (mode === "new" && (!newName.trim() || !newPhone.trim())) {
      setErr("New customer needs name + phone");
      return;
    }

    setSubmitting(true);
    try {
      const iso = new Date(scheduled).toISOString();
      const payload: any = {
        scheduled_date: iso,
        problem_description: problem,
        urgency,
        equipment_type: equipment || undefined,
        technician_id: techId || undefined,
        notify_customer: notifyCustomer,
        notify_technician: notifyTech,
        lead_source: "Manual / Cell phone",
      };
      if (mode === "existing") {
        payload.customer_id = customerId;
      } else {
        payload.new_customer_name = newName;
        payload.new_customer_phone = newPhone;
        payload.new_customer_address = newAddress;
        payload.new_customer_language = newLang;
      }
      await createAppointment(payload);
      onCreated();
      onClose();
    } catch (e: any) {
      setErr(e.message || "Failed to create appointment");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center bg-black/50 p-0 sm:p-4">
      <div className="bg-white w-full max-w-2xl sm:rounded-2xl sm:max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">New appointment</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Use this when a customer called you on your cell — log the visit and send SMS confirmation.
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Customer */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-gray-700">Customer</label>
              <div className="ml-auto flex gap-1">
                <button
                  type="button"
                  onClick={() => setMode("existing")}
                  className={`px-3 py-1 text-xs rounded-md font-semibold ${
                    mode === "existing" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  Existing
                </button>
                <button
                  type="button"
                  onClick={() => setMode("new")}
                  className={`px-3 py-1 text-xs rounded-md font-semibold ${
                    mode === "new" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  New customer
                </button>
              </div>
            </div>

            {mode === "existing" ? (
              <>
                <input
                  type="text"
                  placeholder="Search by name or phone..."
                  value={searchCust}
                  onChange={(e) => setSearchCust(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm mb-2"
                />
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  size={Math.min(6, filteredCustomers.length || 1)}
                >
                  {filteredCustomers.length === 0 && <option disabled>No customers found</option>}
                  {filteredCustomers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.phone}
                    </option>
                  ))}
                </select>
              </>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Full name"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="Phone (e.g. +14071234567)"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Address (optional, can be filled later)"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                <select
                  value={newLang}
                  onChange={(e) => setNewLang(e.target.value as any)}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
                >
                  <option value="en">Customer prefers English</option>
                  <option value="pt">Cliente prefere Português</option>
                  <option value="es">Cliente prefiere Español</option>
                </select>
              </div>
            )}
          </div>

          {/* Date & Tech */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Date & time</label>
              <input
                type="datetime-local"
                value={scheduled}
                onChange={(e) => setScheduled(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Technician</label>
              <select
                value={techId}
                onChange={(e) => setTechId(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
              >
                <option value="">— unassigned —</option>
                {techs.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Problem */}
          <div>
            <label className="text-sm font-medium text-gray-700">What's the problem?</label>
            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              rows={2}
              placeholder="AC not cooling, weird noise, annual maintenance, etc."
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Equipment <span className="text-gray-400 font-normal">(optional)</span></label>
              <input
                type="text"
                value={equipment}
                onChange={(e) => setEquipment(e.target.value)}
                placeholder="Central AC, Heat Pump, Mini Split..."
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Urgency</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
              >
                <option value="LOW">Low</option>
                <option value="NORMAL">Normal</option>
                <option value="HIGH">High</option>
                <option value="EMERGENCY">Emergency</option>
              </select>
            </div>
          </div>

          {/* SMS notifications */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <p className="text-xs font-bold uppercase text-gray-500 tracking-wide mb-2">Send confirmation SMS to:</p>
            <label className="flex items-center gap-2 text-sm text-gray-700 mb-1">
              <input
                type="checkbox"
                checked={notifyCustomer}
                onChange={(e) => setNotifyCustomer(e.target.checked)}
                className="rounded border-gray-300"
              />
              Customer (in their language)
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={notifyTech}
                onChange={(e) => setNotifyTech(e.target.checked)}
                className="rounded border-gray-300"
              />
              Technician (with customer details + address)
            </label>
          </div>

          {err && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{err}</p>}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={submitting}
            className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold disabled:opacity-50 hover:bg-blue-700"
          >
            <Send className="h-4 w-4" />
            {submitting ? "Saving..." : "Save & notify"}
          </button>
        </div>
      </div>
    </div>
  );
}
