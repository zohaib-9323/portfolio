import { NextRequest, NextResponse } from "next/server";
import { processHealthResults, sendServiceAlert } from "@/lib/service-alerts";
import {
  checkQdrantHealth,
  checkSupabaseHealth,
  runServiceHealthChecks,
} from "@/lib/service-health";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;

  const auth = request.headers.get("authorization");
  if (auth === `Bearer ${secret}`) return true;

  const header = request.headers.get("x-cron-secret");
  return header === secret;
}

/**
 * GET /api/service-health — periodic health check + email when Supabase/Qdrant are down.
 * Protect with CRON_SECRET. Schedule via Vercel Cron or cron-job.org (every 6h recommended).
 */
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const service = request.nextUrl.searchParams.get("service");

  try {
    if (service === "supabase") {
      const result = await checkSupabaseHealth();
      const alert = await sendServiceAlert(result);
      return NextResponse.json({ result, alert });
    }

    if (service === "qdrant") {
      const result = await checkQdrantHealth();
      const alert = await sendServiceAlert(result);
      return NextResponse.json({ result, alert });
    }

    const results = await runServiceHealthChecks();
    const { alertsSent, skipped } = await processHealthResults(results);

    return NextResponse.json({
      checkedAt: new Date().toISOString(),
      results,
      alertsSent,
      skipped,
    });
  } catch (err) {
    console.error("[api/service-health]", err);
    return NextResponse.json(
      { error: "Health check failed", details: String(err) },
      { status: 500 }
    );
  }
}
