const { createClient } = require("@supabase/supabase-js")

// connect to Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

// Save memory
async function saveMemory(text, emotion = "neutral") {
  try {

    const { error } = await supabase
      .from("memories")
      .insert([
        {
          text: text,
          emotion: emotion
        }
      ])

    if (error) {
      console.log("Memory save error:", error)
    }

  } catch (err) {
    console.log("Memory save error:", err)
  }
}

// Get recent memories
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

module.exports = {
  saveMemory,
  getRecentMemories
}
