// Shows the "target" item for a Find-a-Pair task inside a friendly board.

import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { colors, layout, shadow, colorSwatches } from "../theme/colors";

export default function PairCard({ item }) {
  const it = item || {};
  const dotColor = colorSwatches[it.colorId] || colors.mutedText;
  return (
    <View style={styles.board}>
      <Text style={styles.caption}>Match this</Text>
      <View style={styles.card}>
        <Text style={styles.emoji}>{it.emoji || "❓"}</Text>
        <View style={[styles.dot, { backgroundColor: dotColor }]} />
      </View>
      <Text style={styles.label}>{it.label || ""}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    alignItems: "center",
    backgroundColor: colors.board,
    borderRadius: layout.radiusLarge,
    borderWidth: 2,
    borderColor: colors.accent,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginVertical: 6,
  },
  caption: {
    fontSize: 14,
    color: colors.mutedText,
    marginBottom: 8,
    fontWeight: "600",
  },
  card: {
    width: 120,
    height: 120,
    borderRadius: layout.radius,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    ...shadow,
  },
  emoji: {
    fontSize: 58,
  },
  dot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  label: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
});
