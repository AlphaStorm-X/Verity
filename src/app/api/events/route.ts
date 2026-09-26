import { NextResponse } from "next/server";
import { backendStore } from "@/lib/store";

export async function GET() {
  const analyses = backendStore.getAllAnalyses();
  const allEvents = analyses.flatMap(a => a.timeline);
  return NextResponse.json(allEvents);
}

export async function POST(req: Request) {
  const body = await req.json();
  return NextResponse.json({
    status: "ACCEPTED",
    event_id: `evt_${Date.now()}`,
    received_at: new Date().toISOString(),
    event: body
  });
}
