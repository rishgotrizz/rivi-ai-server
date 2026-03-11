const express = require("express")
const cors = require("cors")

const chatRoute = require("./routes/chat")
const voiceRoute = require("./routes/voice")

const app = express()

app.use(cors())
app.use(express.json())

/* =========================
   ROUTES
========================= */

app.use("/chat", chatRoute)
app.use("/voice", voiceRoute)

/* =========================
   HEALTH CHECK
========================= */

app.get("/", (req, res) => {
  res.send("Rivi AI backend running")
})

/* =========================
   SERVER START
========================= */

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("Rivi AI server running on port " + PORT)
})
