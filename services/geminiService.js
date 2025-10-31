import { GoogleGenAI } from "@google/genai";

// The AI Studio environment provides the API key via process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Calls the Gemini API to get a response for a given prompt.
 * @param {string} prompt The user's query.
 * @returns {Promise<string>} The text response from the model.
 */
export async function getGeminiResponse(prompt) {
  if (!prompt) {
    throw new Error("Prompt cannot be empty.");
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    const text = response.text;
    
    if (text) {
      return text;
    } else {
      return "I'm sorry, I couldn't generate a response for that. Please try a different query.";
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to communicate with the AI service.");
  }
}