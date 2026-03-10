const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {

  const userMessage = req.body.message;

  const response = await axios.post("http://localhost:11434/api/generate", {
    model: "phi3",
    prompt: userMessage,
    stream: false
  });

  res.json({
    reply: response.data.response
  });

});

app.listen(3000, () => {
  console.log("Rivi AI server running on port 3000");
});
