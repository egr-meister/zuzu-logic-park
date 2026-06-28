// Displays a repeating pattern sequence ending with a "?" cell.

import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

import { colors, layout } from "../theme/colors";

export default function PatternRow({ sequence }) {
  const items = Array.isArray(sequence) ? sequence : [];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {items.map((item, index) => (
        <View key={(item?.id || "item") + "_" + index} style={styles.cell}>
          <Text style={styles.emoji}>{item?.emoji || "❓"}</Text>
        </View>
      ))}
      <View style={[styles.cell, styles.questionCell]}>
        <Text style={styles.question}>?</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  cell: {
    width: 64,
    height: 64,
    borderRadius: layout.radius,
    backgroundColor: colors.board,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  questionCell: {
    backgroundColor: colors.highlight,
    borderColor: colors.accent,
    borderStyle: "dashed",
  },
  emoji: {
    fontSize: 34,
  },
  question: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.primary,
  },
});
