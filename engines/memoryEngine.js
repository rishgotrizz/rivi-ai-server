const { createClient } = require("@supabase/supabase-js")
const OpenAI = require("openai")

// Supabase connection
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

// OpenRouter / OpenAI embeddings
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY
})

/* =========================
   CREATE EMBEDDING
========================= */

async function createEmbedding(text) {

  const res = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text
  })

  return res.data[0].embedding

}

/* =========================
   SAVE MEMORY
========================= */

async function saveMemory(text, emotion = "neutral") {

  try {

    const embedding = await createEmbedding(text)

    const { error } = await supabase
      .from("memories")
      .insert([
        {
          text: text,
          emotion: emotion,
          embedding: embedding
        }
      ])

    if (error) {
      console.log("Memory save error:", error)
    }

  } catch (err) {
    console.log("Memory save error:", err)
  }

}

/* =========================
   GET RECENT MEMORIES
========================= */

async function getRecentMemories(limit = 5) {

  try {

    const { data, error } = await supabase
      .from("memories")
      .select("text")
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.log("Memory fetch error:", error)
      return []
    }

    return data.map(m => m.text)

  } catch (err) {

    console.log("Memory fetch error:", err)
    return []

  }

}

/* =========================
   COSINE SIMILARITY
========================= */

function cosineSimilarity(a, b) {

  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0)

  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))

  return dotProduct / (magnitudeA * magnitudeB)

}

/* =========================
   SEARCH RELEVANT MEMORIES
========================= */

async function searchRelevantMemories(query, limit = 3) {

  try {

    const queryEmbedding = await createEmbedding(query)

    const { data, error } = await supabase
      .from("memories")
      .select("text, embedding")

    if (error || !data) return []

    const scored = data.map(m => ({
      text: m.text,
      score: cosineSimilarity(queryEmbedding, m.embedding)
    }))

    scored.sort((a, b) => b.score - a.score)

    return scored.slice(0, limit).map(m => m.text)

  } catch (err) {

    console.log("Vector search error:", err)
    return []

  }

}

module.exports = {
  saveMemory,
  getRecentMemories,
  searchRelevantMemories
}
