// Local-only storage for Zuzu Logic Park using AsyncStorage.
//
// Rules honored here:
//   - always return default data when storage is empty
//   - merge loaded storage with default data
//   - handle corrupted JSON safely (return defaults instead of crashing)
//   - never store personal data, names, age, location, or device identifiers
//   - no coins / bonus / jackpot / money wording in keys or values

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  createDefaultStats,
  mergeStats,
  recordTaskResult,
  resetStats,
} from "../utils/statsHelpers";
import {
  createDefaultProgress,
  mergeProgress,
  updateAchievements,
  resetProgress,
} from "../utils/progressHelpers";

const STORAGE_KEY = "zuzu_logic_park_app_data_v1";

export const DEFAULT_SETTINGS = {
  soundEnabled: true,
  defaultDifficulty: "easy",
  hintsEnabled: true,
  answerAnimationEnabled: true,
  theme: "zuzuPark",
};

// Builds a complete default data object.
export function createDefaultAppData() {
  return {
    stats: createDefaultStats(),
    progress: createDefaultProgress(),
    settings: { ...DEFAULT_SETTINGS },
  };
}

// Merges any stored settings with defaults.
function mergeSettings(stored) {
  const base = { ...DEFAULT_SETTINGS };
  if (!stored || typeof stored !== "object") return base;
  return {
    soundEnabled:
      typeof stored.soundEnabled === "boolean"
        ? stored.soundEnabled
        : base.soundEnabled,
    defaultDifficulty: ["easy", "medium", "hard"].includes(
      stored.defaultDifficulty
    )
      ? stored.defaultDifficulty
      : base.defaultDifficulty,
    hintsEnabled:
      typeof stored.hintsEnabled === "boolean"
        ? stored.hintsEnabled
        : base.hintsEnabled,
    answerAnimationEnabled:
      typeof stored.answerAnimationEnabled === "boolean"
        ? stored.answerAnimationEnabled
        : base.answerAnimationEnabled,
    // Only one theme is supported in this version.
    theme: "zuzuPark",
  };
}

// Merges a full stored payload with defaults.
function mergeAppData(stored) {
  if (!stored || typeof stored !== "object") return createDefaultAppData();
  return {
    stats: mergeStats(stored.stats),
    progress: mergeProgress(stored.progress),
    settings: mergeSettings(stored.settings),
  };
}

// Loads app data. Always resolves to a valid, fully-merged object.
export async function loadAppData() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultAppData();
    let parsed = null;
    try {
      parsed = JSON.parse(raw);
    } catch (parseError) {
      // Corrupted JSON: fall back to defaults instead of crashing.
      return createDefaultAppData();
    }
    return mergeAppData(parsed);
  } catch (e) {
    return createDefaultAppData();
  }
}

// Saves a full app data object (merged first for safety).
export async function saveAppData(data) {
  const safe = mergeAppData(data);
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
  } catch (e) {
    // Never crash the UI because a write failed.
  }
  return safe;
}

// Records a completed task result, updates achievements, and persists.
// Returns the new, merged app data.
export async function recordLearningTaskResult(result) {
  const data = await loadAppData();
  const newStats = recordTaskResult(data.stats, result);
  const newProgress = updateAchievements(data.progress, newStats);
  const newData = {
    stats: newStats,
    progress: newProgress,
    settings: data.settings,
  };
  return saveAppData(newData);
}

// Resets only the learning statistics.
export async function resetLearningStats() {
  const data = await loadAppData();
  const newData = {
    stats: resetStats(),
    progress: data.progress,
    settings: data.settings,
  };
  return saveAppData(newData);
}

// Resets only the achievement progress.
export async function resetLearningProgress() {
  const data = await loadAppData();
  const newData = {
    stats: data.stats,
    progress: resetProgress(),
    settings: data.settings,
  };
  return saveAppData(newData);
}

// Updates settings (merged with current/defaults) and persists.
export async function updateSettings(settings) {
  const data = await loadAppData();
  const newData = {
    stats: data.stats,
    progress: data.progress,
    settings: mergeSettings({ ...data.settings, ...settings }),
  };
  return saveAppData(newData);
}

// Clears all local data and restores defaults.
export async function clearAllData() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    // Ignore failures; we still return defaults below.
  }
  const defaults = createDefaultAppData();
  await saveAppData(defaults);
  return defaults;
}

export { STORAGE_KEY };
