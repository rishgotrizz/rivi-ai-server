const { GoogleGenerativeAI } = require("@google/generative-ai")

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

async function analyzeImage(base64Image, prompt = "Describe this image.") {

  try {

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    })

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Image
        }
      }
    ])

    const response = await result.response

    return response.text()

  } catch (err) {

    console.log("Vision error:", err)
    return "I couldn't analyze the image."

  }

}

module.exports = { analyzeImage }
