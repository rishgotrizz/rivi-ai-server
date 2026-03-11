const axios = require("axios")

async function summarizeConversation(history){

const text = history.map(m => m.content).join("\n")

const response = await axios.post(
"https://openrouter.ai/api/v1/chat/completions",
{
model:"openai/gpt-3.5-turbo",
messages:[
{
role:"system",
content:"Extract important personal facts from this conversation."
},
{
role:"user",
content:text
}
]
},
{
headers:{
Authorization:`Bearer ${process.env.OPENROUTER_API_KEY}`
}
}
)

return response.data.choices[0].message.content

}

module.exports = { summarizeConversation }
