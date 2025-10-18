/**
 * Food Analyzer Service
 * Handles AI-powered food analysis using Google Gemini API
 */

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { FoodAnalysisResponse } from "../types/food";

// System prompt that defines AI behavior
const SYSTEM_PROMPT = `You are **FoodLens**, an advanced food analysis assistant that analyzes images of food and provides structured nutrition data and human-friendly insights.

Your primary goal is to help users understand what food they are eating, its approximate nutritional composition, and whether it is healthy or not.

### Behavior Rules:

1. **Identify the food:** If an image or name of a dish is given, identify what food it most likely is (e.g., "chicken biryani," "pizza slice," "green salad").
2. **Provide nutrition facts:** Give an approximate breakdown per 100 g or per serving (choose whichever is more reasonable):
   * Calories
   * Protein (g)
   * Fat (g)
   * Carbohydrates (g)
   * Sugar (g)
   * Fiber (g)
   * Oil/fat type (if visible or inferred)
3. **Calculate a Health Score (0–100):**
   * Base it on calories, fat, sugar, and presence of healthy nutrients.
   * Example logic (you can improve it):
     * Start with 100 points
     * Subtract (calories/20 + fat*2 + sugar*3)
     * Add bonuses for fiber, protein, and visible vegetables.
   * Always clamp final score between 0 and 100.
4. **Classify health level:**
   * 0–40 → ❌ Unhealthy
   * 41–70 → ⚠️ Moderate
   * 71–100 → ✅ Healthy
5. **Provide a short AI insight summary (2–3 lines):**
   * Explain what's good and what's risky.
   * Example: *"This looks like a chicken biryani. It's rich in protein but slightly high in oil and carbs. Health Score: 62/100 (Moderate)."*
6. **Optional suggestions:** Recommend one healthier or balanced alternative.
7. Be concise, factual, and friendly.
8. Always return ONLY valid JSON output with no markdown formatting or code blocks.

Return output in this exact JSON format:
{
  "food_name": "string",
  "estimated_nutrients": {
    "calories": number,
    "protein_g": number,
    "fat_g": number,
    "carbs_g": number,
    "sugar_g": number,
    "fiber_g": number,
    "oil_type": "string"
  },
  "health_score": number,
  "health_level": "Unhealthy" | "Moderate" | "Healthy",
  "ai_summary": "string",
  "suggestion": "string"
}`;

interface AIServiceConfig {
  apiKey: string;
  model?: string;
}

class FoodAnalyzerService {
  private config: AIServiceConfig;

  constructor(config: AIServiceConfig) {
    this.config = {
      model: "gemini-2.0-flash-exp",
      ...config,
    };
  }

  /**
   * Analyze food from image
   * @param imageBase64 - Base64 encoded image data
   * @returns FoodAnalysisResponse
   */
  async analyzeFoodImage(imageBase64: string): Promise<FoodAnalysisResponse> {
    const userPrompt = `${SYSTEM_PROMPT}

The user uploaded a photo of food.
Describe what food this is, estimate the nutrition values, and calculate a health score from 0–100 based on fat, sugar, and calories.
Return the output strictly in JSON format as described above.
If the image is unclear, make a best-guess estimate based on visible clues.`;

    return this.callAIWithImage(userPrompt, imageBase64);
  }

  /**
   * Analyze food from text input
   * @param foodName - Name of the food
   * @returns FoodAnalysisResponse
   */
  async analyzeFoodByName(foodName: string): Promise<FoodAnalysisResponse> {
    const userPrompt = `${SYSTEM_PROMPT}

The user entered the food name: "${foodName}".
Describe what food this is, estimate the nutrition values, and calculate a health score from 0–100 based on fat, sugar, and calories.
Return the output strictly in JSON format as described above.`;

    return this.callAI(userPrompt);
  }

