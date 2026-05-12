import { GoogleGenAI } from "@google/genai";

async function run() {
  const ai = new GoogleGenAI({ apiKey: "AIzaSyB5gKxlTqAF1Yk-lJREiqxQMj2FTtF-OZo" });
  
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
