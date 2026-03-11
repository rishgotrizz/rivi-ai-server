const express = require("express")
const cors = require("cors")

const chatRoute = require("./routes/chat")
const voiceRoute = require("./routes/voice")
const proactiveRoute = require("./routes/proactive")

const app = express()

app.use(cors())
app.use(express.json())

// ROUTES
app.use("/chat", chatRoute)
app.use("/voice", voiceRoute)
app.use("/proactive", proactiveRoute)

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "Rivi AI server running"
  })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("Rivi AI server running on port", PORT)
})
