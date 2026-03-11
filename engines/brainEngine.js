const { saveMemory, getRecentMemories } = require("./memoryEngine")
const { generateAIReply } = require("./aiEngine")

// simple emotion detection
function detectEmotion(text) {

  text = text.toLowerCase()

  if (text.includes("sad") || text.includes("upset")) return "sad"
  if (text.includes("happy") || text.includes("excited")) return "happy"
  if (text.includes("nervous") || text.includes("anxious")) return "nervous"

  return "neutral"
}

// personality layer
function applyPersonality(reply, emotion) {

  if (emotion === "sad") {
    return "I'm here for you. " + reply
  }

  if (emotion === "happy") {
    return "That sounds great! " + reply
  }

  if (emotion === "nervous") {
    return "Don't worry too much. " + reply
  }

  return reply
}

// main AI pipeline
async function processMessage(message) {

  try {

    const emotion = detectEmotion(message)

    const memories = await getRecentMemories()

    const memoryContext = memories.join("\n")

    const prompt = `
Previous memories:
${memoryContext}

User message:
${message}
`

    let reply = await generateAIReply(prompt)

    reply = applyPersonality(reply, emotion)

    await saveMemory(message, emotion)

    return reply

  } catch (err) {

    console.log("Brain engine error:", err)

    return "Something went wrong."

  }
}

module.exports = {
  processMessage
}
