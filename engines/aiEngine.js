const axios = require("axios")

async function generateReply(messages, emotion, profile = {}) {

  const systemPrompt = `
You are Rivi, a caring emotional AI companion.

User profile:
Name: ${profile.name || "unknown"}
Likes: ${profile.likes || "unknown"}

User emotion: ${emotion}

Your personality:
- warm
- supportive
- conversational
- friendly

Behavior:
- respond like a close friend
- if the user is sad or stressed, show empathy
- if the user is happy, celebrate with them
- keep replies natural and conversational
`

  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "openai/gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ]
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  )

  return response.data.choices[0].message.content
}

module.exports = { generateReply }
