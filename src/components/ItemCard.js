// A tappable item card showing a big emoji and label.
// Supports a soft correct/incorrect state and an optional color dot.
// Includes a gentle scale animation on correct answers (when enabled).

import React, { useEffect, useRef } from "react";
import { Text, Pressable, StyleSheet, Animated, View } from "react-native";

import { colors, layout, shadow, colorSwatches } from "../theme/colors";
import { getCorrectAnswerAnimationConfig } from "../utils/animationHelpers";

export default function ItemCard({
  item,
  onPress,
  status = "none", // "none" | "correct" | "incorrect" | "selected"
  disabled = false,
  showColorDot = false,
  animationEnabled = true,
  size = "normal", // "normal" | "small" | "large"
}) {
  const it = item || {};
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (status === "correct" && animationEnabled) {
      const cfg = getCorrectAnswerAnimationConfig();
      Animated.sequence([
        Animated.timing(scale, {
          toValue: cfg.toValue,
          duration: cfg.duration,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: cfg.restValue ?? 1,
          duration: cfg.duration,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (status === "incorrect" && animationEnabled) {
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 0.95,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [status, animationEnabled, scale]);

  const sizing =
    size === "large"
      ? styles.large
      : size === "small"
      ? styles.small
      : styles.normal;

  const stateStyle =
    status === "correct"
      ? styles.correct
      : status === "incorrect"
      ? styles.incorrect
      : status === "selected"
      ? styles.selected
      : null;

  const dotColor = colorSwatches[it.colorId] || colors.mutedText;

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={disabled ? undefined : onPress}
        disabled={disabled}
        style={({ pressed }) => [
          styles.card,
          sizing,
          stateStyle,
          pressed && !disabled ? styles.pressed : null,
        ]}
        accessibilityRole="button"
        accessibilityLabel={it.label || "Item"}
      >
        <Text style={[styles.emoji, size === "large" ? styles.emojiLarge : null]}>
          {it.emoji || "❓"}
        </Text>
        {it.label ? <Text style={styles.label}>{it.label}</Text> : null}
        {showColorDot ? (
          <View style={[styles.dot, { backgroundColor: dotColor }]} />
        ) : null}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: layout.radius,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    margin: 6,
    ...shadow,
  },
  normal: {
    width: 104,
    height: 104,
  },
  small: {
    width: 80,
    height: 80,
  },
  large: {
    width: 130,
    height: 130,
  },
  emoji: {
    fontSize: 46,
  },
  emojiLarge: {
    fontSize: 60,
  },
  label: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  dot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  correct: {
    borderColor: colors.success,
    backgroundColor: "#E7F8EF",
  },
  incorrect: {
    borderColor: colors.danger,
    backgroundColor: "#FDEDE8",
  },
  selected: {
    borderColor: colors.secondary,
    backgroundColor: colors.highlight,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.95,
  },
});
