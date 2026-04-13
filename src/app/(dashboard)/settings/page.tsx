"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Save, Building, Phone, Link2, Unlink, Calendar, Send, RefreshCw, PhoneForwarded, MessageSquare, MapPin, Shield } from "lucide-react";
import { getCompany, updateCompany, getJobberStatus, disconnectJobber, syncJobberTechnicians, syncJobberSchedules, getTechnicians, sendCalendarInstructions, type Company, type Technician } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function SettingsPage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [jobberConnected, setJobberConnected] = useState(false);
  const [jobberLoading, setJobberLoading] = useState(false);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [sendingSmsTo, setSendingSmsTo] = useState<string | null>(null);
  const [smsSent, setSmsSent] = useState<Set<string>>(new Set());
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const [tab, setTab] = useState<"company" | "agent" | "integrations" | "reviews">("company");
  const [syncingSchedules, setSyncingSchedules] = useState(false);
  const [scheduleSyncResult, setScheduleSyncResult] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const { token } = useAuth();

  useEffect(() => {
    getCompany()
      .then(setCompany)
      .catch(console.error)
      .finally(() => setLoading(false));

    getJobberStatus()
      .then((s) => setJobberConnected(s.connected))
      .catch(() => {});

    getTechnicians()
      .then(setTechnicians)
      .catch(() => {});
  }, []);

  // Handle Jobber OAuth redirect result
  useEffect(() => {
    const jobberParam = searchParams.get("jobber");
    if (jobberParam === "connected") {
      setJobberConnected(true);
    }
  }, [searchParams]);

  const handleSave = async () => {
    if (!company) return;
    setSaving(true);
    setSaved(false);
    await updateCompany({
      name: company.name,
      phone: company.phone,
      address: company.address,
      call_forwarding_confirmed: company.call_forwarding_confirmed,
      call_escalation_enabled: company.call_escalation_enabled,
      escalation_phone: company.escalation_phone,
      escalation_conditions: company.escalation_conditions,
      agent_name: company.agent_name,
      greeting_message: company.greeting_message,
      recording_disclosure: company.recording_disclosure,
      service_area_zip_codes: company.service_area_zip_codes,
      emergency_mode: company.emergency_mode,
      oncall_phone: company.oncall_phone,
      oncall_backup_phone: company.oncall_backup_phone,
      oncall_end_hour: company.oncall_end_hour,
      google_review_url: company.google_review_url,
      review_request_enabled: company.review_request_enabled,
      review_min_stars_for_google: company.review_min_stars_for_google,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-gray-400">Loading...</div>;
  }

  if (!company) {
    return <div className="flex h-64 items-center justify-center text-gray-400">No company configured</div>;
  }

  const tabs = [
    { id: "company", label: "Company", icon: Building },
    { id: "agent", label: "Agent & Calls", icon: PhoneForwarded },
    { id: "integrations", label: "Integrations", icon: Link2 },
    { id: "reviews", label: "Reviews", icon: MessageSquare },
  ] as const;

  return (
    <div>
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="mt-1 text-gray-500">Manage your company and integrations</p>

      {/* Tab bar */}
      <div className="mt-6 flex gap-1 overflow-x-auto border-b border-gray-200">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 whitespace-nowrap px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t.id
                ? "border-[#3B6FFF] text-[#3B6FFF]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      <div className={`mt-6 w-full max-w-xl space-y-8 ${tab === "company" ? "block" : "hidden"}`}>
        {/* Company Info */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold">Company Information</h2>
          </div>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Name</label>
              <input
                value={company.name}
                onChange={(e) => setCompany({ ...company, name: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                value={company.email}
                disabled
                className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                value={company.phone ?? ""}
                onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea
                value={company.address ?? ""}
                onChange={(e) => setCompany({ ...company, address: e.target.value })}
                rows={2}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Greeting & Disclosure */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold">Greeting &amp; Disclosure</h2>
          </div>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Agent Name</label>
              <input
                value={company.agent_name ?? ""}
                onChange={(e) => setCompany({ ...company, agent_name: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="Ana"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Greeting Message</label>
              <textarea
                value={company.greeting_message ?? ""}
                onChange={(e) => setCompany({ ...company, greeting_message: e.target.value })}
                rows={3}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder={`Thank you for calling ${company.name}! My name is ${company.agent_name || "Ana"}. How can I help you today?`}
              />
              <p className="mt-1 text-xs text-gray-400">Leave blank for the default greeting</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Recording Disclosure</label>
              <textarea
                value={company.recording_disclosure ?? "This call may be recorded for quality purposes."}
                onChange={(e) => setCompany({ ...company, recording_disclosure: e.target.value })}
                rows={2}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              <p className="mt-1 text-xs text-gray-400">Played at the start of each call</p>
            </div>
          </div>
        </div>

        {/* Service Area */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold">Service Area</h2>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Service Area Zip Codes</label>
            <textarea
              value={company.service_area_zip_codes ?? ""}
              onChange={(e) => setCompany({ ...company, service_area_zip_codes: e.target.value })}
              rows={2}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="32801, 32803, 34786"
            />
            <p className="mt-1 text-xs text-gray-400">
              Enter the zip codes your company serves, separated by commas. Leave empty to accept all areas.
            </p>
          </div>
        </div>
      </div>

      {/* ══ AGENT & CALLS TAB ═════════════════════════════════════════ */}
      <div className={`mt-6 w-full max-w-xl space-y-8 ${tab === "agent" ? "block" : "hidden"}`}>
        {/* Emergency / After-Hours */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold">Emergency / After-Hours</h2>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Configure how your Ringa receptionist handles emergency and after-hours calls.
          </p>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Emergency Mode</label>
              <select
                value={company.emergency_mode ?? "no_oncall"}
                onChange={(e) => setCompany({ ...company, emergency_mode: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="no_oncall">No On-Call</option>
                <option value="24_7_oncall">24/7 On-Call</option>
                <option value="limited_oncall">Limited On-Call</option>
              </select>
              <div className="mt-2 space-y-1">
                <p className="text-xs text-gray-400">
                  <strong>No On-Call:</strong> AI takes a message and sends an SMS to the owner.
                </p>
                <p className="text-xs text-gray-400">
                  <strong>24/7 On-Call:</strong> Transfers the call to the on-call technician at any hour.
                </p>
                <p className="text-xs text-gray-400">
                  <strong>Limited On-Call:</strong> Transfers to on-call until a specific hour, then takes a message.
                </p>
              </div>
            </div>

            {(company.emergency_mode === "24_7_oncall" || company.emergency_mode === "limited_oncall") && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">On-Call Phone</label>
                  <input
                    value={company.oncall_phone ?? ""}
                    onChange={(e) => setCompany({ ...company, oncall_phone: e.target.value })}
                    placeholder="+14075551234"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-400">Primary on-call technician phone number</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Backup Phone</label>
                  <input
                    value={company.oncall_backup_phone ?? ""}
                    onChange={(e) => setCompany({ ...company, oncall_backup_phone: e.target.value })}
                    placeholder="+14075559999"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-400">Backup number if the primary on-call does not answer</p>
                </div>
              </>
            )}

            {company.emergency_mode === "limited_oncall" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">On-Call Until</label>
                <select
                  value={company.oncall_end_hour ?? 22}
                  onChange={(e) => setCompany({ ...company, oncall_end_hour: Number(e.target.value) })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value={20}>8:00 PM</option>
                  <option value={21}>9:00 PM</option>
                  <option value={22}>10:00 PM</option>
                  <option value={23}>11:00 PM</option>
                  <option value={0}>12:00 AM (Midnight)</option>
                  <option value={1}>1:00 AM</option>
                  <option value={2}>2:00 AM</option>
                  <option value={3}>3:00 AM</option>
                  <option value={4}>4:00 AM</option>
                </select>
                <p className="mt-1 text-xs text-gray-400">After this hour, the AI will take a message instead of transferring</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══ INTEGRATIONS TAB ═══════════════════════════════════════════ */}
      <div className={`mt-6 w-full max-w-xl space-y-8 ${tab === "integrations" ? "block" : "hidden"}`}>
        {/* Ringa Phone */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold">Ringa Phone Number</h2>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Your Ringa Number</label>
            {company.twilio_phone_number ? (
              <div className="mt-1 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-mono font-semibold text-gray-800">
                {company.twilio_phone_number}
                <span className="ml-auto text-xs font-normal text-green-600 font-sans">Active</span>
              </div>
            ) : (
              <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-400">
                Not yet provisioned. Complete onboarding to get your number
              </div>
            )}
            <p className="mt-1 text-xs text-gray-400">
              This is the number customers call, managed by Ringa. Contact support to change it.
            </p>
          </div>
          <div className="mt-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={company.call_forwarding_confirmed ?? false}
                onChange={(e) => setCompany({ ...company, call_forwarding_confirmed: e.target.checked })}
                className="mt-0.5 rounded border-gray-300"
              />
              <div>
                <p className="text-sm font-medium text-gray-700">Call forwarding is set up</p>
                <p className="text-xs text-gray-400">
                  Check this once you&apos;ve configured your carrier to forward unanswered calls to your Ringa number. This dismisses the setup reminder.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Google Calendar Sync */}
        <div id="google-calendar-sync" className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold">Google Calendar Sync</h2>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Sync technician calendars to automatically block busy times and prevent double-booking.
          </p>
          <div className="mt-3 rounded-md bg-blue-50 px-3 py-2">
            <p className="text-xs text-blue-700">
              Click &quot;Send Link&quot; to SMS a setup link to the technician. They tap the link, sign in with Google, and their calendar syncs automatically.
            </p>
          </div>

          {/* Technician Calendar Status */}
          <div className="mt-4 space-y-2">
            {technicians.length === 0 ? (
              <p className="text-sm text-gray-400">No technicians added yet. Go to Technicians to add one.</p>
            ) : (
              technicians.filter(t => t.is_active).map((tech) => (
                <div key={tech.id} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{tech.name}</span>
                    {tech.calendar_provider === "google" && tech.google_calendar_id ? (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        Connected
                      </span>
                    ) : tech.calendar_provider === "google" ? (
                      <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
                        Pending
                      </span>
                    ) : tech.calendar_provider === "microsoft" ? (
                      <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                        Outlook
                      </span>
                    ) : (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                        No sync
                      </span>
                    )}
                  </div>
                  <button
                    onClick={async () => {
                      setSendingSmsTo(tech.id);
                      try {
                        await sendCalendarInstructions(tech.id);
                        setSmsSent((prev) => new Set(prev).add(tech.id));
                      } catch (e) {
                        console.error(e);
                      }
                      setSendingSmsTo(null);
                    }}
                    disabled={sendingSmsTo === tech.id || smsSent.has(tech.id) || (tech.calendar_provider === "google" && !!tech.google_calendar_id) || tech.calendar_provider !== "google"}
                    className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-500 disabled:opacity-50"
                  >
                    <Send className="h-3 w-3" />
                    {tech.calendar_provider !== "google"
                      ? "—"
                      : tech.google_calendar_id
                      ? "Connected"
                      : smsSent.has(tech.id)
                      ? "Sent!"
                      : sendingSmsTo === tech.id
                      ? "Sending..."
                      : "Send Link"}
                  </button>
                </div>
              ))
            )}
          </div>
          <p className="mt-3 text-xs text-gray-400">
            First add technicians on the Technicians page. Then click &quot;Send Setup Link&quot; here. The technician
            receives an SMS, taps the link, signs in to Google, and the calendar connects automatically.
          </p>
        </div>

        {/* END INTEGRATIONS temp close for Reviews */}
      </div>
      <div className={`mt-6 w-full max-w-xl space-y-8 ${tab === "reviews" ? "block" : "hidden"}`}>
        {/* Google Reviews */}
        <div id="reviews" className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            <h2 className="text-lg font-semibold">Customer Reviews</h2>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            After each completed service, Ringa automatically sends an SMS asking the customer to rate their experience.
            Happy customers (4+ stars) are redirected to your Google Business page. Unhappy customers are routed to you internally for resolution.
          </p>

          <div className="mt-4 space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={company.review_request_enabled ?? true}
                onChange={(e) => setCompany({ ...company, review_request_enabled: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">
                Send review request SMS after completed appointments
              </span>
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700">Google Business Review URL</label>
              <input
                value={company.google_review_url ?? ""}
                onChange={(e) => setCompany({ ...company, google_review_url: e.target.value })}
                placeholder="https://g.page/r/your-business/review"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              <p className="mt-1 text-xs text-gray-400">
                Find this link in your Google Business Profile under &quot;Ask for reviews&quot;. Customers who give 4+ stars will be redirected here.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Minimum stars to forward to Google</label>
              <select
                value={company.review_min_stars_for_google ?? 4}
                onChange={(e) => setCompany({ ...company, review_min_stars_for_google: Number(e.target.value) })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value={5}>5 stars only (most strict)</option>
                <option value={4}>4 or 5 stars (recommended)</option>
                <option value={3}>3, 4, or 5 stars</option>
              </select>
              <p className="mt-1 text-xs text-gray-400">Reviews below this threshold stay internal so you can resolve issues privately.</p>
            </div>
          </div>
        </div>

        {/* END REVIEWS temp close, reopen Integrations for Jobber */}
      </div>
      <div className={`mt-6 w-full max-w-xl space-y-8 ${tab === "integrations" ? "block" : "hidden"}`}>
        {/* Jobber Integration */}
        <div id="jobber-integration" className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold">Jobber Integration</h2>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Connect Jobber to automatically sync appointments, clients, and job details.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {jobberConnected ? (
              <>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  Connected
                </span>
                <button
                  onClick={async () => {
                    setSyncing(true);
                    setSyncResult(null);
                    try {
                      const result = await syncJobberTechnicians();
                      if (result.imported > 0) {
                        setSyncResult(`Imported ${result.imported} technician${result.imported > 1 ? "s" : ""}`);
                        getTechnicians().then(setTechnicians).catch(() => {});
                      } else {
                        setSyncResult("All technicians already synced");
                      }
                    } catch (e) {
                      setSyncResult("Sync failed");
                      console.error(e);
                    }
                    setSyncing(false);
                  }}
                  disabled={syncing}
                  className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} />
                  {syncing ? "Syncing..." : "Sync Technicians"}
                </button>
                <button
                  onClick={async () => {
                    setSyncingSchedules(true);
                    setScheduleSyncResult(null);
                    try {
                      const result = await syncJobberSchedules();
                      if (result.updated > 0) {
                        setScheduleSyncResult(`Updated schedules for ${result.updated} technician${result.updated > 1 ? "s" : ""}`);
                      } else {
                        setScheduleSyncResult("No schedule changes found");
                      }
                    } catch (e) {
                      setScheduleSyncResult("Schedule sync failed");
                      console.error(e);
                    }
                    setSyncingSchedules(false);
                  }}
                  disabled={syncingSchedules}
                  className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  <Calendar className={`h-3.5 w-3.5 ${syncingSchedules ? "animate-spin" : ""}`} />
                  {syncingSchedules ? "Syncing..." : "Sync Schedules"}
                </button>
                <button
                  onClick={async () => {
                    setJobberLoading(true);
                    try {
                      await disconnectJobber();
                      setJobberConnected(false);
                    } catch (e) {
                      console.error(e);
                    }
                    setJobberLoading(false);
                  }}
                  disabled={jobberLoading}
                  className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  <Unlink className="h-3.5 w-3.5" />
                  {jobberLoading ? "Disconnecting..." : "Disconnect"}
                </button>
              </>
            ) : (
              <a
                href={`/api/integrations/jobber/connect?token=${token}`}
                className="flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                <Link2 className="h-4 w-4" />
                Connect Jobber
              </a>
            )}
          </div>
          {syncResult && (
            <p className="mt-2 text-xs text-green-600">{syncResult}</p>
          )}
          {scheduleSyncResult && (
            <p className="mt-2 text-xs text-green-600">{scheduleSyncResult}</p>
          )}
          {searchParams.get("imported") && Number(searchParams.get("imported")) > 0 && (
            <p className="mt-2 text-sm text-green-600">
              {searchParams.get("imported")} technician{Number(searchParams.get("imported")) > 1 ? "s" : ""} imported from Jobber automatically!
            </p>
          )}
        </div>

        {/* END INTEGRATIONS temp close, reopen Agent for Call Escalation */}
      </div>
      <div className={`mt-6 w-full max-w-xl space-y-8 ${tab === "agent" ? "block" : "hidden"}`}>
        {/* Call Escalation */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-2">
            <PhoneForwarded className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold">Call Escalation</h2>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Transfer calls to a live person when the AI determines the customer genuinely needs human assistance: complex situations, complaints, or customers who are clearly frustrated.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => setCompany({ ...company, call_escalation_enabled: !company.call_escalation_enabled })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                company.call_escalation_enabled ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  company.call_escalation_enabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className="text-sm text-gray-700">
              {company.call_escalation_enabled ? "Enabled" : "Disabled"}
            </span>
          </div>

          {company.call_escalation_enabled && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Transfer to (phone number)</label>
                <input
                  value={company.escalation_phone ?? ""}
                  onChange={(e) => setCompany({ ...company, escalation_phone: e.target.value })}
                  placeholder="+14075551234"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                <p className="mt-1 text-xs text-gray-400">The phone number the AI will transfer to when escalating</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Escalation conditions (optional)</label>
                <textarea
                  value={company.escalation_conditions ?? ""}
                  onChange={(e) => setCompany({ ...company, escalation_conditions: e.target.value })}
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder="e.g. Transfer when customer mentions a warranty issue, commercial job, or has a complaint about a previous visit"
                />
                <p className="mt-1 text-xs text-gray-400">Describe specific situations that should trigger a transfer. Leave blank for the default behavior.</p>
              </div>
            </div>
          )}

          <p className="mt-3 text-xs text-gray-400">
            Changes take effect after saving and will update your AI assistant.
          </p>
        </div>

        {/* END AGENT close, reopen Integrations for status */}
      </div>
      <div className={`mt-6 w-full max-w-xl space-y-8 ${tab === "integrations" ? "block" : "hidden"}`}>
        {/* Integration Status */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Integration Status</h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Ringa AI Agent</span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${company.vapi_assistant_id ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {company.vapi_assistant_id ? "Active" : "Not Provisioned"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Ringa Phone</span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${company.twilio_phone_number ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {company.twilio_phone_number ? company.twilio_phone_number : "Not Configured"}
              </span>
            </div>
            <a href="#google-calendar-sync" className="flex items-center justify-between hover:bg-gray-50 rounded px-1 -mx-1 transition-colors">
              <span className="text-sm text-gray-600">Google Calendar</span>
              {(() => {
                const calTechs = technicians.filter(t => t.is_active && t.calendar_provider === "google");
                const totalActive = technicians.filter(t => t.is_active).length;
                return (
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${calTechs.length > 0 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {calTechs.length > 0 ? `${calTechs.length}/${totalActive} Technicians` : "Not Configured"}
                  </span>
                );
              })()}
            </a>
            <a href="#jobber-integration" className="flex items-center justify-between hover:bg-gray-50 rounded px-1 -mx-1 transition-colors">
              <span className="text-sm text-gray-600">Jobber</span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${jobberConnected ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {jobberConnected ? "Connected" : "Not Connected"}
              </span>
            </a>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Onboarding</span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${company.onboarding_completed ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                {company.onboarding_completed ? "Complete" : "Pending"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Save button — sticky across all tabs */}
      <div className="sticky bottom-0 mt-6 w-full max-w-xl border-t border-gray-100 bg-white/90 backdrop-blur-sm pt-4 pb-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-[#3B6FFF] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#2D5FE6] disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : saved ? "✓ Saved" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
