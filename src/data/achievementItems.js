// Local achievement badges for Zuzu Logic Park.
// Achievements are simple learning progress markers only.
// They have no money value and use no coins, bonus, or jackpot wording.

export const ACHIEVEMENT_ITEMS = [
  {
    id: "first_park",
    label: "First Park Badge",
    emoji: "🌟",
    description: "Complete your first task.",
    test: (stats) => getCompleted(stats) >= 1,
  },
  {
    id: "odd_spot",
    label: "Odd Spot Badge",
    emoji: "🪑",
    description: "Complete 5 Odd Item tasks.",
    test: (stats) => getModeCompleted(stats, "odd_item") >= 5,
  },
  {
    id: "pattern_path",
    label: "Pattern Path Badge",
    emoji: "🧩",
    description: "Complete 5 Pattern tasks.",
    test: (stats) => getModeCompleted(stats, "pattern") >= 5,
  },
  {
    id: "pair_picnic",
    label: "Pair Picnic Badge",
    emoji: "🧺",
    description: "Complete 5 Pair tasks.",
    test: (stats) => getModeCompleted(stats, "pair") >= 5,
  },
  {
    id: "color_garden",
    label: "Color Garden Badge",
    emoji: "🌈",
    description: "Complete 5 Color Sorting tasks.",
    test: (stats) => getModeCompleted(stats, "sort_color") >= 5,
  },
  {
    id: "size_playground",
    label: "Size Playground Badge",
    emoji: "📏",
    description: "Complete 5 Size Sorting tasks.",
    test: (stats) => getModeCompleted(stats, "sort_size") >= 5,
  },
  {
    id: "zuzu_logic_star",
    label: "Zuzu Logic Star",
    emoji: "🏅",
    description: "Complete 25 tasks.",
    test: (stats) => getCompleted(stats) >= 25,
  },
];

function getCompleted(stats) {
  return stats?.completedTasks ?? 0;
}

function getModeCompleted(stats, mode) {
  return stats?.byTaskMode?.[mode]?.completed ?? 0;
}

// Returns the list of achievement ids that are unlocked for the given stats.
export function getUnlockedAchievements(stats) {
  const safeStats = stats || {};
  const unlocked = [];
  for (const achievement of ACHIEVEMENT_ITEMS) {
    try {
      if (achievement.test(safeStats)) {
        unlocked.push(achievement.id);
      }
    } catch (e) {
      // Never crash on malformed stats; simply skip this achievement.
    }
  }
  return unlocked;
}

// Returns a single achievement definition by id, or null.
export function getAchievementItem(achievementId) {
  if (!achievementId) return null;
  return ACHIEVEMENT_ITEMS.find((a) => a.id === achievementId) || null;
}

export default ACHIEVEMENT_ITEMS;
