const fs = require("fs")
const cosine = require("cosine-similarity")

const memoryFile = "./vectorMemory.json"

function loadMemory() {

if (!fs.existsSync(memoryFile)) return []

return JSON.parse(fs.readFileSync(memoryFile))

}

function saveMemory(data) {

fs.writeFileSync(memoryFile, JSON.stringify(data, null, 2))

}

function embed(text) {

return text
.split(" ")
.map(word => word.length)

}

function storeMemory(userId, text) {

let memories = loadMemory()

memories.push({
userId,
text,
vector: embed(text)
})

saveMemory(memories)

}

function searchMemory(userId, query) {

const memories = loadMemory()

const queryVector = embed(query)

let scored = memories
.filter(m => m.userId === userId)
.map(m => ({
text: m.text,
score: cosine(queryVector, m.vector)
}))

scored.sort((a,b)=>b.score-a.score)

return scored.slice(0,3).map(m=>m.text)

}

module.exports = { storeMemory, searchMemory }
