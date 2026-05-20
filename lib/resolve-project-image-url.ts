import {
  getStaticProjectPreviewPath,
  getStorageKeyForProjectTitle,
  remapLegacyProjectImagePath,
} from "./project-preview-images";

/**
 * Turns DB values into a browser-loadable image URL for project cards.
 * Supports: full https URLs, site-relative `/public` paths, and object keys
 * for Supabase Storage public buckets.
 */

const IMAGE_FILENAME = /\.(png|jpe?g|webp|gif|svg|avif|bmp|ico)(\?|#|$)/i;

/** True when the URL almost certainly points at image bytes (not an HTML document). */
export function isLikelyImageAssetUrl(url: string): boolean {
  const u = url.trim();
  if (!u) return false;
  if (u.startsWith("/")) return IMAGE_FILENAME.test(u);
  if (/^https?:\/\//i.test(u)) {
    const path = u.split("?")[0].split("#")[0];
    if (IMAGE_FILENAME.test(path)) return true;
    if (/\/storage\/v1\/object\//i.test(u)) return true;
    if (/lh3\.googleusercontent\.com|i\.imgur\.com|images\.unsplash\.com|cdn\.|\/image\/upload\//i.test(u)) {
      return true;
    }
  }
  return false;
}

/**
 * Same-origin preview URL: server fetches og:image or screenshots the page.
 * Avoids broken <img> when the “image” is actually an https page URL or when
 * third-party screenshot hosts block the browser.
 */
export function buildProjectPreviewProxyUrl(pageUrl: string | null | undefined): string | null {
  const u = String(pageUrl ?? "").trim();
  if (!/^https?:\/\//i.test(u)) return null;
  return `/api/project-preview?url=${encodeURIComponent(u)}`;
}

/**
 * Resolves the preview image for a Supabase `projects` row plus computed live/landing links.
 * Prefers bundled screenshots in /public/assets/projects, then DB/storage URLs, then live URL proxy.
 */
export function resolveProjectCardPreview(
  row: Record<string, unknown>,
  liveLink: string | null,
  landingLink: string | null
): string | null {
  const title = String(row.title ?? "");

  // Title mapping wins over stale DB paths like /assets/capture-ai.png (404 HTML)
  const staticPath = getStaticProjectPreviewPath(title);
  if (staticPath) return staticPath;

  const fromDb = resolveProjectImageUrl(row.image_url, row);
  const remapped = remapLegacyProjectImagePath(fromDb ?? undefined);
  if (remapped) return remapped;

  if (fromDb && isLikelyImageAssetUrl(fromDb)) {
    if (fromDb.startsWith("/assets/projects/")) return fromDb;
    // Other /assets/* without remap are invalid — skip to avoid 404 HTML in next/image
    if (!fromDb.startsWith("/assets/")) return fromDb;
  }

  const storageKey = getStorageKeyForProjectTitle(title);
  if (storageKey) {
    const fromStorage = resolveProjectImageUrl(storageKey, row);
    const remappedStorage = remapLegacyProjectImagePath(fromStorage ?? undefined);
    if (remappedStorage) return remappedStorage;
  }

  if (fromDb) {
    if (/^https?:\/\//i.test(fromDb)) {
      if (isLikelyImageAssetUrl(fromDb)) return fromDb;
      return buildProjectPreviewProxyUrl(fromDb);
    }
  }

  return (
    buildProjectPreviewProxyUrl(liveLink) ??
    buildProjectPreviewProxyUrl(landingLink) ??
    null
  );
}

/** For static/fallback `ProjectShowcase` rows (image is already a URL or null). */
export function resolveShowcasePreviewImage(p: {
  title: string;
  image: string | null;
  liveLink: string | null;
  landingLink: string | null;
}): string | null {
  const staticPath = getStaticProjectPreviewPath(p.title);
  if (staticPath) return staticPath;

  if (p.image) {
    const remapped = remapLegacyProjectImagePath(p.image);
    if (remapped) return remapped;
    if (!/^https?:\/\//i.test(p.image)) {
      if (p.image.startsWith("/assets/projects/")) return p.image;
      return null;
    }
    if (isLikelyImageAssetUrl(p.image)) return p.image;
    return buildProjectPreviewProxyUrl(p.image);
  }
  return (
    buildProjectPreviewProxyUrl(p.liveLink) ??
    buildProjectPreviewProxyUrl(p.landingLink) ??
    null
  );
}

export function resolveProjectImageUrl(
  raw: unknown,
  altKeys: Record<string, unknown>
): string | null {
  const candidates = [
    raw,
    altKeys.thumbnail_url,
    altKeys.cover_image,
    altKeys.preview_url,
    altKeys.image,
  ];

  for (const c of candidates) {
    const url = normalizeOne(c);
    if (url) return url;
  }
  return null;
}

function normalizeOne(raw: unknown): string | null {
  if (raw == null) return null;
  const s = String(raw).trim();
  if (!s) return null;

  if (/^https?:\/\//i.test(s)) return s;

  // Served from /public (Next.js) — remap legacy /assets/*.png to /assets/projects/*
  if (s.startsWith("/")) {
    return remapLegacyProjectImagePath(s) ?? s;
  }

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!base) return null;

  const bucket =
    process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET?.trim() || "portfolio";

  const path = s.replace(/^\/+/, "");
  return `${base}/storage/v1/object/public/${bucket}/${path}`;
}

export function isRemoteImageSrc(src: string): boolean {
  return /^https?:\/\//i.test(src);
}
