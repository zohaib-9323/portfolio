/**
 * Static project preview images (source files live in components/assets/, served from /public/assets/projects/).
 * Used when Supabase image_url is empty or points at a live site URL instead of an image file.
 */

export const PROJECT_PREVIEW_FILES = {
  captureAiDashboard: "/assets/projects/capture-ai-dashboard.jpg",
  captureAiLanding: "/assets/projects/capture-ai-landing-page.jpg",
  recordoDashboard: "/assets/projects/recordo-dashboard.jpg",
  recordoLanding: "/assets/projects/recordo-landing-page.jpg",
  recipeGenerator: "/assets/projects/recipe-generator.jpg",
  goldiumCrafter: "/assets/projects/goldium-crafter.jpg",
  pps: "/assets/projects/PPS.jpg",
  tradeHarmonizer: "/assets/projects/trade-harmonizer.jpg",
} as const;

const IMAGE_EXT = /\.(png|jpe?g|webp|gif|svg|avif|bmp|ico)(\?|#|$)/i;

/**
 * Legacy Supabase / public paths → files under /public/assets/projects/
 */
export const LEGACY_IMAGE_PATH_MAP: Record<string, string> = {
  "/assets/capture-ai.png": PROJECT_PREVIEW_FILES.captureAiDashboard,
  "/assets/capture-ai-landing-page.png": PROJECT_PREVIEW_FILES.captureAiLanding,
  "/assets/recodo-dashboard.png": PROJECT_PREVIEW_FILES.recordoDashboard,
  "/assets/recordo-dashboard.png": PROJECT_PREVIEW_FILES.recordoDashboard,
  "/assets/recordo-landing-page.png": PROJECT_PREVIEW_FILES.recordoLanding,
  "/assets/goldium-crafter.png": PROJECT_PREVIEW_FILES.goldiumCrafter,
  "/assets/recipe-gen.png": PROJECT_PREVIEW_FILES.recipeGenerator,
  "/assets/recipe-generator.png": PROJECT_PREVIEW_FILES.recipeGenerator,
  "assets/capture-ai.png": PROJECT_PREVIEW_FILES.captureAiDashboard,
  "assets/capture-ai-landing-page.png": PROJECT_PREVIEW_FILES.captureAiLanding,
  "assets/recodo-dashboard.png": PROJECT_PREVIEW_FILES.recordoDashboard,
  "assets/recordo-landing-page.png": PROJECT_PREVIEW_FILES.recordoLanding,
  "assets/goldium-crafter.png": PROJECT_PREVIEW_FILES.goldiumCrafter,
  "assets/recipe-gen.png": PROJECT_PREVIEW_FILES.recipeGenerator,
  "projects/capture-ai-dashboard.png": PROJECT_PREVIEW_FILES.captureAiDashboard,
  "projects/capture-ai-landing-page.png": PROJECT_PREVIEW_FILES.captureAiLanding,
  "projects/recordo-landing-page.png": PROJECT_PREVIEW_FILES.recordoLanding,
  "projects/recordo-dashboard.png": PROJECT_PREVIEW_FILES.recordoDashboard,
  "projects/recodo-dashboard.png": PROJECT_PREVIEW_FILES.recordoDashboard,
  "projects/goldium-crafter.png": PROJECT_PREVIEW_FILES.goldiumCrafter,
  "projects/recipe-generator.png": PROJECT_PREVIEW_FILES.recipeGenerator,
  "projects/PPS.png": PROJECT_PREVIEW_FILES.pps,
  "projects/trade-harmonizer.png": PROJECT_PREVIEW_FILES.tradeHarmonizer,
};

export function remapLegacyProjectImagePath(path: string | null | undefined): string | null {
  if (!path) return null;
  const trimmed = path.trim();
  if (!trimmed) return null;

  const withSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  if (LEGACY_IMAGE_PATH_MAP[withSlash]) return LEGACY_IMAGE_PATH_MAP[withSlash];
  if (LEGACY_IMAGE_PATH_MAP[trimmed]) return LEGACY_IMAGE_PATH_MAP[trimmed];

  // Already under /assets/projects/ — bundled previews are now optimized JPEGs,
  // so rewrite any stale .png reference to the .jpg that actually ships.
  if (withSlash.startsWith("/assets/projects/") && IMAGE_EXT.test(withSlash)) {
    return withSlash.replace(/\.png(\?|#|$)/i, ".jpg$1");
  }

  return null;
}

/** Storage object keys (upload via scripts/upload-project-images.mjs) */
export const PROJECT_STORAGE_KEYS = {
  captureAiDashboard: "projects/capture-ai-dashboard.png",
  captureAiLanding: "projects/capture-ai-landing-page.png",
  recordoDashboard: "projects/recordo-dashboard.png",
  recordoLanding: "projects/recordo-landing-page.png",
  recipeGenerator: "projects/recipe-generator.png",
  goldiumCrafter: "projects/goldium-crafter.png",
  pps: "projects/PPS.png",
  tradeHarmonizer: "projects/trade-harmonizer.png",
} as const;

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/goldiam/g, "goldium")
    .replace(/crafters/g, "crafter")
    .replace(/recodo/g, "recordo")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Canonical key for deduplicating near-duplicate project titles in Supabase. */
export function projectDedupeKey(title: string): string {
  const t = normalizeTitle(title);
  if (/goldium/.test(t) && /crafter/.test(t)) return "goldium-crafter";
  if (/capture/.test(t) && /ai/.test(t)) {
    return /landing/.test(t) ? "capture-ai-landing" : "capture-ai";
  }
  if (/recordo/.test(t) || /recodo/.test(t)) {
    return /landing/.test(t) ? "recordo-landing" : "recordo-dashboard";
  }
  if (/recipe/.test(t)) return "recipe-generator";
  if (/pps|police professional/.test(t)) return "pps";
  if (/trade/.test(t) && /harmon/.test(t)) return "trade-harmonizer";
  return t.replace(/\s+/g, "-");
}

export function getStaticProjectPreviewPath(title: string): string | null {
  const t = normalizeTitle(title);
  if (/goldium/.test(t) && /crafter/.test(t)) return PROJECT_PREVIEW_FILES.goldiumCrafter;
  if (/capture/.test(t) && /ai/.test(t)) {
    return /landing/.test(t)
      ? PROJECT_PREVIEW_FILES.captureAiLanding
      : PROJECT_PREVIEW_FILES.captureAiDashboard;
  }
  if (/recordo/.test(t) || /recodo/.test(t)) {
    return /landing/.test(t)
      ? PROJECT_PREVIEW_FILES.recordoLanding
      : PROJECT_PREVIEW_FILES.recordoDashboard;
  }
  if (/recipe/.test(t)) return PROJECT_PREVIEW_FILES.recipeGenerator;
  if (/pps|police professional/.test(t)) return PROJECT_PREVIEW_FILES.pps;
  if (/trade/.test(t) && /harmon/.test(t)) return PROJECT_PREVIEW_FILES.tradeHarmonizer;
  return null;
}

export function getStorageKeyForProjectTitle(title: string): string | null {
  const key = projectDedupeKey(title);
  const map: Record<string, string> = {
    "goldium-crafter": PROJECT_STORAGE_KEYS.goldiumCrafter,
    "capture-ai": PROJECT_STORAGE_KEYS.captureAiDashboard,
    "capture-ai-landing": PROJECT_STORAGE_KEYS.captureAiLanding,
    "recordo-dashboard": PROJECT_STORAGE_KEYS.recordoDashboard,
    "recordo-landing": PROJECT_STORAGE_KEYS.recordoLanding,
    "recipe-generator": PROJECT_STORAGE_KEYS.recipeGenerator,
    pps: PROJECT_STORAGE_KEYS.pps,
    "trade-harmonizer": PROJECT_STORAGE_KEYS.tradeHarmonizer,
  };
  return map[key] ?? null;
}

/** Prefer the main app card over a duplicate landing-only row when titles collide. */
export function shouldReplaceProjectRow(
  candidate: { title: string; featured?: boolean; liveLink?: string | null },
  existing: { title: string; featured?: boolean; liveLink?: string | null }
): boolean {
  const cTitle = normalizeTitle(candidate.title);
  const eTitle = normalizeTitle(existing.title);
  const cLanding = /landing/.test(cTitle);
  const eLanding = /landing/.test(eTitle);
  if (cLanding !== eLanding) return eLanding;

  if (Boolean(candidate.featured) !== Boolean(existing.featured)) {
    return Boolean(candidate.featured);
  }
  if (Boolean(candidate.liveLink) !== Boolean(existing.liveLink)) {
    return Boolean(candidate.liveLink);
  }
  return candidate.title.length > existing.title.length;
}
