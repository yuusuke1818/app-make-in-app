"use client";

import { getPlan, type UserUsage } from "@/lib/plans";

interface UsageBadgeProps {
  usage: UserUsage;
  onUpgrade: () => void;
}

export default function UsageBadge({ usage, onUpgrade }: UsageBadgeProps) {
  const plan = getPlan(usage.planId);
  const genRemain = plan.generateLimit === -1 ? "∞" : Math.max(0, plan.generateLimit - usage.generateCount);
  const impRemain = plan.improveLimit === -1 ? "∞" : Math.max(0, plan.improveLimit - usage.improveCount);
  const isLow = typeof genRemain === "number" && genRemain <= 2;

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex items-center gap-1.5 rounded-full px-3 py-1"
        style={{ background: `${plan.color}20`, border: `1px solid ${plan.color}44` }}
      >
        <span className="text-sm">{plan.badge}</span>
        <span className="text-[10px] font-bold" style={{ color: plan.color }}>
          {plan.name}
        </span>
      </div>

      <div className="flex items-center gap-2 text-[10px] text-[#888]">
        <span style={{ color: isLow ? "#f44" : "#aaa" }}>
          生成: {genRemain}回
        </span>
        <span>改良: {impRemain}回</span>
      </div>

      {(isLow || usage.planId === "free") && (
        <button
          onClick={onUpgrade}
          className="rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] px-2.5 py-0.5 text-[9px] font-bold text-white transition-transform hover:scale-105"
        >
          ⬆ UP
        </button>
      )}
    </div>
  );
}
