// Progress + achievement helpers.
// Achievements are local learning markers only. They have no money value
// and never use coins, bonus, jackpot, or money wording.

import { getUnlockedAchievements } from "../data/achievementItems";

// Returns a fresh, valid progress object.
export function createDefaultProgress() {
  return {
    unlockedAchievementIds: [],
  };
}

// Merges stored progress with defaults to avoid crashes on missing data.
export function mergeProgress(stored) {
  const base = createDefaultProgress();
  if (!stored || typeof stored !== "object") return base;
  const ids = Array.isArray(stored.unlockedAchievementIds)
    ? stored.unlockedAchievementIds.filter((id) => typeof id === "string")
    : [];
  return { unlockedAchievementIds: ids };
}

// Recomputes unlocked achievements from stats and merges with any existing
// progress so previously earned badges are never lost.
export function updateAchievements(progress, stats) {
  const current = mergeProgress(progress);
  const earnedNow = getUnlockedAchievements(stats);
  const set = {};
  for (const id of current.unlockedAchievementIds) set[id] = true;
  for (const id of earnedNow) set[id] = true;
  return { unlockedAchievementIds: Object.keys(set) };
}

// Returns the list of unlocked achievement ids.
export function getAchievementIds(progress) {
  return mergeProgress(progress).unlockedAchievementIds;
}

// Returns a fresh empty progress object (used by reset flow).
export function resetProgress() {
  return createDefaultProgress();
}
