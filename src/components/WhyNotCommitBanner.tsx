"use client";

import { ShieldAlert, AlertCircle, Info } from "lucide-react";

interface Props {
  committedAmount: number;
  explanation: string;
  resolutionState: string;
}

export function WhyNotCommitBanner({ committedAmount, explanation, resolutionState }: Props) {
  // Mandatory whenever committed_amount == 0 and state is not terminal REJECTED/CONFIRMED
  if (committedAmount > 0) {
    return null;
  }

  return (
    <div className="bg-amber-950/30 border-2 border-amber-500/80 rounded-xl p-6 shadow-2xl relative overflow-hidden my-6">
      <div className="absolute top-0 right-0 bg-amber-500/20 text-amber-300 text-[10px] uppercase tracking-widest font-black px-4 py-1 rounded-bl border-b border-l border-amber-500/40">
        MANDATORY SAFETY RATIONALE
      </div>

      <div className="flex items-start gap-4">
        <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/40 flex-shrink-0 mt-0.5">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-amber-200 tracking-tight">
              Section 4: Why not commit to ledger?
            </h2>
            <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono font-semibold">
              State: {resolutionState}
            </span>
          </div>

          <p className="text-base font-semibold text-white leading-relaxed bg-amber-900/20 p-4 rounded-lg border border-amber-800/40">
            "{explanation || "Two independent attempts reached CONFIRMED. No authoritative cross-provider identifier proves one supersedes the other. VERITY refuses to guess."}"
          </p>

          <div className="flex items-center gap-2 text-xs text-amber-300/80 pt-1">
            <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>
              VERITY invariant: Money is only committed (`committed_amount &gt; 0`) when supersedence is deterministically proven.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
