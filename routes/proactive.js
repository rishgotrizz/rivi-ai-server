const express = require("express");
const router = express.Router();

const { getContextAwareProactive } = require("../engines/proactiveEngine");

// TEMP fake memory/emotion (later we connect real memory engine)
let recentMemory = ["you have an exam tomorrow"];
let lastEmotion = "nervous";

router.get("/", async (req, res) => {
  try {
    const message = getContextAwareProactive(recentMemory, lastEmotion);

    res.json({
      proactive: true,
      message: message
    });

  } catch (err) {
    res.json({
      proactive: false
    });
  }
});

module.exports = router;