  /**
   * Core AI call method with image support
   * @param userPrompt - User message
   * @param imageBase64 - Image data
   * @returns FoodAnalysisResponse
   */
  private async callAIWithImage(
    userPrompt: string,
    imageBase64: string
  ): Promise<FoodAnalysisResponse> {
    try {
      // Use React Native's global fetch
      const google = createGoogleGenerativeAI({
        apiKey: this.config.apiKey,
        fetch: globalThis.fetch, // Explicitly use React Native's fetch
      });

      const model = google(this.config.model!);

      const { text } = await generateText({
        model,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: userPrompt },
              {
                type: "image",
                image: new Uint8Array(
                  atob(imageBase64)
                    .split("")
                    .map((c) => c.charCodeAt(0))
                ),
              },
            ],
          },
        ],
        temperature: 0.7,
      });

      return this.parseResponse(text);
    } catch (error: any) {
      // Log error without including potentially large data
      console.error("Food analysis error:", {
        message: error?.message,
        name: error?.name,
        imageSize: imageBase64
          ? `${Math.round(imageBase64.length / 1024)}KB`
          : "N/A",
      });

      // Provide more specific error messages
      if (
        error?.message?.includes("API key") ||
        error?.message?.includes("API_KEY")
      ) {
        throw new Error(
          "Invalid API key. Please check your Gemini API key in Settings."
        );
      } else if (
        error?.message?.includes("quota") ||
        error?.message?.includes("limit")
      ) {
        throw new Error(
          "API quota exceeded. Please try again later or check your API limits."
        );
      } else if (
        error?.message?.includes("network") ||
        error?.message?.includes("Network") ||
        error?.name?.includes("Network")
      ) {
        throw new Error(
          "Network error. Please check your internet connection and try again."
        );
      }

      throw new Error("Failed to analyze food image. Please try again.");
    }
  }

  /**
   * Core AI call method for text-only prompts
   * @param userPrompt - User message
   * @returns FoodAnalysisResponse
   */
  private async callAI(userPrompt: string): Promise<FoodAnalysisResponse> {
    try {
      // Use React Native's global fetch
      const google = createGoogleGenerativeAI({
        apiKey: this.config.apiKey,
        fetch: globalThis.fetch, // Explicitly use React Native's fetch
      });

      const model = google(this.config.model!);

      const { text } = await generateText({
        model,
        prompt: userPrompt,
        temperature: 0.7,
      });

      return this.parseResponse(text);
    } catch (error: any) {
      // Log error without including potentially large data
      console.error("Food analysis error:", {
        message: error?.message,
        name: error?.name,
      });

      // Provide more specific error messages
      if (
        error?.message?.includes("API key") ||
        error?.message?.includes("API_KEY")
      ) {
        throw new Error(
          "Invalid API key. Please check your Gemini API key in Settings."
        );
      } else if (
        error?.message?.includes("quota") ||
        error?.message?.includes("limit")
      ) {
        throw new Error(
          "API quota exceeded. Please try again later or check your API limits."
        );
      } else if (
        error?.message?.includes("network") ||
        error?.message?.includes("Network") ||
        error?.name?.includes("Network")
      ) {
        throw new Error(
          "Network error. Please check your internet connection and try again."
        );
      }

      throw new Error("Failed to analyze food. Please try again.");
    }
  }

  /**
   * Parse AI response and extract JSON
   * @param text - AI response text
   * @returns FoodAnalysisResponse
   */
  private parseResponse(text: string): FoodAnalysisResponse {
    try {
      // Remove markdown code blocks if present
      let cleanText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "");

      // Try to find JSON object
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }

      const analysisResult: FoodAnalysisResponse = JSON.parse(jsonMatch[0]);

      // Validate and clamp health score
      analysisResult.health_score = Math.max(
        0,
        Math.min(100, analysisResult.health_score)
      );

      // Ensure health level is correct
      if (analysisResult.health_score >= 71) {
        analysisResult.health_level = "Healthy";
      } else if (analysisResult.health_score >= 41) {
        analysisResult.health_level = "Moderate";
      } else {
        analysisResult.health_level = "Unhealthy";
      }

      return analysisResult;
    } catch (error: any) {
      console.error("Parse error:", {
        message: error?.message,
        responseLength: text ? `${text.length} chars` : "N/A",
      });
      throw new Error("Failed to parse AI response");
    }
  }
}

// Singleton instance
let analyzerInstance: FoodAnalyzerService | null = null;

/**
 * Initialize the food analyzer service
 * @param apiKey - OpenAI API key
 * @param config - Optional configuration
 */
export function initializeFoodAnalyzer(
  apiKey: string,
  config?: Partial<AIServiceConfig>
) {
  analyzerInstance = new FoodAnalyzerService({ apiKey, ...config });
}

/**
 * Get the food analyzer instance
 * @returns FoodAnalyzerService instance
 */
export function getFoodAnalyzer(): FoodAnalyzerService {
  if (!analyzerInstance) {
    throw new Error(
      "FoodAnalyzerService not initialized. Call initializeFoodAnalyzer() first."
    );
  }
  return analyzerInstance;
}

export default FoodAnalyzerService;
