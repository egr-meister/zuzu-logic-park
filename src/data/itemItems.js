// Static item catalogue for Zuzu Logic Park.
// Items are simple emoji cards grouped into Animals, Toys, and Fruits.
// Every item carries groupId, colorId and sizeId so the same data can be
// reused for odd-item, pattern, pair and sorting tasks. All data is local.

export const ITEM_GROUPS = [
  { id: "animals", label: "Animals", emoji: "🐾" },
  { id: "toys", label: "Toys", emoji: "🧸" },
  { id: "fruits", label: "Fruits", emoji: "🍎" },
];

export const ITEM_ITEMS = [
  // ---------------- Animals ----------------
  { id: "animal_cat", label: "Cat", emoji: "🐱", groupId: "animals", colorId: "yellow", sizeId: "small" },
  { id: "animal_dog", label: "Dog", emoji: "🐶", groupId: "animals", colorId: "yellow", sizeId: "big" },
  { id: "animal_bird", label: "Bird", emoji: "🐦", groupId: "animals", colorId: "blue", sizeId: "small" },
  { id: "animal_fish", label: "Fish", emoji: "🐠", groupId: "animals", colorId: "blue", sizeId: "small" },
  { id: "animal_rabbit", label: "Rabbit", emoji: "🐰", groupId: "animals", colorId: "green", sizeId: "medium" },

  // ---------------- Toys ----------------
  { id: "toy_ball", label: "Ball", emoji: "⚽", groupId: "toys", colorId: "blue", sizeId: "medium" },
  { id: "toy_teddy", label: "Teddy", emoji: "🧸", groupId: "toys", colorId: "yellow", sizeId: "big" },
  { id: "toy_blocks", label: "Blocks", emoji: "🧱", groupId: "toys", colorId: "red", sizeId: "small" },
  { id: "toy_car", label: "Car Toy", emoji: "🚗", groupId: "toys", colorId: "red", sizeId: "medium" },
  { id: "toy_kite", label: "Kite", emoji: "🪁", groupId: "toys", colorId: "green", sizeId: "big" },

  // ---------------- Fruits ----------------
  { id: "fruit_apple", label: "Apple", emoji: "🍎", groupId: "fruits", colorId: "red", sizeId: "medium" },
  { id: "fruit_banana", label: "Banana", emoji: "🍌", groupId: "fruits", colorId: "yellow", sizeId: "medium" },
  { id: "fruit_orange", label: "Orange", emoji: "🍊", groupId: "fruits", colorId: "yellow", sizeId: "medium" },
  { id: "fruit_grape", label: "Grape", emoji: "🍇", groupId: "fruits", colorId: "green", sizeId: "small" },
  { id: "fruit_strawberry", label: "Strawberry", emoji: "🍓", groupId: "fruits", colorId: "red", sizeId: "small" },
];

const FALLBACK_GROUP = "animals";

function isValidGroup(groupId) {
  return ITEM_GROUPS.some((g) => g.id === groupId);
}

// Returns all items for a group. Falls back to animals for invalid input.
export function getItemsByGroup(groupId) {
  const safeGroup = isValidGroup(groupId) ? groupId : FALLBACK_GROUP;
  const items = ITEM_ITEMS.filter((item) => item.groupId === safeGroup);
  if (!items || items.length === 0) {
    return ITEM_ITEMS.filter((item) => item.groupId === FALLBACK_GROUP);
  }
  return items;
}

// Returns a single item by id, or null when not found.
export function getItemById(itemId) {
  if (!itemId) return null;
  return ITEM_ITEMS.find((item) => item.id === itemId) || null;
}

// Returns a difficulty-appropriate slice of items for a group.
// Easy uses the first few clearly distinct items, harder levels use more.
export function getItemsForDifficulty(groupId, difficulty) {
  const items = getItemsByGroup(groupId);
  const level = difficulty || "easy";
  if (level === "easy") return items.slice(0, Math.min(3, items.length));
  if (level === "medium") return items.slice(0, Math.min(4, items.length));
  return items.slice(0, items.length);
}

export default ITEM_ITEMS;
