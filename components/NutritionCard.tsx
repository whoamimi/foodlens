/**
 * Nutrition Card Component
 * Displays food analysis results with beautiful health score visualization
 */

import React from "react";
import { ScrollView, Text, View } from "react-native";
import { FoodAnalysisResponse } from "../types/food";

interface NutritionCardProps {
  analysis: FoodAnalysisResponse;
}

export default function NutritionCard({ analysis }: NutritionCardProps) {
  const {
    food_name,
    estimated_nutrients,
    health_score,
    health_level,
    ai_summary,
    suggestion,
  } = analysis;

  // Determine health color and emoji with modern colors
  const getHealthBgColor = () => {
    if (health_score >= 71) return "bg-chart-1";
    if (health_score >= 41) return "bg-chart-2";
    return "bg-destructive";
  };

  const getHealthEmoji = () => {
    if (health_score >= 71) return "✅";
    if (health_score >= 41) return "⚠️";
    return "❌";
  };

  return (
    <ScrollView className="flex-1 card">
      {/* Food Name Header with gradient */}
      <View className="mb-6 items-center">
        <Text className="text-4xl mb-3">🍴</Text>
        <Text className="text-3xl font-extrabold text-foreground text-center font-sans">
          {food_name}
        </Text>
      </View>

      {/* Health Score Section with modern design */}
      <View className="mb-8 items-center">
        <View className="relative w-48 h-48 items-center justify-center">
          {/* Circular Progress Background */}
          <View className="absolute w-full h-full rounded-full bg-muted" />

          {/* Circular Progress Fill with gradient effect */}
          <View
            className={`absolute w-full h-full rounded-full ${getHealthBgColor()}`}
            style={{
              transform: [{ scale: health_score / 100 }],
              opacity: 0.2,
            }}
          />
          <View
            className={`absolute w-44 h-44 rounded-full ${getHealthBgColor()}`}
            style={{
              transform: [{ scale: health_score / 100 }],
              opacity: 0.3,
            }}
          />

          {/* Score Display */}
          <View className="items-center">
            <Text className="text-6xl font-black text-foreground font-sans">
              {health_score}
            </Text>
            <Text className="text-xl text-muted-foreground font-semibold font-sans">
              /100
            </Text>
          </View>
        </View>

        {/* Health Level Badge with gradient */}
        <View
          className={`mt-6 px-8 py-3 rounded-full ${getHealthBgColor()} shadow-xl`}
        >
          <Text className="text-white font-bold text-xl font-sans">
            {getHealthEmoji()} {health_level}
          </Text>
        </View>
      </View>

      {/* AI Summary with gradient background */}
      <View className="mb-6 bg-gradient-to-br from-primary/10 to-secondary/10 p-5 rounded-2xl shadow-lg border border-border-light">
        <Text className="text-base font-bold text-primary mb-3 font-sans">
          💡 AI Insight
        </Text>
        <Text className="text-base text-muted-foreground leading-6 font-medium font-sans">
          {ai_summary}
        </Text>
      </View>

      {/* Nutrition Facts with modern card design */}
      <View className="mb-6">
        <Text className="text-2xl font-extrabold text-foreground mb-4 flex-row items-center font-sans">
          📊 Nutrition Facts
        </Text>
        <View className="bg-card rounded-2xl p-4 shadow-xl border border-border-light">
          <NutrientRow
            label="Calories"
            value={`${estimated_nutrients.calories} kcal`}
          />
          <NutrientRow
            label="Protein"
            value={`${estimated_nutrients.protein_g} g`}
          />
          <NutrientRow label="Fat" value={`${estimated_nutrients.fat_g} g`} />
          <NutrientRow
            label="Carbs"
            value={`${estimated_nutrients.carbs_g} g`}
          />
          <NutrientRow
            label="Sugar"
            value={`${estimated_nutrients.sugar_g} g`}
          />
          <NutrientRow
            label="Fiber"
            value={`${estimated_nutrients.fiber_g} g`}
          />
          {estimated_nutrients.oil_type && (
            <NutrientRow
              label="Oil Type"
              value={estimated_nutrients.oil_type}
            />
          )}
        </View>
      </View>

      {/* Suggestion with beautiful gradient */}
      {suggestion && (
        <View className="bg-gradient-to-br from-accent/20 to-secondary/20 p-5 rounded-2xl shadow-lg border border-border-light">
          <Text className="text-base font-bold text-accent-foreground mb-3 font-sans">
            🌱 Healthier Alternative
          </Text>
          <Text className="text-base text-muted-foreground leading-6 font-medium font-sans">
            {suggestion}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

interface NutrientRowProps {
  label: string;
  value: string;
}

function NutrientRow({ label, value }: NutrientRowProps) {
  return (
    <View className="flex-row justify-between items-center py-3">
      <Text className="text-base text-muted-foreground font-semibold font-sans">
        {label}
      </Text>
      <Text className="text-base text-foreground font-bold font-sans">
        {value}
      </Text>
    </View>
  );
}
