// A small rounded card that shows one statistic value with a label.

import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { colors, layout, shadow } from "../theme/colors";

export default function StatCard({ label, value, emoji }) {
  return (
    <View style={styles.card}>
      {emoji ? <Text style={styles.emoji}>{emoji}</Text> : null}
      <Text style={styles.value}>{value ?? 0}</Text>
      <Text style={styles.label}>{label || ""}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexGrow: 1,
    flexBasis: "30%",
    minWidth: 92,
    backgroundColor: colors.card,
    borderRadius: layout.radius,
    borderWidth: 2,
    borderColor: colors.border,
    paddingVertical: 14,
    paddingHorizontal: 10,
    margin: 5,
    alignItems: "center",
    ...shadow,
  },
  emoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.primary,
  },
  label: {
    fontSize: 12,
    color: colors.mutedText,
    marginTop: 2,
    textAlign: "center",
  },
});
