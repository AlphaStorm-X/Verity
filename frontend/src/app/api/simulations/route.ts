import { NextResponse } from "next/server";
import { backendStore } from "@/lib/store";

export async function GET() {
  const scenarios = backendStore.getScenarios();
  return NextResponse.json(scenarios);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const scenarios = backendStore.getScenarios();
  const selected = scenarios.find(s => s.id === body.scenario_id) || scenarios[0];
  
  return NextResponse.json({
    status: "CREATED",
    simulation: selected
  });
}
