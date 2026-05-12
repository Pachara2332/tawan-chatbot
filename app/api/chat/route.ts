import { GoogleGenAI } from "@google/genai";

type ClientMessage = {
  role: "user" | "assistant";
  content: string;
};

function isClientMessage(message: unknown): message is ClientMessage {
  if (!message || typeof message !== "object") {
    return false;
  }

  const candidate = message as Record<string, unknown>;
  return (
    (candidate.role === "user" || candidate.role === "assistant") &&
    typeof candidate.content === "string" &&
    candidate.content.trim().length > 0
  );
}

export async function POST(req: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return Response.json(
      { error: "Missing GEMINI_API_KEY in environment variables." },
      { status: 500 }
    );
  }

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const body = (await req.json()) as { messages?: unknown };

  if (!Array.isArray(body.messages) || !body.messages.every(isClientMessage)) {
    return Response.json(
      { error: "Request body must include a messages array." },
      { status: 400 }
    );
  }

  // Map messages to Gemini format
  const contents = body.messages.slice(-20).map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction: "คุณคือ Tawan (ตะวัน) ซึ่งเป็น AI Chatbot ที่สร้างขึ้นเพื่อช่วยเหลือผู้ใช้งาน ให้คำแนะนำและพูดคุยอย่างเป็นมิตร ตอบคำถามเป็นภาษาไทยอย่างชัดเจนและสุภาพ",
      },
    });

    return Response.json({
      reply: {
        role: "assistant",
        content: response.text ?? "ขอโทษครับ ตอนนี้ยังไม่มีคำตอบจากโมเดล",
      },
    });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    return Response.json(
      { error: "เกิดข้อผิดพลาดในการเชื่อมต่อกับ Gemini API กรุณาลองใหม่อีกครั้ง" },
      { status: 500 }
    );
  }
}
