"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Phone,
  TrendingUp,
  TrendingDown,
  Clock,
  MapPin,
  ArrowUpRight,
  Megaphone,
  Star,
  CheckCircle2,
  BarChart3,
} from "lucide-react";
import {
  getDashboardStats,
  getTodayAppointments,
  getLeadSourceStats,
  type DashboardStats,
  type Appointment,
  type LeadSourceStats,
} from "@/lib/api";

function StatRow({
  label,
  value,
  color = "default",
}: {
  label: string;
  value: string;
  color?: "default" | "green" | "blue";
}) {
  const colorClass =
    color === "green" ? "text-green-600" : color === "blue" ? "text-[#3B6FFF]" : "text-gray-900";
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">{label}</p>
      <p className={`mt-1 text-xl font-bold tabular-nums ${colorClass}`}>{value}</p>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [todayAppts, setTodayAppts] = useState<Appointment[]>([]);
  const [leadSources, setLeadSources] = useState<LeadSourceStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDashboardStats(),
      getTodayAppointments(),
      getLeadSourceStats().catch(() => null),
    ])
      .then(([s, a, l]) => {
        setStats(s);
        setTodayAppts(a);
        setLeadSources(l);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-44 rounded-2xl bg-gray-100 animate-pulse" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-56 rounded-xl bg-gray-100 animate-pulse" />
          <div className="h-56 rounded-xl bg-gray-100 animate-pulse" />
        </div>
        <div className="h-48 rounded-xl bg-gray-100 animate-pulse" />
      </div>
    );
  }

  const monthRevenue = stats?.month_revenue ?? 0;
  const trendPct = stats?.revenue_trend_pct;
  const todayRev = stats?.today_revenue ?? 0;
  const weekRev = stats?.week_revenue ?? 0;
  const totalCalls = stats?.month_calls ?? 0;
  const bookings = stats?.month_bookings ?? 0;
  const convRate = stats?.conversion_rate ?? 0;

  return (
    <div className="space-y-6">
      {/* ── Hero: Revenue ──────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-[#3B6FFF] to-[#6B5FFF] p-6 text-white shadow-sm sm:p-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 0%, transparent 40%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 40%)",
          }}
        />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-white/70">Revenue this month</p>
            <div className="mt-1 flex items-baseline gap-3">
              <h2 className="text-4xl font-bold tabular-nums sm:text-5xl">
                ${monthRevenue.toLocaleString()}
              </h2>
              {trendPct != null && (
                <div
                  className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                    trendPct >= 0 ? "bg-white/20 text-green-200" : "bg-white/20 text-red-200"
                  }`}
                >
                  {trendPct >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {trendPct >= 0 ? "+" : ""}
                  {trendPct}%
                </div>
              )}
            </div>
            {(stats?.prev_month_revenue ?? 0) > 0 && (
              <p className="mt-2 text-sm text-white/60">
                vs ${(stats?.prev_month_revenue ?? 0).toLocaleString()} last month
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-5 text-right sm:gap-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-white/60">Today</p>
              <p className="mt-1 text-xl font-bold tabular-nums">${todayRev.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-white/60">This week</p>
              <p className="mt-1 text-xl font-bold tabular-nums">${weekRev.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Call impact + Quick actions ─────────────────────────────── */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Calls card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Calls handled by Ringa
              </p>
              <p className="mt-2 text-4xl font-bold tabular-nums text-gray-900">{totalCalls}</p>
              <p className="mt-1 text-sm text-gray-500">this month</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#3B6FFF]/10 text-[#3B6FFF]">
              <Phone className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-4 border-t border-gray-100 pt-4">
            <StatRow label="Booked" value={`${bookings}`} color="green" />
            <StatRow label="Conv." value={`${convRate}%`} color="blue" />
            <StatRow
              label="Callbacks"
              value={`${stats?.callbacks_pending ?? 0}`}
              color={(stats?.callbacks_pending ?? 0) > 0 ? "green" : "default"}
            />
          </div>

          {totalCalls > 0 && (
            <div className="mt-5 flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 p-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
              <p className="text-xs font-medium text-green-800">
                {totalCalls} {totalCalls === 1 ? "call answered that would have" : "calls answered that would have"} gone to voicemail
              </p>
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Quick actions</p>

          <div className="mt-4 space-y-2">
            {[
              {
                href: "/appointments",
                icon: Calendar,
                title: "View all appointments",
                sub: `${stats?.week_appointments ?? 0} this week`,
              },
              {
                href: "/calls",
                icon: Phone,
                title: "Call history",
                sub: `${totalCalls} this month`,
              },
              {
                href: "/campaigns",
                icon: Megaphone,
                title: "Launch campaign",
                sub: "Reactivate inactive customers",
              },
              {
                href: "/reviews",
                icon: Star,
                title: "Customer reviews",
                sub: "Track feedback",
              },
            ].map(({ href, icon: Icon, title, sub }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/50 p-3 hover:border-[#3B6FFF]/30 hover:bg-[#3B6FFF]/5 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-[#3B6FFF] group-hover:bg-[#3B6FFF] group-hover:text-white group-hover:border-[#3B6FFF] transition-colors shrink-0">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{title}</p>
                    <p className="text-xs text-gray-500 truncate">{sub}</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-gray-300 group-hover:text-[#3B6FFF] shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Today's Schedule ────────────────────────────────────────── */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Today&apos;s schedule</h2>
            <p className="text-xs text-gray-500">
              {todayAppts.length === 0
                ? "No appointments for today"
                : `${todayAppts.length} appointment${todayAppts.length > 1 ? "s" : ""} scheduled`}
            </p>
          </div>
          <Link
            href="/appointments"
            className="flex items-center gap-1 text-xs font-medium text-[#3B6FFF] hover:underline"
          >
            View all
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>

        {todayAppts.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-12">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
              <Calendar className="h-6 w-6 text-gray-400" />
            </div>
            <p className="mt-4 text-sm font-medium text-gray-700">
              Nothing on the schedule today
            </p>
            <p className="mt-1 max-w-sm text-center text-xs text-gray-500">
              When Ringa books a job, it will appear here automatically with customer details
              and technician assignment.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {todayAppts.map((appt) => (
              <Link
                key={appt.id}
                href={`/appointments/${appt.id}`}
                className="flex flex-col gap-3 px-6 py-4 hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="flex flex-col items-center justify-center rounded-lg bg-[#3B6FFF]/10 px-3 py-2 shrink-0">
                    <Clock className="h-4 w-4 text-[#3B6FFF]" />
                    <span className="mt-1 text-xs font-bold text-[#3B6FFF] tabular-nums">
                      {new Date(appt.scheduled_date).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 truncate">
                      {appt.customer?.name ?? "Unknown"}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {appt.problem_description}
                    </p>
                    <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate">
                        {appt.customer?.address ?? "No address"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:flex-col sm:items-end">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      appt.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : appt.status === "in_progress"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {appt.status}
                  </span>
                  <p className="text-xs text-gray-500 sm:mt-1">
                    {appt.technician?.name ?? "Unassigned"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ── Lead sources (only show if there's data) ────────────────── */}
      {leadSources && leadSources.sources.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Where your customers come from</h2>
              <p className="text-xs text-gray-500">
                Based on {leadSources.total} recent appointment{leadSources.total > 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <BarChart3 className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {leadSources.sources.slice(0, 5).map((s) => (
              <div key={s.source}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium text-gray-700 capitalize">{s.source}</span>
                  <span className="text-gray-500 tabular-nums">
                    {s.count} · {s.percentage}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-400"
                    style={{ width: `${s.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
