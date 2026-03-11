const fs = require("fs")

const PROFILE_FILE = "profiles.json"

let profiles = {}

if (fs.existsSync(PROFILE_FILE)) {
  profiles = JSON.parse(fs.readFileSync(PROFILE_FILE))
}

function getProfile(userId){

if(!profiles[userId]){
profiles[userId]={}
}

return profiles[userId]

}

function saveProfiles(){
fs.writeFileSync(PROFILE_FILE,JSON.stringify(profiles,null,2))
}

function updateProfile(userId,message){

const profile = getProfile(userId)

const text = message.toLowerCase()

if(text.includes("my name is")){
profile.name = message.split("my name is")[1].trim()
}

if(text.includes("i like")){
profile.likes = message.split("i like")[1].trim()
}

saveProfiles()

}

module.exports = { getProfile, updateProfile }
