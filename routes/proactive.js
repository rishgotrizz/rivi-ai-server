const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {

  const hour = new Date().getHours()

  let message

  if (hour < 12) {
    message = "Good morning ☀️ Did you sleep well?"
  } 
  else if (hour < 17) {
    message = "Hey, how is your day going?"
  } 
  else if (hour < 22) {
    message = "You've been quiet today. What’s on your mind?"
  } 
  else {
    message = "You should probably be sleeping 😅"
  }

  res.json({
    proactive: true,
    message: message
  })

})

module.exports = router
