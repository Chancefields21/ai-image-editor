import { Injectable } from '@angular/core';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor() {
    // IMPORTANT: API key is handled securely via environment variables.
    // The user will need to provide their own key in the environment.ts file.
    if (!environment.geminiApiKey) {
      throw new Error("Gemini API key not found. Please add it to your environment.ts file.");
    }
    this.genAI = new GoogleGenerativeAI(environment.geminiApiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro-vision" });
  }

  /**
   * Analyzes an image selection and returns the recognized text.
   * @param imageDataUrl The base64 encoded image data URL.
   * @returns The recognized text string.
   */
  async performOcr(imageDataUrl: string): Promise<string> {
    const prompt = "Perform OCR on this image and return only the text content.";
    const imagePart = {
      inlineData: {
        data: imageDataUrl.split(',')[1], // Remove the data URL prefix
        mimeType: 'image/png'
      }
    };

    const result = await this.model.generateContent([prompt, imagePart]);
    const response = await result.response;
    return response.text();
  }

  /**
   * Analyzes an image selection and returns a description of the font style.
   * @param imageDataUrl The base64 encoded image data URL.
   * @returns A string describing the font style.
   */
  async describeFontStyle(imageDataUrl: string): Promise<string> {
    const prompt = "Describe the font style in this image in a few words (e.g., 'serif, bold, elegant', 'sans-serif, thin, modern').";
    const imagePart = {
      inlineData: {
        data: imageDataUrl.split(',')[1],
        mimeType: 'image/png'
      }
    };

    const result = await this.model.generateContent([prompt, imagePart]);
    const response = await result.response;
    return response.text();
  }
}