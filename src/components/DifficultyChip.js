// A rounded difficulty selector chip (Easy / Medium / Hard).

import React from "react";
import { Text, Pressable, StyleSheet } from "react-native";

import { colors, layout } from "../theme/colors";

export default function DifficultyChip({ difficulty, selected, onPress }) {
  const d = difficulty || {};
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected ? styles.selected : null,
        pressed ? styles.pressed : null,
      ]}
      accessibilityRole="button"
      accessibilityLabel={d.label || "Difficulty"}
    >
      <Text style={styles.emoji}>{d.emoji || "🌱"}</Text>
      <Text style={[styles.label, selected ? styles.labelSelected : null]}>
        {d.label || ""}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flex: 1,
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.card,
    borderRadius: layout.radiusLarge,
    borderWidth: 2,
    borderColor: colors.border,
    paddingHorizontal: 10,
    marginHorizontal: 4,
  },
  selected: {
    borderColor: colors.primary,
    backgroundColor: colors.parkGrass,
  },
  pressed: {
    opacity: 0.9,
  },
  emoji: {
    fontSize: 18,
    marginRight: 6,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  labelSelected: {
    color: colors.primary,
  },
});
