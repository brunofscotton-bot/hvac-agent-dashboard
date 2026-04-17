"use client";

import { useEffect, useState } from "react";
import { DollarSign, Save } from "lucide-react";
import { getCompany, updateCompany, type Company } from "@/lib/api";

export default function PricingPage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getCompany()
      .then(setCompany)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!company) return;
    setSaving(true);
    setSaved(false);
    await updateCompany({
      service_fee: company.service_fee,
      after_hours_fee: company.after_hours_fee,
      after_hours_credit: company.after_hours_credit ?? 80,
      fee_applies_to_service: company.fee_applies_to_service,
      business_hours_start: company.business_hours_start,
      business_hours_end: company.business_hours_end,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-gray-400">Loading...</div>;
  }

  if (!company) {
    return <div className="flex h-64 items-center justify-center text-gray-400">No company configured</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Pricing</h1>
      <p className="mt-1 text-gray-500">Configure your service visit fees</p>

      <div className="mt-6 w-full max-w-xl space-y-6 rounded-lg border border-gray-200 bg-white p-4 sm:p-6">
        {/* Regular Fee */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Regular Visit Fee (Business Hours)
          </label>
          <div className="relative mt-1">
            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="number"
              value={company.service_fee}
              onChange={(e) => setCompany({ ...company, service_fee: Number(e.target.value) })}
              className="w-full rounded-lg border border-gray-300 py-2 pl-8 pr-3 text-sm"
            />
          </div>
          <p className="mt-1 text-xs text-gray-400">
            Charged for visits during business hours (Mon-Fri)
          </p>
        </div>

        {/* After Hours Fee */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            After Hours / Weekend Fee
          </label>
          <div className="relative mt-1">
            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="number"
              value={company.after_hours_fee}
              onChange={(e) => setCompany({ ...company, after_hours_fee: Number(e.target.value) })}
              className="w-full rounded-lg border border-gray-300 py-2 pl-8 pr-3 text-sm"
            />
          </div>
          <p className="mt-1 text-xs text-gray-400">
            Charged for visits after business hours and on weekends
          </p>
        </div>

        {/* After Hours Credit */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Amount Applied to Repair (After-Hours)
          </label>
          <div className="relative mt-1">
            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="number"
              value={company.after_hours_credit ?? 80}
              onChange={(e) => setCompany({ ...company, after_hours_credit: Number(e.target.value) })}
              className="w-full rounded-lg border border-gray-300 py-2 pl-8 pr-3 text-sm"
            />
          </div>
          <p className="mt-1 text-xs text-gray-400">
            Of the ${company.after_hours_fee} after-hours fee, this amount is credited toward the repair cost. The rest is a surcharge.
          </p>
        </div>

        {/* Business Hours */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Business Hours Start</label>
            <select
              value={company.business_hours_start}
              onChange={(e) => setCompany({ ...company, business_hours_start: Number(e.target.value) })}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              {Array.from({ length: 12 }, (_, i) => i + 5).map((h) => (
                <option key={h} value={h}>{h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Business Hours End</label>
            <select
              value={company.business_hours_end}
              onChange={(e) => setCompany({ ...company, business_hours_end: Number(e.target.value) })}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              {Array.from({ length: 12 }, (_, i) => i + 14).map((h) => (
                <option key={h} value={h}>{h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Fee Applies to Service */}
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={company.fee_applies_to_service}
            onChange={(e) => setCompany({ ...company, fee_applies_to_service: e.target.checked })}
            className="rounded border-gray-300"
          />
          <div>
            <p className="text-sm font-medium text-gray-700">Visit fee applies toward repair cost</p>
            <p className="text-xs text-gray-400">
              When enabled, the visit fee is deducted from the total repair cost if the customer proceeds
            </p>
          </div>
        </label>

        {/* Preview */}
        <div className="rounded-lg bg-blue-50 p-4">
          <p className="text-sm font-medium text-blue-800">What your Ringa receptionist will tell customers:</p>
          <p className="mt-2 text-sm text-blue-700">
            &ldquo;Our diagnostic visit fee is ${company.service_fee} during business hours.
            For after-hours and weekend visits, the fee is ${company.after_hours_fee}
            {" "}(${company.after_hours_credit ?? 80} applied to repair, ${company.after_hours_fee - (company.after_hours_credit ?? 80)} surcharge).
            {company.fee_applies_to_service && " The visit fee is applied toward the cost of repairs if you choose to proceed with the service."}
            &rdquo;
          </p>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
