const express = require("express")
const router = express.Router()

const { generateReply } = require("../engines/aiEngine")
const { getMemory, saveMemory } = require("../engines/memoryEngine")
const { detectEmotion } = require("../engines/emotionEngine")
const { getProfile, updateProfile } = require("../engines/profileEngine")
const { summarizeConversation } = require("../engines/summarizerEngine")
const { storeMemory, searchMemory } = require("../engines/vectorMemory")

router.post("/", async (req, res) => {

  const { message, userId = "default" } = req.body

  try {

    let history = getMemory(userId)

    const emotion = detectEmotion(message)

    /* store message in vector memory */
    storeMemory(userId, message)

    /* retrieve relevant long-term memories */
    const memories = searchMemory(userId, message)

    if (memories.length > 0) {

      history.unshift({
        role: "system",
        content: "Relevant past memories: " + memories.join(", ")
      })

    }

    /* update relationship profile */
    updateProfile(userId, message)

    const profile = getProfile(userId)

    history.push({
      role: "user",
      content: message
    })

    /* summarize if conversation gets long */

    if (history.length > 30) {

      const summary = await summarizeConversation(history)

      history = [
        {
          role: "system",
          content: "Conversation summary: " + summary
        },
        ...history.slice(-10)
      ]

    }

    const reply = await generateReply(history, emotion, profile)

    history.push({
      role: "assistant",
      content: reply
    })

    saveMemory(userId, history)

    res.json({
      reply,
      typing: true
    })

  } catch (err) {

    console.log("CHAT ERROR:", err)

    res.json({
      reply: "I'm here but something went wrong.",
      typing: false
    })

  }

})

module.exports = router
