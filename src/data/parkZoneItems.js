// Park learning zones for the Zuzu Park Adventure home map.
// Each zone maps to a task mode used by the task screens.

export const PARK_ZONE_ITEMS = [
  {
    id: "odd_item",
    label: "Odd Spot Bench",
    taskMode: "odd_item",
    emoji: "🪑",
    description: "Find the item that does not belong.",
  },
  {
    id: "pattern",
    label: "Pattern Path",
    taskMode: "pattern",
    emoji: "🧩",
    description: "Continue a simple row.",
  },
  {
    id: "pair",
    label: "Pair Picnic",
    taskMode: "pair",
    emoji: "🧺",
    description: "Find the matching pair.",
  },
  {
    id: "sort_color",
    label: "Color Garden",
    taskMode: "sort_color",
    emoji: "🌈",
    description: "Sort items by color.",
  },
  {
    id: "sort_size",
    label: "Size Playground",
    taskMode: "sort_size",
    emoji: "📏",
    description: "Sort items by size.",
  },
];

// Returns a park zone object by id, or null when not found.
export function getParkZoneItem(zoneId) {
  if (!zoneId) return null;
  return PARK_ZONE_ITEMS.find((zone) => zone.id === zoneId) || null;
}

export default PARK_ZONE_ITEMS;
