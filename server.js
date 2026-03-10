const express = require("express")
const cors = require("cors")

const chatRoute = require("./routes/chat")

const app = express()

app.use(cors())
app.use(express.json())

app.use("/chat", chatRoute)

app.get("/",(req,res)=>{
res.send("Rivi AI backend running")
})

app.listen(3000,()=>{
console.log("Rivi AI server running")
})
