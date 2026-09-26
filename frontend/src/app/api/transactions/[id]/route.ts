import { NextResponse } from "next/server";
import { backendStore } from "@/lib/store";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const analysis = backendStore.getAnalysis(params.id);
  if (!analysis) {
    return NextResponse.json({ error: `Transaction ${params.id} not found` }, { status: 404 });
  }
  return NextResponse.json(analysis);
}
