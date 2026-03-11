const express = require("express")
const router = express.Router()
const multer = require("multer")
const axios = require("axios")
const fs = require("fs")

const { generateReply } = require("../engines/aiEngine")

const upload = multer({ dest: "uploads/" })

router.post("/", upload.single("audio"), async (req, res) => {

  try {

    const audioFile = req.file.path

    // Speech to text (Whisper)
    const transcript = await axios.post(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        file: fs.createReadStream(audioFile),
        model: "whisper-1"
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    )

    const userText = transcript.data.text

    // AI reply
    const reply = await generateReply(
      [{ role: "user", content: userText }],
      "neutral",
      {}
    )

    res.json({
      transcript: userText,
      reply
    })

  } catch (err) {

    console.log("VOICE ERROR:", err)

    res.json({
      reply: "Sorry, I couldn't understand that."
    })

  }

})

module.exports = router
