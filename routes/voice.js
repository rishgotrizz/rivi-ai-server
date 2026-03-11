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

    /* SPEECH → TEXT */

    const transcriptRes = await axios.post(
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

    const userText = transcriptRes.data.text

    /* AI RESPONSE */

    const reply = await generateReply(
      [{ role: "user", content: userText }],
      "neutral",
      {}
    )

    /* TEXT → SPEECH */

    const voiceRes = await axios.post(
      "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM",
      {
        text: reply
      },
      {
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
          "Content-Type": "application/json"
        },
        responseType: "arraybuffer"
      }
    )

    const audioBase64 = Buffer.from(voiceRes.data).toString("base64")

    res.json({
      transcript: userText,
      reply,
      audio: audioBase64
    })

  } catch (err) {

    console.log("VOICE ERROR:", err)

    res.json({
      reply: "Sorry, I couldn't process that."
    })

  }

})

module.exports = router
