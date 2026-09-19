import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  return NextResponse.json(
    {
      status: "alive",
      app: "MONAD HUNT: CITY LEAGUE",
      timestamp: new Date().toISOString(),
      uptime: process.uptime?.() ?? 0,
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}
