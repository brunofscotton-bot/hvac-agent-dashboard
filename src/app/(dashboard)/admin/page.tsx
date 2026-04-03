"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Users,
  Phone,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { getAdminCompanies, getAdminStats, getAdminCosts, getAdminTickets, updateAdminTicket, deleteAdminCompany, resetAdminOnboarding, deployAssistantAll } from "@/lib/api";
import type { AdminCompany, AdminPlatformStats, AdminInfraCosts, AdminTicket } from "@/lib/api";

const API_BASE = "/api";
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("hvac_token");
}

function StatCard({
  label,
  value,
  icon: Icon,
  color = "#3B6FFF",
}: {
  label: string;
  value: string | number;
  icon: any;
  color?: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status?: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    active: { bg: "bg-green-50", text: "text-green-700", label: "Active" },
    trialing: { bg: "bg-blue-50", text: "text-blue-700", label: "Trial" },
    canceled: { bg: "bg-red-50", text: "text-red-700", label: "Canceled" },
    past_due: { bg: "bg-yellow-50", text: "text-yellow-700", label: "Past Due" },
  };
  const c = config[status || ""] || { bg: "bg-gray-50", text: "text-gray-500", label: status || "None" };
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}

export default function AdminPage() {
  const [companies, setCompanies] = useState<AdminCompany[]>([]);
  const [stats, setStats] = useState<AdminPlatformStats | null>(null);
  const [costs, setCosts] = useState<AdminInfraCosts | null>(null);
  const [costsLoading, setCostsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"overview" | "costs" | "tickets">("overview");
  const [tickets, setTickets] = useState<AdminTicket[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deployLoading, setDeployLoading] = useState(false);
  const [deployResult, setDeployResult] = useState<{ updated: number; failed: number; errors: string[] } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    twilio_phone_number: "",
    vapi_assistant_id: "",
    onboarding_completed: false,
    subscription_status: "",
    is_active: true,
  });

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" and ALL its data? This also releases the Twilio number and deletes the Vapi assistant. This cannot be undone.`)) return;
    setActionLoading(id);
    try {
      await deleteAdminCompany(id);
      setCompanies((prev) => prev.filter((c) => c.id !== id));
      // Refresh stats
      const s = await getAdminStats();
      setStats(s);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleResetOnboarding = async (id: string, name: string) => {
    if (!confirm(`Reset onboarding for "${name}"? They will see the setup wizard again on next login.`)) return;
    setActionLoading(id);
    try {
      await resetAdminOnboarding(id);
      setCompanies((prev) => prev.map((c) => c.id === id ? { ...c, onboarding_completed: false } : c));
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const startEditing = (c: AdminCompany) => {
    setEditingId(c.id);
    setEditForm({
      twilio_phone_number: c.twilio_phone_number || "",
      vapi_assistant_id: "",
      onboarding_completed: c.onboarding_completed,
      subscription_status: c.subscription_status || "",
      is_active: c.is_active,
    });
  };

  const handleSaveEdit = async (id: string) => {
    setActionLoading(id);
    try {
      const token = getToken();
      const body: Record<string, any> = {};
      if (editForm.twilio_phone_number) body.twilio_phone_number = editForm.twilio_phone_number;
      if (editForm.vapi_assistant_id) body.vapi_assistant_id = editForm.vapi_assistant_id;
      body.onboarding_completed = editForm.onboarding_completed;
      body.is_active = editForm.is_active;
      if (editForm.subscription_status) body.subscription_status = editForm.subscription_status;

      const res = await fetch(`${API_BASE}/admin/companies/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error((await res.json()).detail || "Update failed");

      // Refresh
      const updated = await getAdminCompanies();
      setCompanies(updated);
      setEditingId(null);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const loadCosts = async () => {
    if (costs) return;
    setCostsLoading(true);
    try {
      const c = await getAdminCosts();
      setCosts(c);
    } catch (err: any) {
      alert("Failed to load costs: " + err.message);
    } finally {
      setCostsLoading(false);
    }
  };

  const loadTickets = async () => {
    setTicketsLoading(true);
    try {
      const t = await getAdminTickets();
      setTickets(t);
    } catch (err: any) {
      console.error(err);
    } finally {
      setTicketsLoading(false);
    }
  };

  const handleDeployAll = async () => {
    if (!confirm("Deploy the latest assistant config (prompt, tools, voice) to ALL companies?")) return;
    setDeployLoading(true);
    setDeployResult(null);
    try {
      const result = await deployAssistantAll();
      setDeployResult(result);
    } catch (err: any) {
      alert("Deploy failed: " + err.message);
    } finally {
      setDeployLoading(false);
    }
  };

  useEffect(() => {
    Promise.all([getAdminCompanies(), getAdminStats()])
      .then(([c, s]) => {
        setCompanies(c);
        setStats(s);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#3B6FFF] border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <XCircle className="mx-auto h-8 w-8 text-red-500" />
          <p className="mt-2 font-medium text-red-700">{error}</p>
          <p className="mt-1 text-sm text-red-500">Only platform admins can access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        <p className="mt-1 text-sm text-gray-500">Ringa platform overview — all companies</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard label="Total Companies" value={stats.total_companies} icon={Building2} />
          <StatCard label="Active Subs" value={stats.active_subscriptions} icon={CheckCircle} color="#10B981" />
          <StatCard label="Calls This Month" value={stats.total_calls_this_month} icon={Phone} color="#7C3FFF" />
          <StatCard label="Appts This Month" value={stats.total_appointments_this_month} icon={Calendar} color="#F59E0B" />
          <StatCard label="MRR Estimate" value={`$${stats.revenue_estimate}`} icon={DollarSign} color="#10B981" />
        </div>
      )}

      {/* Secondary stats row */}
      {stats && (
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
            <p className="text-xs text-gray-500">Active Companies</p>
            <p className="text-lg font-semibold">{stats.active_companies}</p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
            <p className="text-xs text-gray-500">Trialing</p>
            <p className="text-lg font-semibold">{stats.trialing_subscriptions}</p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
            <p className="text-xs text-gray-500">Onboarded</p>
            <p className="text-lg font-semibold">{stats.onboarding_completed_count}</p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
            <p className="text-xs text-gray-500">Total Technicians</p>
            <p className="text-lg font-semibold">{stats.total_technicians}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-lg bg-gray-100 p-1 w-fit">
        <button
          onClick={() => setTab("overview")}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            tab === "overview" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Companies
        </button>
        <button
          onClick={() => { setTab("costs"); loadCosts(); }}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            tab === "costs" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Infrastructure Costs
        </button>
        <button
          onClick={() => { setTab("tickets"); loadTickets(); }}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            tab === "tickets" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Support Tickets {tickets.filter(t => t.status === "open").length > 0 && (
            <span className="ml-1 rounded-full bg-red-500 px-1.5 py-0.5 text-xs text-white">
              {tickets.filter(t => t.status === "open").length}
            </span>
          )}
        </button>
      </div>

      {/* Costs tab */}
      {tab === "costs" && (
        <div className="rounded-xl border border-gray-200 bg-white">
          {costsLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-[#3B6FFF] border-t-transparent" />
            </div>
          ) : costs ? (
            <>
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="font-semibold text-gray-900">
                  Infrastructure Costs — {costs.period}
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-4">
                <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
                  <p className="text-xs text-gray-500">Twilio Numbers</p>
                  <p className="text-lg font-semibold">{costs.twilio_phone_numbers}</p>
                  <p className="text-xs text-gray-400">${costs.twilio_number_cost.toFixed(2)}/mo</p>
                </div>
                <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
                  <p className="text-xs text-gray-500">Twilio Calls</p>
                  <p className="text-lg font-semibold">{costs.twilio_call_minutes.toFixed(1)} min</p>
                  <p className="text-xs text-gray-400">${costs.twilio_call_cost.toFixed(2)}</p>
                </div>
                <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
                  <p className="text-xs text-gray-500">Vapi AI Calls</p>
                  <p className="text-lg font-semibold">{costs.vapi_call_count}</p>
                  <p className="text-xs text-gray-400">${costs.vapi_total_cost.toFixed(2)}</p>
                </div>
                <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
                  <p className="text-xs text-blue-600 font-medium">Total Cost</p>
                  <p className="text-2xl font-bold text-blue-700">${costs.total_cost.toFixed(2)}</p>
                  <p className="text-xs text-blue-500">this month</p>
                </div>
              </div>

              {/* Per-company breakdown */}
              {costs.per_company.length > 0 && (
                <div className="border-t border-gray-200 px-6 py-4">
                  <h3 className="mb-3 text-sm font-semibold text-gray-700">Cost per Company</h3>
                  <div className="divide-y divide-gray-100">
                    {costs.per_company.map((cc) => (
                      <div key={cc.company_id} className="flex items-center justify-between py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{cc.company_name}</p>
                          <p className="text-xs text-gray-400 font-mono">{cc.phone_number}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">${cc.estimated_cost.toFixed(2)}</p>
                          <p className="text-xs text-gray-400">{cc.call_count} calls</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="px-6 py-12 text-center text-gray-500">Failed to load costs.</div>
          )}
        </div>
      )}

      {/* Tickets tab */}
      {tab === "tickets" && (
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="font-semibold text-gray-900">Support Tickets ({tickets.length})</h2>
          </div>
          {ticketsLoading ? (
            <div className="px-6 py-12 text-center text-gray-500">Loading tickets...</div>
          ) : tickets.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-400">No support tickets yet.</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="px-6 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{ticket.subject}</p>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          ticket.status === "open" ? "bg-red-100 text-red-700"
                          : ticket.status === "in_progress" ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                        }`}>
                          {ticket.status}
                        </span>
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                          {ticket.category}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{ticket.message}</p>
                      <p className="mt-1 text-xs text-gray-400">
                        {ticket.company_name} ({ticket.company_email}) — {new Date(ticket.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      {ticket.status === "open" && (
                        <button
                          onClick={async () => {
                            await updateAdminTicket(ticket.id, { status: "in_progress" });
                            loadTickets();
                          }}
                          className="rounded-lg border border-yellow-300 px-2 py-1 text-xs text-yellow-700 hover:bg-yellow-50"
                        >
                          In Progress
                        </button>
                      )}
                      {ticket.status !== "resolved" && (
                        <button
                          onClick={async () => {
                            await updateAdminTicket(ticket.id, { status: "resolved" });
                            loadTickets();
                          }}
                          className="rounded-lg border border-green-300 px-2 py-1 text-xs text-green-700 hover:bg-green-50"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Companies table */}
      {tab === "overview" && (
      <>
      {/* Deploy Assistant Update */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Deploy Assistant Update</h3>
            <p className="text-sm text-gray-500">Push the latest prompt, tools, and voice config to all Vapi assistants.</p>
          </div>
          <button
            onClick={handleDeployAll}
            disabled={deployLoading}
            className="rounded-lg bg-[#3B6FFF] px-5 py-2 text-sm font-medium text-white hover:bg-[#2D5FE6] disabled:opacity-50"
          >
            {deployLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Deploying...
              </span>
            ) : (
              "Deploy to All Companies"
            )}
          </button>
        </div>
        {deployResult && (
          <div className={`mt-3 rounded-lg px-4 py-3 text-sm ${
            deployResult.failed === 0 ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
          }`}>
            <p className="font-medium">
              {deployResult.updated} updated, {deployResult.failed} failed
            </p>
            {deployResult.errors.length > 0 && (
              <ul className="mt-1 list-disc pl-5 text-xs">
                {deployResult.errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="font-semibold text-gray-900">
            Companies ({companies.length})
          </h2>
        </div>

        {companies.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">
            No companies registered yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {companies.map((c) => {
              const expanded = expandedId === c.id;
              return (
                <div key={c.id}>
                  <button
                    onClick={() => setExpandedId(expanded ? null : c.id)}
                    className="flex w-full items-center gap-4 px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3B6FFF]/10 text-sm font-bold text-[#3B6FFF] shrink-0">
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 truncate">{c.name}</p>
                        <StatusBadge status={c.subscription_status} />
                        {c.onboarding_completed && (
                          <span className="text-xs text-green-600">✓ Onboarded</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">{c.email}</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-6 text-sm text-gray-500 shrink-0">
                      <span title="Technicians" className="flex items-center gap-1">
                        <Users className="h-4 w-4" /> {c.technician_count}
                      </span>
                      <span title="Appointments" className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" /> {c.appointment_count}
                      </span>
                      <span title="Calls" className="flex items-center gap-1">
                        <Phone className="h-4 w-4" /> {c.call_count}
                      </span>
                    </div>
                    {expanded ? (
                      <ChevronUp className="h-4 w-4 text-gray-400 shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
                    )}
                  </button>

                  {expanded && (
                    <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                          <p className="text-xs font-medium text-gray-400 uppercase">Contact</p>
                          <p className="mt-1 text-sm">{c.phone || "—"}</p>
                          <p className="text-sm text-gray-500">{c.city}, {c.state}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-400 uppercase">Phone Number</p>
                          <p className="mt-1 text-sm font-mono">{c.twilio_phone_number || "Not provisioned"}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-400 uppercase">Plan</p>
                          <p className="mt-1 text-sm capitalize">{c.subscription_plan || "None"}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-400 uppercase">Technicians</p>
                          <p className="mt-1 text-sm">{c.technician_count}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-400 uppercase">Total Appointments</p>
                          <p className="mt-1 text-sm">{c.appointment_count}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-400 uppercase">Total Calls</p>
                          <p className="mt-1 text-sm">{c.call_count}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-400 uppercase">Registered</p>
                          <p className="mt-1 text-sm">{new Date(c.created_at).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-400 uppercase">Status</p>
                          <div className="mt-1 flex items-center gap-2">
                            {c.is_active ? (
                              <span className="flex items-center gap-1 text-sm text-green-600">
                                <CheckCircle className="h-4 w-4" /> Active
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-sm text-red-500">
                                <XCircle className="h-4 w-4" /> Inactive
                              </span>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-400 uppercase">Company ID</p>
                          <p className="mt-1 text-xs font-mono text-gray-400 break-all">{c.id}</p>
                        </div>
                      </div>

                      {/* Edit form */}
                      {editingId === c.id ? (
                        <div className="mt-4 border-t border-gray-200 pt-4">
                          <p className="text-xs font-semibold text-gray-600 uppercase mb-3">Edit Company</p>
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Twilio Phone Number</label>
                              <input
                                value={editForm.twilio_phone_number}
                                onChange={(e) => setEditForm({ ...editForm, twilio_phone_number: e.target.value })}
                                className="w-full rounded border border-gray-300 px-2.5 py-1.5 text-sm font-mono"
                                placeholder="+1321XXXXXXX"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Vapi Assistant ID</label>
                              <input
                                value={editForm.vapi_assistant_id}
                                onChange={(e) => setEditForm({ ...editForm, vapi_assistant_id: e.target.value })}
                                className="w-full rounded border border-gray-300 px-2.5 py-1.5 text-sm font-mono"
                                placeholder="uuid"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Subscription Status</label>
                              <select
                                value={editForm.subscription_status}
                                onChange={(e) => setEditForm({ ...editForm, subscription_status: e.target.value })}
                                className="w-full rounded border border-gray-300 px-2.5 py-1.5 text-sm"
                              >
                                <option value="">None</option>
                                <option value="active">Active</option>
                                <option value="trialing">Trialing</option>
                                <option value="canceled">Canceled</option>
                                <option value="past_due">Past Due</option>
                              </select>
                            </div>
                            <div className="flex items-center gap-4 pt-4">
                              <label className="flex items-center gap-2 text-sm">
                                <input
                                  type="checkbox"
                                  checked={editForm.onboarding_completed}
                                  onChange={(e) => setEditForm({ ...editForm, onboarding_completed: e.target.checked })}
                                />
                                Onboarded
                              </label>
                              <label className="flex items-center gap-2 text-sm">
                                <input
                                  type="checkbox"
                                  checked={editForm.is_active}
                                  onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                                />
                                Active
                              </label>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center gap-2">
                            <button
                              onClick={() => handleSaveEdit(c.id)}
                              disabled={actionLoading === c.id}
                              className="rounded-lg bg-[#3B6FFF] px-4 py-1.5 text-xs font-medium text-white hover:bg-[#2D5FE6] disabled:opacity-50"
                            >
                              {actionLoading === c.id ? "Saving..." : "Save Changes"}
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="rounded-lg border border-gray-300 px-4 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-4 flex items-center gap-3 border-t border-gray-200 pt-4">
                          <button
                            onClick={() => startEditing(c)}
                            className="rounded-lg border border-[#3B6FFF]/30 bg-[#3B6FFF]/5 px-3 py-1.5 text-xs font-medium text-[#3B6FFF] hover:bg-[#3B6FFF]/10"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleResetOnboarding(c.id, c.name)}
                            disabled={actionLoading === c.id}
                            className="rounded-lg border border-yellow-300 bg-yellow-50 px-3 py-1.5 text-xs font-medium text-yellow-700 hover:bg-yellow-100 disabled:opacity-50"
                          >
                            {actionLoading === c.id ? "..." : "Reset Onboarding"}
                          </button>
                          <button
                            onClick={() => handleDelete(c.id, c.name)}
                            disabled={actionLoading === c.id}
                            className="rounded-lg border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
                          >
                            {actionLoading === c.id ? "Deleting..." : "Delete Company"}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      </>
      )}
    </div>
  );
}
