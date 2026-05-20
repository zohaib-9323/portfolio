/**
 * Upload components/assets/*.png → Supabase Storage (public bucket "portfolio")
 * and set projects.image_url to the storage object key.
 *
 * Requires in .env:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY   (Dashboard → Settings → API → service_role)
 *
 * Run: node scripts/upload-project-images.mjs
 */
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = path.join(__dirname, "..", "components", "assets");
const BUCKET = (process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "portfolio").trim();

const UPLOADS = [
  { file: "capture-ai-dashboard.png", key: "projects/capture-ai-dashboard.png" },
  { file: "capture-ai-landing-page.png", key: "projects/capture-ai-landing-page.png" },
  { file: "recordo-dashboard.png", key: "projects/recordo-dashboard.png" },
  { file: "recordo-landing-page.png", key: "projects/recordo-landing-page.png" },
  { file: "recipe-generator.png", key: "projects/recipe-generator.png" },
  { file: "goldium-crafter.png", key: "projects/goldium-crafter.png" },
  { file: "PPS.png", key: "projects/PPS.png" },
  { file: "trade-harmonizer.png", key: "projects/trade-harmonizer.png" },
];

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env"
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function main() {
  for (const { file, key } of UPLOADS) {
    const localPath = path.join(ASSETS_DIR, file);
    if (!fs.existsSync(localPath)) {
      console.warn(`Skip (missing): ${file}`);
      continue;
    }
    const body = fs.readFileSync(localPath);
    const { error } = await supabase.storage.from(BUCKET).upload(key, body, {
      contentType: "image/png",
      upsert: true,
    });
    if (error) {
      console.error(`Upload failed ${key}:`, error.message);
    } else {
      console.log(`Uploaded ${key}`);
    }
  }

  console.log("\nRun scripts/update-project-images.sql in Supabase SQL Editor next.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
