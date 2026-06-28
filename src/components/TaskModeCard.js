// A small selectable card representing an item group on the Task Picker.

import React from "react";
import { Text, Pressable, StyleSheet } from "react-native";

import { colors, layout, shadow } from "../theme/colors";

export default function TaskModeCard({ option, selected, onPress }) {
  const o = option || {};
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        selected ? styles.selected : null,
        pressed ? styles.pressed : null,
      ]}
      accessibilityRole="button"
      accessibilityLabel={o.label || "Option"}
    >
      <Text style={styles.emoji}>{o.emoji || "⭐"}</Text>
      <Text style={[styles.label, selected ? styles.labelSelected : null]}>
        {o.label || ""}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 96,
    backgroundColor: colors.card,
    borderRadius: layout.radius,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    marginHorizontal: 5,
    ...shadow,
  },
  selected: {
    borderColor: colors.secondary,
    backgroundColor: colors.highlight,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  emoji: {
    fontSize: 34,
    marginBottom: 6,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
  },
  labelSelected: {
    color: colors.secondary,
  },
});
