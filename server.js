const express = require("express")
const cors = require("cors")
const axios = require("axios")
const fs = require("fs")

const app = express()

app.use(cors())
app.use(express.json())

// MEMORY FILE
const MEMORY_FILE = "memory.json"

// load memory if it exists
let conversations = {}

if (fs.existsSync(MEMORY_FILE)) {
  conversations = JSON.parse(fs.readFileSync(MEMORY_FILE))
}

// save memory function
function saveMemory() {
  fs.writeFileSync(MEMORY_FILE, JSON.stringify(conversations, null, 2))
}

// personality
const SYSTEM_PROMPT = `
You are Rivi, a caring emotional AI companion.
You speak warmly and naturally.
You remember previous conversations.
You behave like a supportive close friend.
`

app.post("/chat", async (req, res) => {

  const { message, userId = "default" } = req.body

  if (!conversations[userId]) {
    conversations[userId] = []
  }

  conversations[userId].push({
    role: "user",
    content: message
  })

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...conversations[userId]
  ]

  try {

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: messages
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    )

    const reply = response.data.choices[0].message.content

    conversations[userId].push({
      role: "assistant",
      content: reply
    })

    saveMemory()

    res.json({ reply })

  } catch (error) {

    console.log("AI ERROR:", error.response?.data || error)

    res.json({
      reply: "I'm having trouble thinking right now, but I'm here."
    })

  }

})

app.listen(3000, () => {
  console.log("Rivi AI server running")
})
