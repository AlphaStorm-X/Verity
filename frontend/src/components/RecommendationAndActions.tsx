"use client";

import { useState } from "react";
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from "lucide-react";

interface Props {
  incidentId: string;
  recommendation: string;
  candidateAttemptIds: string[];
  currentCommittedAmount: number;
  onReviewSuccess: () => void;
}

export function RecommendationAndActions({
  incidentId,
  recommendation,
  candidateAttemptIds,
  currentCommittedAmount,
  onReviewSuccess,
}: Props) {
  const [selectedAttempt, setSelectedAttempt] = useState<string>(candidateAttemptIds[0] || "");
  const [reviewerNote, setReviewerNote] = useState<string>("");
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [reviewMessage, setReviewMessage] = useState<string | null>(null);

  const handleReview = async (decision: "CONFIRM_ATTEMPT" | "MARK_DUPLICATE") => {
    setLoadingAction(decision);
    setReviewMessage(null);
    try {
      const res = await fetch(`/api/incidents/${incidentId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decision,
          chosen_attempt_id: decision === "CONFIRM_ATTEMPT" ? selectedAttempt : undefined,
          reviewer_note: reviewerNote || (decision === "CONFIRM_ATTEMPT" ? "Confirmed by reviewer" : "Marked duplicate by reviewer")
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Review failed");
      }

      setReviewMessage(`Decision recorded: ${decision}. Updated committed amount to ₹${data.updated_analysis.financial_resolution.committed_amount.toLocaleString("en-IN")}`);
      onReviewSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error executing review";
      setReviewMessage(`Error: ${msg}`);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl">
      <div className="pb-4 border-b border-gray-800 mb-6">
        <h2 className="text-xs uppercase tracking-wider font-semibold text-gray-400">Section 6: Recommendation & Reviewer Actions</h2>
        <p className="text-sm text-gray-400 mt-0.5">Human-in-the-loop resolution controls wired directly to POST /api/incidents/:id/review</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recommendation details */}
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-5">
          <span className="text-xs text-gray-500 font-semibold block uppercase">ENGINE RECOMMENDATION</span>
          <div className="flex items-center gap-2 mt-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span className="text-xl font-bold text-amber-300 font-mono">{recommendation}</span>
          </div>
          <p className="text-xs text-gray-400 mt-2 leading-relaxed">
            Automatic commitment was paused. Select an attempt to confirm or mark all excess attempts as duplicates.
          </p>
        </div>

        {/* Action Controls */}
        <div className="md:col-span-2 bg-gray-950 border border-gray-800 rounded-lg p-5 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-xs text-gray-400 font-semibold block mb-1">Select Gateway Attempt to Confirm:</label>
              <select
                value={selectedAttempt}
                onChange={(e) => setSelectedAttempt(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              >
                {candidateAttemptIds.map(att => (
                  <option key={att} value={att}>
                    Attempt {att} (₹2,000)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="text-xs text-gray-400 font-semibold block mb-1">Reviewer Note (Optional):</label>
              <input
                type="text"
                placeholder="e.g. Verified with bank statement"
                value={reviewerNote}
                onChange={(e) => setReviewerNote(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => handleReview("CONFIRM_ATTEMPT")}
              disabled={loadingAction !== null}
              className="flex-1 min-w-[180px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {loadingAction === "CONFIRM_ATTEMPT" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              <span>CONFIRM ATTEMPT</span>
            </button>

            <button
              onClick={() => handleReview("MARK_DUPLICATE")}
              disabled={loadingAction !== null}
              className="flex-1 min-w-[180px] bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {loadingAction === "MARK_DUPLICATE" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              <span>MARK DUPLICATE</span>
            </button>
          </div>

          {reviewMessage && (
            <div className={`p-3 rounded-lg text-xs font-semibold ${
              reviewMessage.startsWith("Error") ? "bg-red-950/40 text-red-300 border border-red-800" : "bg-emerald-950/40 text-emerald-300 border border-emerald-800"
            }`}>
              {reviewMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
