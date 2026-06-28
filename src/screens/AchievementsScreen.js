// Achievements screen — local statistics and achievement badges.
// No rankings, no leaderboards, no social sharing. Local markers only.

import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import ScreenContainer from "../components/ScreenContainer";
import StatCard from "../components/StatCard";
import AchievementBadge from "../components/AchievementBadge";
import AppButton from "../components/AppButton";
import EmptyState from "../components/EmptyState";

import { colors, layout } from "../theme/colors";
import { ACHIEVEMENT_ITEMS } from "../data/achievementItems";
import { TASK_MODES } from "../data/taskItems";
import { ITEM_GROUPS } from "../data/itemItems";
import { getAchievementIds } from "../utils/progressHelpers";
import {
  getTotalCorrect,
  getTotalIncorrect,
  getTotalCompletedTasks,
  getHintsUsed,
} from "../utils/statsHelpers";
import {
  loadAppData,
  resetLearningStats,
  resetLearningProgress,
} from "../storage/appStorage";
import { disableKeepAwakeSafely } from "../utils/immersiveHelpers";

export default function AchievementsScreen({ navigation }) {
  const [data, setData] = useState(null);

  const reload = useCallback(() => {
    let active = true;
    disableKeepAwakeSafely();
    loadAppData().then((loaded) => {
      if (active) setData(loaded);
    });
    return () => {
      active = false;
    };
  }, []);

  useFocusEffect(reload);

  const stats = data?.stats ?? null;
  const unlockedIds = getAchievementIds(data?.progress);
  const completed = getTotalCompletedTasks(stats);
  const correct = getTotalCorrect(stats);
  const incorrect = getTotalIncorrect(stats);
  const hints = getHintsUsed(stats);
  const hasProgress = completed > 0 || correct > 0 || unlockedIds.length > 0;

  const onReset = () => {
    Alert.alert(
      "Reset Progress",
      "Are you sure you want to reset Zuzu progress?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            await resetLearningStats();
            await resetLearningProgress();
            const refreshed = await loadAppData();
            setData(refreshed);
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer>
      <Text style={styles.title}>Achievements & Progress</Text>

      {!hasProgress ? (
        <EmptyState
          title="No Zuzu progress yet."
          message="Solve a task in the park to start earning badges."
          emoji="🌱"
        />
      ) : (
        <View>
          <View style={styles.statsRow}>
            <StatCard label="Correct answers" value={correct} emoji="✅" />
            <StatCard label="Mistakes" value={incorrect} emoji="🌱" />
            <StatCard label="Completed tasks" value={completed} emoji="🧩" />
            <StatCard label="Hints used" value={hints} emoji="💡" />
            <StatCard
              label="Achievements"
              value={unlockedIds.length}
              emoji="🏅"
            />
          </View>

          <Text style={styles.section}>Badges</Text>
          <View style={styles.badgeRow}>
            {ACHIEVEMENT_ITEMS.map((a) => (
              <AchievementBadge
                key={a.id}
                achievement={a}
                unlocked={unlockedIds.includes(a.id)}
              />
            ))}
          </View>

          <Text style={styles.section}>Progress by task</Text>
          <View style={styles.progressBox}>
            {TASK_MODES.map((mode) => (
              <ProgressLine
                key={mode.id}
                label={mode.label}
                emoji={mode.emoji}
                value={stats?.byTaskMode?.[mode.id]?.completed ?? 0}
              />
            ))}
          </View>

          <Text style={styles.section}>Progress by group</Text>
          <View style={styles.progressBox}>
            {ITEM_GROUPS.map((g) => (
              <ProgressLine
                key={g.id}
                label={g.label}
                emoji={g.emoji}
                value={stats?.byGroup?.[g.id]?.completed ?? 0}
              />
            ))}
          </View>

          <Text style={styles.note}>
            Achievements are simple learning markers inside the app. They have no
            money value.
          </Text>
        </View>
      )}

      <View style={styles.buttons}>
        {hasProgress ? (
          <AppButton
            label="Reset Progress"
            emoji="🔄"
            variant="danger"
            onPress={onReset}
          />
        ) : null}
        <AppButton
          label="Back Home"
          emoji="🏠"
          variant="secondary"
          onPress={() => navigation.navigate("ZuzuHome")}
        />
      </View>
    </ScreenContainer>
  );
}

function ProgressLine({ label, emoji, value }) {
  return (
    <View style={styles.progressLine}>
      <Text style={styles.progressLabel}>
        {emoji} {label}
      </Text>
      <Text style={styles.progressValue}>{value ?? 0}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.primary,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  section: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginTop: 18,
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  progressBox: {
    backgroundColor: colors.card,
    borderRadius: layout.radius,
    borderWidth: 2,
    borderColor: colors.border,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  progressLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  progressLabel: {
    fontSize: 15,
    color: colors.text,
    fontWeight: "600",
  },
  progressValue: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "800",
  },
  note: {
    fontSize: 13,
    color: colors.mutedText,
    marginTop: 16,
    lineHeight: 19,
    textAlign: "center",
  },
  buttons: {
    marginTop: 18,
  },
});
