import { GoogleGenAI } from "@google/genai";

// Initialize with API key from environment
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Generate AI response (simple one-shot)
 */
export async function generateSimpleResponse(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingBudget: 0,
        },
      },
    });
    
    // FIX: Access text correctly
    return response.text || response.response?.text() || "No response";
  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw new Error(error.message || "Failed to generate response");
  }
}

/**
 * Generate AI response with chat history
 */
export async function generateChatResponse(userMessage, history = []) {
  try {
    // Build the conversation contents
    const contents = [];
    
    // Add history
    for (const msg of history) {
      contents.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      });
    }
    
    // Add current message
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        thinkingConfig: {
          thinkingBudget: 0,
        },
      },
    });

    // FIX: Try multiple ways to access the text
    const text = response.text || 
                 response.response?.text() || 
                 response.candidates?.[0]?.content?.parts?.[0]?.text ||
                 "No response generated";
    
    return text;
  } catch (error) {
    console.error("Gemini AI Error:", error);
    console.error("Full error:", JSON.stringify(error, null, 2));
    throw new Error(error.message || "Failed to generate response");
  }
}