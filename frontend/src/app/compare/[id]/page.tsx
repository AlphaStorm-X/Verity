"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { IncidentAnalysis } from "@/lib/types";
import { Navbar } from "@/components/Navbar";
import { GitCompare, AlertTriangle, ShieldCheck, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ComparePage() {
  const params = useParams();
  const transactionId = (params.id as string) || "tx_canonical_retry_001";

  const { data: analysis, isLoading, error } = useQuery<IncidentAnalysis>({
    queryKey: ["transaction-analysis", transactionId],
    queryFn: async () => {
      const res = await fetch(`/api/transactions/${transactionId}/analysis`);
      if (!res.ok) throw new Error("Failed to load compare analysis data");
      return res.json();
    },
  });

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-800 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest font-extrabold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                HEAD-TO-HEAD AUDIT
              </span>
              <span className="text-xs text-gray-500 font-mono">Transaction ID: {transactionId}</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white mt-1">
              Naive Engine vs. VERITY Truth Engine
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Side-by-side execution result for the identical ingested payment event set
            </p>
          </div>

          <Link
            href={`/transactions/${transactionId}`}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors"
          >
            <span>Back to Full Investigation</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-gray-500 text-sm font-mono">
            Loading side-by-side compare metrics from API...
          </div>
        ) : error ? (
          <div className="p-4 bg-red-950/40 border border-red-800 text-red-300 rounded-lg text-sm">
            Error loading compare metrics: {(error as Error).message}
          </div>
        ) : analysis ? (
          <div className="space-y-8">
            {/* Side by side comparison cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Naive Engine Card */}
              <div className="bg-gray-900 border-2 border-red-500/60 rounded-xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-red-500/20 text-red-300 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-bl border-b border-l border-red-500/40">
                  STANDARD LEDGER / NAIVE RECONCILIATION
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-red-500/20 text-red-400 rounded-lg border border-red-500/30">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Naive Event-Driven Engine</h2>
                    <span className="text-xs text-red-400 font-mono font-semibold">Vulnerable to Double-Charging</span>
                  </div>
                </div>

                <div className="bg-gray-950 border border-red-900/50 rounded-lg p-5 mb-6">
                  <span className="text-xs text-gray-400 font-medium block">Total Funds Written to Ledger:</span>
                  <div className="text-4xl font-black text-red-400 mt-2 font-mono">
                    ₹{analysis.naive_amount.toLocaleString("en-IN")}
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-red-400 font-bold bg-red-950/60 p-2.5 rounded border border-red-800/60">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>WRONG — Double-counted Stripe (₹2,000) &amp; Razorpay (₹2,000) attempts!</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-gray-300">
                  <div className="flex justify-between py-1.5 border-b border-gray-800">
                    <span className="text-gray-400">Idempotency check:</span>
                    <span className="text-red-400 font-mono">BYPASSED (different provider IDs)</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-800">
                    <span className="text-gray-400">Cross-provider correlation:</span>
                    <span className="text-red-400 font-mono">NONE</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-gray-400">Resulting Ledger State:</span>
                    <span className="text-red-400 font-bold">DOUBLE COMMITMENT</span>
                  </div>
                </div>
              </div>

              {/* VERITY Truth Engine Card */}
              <div className="bg-gray-900 border-2 border-emerald-500/60 rounded-xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-bl border-b border-l border-emerald-500/40">
                  VERITY DETERMINISTIC ENGINE
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">VERITY Truth Engine</h2>
                    <span className="text-xs text-emerald-400 font-mono font-semibold">Ledger Commitment Guard</span>
                  </div>
                </div>

                <div className="bg-gray-950 border border-emerald-900/50 rounded-lg p-5 mb-6 space-y-4">
                  <div>
                    <span className="text-xs text-gray-400 font-medium block">Committed to Ledger:</span>
                    <div className="text-4xl font-black text-emerald-400 mt-1 font-mono">
                      ₹{analysis.verity_committed_amount.toLocaleString("en-IN")}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-800">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-bold block">Candidate Legitimate</span>
                      <span className="text-base font-extrabold text-blue-300 font-mono">
                        ₹{analysis.verity_candidate_amount.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-bold block">Flagged Duplicate</span>
                      <span className="text-base font-extrabold text-amber-300 font-mono">
                        ₹{analysis.verity_flagged_duplicate_amount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-bold bg-emerald-950/60 p-2.5 rounded border border-emerald-800/60">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>CORRECT — Refused commitment pending supersedence proof!</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-gray-300">
                  <div className="flex justify-between py-1.5 border-b border-gray-800">
                    <span className="text-gray-400">Idempotency check:</span>
                    <span className="text-emerald-400 font-mono">CROSS-PROVIDER FINGERPRINT MATCH</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-800">
                    <span className="text-gray-400">Correlation Score:</span>
                    <span className="text-emerald-400 font-mono font-bold">
                      {analysis.correlation_evidence.correlation_score}/100
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-gray-400">Resulting Ledger State:</span>
                    <span className="text-emerald-400 font-bold">HELD_FOR_REVIEW (₹0 COMMITTED)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
