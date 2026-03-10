const express = require("express")
const cors = require("cors")
const axios = require("axios")

const app = express()

app.use(cors())
app.use(express.json())

app.post("/chat", async (req, res) => {
  const message = req.body.message

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are Rivi, a caring AI companion." },
          { role: "user", content: message }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    )

    const reply = response.data.choices[0].message.content
    res.json({ reply })

  } catch (err) {
    console.log("AI ERROR:", err.response?.data || err)
    res.json({ reply: "AI temporarily unavailable." })
  }
})

app.listen(3000, () => {
  console.log("Rivi AI server running")
})
