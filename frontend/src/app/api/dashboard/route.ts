import { NextResponse } from "next/server";
import { backendStore } from "@/lib/store";

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/dashboard`, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();

      // Normalize FastAPI response format to match frontend DashboardStats schema
      const intent_counts = data.incidents_by_state || data.intent_counts || {
        HELD_FOR_REVIEW: 0,
        POTENTIAL_DUPLICATE: 0,
        CONFLICTING_STATE: 0,
        INSUFFICIENT_EVIDENCE: 0,
        MANUAL_REVIEW: 0,
        CONFIRMED: 0,
        REJECTED: 0,
      };

      const potential_duplicate_exposure_total = Number(
        data.exposure_metrics?.total_observed_exposure ??
        data.potential_duplicate_exposure_total ??
        0
      );

      const prevented_ledger_commitments_count = Number(
        data.total_incidents ??
        data.prevented_ledger_commitments_count ??
        0
      );

      const recent_incidents = (data.latest_incidents || data.recent_incidents || []).map((inc: any) => ({
        id: inc.id || inc.intent_id,
        transaction_id: inc.intent_id || inc.transaction_id || inc.id,
        declared_amount: Number(inc.declared_amount ?? 0),
        observed_amount: Number(inc.observed_amount ?? 0),
        committed_amount: Number(inc.committed_amount ?? 0),
        state: inc.aggregate_state || inc.state || "HELD_FOR_REVIEW",
        created_at: inc.created_at || new Date().toISOString(),
      }));

      return NextResponse.json({
        intent_counts,
        potential_duplicate_exposure_total,
        prevented_ledger_commitments_count,
        recent_incidents,
      });
    }
  } catch {
    // Fall back to local store if backend service is unreachable
  }

  const stats = backendStore.getDashboardStats();
  return NextResponse.json(stats);
}
