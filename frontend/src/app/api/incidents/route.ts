import { NextResponse } from "next/server";
import { backendStore } from "@/lib/store";

export async function GET() {
  const analyses = backendStore.getAllAnalyses();
  return NextResponse.json(analyses.map(a => ({
    incident_id: a.incident_id,
    transaction_id: a.transaction_id,
    declared_amount: a.declared_amount,
    resolution_state: a.financial_resolution.resolution_state,
    recommendation: a.recommendation
  })));
}
