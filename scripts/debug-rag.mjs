import { QdrantClient } from "@qdrant/js-client-rest";
import { getEmbedding, VECTOR_COLLECTION, CACHE_COLLECTION } from "./embeddings.mjs";

const client = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
  checkCompatibility: false,
});

const query = process.argv[2] || "What is Capture AI project?";

const embed = (text) => getEmbedding(text, "query");

async function main() {
  console.log("AI_PROVIDER:", process.env.AI_PROVIDER);
  const cols = await client.getCollections();
  console.log(
    "Collections:",
    cols.collections.map((c) => c.name).join(", ")
  );

  const vec = await embed(query);
  console.log("Query:", query);
  console.log("Embedding dims:", vec.length);

  const rag = await client.search(VECTOR_COLLECTION, { vector: vec, limit: 3 });
  console.log(`\n--- RAG (${VECTOR_COLLECTION}) ---`);
  console.log("Hits:", rag.length);
  for (const [i, r] of rag.entries()) {
    const text = r.payload?._text || "";
    console.log(`${i + 1}. score=${r.score.toFixed(4)}`);
    console.log("   ", text.slice(0, 200));
  }

  try {
    const cache = await client.search(CACHE_COLLECTION, {
      vector: vec,
      limit: 3,
    });
    console.log("\n--- Semantic cache ---");
    console.log("Hits:", cache.length);
    for (const [i, r] of cache.entries()) {
      console.log(`${i + 1}. score=${r.score.toFixed(4)} query="${(r.payload?.query || "").slice(0, 60)}"`);
      console.log("   response:", (r.payload?.response || "").slice(0, 120));
    }
  } catch (e) {
    console.log("Cache collection:", e.message);
  }
}

main().catch(console.error);
