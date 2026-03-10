const axios = require("axios")

async function generateReply(messages,emotion){

const systemPrompt = `
You are Rivi, a caring emotional AI companion.
User emotion: ${emotion}
Respond warmly and naturally.
`

const response = await axios.post(
"https://openrouter.ai/api/v1/chat/completions",
{
model:"openai/gpt-3.5-turbo",
messages:[
{role:"system",content:systemPrompt},
...messages
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

module.exports = { generateReply }
