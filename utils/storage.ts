/**
 * Storage Service using MMKV
 * Handles local storage for app usage tracking and scan history
 */

import { Platform } from "react-native";
import { MMKV } from "react-native-mmkv";

// Provide a simple in-memory fallback that mimics the MMKV interface
class MemoryStorage {
  private store = new Map<string, string | number | boolean>();

  set(key: string, value: string | number | boolean) {
    this.store.set(key, value);
  }
  getString(key: string) {
    const v = this.store.get(key);
    return typeof v === "string" ? v : undefined;
  }
  getNumber(key: string) {
    const v = this.store.get(key);
    return typeof v === "number" ? v : undefined;
  }
  getBoolean(key: string) {
    const v = this.store.get(key);
    return typeof v === "boolean" ? v : undefined;
  }
  delete(key: string) {
    this.store.delete(key);
  }
  clearAll() {
    this.store.clear();
  }
}

// Initialize storage with safe fallback for web/old-arch/dev-client-mismatch
export const storage = (() => {
  // MMKV is not supported on web; also guard for environments without TurboModules
  if (Platform.OS === "web") {
    return new MemoryStorage();
  }
  try {
    const mmkvInstance = new MMKV({
      id: "foodlens-storage",
      encryptionKey: "foodlens-secure-key-2024",
    });

    // Test MMKV to verify it's working
    console.log("🔥 MMKV Storage Initialized Successfully!");
    mmkvInstance.set("mmkv_test_key", "MMKV is working!");
    const testValue = mmkvInstance.getString("mmkv_test_key");
    console.log("✅ MMKV Test Read:", testValue);
    mmkvInstance.delete("mmkv_test_key");
    console.log("🗑️ MMKV Test Cleanup Complete");

    return mmkvInstance;
  } catch (e) {
    console.warn(
      "MMKV unavailable, falling back to in-memory storage. Cause:",
      e
    );
    return new MemoryStorage();
  }
})();

// Storage Keys
const KEYS = {
  APP_USAGE_COUNT: "app_usage_count",
  SCAN_HISTORY: "scan_history",
  IS_LOGGED_IN: "is_logged_in",
  USER_API_KEY: "user_api_key",
  FIRST_LAUNCH: "first_launch",
  LAST_SCAN_DATE: "last_scan_date",
  ONBOARDING_COMPLETED: "onboarding_completed",
};

/**
 * App Usage Tracking
 */
export const getUsageCount = (): number => {
  const count = storage.getNumber(KEYS.APP_USAGE_COUNT);
  return count ?? 0;
};

export const incrementUsageCount = (): number => {
  const currentCount = getUsageCount();
  const newCount = currentCount + 1;
  storage.set(KEYS.APP_USAGE_COUNT, newCount);
  return newCount;
};

export const resetUsageCount = (): void => {
  storage.set(KEYS.APP_USAGE_COUNT, 0);
};

export const hasReachedUsageLimit = (): boolean => {
  const isLoggedIn = getIsLoggedIn();
  if (isLoggedIn) return false;

  const count = getUsageCount();
  return count >= 2;
};

export const getRemainingScans = (): number => {
  const isLoggedIn = getIsLoggedIn();
  if (isLoggedIn) return Infinity;

  const count = getUsageCount();
  return Math.max(0, 2 - count);
};

/**
 * Login Status
 */
export const getIsLoggedIn = (): boolean => {
  const isLoggedIn = storage.getBoolean(KEYS.IS_LOGGED_IN);
  return isLoggedIn ?? false;
};

export const setIsLoggedIn = (value: boolean): void => {
  storage.set(KEYS.IS_LOGGED_IN, value);
  if (value) {
    // Reset usage count when user logs in
    resetUsageCount();
  }
};

/**
 * API Key Storage
 */
export const saveApiKey = (apiKey: string): void => {
  storage.set(KEYS.USER_API_KEY, apiKey);
};

export const getApiKey = (): string | undefined => {
  return storage.getString(KEYS.USER_API_KEY);
};

export const clearApiKey = (): void => {
  storage.delete(KEYS.USER_API_KEY);
};

/**
 * First Launch Detection
 */
export const isFirstLaunch = (): boolean => {
  const hasLaunched = storage.getBoolean(KEYS.FIRST_LAUNCH);
  if (hasLaunched === undefined) {
    storage.set(KEYS.FIRST_LAUNCH, true);
    return true;
  }
  return false;
};

export const setFirstLaunchComplete = (): void => {
  storage.set(KEYS.FIRST_LAUNCH, false);
};

/**
 * Scan History Management
 */
export interface ScanHistoryItem {
  id: string;
  foodName: string;
  imageUri: string;
  timestamp: number;
  healthScore: number;
  healthLevel: "Healthy" | "Moderate" | "Unhealthy";
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  sugar: number;
  fiber: number;
  aiSummary: string;
  suggestion?: string;
}

export const getScanHistory = (): ScanHistoryItem[] => {
  try {
    const historyJson = storage.getString(KEYS.SCAN_HISTORY);
    if (!historyJson) return [];
    return JSON.parse(historyJson);
  } catch (error) {
    console.error("Error reading scan history:", error);
    return [];
  }
};

export const addScanToHistory = (scan: ScanHistoryItem): void => {
  try {
    const history = getScanHistory();
    // Add new scan to the beginning of the array
    history.unshift(scan);
    // Keep only the last 100 scans to avoid storage bloat
    const trimmedHistory = history.slice(0, 100);
    storage.set(KEYS.SCAN_HISTORY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error("Error saving scan to history:", error);
  }
};

export const deleteScanFromHistory = (scanId: string): void => {
  try {
    const history = getScanHistory();
    const updatedHistory = history.filter((scan) => scan.id !== scanId);
    storage.set(KEYS.SCAN_HISTORY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error("Error deleting scan from history:", error);
  }
};

export const clearScanHistory = (): void => {
  storage.delete(KEYS.SCAN_HISTORY);
};

export const getFilteredScanHistory = (
  filter: "All" | "Healthy" | "Moderate" | "Unhealthy"
): ScanHistoryItem[] => {
  const history = getScanHistory();
  if (filter === "All") return history;
  return history.filter((scan) => scan.healthLevel === filter);
};

/**
 * Last Scan Date Tracking
 */
export const getLastScanDate = (): Date | null => {
  const timestamp = storage.getNumber(KEYS.LAST_SCAN_DATE);
  return timestamp ? new Date(timestamp) : null;
};

export const setLastScanDate = (date: Date = new Date()): void => {
  storage.set(KEYS.LAST_SCAN_DATE, date.getTime());
};

/**
 * Clear All Data
 */
export const clearAllData = (): void => {
  storage.clearAll();
};

/**
 * Get Storage Stats
 */
export const getStorageStats = () => {
  const history = getScanHistory();
  return {
    usageCount: getUsageCount(),
    remainingScans: getRemainingScans(),
    isLoggedIn: getIsLoggedIn(),
    totalScans: history.length,
    lastScanDate: getLastScanDate(),
    hasApiKey: !!getApiKey(),
  };
};

/**
 * Onboarding Completion Tracking
 */
export const isOnboardingCompleted = (): boolean => {
  const completed = storage.getBoolean(KEYS.ONBOARDING_COMPLETED);
  return completed ?? false;
};

export const setOnboardingCompleted = (): void => {
  storage.set(KEYS.ONBOARDING_COMPLETED, true);
};
