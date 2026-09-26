import { NextResponse } from "next/server";
import { backendStore } from "@/lib/store";
import { explain } from "@/lib/explain";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const analysis = backendStore.getAnalysis(params.id);
  if (!analysis) {
    return NextResponse.json({ error: `Transaction ${params.id} not found` }, { status: 404 });
  }

  const url = new URL(req.url);
  const forceTemplate = url.searchParams.get("ai_enabled") === "false";

  const result = explain(analysis, { forceTemplate });
  return NextResponse.json({
    transaction_id: params.id,
    ...result
  });
}
