// A park-sticker style achievement badge. Shows locked / unlocked state.

import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { colors, layout, shadow } from "../theme/colors";

export default function AchievementBadge({ achievement, unlocked }) {
  const a = achievement || {};
  return (
    <View style={[styles.badge, unlocked ? styles.unlocked : styles.locked]}>
      <View style={[styles.circle, unlocked ? styles.circleOn : styles.circleOff]}>
        <Text style={[styles.emoji, unlocked ? null : styles.dim]}>
          {unlocked ? a.emoji || "🏅" : "🔒"}
        </Text>
      </View>
      <Text style={styles.title}>{a.label || "Badge"}</Text>
      <Text style={styles.desc}>{a.description || ""}</Text>
      <Text style={[styles.status, unlocked ? styles.statusOn : styles.statusOff]}>
        {unlocked ? "Unlocked" : "Keep playing"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    width: "48%",
    backgroundColor: colors.card,
    borderRadius: layout.radius,
    borderWidth: 2,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
    ...shadow,
  },
  unlocked: {
    borderColor: colors.accent,
  },
  locked: {
    borderColor: colors.border,
    opacity: 0.85,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  circleOn: {
    backgroundColor: colors.highlight,
  },
  circleOff: {
    backgroundColor: colors.background,
  },
  emoji: {
    fontSize: 30,
  },
  dim: {
    opacity: 0.7,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
  },
  desc: {
    fontSize: 12,
    color: colors.mutedText,
    textAlign: "center",
    marginTop: 4,
  },
  status: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "700",
  },
  statusOn: {
    color: colors.primary,
  },
  statusOff: {
    color: colors.mutedText,
  },
});
