import { GoogleGenAI, Type } from "@google/genai";
import { GestureCommand, VisionResponse } from "../types";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeGesture = async (base64Image: string): Promise<VisionResponse> => {
  try {
    // Remove header if present (data:image/jpeg;base64,)
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64
            }
          },
          {
            text: `Analyze the hand gesture in this image and map it to a particle system command.
            
            Mapping Rules:
            - "Open Palm" or "High Five" -> SWITCH_NATURE (Green/Flowers)
            - "Fist" or "Punch" -> SWITCH_FIRE (Red/Explosive)
            - "Peace Sign" or "V Sign" -> SWITCH_GALAXY (Space/Stars)
            - "Heart Shape" (with hands) or "Love Sign" -> SWITCH_LOVE (Pink/Hearts)
            - "Thumbs Up" or Neutral -> RESET (Default Blue)
            
            Return JSON only.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            command: {
              type: Type.STRING,
              enum: [
                GestureCommand.SWITCH_FIRE,
                GestureCommand.SWITCH_GALAXY,
                GestureCommand.SWITCH_NATURE,
                GestureCommand.SWITCH_LOVE,
                GestureCommand.RESET,
                GestureCommand.NONE
              ]
            },
            confidence: { type: Type.NUMBER },
            reasoning: { type: Type.STRING }
          },
          required: ["command", "confidence", "reasoning"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    
    return {
      command: result.command as GestureCommand || GestureCommand.NONE,
      confidence: result.confidence || 0,
      reasoning: result.reasoning || "No reasoning provided"
    };

  } catch (error) {
    console.error("Gemini Vision Error:", error);
    return {
      command: GestureCommand.NONE,
      confidence: 0,
      reasoning: "Error analyzing image"
    };
  }
};
