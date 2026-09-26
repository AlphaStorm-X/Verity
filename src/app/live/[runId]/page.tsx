"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { SimulationRun } from "@/lib/types";
import { Navbar } from "@/components/Navbar";
import { Activity, Clock, ShieldCheck, ArrowRight, CheckCircle2, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function LiveIncidentView() {
  const params = useParams();
  const runId = (params.runId as string) || "run_demo_001";

  const { data: run, isLoading } = useQuery<SimulationRun>({
    queryKey: ["simulation-run", runId],
    queryFn: async () => {
      // Fetch simulation run state
      const res = await fetch(`/api/simulations/${runId}/run`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to fetch simulation run");
      return (await res.json()).run;
    },
    refetchInterval: 2000,
  });

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-800 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                REAL-TIME INCIDENT RESOLVER
              </span>
              <span className="text-xs text-gray-500 font-mono">Run ID: {runId}</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white mt-1">
              Live Resolution Stream
            </h1>
          </div>

          {run?.transaction_id && (
            <Link
              href={`/transactions/${run.transaction_id}`}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors"
            >
              <span>View Full Investigation Audit</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-gray-500 text-sm font-mono">
            Ingesting live telemetry stream...
          </div>
        ) : run ? (
          <div className="space-y-8">
            {/* Live Progress Card */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-bold text-white">Execution Stream Progress</span>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  STATUS: {run.status}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-950 rounded-full h-3 border border-gray-800 overflow-hidden">
                <div
                  className="bg-blue-500 h-full transition-all duration-500"
                  style={{ width: `${(run.current_step / run.total_steps) * 100}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-xs text-gray-400 font-mono mt-2">
                <span>Ingested {run.current_step} of {run.total_steps} telemetry events</span>
                <span>Transaction: {run.transaction_id}</span>
              </div>
            </div>

            {/* Ingested Stream Timeline */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl">
              <h2 className="text-xs uppercase tracking-wider font-semibold text-gray-400 pb-3 border-b border-gray-800 mb-6">
                Ingested Real-Time Events
              </h2>

              <div className="space-y-4">
                {run.timeline_events.map((evt, idx) => (
                  <div
                    key={evt.event_id || idx}
                    className="flex items-center justify-between p-4 bg-gray-950 border border-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-white block">{evt.event_type}</span>
                        <span className="text-xs text-gray-400 font-mono">Provider: {evt.provider}</span>
                      </div>
                    </div>

                    <div className="text-right font-mono text-xs text-gray-400">
                      <div>Occurred: {evt.event_created_at.substring(11, 19)}</div>
                      <div>Delay: {evt.delay_seconds}s</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
