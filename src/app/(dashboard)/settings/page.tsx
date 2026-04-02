"use client";

import { useEffect, useState } from "react";
import { Save, Building, Phone } from "lucide-react";
import { getCompany, updateCompany, type Company } from "@/lib/api";

export default function SettingsPage() {
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
      name: company.name,
      phone: company.phone,
      address: company.address,
      twilio_phone_number: company.twilio_phone_number,
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
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="mt-1 text-gray-500">Manage your company information</p>

      <div className="mt-6 w-full max-w-xl space-y-8">
        {/* Company Info */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold">Company Information</h2>
          </div>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Name</label>
              <input
                value={company.name}
                onChange={(e) => setCompany({ ...company, name: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                value={company.email}
                disabled
                className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                value={company.phone ?? ""}
                onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea
                value={company.address ?? ""}
                onChange={(e) => setCompany({ ...company, address: e.target.value })}
                rows={2}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Twilio */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold">Phone Number (Twilio)</h2>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Twilio Phone Number</label>
            <input
              value={company.twilio_phone_number ?? ""}
              onChange={(e) => setCompany({ ...company, twilio_phone_number: e.target.value })}
              placeholder="+14075551234"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <p className="mt-1 text-xs text-gray-400">
              This is the phone number customers will call. It must be a Twilio number connected to Vapi.
            </p>
          </div>
        </div>

        {/* Integration Status */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Integration Status</h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Vapi.ai (AI Agent)</span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${company.vapi_assistant_id ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {company.vapi_assistant_id ? "Connected" : "Not Provisioned"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Twilio (Phone & SMS)</span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${company.twilio_phone_number ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {company.twilio_phone_number ? "Connected" : "Not Configured"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Onboarding</span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${company.onboarding_completed ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                {company.onboarding_completed ? "Complete" : "Pending"}
              </span>
            </div>
          </div>
        </div>

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
