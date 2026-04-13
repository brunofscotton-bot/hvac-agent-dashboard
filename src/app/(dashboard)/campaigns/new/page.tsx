"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Sparkles, Users, Send, CheckCircle2 } from "lucide-react";
import {
  getCampaignTemplates,
  previewCampaign,
  createCampaign,
  launchCampaign,
  type CampaignTemplate,
} from "@/lib/api";

type Step = "template" | "customize" | "review";

export default function NewCampaignPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<CampaignTemplate[]>([]);
  const [step, setStep] = useState<Step>("template");
  const [loading, setLoading] = useState(true);

  const [selectedTemplate, setSelectedTemplate] = useState<CampaignTemplate | null>(null);
  const [form, setForm] = useState({
    name: "",
    inactive_days: 180,
    equipment_types: "",
    offer_text: "",
    offer_price: 0,
    sms_template: "",
    max_contacts_per_day: 30,
    send_start_hour: 9,
    send_end_hour: 18,
    send_weekends: false,
  });

  const [eligibleCount, setEligibleCount] = useState<number | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getCampaignTemplates()
      .then(setTemplates)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Re-run preview whenever the filter changes
  useEffect(() => {
    if (step !== "customize" && step !== "review") return;
    setPreviewLoading(true);
    previewCampaign({
      inactive_days: form.inactive_days,
      equipment_types: form.equipment_types || undefined,
    })
      .then((r) => setEligibleCount(r.eligible_count))
      .catch(() => setEligibleCount(null))
      .finally(() => setPreviewLoading(false));
  }, [form.inactive_days, form.equipment_types, step]);

  const pickTemplate = (tpl: CampaignTemplate | null) => {
    if (tpl) {
      setSelectedTemplate(tpl);
      setForm({
        ...form,
        name: tpl.name,
        inactive_days: tpl.inactive_days,
        equipment_types: tpl.equipment_types,
        offer_text: tpl.offer_text,
        offer_price: tpl.offer_price,
        sms_template: tpl.sms_template,
      });
    } else {
      setSelectedTemplate(null);
      setForm({
        ...form,
        name: "",
        inactive_days: 180,
        equipment_types: "",
        offer_text: "",
        offer_price: 0,
        sms_template: "Hi {first_name}, this is {company_name}. [Your offer]. Reply YES or call {phone}. Reply STOP to opt out.",
      });
    }
    setStep("customize");
  };

  const handleLaunch = async () => {
    setError("");
    setLaunching(true);
    try {
      const created = await createCampaign({
        ...form,
        template_key: selectedTemplate?.key,
      });
      await launchCampaign(created.id);
      router.push(`/campaigns/${created.id}`);
    } catch (e: any) {
      setError(e.message || "Failed to launch campaign");
    } finally {
      setLaunching(false);
    }
  };

  const estRevenue = (eligibleCount ?? 0) * form.offer_price * 0.2; // assume 20% conversion

  return (
    <div className="max-w-3xl">
      <Link href="/campaigns" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
        <ChevronLeft className="h-4 w-4" />
        Back to campaigns
      </Link>

      <h1 className="mt-4 text-2xl font-bold">New Campaign</h1>

      {/* Step indicator */}
      <div className="mt-6 flex items-center gap-2">
        {[
          { id: "template", label: "Template" },
          { id: "customize", label: "Customize" },
          { id: "review", label: "Review & Launch" },
        ].map((s, i) => {
          const stepIdx = ["template", "customize", "review"].indexOf(step);
          const isActive = s.id === step;
          const isDone = i < stepIdx;
          return (
            <div key={s.id} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                  isDone ? "bg-[#3B6FFF] text-white" : isActive ? "bg-[#3B6FFF]/10 text-[#3B6FFF] ring-2 ring-[#3B6FFF]" : "bg-gray-100 text-gray-400"
                }`}
              >
                {isDone ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`hidden text-xs font-medium sm:inline ${i <= stepIdx ? "text-gray-900" : "text-gray-400"}`}>
                {s.label}
              </span>
              {i < 2 && <div className={`mx-2 h-px w-8 ${i < stepIdx ? "bg-[#3B6FFF]" : "bg-gray-200"}`} />}
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {/* ── Step 1: Template ────────────────────────────────────────── */}
        {step === "template" && (
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#3B6FFF]" />
              Pick a template
            </h2>
            <p className="mt-1 text-sm text-gray-500">Pre-built templates save you time. You can customize anything after.</p>

            {loading ? (
              <p className="mt-6 text-sm text-gray-400">Loading templates...</p>
            ) : (
              <div className="mt-6 space-y-3">
                {templates.map((tpl) => (
                  <button
                    key={tpl.key}
                    onClick={() => pickTemplate(tpl)}
                    className="group block w-full rounded-lg border border-gray-200 bg-white p-4 text-left hover:border-[#3B6FFF]/40 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{tpl.name}</h3>
                        {tpl.recommended && (
                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                            Recommended
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-semibold text-[#3B6FFF]">${tpl.offer_price}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{tpl.offer_text}</p>
                    <p className="mt-2 text-xs text-gray-400">
                      Targets customers inactive for {Math.round(tpl.inactive_days / 30)} months
                    </p>
                  </button>
                ))}
                <button
                  onClick={() => pickTemplate(null)}
                  className="block w-full rounded-lg border border-dashed border-gray-300 bg-white p-4 text-left hover:border-[#3B6FFF]/40"
                >
                  <h3 className="font-semibold text-gray-700">Start from scratch</h3>
                  <p className="mt-1 text-sm text-gray-500">Build a custom campaign from zero.</p>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Step 2: Customize ────────────────────────────────────────── */}
        {step === "customize" && (
          <div>
            <h2 className="text-lg font-bold">Customize your campaign</h2>
            <p className="mt-1 text-sm text-gray-500">Tweak the offer, filters, and send rules.</p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Campaign name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Pre-Summer AC Tune-Up 2026"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Inactive for (months)</label>
                  <select
                    value={form.inactive_days}
                    onChange={(e) => setForm({ ...form, inactive_days: Number(e.target.value) })}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value={90}>3 months</option>
                    <option value={180}>6 months</option>
                    <option value={365}>12 months</option>
                    <option value={730}>24 months</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Offer price ($)</label>
                  <input
                    type="number"
                    value={form.offer_price}
                    onChange={(e) => setForm({ ...form, offer_price: Number(e.target.value) })}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Offer description</label>
                <input
                  value={form.offer_text}
                  onChange={(e) => setForm({ ...form, offer_text: e.target.value })}
                  placeholder="Pre-season AC tune-up for $89 (reg. $129)"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">SMS message</label>
                <textarea
                  value={form.sms_template}
                  onChange={(e) => setForm({ ...form, sms_template: e.target.value })}
                  rows={4}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Variables: {"{first_name}"}, {"{company_name}"}, {"{phone}"}. Must include &quot;STOP to opt out&quot; for compliance.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Max per day</label>
                  <input
                    type="number"
                    value={form.max_contacts_per_day}
                    onChange={(e) => setForm({ ...form, max_contacts_per_day: Number(e.target.value) })}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start hour</label>
                  <select
                    value={form.send_start_hour}
                    onChange={(e) => setForm({ ...form, send_start_hour: Number(e.target.value) })}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>
                        {i === 0 ? "12 AM" : i < 12 ? `${i} AM` : i === 12 ? "12 PM" : `${i - 12} PM`}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End hour</label>
                  <select
                    value={form.send_end_hour}
                    onChange={(e) => setForm({ ...form, send_end_hour: Number(e.target.value) })}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>
                        {i === 0 ? "12 AM" : i < 12 ? `${i} AM` : i === 12 ? "12 PM" : `${i - 12} PM`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.send_weekends}
                  onChange={(e) => setForm({ ...form, send_weekends: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Send on weekends</span>
              </label>

              {/* Live preview counter */}
              <div className="rounded-lg border border-[#3B6FFF]/20 bg-[#3B6FFF]/5 p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#3B6FFF]" />
                  <p className="text-sm font-semibold text-[#3B6FFF]">
                    {previewLoading
                      ? "Calculating..."
                      : eligibleCount == null
                      ? "-"
                      : `${eligibleCount} eligible customers`}
                  </p>
                </div>
                <p className="mt-1 text-xs text-gray-600">
                  Customers inactive for {Math.round(form.inactive_days / 30)}+ months, not opted out, no future appointments.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setStep("template")}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
              >
                Back
              </button>
              <button
                onClick={() => setStep("review")}
                disabled={!form.name || !form.offer_text || !form.sms_template || eligibleCount === 0}
                className="rounded-lg bg-[#3B6FFF] px-5 py-2 text-sm font-medium text-white hover:bg-[#2D5FE6] disabled:opacity-50"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Review & Launch ────────────────────────────────── */}
        {step === "review" && (
          <div>
            <h2 className="text-lg font-bold">Review & launch</h2>
            <p className="mt-1 text-sm text-gray-500">Last chance to check everything before going live.</p>

            <div className="mt-6 space-y-4">
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Campaign</h3>
                <p className="mt-1 font-semibold">{form.name}</p>
                <p className="text-sm text-gray-600">{form.offer_text}</p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">SMS Preview</h3>
                <p className="mt-1 rounded-lg border border-gray-200 bg-white p-3 text-sm font-mono whitespace-pre-wrap">
                  {form.sms_template
                    .replace("{first_name}", "John")
                    .replace("{company_name}", "Your Company")
                    .replace("{phone}", "(407) 555-0100")}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-[#3B6FFF]/20 bg-[#3B6FFF]/5 p-4">
                  <p className="text-xs text-[#3B6FFF]">Target Audience</p>
                  <p className="mt-1 text-2xl font-bold text-[#3B6FFF]">{eligibleCount ?? 0}</p>
                  <p className="text-xs text-gray-600">eligible customers</p>
                </div>
                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <p className="text-xs text-green-700">Est. Revenue</p>
                  <p className="mt-1 text-2xl font-bold text-green-700">${Math.round(estRevenue).toLocaleString()}</p>
                  <p className="text-xs text-green-600">at 20% conversion</p>
                </div>
              </div>

              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <p className="text-xs font-semibold text-amber-800">⚠️ Before launching</p>
                <ul className="mt-2 space-y-1 text-xs text-amber-700">
                  <li>• Ensure your A2P brand and campaign are approved with Twilio</li>
                  <li>• Customers can reply STOP to opt out at any time (auto-handled)</li>
                  <li>• Sending window: {form.send_start_hour}:00 - {form.send_end_hour}:00, {form.send_weekends ? "all week" : "weekdays only"}</li>
                  <li>• Max {form.max_contacts_per_day} messages per day</li>
                </ul>
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
              )}
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setStep("customize")}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
              >
                Back
              </button>
              <button
                onClick={handleLaunch}
                disabled={launching || !eligibleCount}
                className="inline-flex items-center gap-2 rounded-lg bg-[#3B6FFF] px-5 py-2 text-sm font-medium text-white hover:bg-[#2D5FE6] disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                {launching ? "Launching..." : "Launch Campaign"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
