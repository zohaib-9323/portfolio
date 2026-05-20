import dotenv from "dotenv";
import { QdrantClient } from "@qdrant/js-client-rest";

dotenv.config();

const client = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
  checkCompatibility: false,
});

const query = process.argv[2] || "What is Capture AI project?";

async function embed(text) {
  const res = await fetch("https://api.mistral.ai/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
    },
    body: JSON.stringify({ model: "mistral-embed", input: text }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));
  return data.data[0].embedding;
}

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

  const rag = await client.search("portfolio_vectors", { vector: vec, limit: 3 });
  console.log("\n--- RAG (portfolio_vectors) ---");
  console.log("Hits:", rag.length);
  for (const [i, r] of rag.entries()) {
    const text = r.payload?._text || "";
    console.log(`${i + 1}. score=${r.score.toFixed(4)}`);
    console.log("   ", text.slice(0, 200));
  }

  try {
    const cache = await client.search("portfolio_semantic_cache", {
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
