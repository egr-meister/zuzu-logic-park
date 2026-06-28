// Task Result screen — calm, positive feedback after completing a task.
// Saves the result locally and updates achievements. No coins, no money.

import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";

import ScreenContainer from "../components/ScreenContainer";
import ZuzuCharacter from "../components/ZuzuCharacter";
import StatCard from "../components/StatCard";
import AchievementBadge from "../components/AchievementBadge";
import AppButton from "../components/AppButton";

import { colors, layout } from "../theme/colors";
import { getTaskLabel } from "../utils/logicTaskHelpers";
import { getTaskMode } from "../data/taskItems";
import { getAchievementItem } from "../data/achievementItems";
import { getAchievementIds } from "../utils/progressHelpers";
import { loadAppData, recordLearningTaskResult } from "../storage/appStorage";
import { disableKeepAwakeSafely } from "../utils/immersiveHelpers";

export default function TaskResultScreen({ navigation, route }) {
  const result = route?.params?.result ?? {};
  const taskMode = route?.params?.taskMode ?? result.taskMode ?? "odd_item";
  const groupId = route?.params?.groupId ?? result.groupId ?? "animals";
  const difficulty = route?.params?.difficulty ?? result.difficulty ?? "easy";
  const zoneId = route?.params?.zoneId ?? taskMode;

  const [newlyUnlocked, setNewlyUnlocked] = useState([]);
  const [totalAchievements, setTotalAchievements] = useState(0);
  const recordedRef = useRef(false);

  useEffect(() => {
    let active = true;
    disableKeepAwakeSafely();
    if (recordedRef.current) return;
    recordedRef.current = true;

    (async () => {
      const before = await loadAppData();
      const beforeIds = getAchievementIds(before?.progress);
      const after = await recordLearningTaskResult(result);
      const afterIds = getAchievementIds(after?.progress);
      const fresh = afterIds.filter((id) => !beforeIds.includes(id));
      if (active) {
        setNewlyUnlocked(fresh);
        setTotalAchievements(afterIds.length);
      }
    })();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const correct = result?.correct ?? 0;
  const incorrect = result?.incorrect ?? 0;
  const modeInfo = getTaskMode(taskMode);

  const onNextTask = () => {
    const params = { zoneId, taskMode, groupId, difficulty };
    if (modeInfo.kind === "sorting") {
      navigation.replace("SortingTask", params);
    } else {
      navigation.replace("LogicTask", params);
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.hero}>
        <ZuzuCharacter size={120} mood="wow" />
        <Text style={styles.title}>Zuzu says great job!</Text>
        <Text style={styles.subtitle}>Well done — you finished the task.</Text>
      </View>

      <View style={styles.metaBox}>
        <Text style={styles.metaLine}>Task: {getTaskLabel(taskMode)}</Text>
        <Text style={styles.metaLine}>Group: {capitalize(groupId)}</Text>
        <Text style={styles.metaLine}>Difficulty: {capitalize(difficulty)}</Text>
      </View>

      <View style={styles.statsRow}>
        <StatCard label="Correct" value={correct} emoji="✅" />
        <StatCard label="Mistakes" value={incorrect} emoji="🌱" />
        <StatCard label="Badges" value={totalAchievements} emoji="🏅" />
      </View>

      {newlyUnlocked.length > 0 ? (
        <View style={styles.newBadges}>
          <Text style={styles.newBadgesTitle}>New badge unlocked!</Text>
          <View style={styles.badgeRow}>
            {newlyUnlocked.map((id) => {
              const a = getAchievementItem(id);
              return (
                <AchievementBadge key={id} achievement={a} unlocked />
              );
            })}
          </View>
        </View>
      ) : null}

      <View style={styles.buttons}>
        <AppButton label="Next Task" emoji="✨" variant="primary" onPress={onNextTask} />
        <AppButton
          label="Choose Park Zone"
          emoji="🗺️"
          variant="accent"
          onPress={() => navigation.navigate("ParkZone")}
        />
        <AppButton
          label="Achievements"
          emoji="🏅"
          variant="secondary"
          onPress={() => navigation.navigate("Achievements")}
        />
        <AppButton
          label="Home"
          emoji="🏠"
          variant="secondary"
          onPress={() => navigation.navigate("ZuzuHome")}
        />
      </View>
    </ScreenContainer>
  );
}

function capitalize(value) {
  if (!value || typeof value !== "string") return "";
  return value.charAt(0).toUpperCase() + value.slice(1).replace("_", " ");
}

const styles = StyleSheet.create({
  hero: {
    alignItems: "center",
    marginTop: 6,
    marginBottom: 14,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.primary,
    marginTop: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: colors.mutedText,
    marginTop: 4,
    textAlign: "center",
  },
  metaBox: {
    backgroundColor: colors.board,
    borderRadius: layout.radius,
    borderWidth: 2,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 12,
  },
  metaLine: {
    fontSize: 15,
    color: colors.text,
    marginVertical: 2,
    fontWeight: "600",
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 8,
  },
  newBadges: {
    marginTop: 8,
    marginBottom: 4,
  },
  newBadgesTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.accent,
    textAlign: "center",
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  buttons: {
    marginTop: 14,
  },
});
