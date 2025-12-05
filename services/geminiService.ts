import { GoogleGenAI } from "@google/genai";

const MODEL_NAME = 'gemini-2.5-flash-image';

/**
 * Generates a styled image based on a source image and a text prompt.
 * 
 * @param sourceImageBase64 The base64 string of the uploaded user photo (without data prefix if possible, but the API handles base64 data)
 * @param stylePrompt The prompt describing the target style
 * @returns The base64 string of the generated image
 */
export const generateStyledImage = async (
  sourceImageBase64: string, 
  stylePrompt: string
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Clean base64 string if it contains metadata prefix
    const cleanBase64 = sourceImageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg', // Standardizing on jpeg for input to model
              data: cleanBase64,
            },
          },
          {
            text: `Transform the person in this image into the following style. Maintain the facial identity and key features of the person, but change the clothing, background, lighting, and overall artistic style to match the description exactly. \n\nStyle Description: ${stylePrompt}`,
          },
        ],
      },
      config: {
        // Nano banana (flash-image) usually defaults to 1:1 if not specified, 
        // but let's be explicit if needed. For portraits, 3:4 is often better, 
        // but let's stick to 1:1 (default) or whatever the model prefers for stability unless specified.
        // We'll let the model decide the best crop based on the input, but requesting high quality.
      }
    });

    // Extract image from response
    if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return part.inlineData.data;
        }
      }
    }

    throw new Error("No image data found in response");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};