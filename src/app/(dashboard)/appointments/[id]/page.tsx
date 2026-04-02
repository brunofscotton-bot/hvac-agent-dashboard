"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Phone,
  User,
  Clock,
  AlertTriangle,
  Mail,
  Globe,
  DollarSign,
  Wrench,
  FileText,
  Save,
} from "lucide-react";
import { getAppointment, updateAppointment, type Appointment } from "@/lib/api";

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-700",
  confirmed: "bg-green-100 text-green-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  no_show: "bg-gray-100 text-gray-700",
};

const urgencyColors: Record<string, string> = {
  low: "bg-gray-100 text-gray-600",
  normal: "bg-blue-100 text-blue-600",
  high: "bg-orange-100 text-orange-600",
  emergency: "bg-red-100 text-red-700",
};

const statusOptions = [
  "scheduled",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
  "no_show",
];

export default function AppointmentDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Editable fields
  const [status, setStatus] = useState("");
  const [technicianNotes, setTechnicianNotes] = useState("");
  const [resolution, setResolution] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getAppointment(id)
      .then((appt) => {
        setAppointment(appt);
        setStatus(appt.status);
        setTechnicianNotes(appt.technician_notes ?? "");
        setResolution(appt.resolution ?? "");
      })
      .catch((err) => {
        setError(err.message || "Appointment not found");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage(null);
    try {
      await updateAppointment(id, {
        status,
        technician_notes: technicianNotes || undefined,
        resolution: resolution || undefined,
      });
      setAppointment((prev) =>
        prev
          ? {
              ...prev,
              status,
              technician_notes: technicianNotes || undefined,
              resolution: resolution || undefined,
            }
          : prev
      );
      setSaveMessage("Changes saved successfully.");
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err: any) {
      setSaveMessage(err.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <AlertTriangle className="h-10 w-10 text-red-400" />
        <p className="text-gray-500">{error || "Appointment not found"}</p>
        <Link
          href="/appointments"
          className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Appointments
        </Link>
      </div>
    );
  }

  const scheduledDate = new Date(appointment.scheduled_date);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/appointments"
          className="flex items-center justify-center rounded-lg border border-gray-300 p-2 hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Appointment Details</h1>
          <p className="mt-1 text-gray-500">
            {scheduledDate.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column -- Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status & Schedule card */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${statusColors[appointment.status] ?? "bg-gray-100 text-gray-700"}`}
              >
                {appointment.status.replace("_", " ")}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${urgencyColors[appointment.urgency] ?? "bg-gray-100 text-gray-600"}`}
              >
                {appointment.urgency} urgency
              </span>
              {appointment.is_after_hours && (
                <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
                  After Hours
                </span>
              )}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span className="text-sm">
                  {scheduledDate.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-sm">
                  {scheduledDate.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <DollarSign className="h-4 w-4 text-blue-500" />
                <span className="text-sm">
                  ${appointment.visit_fee} visit fee
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FileText className="h-4 w-4 text-blue-500" />
                <span className="text-sm">
                  Created{" "}
                  {new Date(appointment.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Problem Description */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              Problem Description
            </h2>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              {appointment.problem_description || "No description provided."}
            </p>
          </div>

          {/* Edit Section */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-sm font-semibold text-gray-700">
              Update Appointment
            </h2>

            <div className="mt-4 space-y-4">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              {/* Technician Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Technician Notes
                </label>
                <textarea
                  value={technicianNotes}
                  onChange={(e) => setTechnicianNotes(e.target.value)}
                  rows={3}
                  placeholder="Add notes from the technician..."
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              {/* Resolution */}
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Resolution
                </label>
                <textarea
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  rows={3}
                  placeholder="Describe how the issue was resolved..."
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              {/* Save */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                {saveMessage && (
                  <p
                    className={`text-sm ${
                      saveMessage.includes("success")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {saveMessage}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right column -- Customer & Technician */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <User className="h-4 w-4 text-blue-500" />
              Customer
            </h2>
            <div className="mt-4 space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {appointment.customer?.name ?? "Unknown"}
                </p>
              </div>
              {appointment.customer?.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-3.5 w-3.5 text-gray-400" />
                  {appointment.customer.phone}
                </div>
              )}
              {appointment.customer?.email && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-3.5 w-3.5 text-gray-400" />
                  {appointment.customer.email}
                </div>
              )}
              {appointment.customer?.address && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-3.5 w-3.5 text-gray-400" />
                  {appointment.customer.address}
                </div>
              )}
              {appointment.customer?.language && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Globe className="h-3.5 w-3.5 text-gray-400" />
                  {appointment.customer.language}
                </div>
              )}
            </div>
          </div>

          {/* Technician Info */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Wrench className="h-4 w-4 text-blue-500" />
              Technician
            </h2>
            {appointment.technician ? (
              <div className="mt-4 space-y-3">
                <p className="text-sm font-medium text-gray-800">
                  {appointment.technician.name}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-3.5 w-3.5 text-gray-400" />
                  {appointment.technician.phone}
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-gray-400">
                No technician assigned
              </p>
            )}
          </div>

          {/* Technician Notes (read-only display) */}
          {appointment.technician_notes && (
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="text-sm font-semibold text-gray-700">
                Technician Notes
              </h2>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                {appointment.technician_notes}
              </p>
            </div>
          )}

          {/* Resolution (read-only display) */}
          {appointment.resolution && (
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="text-sm font-semibold text-gray-700">
                Resolution
              </h2>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                {appointment.resolution}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
