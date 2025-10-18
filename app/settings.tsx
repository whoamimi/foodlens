/**
 * Settings Screen - Manage app settings and storage
 */

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CustomAlert from "../components/CustomAlert";
import { useCustomAlert } from "../hooks/useCustomAlert";
import { initializeFoodAnalyzer } from "../services/foodAnalyzer";
import {
  clearAllData,
  clearApiKey,
  clearScanHistory,
  getStorageStats,
  saveApiKey,
} from "../utils/storage";

export default function SettingsScreen() {
  const { alertConfig, visible, showAlert, hideAlert } = useCustomAlert();
  const [stats, setStats] = useState({
    usageCount: 0,
    remainingScans: 2,
    isLoggedIn: false,
    totalScans: 0,
    lastScanDate: null as Date | null,
    hasApiKey: false,
  });
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    const storageStats = getStorageStats();
    setStats(storageStats);
  };

  const handleClearHistory = () => {
    showAlert(
      "Clear History",
      "Are you sure you want to delete all scan history? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            clearScanHistory();
            loadStats();
            showAlert("Success", "Scan history cleared successfully");
          },
        },
      ]
    );
  };

  const handleSaveApiKey = () => {
    if (!apiKeyInput.trim()) {
      showAlert("Error", "Please enter a valid API key");
      return;
    }

    try {
      saveApiKey(apiKeyInput.trim());
      initializeFoodAnalyzer(apiKeyInput.trim());
      setShowApiKeyModal(false);
      setApiKeyInput("");
      loadStats();
      showAlert(
        "Success",
        "API key saved successfully! You can now use unlimited scans."
      );
    } catch {
      showAlert("Error", "Failed to save API key. Please try again.");
    }
  };

  const handleResetApiKey = () => {
    showAlert(
      "Reset API Key",
      "Are you sure you want to remove your API key? You will need to enter it again.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            clearApiKey();
            loadStats();
            showAlert("Success", "API key removed successfully");
          },
        },
      ]
    );
  };

  const handleClearAllData = () => {
    showAlert(
      "Clear All Data",
      "This will delete ALL data including history, API key, and usage statistics. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Everything",
          style: "destructive",
          onPress: () => {
            clearAllData();
            loadStats();
            showAlert("Success", "All data cleared successfully");
          },
        },
      ]
    );
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Never";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
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
        <Text className="text-4xl font-black text-foreground">Settings</Text>
        <Text className="text-base text-muted-foreground font-medium mt-1">
          Manage your app preferences
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Storage Stats */}
        <View className="bg-card rounded-3xl p-6 mb-4 shadow-lg border border-border-light">
          <View className="flex-row items-center mb-5">
            <View className="bg-primary/10 rounded-full w-12 h-12 items-center justify-center mr-3">
              <Ionicons name="stats-chart" size={24} color="#2e7d32" />
            </View>
            <Text className="text-xl font-black text-foreground">
              Statistics
            </Text>
          </View>

          <View className="gap-3">
            <View className="flex-row justify-between items-center py-3">
              <Text className="text-muted-foreground font-medium">
                Total Scans
              </Text>
              <Text className="text-foreground font-bold text-lg">
                {stats.totalScans}
              </Text>
            </View>

            <View className="flex-row justify-between items-center py-3">
              <Text className="text-muted-foreground font-medium">
                Remaining Credits
              </Text>
              <Text className="text-foreground font-bold text-lg">
                {stats.remainingScans === Infinity ? "∞" : stats.remainingScans}
              </Text>
            </View>

            <View className="flex-row justify-between items-center py-3">
              <Text className="text-muted-foreground font-medium">
                Last Scan
              </Text>
              <Text className="text-foreground font-semibold text-sm">
                {formatDate(stats.lastScanDate)}
              </Text>
            </View>

            <View className="flex-row justify-between items-center py-3">
              <Text className="text-muted-foreground font-medium">
                API Key Status
              </Text>
              <View
                className={`px-3 py-1.5 rounded-full ${
                  stats.hasApiKey ? "bg-primary/10" : "bg-muted"
                }`}
              >
                <Text
                  className={`font-bold text-xs ${
                    stats.hasApiKey ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {stats.hasApiKey ? "✓ Active" : "Not Set"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* API Key Management Section */}
        <View className="bg-card rounded-3xl p-6 mb-4 shadow-lg border border-border-light">
          <View className="flex-row items-center mb-5">
            <View className="bg-primary/10 rounded-full w-12 h-12 items-center justify-center mr-3">
              <Ionicons name="key" size={24} color="#2e7d32" />
            </View>
            <Text className="text-xl font-black text-foreground">API Key</Text>
          </View>

          {stats.hasApiKey ? (
            <View>
              <View className="bg-primary/10 rounded-2xl p-4 mb-3">
                <View className="flex-row items-center mb-2">
                  <Ionicons name="checkmark-circle" size={22} color="#2e7d32" />
                  <Text className="text-foreground font-bold ml-2 text-base">
                    Unlimited Scans Active
                  </Text>
                </View>
                <Text className="text-muted-foreground text-sm font-medium">
                  You&apos;re using your own Gemini API key
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setShowApiKeyModal(true)}
                className="bg-secondary rounded-full py-4 px-6 flex-row items-center justify-center active:opacity-80 mb-3"
                activeOpacity={0.9}
              >
                <Ionicons name="create-outline" size={22} color="#2e7d32" />
                <Text className="text-secondary-foreground font-semibold text-base ml-2">
                  Update API Key
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <View className="bg-card rounded-2xl p-5 mb-4 shadow-sm border border-border-light">
                <View className="flex-row items-start mb-3">
                  <Text className="text-2xl mr-2">🔑</Text>
                  <View className="flex-1">
                    <Text className="text-foreground font-bold text-base mb-1">
                      Get Unlimited Scans
                    </Text>
                    <Text className="text-muted-foreground text-sm font-medium mb-3">
                      Add your free Gemini API key for unlimited access
                    </Text>
                    <Text className="text-xs text-muted-foreground leading-5">
                      • Visit{" "}
                      <Text className="font-bold text-primary">
                        aistudio.google.com/api-keys
                      </Text>
                      {"\n"}• Sign in with Google{"\n"}• Generate free API key
                      {"\n"}• Add it below
                    </Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setShowApiKeyModal(true)}
                className="bg-primary rounded-full items-center active:opacity-90 mb-3 shadow-lg py-5 px-2"
                activeOpacity={0.8}
              >
                <Text className="text-primary-foreground font-black text-1xl tracking-wide">
                  Add API Key
                </Text>
              </TouchableOpacity>

              <View className="bg-muted/50 rounded-2xl p-4">
                <Text className="text-muted-foreground text-xs font-medium text-center">
                  ⚠️ {stats.remainingScans} free credit
                  {stats.remainingScans === 1 ? "" : "s"} remaining
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Data Management */}
        <View className="bg-card rounded-3xl p-6 mb-4 shadow-lg border border-border-light">
          <View className="flex-row items-center mb-5">
            <View className="bg-primary/10 rounded-full w-12 h-12 items-center justify-center mr-3">
              <Ionicons name="server-outline" size={24} color="#2e7d32" />
            </View>
            <Text className="text-xl font-black text-foreground">
              Data & Privacy
            </Text>
          </View>

          <View className="gap-3">
            <TouchableOpacity
              onPress={handleClearHistory}
              className="bg-card rounded-2xl px-5 py-4 active:opacity-80 shadow-sm border border-border-light"
              activeOpacity={0.9}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-foreground font-bold text-base mb-1">
                    Clear Scan History
                  </Text>
                  <Text className="text-muted-foreground text-sm font-medium">
                    Remove all saved food scans
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#6d4c41" />
              </View>
            </TouchableOpacity>

            {stats.hasApiKey && (
              <TouchableOpacity
                onPress={handleResetApiKey}
                className="bg-card rounded-2xl px-5 py-4 active:opacity-80 shadow-sm border border-border-light"
                activeOpacity={0.9}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-foreground font-bold text-base mb-1">
                      Remove API Key
                    </Text>
                    <Text className="text-muted-foreground text-sm font-medium">
                      Delete saved Gemini API key
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#6d4c41" />
                </View>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={handleClearAllData}
              className="bg-card rounded-2xl px-5 py-4 active:opacity-80 shadow-sm border border-border-light"
              activeOpacity={0.9}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-destructive font-bold text-base mb-1">
                    Clear All Data
                  </Text>
                  <Text className="text-muted-foreground text-sm font-medium">
                    Delete everything (cannot be undone)
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#c62828" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Info */}
        <View className="bg-card rounded-3xl p-6 mb-4 shadow-lg border border-border-light">
          <View className="flex-row items-center mb-5">
            <View className="bg-primary/10 rounded-full w-12 h-12 items-center justify-center mr-3">
              <Ionicons name="information-circle" size={24} color="#2e7d32" />
            </View>
            <Text className="text-xl font-black text-foreground">
              About Foodlens
            </Text>
          </View>

          <View className="gap-3">
            <View className="flex-row justify-between items-center py-3">
              <Text className="text-muted-foreground font-medium">Version</Text>
              <Text className="text-foreground font-bold">1.0.0</Text>
            </View>
          </View>

          <View className="bg-muted/50 rounded-2xl p-4 mt-4">
            <Text className="text-muted-foreground text-sm font-medium text-center">
              🔒 All data is stored securely on your device
            </Text>
          </View>

          <View className="items-center mt-4">
            <Text className="text-muted-foreground text-sm font-medium">
              Made by Tejas Nasre
            </Text>
          </View>
        </View>

        {/* Powered By */}
        <View className="items-center mt-2">
          <Text className="text-sm text-muted-foreground font-medium">
            Powered by Google Gemini AI
          </Text>
        </View>
      </ScrollView>

      {/* API Key Input Modal */}
      <Modal
        visible={showApiKeyModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowApiKeyModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-background rounded-t-3xl p-6 pb-10">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-6">
              <View>
                <Text className="text-3xl font-black text-foreground mb-1">
                  {stats.hasApiKey ? "Update" : "Add"} API Key
                </Text>
                <Text className="text-sm text-muted-foreground font-medium">
                  Get unlimited scans for free
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setShowApiKeyModal(false);
                  setApiKeyInput("");
                }}
                className="active:opacity-70"
              >
                <Ionicons name="close-circle" size={36} color="#6d4c41" />
              </TouchableOpacity>
            </View>

            {/* Input Section */}
            <View className="mb-5">
              <Text className="text-foreground font-bold mb-3 text-base">
                Gemini API Key
              </Text>
              <TextInput
                className="bg-card rounded-2xl px-5 py-4 text-base text-foreground font-medium shadow-sm border border-border-light"
                placeholder="Paste your API key here..."
                value={apiKeyInput}
                onChangeText={setApiKeyInput}
                secureTextEntry
                autoCapitalize="none"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            {/* Info Box */}
            <View className="bg-card rounded-2xl p-5 mb-6 shadow-sm border border-border-light">
              <View className="flex-row items-start mb-3">
                <Text className="text-2xl mr-2">ℹ️</Text>
                <View className="flex-1">
                  <Text className="text-foreground font-bold text-base mb-2">
                    How to get your free API key
                  </Text>
                  <Text className="text-muted-foreground text-sm font-medium leading-5">
                    1. Visit{" "}
                    <Text className="font-bold text-primary">
                      aistudio.google.com/api-keys
                    </Text>
                    {"\n"}
                    2. Sign in with your Google account{"\n"}
                    3. Click &quot;Get API Key&quot;{"\n"}
                    4. Copy and paste it above
                  </Text>
                </View>
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              onPress={handleSaveApiKey}
              className="bg-primary rounded-full py-5 px-6 items-center active:opacity-90 mb-4 shadow-lg"
              activeOpacity={0.8}
            >
              <Text className="text-primary-foreground font-black text-1xl tracking-wide">
                Save API Key
              </Text>
            </TouchableOpacity>

            {/* Security Notice */}
            <View className="bg-muted/50 rounded-2xl p-4">
              <Text className="text-muted-foreground text-xs font-medium text-center">
                🔒 Your API key is stored securely on your device
              </Text>
            </View>
          </View>
        </View>
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
