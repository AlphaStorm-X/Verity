import { NextResponse } from "next/server";
import { backendStore } from "@/lib/store";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const run = backendStore.startSimulationRun(params.id);
  return NextResponse.json({
    status: "STARTED",
    run_id: run.run_id,
    transaction_id: run.transaction_id,
    run
  });
}
