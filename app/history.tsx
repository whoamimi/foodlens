/**
 * History Screen - Display past food scans
 * Shows all analyzed foods with filtering by health level
 */

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomAlert from "../components/CustomAlert";
import NutritionCard from "../components/NutritionCard";
import { useCustomAlert } from "../hooks/useCustomAlert";
import { FoodAnalysisResponse } from "../types/food";
import {
  deleteScanFromHistory,
  getFilteredScanHistory,
  ScanHistoryItem,
} from "../utils/storage";

type FilterType = "All" | "Healthy" | "Moderate" | "Unhealthy";

export default function HistoryScreen() {
  const { alertConfig, visible, showAlert, hideAlert } = useCustomAlert();
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("All");
  const [scans, setScans] = useState<ScanHistoryItem[]>([]);
  const [selectedScan, setSelectedScan] = useState<ScanHistoryItem | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadScans = () => {
      const history = getFilteredScanHistory(selectedFilter);
      setScans(history);
    };
    loadScans();
  }, [selectedFilter]);

  const loadScans = () => {
    const history = getFilteredScanHistory(selectedFilter);
    setScans(history);
  };

  const handleScanPress = (scan: ScanHistoryItem) => {
    setSelectedScan(scan);
    setModalVisible(true);
  };

  const handleDeleteScan = (scanId: string) => {
    showAlert(
      "Delete Scan",
      "Are you sure you want to delete this scan from your history?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteScanFromHistory(scanId);
            loadScans();
            setModalVisible(false);
          },
        },
      ]
    );
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="bg-background pt-12 pb-6 px-6">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="active:opacity-70"
          >
            <Ionicons name="arrow-back" size={28} color="#2e7d32" />
          </TouchableOpacity>
          <View style={{ width: 28 }} />
        </View>
        <Text className="text-4xl font-black text-foreground mb-1">
          Scan History
        </Text>
        <Text className="text-base text-muted-foreground font-medium">
          {scans.length} {scans.length === 1 ? "scan" : "scans"} in total
        </Text>
      </View>

      {/* Filter Buttons */}
      <View className="px-6 mb-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
        >
          {(["All", "Healthy", "Moderate", "Unhealthy"] as FilterType[]).map(
            (filter) => (
              <TouchableOpacity
                key={filter}
                onPress={() => setSelectedFilter(filter)}
                className={`px-5 py-2.5 rounded-full active:opacity-80 ${
                  selectedFilter === filter
                    ? "bg-primary shadow-md"
                    : "bg-card shadow-sm"
                }`}
                activeOpacity={0.9}
              >
                <Text
                  className={`font-bold text-sm ${
                    selectedFilter === filter
                      ? "text-primary-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            )
          )}
        </ScrollView>
      </View>

      {/* Scan List */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        {scans.length === 0 ? (
          <View className="items-center justify-center py-20">
            <View className="bg-muted/50 rounded-full w-32 h-32 items-center justify-center mb-6">
              <Ionicons name="file-tray-outline" size={64} color="#6d4c41" />
            </View>
            <Text className="text-foreground text-xl font-bold mb-2">
              No scans yet
            </Text>
            <Text className="text-muted-foreground text-sm font-medium text-center px-8">
              Start analyzing food to build your history
            </Text>
          </View>
        ) : (
          scans.map((scan) => (
            <TouchableOpacity
              key={scan.id}
              onPress={() => handleScanPress(scan)}
              className="bg-card rounded-3xl mb-4 overflow-hidden border border-border active:opacity-80"
              activeOpacity={0.9}
            >
              <View className="flex-row items-center p-4">
                {/* Food Image */}
                <View className="w-24 h-24 rounded-2xl bg-muted overflow-hidden border border-border">
                  <Image
                    source={{ uri: scan.imageUri }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>

                {/* Food Info */}
                <View className="flex-1 ml-4">
                  <Text
                    className="text-lg font-black text-foreground mb-1"
                    numberOfLines={2}
                  >
                    {scan.foodName}
                  </Text>
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="time-outline" size={14} color="#6d4c41" />
                    <Text className="text-xs text-muted-foreground font-medium ml-1">
                      {formatDate(scan.timestamp)} •{" "}
                      {formatTime(scan.timestamp)}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <View
                      className={`px-3 py-1.5 rounded-full ${
                        scan.healthLevel === "Healthy"
                          ? "bg-primary/10"
                          : scan.healthLevel === "Moderate"
                          ? "bg-yellow-100"
                          : "bg-red-100"
                      }`}
                    >
                      <Text
                        className={`font-bold text-xs ${
                          scan.healthLevel === "Healthy"
                            ? "text-primary"
                            : scan.healthLevel === "Moderate"
                            ? "text-yellow-700"
                            : "text-red-700"
                        }`}
                      >
                        {scan.healthLevel}
                      </Text>
                    </View>
                    <Text className="text-muted-foreground text-xs font-medium">
                      {scan.calories} cal
                    </Text>
                  </View>
                </View>

                {/* Arrow */}
                <Ionicons name="chevron-forward" size={24} color="#6d4c41" />
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Detail Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        {selectedScan && (
          <View className="flex-1 bg-background">
            {/* Modal Header */}
            <View className="bg-background pt-12 pb-4 px-6">
              <View className="flex-row items-center justify-between mb-4">
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  className="active:opacity-70"
                >
                  <Ionicons name="close-circle" size={36} color="#6d4c41" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteScan(selectedScan.id)}
                  className="active:opacity-70"
                >
                  <Ionicons name="trash-outline" size={28} color="#c62828" />
                </TouchableOpacity>
              </View>
              <Text className="text-3xl font-black text-foreground mb-1">
                Scan Details
              </Text>
              <View className="flex-row items-center">
                <Ionicons name="time-outline" size={14} color="#6d4c41" />
                <Text className="text-sm text-muted-foreground font-medium ml-1">
                  {formatDate(selectedScan.timestamp)} •{" "}
                  {formatTime(selectedScan.timestamp)}
                </Text>
              </View>
            </View>

            <ScrollView
              contentContainerStyle={{
                paddingHorizontal: 24,
                paddingBottom: 30,
              }}
              showsVerticalScrollIndicator={false}
            >
              {/* Food Image */}
              <View className="mb-6 overflow-hidden rounded-3xl bg-muted shadow-lg border border-border-light">
                <Image
                  source={{ uri: selectedScan.imageUri }}
                  className="w-full h-80"
                  resizeMode="cover"
                />
              </View>

              {/* Food Name & Health Score */}
              <View className="mb-6">
                <Text className="text-3xl font-black text-foreground mb-4">
                  {selectedScan.foodName}
                </Text>

                <View className="flex-row items-center gap-3">
                  <View
                    className={`px-4 py-2 rounded-full ${
                      selectedScan.healthLevel === "Healthy"
                        ? "bg-primary/10"
                        : selectedScan.healthLevel === "Moderate"
                        ? "bg-yellow-100"
                        : "bg-red-100"
                    }`}
                  >
                    <View className="flex-row items-center">
                      <Ionicons
                        name={
                          selectedScan.healthLevel === "Healthy"
                            ? "checkmark-circle"
                            : selectedScan.healthLevel === "Moderate"
                            ? "warning"
                            : "close-circle"
                        }
                        size={20}
                        color={
                          selectedScan.healthLevel === "Healthy"
                            ? "#2e7d32"
                            : selectedScan.healthLevel === "Moderate"
                            ? "#a16207"
                            : "#991b1b"
                        }
                      />
                      <Text
                        className={`font-bold text-sm ml-1 ${
                          selectedScan.healthLevel === "Healthy"
                            ? "text-primary"
                            : selectedScan.healthLevel === "Moderate"
                            ? "text-yellow-700"
                            : "text-red-700"
                        }`}
                      >
                        {selectedScan.healthLevel}
                      </Text>
                    </View>
                  </View>

                  <View className="bg-card px-4 py-2 rounded-full shadow-sm border border-border-light">
                    <View className="flex-row items-center">
                      <Text className="text-foreground font-bold text-sm mr-1">
                        Score:
                      </Text>
                      <Text className="text-primary font-black text-lg">
                        {selectedScan.healthScore}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Nutrition Information */}
              <NutritionCard
                analysis={
                  {
                    food_name: selectedScan.foodName,
                    estimated_nutrients: {
                      calories: selectedScan.calories,
                      protein_g: selectedScan.protein,
                      fat_g: selectedScan.fat,
                      carbs_g: selectedScan.carbs,
                      sugar_g: selectedScan.sugar,
                      fiber_g: selectedScan.fiber,
                    },
                    health_score: selectedScan.healthScore,
                    health_level: selectedScan.healthLevel,
                    ai_summary: selectedScan.aiSummary,
                    suggestion: selectedScan.suggestion,
                  } as FoodAnalysisResponse
                }
              />
            </ScrollView>
          </View>
        )}
      </Modal>

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
