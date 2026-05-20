const MISTRAL_EMBED_URL = "https://api.mistral.ai/v1/embeddings";

export async function getMistralEmbedding(
  text: string,
  apiKey: string,
  model = process.env.MISTRAL_EMBED_MODEL?.trim() || "mistral-embed"
): Promise<number[]> {
  const response = await fetch(MISTRAL_EMBED_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      input: text.trim(),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    if (response.status === 403) {
      throw new Error("Mistral API key reported as leaked or unauthorized.");
    }
    throw new Error(`Mistral API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const embedding = data?.data?.[0]?.embedding;
  if (!Array.isArray(embedding) || embedding.length === 0) {
    throw new Error("Mistral returned an empty embedding");
  }
  return embedding;
}
