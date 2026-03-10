const express = require("express")
const router = express.Router()

const { generateReply } = require("../engines/aiEngine")
const { getMemory, saveMemory } = require("../engines/memoryEngine")
const { detectEmotion } = require("../engines/emotionEngine")

router.post("/", async (req,res)=>{

const {message,userId="default"} = req.body

let history = getMemory(userId)

const emotion = detectEmotion(message)

history.push({role:"user",content:message})

if(history.length>20){
history = history.slice(-20)
}

const reply = await generateReply(history,emotion)

history.push({role:"assistant",content:reply})

saveMemory(userId,history)

res.json({reply})

})

module.exports = router
