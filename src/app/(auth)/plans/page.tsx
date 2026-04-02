"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { getPlans, createCheckout, type PlanInfo } from "@/lib/api";

export default function PlansPage() {
  const { company } = useAuth();
  const [plans, setPlans] = useState<Record<string, PlanInfo>>({});
  const [loading, setLoading] = useState(true);

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
    <div className="max-w-3xl">
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-center text-xl font-bold">Choose Your Plan</h1>
        <p className="mt-1 text-center text-sm text-gray-500">
          Select a plan to activate your AI phone agent
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {Object.entries(plans).map(([key, plan]) => (
            <div
              key={key}
              className={`rounded-xl border-2 p-6 ${
                key === "pro"
                  ? "border-[#3B6FFF] ring-1 ring-[#3B6FFF]"
                  : "border-gray-200"
              }`}
            >
              {key === "pro" && (
                <span className="mb-3 inline-block rounded-full bg-[#3B6FFF]/10 px-2.5 py-0.5 text-xs font-semibold text-[#3B6FFF]">
                  Most Popular
                </span>
              )}
              <h3 className="text-lg font-bold">{plan.name}</h3>
              <p className="mt-2">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="text-gray-500">/month</span>
              </p>
              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSelect(key)}
                className={`mt-6 w-full rounded-lg py-2.5 text-sm font-medium ${
                  key === "pro"
                    ? "bg-[#3B6FFF] text-white hover:bg-[#2D5FE6]"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
