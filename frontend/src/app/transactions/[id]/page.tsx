"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { IncidentAnalysis } from "@/lib/types";
import { Navbar } from "@/components/Navbar";
import { FinancialSummaryCard } from "@/components/FinancialSummaryCard";
import { TimelineView } from "@/components/TimelineView";
import { CorrelationEvidenceCard } from "@/components/CorrelationEvidenceCard";
import { WhyNotCommitBanner } from "@/components/WhyNotCommitBanner";
import { RootCauseFlow } from "@/components/RootCauseFlow";
import { RecommendationAndActions } from "@/components/RecommendationAndActions";
import { AuditTrailView } from "@/components/AuditTrailView";
import { AIExplanationCard } from "@/components/AIExplanationCard";
import { ShieldCheck, GitCompare, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function InvestigationView() {
  const params = useParams();
  const transactionId = (params.id as string) || "tx_canonical_retry_001";
  const queryClient = useQueryClient();

  const { data: analysis, isLoading, error, refetch } = useQuery<IncidentAnalysis>({
    queryKey: ["transaction-analysis", transactionId],
    queryFn: async () => {
      const res = await fetch(`/api/transactions/${transactionId}/analysis`);
      if (!res.ok) throw new Error(`Failed to load transaction analysis for ${transactionId}`);
      return res.json();
    },
    refetchInterval: 3000,
  });

  const handleReviewSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["transaction-analysis", transactionId] });
    refetch();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {/* Header toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-800 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest font-extrabold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                THE PRIMARY DEMO SCREEN
              </span>
              <span className="text-xs text-gray-500 font-mono">ID: {transactionId}</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white mt-1 flex items-center gap-2">
              <span>Incident Investigation &amp; Truth Audit</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => refetch()}
              className="bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh API</span>
            </button>

            <Link
              href={`/compare/${transactionId}`}
              className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <GitCompare className="w-4 h-4" />
              <span>Compare: Naive vs VERITY</span>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-gray-500 text-sm font-mono">
            Fetching authoritative IncidentAnalysis from backend API...
          </div>
        ) : error ? (
          <div className="p-4 bg-red-950/40 border border-red-800 text-red-300 rounded-lg text-sm">
            Error loading analysis: {(error as Error).message}
          </div>
        ) : analysis ? (
          <div className="space-y-8">
            {/* Section 1: Financial Summary */}
            <FinancialSummaryCard
              declaredAmount={analysis.declared_amount}
              resolution={analysis.financial_resolution}
            />

            {/* Mandatory Section 4: Why not commit? (Prominently placed above timeline when committed_amount == 0) */}
            <WhyNotCommitBanner
              committedAmount={analysis.financial_resolution.committed_amount}
              explanation={analysis.why_not_commit_explanation}
              resolutionState={analysis.financial_resolution.resolution_state}
            />

            {/* Read-Only AI Explanation Layer */}
            <AIExplanationCard transactionId={analysis.transaction_id} />

            {/* Section 2: Timeline */}
            <TimelineView events={analysis.timeline} />

            {/* Section 3: Correlation Evidence */}
            <CorrelationEvidenceCard
              evidence={analysis.correlation_evidence}
              confidence={analysis.financial_resolution.resolution_confidence}
            />

            {/* Section 5: Root Cause Flow */}
            <RootCauseFlow chain={analysis.root_cause_chain} />

            {/* Section 6: Recommendation & Reviewer Action Buttons */}
            <RecommendationAndActions
              incidentId={analysis.incident_id}
              recommendation={analysis.recommendation}
              candidateAttemptIds={analysis.financial_resolution.candidate_attempt_ids}
              currentCommittedAmount={analysis.financial_resolution.committed_amount}
              onReviewSuccess={handleReviewSuccess}
            />

            {/* Section 7: Audit Trail */}
            <AuditTrailView auditTrail={analysis.audit_trail} />
          </div>
        ) : null}
      </main>
    </div>
  );
}
