"use client";

import { AuditTrailEntry } from "@/lib/types";
import { History, User, Cpu, ShieldCheck } from "lucide-react";

interface Props {
  auditTrail: AuditTrailEntry[];
}

export function AuditTrailView({ auditTrail }: Props) {
  // Sort reverse-chronological
  const sortedTrail = [...auditTrail].reverse();

  const getActorBadge = (actor: string) => {
    switch (actor) {
      case "REVIEWER":
        return { bg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40", icon: User };
      case "SIMULATOR":
        return { bg: "bg-purple-500/20 text-purple-300 border-purple-500/40", icon: ShieldCheck };
      default:
        return { bg: "bg-blue-500/20 text-blue-300 border-blue-500/40", icon: Cpu };
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl">
      <div className="pb-4 border-b border-gray-800 mb-6">
        <h2 className="text-xs uppercase tracking-wider font-semibold text-gray-400">Section 7: State Transition Audit Trail</h2>
        <p className="text-sm text-gray-400 mt-0.5">Reverse-chronological log of immutable state changes and reviewer overrides</p>
      </div>

      <div className="relative border-l-2 border-gray-800 ml-4 space-y-6">
        {sortedTrail.map((entry, idx) => {
          const badge = getActorBadge(entry.actor);
          const ActorIcon = badge.icon;
          const timestampFormatted = new Date(entry.timestamp).toLocaleString("en-IN");

          return (
            <div key={idx} className="relative pl-6">
              {/* Dot icon */}
              <div className="absolute -left-[17px] top-0 bg-gray-900 border-2 border-blue-500 p-1 rounded-full text-blue-400">
                <History className="w-3.5 h-3.5" />
              </div>

              <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold border ${badge.bg}`}>
                      <ActorIcon className="w-3 h-3" />
                      <span>{entry.actor}</span>
                    </span>

                    <span className="text-xs font-mono font-bold text-white bg-gray-900 px-2 py-0.5 rounded border border-gray-800">
                      {entry.from_state} → {entry.to_state}
                    </span>
                  </div>

                  <span className="text-xs font-mono text-gray-500">{timestampFormatted}</span>
                </div>

                <p className="text-xs text-gray-300 font-mono bg-gray-900/60 p-2.5 rounded border border-gray-800/80">
                  {entry.notes}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
