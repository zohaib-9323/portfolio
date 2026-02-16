import { createClient } from '@supabase/supabase-js';
import { QdrantClient } from '@qdrant/js-client-rest';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const QDRANT_URL = process.env.QDRANT_URL;
const QDRANT_API_KEY = process.env.QDRANT_API_KEY;
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

const COLLECTION_NAME = 'portfolio_vectors';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const qdrant = new QdrantClient({
    url: QDRANT_URL,
    apiKey: QDRANT_API_KEY,
});

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function getEmbedding(text) {
    // Mistral Free Tier rate limits are quite strict, add a small delay
    await sleep(200);

    const response = await fetch('https://api.mistral.ai/v1/embeddings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${MISTRAL_API_KEY}`,
        },
        body: JSON.stringify({
            model: 'mistral-embed',
            input: text,
        }),
    });

    if (!response.ok) {
        if (response.status === 429) {
            console.warn('Rate limit hit, sleeping for 2 seconds...');
            await sleep(2000);
            return getEmbedding(text); // Simple retry once
        }
        const error = await response.text();
        throw new Error(`Mistral API error: ${error}`);
    }

    const data = await response.json();
    return data.data[0].embedding;
}


function rowToText(row, tableName) {
    const fields = Object.entries(row)
        .filter(([key]) => !['id', 'created_at', 'updated_at', 'metadata', 'image_url', 'profile_image_url'].includes(key))
        .map(([key, value]) => `${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`)
        .join('. ');
    return `Table: ${tableName}. Content: ${fields}`;
}

// Generate a valid UUID from a string (for Qdrant point IDs)
function generateUUID(str) {
    const hash = crypto.createHash('sha256').update(str).digest('hex');
    // Format hash into UUID style: 8-4-4-4-12
    return [
        hash.substring(0, 8),
        hash.substring(8, 12),
        hash.substring(12, 16),
        hash.substring(16, 20),
        hash.substring(20, 32)
    ].join('-');
}

async function main() {
    console.log('Starting sync to Qdrant...');

    // 1. Ensure collection exists
    const collections = await qdrant.getCollections();
    const exists = collections.collections.some(c => c.name === COLLECTION_NAME);

    if (!exists) {
        console.log(`Creating collection: ${COLLECTION_NAME}`);
        await qdrant.createCollection(COLLECTION_NAME, {
            vectors: {
                size: 1024, // Mistral embedding size
                distance: 'Cosine',
            },
        });
    }

    const tables = [
        'personal_data',
        'skills',
        'projects',
        'experience',
        'education',
        'project_contributions'
    ];

    for (const table of tables) {
        console.log(`Processing table: ${table}...`);
        const { data: rows, error } = await supabase.from(table).select('*');

        if (error) {
            console.error(`Error fetching from ${table}:`, error.message);
            continue;
        }

        console.log(`Found ${rows.length} rows in ${table}`);

        const points = [];
        for (const row of rows) {
            const text = rowToText(row, table);
            console.log(`  Generating embedding for: ${text.substring(0, 100)}...`);

            try {
                const embedding = await getEmbedding(text);

                // Use existing ID if it's a UUID, otherwise generate one
                let pointId = row.id;
                if (typeof pointId !== 'string' || !pointId.match(/^[0-9a-f-]{36}$/i)) {
                    pointId = generateUUID(`${table}-${row.id || JSON.stringify(row)}`);
                }

                points.push({
                    id: pointId,
                    vector: embedding,
                    payload: {
                        ...row,
                        _table: table,
                        _text: text
                    }
                });
            } catch (err) {
                console.error(`  Failed to process row in ${table}:`, err.message);
            }
        }

        if (points.length > 0) {
            console.log(`  Upserting ${points.length} points for ${table}...`);
            await qdrant.upsert(COLLECTION_NAME, {
                wait: true,
                points: points,
            });
        }
    }

    console.log('Sync complete!');
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
