export type ServiceName = "supabase" | "qdrant";

export type ServiceHealthResult = {
  service: ServiceName;
  ok: boolean;
  /** Human-readable status: healthy, paused, unreachable, misconfigured, skipped */
  status: string;
  message?: string;
  dashboardUrl?: string;
};

const HEALTH_TIMEOUT_MS = 12_000;

function isServiceAlertsEnabled(): boolean {
  return process.env.SERVICE_ALERT_ENABLED?.trim().toLowerCase() !== "false";
}

export function shouldCheckQdrant(): boolean {
  if (!isServiceAlertsEnabled()) return false;
  const provider = (process.env.AI_PROVIDER || "gemini").trim().toLowerCase();
  return provider === "qdrant";
}

function extractSupabaseProjectRef(url: string): string | null {
  try {
    const host = new URL(url).hostname;
    const match = host.match(/^([a-z0-9]+)\.supabase\.co$/i);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

function supabaseDashboardUrl(projectUrl: string): string {
  const custom = process.env.SUPABASE_DASHBOARD_URL?.trim();
  if (custom) return custom;
  const ref = extractSupabaseProjectRef(projectUrl);
  if (ref) {
    return `https://supabase.com/dashboard/project/${ref}`;
  }
  return "https://supabase.com/dashboard/projects";
}

function qdrantDashboardUrl(): string {
  return (
    process.env.QDRANT_DASHBOARD_URL?.trim() ||
    "https://cloud.qdrant.io/"
  );
}

function looksPaused(body: string): boolean {
  const lower = body.toLowerCase();
  return (
    lower.includes("paused") ||
    lower.includes("project is inactive") ||
    lower.includes("restore project") ||
    lower.includes("project not found") && lower.includes("inactive")
  );
}

function looksQdrantUnavailable(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("econnrefused") ||
    lower.includes("etimedout") ||
    lower.includes("fetch failed") ||
    lower.includes("network") ||
    lower.includes("timeout") ||
    lower.includes("503") ||
    lower.includes("502") ||
    lower.includes("unavailable") ||
    lower.includes("suspended") ||
    lower.includes("sleep") ||
    lower.includes("not found") && lower.includes("cluster")
  );
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), HEALTH_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function checkSupabaseHealth(): Promise<ServiceHealthResult> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !key) {
    return {
      service: "supabase",
      ok: false,
      status: "misconfigured",
      message: "NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing.",
    };
  }

  const dashboardUrl = supabaseDashboardUrl(url);

  try {
    const res = await fetchWithTimeout(`${url}/rest/v1/`, {
      method: "GET",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
    });

    const body = await res.text().catch(() => "");

    if (res.status === 540 || looksPaused(body)) {
      return {
        service: "supabase",
        ok: false,
        status: "paused",
        message:
          "Supabase project appears paused (free tier inactivity). Resume it in the dashboard.",
        dashboardUrl,
      };
    }

    if (res.status >= 500) {
      return {
        service: "supabase",
        ok: false,
        status: "unreachable",
        message: `Supabase returned HTTP ${res.status}. The project may be paused or down.`,
        dashboardUrl,
      };
    }

    const probe = await fetchWithTimeout(
      `${url}/rest/v1/personal_data?select=id&limit=1`,
      {
        method: "GET",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          Accept: "application/json",
        },
      }
    );

    const probeBody = await probe.text().catch(() => "");

    if (probe.status === 540 || looksPaused(probeBody)) {
      return {
        service: "supabase",
        ok: false,
        status: "paused",
        message:
          "Supabase project appears paused. Open the dashboard and click Restore project.",
        dashboardUrl,
      };
    }

    if (probe.status >= 500) {
      return {
        service: "supabase",
        ok: false,
        status: "unreachable",
        message: `Supabase data API returned HTTP ${probe.status}.`,
        dashboardUrl,
      };
    }

    return {
      service: "supabase",
      ok: true,
      status: "healthy",
      dashboardUrl,
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not reach Supabase.";
    return {
      service: "supabase",
      ok: false,
      status: looksPaused(message) ? "paused" : "unreachable",
      message: `Supabase health check failed: ${message}`,
      dashboardUrl,
    };
  }
}

export async function checkQdrantHealth(): Promise<ServiceHealthResult> {
  if (!shouldCheckQdrant()) {
    return {
      service: "qdrant",
      ok: true,
      status: "skipped",
      message: "AI_PROVIDER is not qdrant; Qdrant check skipped.",
    };
  }

  const url = process.env.QDRANT_URL?.trim();
  const apiKey = process.env.QDRANT_API_KEY?.trim();
  const dashboardUrl = qdrantDashboardUrl();

  if (!url || !apiKey) {
    return {
      service: "qdrant",
      ok: false,
      status: "misconfigured",
      message: "QDRANT_URL or QDRANT_API_KEY is missing.",
      dashboardUrl,
    };
  }

  try {
    const { getQdrantClient } = await import("@/lib/ai/qdrant-client");
    const client = getQdrantClient();
    const collection =
      process.env.QDRANT_COLLECTION?.trim() || "portfolio_vectors";
    const collections = await client.getCollections();
    const exists = collections.collections.some((c) => c.name === collection);

    if (!exists) {
      return {
        service: "qdrant",
        ok: false,
        status: "unreachable",
        message: `Qdrant is up but collection "${collection}" is missing. Run: node scripts/sync-to-qdrant.mjs`,
        dashboardUrl,
      };
    }

    return {
      service: "qdrant",
      ok: true,
      status: "healthy",
      dashboardUrl,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      service: "qdrant",
      ok: false,
      status: looksQdrantUnavailable(message) ? "unreachable" : "error",
      message: `Qdrant health check failed: ${message}. Free-tier clusters may sleep — open Qdrant Cloud and wake the cluster.`,
      dashboardUrl,
    };
  }
}

export async function runServiceHealthChecks(): Promise<ServiceHealthResult[]> {
  const [supabase, qdrant] = await Promise.all([
    checkSupabaseHealth(),
    checkQdrantHealth(),
  ]);
  return [supabase, qdrant];
}

export function isLikelySupabaseFailure(error: unknown): boolean {
  const text = error instanceof Error ? error.message : String(error);
  const lower = text.toLowerCase();
  return (
    lower.includes("supabase") ||
    lower.includes("fetch failed") ||
    lower.includes("network") ||
    lower.includes("paused") ||
    lower.includes("540") ||
    lower.includes("personal_data") ||
    lower.includes("jwt")
  );
}

export function isLikelyQdrantFailure(error: unknown): boolean {
  const text = error instanceof Error ? error.message : String(error);
  const lower = text.toLowerCase();
  return (
    lower.includes("qdrant") ||
    lower.includes("fetch failed") ||
    lower.includes("econnrefused") ||
    lower.includes("etimedout") ||
    lower.includes("503") ||
    lower.includes("502") ||
    lower.includes("unavailable")
  );
}
