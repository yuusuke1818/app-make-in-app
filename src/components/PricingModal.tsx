"use client";

import { useState } from "react";
import { PLANS, type PricingPlan } from "@/lib/plans";

interface PricingModalProps {
  currentPlanId: string;
  onSelectPlan: (plan: PricingPlan) => void;
  onClose: () => void;
}

export default function PricingModal({ currentPlanId, onSelectPlan, onClose }: PricingModalProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSelect = async (plan: PricingPlan) => {
    if (plan.id === "free" || plan.id === currentPlanId) return;
    setLoading(plan.id);
    onSelectPlan(plan);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-[#0a0a1a] p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold">💎 プランを選択</h2>
            <p className="mt-1 text-xs text-[#888]">あなたに合ったプランでAIアプリ作成を楽しもう</p>
          </div>
          <button onClick={onClose} className="text-2xl text-[#666] hover:text-white">✕</button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan) => {
            const isCurrent = plan.id === currentPlanId;
            const isPopular = plan.id === "pro";
            return (
              <div
                key={plan.id}
                className="relative flex flex-col rounded-xl border p-4"
                style={{
                  borderColor: isPopular ? "#AA44FF" : isCurrent ? "#4ECDC4" : "#222233",
                  background: isPopular ? "#AA44FF0A" : "#111118",
                }}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#AA44FF] px-3 py-0.5 text-[10px] font-bold text-white">
                    人気No.1
                  </div>
                )}

                <div className="mb-3 text-center">
                  <span className="text-2xl">{plan.badge}</span>
                  <h3 className="mt-1 text-base font-bold" style={{ color: plan.color }}>
                    {plan.name}
                  </h3>
                  <div className="mt-1">
                    <span className="text-2xl font-black">
                      {plan.price === 0 ? "無料" : `¥${plan.price.toLocaleString()}`}
                    </span>
                    {plan.price > 0 && <span className="text-xs text-[#888]">/月</span>}
                  </div>
                </div>

                <ul className="mb-4 flex-1 space-y-2">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-[11px] text-[#ccc]">
                      <span className="text-[#4ECDC4]">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelect(plan)}
                  disabled={isCurrent || loading === plan.id}
                  className="w-full rounded-lg py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.02] disabled:opacity-40"
                  style={{
                    background: isCurrent
                      ? "#333"
                      : `linear-gradient(135deg, ${plan.color}, ${plan.color}CC)`,
                  }}
                >
                  {loading === plan.id
                    ? "処理中..."
                    : isCurrent
                    ? "現在のプラン"
                    : plan.price === 0
                    ? "現在のプラン"
                    : "このプランにする"}
                </button>
              </div>
            );
          })}
        </div>

        <p className="mt-4 text-center text-[10px] text-[#555]">
          いつでもプラン変更・解約可能 • 決済はStripeによる安全な処理
        </p>
      </div>
    </div>
  );
}
