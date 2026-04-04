"use client";

import { useEffect, useState } from "react";
import { Calendar, Phone, DollarSign, TrendingUp, Clock, MapPin, PhoneForwarded } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { getDashboardStats, getTodayAppointments, type DashboardStats, type Appointment } from "@/lib/api";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [todayAppts, setTodayAppts] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDashboardStats(), getTodayAppointments()])
      .then(([s, a]) => {
        setStats(s);
        setTodayAppts(a);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-gray-400">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-gray-500">Overview of your HVAC service operations</p>

      {/* Stats Grid */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          title="Today's Appointments"
          value={stats?.today_appointments ?? 0}
          icon={Calendar}
          color="blue"
        />
        <StatCard
          title="Calls This Month"
          value={stats?.month_calls ?? 0}
          icon={Phone}
          color="green"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${(stats?.month_revenue ?? 0).toLocaleString()}`}
          icon={DollarSign}
          subtitle={stats?.week_revenue != null ? `$${stats.week_revenue.toLocaleString()} this week` : undefined}
          color="orange"
        />
        <StatCard
          title="Conversion Rate"
          value={`${stats?.conversion_rate ?? 0}%`}
          icon={TrendingUp}
          subtitle={`${stats?.month_bookings ?? 0} bookings from calls`}
          color="purple"
        />
        {stats?.callbacks_pending != null && stats.callbacks_pending > 0 && (
          <StatCard
            title="Callbacks Pending"
            value={stats.callbacks_pending}
            icon={PhoneForwarded}
            color="orange"
          />
        )}
      </div>

      {/* Today's Schedule */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold">Today&apos;s Schedule</h2>
        <div className="mt-4 space-y-3">
          {todayAppts.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-400">
              No appointments scheduled for today
            </div>
          ) : (
            todayAppts.map((appt) => (
              <div
                key={appt.id}
                className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center rounded-lg bg-blue-50 px-3 py-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="mt-1 text-sm font-semibold text-blue-700">
                      {new Date(appt.scheduled_date).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{appt.customer?.name ?? "Unknown"}</p>
                    <p className="text-sm text-gray-500">{appt.problem_description}</p>
                    <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                      <MapPin className="h-3 w-3" />
                      {appt.customer?.address ?? "No address"}
                    </div>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-sm font-medium">{appt.technician?.name ?? "Unassigned"}</p>
                  <span
                    className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      appt.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : appt.status === "in_progress"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {appt.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
