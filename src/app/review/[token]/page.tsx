"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface ReviewData {
  company_name: string;
  agent_name: string;
  customer_name: string | null;
  already_responded: boolean;
  rating: number | null;
  google_review_url: string | null;
  min_stars_for_google: number;
}

export default function ReviewPage() {
  const params = useParams();
  const token = params?.token as string;

  const [data, setData] = useState<ReviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<"rate" | "comment" | "thanks">("rate");

  useEffect(() => {
    if (!token) return;
    fetch(`/api/reviews/${token}`)
      .then((r) => {
        if (!r.ok) throw new Error("Review not found");
        return r.json();
      })
      .then((d) => {
        setData(d);
        if (d.already_responded) setStep("thanks");
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  const handleRatingClick = (n: number) => {
    setRating(n);
    if (data && n >= data.min_stars_for_google && data.google_review_url) {
      // High rating with Google URL set: submit immediately and redirect
      submitReview(n, "");
    } else {
      // Low rating or no Google URL: show comment form
      setStep("comment");
    }
  };

  const submitReview = async (r: number, c: string) => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`/api/reviews/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: r, comment: c || null }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.detail || "Failed to submit");

      if (result.redirect_to_google && result.google_review_url) {
        // Show "thank you" briefly then redirect
        setStep("thanks");
        setTimeout(() => {
          window.location.href = result.google_review_url;
        }, 1500);
      } else {
        setStep("thanks");
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center max-w-md">
          <div className="text-4xl mb-3">⚠️</div>
          <h1 className="text-xl font-bold text-white">Review link invalid</h1>
          <p className="mt-2 text-sm text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl">
        {step === "thanks" ? (
          <div className="text-center">
            <div className="text-5xl mb-4">{rating && rating >= 4 ? "🎉" : "💙"}</div>
            <h1 className="text-2xl font-bold text-white">Thank you!</h1>
            <p className="mt-3 text-sm text-gray-300">
              {data?.already_responded
                ? "You've already submitted your review. We appreciate your feedback!"
                : rating && rating >= (data?.min_stars_for_google ?? 4) && data?.google_review_url
                ? "We're so glad you had a great experience. Redirecting you to leave a Google review..."
                : "Your feedback has been sent to the team. They'll be in touch shortly to make things right."}
            </p>
          </div>
        ) : step === "comment" ? (
          <div>
            <div className="text-center mb-6">
              <div className="flex justify-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((n) => (
                  <span key={n} className={`text-3xl ${n <= (rating ?? 0) ? "text-yellow-400" : "text-gray-600"}`}>
                    ★
                  </span>
                ))}
              </div>
              <h2 className="text-lg font-bold text-white">
                {rating && rating <= 3 ? "We're sorry we missed the mark." : "Tell us more"}
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                {rating && rating <= 3
                  ? "What went wrong? Your feedback goes directly to the team, not posted publicly."
                  : "Anything else you'd like the team to know?"}
              </p>
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Share your experience..."
              className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none"
            />

            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}

            <button
              onClick={() => rating && submitReview(rating, comment)}
              disabled={submitting}
              className="mt-4 w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {submitting ? "Sending..." : "Submit Feedback"}
            </button>
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">
              How was your service with{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {data?.company_name}
              </span>
              ?
            </h1>
            <p className="mt-3 text-sm text-gray-400">
              {data?.customer_name ? `Hi ${data.customer_name}! ` : ""}
              Tap a star to rate your experience.
            </p>

            <div className="mt-8 flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => handleRatingClick(n)}
                  disabled={submitting}
                  className="text-5xl transition-transform hover:scale-110 disabled:opacity-50"
                >
                  <span className={n <= (hover ?? rating ?? 0) ? "text-yellow-400" : "text-gray-600"}>
                    ★
                  </span>
                </button>
              ))}
            </div>

            <p className="mt-6 text-xs text-gray-500">
              Powered by Ringa
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
