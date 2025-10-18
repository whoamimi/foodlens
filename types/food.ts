/**
 * Food Analysis Types
 * Defines the structure for nutrition data and AI responses
 */

export interface EstimatedNutrients {
  calories: number;
  protein_g: number;
  fat_g: number;
  carbs_g: number;
  sugar_g: number;
  fiber_g: number;
  oil_type?: string;
}

export type HealthLevel = "Unhealthy" | "Moderate" | "Healthy";

export interface FoodAnalysisResponse {
  food_name: string;
  estimated_nutrients: EstimatedNutrients;
  health_score: number;
  health_level: HealthLevel;
  ai_summary: string;
  suggestion?: string;
}

export interface AnalysisError {
  error: string;
  message: string;
}

export interface ScanHistoryItem {
  id: string;
  foodName: string;
  imageUri: string;
  timestamp: number;
  healthScore: number;
  healthLevel: HealthLevel;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  sugar: number;
  fiber: number;
  aiSummary: string;
  suggestion?: string;
}
