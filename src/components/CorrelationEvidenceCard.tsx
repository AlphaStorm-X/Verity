"use client";

import { CorrelationEvidence } from "@/lib/types";
import { Check, X, Shield, Sparkles } from "lucide-react";

interface Props {
  evidence: CorrelationEvidence;
  confidence: number;
}

export function CorrelationEvidenceCard({ evidence, confidence }: Props) {
  const { relation, correlation_score, signals, independent_signal_count } = evidence;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-800 mb-6 gap-4">
        <div>
          <h2 className="text-xs uppercase tracking-wider font-semibold text-gray-400">Section 3: Cross-Provider Correlation Evidence</h2>
          <p className="text-sm text-gray-400 mt-0.5">Deterministically matched signals across independent gateway payloads</p>
        </div>

        {/* Running score & Resolution confidence - Strictly MUST be rendered as /100 */}
        <div className="flex items-center gap-4">
          <div className="bg-blue-950/60 border border-blue-800/60 px-4 py-2 rounded-lg text-right">
            <span className="text-[10px] uppercase font-bold text-blue-400 block tracking-wider">Correlation Score</span>
            <span className="text-xl font-black text-blue-300 font-mono">
              {correlation_score}/100
            </span>
          </div>

          <div className="bg-purple-950/60 border border-purple-800/60 px-4 py-2 rounded-lg text-right">
            <span className="text-[10px] uppercase font-bold text-purple-400 block tracking-wider">Resolution Confidence</span>
            <span className="text-xl font-black text-purple-300 font-mono">
              {confidence}/100
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left summary column */}
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm mb-2">
              <Shield className="w-4 h-4" />
              <span>Identity Match Assessment</span>
            </div>
            <div className="text-2xl font-extrabold text-white">
              {relation}
            </div>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              Ingested events evaluate to <strong className="text-gray-200">{relation}</strong>. Total of <strong className="text-gray-200">{independent_signal_count} independent signals</strong> confirm cross-attempt identity correlation.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-800">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Independent Signal Count:</span>
              <span className="font-bold text-blue-400 font-mono">{independent_signal_count}</span>
            </div>
          </div>
        </div>

        {/* Signals Table */}
        <div className="lg:col-span-2 bg-gray-950 border border-gray-800 rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-gray-900/60 border-b border-gray-800 flex justify-between items-center text-xs font-semibold text-gray-400">
            <span>SIGNAL IDENTIFIER</span>
            <span>MATCH STATUS & WEIGHT</span>
          </div>
          <div className="divide-y divide-gray-800/60">
            {signals.map((sig) => (
              <div key={sig.signal} className="px-4 py-3 flex items-center justify-between hover:bg-gray-900/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-1 rounded-full ${sig.matched ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-800 text-gray-500"}`}>
                    {sig.matched ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  </div>
                  <span className="text-sm font-mono text-gray-200">{sig.signal}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-gray-400">Weight: +{sig.weight}</span>
                  <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                    sig.matched 
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" 
                      : "bg-gray-800 text-gray-500"
                  }`}>
                    {sig.matched ? "MATCHED" : "UNMATCHED"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
