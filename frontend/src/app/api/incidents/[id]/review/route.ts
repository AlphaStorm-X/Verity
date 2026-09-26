import { NextResponse } from "next/server";
import { backendStore } from "@/lib/store";
import { ReviewDecisionRequest } from "@/lib/types";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body: ReviewDecisionRequest = await req.json();
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
