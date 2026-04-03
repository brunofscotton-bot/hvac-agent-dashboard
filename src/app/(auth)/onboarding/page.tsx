"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building,
  DollarSign,
  Users,
  Sparkles,
  Check,
  Plus,
  Trash2,
  Loader2,
  Phone,
  Link2,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { completeOnboarding, createSupportTicket, type OnboardingData } from "@/lib/api";

// ── Step definitions ────────────────────────────────────────────────────────

const steps = [
  { label: "Company", icon: Building },
  { label: "Pricing", icon: DollarSign },
  { label: "Technicians", icon: Users },
  { label: "Customize", icon: Sparkles },
  { label: "Review", icon: Check },
];

interface TechForm {
  name: string;
  phone: string;
  email: string;
  calendar_provider: string;
  specialties: string;
  works_after_hours: boolean;
  works_weekends: boolean;
}

const emptyTech: TechForm = {
  name: "",
  phone: "",
  email: "",
  calendar_provider: "none",
  specialties: "",
  works_after_hours: false,
  works_weekends: false,
};

// ── Main component ──────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const { company, refresh } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ phone_number?: string; message: string } | null>(null);

  // ── Form state ──────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    company_name: company?.name || "",
    phone: company?.phone || "",
    address: "",
    city: "Orlando",
    state: "FL",
    service_fee: 80,
    after_hours_fee: 180,
    fee_applies_to_service: true,
    business_hours_start: 8,
    business_hours_end: 21,
    agent_name: "Ana",
    languages_supported: "en",
    greeting_message: "",
    voice_gender: "female",
    area_code: "407",
  });

  const [technicians, setTechnicians] = useState<TechForm[]>([{ ...emptyTech }]);
  const [sendCalendarSms, setSendCalendarSms] = useState(true);

  const updateForm = (key: string, value: any) =>
    setForm((f) => ({ ...f, [key]: value }));

  const updateTech = (index: number, key: string, value: any) =>
    setTechnicians((techs) =>
      techs.map((t, i) => (i === index ? { ...t, [key]: value } : t))
    );

  const addTechnician = () => setTechnicians((t) => [...t, { ...emptyTech }]);
  const removeTechnician = (i: number) =>
    setTechnicians((t) => t.filter((_, idx) => idx !== i));

  const toggleLanguage = (lang: string) => {
    const langs = form.languages_supported.split(",").filter(Boolean);
    if (langs.includes(lang)) {
      if (langs.length === 1) return; // must have at least one
      updateForm("languages_supported", langs.filter((l) => l !== lang).join(","));
    } else {
      updateForm("languages_supported", [...langs, lang].join(","));
    }
  };

  // ── Submit ──────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setError("");
    setSubmitting(true);

    const data: OnboardingData = {
      ...form,
      technicians: technicians.filter((t) => t.name && t.phone),
      greeting_message: form.greeting_message || undefined,
      send_calendar_sms: sendCalendarSms,
    };

    try {
      const res = await completeOnboarding(data);
      setResult({ phone_number: res.phone_number, message: res.message });
      await refresh();
    } catch (err: any) {
      setError(err.message || "Onboarding failed");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Support ticket state ────────────────────────────────────────────
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketSubmitting, setTicketSubmitting] = useState(false);
  const [ticketSent, setTicketSent] = useState(false);

  // ── Success screen with setup guide ──────────────────────────────────
  if (result) {
    const phoneClean = result.phone_number?.replace("+1", "") || "";

    return (
      <div className="max-w-2xl space-y-6">
        {/* Header */}
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="mt-4 text-xl font-bold">Your AI Agent is Ready!</h2>
          <p className="mt-2 text-gray-600">{result.message}</p>
          {result.phone_number && (
            <div className="mt-6 rounded-lg bg-[#3B6FFF]/10 p-4">
              <p className="text-sm text-gray-600">Your Ringa phone number:</p>
              <p className="mt-1 flex items-center justify-center gap-2 text-2xl font-bold text-[#3B6FFF]">
                <Phone className="h-6 w-6" />
                {result.phone_number}
              </p>
            </div>
          )}
        </div>

        {/* Step 1: Forward Calls — codes first */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#3B6FFF] text-sm font-bold text-white">
              1
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold">Forward Your Business Calls</h3>
              <p className="mt-1 text-sm text-gray-600">
                Set up call forwarding so unanswered calls go to Ringa.
                Pick your carrier and dial the code below:
              </p>

              {/* Carrier codes — prominent and first */}
              <div className="mt-4 space-y-3">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <p className="text-sm font-semibold text-gray-800">AT&T / T-Mobile</p>
                  <p className="mt-1 font-mono text-lg font-bold text-[#3B6FFF]">*61*1{phoneClean}*11*10#</p>
                  <p className="mt-1 text-xs text-gray-500">Dial this code and press Call</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <p className="text-sm font-semibold text-gray-800">Verizon</p>
                  <p className="mt-1 font-mono text-lg font-bold text-[#3B6FFF]">*71{phoneClean}</p>
                  <p className="mt-1 text-xs text-gray-500">Dial this code and press Call</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <p className="text-sm font-semibold text-gray-800">Landline / VoIP</p>
                  <p className="mt-1 text-sm text-gray-700">
                    Contact your provider and ask to forward unanswered calls to{" "}
                    <span className="font-mono font-semibold text-[#3B6FFF]">{result.phone_number}</span>
                  </p>
                </div>
              </div>

              {/* Ring time guide */}
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm font-semibold text-amber-800">Ring Time Guide</p>
                <p className="mt-1 text-xs text-amber-700">
                  The codes above use 10-second forwarding (~2-3 rings). This is recommended so Ringa picks up quickly.
                </p>
                <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-lg bg-white p-2 shadow-sm">
                    <p className="text-lg font-bold text-amber-800">5s</p>
                    <p className="text-amber-600">~1 ring</p>
                  </div>
                  <div className="rounded-lg bg-white p-2 shadow-sm ring-2 ring-amber-400">
                    <p className="text-lg font-bold text-amber-800">10s</p>
                    <p className="text-amber-600">Recommended</p>
                  </div>
                  <div className="rounded-lg bg-white p-2 shadow-sm">
                    <p className="text-lg font-bold text-amber-800">15s</p>
                    <p className="text-amber-600">~4 rings</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Google Calendar Sync */}
        {technicians.some((t) => t.calendar_provider === "google") && (
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#3B6FFF] text-sm font-bold text-white">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold">Google Calendar Sync</h3>
                {sendCalendarSms ? (
                  <>
                    <p className="mt-1 text-sm text-gray-600">
                      We sent a setup link via SMS to your technicians with Google Calendar enabled.
                      They just need to tap the link, sign in to Google, and click &ldquo;Allow&rdquo;.
                    </p>
                    <div className="mt-4 rounded-lg bg-green-50 border border-green-200 p-4">
                      <p className="text-sm font-medium text-green-800">SMS sent to:</p>
                      <div className="mt-2 space-y-1">
                        {technicians
                          .filter((t) => t.name && t.calendar_provider === "google")
                          .map((t, i) => (
                            <p key={i} className="text-sm text-green-700">
                              {t.name} — {t.phone}
                            </p>
                          ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="mt-1 text-sm text-gray-600">
                    You chose to set up calendar sync later. Go to <span className="font-semibold">Settings → Google Calendar Sync</span> to
                    send setup links to your technicians.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Need Help / Support */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700">Need help with call forwarding?</h3>
          <p className="mt-1 text-sm text-gray-500">
            If the codes above don&apos;t work, contact your phone carrier and ask for
            &ldquo;Conditional Call Forwarding&rdquo; to <span className="font-mono font-medium">{result.phone_number}</span>.
            If the problem persists, open a support ticket and our team will help you.
          </p>

          {ticketSent ? (
            <div className="mt-3 rounded-lg border border-green-200 bg-green-50 p-3">
              <p className="text-sm font-medium text-green-700">Ticket submitted! We&apos;ll get back to you soon.</p>
            </div>
          ) : showTicketForm ? (
            <div className="mt-3 space-y-2">
              <textarea
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                rows={3}
                placeholder="Describe your issue..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    if (!ticketMessage.trim()) return;
                    setTicketSubmitting(true);
                    try {
                      await createSupportTicket({
                        subject: "Call forwarding setup help",
                        message: ticketMessage,
                        category: "call_forwarding",
                      });
                      setTicketSent(true);
                    } catch (e) {
                      console.error(e);
                    }
                    setTicketSubmitting(false);
                  }}
                  disabled={ticketSubmitting || !ticketMessage.trim()}
                  className="rounded-lg bg-[#3B6FFF] px-4 py-1.5 text-sm font-medium text-white hover:bg-[#2D5FE6] disabled:opacity-50"
                >
                  {ticketSubmitting ? "Submitting..." : "Submit Ticket"}
                </button>
                <button
                  onClick={() => setShowTicketForm(false)}
                  className="rounded-lg border border-gray-300 px-4 py-1.5 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowTicketForm(true)}
              className="mt-3 flex items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <MessageSquare className="h-4 w-4" />
              Open Support Ticket
            </button>
          )}
        </div>

        {/* Go to Dashboard */}
        <div className="text-center">
          <button
            onClick={() => router.push("/home")}
            className="rounded-lg bg-[#3B6FFF] px-8 py-3 text-sm font-medium text-white hover:bg-[#2D5FE6]"
          >
            Go to Dashboard
          </button>
          <p className="mt-2 text-xs text-gray-400">
            You can always find these instructions in Settings
          </p>
        </div>
      </div>
    );
  }

  // ── Wizard steps ──────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl">
      {/* Progress bar */}
      <div className="mb-6 flex items-center justify-between">
        {steps.map((s, i) => (
          <div key={s.label} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                i < step
                  ? "bg-[#3B6FFF] text-white"
                  : i === step
                  ? "bg-[#3B6FFF]/10 text-[#3B6FFF] ring-2 ring-[#3B6FFF]"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span
              className={`hidden text-xs font-medium sm:inline ${
                i <= step ? "text-gray-900" : "text-gray-400"
              }`}
            >
              {s.label}
            </span>
            {i < steps.length - 1 && (
              <div className={`mx-2 h-px w-8 ${i < step ? "bg-[#3B6FFF]" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {/* Step 0: Company Info */}
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Company Information</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Name</label>
              <input
                value={form.company_name}
                onChange={(e) => updateForm("company_name", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="Your HVAC Company"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  value={form.phone}
                  onChange={(e) => updateForm("phone", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder="+1 (407) 555-1234"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Area Code for AI Number</label>
                <input
                  value={form.area_code}
                  onChange={(e) => updateForm("area_code", e.target.value)}
                  maxLength={3}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder="407"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea
                value={form.address}
                onChange={(e) => updateForm("address", e.target.value)}
                rows={2}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="123 Main St, Orlando, FL 32801"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  value={form.city}
                  onChange={(e) => updateForm("city", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">State</label>
                <input
                  value={form.state}
                  onChange={(e) => updateForm("state", e.target.value)}
                  maxLength={2}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Pricing */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Pricing Configuration</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Regular Visit Fee ($)
                </label>
                <input
                  type="number"
                  value={form.service_fee}
                  onChange={(e) => updateForm("service_fee", Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                <p className="mt-1 text-xs text-gray-400">Mon-Fri, business hours</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  After-Hours / Weekend Fee ($)
                </label>
                <input
                  type="number"
                  value={form.after_hours_fee}
                  onChange={(e) => updateForm("after_hours_fee", Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                <p className="mt-1 text-xs text-gray-400">Evenings & weekends</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Business Hours Start
                </label>
                <select
                  value={form.business_hours_start}
                  onChange={(e) =>
                    updateForm("business_hours_start", Number(e.target.value))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 5).map((h) => (
                    <option key={h} value={h}>
                      {h > 12 ? `${h - 12} PM` : `${h} AM`}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Business Hours End
                </label>
                <select
                  value={form.business_hours_end}
                  onChange={(e) =>
                    updateForm("business_hours_end", Number(e.target.value))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 14).map((h) => (
                    <option key={h} value={h}>
                      {h > 12 ? `${h - 12} PM` : `${h} AM`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.fee_applies_to_service}
                onChange={(e) =>
                  updateForm("fee_applies_to_service", e.target.checked)
                }
                className="rounded border-gray-300"
              />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Visit fee applies toward repair cost
                </p>
                <p className="text-xs text-gray-400">
                  Deducted from total if customer proceeds with service
                </p>
              </div>
            </label>
          </div>
        )}

        {/* Step 2: Technicians */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Technicians</h2>

            {/* Jobber tip */}
            <div className="rounded-lg border border-green-200 bg-green-50 p-3">
              <div className="flex items-start gap-2">
                <Link2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                <p className="text-sm text-green-800">
                  <span className="font-medium">Use Jobber?</span> After setup, go to{" "}
                  <span className="font-semibold">Settings → Jobber Integration</span> or{" "}
                  <span className="font-semibold">Technicians</span> to connect Jobber and import your team members automatically.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Add at least one technician. Calendar sync is optional — you can set
                their working hours after onboarding.
              </p>
              <button
                onClick={addTechnician}
                className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium hover:bg-gray-50"
              >
                <Plus className="h-3.5 w-3.5" /> Add
              </button>
            </div>
            {technicians.map((tech, i) => (
              <div key={i} className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Technician {i + 1}</h3>
                  {technicians.length > 1 && (
                    <button
                      onClick={() => removeTechnician(i)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <input
                    required
                    placeholder="Name *"
                    value={tech.name}
                    onChange={(e) => updateTech(i, "name", e.target.value)}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                  <input
                    required
                    placeholder="Phone * (+1...)"
                    value={tech.phone}
                    onChange={(e) => updateTech(i, "phone", e.target.value)}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                  <input
                    placeholder="Email"
                    value={tech.email}
                    onChange={(e) => updateTech(i, "email", e.target.value)}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                  <select
                    value={tech.calendar_provider || "none"}
                    onChange={(e) => updateTech(i, "calendar_provider", e.target.value)}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value="none">No Calendar Sync</option>
                    <option value="google">Google Calendar</option>
                    <option value="microsoft">Microsoft Outlook</option>
                  </select>
                  {tech.calendar_provider === "google" && (
                    <div className="col-span-2 rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs text-blue-700">
                      After onboarding, this technician will receive an SMS with a link to connect their Google Calendar — one tap, sign in, done.
                    </div>
                  )}
                  <input
                    placeholder="Specialties (AC, Heating, Duct)"
                    value={tech.specialties}
                    onChange={(e) => updateTech(i, "specialties", e.target.value)}
                    className="col-span-2 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={tech.works_after_hours}
                      onChange={(e) =>
                        updateTech(i, "works_after_hours", e.target.checked)
                      }
                      className="rounded border-gray-300"
                    />
                    Works after hours
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={tech.works_weekends}
                      onChange={(e) =>
                        updateTech(i, "works_weekends", e.target.checked)
                      }
                      className="rounded border-gray-300"
                    />
                    Works weekends
                  </label>
                </div>
              </div>
            ))}

            {/* Calendar SMS opt-in */}
            {technicians.some((t) => t.calendar_provider === "google") && (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={sendCalendarSms}
                    onChange={(e) => setSendCalendarSms(e.target.checked)}
                    className="mt-0.5 rounded border-gray-300"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Send Google Calendar setup link via SMS
                    </p>
                    <p className="text-xs text-gray-500">
                      Each technician with Google Calendar selected will receive an SMS with a link to authorize calendar access.
                      You can also do this manually later in Settings.
                    </p>
                  </div>
                </label>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Customization */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Agent Customization</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Agent Name
              </label>
              <input
                value={form.agent_name}
                onChange={(e) => updateForm("agent_name", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="Ana"
              />
              <p className="mt-1 text-xs text-gray-400">
                The name your AI agent will use when greeting callers
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Agent Voice
              </label>
              <div className="mt-2 flex gap-3">
                {[
                  { value: "female", label: "Female" },
                  { value: "male", label: "Male" },
                ].map((opt) => {
                  const active = form.voice_gender === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => updateForm("voice_gender", opt.value)}
                      className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                        active
                          ? "border-[#3B6FFF] bg-[#3B6FFF]/10 text-[#3B6FFF]"
                          : "border-gray-300 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Choose the voice your AI agent will use on calls
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Languages Supported
              </label>
              <div className="mt-2 flex gap-3">
                {[
                  { code: "en", label: "English" },
                  { code: "pt", label: "Portuguese" },
                  { code: "es", label: "Spanish" },
                ].map((lang) => {
                  const active = form.languages_supported.includes(lang.code);
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => toggleLanguage(lang.code)}
                      className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                        active
                          ? "border-[#3B6FFF] bg-[#3B6FFF]/10 text-[#3B6FFF]"
                          : "border-gray-300 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {lang.label}
                    </button>
                  );
                })}
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Your agent will detect and respond in these languages
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Custom Greeting (optional)
              </label>
              <textarea
                value={form.greeting_message}
                onChange={(e) => updateForm("greeting_message", e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder={`Thank you for calling ${form.company_name || "your company"}! My name is ${form.agent_name}. How can I help you today?`}
              />
              <p className="mt-1 text-xs text-gray-400">
                Leave blank for the default greeting
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Review & Launch</h2>
            <p className="text-sm text-gray-500">
              Review your settings before we provision your AI phone agent.
            </p>

            <div className="space-y-3">
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="text-sm font-semibold text-gray-700">Company</h3>
                <p className="mt-1 text-sm">{form.company_name}</p>
                <p className="text-xs text-gray-500">
                  {form.city}, {form.state} | Area code: {form.area_code}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="text-sm font-semibold text-gray-700">Pricing</h3>
                <p className="mt-1 text-sm">
                  Regular: ${form.service_fee} | After-hours: ${form.after_hours_fee}
                </p>
                <p className="text-xs text-gray-500">
                  Hours: {form.business_hours_start}AM -{" "}
                  {form.business_hours_end > 12
                    ? `${form.business_hours_end - 12}PM`
                    : `${form.business_hours_end}AM`}
                  {form.fee_applies_to_service &&
                    " | Fee applied to repair cost"}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="text-sm font-semibold text-gray-700">
                  Technicians ({technicians.filter((t) => t.name).length})
                </h3>
                {technicians
                  .filter((t) => t.name)
                  .map((t, i) => (
                    <p key={i} className="mt-1 text-sm">
                      {t.name} — {t.phone}
                      {t.calendar_provider === "google" && " (Google Calendar)"}
                    </p>
                  ))}
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="text-sm font-semibold text-gray-700">
                  AI Agent
                </h3>
                <p className="mt-1 text-sm">
                  Name: {form.agent_name} | Voice: {form.voice_gender === "male" ? "Male" : "Female"} | Languages:{" "}
                  {form.languages_supported.toUpperCase().replace(/,/g, ", ")}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-[#3B6FFF]/20 bg-[#3B6FFF]/10 p-4">
              <p className="text-sm text-[#3B6FFF]">
                Clicking &ldquo;Launch Agent&rdquo; will:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-[#3B6FFF]">
                <li>1. Purchase a local phone number ({form.area_code})</li>
                <li>2. Create your custom AI assistant</li>
                <li>3. Connect the phone number to your agent</li>
              </ul>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium disabled:opacity-30"
          >
            Back
          </button>

          <div className="flex items-center gap-3">
            {step < steps.length - 1 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                className="rounded-lg bg-[#3B6FFF] px-6 py-2 text-sm font-medium text-white hover:bg-[#2D5FE6]"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 rounded-lg bg-[#3B6FFF] px-6 py-2 text-sm font-medium text-white hover:bg-[#2D5FE6] disabled:opacity-50"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {submitting ? "Provisioning..." : "Launch Agent"}
              </button>
            )}
            <button
              onClick={() => router.push("/home")}
              className="rounded-lg px-4 py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Skip for now →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
