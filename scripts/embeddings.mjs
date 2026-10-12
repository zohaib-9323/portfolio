/**
 * Embedding helper for Node scripts — mirrors lib/ai/embeddings.ts.
 * EMBEDDING_PROVIDER=gemini (default, 768 dims, *_gemini collections) | mistral (1024 dims)
 */
import dotenv from 'dotenv';

dotenv.config({ path: ['.env.local', '.env'], quiet: true });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const EMBEDDING_PROVIDER =
    (process.env.EMBEDDING_PROVIDER || 'gemini').trim().toLowerCase() === 'mistral' ? 'mistral' : 'gemini';

export const EMBEDDING_DIMS = EMBEDDING_PROVIDER === 'mistral' ? 1024 : 768;

const suffix = (base) => (EMBEDDING_PROVIDER === 'gemini' ? `${base}_gemini` : base);

export const VECTOR_COLLECTION = suffix((process.env.QDRANT_COLLECTION || 'portfolio_vectors').trim());
export const CACHE_COLLECTION = suffix((process.env.QDRANT_CACHE_COLLECTION || 'portfolio_semantic_cache').trim());

async function requestEmbedding(text, task) {
    if (EMBEDDING_PROVIDER === 'mistral') {
        return fetch('https://api.mistral.ai/v1/embeddings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.MISTRAL_API_KEY}` },
            body: JSON.stringify({ model: 'mistral-embed', input: text }),
        });
    }
    const model = process.env.GEMINI_EMBED_MODEL?.trim() || 'gemini-embedding-001';
    return fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:embedContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
        body: JSON.stringify({
            content: { parts: [{ text }] },
            taskType: task === 'query' ? 'RETRIEVAL_QUERY' : 'RETRIEVAL_DOCUMENT',
            outputDimensionality: EMBEDDING_DIMS,
        }),
    });
}

/** Embeds text, backing off on free-tier rate limits (429). */
export async function getEmbedding(text, task = 'document', attempt = 0) {
    const response = await requestEmbedding(text, task);
    if (response.status === 429 && attempt < 5) {
        const wait = 2000 * 2 ** attempt;
        console.warn(`  Rate limited, retrying in ${wait / 1000}s...`);
        await sleep(wait);
        return getEmbedding(text, task, attempt + 1);
    }
    if (!response.ok) {
        throw new Error(`${EMBEDDING_PROVIDER} embedding error (${response.status}): ${await response.text()}`);
    }
    const data = await response.json();
    return EMBEDDING_PROVIDER === 'mistral' ? data.data[0].embedding : data.embedding.values;
}
