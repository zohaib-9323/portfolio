import { isSmtpConfigured, sendMailMessage } from "@/lib/smtp";
import type { ServiceHealthResult, ServiceName } from "@/lib/service-health";

const lastAlertAt = new Map<ServiceName, number>();

function cooldownMs(): number {
  const hours = Number.parseFloat(
    process.env.SERVICE_ALERT_COOLDOWN_HOURS?.trim() || "6"
  );
  const safe = Number.isFinite(hours) && hours > 0 ? hours : 6;
  return safe * 60 * 60 * 1000;
}

function alertsEnabled(): boolean {
  return process.env.SERVICE_ALERT_ENABLED?.trim().toLowerCase() !== "false";
}

function passiveAlertsEnabled(): boolean {
  return (
    process.env.SERVICE_ALERT_ON_ERROR?.trim().toLowerCase() !== "false"
  );
}

function shouldSendAlert(service: ServiceName): boolean {
  const last = lastAlertAt.get(service) ?? 0;
  const now = Date.now();
  if (now - last < cooldownMs()) return false;
  lastAlertAt.set(service, now);
  return true;
}

function serviceLabel(service: ServiceName): string {
  return service === "supabase" ? "Supabase" : "Qdrant";
}

function buildAlertEmail(result: ServiceHealthResult): {
  subject: string;
  text: string;
  html: string;
} {
  const label = serviceLabel(result.service);
  const site = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "your portfolio";
  const subject = `[Portfolio] ${label} needs attention (${result.status})`;

  const lines = [
    `${label} health check reported: ${result.status}`,
    "",
    result.message || "No additional details.",
    "",
    result.dashboardUrl
      ? `Dashboard: ${result.dashboardUrl}`
      : "Open your cloud dashboard to resume the service.",
    "",
    `Site: ${site}`,
    `Time: ${new Date().toISOString()}`,
    "",
    "Free-tier Supabase projects pause after inactivity. Qdrant Cloud free clusters may also need a manual wake-up.",
    "You will not receive another alert for this service for several hours (cooldown).",
  ];

  const text = lines.join("\n");
  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 560px;">
      <h2 style="margin: 0 0 12px;">${label} needs attention</h2>
      <p><strong>Status:</strong> ${escapeHtml(result.status)}</p>
      ${
        result.message
          ? `<p style="line-height: 1.5;">${escapeHtml(result.message)}</p>`
          : ""
      }
      ${
        result.dashboardUrl
          ? `<p><a href="${escapeHtml(result.dashboardUrl)}">Open ${label} dashboard</a></p>`
          : ""
      }
      <p style="color: #64748b; font-size: 14px;">Site: ${escapeHtml(site)}<br/>${escapeHtml(new Date().toISOString())}</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 14px; color: #64748b;">
        Free-tier services can pause when idle. Resume them in the dashboard.
        Further alerts for this service are rate-limited.
      </p>
    </div>
  `;

  return { subject, text, html };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendServiceAlert(
  result: ServiceHealthResult
): Promise<{ sent: boolean; reason?: string }> {
  if (!alertsEnabled()) {
    return { sent: false, reason: "alerts_disabled" };
  }
  if (!isSmtpConfigured()) {
    return { sent: false, reason: "smtp_not_configured" };
  }
  if (result.ok || result.status === "skipped") {
    return { sent: false, reason: "healthy_or_skipped" };
  }
  if (!shouldSendAlert(result.service)) {
    return { sent: false, reason: "cooldown" };
  }

  const mail = buildAlertEmail(result);
  await sendMailMessage(mail);
  return { sent: true };
}

export async function processHealthResults(
  results: ServiceHealthResult[]
): Promise<{ alertsSent: ServiceName[]; skipped: string[] }> {
  const alertsSent: ServiceName[] = [];
  const skipped: string[] = [];

  for (const result of results) {
    const outcome = await sendServiceAlert(result);
    if (outcome.sent) {
      alertsSent.push(result.service);
    } else if (outcome.reason) {
      skipped.push(`${result.service}:${outcome.reason}`);
    }
  }

  return { alertsSent, skipped };
}

/** Fire-and-forget: does not throw; never blocks user-facing responses. */
export function notifyServiceIssueFromError(
  service: ServiceName,
  error: unknown
): void {
  if (!alertsEnabled() || !passiveAlertsEnabled() || !isSmtpConfigured()) {
    return;
  }

  void (async () => {
    const message = error instanceof Error ? error.message : String(error);
    const result: ServiceHealthResult = {
      service,
      ok: false,
      status: "unreachable",
      message: `Runtime error suggests ${serviceLabel(service)} may be down: ${message}`,
      dashboardUrl:
        service === "supabase"
          ? process.env.SUPABASE_DASHBOARD_URL?.trim()
          : process.env.QDRANT_DASHBOARD_URL?.trim() ||
            "https://cloud.qdrant.io/",
    };
    await sendServiceAlert(result);
  })().catch((err) => {
    console.error("[service-alerts] passive notify failed:", err);
  });
}
