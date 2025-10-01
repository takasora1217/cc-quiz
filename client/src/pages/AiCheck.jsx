import { GoogleGenerativeAI } from "@google/generative-ai";

export async function AiCheck({ question, answer }) {
  try {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
    const prompt = `次の問題文と答えが一致しているかを真偽判定してください。偽の場合は50字以内でその理由を出力してください。\n問題文: ${question}\n答え: ${answer}`;    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
    
  } catch (error) {
    console.error("エラー：", error);
  }
}
