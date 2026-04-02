"use client";

import { useEffect, useState } from "react";
import {
  CreditCard,
  ExternalLink,
  FileText,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";
import {
  getSubscription,
  getInvoices,
  createPortal,
  createCheckout,
  type SubscriptionInfo,
  type Invoice,
} from "@/lib/api";

const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
  active: { icon: CheckCircle, color: "text-green-600 bg-green-50", label: "Active" },
  trialing: { icon: CheckCircle, color: "text-[#3B6FFF] bg-[#3B6FFF]/10", label: "Trial" },
  past_due: { icon: AlertCircle, color: "text-orange-600 bg-orange-50", label: "Past Due" },
  canceled: { icon: XCircle, color: "text-red-600 bg-red-50", label: "Canceled" },
  none: { icon: XCircle, color: "text-gray-600 bg-gray-50", label: "No Subscription" },
};

export default function BillingPage() {
  const [sub, setSub] = useState<SubscriptionInfo | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getSubscription(), getInvoices()])
      .then(([s, inv]) => {
        setSub(s);
        setInvoices(inv.invoices);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleManage = async () => {
    try {
      const res = await createPortal(window.location.href);
      window.location.href = res.portal_url;
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSubscribe = async (plan: string) => {
    try {
      const res = await createCheckout(
        plan,
        `${window.location.origin}/billing?success=true`,
        `${window.location.origin}/billing`
      );
      window.location.href = res.checkout_url;
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }

  const status = sub?.status || "none";
  const cfg = statusConfig[status] || statusConfig.none;
  const StatusIcon = cfg.icon;

  return (
    <div>
      <h1 className="text-2xl font-bold">Billing</h1>
      <p className="mt-1 text-gray-500">Manage your subscription and billing</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Current Plan */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Current Plan</h2>
            <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${cfg.color}`}>
              <StatusIcon className="h-3.5 w-3.5" />
              {cfg.label}
            </span>
          </div>

          {sub?.plan ? (
            <div className="mt-4">
              <p className="text-3xl font-bold capitalize">{sub.plan}</p>
              {sub.subscription && (
                <p className="mt-1 text-sm text-gray-500">
                  Current period:{" "}
                  {new Date(sub.subscription.current_period_start * 1000).toLocaleDateString()}{" "}
                  - {new Date(sub.subscription.current_period_end * 1000).toLocaleDateString()}
                </p>
              )}
              {sub.subscription?.cancel_at_period_end && (
                <p className="mt-2 text-sm text-orange-600">
                  Cancels at end of billing period
                </p>
              )}
              <button
                onClick={handleManage}
                className="mt-4 flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
              >
                <CreditCard className="h-4 w-4" />
                Manage Subscription
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-gray-500">No active subscription</p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => handleSubscribe("starter")}
                  className="rounded-lg border border-[#3B6FFF] px-4 py-2 text-sm font-medium text-[#3B6FFF] hover:bg-[#3B6FFF]/10"
                >
                  Starter — $99/mo
                </button>
                <button
                  onClick={() => handleSubscribe("pro")}
                  className="rounded-lg bg-[#3B6FFF] px-4 py-2 text-sm font-medium text-white hover:bg-[#2D5FE6]"
                >
                  Pro — $299/mo
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Plan Features</h2>
          <div className="mt-4">
            {sub?.plan === "pro" ? (
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Unlimited technicians</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Multilingual support (EN/PT/ES)</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Priority support</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Custom agent personality</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Advanced analytics</li>
              </ul>
            ) : sub?.plan === "starter" ? (
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> 1 AI phone agent</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> 1 dedicated phone number</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Up to 3 technicians</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Google Calendar integration</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> SMS notifications</li>
              </ul>
            ) : (
              <p className="text-sm text-gray-500">Subscribe to see plan features</p>
            )}
          </div>
        </div>
      </div>

      {/* Invoices */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold">Invoice History</h2>
        <div className="mt-4 overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-600">Date</th>
                <th className="px-4 py-3 font-medium text-gray-600">Amount</th>
                <th className="px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 font-medium text-gray-600">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                    No invoices yet
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {new Date(inv.created * 1000).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      ${inv.amount_paid.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          inv.status === "paid"
                            ? "bg-green-100 text-green-700"
                            : inv.status === "open"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {inv.hosted_invoice_url && (
                        <a
                          href={inv.hosted_invoice_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[#3B6FFF] hover:underline"
                        >
                          <FileText className="h-3.5 w-3.5" /> View
                        </a>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
