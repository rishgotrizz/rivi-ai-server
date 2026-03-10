const fs = require("fs")

const FILE="memory.json"

let db={}

if(fs.existsSync(FILE)){
db = JSON.parse(fs.readFileSync(FILE))
}

function getMemory(id){

if(!db[id]) db[id]=[]

return db[id]

}

function saveMemory(id,data){

db[id]=data

fs.writeFileSync(FILE,JSON.stringify(db,null,2))

}

module.exports = { getMemory, saveMemory }
