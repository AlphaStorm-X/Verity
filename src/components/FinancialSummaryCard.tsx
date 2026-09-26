"use client";

import { FinancialResolution } from "@/lib/types";
import { AlertTriangle, CheckCircle, ShieldAlert, DollarSign } from "lucide-react";

interface Props {
  declaredAmount: number;
  resolution: FinancialResolution;
}

export function FinancialSummaryCard({ declaredAmount, resolution }: Props) {
  const { observed_amount, candidate_amount, committed_amount, resolution_state } = resolution;

  const getStatusBadge = (state: string) => {
    switch (state) {
      case "HELD_FOR_REVIEW":
      case "POTENTIAL_DUPLICATE":
        return {
          bg: "bg-amber-500/20 text-amber-400 border-amber-500/40",
          icon: AlertTriangle,
          label: `${state} — HELD AT ₹0`
        };
      case "CONFIRMED":
        return {
          bg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
          icon: CheckCircle,
          label: "CONFIRMED & COMMITTED"
        };
      case "REJECTED":
        return {
          bg: "bg-red-500/20 text-red-400 border-red-500/40",
          icon: ShieldAlert,
          label: "REJECTED AS DUPLICATE"
        };
      default:
        return {
          bg: "bg-blue-500/20 text-blue-400 border-blue-500/40",
          icon: DollarSign,
          label: state
        };
    }
  };

  const badge = getStatusBadge(resolution_state);
  const BadgeIcon = badge.icon;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-gray-800 mb-6">
        <div>
          <h2 className="text-xs uppercase tracking-wider font-semibold text-gray-400">Section 1: Financial Resolution Summary</h2>
          <p className="text-sm text-gray-400 mt-0.5">Authoritative financial status returned by VERITY engine API</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold tracking-wide ${badge.bg}`}>
          <BadgeIcon className="w-4 h-4" />
          <span>{badge.label}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card 1: Declared Intent */}
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
          <span className="text-xs text-gray-400 font-medium">Declared Intent</span>
          <div className="text-2xl font-extrabold text-white mt-1">
            ₹{declaredAmount.toLocaleString("en-IN")}
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">Original checkout amount</span>
        </div>

        {/* Card 2: Observed Exposure */}
        <div className="bg-gray-950 border border-amber-900/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-400 font-medium">Observed Exposure</span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">Total Ingested</span>
          </div>
          <div className="text-2xl font-extrabold text-amber-300 mt-1">
            ₹{observed_amount.toLocaleString("en-IN")}
          </div>
          <span className="text-[11px] text-gray-400 mt-1 block">Sum of raw provider attempts</span>
        </div>

        {/* Card 3: Candidate Amount */}
        <div className="bg-gray-950 border border-blue-900/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-blue-400 font-medium">Candidate Amount</span>
            <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-bold">Legitimate Unit</span>
          </div>
          <div className="text-2xl font-extrabold text-blue-300 mt-1">
            ₹{candidate_amount.toLocaleString("en-IN")}
          </div>
          <span className="text-[11px] text-gray-400 mt-1 block">Evaluated valid transaction size</span>
        </div>

        {/* Card 4: Committed Amount */}
        <div className={`bg-gray-950 border rounded-lg p-4 ${
          committed_amount === 0 
            ? "border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.15)]" 
            : "border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-300">Committed to Ledger</span>
            <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
              committed_amount === 0 ? "bg-amber-500/30 text-amber-300 border border-amber-500/40" : "bg-emerald-500/30 text-emerald-300 border border-emerald-500/40"
            }`}>
              {committed_amount === 0 ? "LEDGER PROTECTED" : "LEDGER COMMITTED"}
            </span>
          </div>
          <div className={`text-3xl font-black mt-1 ${committed_amount === 0 ? "text-amber-400" : "text-emerald-400"}`}>
            ₹{committed_amount.toLocaleString("en-IN")}
          </div>
          <span className="text-[11px] text-gray-400 mt-1 block">Actual funds written to ledger</span>
        </div>
      </div>
    </div>
  );
}
