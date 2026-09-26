"use client";

import { useQuery } from "@tanstack/react-query";
import { DashboardStats } from "@/lib/types";
import { ShieldCheck, AlertTriangle, ShieldAlert, Activity, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";

export default function CommandCenter() {
  const { data: stats, isLoading, error, refetch } = useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard");
      if (!res.ok) throw new Error("Failed to fetch dashboard stats");
      return res.json();
    },
    refetchInterval: 3000,
  });

  const intentCounts = stats?.intent_counts || {};
  const recentIncidents = stats?.recent_incidents || [];
  const exposureTotal = stats?.potential_duplicate_exposure_total ?? 0;
  const preventedCount = stats?.prevented_ledger_commitments_count ?? 0;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {/* Top Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-800 mb-8">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <ShieldCheck className="w-7 h-7 text-blue-500" />
              <span>VERITY Command Center</span>
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Real-time monitor for payment intent resolution &amp; duplicate commitment prevention
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/transactions/tx_canonical_retry_001"
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors"
            >
              <span>Launch Demo Investigation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-gray-500 text-sm font-mono">
            Loading real-time command center telemetry from API...
          </div>
        ) : error ? (
          <div className="p-4 bg-red-950/40 border border-red-800 text-red-300 rounded-lg text-sm">
            Error loading dashboard telemetry: {(error as Error).message}
          </div>
        ) : stats ? (
          <div className="space-y-8">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Metric 1: Potential Duplicate Exposure Total */}
              <div className="bg-gray-900 border border-amber-900/60 rounded-xl p-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-semibold text-amber-400">
                    Potential Duplicate Exposure Total
                  </span>
                  <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/30">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-white mt-3">
                  ₹{exposureTotal.toLocaleString("en-IN")}
                </div>
                <span className="text-xs text-gray-400 mt-2 block">
                  Total raw observed payment exposure across unverified attempts
                </span>
              </div>

              {/* Metric 2: Automatic Ledger Commitments Prevented */}
              <div className="bg-gray-900 border border-blue-900/60 rounded-xl p-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-semibold text-blue-400">
                    Automatic Ledger Commitments Prevented
                  </span>
                  <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-white mt-3">
                  {preventedCount}
                </div>
                <span className="text-xs text-gray-400 mt-2 block">
                  Incidents where engine halted duplicate ledger write (never "money saved")
                </span>
              </div>

              {/* Metric 3: Active Incidents Held */}
              <div className="bg-gray-900 border border-purple-900/60 rounded-xl p-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-semibold text-purple-400">
                    Held for Manual Review
                  </span>
                  <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg border border-purple-500/30">
                    <Activity className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-white mt-3">
                  {intentCounts.HELD_FOR_REVIEW || 0}
                </div>
                <span className="text-xs text-gray-400 mt-2 block">
                  Transactions in HELD_FOR_REVIEW state requiring reviewer action
                </span>
              </div>
            </div>

            {/* Intent Counts by State Grid */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl">
              <h2 className="text-xs uppercase tracking-wider font-semibold text-gray-400 pb-3 border-b border-gray-800 mb-4">
                Intent Counts by Resolution State
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {Object.entries(intentCounts).map(([state, count]) => (
                  <div key={state} className="bg-gray-950 border border-gray-800 p-4 rounded-lg">
                    <span className="text-[11px] font-mono text-gray-400 block truncate">{state}</span>
                    <span className="text-2xl font-extrabold text-white mt-1 block font-mono">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Incidents Table */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-gray-800 mb-4">
                <h2 className="text-xs uppercase tracking-wider font-semibold text-gray-400">
                  Active System Incidents
                </h2>
                <span className="text-xs text-gray-500 font-mono">Live API Feed</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-950 text-gray-400 uppercase font-mono border-b border-gray-800">
                    <tr>
                      <th className="px-4 py-3">Incident ID</th>
                      <th className="px-4 py-3">Transaction ID</th>
                      <th className="px-4 py-3">Declared</th>
                      <th className="px-4 py-3">Observed</th>
                      <th className="px-4 py-3">Committed</th>
                      <th className="px-4 py-3">State</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800 font-mono">
                    {recentIncidents.map((inc) => (
                      <tr key={inc.id} className="hover:bg-gray-800/40 transition-colors">
                        <td className="px-4 py-3 text-blue-400 font-bold">{inc.id}</td>
                        <td className="px-4 py-3 text-gray-300">{inc.transaction_id}</td>
                        <td className="px-4 py-3 text-white font-bold">₹{(inc.declared_amount ?? 0).toLocaleString("en-IN")}</td>
                        <td className="px-4 py-3 text-amber-300">₹{(inc.observed_amount ?? 0).toLocaleString("en-IN")}</td>
                        <td className="px-4 py-3 text-emerald-400 font-bold">₹{(inc.committed_amount ?? 0).toLocaleString("en-IN")}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            inc.state === "HELD_FOR_REVIEW" || inc.state === "POTENTIAL_DUPLICATE"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                              : inc.state === "CONFIRMED"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                              : "bg-red-500/20 text-red-300 border border-red-500/40"
                          }`}>
                            {inc.state}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            href={`/transactions/${inc.transaction_id}`}
                            className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-bold hover:underline"
                          >
                            <span>Inspect</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
