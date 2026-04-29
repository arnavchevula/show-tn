import { GoogleGenAI } from "@google/genai";
const geminiApiKey = useRuntimeConfig().geminiApiKey;
const client = new GoogleGenAI({ apiKey: geminiApiKey });

export async function processImage(buffer: Buffer, mimeType: string) {
    const model = "gemini-2.5-flash";
    const today = new Date().toISOString().split('T')[0];
    try {
        const data = buffer.toString('base64');
        const response = await client.models.generateContent({
            model,
            contents: [
              { inlineData: { mimeType, data } },
              { text: `Today's date is ${today}. You are extracting event details from a show flyer image. Return a JSON object with exactly these fields (use null for any you cannot find):
      {
        "title": "headlining artist or event name",
        "support": "supporting/opening acts as a single string",
        "header": "any label above the title, e.g. venue name presenting the show",
        "venue": "venue name",
        "parsedDate": "YYYY-MM-DD",
        "showTime": "show time as a string e.g. '8:00 PM' If nothing appears, use doorsTime or default to 8:00 PM" You must return as a full H:MM string,
        "doorsTime": "doors time as a string e.g. '7:00 PM' If nothing appears, use showTime or default to 8:00 PM" You must return as a full H:MM string,
        "age": "age restriction e.g. '18+' or 'All Ages'",
        "description": "any additional descriptive text on the flyer",
        "url": "any website or ticket URL shown"
      }
      Return only the raw JSON object, no markdown, no explanation.` },
            ],
          });

          const raw = response?.text?.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
          const parsed = JSON.parse(raw)
          return parsed;
    } catch (error) {
        
    }
}
