import { NextResponse } from "next/server";
import { backendStore } from "@/lib/store";
import { explain } from "@/lib/explain";

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const url = new URL(req.url);
    const forceTemplate = url.searchParams.get("ai_enabled") === "false";
    const res = await fetch(`${BACKEND_URL}/api/transactions/${params.id}/explain?ai_enabled=${!forceTemplate}`, {
      method: "POST",
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch {
    // Fallback
  }

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
