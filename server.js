const express = require("express")
const cors = require("cors")

// routes
const chatRoute = require("./routes/chat")
const voiceRoute = require("./routes/voice")
const visionRoute = require("./routes/vision")

const app = express()

// middleware
app.use(cors())
app.use(express.json({ limit: "20mb" }))

// health check
app.get("/", (req, res) => {
  res.json({
    status: "Rivi AI server running"
  })
})

// routes
app.use("/chat", chatRoute)
app.use
