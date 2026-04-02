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
import { getAdminCompanies, getAdminStats } from "@/lib/api";
import type { AdminCompany, AdminPlatformStats } from "@/lib/api";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

      {/* Companies table */}
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
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
