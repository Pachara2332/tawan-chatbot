import { GoogleGenAI } from "@google/genai";

async function run() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  try {
    const models = await ai.models.list();
    for await (const model of models) {
        if (model.name.includes("flash") && !model.name.includes("preview")) {
           console.log(model.name);
        }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

run();
