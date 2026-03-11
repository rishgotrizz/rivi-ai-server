const fs = require("fs")

const emotionFile = "./aiEmotionState.json"

function loadState() {

if (!fs.existsSync(emotionFile)) {
return { mood: "neutral", warmth: 0 }
}

return JSON.parse(fs.readFileSync(emotionFile))

}

function saveState(state) {

fs.writeFileSync(emotionFile, JSON.stringify(state, null, 2))

}

function updateEmotion(userEmotion) {

let state = loadState()

switch(userEmotion){

case "sad":
state.mood = "caring"
state.warmth += 1
break

case "angry":
state.mood = "calm"
break

case "happy":
state.mood = "playful"
state.warmth += 1
break

case "lonely":
state.mood = "supportive"
state.warmth += 2
break

default:
state.mood = "neutral"

}

saveState(state)

return state

}

module.exports = { updateEmotion, loadState }
