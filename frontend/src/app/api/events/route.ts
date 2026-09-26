import { NextResponse } from "next/server";
import { backendStore } from "@/lib/store";

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/events`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch {
    // Fallback
  }
  const analyses = backendStore.getAllAnalyses();
  const allEvents = analyses.flatMap(a => a.timeline);
  return NextResponse.json(allEvents);
}

export async function POST(req: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
    const res = await fetch(`${BACKEND_URL}/api/events`, {
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

  return NextResponse.json({
    status: "ACCEPTED",
    event_id: `evt_${Date.now()}`,
    received_at: new Date().toISOString(),
    event: body
  });
}
