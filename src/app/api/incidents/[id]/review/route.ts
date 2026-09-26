import { NextResponse } from "next/server";
import { backendStore } from "@/lib/store";
import { ReviewDecisionRequest } from "@/lib/types";

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body: ReviewDecisionRequest = await req.json();
    try {
      const res = await fetch(`${BACKEND_URL}/api/incidents/${params.id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }
    } catch {
      // Fallback
    }

    if (!body.decision || (body.decision !== "CONFIRM_ATTEMPT" && body.decision !== "MARK_DUPLICATE")) {
      return NextResponse.json(
        { error: "Invalid review decision. Must be CONFIRM_ATTEMPT or MARK_DUPLICATE." },
        { status: 400 }
      );
    }

    const updated = backendStore.reviewIncident(
      params.id,
      body.decision,
      body.chosen_attempt_id,
      body.reviewer_note
    );

    return NextResponse.json({
      status: "SUCCESS",
      incident_id: params.id,
      updated_analysis: updated
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
