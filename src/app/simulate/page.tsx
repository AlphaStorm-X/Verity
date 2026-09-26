"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SimulationScenario } from "@/lib/types";
import { Navbar } from "@/components/Navbar";
import { PlayCircle, ShieldAlert, ArrowRight, Loader2, RefreshCw } from "lucide-react";

export default function SimulationCenter() {
  const router = useRouter();
  const [runningId, setRunningId] = useState<string | null>(null);

  const { data: scenarios, isLoading } = useQuery<SimulationScenario[]>({
    queryKey: ["simulations"],
    queryFn: async () => {
      const res = await fetch("/api/simulations");
      if (!res.ok) throw new Error("Failed to load simulation scenarios");
      return res.json();
    },
  });

  const handleRunSimulation = async (scenarioId: string) => {
    setRunningId(scenarioId);
    try {
      const res = await fetch(`/api/simulations/${scenarioId}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      router.push(`/live/${data.run_id}`);
    } catch (err) {
      console.error(err);
      setRunningId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        <div className="pb-6 border-b border-gray-800 mb-8">
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <PlayCircle className="w-7 h-7 text-blue-500" />
            <span>Simulation Center</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Trigger real-time adversarial payment failure scenarios against the VERITY resolution engine
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-gray-500 text-sm font-mono">
            Loading simulation scenarios from API...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scenarios?.map((scenario) => (
              <div
                key={scenario.id}
                className="bg-gray-900 border border-gray-800 hover:border-blue-500/60 transition-all rounded-xl p-6 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/30">
                      {scenario.id}
                    </span>
                    <span className="text-xs font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40">
                      Expected: {scenario.expected_state}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-white mb-2">{scenario.name}</h2>
                  <p className="text-xs text-gray-400 leading-relaxed mb-6">
                    {scenario.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
                  <span className="text-xs font-mono text-gray-500">
                    Transaction ID: {scenario.transaction_id}
                  </span>

                  <button
                    onClick={() => handleRunSimulation(scenario.id)}
                    disabled={runningId !== null}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {runningId === scenario.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <PlayCircle className="w-4 h-4" />
                    )}
                    <span>Run Simulation</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
