"use client";

import { useEffect, useState } from "react";
import { Check, Clock, Star, Building2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { getPlans, createCheckout, type PlanInfo } from "@/lib/api";

const BUSINESS_FEATURES = [
  "Up to 15 technicians",
  "Unlimited call minutes",
  "Everything in Pro",
  "3-month transcript retention",
  "Dedicated account manager",
  "Custom AI training",
  "SLA guarantee",
  "Multi-location support",
];

const PLAN_DISPLAY: Record<string, { price: number; name: string; features: string[] }> = {
  starter: {
    price: 99,
    name: "Starter",
    features: [
      "1 technician",
      "300 minutes/month",
      "24/7 call answering",
      "English, Spanish & Portuguese",
      "Google Calendar sync",
      "SMS confirmations",
      "Address verification",
      "15-day transcript retention",
      "$0.35/min overage",
    ],
  },
  pro: {
    price: 249,
    name: "Pro",
    features: [
      "Up to 5 technicians",
      "1,500 minutes/month",
      "Everything in Starter",
      "Jobber integration",
      "Round-robin dispatch",
      "Pricebook & quotes",
      "30-day transcript retention",
      "Priority support",
      "$0.35/min overage",
    ],
  },
};

export default function PlansPage() {
  const { company } = useAuth();
  const [plans, setPlans] = useState<Record<string, PlanInfo>>({});
  const [loading, setLoading] = useState(true);

  const isTrialing = company?.subscription_status === "trialing";
  const activePlan = company?.subscription_plan;

  const trialDaysRemaining = company?.trial_ends_at
    ? Math.max(0, Math.ceil((new Date(company.trial_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  useEffect(() => {
    getPlans()
      .then(setPlans)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = async (plan: string) => {
    try {
      const res = await createCheckout(
        plan,
        `${window.location.origin}/?subscribed=true`,
        `${window.location.origin}/plans`
      );
      window.location.href = res.checkout_url;
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-400">
        Loading plans...
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-center text-xl font-bold">Choose Your Plan</h1>
        <p className="mt-1 text-center text-sm text-gray-500">
          Select a plan to activate your Ringa receptionist
        </p>

        {/* Free Trial Banner */}
        {isTrialing && !activePlan && (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <Clock className="h-5 w-5 shrink-0 text-amber-600" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800">
                You&apos;re on a Free Trial — {trialDaysRemaining} days remaining
              </p>
              <p className="text-xs text-amber-700">
                Activate a plan now to keep your Ringa receptionist running after your trial ends.
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {/* Starter & Pro from API / display override */}
          {["starter", "pro"].map((key) => {
            const apiPlan = plans[key];
            const display = PLAN_DISPLAY[key];
            const isActive = activePlan === key;
            const isPro = key === "pro";

            return (
              <div
                key={key}
                className={`rounded-xl border-2 p-6 ${
                  isPro
                    ? "border-[#3B6FFF] ring-1 ring-[#3B6FFF]"
                    : isActive
                    ? "border-green-400"
                    : "border-gray-200"
                }`}
              >
                {isPro && (
                  <span className="mb-3 inline-flex items-center gap-1 rounded-full bg-[#3B6FFF]/10 px-2.5 py-0.5 text-xs font-semibold text-[#3B6FFF]">
                    <Star className="h-3 w-3" /> Most Popular
                  </span>
                )}
                {isActive && (
                  <span className="mb-3 inline-block rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                    Current Plan
                  </span>
                )}
                <h3 className="text-lg font-bold">{display?.name ?? apiPlan?.name ?? key}</h3>
                <p className="mt-2">
                  <span className="text-3xl font-bold">${display?.price ?? apiPlan?.price}</span>
                  <span className="text-gray-500">/month</span>
                </p>
                <ul className="mt-6 space-y-3">
                  {(display?.features ?? apiPlan?.features ?? []).map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSelect(key)}
                  disabled={isActive}
                  className={`mt-6 w-full rounded-lg py-2.5 text-sm font-medium ${
                    isActive
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : isPro
                      ? "bg-[#3B6FFF] text-white hover:bg-[#2D5FE6]"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {isActive ? "Active" : isTrialing ? "Activate Now" : "Get Started"}
                </button>
              </div>
            );
          })}

          {/* Business */}
          <div className={`rounded-xl border-2 p-6 ${activePlan === "business" ? "border-green-400" : "border-gray-200"}`}>
            <span className="mb-3 inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700">
              <Building2 className="h-3 w-3" /> Business
            </span>
            {activePlan === "business" && (
              <span className="mb-3 ml-2 inline-block rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                Current Plan
              </span>
            )}
            <h3 className="text-lg font-bold">Business</h3>
            <p className="mt-2">
              <span className="text-3xl font-bold">$449</span>
              <span className="text-gray-500">/month</span>
            </p>
            <ul className="mt-6 space-y-3">
              {BUSINESS_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSelect("business")}
              disabled={activePlan === "business"}
              className={`mt-6 w-full rounded-lg py-2.5 text-sm font-medium ${
                activePlan === "business"
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {activePlan === "business" ? "Active" : isTrialing ? "Activate Now" : "Get Started"}
            </button>
            <p className="mt-2 text-center text-xs text-gray-400">
              Need more than 15 techs?{" "}
              <a href="mailto:hello@ringa.live" className="text-[#3B6FFF] hover:underline">Contact sales</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
