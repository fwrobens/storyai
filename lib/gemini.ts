import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyBJ_KjGuswxgSNQv3dy_s9lmdfau4buMr0");

export async function generateStoryWithGemini(character: string, setting: string, plotTwist: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Create an engaging short story with the following elements:
    Character: ${character}
    Setting: ${setting}
    Plot Twist: ${plotTwist}
    
    Make it creative, engaging, and around 200 words. Focus on vivid descriptions and emotional depth.
    The story should have a clear beginning, middle, and end, incorporating the plot twist naturally.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating story:', error);
    throw new Error('Failed to generate story. Please try again later.');
  }
}