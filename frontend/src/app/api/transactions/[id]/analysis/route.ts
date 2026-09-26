import { NextResponse } from "next/server";
import { backendStore } from "@/lib/store";

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/transactions/${params.id}/analysis`, { cache: "no-store" });
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
  return NextResponse.json(analysis);
}
