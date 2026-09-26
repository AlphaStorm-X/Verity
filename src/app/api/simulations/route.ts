import { NextResponse } from "next/server";
import { backendStore } from "@/lib/store";

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/simulations`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch {
    // Fallback
  }
  const scenarios = backendStore.getScenarios();
  return NextResponse.json(scenarios);
}
