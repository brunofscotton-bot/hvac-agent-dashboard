"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { CheckCircle, Loader2, AlertCircle, Star } from "lucide-react";

const API_BASE = "/api";

interface ApprovalData {
  company_name: string;
  diagnosis: string;
  diagnosis_notes?: string;
  line_items: {
    name: string;
    description?: string;
    price_good: number;
    price_better: number;
    price_best: number;
    desc_good?: string;
    desc_better?: string;
    desc_best?: string;
  }[];
  total_good: number;
  total_better: number;
  total_best: number;
  status: string;
  approved_tier?: string;
}

type Tier = "good" | "better" | "best";

const TIER_CONFIG: Record<Tier, { label: string; color: string; bg: string; border: string; desc: string }> = {
  good: { label: "Good", color: "text-green-700", bg: "bg-green-50", border: "border-green-300", desc: "Essential repair" },
  better: { label: "Better", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-300", desc: "Recommended option" },
  best: { label: "Best", color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-300", desc: "Premium solution" },
};

export default function ApproveQuotePage() {
  const params = useParams();
  const customerToken = params.token as string;

  const [data, setData] = useState<ApprovalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);
  const [approving, setApproving] = useState(false);
  const [approved, setApproved] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/tech-portal/approve/${customerToken}`);
      if (!res.ok) throw new Error("Failed to load quote");
      const d: ApprovalData = await res.json();
      setData(d);
      if (d.status === "approved" && d.approved_tier) {
        setApproved(true);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [customerToken]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Canvas drawing handlers
  const getCanvasPos = (e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const startDraw = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    const pos = getCanvasPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    const pos = getCanvasPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "#1f2937";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();
    setHasSignature(true);
  };

  const endDraw = () => setIsDrawing(false);

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleApprove = async () => {
    if (!selectedTier) return;
    setApproving(true);
    try {
      let signature: string | undefined;
      if (hasSignature && canvasRef.current) {
        signature = canvasRef.current.toDataURL("image/png");
      }
      const res = await fetch(`${API_BASE}/tech-portal/approve/${customerToken}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: selectedTier, signature }),
      });
      if (!res.ok) throw new Error("Failed to approve");
      setApproved(true);
    } catch (e) {
      console.error(e);
    }
    setApproving(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
        <AlertCircle className="h-12 w-12 text-red-400" />
        <p className="mt-3 text-gray-600">{error || "Quote not found"}</p>
      </div>
    );
  }

  if (approved) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <CheckCircle className="mx-auto h-20 w-20 text-green-500" />
          <h2 className="mt-4 text-2xl font-bold text-gray-800">Quote Approved!</h2>
          <p className="mt-2 text-sm text-gray-500">
            Your technician has been notified and will proceed with the repair.
          </p>
          {(data.approved_tier || selectedTier) && (
            <div className="mt-4 inline-block rounded-full bg-green-100 px-4 py-1 text-sm font-medium text-green-700">
              {TIER_CONFIG[(data.approved_tier || selectedTier) as Tier]?.label} option selected
            </div>
          )}
        </div>
      </div>
    );
  }

  const totals: Record<Tier, number> = {
    good: data.total_good,
    better: data.total_better,
    best: data.total_best,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-4 py-5 text-center">
        <h1 className="text-lg font-bold text-gray-900">{data.company_name}</h1>
        <p className="mt-0.5 text-sm text-gray-500">Your Repair Estimate</p>
      </div>

      <div className="mx-auto max-w-lg space-y-4 px-4 py-4">
        {/* Diagnosis */}
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-700">What We Found</h3>
          <p className="mt-2 text-sm text-gray-800">{data.diagnosis}</p>
          {data.diagnosis_notes && (
            <p className="mt-1 text-sm text-gray-500">{data.diagnosis_notes}</p>
          )}
        </div>

        {/* Tier Options */}
        {!selectedTier ? (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Choose Your Option</h3>
            {(["good", "better", "best"] as Tier[]).map((tier) => {
              const config = TIER_CONFIG[tier];
              return (
                <button
                  key={tier}
                  onClick={() => setSelectedTier(tier)}
                  className={`w-full rounded-lg border-2 ${config.border} ${config.bg} p-4 text-left transition-all hover:shadow-md`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Star className={`h-4 w-4 ${config.color}`} />
                        <span className={`text-base font-bold ${config.color}`}>{config.label}</span>
                      </div>
                      <p className="mt-0.5 text-xs text-gray-500">{config.desc}</p>
                    </div>
                    <span className={`text-xl font-bold ${config.color}`}>${totals[tier].toFixed(2)}</span>
                  </div>
                  <div className="mt-3 space-y-1">
                    {data.line_items.map((item, idx) => {
                      const price = tier === "good" ? item.price_good : tier === "better" ? item.price_better : item.price_best;
                      const desc = tier === "good" ? item.desc_good : tier === "better" ? item.desc_better : item.desc_best;
                      return (
                        <div key={idx} className="flex items-start justify-between text-sm">
                          <div className="flex-1">
                            <span className="text-gray-700">{item.name}</span>
                            {desc && <p className="text-xs text-gray-400">{desc}</p>}
                          </div>
                          <span className="ml-3 text-gray-600">${price.toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <>
            {/* Selected Tier Confirmation */}
            <div className={`rounded-lg border-2 ${TIER_CONFIG[selectedTier].border} ${TIER_CONFIG[selectedTier].bg} p-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Selected Option</p>
                  <p className={`text-lg font-bold ${TIER_CONFIG[selectedTier].color}`}>
                    {TIER_CONFIG[selectedTier].label} - ${totals[selectedTier].toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedTier(null)}
                  className="text-sm text-gray-500 underline hover:text-gray-700"
                >
                  Change
                </button>
              </div>
              <div className="mt-2 space-y-1">
                {data.line_items.map((item, idx) => {
                  const price = selectedTier === "good" ? item.price_good : selectedTier === "better" ? item.price_better : item.price_best;
                  return (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-700">{item.name}</span>
                      <span className="text-gray-600">${price.toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Signature Pad */}
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-700">Signature (optional)</h3>
                {hasSignature && (
                  <button onClick={clearSignature} className="text-xs text-gray-500 underline">
                    Clear
                  </button>
                )}
              </div>
              <canvas
                ref={canvasRef}
                width={500}
                height={150}
                className="mt-2 w-full rounded-lg border border-gray-200 bg-white touch-none"
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={endDraw}
                onMouseLeave={endDraw}
                onTouchStart={startDraw}
                onTouchMove={draw}
                onTouchEnd={endDraw}
              />
              <p className="mt-1 text-xs text-gray-400">Draw your signature above</p>
            </div>

            {/* Approve Button */}
            <button
              onClick={handleApprove}
              disabled={approving}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3.5 text-base font-semibold text-white hover:bg-green-700 disabled:opacity-50"
            >
              {approving ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <CheckCircle className="h-5 w-5" />
              )}
              {approving ? "Approving..." : "Approve Estimate"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
