// Safe-area aware page wrapper used by every screen.
// Provides the park background, safe-area padding (for notches / cutouts /
// rounded corners) and optional decorative leaves/stars.

import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, layout } from "../theme/colors";

export default function ScreenContainer({
  children,
  scroll = true,
  decorations = true,
  contentStyle,
}) {
  const insets = useSafeAreaInsets();
  const safe = insets || { top: 0, bottom: 0, left: 0, right: 0 };

  const padding = {
    paddingTop: (safe.top ?? 0) + 12,
    paddingBottom: (safe.bottom ?? 0) + 16,
    paddingLeft: (safe.left ?? 0) + layout.pagePadding,
    paddingRight: (safe.right ?? 0) + layout.pagePadding,
  };

  const Decorations = decorations ? <ParkDecorations /> : null;

  if (scroll) {
    return (
      <View style={styles.root}>
        {Decorations}
        <ScrollView
          contentContainerStyle={[styles.content, padding, contentStyle]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {Decorations}
      <View style={[styles.content, styles.flexContent, padding, contentStyle]}>
        {children}
      </View>
    </View>
  );
}

// Soft, non-distracting background blobs, leaves and stars.
function ParkDecorations() {
  return (
    <View pointerEvents="none" style={styles.decorLayer}>
      <View style={[styles.blob, styles.blobSky]} />
      <View style={[styles.blob, styles.blobGrass]} />
      <View style={[styles.hill, styles.hillLeft]} />
      <View style={[styles.hill, styles.hillRight]} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
  },
  flexContent: {
    flex: 1,
  },
  decorLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  blob: {
    position: "absolute",
    borderRadius: 999,
    opacity: 0.45,
  },
  blobSky: {
    width: 280,
    height: 280,
    backgroundColor: colors.softSky,
    top: -90,
    right: -70,
  },
  blobGrass: {
    width: 320,
    height: 320,
    backgroundColor: colors.parkGrass,
    bottom: -120,
    left: -90,
  },
  hill: {
    position: "absolute",
    bottom: -60,
    width: 240,
    height: 160,
    borderTopLeftRadius: 140,
    borderTopRightRadius: 140,
    backgroundColor: colors.parkGrass,
    opacity: 0.5,
  },
  hillLeft: {
    left: -40,
  },
  hillRight: {
    right: -50,
    backgroundColor: colors.green,
    opacity: 0.25,
  },
});
