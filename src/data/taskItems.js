// Task modes, difficulties and item group options for Zuzu Logic Park.
// All static and local. No timers, no money, no gambling mechanics.

export const TASK_MODES = [
  { id: "odd_item", label: "Find the Odd Item", emoji: "🪑", kind: "logic" },
  { id: "pattern", label: "Continue the Pattern", emoji: "🧩", kind: "logic" },
  { id: "pair", label: "Find a Pair", emoji: "🧺", kind: "logic" },
  { id: "sort_color", label: "Sort by Color", emoji: "🌈", kind: "sorting" },
  { id: "sort_size", label: "Sort by Size", emoji: "📏", kind: "sorting" },
];

export const DIFFICULTIES = [
  { id: "easy", label: "Easy", emoji: "🌱", choices: 2 },
  { id: "medium", label: "Medium", emoji: "🌿", choices: 3 },
  { id: "hard", label: "Hard", emoji: "🌳", choices: 4 },
];

export const ITEM_GROUP_OPTIONS = [
  { id: "animals", label: "Animals", emoji: "🐾" },
  { id: "toys", label: "Toys", emoji: "🧸" },
  { id: "fruits", label: "Fruits", emoji: "🍎" },
];

const FALLBACK_TASK_MODE = TASK_MODES[0];
const FALLBACK_DIFFICULTY = DIFFICULTIES[0];

// Returns a task mode object. Falls back to "odd_item" for invalid input.
export function getTaskMode(taskMode) {
  return TASK_MODES.find((t) => t.id === taskMode) || FALLBACK_TASK_MODE;
}

// Returns a difficulty object. Falls back to "easy" for invalid input.
export function getDifficulty(difficulty) {
  return DIFFICULTIES.find((d) => d.id === difficulty) || FALLBACK_DIFFICULTY;
}

export default TASK_MODES;
