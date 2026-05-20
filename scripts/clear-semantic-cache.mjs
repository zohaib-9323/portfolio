/**
 * Deletes all points in the semantic cache collection (bad greeting entries, etc.)
 * Usage: node scripts/clear-semantic-cache.mjs
 */
import dotenv from "dotenv";
import { QdrantClient } from "@qdrant/js-client-rest";

dotenv.config();

const COLLECTION =
  process.env.QDRANT_CACHE_COLLECTION?.trim() || "portfolio_semantic_cache";

const client = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
  checkCompatibility: false,
});

async function main() {
  const exists = (await client.getCollections()).collections.some(
    (c) => c.name === COLLECTION
  );
  if (!exists) {
    console.log(`Collection "${COLLECTION}" does not exist — nothing to clear.`);
    return;
  }

  await client.deleteCollection(COLLECTION);
  await client.createCollection(COLLECTION, {
    vectors: { size: 1024, distance: "Cosine" },
  });
  console.log(`Cleared and recreated "${COLLECTION}".`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
