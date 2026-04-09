"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { getAppointments, type Appointment, type PaginatedResponse } from "@/lib/api";

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-700",
  confirmed: "bg-indigo-100 text-indigo-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  no_show: "bg-gray-100 text-gray-700",
};

const urgencyColors: Record<string, string> = {
  low: "text-gray-500",
  normal: "text-blue-600",
  high: "text-orange-600",
  emergency: "text-red-600 font-bold",
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function formatTime(d: string) {
  return new Date(d).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export default function AppointmentsPage() {
  const [data, setData] = useState<PaginatedResponse<Appointment> | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(page));
    if (statusFilter) params.set("status", statusFilter);

    getAppointments(params.toString())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, statusFilter]);

  const items = data?.items ?? [];

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Appointments</h1>
          <p className="mt-1 text-gray-500">Manage all service appointments</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-4 flex gap-3 sm:mt-6">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
        >
          <option value="">All Statuses</option>
          <option value="scheduled">Scheduled</option>
          <option value="confirmed">Confirmed</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Mobile cards */}
      <div className="mt-4 block sm:hidden space-y-3">
        {loading ? (
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-400">Loading...</div>
        ) : items.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-400">
            No appointments found
          </div>
        ) : (
          items.map((appt) => (
            <Link
              key={appt.id}
              href={`/appointments/${appt.id}`}
              className="block rounded-lg border border-gray-200 bg-white p-4 hover:bg-gray-50"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate">{appt.customer?.name ?? "Unknown"}</p>
                  <p className="text-sm text-gray-500 truncate">{appt.problem_description}</p>
                  <p className="mt-1 text-xs text-gray-400 truncate">{appt.customer?.address}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold text-[#3B6FFF]">{formatDate(appt.scheduled_date)}</p>
                  <p className="text-xs text-gray-500">{formatTime(appt.scheduled_date)}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[appt.status] ?? ""}`}>
                  {appt.status}
                </span>
                <span className={`text-xs ${urgencyColors[appt.urgency] ?? ""}`}>{appt.urgency}</span>
                <span className="ml-auto text-xs text-gray-500">
                  {appt.technician?.name ?? "Unassigned"} &middot; ${appt.visit_fee}
                  {appt.is_after_hours && <span className="ml-1 text-orange-500">AH</span>}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Desktop table */}
      <div className="mt-4 hidden sm:block overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-[700px] w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-600">Date & Time</th>
              <th className="px-4 py-3 font-medium text-gray-600">Customer</th>
              <th className="px-4 py-3 font-medium text-gray-600">Problem</th>
              <th className="px-4 py-3 font-medium text-gray-600">Technician</th>
              <th className="px-4 py-3 font-medium text-gray-600">Fee</th>
              <th className="px-4 py-3 font-medium text-gray-600">Urgency</th>
              <th className="px-4 py-3 font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">Loading...</td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">No appointments found</td>
              </tr>
            ) : (
              items.map((appt) => (
                <tr key={appt.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link href={`/appointments/${appt.id}`} className="text-blue-600 hover:underline">
                      {formatDate(appt.scheduled_date)}{" "}{formatTime(appt.scheduled_date)}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{appt.customer?.name}</p>
                    <p className="text-xs text-gray-400">{appt.customer?.phone}</p>
                  </td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-gray-600">
                    {appt.problem_description}
                  </td>
                  <td className="px-4 py-3">{appt.technician?.name ?? "—"}</td>
                  <td className="px-4 py-3">
                    ${appt.visit_fee}
                    {appt.is_after_hours && (
                      <span className="ml-1 text-xs text-orange-500">AH</span>
                    )}
                  </td>
                  <td className={`px-4 py-3 ${urgencyColors[appt.urgency] ?? ""}`}>
                    {appt.urgency}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[appt.status] ?? ""}`}>
                      {appt.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data && data.total > data.per_page && (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            Showing {(page - 1) * data.per_page + 1}–{Math.min(page * data.per_page, data.total)} of {data.total}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page * data.per_page >= data.total}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
