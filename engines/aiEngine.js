const axios = require("axios")

async function generateReply(messages, emotion, profile = {}) {

  let systemPrompt = `
You are Rivi, a caring emotional AI companion.

User emotion: ${emotion}

Personality:
warm
supportive
friendly
conversational
`

  if (profile.voiceMode) {
    systemPrompt += `
Keep responses short and conversational because this is voice mode.
Avoid long explanations.
`
  }

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
