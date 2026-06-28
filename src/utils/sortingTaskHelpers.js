// Helpers for the tap-to-sort tasks (Sort by Color, Sort by Size).
// Pure functions, safe with empty/invalid input, no timers.
// A wrong placement never resets the task.

import { getItemsByGroup, ITEM_GROUPS } from "../data/itemItems";
import { shuffleArray } from "./logicTaskHelpers";

const COLOR_BASKETS = [
  { id: "basket_red", label: "Red", type: "color", matchValue: "red" },
  { id: "basket_blue", label: "Blue", type: "color", matchValue: "blue" },
  { id: "basket_yellow", label: "Yellow", type: "color", matchValue: "yellow" },
  { id: "basket_green", label: "Green", type: "color", matchValue: "green" },
];

const SIZE_BASKETS_SIMPLE = [
  { id: "basket_small", label: "Small", type: "size", matchValue: "small" },
  { id: "basket_big", label: "Big", type: "size", matchValue: "big" },
];

const SIZE_BASKETS_HARD = [
  { id: "basket_small", label: "Small", type: "size", matchValue: "small" },
  { id: "basket_medium", label: "Medium", type: "size", matchValue: "medium" },
  { id: "basket_big", label: "Big", type: "size", matchValue: "big" },
];

let sortingCounter = 0;
function nextSortingId() {
  sortingCounter += 1;
  return "sorting_task_" + Date.now() + "_" + sortingCounter;
}

function safeGroupId(groupId) {
  return ITEM_GROUPS.some((g) => g.id === groupId) ? groupId : "animals";
}

// Returns the baskets for a sorting task mode and difficulty.
export function getSortingBaskets(taskMode, difficulty) {
  if (taskMode === "sort_color") {
    return COLOR_BASKETS.slice();
  }
  if (taskMode === "sort_size") {
    return difficulty === "hard"
      ? SIZE_BASKETS_HARD.slice()
      : SIZE_BASKETS_SIMPLE.slice();
  }
  // Safe default.
  return COLOR_BASKETS.slice();
}

// How many items to sort by difficulty.
function getItemCount(difficulty) {
  if (difficulty === "medium") return 5;
  if (difficulty === "hard") return 6;
  return 4;
}

// Checks whether an item belongs in a basket.
export function checkItemMatchesBasket(item, basket) {
  if (!item || !basket) return false;
  if (basket.type === "color") {
    return item.colorId === basket.matchValue;
  }
  if (basket.type === "size") {
    return item.sizeId === basket.matchValue;
  }
  return false;
}

// Creates a fresh sorting task state. Never returns undefined.
export function createSortingTaskState(taskMode, groupId, difficulty) {
  const mode =
    taskMode === "sort_color" || taskMode === "sort_size"
      ? taskMode
      : "sort_color";
  const group = safeGroupId(groupId);
  const level = difficulty || "easy";
  const baskets = getSortingBaskets(mode, level);
  const allowedValues = baskets.map((b) => b.matchValue);

  // Only keep items that can actually go into one of the available baskets.
  const propertyKey = mode === "sort_color" ? "colorId" : "sizeId";
  const usable = getItemsByGroup(group).filter((it) =>
    allowedValues.includes(it[propertyKey])
  );

  let pool = shuffleArray(usable);
  // Fallback: if filtering left too few, pull from all groups.
  if (pool.length < 2) {
    const all = ITEM_GROUPS.flatMap((g) => getItemsByGroup(g.id)).filter((it) =>
      allowedValues.includes(it[propertyKey])
    );
    pool = shuffleArray(all);
  }

  const count = Math.min(getItemCount(level), pool.length);
  const items = pool.slice(0, Math.max(2, count)).map((it) => ({
    id: it.id,
    label: it.label,
    emoji: it.emoji,
    colorId: it.colorId,
    sizeId: it.sizeId,
  }));

  return {
    id: nextSortingId(),
    taskMode: mode,
    groupId: group,
    difficulty: level,
    items,
    baskets,
    placedItemIds: [],
    correctPlacements: 0,
    mistakes: 0,
    startedAt: new Date().toISOString(),
  };
}

// Attempts to place an item into a basket.
// Returns { state, correct, complete } without mutating the input state.
// Wrong placements increase mistakes but do not reset progress.
export function placeItemInBasket(state, itemId, basketId) {
  if (!state || !itemId || !basketId) {
    return { state: state || createSortingTaskState(), correct: false, complete: false };
  }
  const items = state.items ?? [];
  const baskets = state.baskets ?? [];
  const placedItemIds = state.placedItemIds ?? [];

  const item = items.find((it) => it.id === itemId);
  const basket = baskets.find((b) => b.id === basketId);

  // Already placed or invalid references: no change.
  if (!item || !basket || placedItemIds.includes(itemId)) {
    return { state, correct: false, complete: isSortingComplete(state) };
  }

  const correct = checkItemMatchesBasket(item, basket);

  if (correct) {
    const newState = {
      ...state,
      placedItemIds: [...placedItemIds, itemId],
      correctPlacements: (state.correctPlacements ?? 0) + 1,
    };
    return {
      state: newState,
      correct: true,
      complete: isSortingComplete(newState),
    };
  }

  const newState = {
    ...state,
    mistakes: (state.mistakes ?? 0) + 1,
  };
  return { state: newState, correct: false, complete: false };
}

// True when every item has been placed correctly.
export function isSortingComplete(state) {
  if (!state) return false;
  const items = state.items ?? [];
  const placedItemIds = state.placedItemIds ?? [];
  if (items.length === 0) return false;
  return placedItemIds.length >= items.length;
}

// Friendly hint for a sorting task mode.
export function getSortingHint(taskMode) {
  if (taskMode === "sort_size") {
    return "Look at which item is bigger or smaller.";
  }
  return "Match the color.";
}

export default createSortingTaskState;
