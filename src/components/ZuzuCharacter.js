// Zuzu — a friendly round park guide drawn entirely with React Native Views.
// No external art assets. Supports a few simple moods.

import React from "react";
import { View, StyleSheet } from "react-native";

import { colors } from "../theme/colors";

export default function ZuzuCharacter({ size = 120, mood = "happy" }) {
  const s = size;
  const eyeSize = s * 0.16;
  const pupilSize = eyeSize * 0.5;

  return (
    <View style={{ width: s, height: s * 1.18, alignItems: "center" }}>
      {/* leaf hat */}
      <View
        style={[
          styles.stem,
          { height: s * 0.18, top: s * 0.02, width: Math.max(3, s * 0.03) },
        ]}
      />
      <View
        style={[
          styles.leaf,
          {
            width: s * 0.34,
            height: s * 0.22,
            borderRadius: s * 0.2,
            top: s * 0.0,
          },
        ]}
      />
      {/* body */}
      <View
        style={[
          styles.body,
          {
            width: s,
            height: s,
            borderRadius: s / 2,
            top: s * 0.14,
            borderWidth: Math.max(3, s * 0.04),
          },
        ]}
      >
        {/* eyes */}
        <View style={[styles.eyeRow, { top: s * 0.28 }]}>
          <Eye size={eyeSize} pupil={pupilSize} />
          <View style={{ width: s * 0.16 }} />
          <Eye size={eyeSize} pupil={pupilSize} />
        </View>
        {/* cheeks */}
        <View style={[styles.cheekRow, { top: s * 0.46 }]}>
          <View
            style={[
              styles.cheek,
              { width: s * 0.16, height: s * 0.1, borderRadius: s * 0.08 },
            ]}
          />
          <View style={{ width: s * 0.28 }} />
          <View
            style={[
              styles.cheek,
              { width: s * 0.16, height: s * 0.1, borderRadius: s * 0.08 },
            ]}
          />
        </View>
        {/* mouth */}
        <Mouth size={s} mood={mood} />
      </View>
    </View>
  );
}

function Eye({ size, pupil }) {
  return (
    <View
      style={[
        styles.eye,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <View
        style={{
          width: pupil,
          height: pupil,
          borderRadius: pupil / 2,
          backgroundColor: colors.text,
        }}
      />
    </View>
  );
}

function Mouth({ size, mood }) {
  if (mood === "wow") {
    return (
      <View
        style={[
          styles.mouthWow,
          {
            width: size * 0.22,
            height: size * 0.22,
            borderRadius: size * 0.11,
            top: size * 0.56,
          },
        ]}
      />
    );
  }
  // happy smile (default) — a rounded arc made from a bordered box.
  return (
    <View
      style={[
        styles.smile,
        {
          width: size * 0.4,
          height: size * 0.22,
          borderBottomLeftRadius: size * 0.2,
          borderBottomRightRadius: size * 0.2,
          borderWidth: Math.max(2, size * 0.03),
          top: size * 0.52,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: "#7CC59C",
    borderColor: colors.primary,
    alignItems: "center",
    position: "relative",
  },
  stem: {
    position: "absolute",
    backgroundColor: colors.primary,
    zIndex: 2,
  },
  leaf: {
    position: "absolute",
    backgroundColor: colors.green,
    borderColor: colors.primary,
    borderWidth: 2,
    transform: [{ rotate: "-18deg" }],
    left: "50%",
    marginLeft: -6,
    zIndex: 3,
  },
  eyeRow: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  eye: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: colors.text,
  },
  cheekRow: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  cheek: {
    backgroundColor: colors.pink,
    opacity: 0.85,
  },
  smile: {
    position: "absolute",
    borderColor: colors.text,
    borderTopWidth: 0,
    backgroundColor: "transparent",
  },
  mouthWow: {
    position: "absolute",
    backgroundColor: colors.text,
  },
});
