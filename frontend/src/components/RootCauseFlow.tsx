"use client";

import { ArrowDown, ArrowRight, Activity, CircleDot } from "lucide-react";

interface Props {
  chain: string[];
}

export function RootCauseFlow({ chain }: Props) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl">
      <div className="pb-4 border-b border-gray-800 mb-6">
        <h2 className="text-xs uppercase tracking-wider font-semibold text-gray-400">Section 5: Root-Cause Causal Chain</h2>
        <p className="text-sm text-gray-400 mt-0.5">Vertical event causal propagation leading to resolution pause</p>
      </div>

      {/* Desktop horizontal / Mobile vertical step flow */}
      <div className="hidden md:flex items-center justify-between gap-2 overflow-x-auto py-4 px-2">
        {chain.map((node, idx) => {
          const isLast = idx === chain.length - 1;
          const isWarning = node.includes("TIMEOUT") || node.includes("LOST") || node.includes("RETRY") || node.includes("DUPLICATE");
          return (
            <div key={node + idx} className="flex items-center gap-2 flex-shrink-0">
              <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-xs font-bold font-mono transition-all ${
                isLast
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                  : isWarning
                  ? "bg-purple-950/40 text-purple-300 border-purple-800/60"
                  : "bg-gray-950 text-gray-200 border-gray-800"
              }`}>
                <CircleDot className="w-3.5 h-3.5 text-blue-400" />
                <span>{node}</span>
              </div>
              {!isLast && (
                <ArrowRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile vertical flow */}
      <div className="flex md:hidden flex-col items-center gap-2 py-2">
        {chain.map((node, idx) => {
          const isLast = idx === chain.length - 1;
          const isWarning = node.includes("TIMEOUT") || node.includes("LOST") || node.includes("RETRY") || node.includes("DUPLICATE");
          return (
            <div key={node + idx} className="flex flex-col items-center gap-2 w-full">
              <div className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-xs font-bold font-mono w-full text-center ${
                isLast
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/60"
                  : isWarning
                  ? "bg-purple-950/40 text-purple-300 border-purple-800/60"
                  : "bg-gray-950 text-gray-200 border-gray-800"
              }`}>
                <Activity className="w-4 h-4 text-blue-400" />
                <span>{node}</span>
              </div>
              {!isLast && (
                <ArrowDown className="w-4 h-4 text-gray-600 my-1" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
