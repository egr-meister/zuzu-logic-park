// Zuzu's gentle hint speech bubble. Fades in softly and is never shaming.

import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

import { colors, layout } from "../theme/colors";
import { getHintAnimationConfig } from "../utils/animationHelpers";

export default function HintCard({ text, visible = true, animationEnabled = true }) {
  const opacity = useRef(new Animated.Value(animationEnabled ? 0 : 1)).current;

  useEffect(() => {
    if (!visible) return;
    if (animationEnabled) {
      const cfg = getHintAnimationConfig();
      opacity.setValue(cfg.fromValue ?? 0);
      Animated.timing(opacity, {
        toValue: cfg.toValue ?? 1,
        duration: cfg.duration ?? 260,
        useNativeDriver: true,
      }).start();
    } else {
      opacity.setValue(1);
    }
  }, [visible, animationEnabled, text, opacity]);

  if (!visible || !text) return null;

  return (
    <Animated.View style={[styles.bubble, { opacity }]}>
      <Text style={styles.zuzuTag}>Zuzu's hint</Text>
      <Text style={styles.text}>{text}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    backgroundColor: colors.highlight,
    borderRadius: layout.radius,
    borderWidth: 2,
    borderColor: colors.accent,
    padding: 14,
    marginVertical: 8,
  },
  zuzuTag: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 4,
  },
  text: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
  },
});
