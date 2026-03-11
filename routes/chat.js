const express = require("express")
const router = express.Router()

const { generateReply } = require("../engines/aiEngine")
const { getMemory, saveMemory } = require("../engines/memoryEngine")
const { detectEmotion } = require("../engines/emotionEngine")
const { getProfile, updateProfile } = require("../engines/profileEngine")
const { summarizeConversation } = require("../engines/summarizerEngine")
const { storeMemory, searchMemory } = require("../engines/vectorMemory")
const { updateEmotion } = require("../engines/aiEmotionEngine")
const { updateRelationship } = require("../engines/relationshipEngine")

router.post("/", async (req, res) => {

  const { message, userId = "default" } = req.body

  try {

    let history = getMemory(userId)

    /* =========================
       USER EMOTION
    ========================= */

    const emotion = detectEmotion(message)

    /* =========================
       AI EMOTIONAL STATE
    ========================= */

    const aiState = updateEmotion(emotion)

    /* =========================
       RELATIONSHIP LEVEL
    ========================= */

    const relationship = updateRelationship()

    /* =========================
       VECTOR MEMORY
    ========================= */

    storeMemory(userId, message)

    const memories = searchMemory(userId, message)

    if (memories.length > 0) {

      history.unshift({
        role: "system",
        content: "Relevant past memories: " + memories.join(", ")
      })

    }

    /* =========================
       PROFILE MEMORY
    ========================= */

    updateProfile(userId, message)

    const profile = getProfile(userId)

    /* =========================
       AI STATE CONTEXT
    ========================= */

    history.unshift({
      role: "system",
      content: "Your emotional state is currently: " + aiState.mood + ". Respond accordingly."
    })

    history.unshift({
      role: "system",
      content: "Relationship level with the user is " + relationship.level + " out of 10. Adjust friendliness accordingly."
    })

    history.push({
      role: "user",
      content: message
    })

    /* =========================
       SUMMARIZE LONG CHATS
    ========================= */

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

    /* =========================
       GENERATE AI RESPONSE
    ========================= */

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
