/**
 * Storage Service using AsyncStorage
 * Handles local storage for app usage tracking and scan history
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

// Storage wrapper to provide synchronous-like interface with AsyncStorage
class StorageWrapper {
  private cache = new Map<string, string | number | boolean>();
  private initialized = false;

  async init() {
    if (this.initialized) return;
    try {
      const keys = await AsyncStorage.getAllKeys();
      const items = await AsyncStorage.multiGet(keys);
      items.forEach(([key, value]) => {
        if (value !== null) {
          try {
            const parsed = JSON.parse(value);
            this.cache.set(key, parsed);
          } catch {
            this.cache.set(key, value);
          }
        }
      });
      this.initialized = true;
    } catch (error) {
      console.error("❌ Error initializing AsyncStorage:", error);
    }
  }

  set(key: string, value: string | number | boolean) {
    this.cache.set(key, value);
    AsyncStorage.setItem(key, JSON.stringify(value)).catch((error) => {
      console.error(`Error saving ${key}:`, error);
    });
  }

  getString(key: string): string | undefined {
    const v = this.cache.get(key);
    return typeof v === "string" ? v : undefined;
  }

  getNumber(key: string): number | undefined {
    const v = this.cache.get(key);
    return typeof v === "number" ? v : undefined;
  }

  getBoolean(key: string): boolean | undefined {
    const v = this.cache.get(key);
    return typeof v === "boolean" ? v : undefined;
  }

  delete(key: string) {
    this.cache.delete(key);
    AsyncStorage.removeItem(key).catch((error) => {
      console.error(`Error deleting ${key}:`, error);
    });
  }

  clearAll() {
    this.cache.clear();
    AsyncStorage.clear().catch((error) => {
      console.error("Error clearing storage:", error);
    });
  }
}

// Initialize storage
export const storage = new StorageWrapper();

// Initialize the storage on module load
storage.init();

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
  // If user has their own API key, no limit
  const hasApiKey = !!getApiKey();
  if (hasApiKey) return false;

  const count = getUsageCount();
  return count >= 2;
};

export const getRemainingScans = (): number => {
  // If user has their own API key, unlimited scans
  const hasApiKey = !!getApiKey();
  if (hasApiKey) return Infinity;

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
