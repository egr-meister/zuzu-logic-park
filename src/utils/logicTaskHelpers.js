// Shared helpers for the non-sorting logic tasks
// (Find the Odd Item, Continue the Pattern, Find a Pair).
// Everything here is pure and safe with defaults; nothing uses timers.

// Number of answer choices per difficulty.
export function getChoiceCountForDifficulty(difficulty) {
  switch (difficulty) {
    case "easy":
      return 2;
    case "medium":
      return 3;
    case "hard":
      return 4;
    default:
      return 2;
  }
}

// Returns a new shuffled copy of an array. Never mutates the input.
export function shuffleArray(items) {
  if (!Array.isArray(items)) return [];
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = copy[i];
    copy[i] = copy[j];
    copy[j] = tmp;
  }
  return copy;
}

// Compares a selected answer id with the correct id.
export function isCorrectAnswer(selectedId, correctId) {
  if (!selectedId || !correctId) return false;
  return selectedId === correctId;
}

// Friendly hint text per task mode, shown only after a mistake when enabled.
export function getHintForTask(taskMode) {
  switch (taskMode) {
    case "odd_item":
      return "Look for the item from another group.";
    case "pattern":
      return "Look at what repeats.";
    case "pair":
      return "Look for the same item or same color.";
    case "sort_color":
      return "Match the color.";
    case "sort_size":
      return "Look at which item is bigger or smaller.";
    default:
      return "Take your time and look carefully.";
  }
}

// Human-friendly label for a task mode.
export function getTaskLabel(taskMode) {
  switch (taskMode) {
    case "odd_item":
      return "Find the Odd Item";
    case "pattern":
      return "Continue the Pattern";
    case "pair":
      return "Find a Pair";
    case "sort_color":
      return "Sort by Color";
    case "sort_size":
      return "Sort by Size";
    default:
      return "Logic Task";
  }
}

// How many mistakes before a hint appears, by difficulty.
export function getMistakesBeforeHint(difficulty) {
  switch (difficulty) {
    case "easy":
      return 1;
    case "medium":
      return 1;
    case "hard":
      return 2;
    default:
      return 1;
  }
}
