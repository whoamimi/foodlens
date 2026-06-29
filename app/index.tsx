import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomAlert from "../components/CustomAlert";
import NutritionCard from "../components/NutritionCard";
import WelcomeScreen from "../components/WelcomeScreen";
import { config } from "../config/config";
import { useCustomAlert } from "../hooks/useCustomAlert";
import {
  getFoodAnalyzer,
  initializeFoodAnalyzer,
} from "../services/foodAnalyzer";
import { FoodAnalysisResponse } from "../types/food";
import {
  addScanToHistory,
  getApiKey,
  getRemainingScans,
  hasReachedUsageLimit,
  incrementUsageCount,
  isOnboardingCompleted,
  ScanHistoryItem,
  setOnboardingCompleted,
} from "../utils/storage";

export default function Index() {
  const { alertConfig, visible, showAlert, hideAlert } = useCustomAlert();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<FoodAnalysisResponse | null>(null);
  const [showWelcome, setShowWelcome] = useState(!isOnboardingCompleted());
  const [remainingCredits, setRemainingCredits] = useState<number>(
    getRemainingScans()
  );

  // Check for stored API key on mount and update credits
  useEffect(() => {
    const storedApiKey = getApiKey();
    if (storedApiKey) {
      initializeFoodAnalyzer(storedApiKey);
    }
    setRemainingCredits(getRemainingScans());
  }, []);

  // Get the API key to use - user's key OR default key for free credits
  const getEffectiveApiKey = () => {
    const storedApiKey = getApiKey();

    // If user has their own key, use it
    if (storedApiKey) {
      return storedApiKey;
    }

    // Otherwise, use default key for free credits
    if (!hasReachedUsageLimit()) {
      return config.GEMINI_API_KEY;
    }

    return null;
  };

  const checkUsageLimit = (): boolean => {
    const storedApiKey = getApiKey();

    // If user has their own API key, no limit
    if (storedApiKey) {
      return true;
    }

    // Check if free credits are exhausted
    if (hasReachedUsageLimit()) {
      showAlert(
        "Free Credits Exhausted",
        "You've used your 2 free scans! Add your own free Gemini API key to continue. Get it at ai.google.dev - it's completely free!",
        [
          {
            text: "Get API Key",
            onPress: () => router.push("/settings"),
          },
          {
            text: "Learn More",
            onPress: () => {
              // Wait for current alert to close, then show the new one
              setTimeout(() => {
                showAlert(
                  "Why do I need an API key?",
                  "Google provides free API keys with generous limits (1500 requests/day). This keeps your data private. Get yours in 2 minutes at ai.google.dev!"
                );
              }, 400);
            },
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ]
      );
      return false;
    }

    return true;
  };

  // Request camera permissions
  const requestPermissions = async () => {
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
    const mediaStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus.status !== "granted" || mediaStatus.status !== "granted") {
      showAlert(
        "Permission Required",
        "Camera and photo library permissions are needed to analyze food images."
      );
      return false;
    }
    return true;
  };

  // Take photo with camera
  const takePhoto = async () => {
    // Check if API key exists
    if (!checkUsageLimit()) return;

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5, // Reduced from 0.8 to prevent large base64 strings
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setImageUri(result.assets[0].uri);
      analyzeImage(result.assets[0].base64, result.assets[0].uri);
    }
  };

  // Pick image from gallery
  const pickImage = async () => {
    // Check if API key exists
    if (!checkUsageLimit()) return;

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5, // Reduced from 0.8 to prevent large base64 strings
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setImageUri(result.assets[0].uri);
      analyzeImage(result.assets[0].base64, result.assets[0].uri);
    }
  };

  // Analyze image with AI
  const analyzeImage = async (base64: string, uri: string) => {
    setAnalyzing(true);
    setAnalysis(null);

    try {
      // Validate base64 size (limit to ~4MB to prevent issues)
      const base64SizeInMB = (base64.length * 3) / (4 * 1024 * 1024);

      if (base64SizeInMB > 4) {
        showAlert(
          "Image Too Large",
          `Image size is ${base64SizeInMB.toFixed(
            1
          )}MB. Please use a smaller image (max 4MB).`
        );
        setAnalyzing(false);
        return;
      }

      // Get the API key (user's key or default key for free credits)
      const apiKeyToUse = getEffectiveApiKey();

      if (!apiKeyToUse) {
        showAlert(
          "Free Credits Exhausted",
          "Please add your Gemini API key in Settings to continue.",
          [
            {
              text: "Go to Settings",
              onPress: () => router.push("/settings"),
            },
            {
              text: "Cancel",
              style: "cancel",
            },
          ]
        );
        setAnalyzing(false);
        return;
      }

      // Initialize with appropriate API key
      initializeFoodAnalyzer(apiKeyToUse);
      const analyzer = getFoodAnalyzer();
      const result = await analyzer.analyzeFoodImage(base64);
      setAnalysis(result);

      // Save to history and increment usage count (only for free credits)
      const scanItem: ScanHistoryItem = {
        id: Date.now().toString(),
        foodName: result.food_name,
        imageUri: uri,
        timestamp: Date.now(),
        healthScore: result.health_score,
        healthLevel: result.health_level,
        calories: result.estimated_nutrients.calories,
        protein: result.estimated_nutrients.protein_g,
        fat: result.estimated_nutrients.fat_g,
        carbs: result.estimated_nutrients.carbs_g,
        sugar: result.estimated_nutrients.sugar_g,
        fiber: result.estimated_nutrients.fiber_g,
        aiSummary: result.ai_summary,
        suggestion: result.suggestion,
      };
      addScanToHistory(scanItem);

      // Increment usage and update credits display (only if using free credits)
      if (!getApiKey()) {
        incrementUsageCount();
        setRemainingCredits(getRemainingScans());
      }
    } catch (error: any) {
      showAlert(
        "Analysis Failed",
        error.message || "Failed to analyze food image"
      );
    } finally {
      setAnalyzing(false);
    }
  };

  // Reset screen
  const reset = () => {
    setImageUri(null);
    setAnalysis(null);
  };

  // Welcome Screen
  if (showWelcome) {
    return (
      <WelcomeScreen
        onGetStarted={() => {
          setShowWelcome(false);
          setOnboardingCompleted();
        }}
      />
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* Top Bar */}
      <View className="bg-background pt-12 pb-4 px-6">
        <View className="flex-row items-center justify-between mb-3">
          {/* History Button */}
          <TouchableOpacity
            onPress={() => router.push("/history")}
            className="active:opacity-70"
          >
            <Ionicons name="time-outline" size={28} color="#2e7d32" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/settings")}
            className="active:opacity-70"
          >
            <Ionicons name="settings-outline" size={28} color="#6d4c41" />
          </TouchableOpacity>
        </View>

        {/* Credits Display - Only show if using free credits */}
        {!getApiKey() && (
          <View className="items-center">
            <View className="bg-primary/10 rounded-full px-4 py-2 border border-primary/20">
              <Text className="text-primary font-bold text-xs">
                ✨ {remainingCredits} Free Credits Left
              </Text>
            </View>
          </View>
        )}
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 30,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-8 mt-4">
          <Text className="text-4xl font-black text-foreground mb-2">
            Hi! I am Dewy :)
          </Text>
          <Text className="text-base text-muted-foreground font-medium"></Text>
        </View>

        {/* Main Content Area */}
        {!imageUri && !analyzing && !analysis ? (
          /* Upload Area */
          <View>
            <TouchableOpacity
              onPress={pickImage}
              className="bg-card border-2 border-dashed border-primary/30 rounded-3xl p-12 items-center active:opacity-80 mb-4"
              activeOpacity={0.9}
            >
              <View className="bg-primary/10 rounded-full w-24 h-24 items-center justify-center mb-6">
                <Ionicons
                  name="cloud-upload-outline"
                  size={48}
                  color="#2e7d32"
                />
              </View>
              <Text className="text-foreground text-lg font-bold text-center mb-1">
                Tap to upload or
              </Text>
              <Text className="text-foreground text-lg font-bold text-center">
                take a photo
              </Text>
            </TouchableOpacity>

            {/* Camera Button */}
            <TouchableOpacity
              onPress={takePhoto}
              className="bg-secondary rounded-full py-4 px-6 flex-row items-center justify-center active:opacity-80 mb-8"
              activeOpacity={0.9}
            >
              <Ionicons name="camera-outline" size={22} color="#2e7d32" />
              <Text className="text-secondary-foreground font-semibold text-base ml-2">
                Open Camera
              </Text>
            </TouchableOpacity>

            {/* Info Cards */}
            <View className="gap-3">
              {/* AI Feature */}
              <View className="bg-card flex-row items-center rounded-2xl px-5 py-4 shadow-sm border border-border-light">
                <View className="bg-primary/10 rounded-full w-12 h-12 items-center justify-center mr-4">
                  <Ionicons name="sparkles" size={24} color="#2e7d32" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-bold text-foreground mb-0.5">
                    AI-Powered Analysis
                  </Text>
                  <Text className="text-sm text-muted-foreground font-medium">
                    Instant nutrition insights
                  </Text>
                </View>
              </View>

              {/* Breakdown Feature */}
              <View className="bg-card flex-row items-center rounded-2xl px-5 py-4 shadow-sm border border-border-light">
                <View className="bg-primary/10 rounded-full w-12 h-12 items-center justify-center mr-4">
                  <Ionicons name="stats-chart" size={24} color="#2e7d32" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-bold text-foreground mb-0.5">
                    Detailed Breakdown
                  </Text>
                  <Text className="text-sm text-muted-foreground font-medium">
                    Calories, macros & more
                  </Text>
                </View>
              </View>

              {/* Health Score Feature */}
              <View className="bg-card flex-row items-center rounded-2xl px-5 py-4 shadow-sm border border-border-light">
                <View className="bg-primary/10 rounded-full w-12 h-12 items-center justify-center mr-4">
                  <Ionicons name="heart" size={24} color="#2e7d32" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-bold text-foreground mb-0.5">
                    Health Score
                  </Text>
                  <Text className="text-sm text-muted-foreground font-medium">
                    Track your wellness
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View>
            {/* Image Display */}
            {imageUri && (
              <View className="mb-6 overflow-hidden rounded-3xl bg-muted shadow-lg border border-border-light">
                <Image
                  source={{ uri: imageUri }}
                  className="w-full h-80"
                  resizeMode="cover"
                />
              </View>
            )}

            {/* Loading State */}
            {analyzing && (
              <View className="items-center py-12 bg-card rounded-3xl shadow-lg border border-border-light">
                <View className="bg-primary/10 rounded-full p-6 mb-4">
                  <ActivityIndicator size="large" color="#2e7d32" />
                </View>
                <Text className="text-foreground font-bold text-xl">
                  Analyzing your food...
                </Text>
                <Text className="text-muted-foreground text-sm mt-2">
                  This may take a few seconds
                </Text>
              </View>
            )}

            {/* Analysis Results */}
            {analysis && !analyzing && (
              <View className="mb-6">
                <NutritionCard analysis={analysis} />
              </View>
            )}

            {/* Action Buttons */}
            {!analyzing && (
              <View className="gap-3">
                <TouchableOpacity
                  onPress={pickImage}
                  className="bg-primary rounded-full py-4 px-6 flex-row items-center justify-center active:opacity-90 shadow-lg"
                  activeOpacity={0.8}
                >
                  <Ionicons name="images-outline" size={22} color="#ffffff" />
                  <Text className="text-primary-foreground font-semibold text-base ml-2">
                    Choose Another Photo
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={takePhoto}
                  className="bg-secondary rounded-full py-4 px-6 flex-row items-center justify-center active:opacity-80"
                  activeOpacity={0.9}
                >
                  <Ionicons name="camera-outline" size={22} color="#2e7d32" />
                  <Text className="text-secondary-foreground font-semibold text-base ml-2">
                    Take New Photo
                  </Text>
                </TouchableOpacity>

                {(imageUri || analysis) && (
                  <TouchableOpacity
                    onPress={reset}
                    className="mt-2 active:opacity-70"
                    activeOpacity={0.9}
                  >
                    <Text className="text-muted-foreground font-medium text-center text-sm">
                      Clear All
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Custom Alert */}
      {alertConfig && (
        <CustomAlert
          visible={visible}
          title={alertConfig.title}
          message={alertConfig.message}
          buttons={alertConfig.buttons}
          onClose={hideAlert}
        />
      )}
    </View>
  );
}
