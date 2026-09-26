"use client";

import { TimelineEvent } from "@/lib/types";
import { Clock, AlertCircle, RefreshCw, GitFork, CheckCircle2 } from "lucide-react";

interface Props {
  events: TimelineEvent[];
}

export function TimelineView({ events }: Props) {
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toISOString().substring(11, 19); // HH:MM:SS
    } catch {
      return isoString;
    }
  };

  const getFlagBadge = (flag: "DELAYED" | "CONFLICT" | "RETRY" | "INFERRED") => {
    switch (flag) {
      case "DELAYED":
        return { bg: "bg-amber-500/20 text-amber-300 border-amber-500/40", icon: Clock, label: "DELAYED" };
      case "CONFLICT":
        return { bg: "bg-red-500/20 text-red-300 border-red-500/40", icon: AlertCircle, label: "CONFLICT" };
      case "RETRY":
        return { bg: "bg-purple-500/20 text-purple-300 border-purple-500/40", icon: RefreshCw, label: "RETRY" };
      case "INFERRED":
        return { bg: "bg-blue-500/20 text-blue-300 border-blue-500/40", icon: GitFork, label: "INFERRED" };
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl">
      <div className="pb-4 border-b border-gray-800 mb-6">
        <h2 className="text-xs uppercase tracking-wider font-semibold text-gray-400">Section 2: Event Stream Timeline</h2>
        <p className="text-sm text-gray-400 mt-0.5">Chronological event ingestion sequence with network delay tracking</p>
      </div>

      <div className="space-y-4">
        {events.map((evt, idx) => {
          const occurredTime = formatTime(evt.event_created_at);
          const receivedTime = formatTime(evt.received_at);
          const isDelayed = evt.delay_seconds > 0;

          return (
            <div
              key={evt.event_id || idx}
              className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg border transition-all ${
                evt.flags?.includes("CONFLICT")
                  ? "bg-red-950/20 border-red-900/50"
                  : evt.flags?.includes("RETRY")
                  ? "bg-purple-950/20 border-purple-900/50"
                  : isDelayed
                  ? "bg-amber-950/15 border-amber-900/40"
                  : "bg-gray-950 border-gray-800"
              }`}
            >
              {/* Event Info */}
              <div className="flex items-center gap-3 min-w-[280px]">
                <div className={`p-2 rounded-lg ${
                  evt.flags?.includes("CONFLICT")
                    ? "bg-red-500/20 text-red-400"
                    : evt.flags?.includes("RETRY")
                    ? "bg-purple-500/20 text-purple-400"
                    : "bg-blue-500/20 text-blue-400"
                }`}>
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{evt.event_type}</span>
                    <span className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded border border-gray-700">
                      {evt.provider}
                    </span>
                  </div>
                  {evt.attempt_id && (
                    <span className="text-xs font-mono text-gray-400 block mt-0.5">
                      Attempt ID: {evt.attempt_id} {evt.amount ? `(₹${evt.amount.toLocaleString("en-IN")})` : ""}
                    </span>
                  )}
                </div>
              </div>

              {/* Timing metrics */}
              <div className="flex items-center gap-6 text-xs text-gray-300">
                <div className="flex flex-col">
                  <span className="text-gray-500 text-[10px] uppercase font-semibold">Occurred</span>
                  <span className="font-mono text-gray-200 font-medium">{occurredTime}</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-gray-500 text-[10px] uppercase font-semibold">Received</span>
                  <span className="font-mono text-gray-200 font-medium">{receivedTime}</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-gray-500 text-[10px] uppercase font-semibold">Delay</span>
                  <span className={`font-mono font-bold ${evt.delay_seconds > 0 ? "text-amber-400" : "text-gray-400"}`}>
                    {evt.delay_seconds}s
                  </span>
                </div>
              </div>

              {/* Flag Badges */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {evt.flags?.map((flag) => {
                  const badge = getFlagBadge(flag);
                  const Icon = badge.icon;
                  return (
                    <span
                      key={flag}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold border ${badge.bg}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{badge.label}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
