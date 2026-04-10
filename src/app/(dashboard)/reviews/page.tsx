"use client";

import { useEffect, useState } from "react";
import { Star, AlertCircle, CheckCircle, Clock, ExternalLink } from "lucide-react";
import { getReviews, resolveReview, type ReviewItem } from "@/lib/api";
import { EmptyState, SkeletonRows } from "@/components/empty-state";

function StarDisplay({ rating }: { rating: number | null }) {
  if (rating == null) return <span className="text-xs text-gray-400">No rating yet</span>;
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`h-4 w-4 ${n <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
        />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "negative" | "positive" | "pending">("all");
  const [resolveOpen, setResolveOpen] = useState<string | null>(null);
  const [resolveNotes, setResolveNotes] = useState("");

  const load = () => {
    setLoading(true);
    getReviews()
      .then(setReviews)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = reviews.filter((r) => {
    if (filter === "negative") return r.rating != null && r.rating <= 3;
    if (filter === "positive") return r.rating != null && r.rating >= 4;
    if (filter === "pending") return r.rating == null;
    return true;
  });

  const stats = {
    total: reviews.length,
    responded: reviews.filter((r) => r.rating != null).length,
    avg: (() => {
      const rated = reviews.filter((r) => r.rating != null);
      if (rated.length === 0) return null;
      return (rated.reduce((s, r) => s + (r.rating ?? 0), 0) / rated.length).toFixed(1);
    })(),
    negative: reviews.filter((r) => r.rating != null && r.rating <= 3 && !r.resolved).length,
    googleForwarded: reviews.filter((r) => r.forwarded_to_google).length,
  };

  const handleResolve = async (id: string) => {
    await resolveReview(id, { resolved: true, resolution_notes: resolveNotes });
    setResolveOpen(null);
    setResolveNotes("");
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Customer Reviews</h1>
      <p className="mt-1 text-gray-500">Feedback collected after each completed service</p>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Average Rating</p>
          <p className="mt-1 text-2xl font-bold">
            {stats.avg ? <>{stats.avg} <span className="text-sm text-yellow-400">★</span></> : "—"}
          </p>
          <p className="text-xs text-gray-400">{stats.responded} responses</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Total Sent</p>
          <p className="mt-1 text-2xl font-bold">{stats.total}</p>
          <p className="text-xs text-gray-400">SMS requests</p>
        </div>
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
          <p className="text-xs text-orange-700">Needs Attention</p>
          <p className="mt-1 text-2xl font-bold text-orange-700">{stats.negative}</p>
          <p className="text-xs text-orange-600">unresolved 1-3★ reviews</p>
        </div>
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="text-xs text-green-700">Forwarded to Google</p>
          <p className="mt-1 text-2xl font-bold text-green-700">{stats.googleForwarded}</p>
          <p className="text-xs text-green-600">positive reviews</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="mt-6 flex gap-2 border-b border-gray-200">
        {[
          { id: "all", label: "All" },
          { id: "negative", label: "Needs Attention" },
          { id: "positive", label: "Positive" },
          { id: "pending", label: "Pending Response" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
              filter === tab.id
                ? "border-[#3B6FFF] text-[#3B6FFF]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="mt-4 space-y-3">
        {loading ? (
          <SkeletonRows count={5} />
        ) : filtered.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white">
            <EmptyState
              icon={Star}
              title="No reviews yet"
              description="Reviews will appear here after appointments are marked completed and customers receive their review link SMS"
            />
          </div>
        ) : (
          filtered.map((review) => (
            <div
              key={review.id}
              className={`rounded-lg border p-4 ${
                review.rating != null && review.rating <= 3 && !review.resolved
                  ? "border-orange-200 bg-orange-50/30"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <StarDisplay rating={review.rating} />
                    {review.forwarded_to_google && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" /> Google
                      </span>
                    )}
                    {review.resolved && (
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" /> Resolved
                      </span>
                    )}
                    {review.rating == null && (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Pending
                      </span>
                    )}
                  </div>
                  <p className="mt-2 font-medium text-gray-900">
                    {review.customer_name ?? "Customer"}
                    {review.customer_phone && <span className="ml-2 text-xs text-gray-400">{review.customer_phone}</span>}
                  </p>
                  {review.comment && (
                    <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">{review.comment}</p>
                  )}
                  {review.resolution_notes && (
                    <p className="mt-2 text-xs text-gray-500 italic">
                      <strong>Resolution:</strong> {review.resolution_notes}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-gray-400">
                    {review.service_type && <>{review.service_type} · </>}
                    {review.responded_at
                      ? `Responded ${new Date(review.responded_at).toLocaleString()}`
                      : review.sms_sent_at
                      ? `Sent ${new Date(review.sms_sent_at).toLocaleString()}`
                      : `Created ${new Date(review.created_at).toLocaleString()}`}
                  </p>
                </div>

                {review.rating != null && review.rating <= 3 && !review.resolved && (
                  <button
                    onClick={() => setResolveOpen(review.id)}
                    className="shrink-0 rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-orange-700"
                  >
                    Mark Resolved
                  </button>
                )}
              </div>

              {resolveOpen === review.id && (
                <div className="mt-4 rounded-lg border border-gray-200 bg-white p-3">
                  <textarea
                    value={resolveNotes}
                    onChange={(e) => setResolveNotes(e.target.value)}
                    placeholder="What did you do to resolve this?"
                    rows={2}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleResolve(review.id)}
                      className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white"
                    >
                      Save & Resolve
                    </button>
                    <button
                      onClick={() => { setResolveOpen(null); setResolveNotes(""); }}
                      className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
