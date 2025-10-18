// Environment configuration
// Create a .env file in the root directory with your API key:
// EXPO_PUBLIC_GEMINI_API_KEY=your-gemini-api-key-here

export const config = {
  // Gemini AI Configuration
  // In Expo, environment variables must be prefixed with EXPO_PUBLIC_
  GEMINI_API_KEY: process.env.EXPO_PUBLIC_GEMINI_API_KEY || "",
  GEMINI_MODEL: "gemini-2.0-flash-exp", // or 'gemini-1.5-flash', 'gemini-1.5-pro'

  // App Configuration
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  IMAGE_QUALITY: 0.8,
  MAX_TOKENS: 2000,
  TEMPERATURE: 0.7,
};

export default config;
