import { NextResponse } from "next/server";
import { backendStore } from "@/lib/store";

export async function GET() {
  const analyses = backendStore.getAllAnalyses();
  return NextResponse.json(analyses.map(a => ({
    transaction_id: a.transaction_id,
    incident_id: a.incident_id,
    declared_amount: a.declared_amount,
    financial_resolution: a.financial_resolution,
    recommendation: a.recommendation
  })));
}
