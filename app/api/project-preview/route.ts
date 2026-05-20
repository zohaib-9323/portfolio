import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
/** Allow og:image + screenshot fallback to finish on serverless hosts (tune in Vercel dashboard if needed). */
export const maxDuration = 30;

const MAX_HTML_BYTES = 700_000;
const FETCH_TIMEOUT_MS = 12_000;

function isBlockedHostname(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (h === "localhost" || h.endsWith(".localhost")) return true;
  if (h === "0.0.0.0" || h === "[::1]" || h === "::1") return true;
  if (h === "127.0.0.1") return true;
  if (h.endsWith(".internal") || h.endsWith(".local")) return true;
  if (/^192\.168\./.test(h)) return true;
  if (/^10\./.test(h)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(h)) return true;
  if (/^169\.254\./.test(h)) return true;
  return false;
}

function parseTargetUrl(raw: string): URL | null {
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return null;
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") return null;
  if (isBlockedHostname(u.hostname)) return null;
  return u;
}

function extractOgImage(html: string, pageUrl: string): string | null {
  const patterns = [
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
    /<meta[^>]+name=["']twitter:image(?:\:src)?["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image(?:\:src)?["']/i,
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (!m?.[1]) continue;
    try {
      return new URL(m[1], pageUrl).href;
    } catch {
      /* ignore */
    }
  }
  return null;
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  ms: number
): Promise<Response> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}

async function proxyImage(imageUrl: string, referer: string) {
  const parsed = parseTargetUrl(imageUrl);
  if (!parsed || isBlockedHostname(parsed.hostname)) {
    return null;
  }

  const res = await fetchWithTimeout(
    imageUrl,
    {
      headers: {
        Accept: "image/*,*/*;q=0.8",
        "User-Agent":
          "Mozilla/5.0 (compatible; PortfolioPreview/1.0; +https://github.com/vercel/next.js)",
        Referer: referer,
      },
    },
    FETCH_TIMEOUT_MS
  );

  if (!res.ok) return null;
  const ct = res.headers.get("content-type") || "";
  if (!ct.startsWith("image/")) return null;

  return new NextResponse(res.body, {
    status: 200,
    headers: {
      "Content-Type": ct.split(";")[0] || "image/jpeg",
      "Cache-Control": "public, s-maxage=86400, max-age=3600",
    },
  });
}

async function fetchPageHtml(pageUrl: string): Promise<string | null> {
  const res = await fetchWithTimeout(
    pageUrl,
    {
      headers: {
        Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      redirect: "follow",
    },
    FETCH_TIMEOUT_MS
  );

  if (!res.ok) return null;

  const ab = await res.arrayBuffer();
  const slice = ab.byteLength > MAX_HTML_BYTES ? ab.slice(0, MAX_HTML_BYTES) : ab;
  const decoder = new TextDecoder("utf-8", { fatal: false });
  return decoder.decode(slice);
}

async function proxyThumScreenshot(pageUrl: string) {
  // thum.io expects the target URL appended literally; encoding the full URL returns 400.
  const thum = `https://image.thum.io/get/width/1280/crop/720/noanimate/${pageUrl}`;
  const res = await fetchWithTimeout(
    thum,
    {
      headers: {
        Accept: "image/*,*/*;q=0.1",
        "User-Agent":
          "Mozilla/5.0 (compatible; PortfolioPreview/1.0; +https://github.com/vercel/next.js)",
      },
    },
    FETCH_TIMEOUT_MS + 5000
  );

  if (!res.ok) return null;
  const ct = res.headers.get("content-type") || "";
  if (!ct.startsWith("image/")) return null;

  return new NextResponse(res.body, {
    status: 200,
    headers: {
      "Content-Type": ct.split(";")[0] || "image/png",
      "Cache-Control": "public, s-maxage=3600, max-age=600",
    },
  });
}

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("url");
  if (!raw || raw.length > 2048) {
    return NextResponse.json({ error: "Invalid or missing url" }, { status: 400 });
  }

  const target = parseTargetUrl(raw.trim());
  if (!target) {
    return NextResponse.json({ error: "URL not allowed" }, { status: 400 });
  }

  const pageUrl = target.href;

  try {
    const html = await fetchPageHtml(pageUrl);
    if (html) {
      const og = extractOgImage(html, pageUrl);
      if (og) {
        const proxied = await proxyImage(og, pageUrl);
        if (proxied) return proxied;
      }
    }
  } catch {
    /* try thum */
  }

  try {
    const shot = await proxyThumScreenshot(pageUrl);
    if (shot) return shot;
  } catch {
    /* final 404 */
  }

  return NextResponse.json({ error: "Preview unavailable" }, { status: 404 });
}
