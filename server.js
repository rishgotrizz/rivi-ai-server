const express = require("express");
const cors = require("cors");

const chatRoute = require("./routes/chat");
const voiceRoute = require("./routes/voice");
const visionRoute = require("./routes/vision");

const app = express();

app.use(cors());
app.use(express.json({ limit: "20mb" }));

app.get("/", (req, res) => {
  res.json({ status: "Rivi AI server running" });
});

app.use("/chat", chatRoute);
app.use("/voice", voiceRoute);
app.use("/vision", visionRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Rivi AI server running on port", PORT);
});
