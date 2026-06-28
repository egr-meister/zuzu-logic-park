// Large, child-friendly tappable button with rounded corners and soft shadow.

import React from "react";
import { Text, Pressable, StyleSheet, View } from "react-native";

import { colors, layout, shadow } from "../theme/colors";

export default function AppButton({
  label,
  onPress,
  variant = "primary",
  emoji,
  disabled = false,
  style,
}) {
  const palette = getVariantColors(variant);
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: palette.bg, borderColor: palette.border },
        pressed && !disabled ? styles.pressed : null,
        disabled ? styles.disabled : null,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={styles.inner}>
        {emoji ? <Text style={styles.emoji}>{emoji}</Text> : null}
        <Text style={[styles.label, { color: palette.text }]}>{label}</Text>
      </View>
    </Pressable>
  );
}

function getVariantColors(variant) {
  switch (variant) {
    case "secondary":
      return { bg: colors.card, border: colors.outline, text: colors.text };
    case "accent":
      return { bg: colors.accent, border: colors.accent, text: colors.text };
    case "success":
      return { bg: colors.success, border: colors.success, text: "#FFFFFF" };
    case "danger":
      return { bg: colors.danger, border: colors.danger, text: "#FFFFFF" };
    case "primary":
    default:
      return { bg: colors.primary, border: colors.primary, text: "#FFFFFF" };
  }
}

const styles = StyleSheet.create({
  button: {
    minHeight: layout.tapTarget,
    borderRadius: layout.radiusLarge,
    borderWidth: 2,
    paddingHorizontal: 22,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 7,
    ...shadow,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 22,
    marginRight: 10,
  },
  label: {
    fontSize: 19,
    fontWeight: "700",
    textAlign: "center",
  },
  pressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.92,
  },
  disabled: {
    opacity: 0.5,
  },
});
