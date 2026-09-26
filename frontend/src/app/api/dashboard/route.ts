import { NextResponse } from "next/server";
import { backendStore } from "@/lib/store";

export async function GET() {
  const stats = backendStore.getDashboardStats();
  return NextResponse.json(stats);
}
