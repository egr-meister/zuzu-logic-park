// A learning-station card shown on the Park Zone map.

import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

import { colors, layout, shadow } from "../theme/colors";

export default function ParkZoneCard({ zone, selected, completedCount, onPress }) {
  const z = zone || {};
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        selected ? styles.selected : null,
        pressed ? styles.pressed : null,
      ]}
      accessibilityRole="button"
      accessibilityLabel={z.label || "Park zone"}
    >
      <View style={styles.emojiCircle}>
        <Text style={styles.emoji}>{z.emoji || "🌳"}</Text>
      </View>
      <View style={styles.textArea}>
        <Text style={styles.title}>{z.label || "Park Zone"}</Text>
        <Text style={styles.desc}>{z.description || ""}</Text>
        <Text style={styles.count}>
          Completed: {completedCount ?? 0}
        </Text>
      </View>
      {selected ? (
        <View style={styles.check}>
          <Text style={styles.checkText}>✓</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: layout.radius,
    borderWidth: 2,
    borderColor: colors.border,
    padding: 14,
    marginVertical: 7,
    ...shadow,
  },
  selected: {
    borderColor: colors.primary,
    backgroundColor: colors.highlight,
  },
  pressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.95,
  },
  emojiCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.parkGrass,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  emoji: {
    fontSize: 30,
  },
  textArea: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  desc: {
    fontSize: 14,
    color: colors.mutedText,
    marginTop: 2,
  },
  count: {
    fontSize: 13,
    color: colors.primary,
    marginTop: 6,
    fontWeight: "600",
  },
  check: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  checkText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16,
  },
});
