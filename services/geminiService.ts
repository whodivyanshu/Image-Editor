
import { GoogleGenAI, Modality } from "@google/genai";
import type { UploadedImage } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const PROMPT = `
  Analyze the two images provided. The first image contains a person and the second image contains an article of clothing.
  Your task is to perform a virtual try-on. Realistically place the clothing from the second image onto the person in the first image.
  - The fit should be natural and follow the person's pose and body contours.
  - Maintain the original background from the first image.
  - The lighting and shadows on the clothing should match the lighting of the original person's image.
  - Preserve the person's appearance (face, hair, skin tone) exactly as it is.
  - Output only the final edited image.
`;

export async function virtualTryOn(personImage: UploadedImage, clothingImage: UploadedImage): Promise<{ image: string | null; text: string | null }> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: personImage.base64,
              mimeType: personImage.mimeType,
            },
          },
          {
            inlineData: {
              data: clothingImage.base64,
              mimeType: clothingImage.mimeType,
            },
          },
          {
            text: PROMPT,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    let resultImage: string | null = null;
    let resultText: string | null = null;
    
    // The response is in response.candidates[0].content.parts
    const parts = response.candidates?.[0]?.content?.parts ?? [];

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        resultImage = part.inlineData.data;
      } else if (part.text) {
        resultText = part.text;
      }
    }

    if (!resultImage) {
        console.warn("API response did not contain an image part.", response);
    }

    return { image: resultImage, text: resultText };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to process images with the AI model.");
  }
}
