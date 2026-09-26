import { NextResponse } from "next/server";
import { backendStore } from "@/lib/store";

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/simulations/${params.id}/run`, {
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
  const run = backendStore.startSimulationRun(params.id);
  return NextResponse.json(run);
}
