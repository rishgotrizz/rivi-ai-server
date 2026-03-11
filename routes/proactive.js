const express = require("express")
const router = express.Router()

const { getProactiveMessage } = require("../engines/proactiveEngine")

router.get("/", async (req, res) => {

  try {

    const message = getProactiveMessage()

    res.json({
      proactive: true,
      message: message
    })

  } catch (err) {

    res.json({
      proactive: false
    })

  }

})

module.exports = router
