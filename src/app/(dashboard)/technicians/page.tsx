"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Clock,
  CalendarOff,
  Save,
  ChevronDown,
  ChevronUp,
  Link2,
  RefreshCw,
} from "lucide-react";
import {
  getTechnicians,
  createTechnician,
  updateTechnician,
  deleteTechnician,
  getTechnicianSchedule,
  updateTechnicianSchedule,
  getTechnicianTimeOff,
  addTechnicianTimeOff,
  deleteTechnicianTimeOff,
  getJobberStatus,
  syncJobberTechnicians,
  type Technician,
  type WorkingHoursDay,
  type TimeOffBlock,
} from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { EmptyState, SkeletonRows } from "@/components/empty-state";
import { Users } from "lucide-react";

const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function formatHour(h: number): string {
  if (h === 0) return "12 AM";
  if (h < 12) return `${h} AM`;
  if (h === 12) return "12 PM";
  return `${h - 12} PM`;
}

export default function TechniciansPage() {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [jobberConnected, setJobberConnected] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const { token } = useAuth();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    calendar_provider: "none",
    specialties: "",
    works_after_hours: false,
    works_weekends: false,
  });

  const loadTechnicians = () => {
    setLoading(true);
    getTechnicians()
      .then(setTechnicians)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTechnicians();
    getJobberStatus()
      .then((s) => setJobberConnected(s.connected))
      .catch(() => {});
  }, []);

  const resetForm = () => {
    setForm({
      name: "", phone: "", email: "",
      calendar_provider: "none", specialties: "",
      works_after_hours: false, works_weekends: false,
    });
    setShowForm(false);
    setEditId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      await updateTechnician(editId, form);
    } else {
      await createTechnician(form);
    }
    resetForm();
    loadTechnicians();
  };

  const handleEdit = (tech: Technician) => {
    setForm({
      name: tech.name,
      phone: tech.phone,
      email: tech.email ?? "",
      calendar_provider: tech.calendar_provider ?? "none",
      specialties: tech.specialties ?? "",
      works_after_hours: tech.works_after_hours,
      works_weekends: tech.works_weekends,
    });
    setEditId(tech.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Deactivate this technician?")) {
      await deleteTechnician(id);
      loadTechnicians();
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Technicians</h1>
          <p className="mt-1 text-gray-500">Manage technicians, schedules, and calendar sync</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 sm:w-auto"
        >
          <Plus className="h-4 w-4" /> Add Technician
        </button>
      </div>

      {/* Jobber Import Banner */}
      {!loading && (
        <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">
                {jobberConnected
                  ? "Jobber is connected. Sync your technicians automatically"
                  : "Use Jobber? Connect it to import your active technicians automatically"}
              </p>
              <p className="mt-0.5 text-xs text-green-600">
                {jobberConnected
                  ? "Click \"Sync from Jobber\" to import any new team members."
                  : "No need to add technicians manually. We'll pull them from your Jobber account."}
              </p>
            </div>
            {jobberConnected ? (
              <button
                onClick={async () => {
                  setSyncing(true);
                  setSyncResult(null);
                  try {
                    const result = await syncJobberTechnicians();
                    if (result.imported > 0) {
                      setSyncResult(`Imported ${result.imported} technician${result.imported > 1 ? "s" : ""}!`);
                      loadTechnicians();
                    } else {
                      setSyncResult("All technicians already synced");
                    }
                  } catch (e: any) {
                    setSyncResult(e?.message || "Sync failed. Try disconnecting and reconnecting Jobber in Settings");
                  }
                  setSyncing(false);
                }}
                disabled={syncing}
                className="flex shrink-0 items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
                {syncing ? "Syncing..." : "Sync from Jobber"}
              </button>
            ) : (
              <a
                href={`/api/integrations/jobber/connect?token=${token}`}
                className="flex shrink-0 items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                <Link2 className="h-4 w-4" />
                Connect Jobber
              </a>
            )}
          </div>
          {syncResult && (
            <p className={`mt-2 text-xs font-medium ${syncResult.includes("failed") || syncResult.includes("disconnect") ? "text-red-600" : "text-green-700"}`}>{syncResult}</p>
          )}
        </div>
      )}

      {/* Create/Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="font-semibold">{editId ? "Edit" : "Add"} Technician</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input required placeholder="Name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            <input required placeholder="Phone (+1...)" value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            <input placeholder="Email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            <select value={form.calendar_provider}
              onChange={(e) => setForm({ ...form, calendar_provider: e.target.value })}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option value="none">No Calendar Sync</option>
              <option value="google">Google Calendar</option>
              <option value="microsoft">Microsoft Outlook</option>
            </select>
            {form.calendar_provider === "google" && (
              <div className="col-span-full">
                <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs text-blue-800">
                  <p className="font-medium">Next step: Send setup link to the technician</p>
                  <p className="mt-1">
                    After saving, go to <span className="font-semibold">Settings → Google Calendar Sync</span> and click
                    &quot;Send Setup Link&quot;. The technician will receive an SMS. They just tap the link,
                    sign in to Google, and their calendar connects automatically.
                  </p>
                </div>
              </div>
            )}
            {form.calendar_provider === "microsoft" && (
              <p className="col-span-full text-sm text-gray-500">
                Microsoft Outlook sync will be connected after saving.
              </p>
            )}
            <input placeholder="Specialties (AC, Heating, Duct)" value={form.specialties}
              onChange={(e) => setForm({ ...form, specialties: e.target.value })}
              className="col-span-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.works_after_hours}
                onChange={(e) => setForm({ ...form, works_after_hours: e.target.checked })}
                className="rounded border-gray-300" />
              Works after hours
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.works_weekends}
                onChange={(e) => setForm({ ...form, works_weekends: e.target.checked })}
                className="rounded border-gray-300" />
              Works weekends
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              {editId ? "Save Changes" : "Add Technician"}
            </button>
            <button type="button" onClick={resetForm} className="rounded-lg border border-gray-300 px-4 py-2 text-sm">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Technician List */}
      <div className="mt-6 space-y-3">
        {loading ? (
          <SkeletonRows count={4} />
        ) : technicians.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white">
            <EmptyState
              icon={Users}
              title="No technicians added yet"
              description="Add your team so Ringa can dispatch them to jobs"
              actionLabel="Add technician"
              onAction={() => { resetForm(); setShowForm(true); }}
            />
          </div>
        ) : (
          technicians.map((tech) => (
            <div key={tech.id} className="rounded-lg border border-gray-200 bg-white">
              {/* Header */}
              <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{tech.name}</p>
                    {!tech.is_active && (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">Inactive</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">{tech.phone} {tech.email && `| ${tech.email}`}</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {tech.specialties && <span className="text-xs text-gray-400">{tech.specialties}</span>}
                    {tech.works_after_hours && <span className="rounded bg-orange-100 px-1.5 py-0.5 text-xs text-orange-600">After Hours</span>}
                    {tech.works_weekends && <span className="rounded bg-purple-100 px-1.5 py-0.5 text-xs text-purple-600">Weekends</span>}
                    {tech.calendar_provider === "google" && <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-600">Google Calendar</span>}
                    {tech.calendar_provider === "microsoft" && <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-xs text-indigo-600">Outlook</span>}
                    {(!tech.calendar_provider || tech.calendar_provider === "none") && <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">No Calendar Sync</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setExpandedId(expandedId === tech.id ? null : tech.id)}
                    className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs hover:bg-gray-50">
                    <Clock className="h-3.5 w-3.5" /> Schedule
                    {expandedId === tech.id ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>
                  <button onClick={() => handleEdit(tech)} className="rounded-lg border border-gray-300 p-2 hover:bg-gray-50">
                    <Pencil className="h-4 w-4 text-gray-500" />
                  </button>
                  <button onClick={() => handleDelete(tech.id)} className="rounded-lg border border-gray-300 p-2 hover:bg-gray-50">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>

              {/* Schedule Panel */}
              {expandedId === tech.id && <SchedulePanel technicianId={tech.id} />}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── Schedule Panel ──────────────────────────────────────────────────────────

function SchedulePanel({ technicianId }: { technicianId: string }) {
  const [schedule, setSchedule] = useState<WorkingHoursDay[]>([]);
  const [timeOff, setTimeOff] = useState<TimeOffBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newTimeOff, setNewTimeOff] = useState({ date: "", note: "" });

  useEffect(() => {
    Promise.all([
      getTechnicianSchedule(technicianId),
      getTechnicianTimeOff(technicianId),
    ])
      .then(([s, t]) => {
        const full: WorkingHoursDay[] = Array.from({ length: 7 }, (_, i) => {
          const existing = s.find((d: WorkingHoursDay) => d.day_of_week === i);
          return existing || { day_of_week: i, is_working: i < 5, start_hour: 8, start_minute: 0, end_hour: 17, end_minute: 0 };
        });
        setSchedule(full);
        setTimeOff(t);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [technicianId]);

  const updateDay = (dayIndex: number, field: string, value: any) => {
    setSchedule((s) => s.map((d) => (d.day_of_week === dayIndex ? { ...d, [field]: value } : d)));
    setSaved(false);
  };

  const handleSaveSchedule = async () => {
    setSaving(true);
    try {
      await updateTechnicianSchedule(technicianId, schedule);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleAddTimeOff = async () => {
    if (!newTimeOff.date) return;
    try {
      await addTechnicianTimeOff(technicianId, {
        date: newTimeOff.date, all_day: true, reason: "blocked",
        note: newTimeOff.note || undefined,
      });
      setNewTimeOff({ date: "", note: "" });
      const t = await getTechnicianTimeOff(technicianId);
      setTimeOff(t);
    } catch (err) { console.error(err); }
  };

  const handleDeleteTimeOff = async (id: string) => {
    try {
      await deleteTechnicianTimeOff(technicianId, id);
      setTimeOff((t) => t.filter((b) => b.id !== id));
    } catch (err) { console.error(err); }
  };

  if (loading) {
    return (
      <div className="border-t border-gray-200 p-4">
        <SkeletonRows count={3} />
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 p-4">
      {/* Working Hours Grid */}
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-gray-600" />
        <h4 className="text-sm font-semibold">Working Hours</h4>
      </div>
      <div className="mt-3 space-y-2 overflow-x-auto">
        {schedule.map((day) => (
          <div key={day.day_of_week} className="flex items-center gap-3 text-sm min-w-[340px]">
            <label className="flex w-28 shrink-0 items-center gap-2">
              <input type="checkbox" checked={day.is_working}
                onChange={(e) => updateDay(day.day_of_week, "is_working", e.target.checked)}
                className="rounded border-gray-300" />
              <span className={day.is_working ? "font-medium" : "text-gray-400 line-through"}>
                {DAY_NAMES[day.day_of_week]}
              </span>
            </label>
            {day.is_working ? (
              <>
                <select value={day.start_hour}
                  onChange={(e) => updateDay(day.day_of_week, "start_hour", Number(e.target.value))}
                  className="rounded border border-gray-300 px-2 py-1 text-xs">
                  {HOURS.map((h) => <option key={h} value={h}>{formatHour(h)}</option>)}
                </select>
                <span className="text-gray-400">to</span>
                <select value={day.end_hour}
                  onChange={(e) => updateDay(day.day_of_week, "end_hour", Number(e.target.value))}
                  className="rounded border border-gray-300 px-2 py-1 text-xs">
                  {HOURS.map((h) => <option key={h} value={h}>{formatHour(h)}</option>)}
                </select>
              </>
            ) : (
              <span className="text-xs text-gray-400">Day off</span>
            )}
          </div>
        ))}
      </div>
      <button onClick={handleSaveSchedule} disabled={saving}
        className="mt-3 flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50">
        <Save className="h-3.5 w-3.5" />
        {saving ? "Saving..." : saved ? "Saved!" : "Save Schedule"}
      </button>

      {/* Time Off */}
      <div className="mt-6 flex items-center gap-2">
        <CalendarOff className="h-4 w-4 text-gray-600" />
        <h4 className="text-sm font-semibold">Time Off / Blocked Dates</h4>
      </div>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input type="date" value={newTimeOff.date}
          onChange={(e) => setNewTimeOff({ ...newTimeOff, date: e.target.value })}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs" />
        <input placeholder="Note (optional)" value={newTimeOff.note}
          onChange={(e) => setNewTimeOff({ ...newTimeOff, note: e.target.value })}
          className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs" />
        <button onClick={handleAddTimeOff} disabled={!newTimeOff.date}
          className="flex items-center justify-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium hover:bg-gray-50 disabled:opacity-50">
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>
      {timeOff.length > 0 && (
        <div className="mt-2 space-y-1">
          {timeOff.map((block) => (
            <div key={block.id} className="flex items-center justify-between rounded bg-gray-50 px-3 py-1.5 text-xs">
              <span>
                {new Date(block.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                {block.note && `: ${block.note}`}
              </span>
              <button onClick={() => block.id && handleDeleteTimeOff(block.id)} className="text-red-500 hover:text-red-700">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
