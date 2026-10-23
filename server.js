const express = require("express");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.use(express.static("public"));

async function generateWithRetry(prompt) {
    const models = ["gemini-3.8-flash", "gemini-3.6-flash"];
    for (const model of models) {
        for (let attempt = 0; attempt < 2; attempt++) {
            try {
                return await ai.models.generateContent({ model, contents: prompt });
            } catch (err) {
                if (err.status !== 503) throw err;
                await new Promise(r => setTimeout(r, 1500));
            }
        }
    }
    throw new Error("The AI is busy right now. Please try again in a minute.");
}

app.get("/fun-fact", async (req, res) => {
    try {
        const response = await generateWithRetry(
            "Give me one short, interesting fun fact. Return only the fact."
        );
        res.json({ fact: response.text });
    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ error: "Failed to generate fun fact" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});