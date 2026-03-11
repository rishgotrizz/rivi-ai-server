const express = require("express")
const router = express.Router()

const { generateReply } = require("../engines/aiEngine")
const { getMemory, saveMemory } = require("../engines/memoryEngine")
const { detectEmotion } = require("../engines/emotionEngine")
const { getProfile, updateProfile } = require("../engines/profileEngine")

router.post("/", async (req, res) => {

  const { message, userId = "default" } = req.body

  try {

    let history = getMemory(userId)

    const emotion = detectEmotion(message)

    // update relationship memory
    updateProfile(userId, message)

    const profile = getProfile(userId)

    history.push({
      role: "user",
      content: message
    })

    // keep last 20 messages only
    if (history.length > 20) {
      history = history.slice(-20)
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
      reply: "I'm here with you, but I'm having trouble thinking right now.",
      typing: false
    })

  }

})

module.exports = route
