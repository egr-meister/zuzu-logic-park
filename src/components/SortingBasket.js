// A tap-target basket for sorting tasks. Tapping selects it as the target
// for the currently picked item. Shows the items already placed inside.

import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

import { colors, layout, shadow, colorSwatches } from "../theme/colors";

export default function SortingBasket({ basket, placedItems, onPress, highlighted }) {
  const b = basket || {};
  const items = Array.isArray(placedItems) ? placedItems : [];

  const accent =
    b.type === "color"
      ? colorSwatches[b.matchValue] || colors.primary
      : colors.primary;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.basket,
        { borderColor: accent },
        highlighted ? { backgroundColor: colors.highlight } : null,
        pressed ? styles.pressed : null,
      ]}
      accessibilityRole="button"
      accessibilityLabel={"Basket " + (b.label || "")}
    >
      <View style={styles.header}>
        {b.type === "color" ? (
          <View style={[styles.swatch, { backgroundColor: accent }]} />
        ) : (
          <Text style={styles.sizeIcon}>{getSizeIcon(b.matchValue)}</Text>
        )}
        <Text style={styles.label}>{b.label || ""}</Text>
      </View>
      <View style={styles.contents}>
        {items.length === 0 ? (
          <Text style={styles.empty}>Tap to drop here</Text>
        ) : (
          items.map((it, i) => (
            <Text key={(it?.id || "i") + "_" + i} style={styles.placed}>
              {it?.emoji || "❓"}
            </Text>
          ))
        )}
      </View>
    </Pressable>
  );
}

function getSizeIcon(value) {
  if (value === "small") return "🔹";
  if (value === "big") return "🔷";
  return "🔸"; // medium
}

const styles = StyleSheet.create({
  basket: {
    flex: 1,
    minHeight: 110,
    backgroundColor: colors.card,
    borderRadius: layout.radius,
    borderWidth: 3,
    padding: 10,
    margin: 5,
    ...shadow,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  swatch: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginRight: 6,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  sizeIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  contents: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  empty: {
    fontSize: 12,
    color: colors.mutedText,
  },
  placed: {
    fontSize: 26,
    margin: 2,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
});
