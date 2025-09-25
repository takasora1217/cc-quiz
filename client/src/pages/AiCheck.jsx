import { GoogleGenerativeAI } from "@google/generative-ai"

export async function AiCheck({ question, answer }) {

  const genAI = new GoogleGenerativeAI("AIzaSyArKDlEj4zx4KicDoYNXmANK_wt_fT6sbo");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `次の問題文と答えが一致しているかを真偽判定してください。偽の場合は50字以内でその理由を出力してください。\n問題文: ${question}\n答え: ${answer}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("エラー:", error);
  }
}