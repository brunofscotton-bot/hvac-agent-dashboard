"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Megaphone, Plus, Play, Pause, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { getCampaigns, type Campaign } from "@/lib/api";
import { SkeletonRows } from "@/components/empty-state";

const statusConfig: Record<Campaign["status"], { bg: string; text: string; label: string; icon: any }> = {
  draft: { bg: "bg-gray-100", text: "text-gray-700", label: "Draft", icon: Clock },
  active: { bg: "bg-green-100", text: "text-green-700", label: "Active", icon: Play },
  paused: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Paused", icon: Pause },
  completed: { bg: "bg-blue-100", text: "text-blue-700", label: "Completed", icon: CheckCircle2 },
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCampaigns()
      .then(setCampaigns)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalBooked = campaigns.reduce((s, c) => s + c.booked_count, 0);
  const totalRevenue = campaigns.reduce((s, c) => s + c.booked_count * (c.offer_price ?? 0), 0);

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-[#3B6FFF]" />
            Reactivation Campaigns
          </h1>
          <p className="mt-1 text-gray-500">
            Automated outbound SMS to bring inactive customers back
          </p>
        </div>
        <Link
          href="/campaigns/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[#3B6FFF] px-4 py-2 text-sm font-medium text-white hover:bg-[#2D5FE6]"
        >
          <Plus className="h-4 w-4" />
          New Campaign
        </Link>
      </div>

      {/* Summary stats */}
      {campaigns.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-xs text-gray-500">Total Campaigns</p>
            <p className="mt-1 text-2xl font-bold">{campaigns.length}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-xs text-gray-500">Active Now</p>
            <p className="mt-1 text-2xl font-bold">
              {campaigns.filter((c) => c.status === "active").length}
            </p>
          </div>
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <p className="text-xs text-green-700">Jobs Booked</p>
            <p className="mt-1 text-2xl font-bold text-green-700">{totalBooked}</p>
          </div>
          <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
            <p className="text-xs text-purple-700">Est. Revenue</p>
            <p className="mt-1 text-2xl font-bold text-purple-700">
              ${totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Campaigns list */}
      <div className="mt-6 space-y-3">
        {loading ? (
          <SkeletonRows count={3} />
        ) : campaigns.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <Megaphone className="mx-auto h-10 w-10 text-gray-300" />
            <h3 className="mt-3 text-lg font-semibold text-gray-900">No campaigns yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Reactivate inactive customers with automated SMS. Most companies book 15-25% of their inactive list.
            </p>
            <Link
              href="/campaigns/new"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#3B6FFF] px-4 py-2 text-sm font-medium text-white hover:bg-[#2D5FE6]"
            >
              <Plus className="h-4 w-4" />
              Create Your First Campaign
            </Link>
          </div>
        ) : (
          campaigns.map((campaign) => {
            const cfg = statusConfig[campaign.status];
            const Icon = cfg.icon;
            const conversionRate =
              campaign.sent_count > 0
                ? ((campaign.booked_count / campaign.sent_count) * 100).toFixed(1)
                : "0.0";
            const progress = campaign.target_count > 0 ? (campaign.sent_count / campaign.target_count) * 100 : 0;
            return (
              <Link
                key={campaign.id}
                href={`/campaigns/${campaign.id}`}
                className="block rounded-lg border border-gray-200 bg-white p-5 hover:border-[#3B6FFF]/40 hover:shadow-sm transition-all"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${cfg.bg} ${cfg.text}`}
                      >
                        <Icon className="h-3 w-3" />
                        {cfg.label}
                      </span>
                    </div>
                    <h3 className="mt-2 text-lg font-semibold text-gray-900">{campaign.name}</h3>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-1">{campaign.offer_text}</p>

                    {campaign.status !== "draft" && (
                      <div className="mt-3">
                        <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
                          <span>
                            {campaign.sent_count} of {campaign.target_count} sent
                          </span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full bg-[#3B6FFF] transition-all"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {campaign.status !== "draft" && (
                    <div className="grid grid-cols-3 gap-4 sm:flex sm:gap-6 sm:text-right">
                      <div>
                        <p className="text-xs text-gray-500">Sent</p>
                        <p className="mt-0.5 font-semibold text-gray-900">{campaign.sent_count}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Responded</p>
                        <p className="mt-0.5 font-semibold text-gray-900">{campaign.responded_count}</p>
                      </div>
                      <div>
                        <p className="text-xs text-green-600">Booked</p>
                        <p className="mt-0.5 font-semibold text-green-600 flex items-center gap-1">
                          {campaign.booked_count}
                          {parseFloat(conversionRate) > 0 && (
                            <span className="text-xs font-normal">({conversionRate}%)</span>
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
