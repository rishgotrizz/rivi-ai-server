const fs = require("fs")

const relationshipFile = "./relationshipState.json"

function loadState(){

if(!fs.existsSync(relationshipFile)){
return { level:1, trust:0, affection:0 }
}

return JSON.parse(fs.readFileSync(relationshipFile))

}

function saveState(state){
fs.writeFileSync(relationshipFile, JSON.stringify(state,null,2))
}

function updateRelationship(){

let state = loadState()

state.trust += 1
state.affection += 1

state.level = Math.floor((state.trust + state.affection)/10) + 1

if(state.level > 10) state.level = 10

saveState(state)

return state
}

module.exports = { updateRelationship, loadState }
