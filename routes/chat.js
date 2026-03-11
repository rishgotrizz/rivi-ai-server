const express = require("express")
const router = express.Router()

const { processMessage } = require("../engines/brainEngine")

router.post("/", async (req, res) => {

  try {

    const { message } = req.body

    if (!message) {
      return res.json({
        reply: "I didn't receive a message."
      })
    }

    const reply = await processMessage(message)

    res.json({
      reply: reply
    })

  } catch (err) {

    console.log("Chat route error:", err)

    res.json({
      reply: "Something went wrong."
    })

  }

})

module.exports = router
