// Task Picker — choose an item group and a difficulty, then start the task.

import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import ScreenContainer from "../components/ScreenContainer";
import TaskModeCard from "../components/TaskModeCard";
import DifficultyChip from "../components/DifficultyChip";
import AppButton from "../components/AppButton";
import { colors } from "../theme/colors";
import {
  ITEM_GROUP_OPTIONS,
  DIFFICULTIES,
  getTaskMode,
} from "../data/taskItems";
import { getParkZoneItem } from "../data/parkZoneItems";
import { loadAppData } from "../storage/appStorage";
import { disableKeepAwakeSafely } from "../utils/immersiveHelpers";

export default function TaskPickerScreen({ navigation, route }) {
  const taskMode = route?.params?.taskMode ?? "odd_item";
  const zoneId = route?.params?.zoneId ?? taskMode;
  const zone = getParkZoneItem(zoneId);
  const modeInfo = getTaskMode(taskMode);

  const [groupId, setGroupId] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [error, setError] = useState("");

  useFocusEffect(
    useCallback(() => {
      let active = true;
      disableKeepAwakeSafely();
      loadAppData().then((data) => {
        // Pre-select the parent's default difficulty for convenience.
        if (active && !difficulty) {
          setDifficulty(data?.settings?.defaultDifficulty ?? "easy");
        }
      });
      return () => {
        active = false;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

  const onStart = () => {
    if (!groupId) {
      setError("Please choose a group.");
      return;
    }
    if (!difficulty) {
      setError("Please choose a difficulty.");
      return;
    }
    setError("");

    const params = { zoneId, taskMode, groupId, difficulty };
    if (modeInfo.kind === "sorting") {
      navigation.navigate("SortingTask", params);
    } else {
      navigation.navigate("LogicTask", params);
    }
  };

  const groups = ITEM_GROUP_OPTIONS ?? [];
  const difficulties = DIFFICULTIES ?? [];

  return (
    <ScreenContainer>
      <Text style={styles.zone}>
        {(zone?.emoji || modeInfo.emoji) + "  " + (zone?.label || modeInfo.label)}
      </Text>
      <Text style={styles.subtitle}>{zone?.description || modeInfo.label}</Text>

      <Text style={styles.section}>Choose a group</Text>
      <View style={styles.row}>
        {groups.map((g) => (
          <TaskModeCard
            key={g.id}
            option={g}
            selected={groupId === g.id}
            onPress={() => {
              setGroupId(g.id);
              setError("");
            }}
          />
        ))}
      </View>

      <Text style={styles.section}>Choose a difficulty</Text>
      <View style={styles.row}>
        {difficulties.map((d) => (
          <DifficultyChip
            key={d.id}
            difficulty={d}
            selected={difficulty === d.id}
            onPress={() => {
              setDifficulty(d.id);
              setError("");
            }}
          />
        ))}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.buttons}>
        <AppButton
          label="Start Task"
          emoji="✨"
          variant="primary"
          onPress={onStart}
        />
        <AppButton
          label="Back"
          emoji="↩️"
          variant="secondary"
          onPress={() => navigation.goBack()}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  zone: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.primary,
  },
  subtitle: {
    fontSize: 15,
    color: colors.mutedText,
    marginBottom: 10,
    marginTop: 2,
  },
  section: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  error: {
    color: colors.danger,
    fontSize: 15,
    fontWeight: "700",
    marginTop: 14,
    textAlign: "center",
  },
  buttons: {
    marginTop: 18,
  },
});
