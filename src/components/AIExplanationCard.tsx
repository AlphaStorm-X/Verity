"use client";

import { useState } from "react";
import { Sparkles, FileText, ToggleLeft, ToggleRight, Loader2 } from "lucide-react";

interface Props {
  transactionId: string;
}

export function AIExplanationCard({ transactionId }: Props) {
  const [aiEnabled, setAiEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    explanation: string;
    source: "AI_GENERATED" | "DETERMINISTIC_TEMPLATE";
    enabled: boolean;
  } | null>(null);

  const fetchExplanation = async (enabled: boolean) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/transactions/${transactionId}/explain?ai_enabled=${enabled}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount or mode toggle
  const toggleAiMode = () => {
    const nextMode = !aiEnabled;
    setAiEnabled(nextMode);
    fetchExplanation(nextMode);
  };

  // Auto load first time
  if (!data && !loading) {
    fetchExplanation(aiEnabled);
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl my-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-800 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs uppercase tracking-wider font-semibold text-gray-400">Read-Only AI Explanation & Narration</h2>
            <p className="text-sm text-gray-400 mt-0.5">Retrospective human narration (Strictly read-only, non-decision making)</p>
          </div>
        </div>

        {/* AI Enabled Toggle Switch */}
        <button
          onClick={toggleAiMode}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-950 border border-gray-800 hover:border-gray-700 text-xs font-semibold text-gray-300 transition-colors"
        >
          <span>AI_ENABLED={aiEnabled ? "true" : "false"}</span>
          {aiEnabled ? (
            <ToggleRight className="w-6 h-6 text-purple-400" />
          ) : (
            <ToggleLeft className="w-6 h-6 text-gray-500" />
          )}
        </button>
      </div>

      <div className="bg-gray-950 border border-gray-800 rounded-lg p-5">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="flex items-center gap-1.5 font-bold text-gray-300">
            {data?.source === "AI_GENERATED" ? (
              <span className="text-purple-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> AI LLM Narration Layer
              </span>
            ) : (
              <span className="text-blue-400 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" /> Deterministic String Template
              </span>
            )}
          </span>
          <span className="text-gray-500 font-mono">Structure Identical Across AI / Template</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8 text-gray-500 gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-xs font-mono">Generating plain language explanation...</span>
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg font-mono text-xs leading-relaxed text-gray-200 whitespace-pre-wrap">
            {data?.explanation || "Loading explanation..."}
          </div>
        )}
      </div>
    </div>
  );
}
