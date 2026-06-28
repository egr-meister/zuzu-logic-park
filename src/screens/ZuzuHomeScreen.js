// Home screen — a cheerful park entrance with Zuzu and a progress preview.

import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import ScreenContainer from "../components/ScreenContainer";
import ZuzuCharacter from "../components/ZuzuCharacter";
import AppButton from "../components/AppButton";
import StatCard from "../components/StatCard";
import { colors, layout } from "../theme/colors";
import { loadAppData } from "../storage/appStorage";
import {
  getTotalCorrect,
  getTotalCompletedTasks,
} from "../utils/statsHelpers";
import { getAchievementIds } from "../utils/progressHelpers";
import { disableKeepAwakeSafely } from "../utils/immersiveHelpers";

export default function ZuzuHomeScreen({ navigation }) {
  const [data, setData] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      // Static screen: make sure keep-awake is released.
      disableKeepAwakeSafely();
      loadAppData().then((loaded) => {
        if (active) setData(loaded);
      });
      return () => {
        active = false;
      };
    }, [])
  );

  const correct = getTotalCorrect(data?.stats);
  const completed = getTotalCompletedTasks(data?.stats);
  const achievements = getAchievementIds(data?.progress).length;
  const hasProgress = completed > 0 || correct > 0 || achievements > 0;

  return (
    <ScreenContainer>
      <View style={styles.hero}>
        <ZuzuCharacter size={130} mood="happy" />
        <Text style={styles.title}>Zuzu Logic Park</Text>
        <Text style={styles.subtitle}>Play simple logic games with Zuzu.</Text>
      </View>

      <View style={styles.previewBox}>
        {hasProgress ? (
          <View style={styles.statsRow}>
            <StatCard label="Correct answers" value={correct} emoji="✅" />
            <StatCard label="Tasks completed" value={completed} emoji="🧩" />
            <StatCard label="Achievements" value={achievements} emoji="🏅" />
          </View>
        ) : (
          <Text style={styles.emptyHint}>
            Visit the park and solve your first task.
          </Text>
        )}
      </View>

      <View style={styles.buttons}>
        <AppButton
          label="Start Park"
          emoji="🌳"
          variant="primary"
          onPress={() => navigation.navigate("ParkZone")}
        />
        <AppButton
          label="Achievements"
          emoji="🏅"
          variant="accent"
          onPress={() => navigation.navigate("Achievements")}
        />
        <AppButton
          label="Parent Settings"
          emoji="⚙️"
          variant="secondary"
          onPress={() => navigation.navigate("ParentSettings")}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.primary,
    marginTop: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: colors.mutedText,
    marginTop: 6,
    textAlign: "center",
  },
  previewBox: {
    backgroundColor: colors.board,
    borderRadius: layout.radiusLarge,
    borderWidth: 2,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 18,
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  emptyHint: {
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
    paddingVertical: 16,
  },
  buttons: {
    marginTop: 4,
  },
});
