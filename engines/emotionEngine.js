function detectEmotion(text){

text=text.toLowerCase()

if(text.includes("sad")||text.includes("lonely")) return "sad"
if(text.includes("stress")||text.includes("exam")) return "stressed"
if(text.includes("happy")) return "happy"
if(text.includes("angry")) return "angry"

return "neutral"
}

module.exports = { detectEmotion }

