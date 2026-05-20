/**
 * Local / CI health check with email alerts (uses .env + file-based cooldown).
 *
 *   node scripts/check-services.mjs
 *
 * Schedule externally (cron-job.org, GitHub Actions) if not using Vercel Cron.
 */
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import nodemailer from "nodemailer";
import { QdrantClient } from "@qdrant/js-client-rest";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATE_FILE = path.join(__dirname, ".service-alert-state.json");
const TIMEOUT_MS = 12_000;

function cooldownMs() {
  const hours = Number.parseFloat(process.env.SERVICE_ALERT_COOLDOWN_HOURS || "6");
  return (Number.isFinite(hours) && hours > 0 ? hours : 6) * 3600_000;
}

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
  } catch {
    return {};
  }
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function shouldAlert(state, service) {
  const last = state[service]?.lastAlertAt ?? 0;
  return Date.now() - last >= cooldownMs();
}

function markAlert(state, service) {
  state[service] = { lastAlertAt: Date.now() };
  saveState(state);
}

function smtpConfig() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  return {
    host,
    port: Number(process.env.SMTP_PORT || "587"),
    user,
    pass,
  };
}

async function sendAlert(result) {
  const config = smtpConfig();
  if (!config) {
    console.warn("SMTP not configured — skipping email.");
    return false;
  }
  if (process.env.SERVICE_ALERT_ENABLED === "false") {
    console.warn("SERVICE_ALERT_ENABLED=false — skipping email.");
    return false;
  }

  const to =
    process.env.SERVICE_ALERT_EMAIL ||
    process.env.CONTACT_TO ||
    process.env.SMTP_TO ||
    config.user;

  const label = result.service === "supabase" ? "Supabase" : "Qdrant";
  const subject = `[Portfolio] ${label} needs attention (${result.status})`;
  const text = [
    `${label}: ${result.status}`,
    result.message || "",
    result.dashboardUrl ? `Dashboard: ${result.dashboardUrl}` : "",
    `Time: ${new Date().toISOString()}`,
  ]
    .filter(Boolean)
    .join("\n");

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: { user: config.user, pass: config.pass },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || `"Portfolio" <${config.user}>`,
    to,
    subject,
    text,
  });
  return true;
}

function supabaseRef(url) {
  try {
    const m = new URL(url).hostname.match(/^([a-z0-9]+)\.supabase\.co$/i);
    return m?.[1] ?? null;
  } catch {
    return null;
  }
}

async function checkSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) {
    return {
      service: "supabase",
      ok: false,
      status: "misconfigured",
      message: "Missing Supabase env vars.",
    };
  }

  const ref = supabaseRef(url);
  const dashboardUrl =
    process.env.SUPABASE_DASHBOARD_URL?.trim() ||
    (ref ? `https://supabase.com/dashboard/project/${ref}` : "https://supabase.com/dashboard/projects");

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${url}/rest/v1/personal_data?select=id&limit=1`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      signal: controller.signal,
    });
    const body = await res.text();
    if (res.status === 540 || /paused|inactive/i.test(body)) {
      return {
        service: "supabase",
        ok: false,
        status: "paused",
        message: "Supabase project appears paused. Restore it in the dashboard.",
        dashboardUrl,
      };
    }
    if (res.status >= 500) {
      return {
        service: "supabase",
        ok: false,
        status: "unreachable",
        message: `HTTP ${res.status}`,
        dashboardUrl,
      };
    }
    return { service: "supabase", ok: true, status: "healthy", dashboardUrl };
  } catch (err) {
    return {
      service: "supabase",
      ok: false,
      status: "unreachable",
      message: err?.message || String(err),
      dashboardUrl,
    };
  } finally {
    clearTimeout(t);
  }
}

async function checkQdrant() {
  const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase();
  if (provider !== "qdrant") {
    return { service: "qdrant", ok: true, status: "skipped" };
  }

  const url = process.env.QDRANT_URL?.trim();
  const apiKey = process.env.QDRANT_API_KEY?.trim();
  const dashboardUrl =
    process.env.QDRANT_DASHBOARD_URL?.trim() || "https://cloud.qdrant.io/";

  if (!url || !apiKey) {
    return {
      service: "qdrant",
      ok: false,
      status: "misconfigured",
      message: "Missing QDRANT_URL or QDRANT_API_KEY",
      dashboardUrl,
    };
  }

  try {
    const client = new QdrantClient({ url, apiKey, checkCompatibility: false });
    await client.getCollections();
    return { service: "qdrant", ok: true, status: "healthy", dashboardUrl };
  } catch (err) {
    return {
      service: "qdrant",
      ok: false,
      status: "unreachable",
      message: err?.message || String(err),
      dashboardUrl,
    };
  }
}

async function main() {
  const results = await Promise.all([checkSupabase(), checkQdrant()]);
  const state = loadState();
  let sent = 0;

  for (const result of results) {
    console.log(JSON.stringify(result));
    if (result.ok || result.status === "skipped") continue;
    if (!shouldAlert(state, result.service)) {
      console.log(`[${result.service}] alert skipped (cooldown)`);
      continue;
    }
    const ok = await sendAlert(result);
    if (ok) {
      markAlert(state, result.service);
      sent += 1;
      console.log(`[${result.service}] alert email sent`);
    }
  }

  if (sent === 0) console.log("No alerts sent.");
  process.exit(results.every((r) => r.ok || r.status === "skipped") ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
