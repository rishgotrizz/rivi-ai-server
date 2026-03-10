const express = require("express")
const cors = require("cors")
const axios = require("axios")

const app = express()

app.use(cors())
app.use(express.json())

// simple memory storage
const conversations = {}

// personality prompt
const SYSTEM_PROMPT = `
You are Rivi, a caring AI companion.
You talk warmly and supportively.
You remember previous messages and respond like a close friend.
Keep replies natural and conversational.
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

    res.json({ reply })

  } catch (error) {

    console.log("AI ERROR:", error.response?.data || error)

    res.json({
      reply: "I'm having trouble thinking right now, but I'm here with you."
    })

  }
})

app.listen(3000, () => {
  console.log("Rivi AI server running")
})
