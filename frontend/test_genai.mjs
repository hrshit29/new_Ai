import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Hello! Answer exactly: { \"status\": \"ok\" }",
      config: {
        responseMimeType: "application/json",
      }
    });
    console.log("SUCCESS:", response.text);
  } catch (e) {
    console.error("ERROR:", e);
  }
}
run();
