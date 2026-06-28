// A friendly empty / fallback state with Zuzu and a short message.

import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { colors, layout } from "../theme/colors";
import ZuzuCharacter from "./ZuzuCharacter";

export default function EmptyState({ title, message, emoji }) {
  return (
    <View style={styles.wrap}>
      <ZuzuCharacter size={90} mood="happy" />
      {emoji ? <Text style={styles.emoji}>{emoji}</Text> : null}
      <Text style={styles.title}>{title || "Nothing here yet"}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 28,
    paddingHorizontal: 20,
    backgroundColor: colors.card,
    borderRadius: layout.radiusLarge,
    borderWidth: 2,
    borderColor: colors.border,
    marginVertical: 12,
  },
  emoji: {
    fontSize: 30,
    marginTop: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginTop: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 15,
    color: colors.mutedText,
    marginTop: 6,
    textAlign: "center",
    lineHeight: 21,
  },
});
