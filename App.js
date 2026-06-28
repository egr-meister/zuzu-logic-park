// Zuzu Logic Park — app entry point.
//
// Responsibilities:
//   - Provide safe-area context (notches / cutouts / rounded corners)
//   - Enable fullscreen, edge-to-edge, sticky immersive system bars on Android
//   - Host the navigation container with a theme that extends DefaultTheme
//
// The app is fully offline, requests no permissions, and locks to portrait
// (orientation is set in app.json).

import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SystemBars } from "react-native-edge-to-edge";

import AppNavigator from "./src/navigation/AppNavigator";
import { colors } from "./src/theme/colors";

// IMPORTANT: extend DefaultTheme rather than building a theme from scratch so
// required fields (such as fonts) are always present in release builds.
const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.card,
    primary: colors.primary,
    text: colors.text,
    border: colors.border,
    notification: colors.accent,
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      {/* Hide status + navigation bars for a child-friendly fullscreen view.
          On Android edge-to-edge this behaves as sticky immersive: bars
          reappear only briefly after an edge swipe. */}
      <SystemBars hidden style="dark" />
      <NavigationContainer theme={navTheme}>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
