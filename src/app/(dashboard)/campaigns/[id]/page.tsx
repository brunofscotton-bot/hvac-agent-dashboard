"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Pause, Play, Megaphone, AlertCircle } from "lucide-react";
import {
  getCampaign,
  pauseCampaign,
  resumeCampaign,
  deleteCampaign,
  type CampaignDetail,
} from "@/lib/api";

const statusColors: Record<string, string> = {
  queued: "bg-gray-100 text-gray-600",
  sms_sent: "bg-blue-100 text-blue-700",
  sms_responded_positive: "bg-green-100 text-green-700",
  sms_responded_negative: "bg-orange-100 text-orange-700",
  sms_responded_question: "bg-purple-100 text-purple-700",
  appointment_booked: "bg-emerald-100 text-emerald-700",
  declined: "bg-red-100 text-red-700",
  no_response: "bg-gray-100 text-gray-600",
  opted_out: "bg-red-100 text-red-700",
  invalid_number: "bg-red-100 text-red-700",
};

const statusLabels: Record<string, string> = {
  queued: "Queued",
  sms_sent: "SMS Sent",
  sms_responded_positive: "Positive Reply",
  sms_responded_negative: "Declined",
  sms_responded_question: "Question",
  appointment_booked: "Booked",
  declined: "Declined",
  no_response: "No Response",
  opted_out: "Opted Out",
  invalid_number: "Invalid",
};

export default function CampaignDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [campaign, setCampaign] = useState<CampaignDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "sent" | "responded" | "booked">("all");

  const load = () => {
    if (!id) return;
    getCampaign(id)
      .then(setCampaign)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 15000); // refresh every 15s
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handlePause = async () => {
    setActionLoading(true);
    try {
      await pauseCampaign(id);
      load();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleResume = async () => {
    setActionLoading(true);
    try {
      await resumeCampaign(id);
      load();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this campaign? This cannot be undone.")) return;
    setActionLoading(true);
    try {
      await deleteCampaign(id);
      window.location.href = "/campaigns";
    } catch (e: any) {
      alert(e.message);
      setActionLoading(false);
    }
  };

  if (loading || !campaign) {
    return <div className="py-12 text-center text-gray-400">Loading...</div>;
  }

  const contacts = campaign.contacts.filter((c) => {
    if (filter === "pending") return c.status === "queued";
    if (filter === "sent") return c.status === "sms_sent";
    if (filter === "responded") return c.status.startsWith("sms_responded");
    if (filter === "booked") return c.status === "appointment_booked";
    return true;
  });

  const conversionRate =
    campaign.sent_count > 0 ? ((campaign.booked_count / campaign.sent_count) * 100).toFixed(1) : "0.0";
  const progressPct = campaign.target_count > 0 ? (campaign.sent_count / campaign.target_count) * 100 : 0;

  return (
    <div>
      <Link href="/campaigns" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
        <ChevronLeft className="h-4 w-4" />
        Back to campaigns
      </Link>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-[#3B6FFF]" />
            <h1 className="text-2xl font-bold">{campaign.name}</h1>
          </div>
          <p className="mt-1 text-sm text-gray-500">{campaign.offer_text}</p>
        </div>

        <div className="flex items-center gap-2">
          {campaign.status === "active" && (
            <button
              onClick={handlePause}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Pause className="h-4 w-4" />
              Pause
            </button>
          )}
          {campaign.status === "paused" && (
            <button
              onClick={handleResume}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-[#3B6FFF] px-3 py-2 text-sm font-medium text-white hover:bg-[#2D5FE6]"
            >
              <Play className="h-4 w-4" />
              Resume
            </button>
          )}
          {(campaign.status === "draft" || campaign.status === "completed" || campaign.status === "paused") && (
            <button
              onClick={handleDelete}
              disabled={actionLoading}
              className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Progress: {campaign.sent_count} of {campaign.target_count} sent</span>
          <span className="font-semibold text-gray-700">{Math.round(progressPct)}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
          <div className="h-full bg-[#3B6FFF] transition-all" style={{ width: `${Math.min(progressPct, 100)}%` }} />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-5">
          <div>
            <p className="text-xs text-gray-500">Target</p>
            <p className="mt-1 text-xl font-bold">{campaign.target_count}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Sent</p>
            <p className="mt-1 text-xl font-bold">{campaign.sent_count}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Responded</p>
            <p className="mt-1 text-xl font-bold">{campaign.responded_count}</p>
          </div>
          <div>
            <p className="text-xs text-green-600">Booked</p>
            <p className="mt-1 text-xl font-bold text-green-600">
              {campaign.booked_count}
              <span className="ml-1 text-sm font-normal">({conversionRate}%)</span>
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Est. Revenue</p>
            <p className="mt-1 text-xl font-bold">
              ${((campaign.booked_count * (campaign.offer_price ?? 0))).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Status info for draft campaigns */}
      {campaign.status === "draft" && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm text-amber-800 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            This campaign is a draft and hasn&apos;t launched yet. It will target customers matching your filter.
          </p>
        </div>
      )}

      {/* Contact filters */}
      <div className="mt-6 flex gap-2 border-b border-gray-200 overflow-x-auto">
        {[
          { id: "all", label: `All (${campaign.contacts.length})` },
          { id: "pending", label: "Pending" },
          { id: "sent", label: "Sent" },
          { id: "responded", label: "Responded" },
          { id: "booked", label: "Booked" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`whitespace-nowrap px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
              filter === tab.id
                ? "border-[#3B6FFF] text-[#3B6FFF]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contacts list */}
      <div className="mt-4 space-y-2">
        {contacts.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-400">No contacts in this filter</div>
        ) : (
          contacts.map((c) => (
            <div
              key={c.id}
              className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900">{c.customer_name}</p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[c.status] || "bg-gray-100 text-gray-600"}`}
                  >
                    {statusLabels[c.status] || c.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400">{c.customer_phone}</p>
                {c.sms_response && (
                  <p className="mt-1 text-sm text-gray-600 italic">&ldquo;{c.sms_response}&rdquo;</p>
                )}
              </div>
              <div className="text-right text-xs text-gray-400">
                {c.sms_response_at
                  ? `Replied ${new Date(c.sms_response_at).toLocaleString()}`
                  : c.sms_sent_at
                  ? `Sent ${new Date(c.sms_sent_at).toLocaleString()}`
                  : "Queued"}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
