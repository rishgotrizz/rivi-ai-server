const express = require("express")
const router = express.Router()

const { analyzeImage } = require("../engines/visionEngine")

router.post("/", async (req, res) => {

  try {

    const { image, prompt } = req.body

    if (!image) {
      return res.json({ reply: "No image provided." })
    }

    const result = await analyzeImage(image, prompt)

    res.json({
      reply: result
    })

  } catch (err) {

    console.log("Vision route error:", err)

    res.json({
      reply: "Image analysis failed."
    })

  }

})

module.exports = router
