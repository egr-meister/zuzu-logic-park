// Sorting Task screen — Sort by Color and Sort by Size.
// Simple, reliable tap-to-sort: tap an item, then tap a basket.
// No timer, no pressure. Keep-awake is active only here.

import React, { useState, useRef, useEffect, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import ScreenContainer from "../components/ScreenContainer";
import ZuzuCharacter from "../components/ZuzuCharacter";
import ItemCard from "../components/ItemCard";
import SortingBasket from "../components/SortingBasket";
import HintCard from "../components/HintCard";
import AppButton from "../components/AppButton";
import EmptyState from "../components/EmptyState";

import { colors, layout } from "../theme/colors";
import {
  createSortingTaskState,
  placeItemInBasket,
  getSortingHint,
} from "../utils/sortingTaskHelpers";
import { getMistakesBeforeHint, getTaskLabel } from "../utils/logicTaskHelpers";
import { loadAppData } from "../storage/appStorage";
import {
  playCorrectSoundIfEnabled,
  playCompleteSoundIfEnabled,
} from "../utils/soundHelpers";
import {
  activateGameKeepAwake,
  deactivateGameKeepAwake,
} from "../utils/immersiveHelpers";

export default function SortingTaskScreen({ navigation, route }) {
  const taskMode = route?.params?.taskMode ?? "sort_color";
  const groupId = route?.params?.groupId ?? "animals";
  const difficulty = route?.params?.difficulty ?? "easy";
  const zoneId = route?.params?.zoneId ?? taskMode;
  const hintThreshold = getMistakesBeforeHint(difficulty);

  const [settings, setSettings] = useState(null);
  const [taskState, setTaskState] = useState(() =>
    createSortingTaskState(taskMode, groupId, difficulty)
  );
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [feedback, setFeedback] = useState(""); // "correct" | "incorrect" | ""
  const [showHint, setShowHint] = useState(false);

  const hintCountedRef = useRef(false);
  const hintsUsedRef = useRef(0);
  const finishTimer = useRef(null);

  useFocusEffect(
    useCallback(() => {
      activateGameKeepAwake();
      return () => {
        deactivateGameKeepAwake();
        if (finishTimer.current) clearTimeout(finishTimer.current);
      };
    }, [])
  );

  useEffect(() => {
    let active = true;
    loadAppData().then((data) => {
      if (active) setSettings(data?.settings ?? null);
    });
    return () => {
      active = false;
    };
  }, []);

  const hintsEnabled = settings?.hintsEnabled ?? true;
  const animationEnabled = settings?.answerAnimationEnabled ?? true;

  const items = taskState?.items ?? [];
  const baskets = taskState?.baskets ?? [];
  const placedItemIds = taskState?.placedItemIds ?? [];
  const remaining = items.filter((it) => !placedItemIds.includes(it.id));

  const itemsInBasket = (basketId) => {
    const basket = baskets.find((b) => b.id === basketId);
    if (!basket) return [];
    return items.filter(
      (it) =>
        placedItemIds.includes(it.id) &&
        ((basket.type === "color" && it.colorId === basket.matchValue) ||
          (basket.type === "size" && it.sizeId === basket.matchValue))
    );
  };

  const finishTask = useCallback(
    (finalState) => {
      const result = {
        taskMode,
        groupId,
        difficulty,
        correct: finalState?.correctPlacements ?? 0,
        incorrect: finalState?.mistakes ?? 0,
        hintsUsed: hintsUsedRef.current,
        completedAt: new Date().toISOString(),
      };
      deactivateGameKeepAwake();
      playCompleteSoundIfEnabled(settings);
      navigation.replace("TaskResult", {
        result,
        zoneId,
        taskMode,
        groupId,
        difficulty,
      });
    },
    [navigation, taskMode, groupId, difficulty, zoneId, settings]
  );

  const onBasketPress = (basket) => {
    if (!selectedItemId) {
      setFeedback("");
      return;
    }
    const { state: newState, correct, complete } = placeItemInBasket(
      taskState,
      selectedItemId,
      basket.id
    );
    setTaskState(newState);

    if (correct) {
      setFeedback("correct");
      setSelectedItemId(null);
      setShowHint(false);
      playCorrectSoundIfEnabled(settings);
      if (complete) {
        finishTimer.current = setTimeout(() => finishTask(newState), 700);
      }
    } else {
      setFeedback("incorrect");
      // Item returns to the tray automatically (it was never placed).
      const mistakes = newState?.mistakes ?? 0;
      if (hintsEnabled && mistakes >= hintThreshold) {
        setShowHint(true);
        if (!hintCountedRef.current) {
          hintsUsedRef.current += 1;
          hintCountedRef.current = true;
        }
      }
    }
  };

  const allSorted = remaining.length === 0 && items.length > 0;

  return (
    <ScreenContainer>
      <View style={styles.headerRow}>
        <ZuzuCharacter size={56} mood={feedback === "correct" ? "wow" : "happy"} />
        <View style={styles.headerText}>
          <Text style={styles.taskLabel}>{getTaskLabel(taskMode)}</Text>
          <Text style={styles.meta}>
            {capitalize(groupId)} · {capitalize(difficulty)} · Sorted{" "}
            {placedItemIds.length}/{items.length}
          </Text>
        </View>
      </View>

      {items.length === 0 || baskets.length === 0 ? (
        <EmptyState
          title="Let's try another one"
          message="Zuzu is getting the baskets ready. Tap Back to choose again."
        />
      ) : (
        <View>
          <View style={styles.promptBox}>
            <Text style={styles.prompt}>
              {taskMode === "sort_size" ? "Sort by size." : "Sort by color."}
            </Text>
            <Text style={styles.encourage}>
              {selectedItemId
                ? "Now tap the right basket."
                : "Tap an item, then a basket."}
            </Text>
          </View>

          <View style={styles.tray}>
            {remaining.length === 0 ? (
              <Text style={styles.allDone}>All items sorted! 🎉</Text>
            ) : (
              remaining.map((it) => (
                <ItemCard
                  key={it.id}
                  item={it}
                  size="small"
                  showColorDot={taskMode === "sort_color"}
                  status={selectedItemId === it.id ? "selected" : "none"}
                  animationEnabled={animationEnabled}
                  onPress={() => {
                    setSelectedItemId(it.id);
                    setFeedback("");
                  }}
                />
              ))
            )}
          </View>

          <View style={styles.basketsWrap}>
            {baskets.map((b) => (
              <SortingBasket
                key={b.id}
                basket={b}
                placedItems={itemsInBasket(b.id)}
                highlighted={!!selectedItemId}
                onPress={() => onBasketPress(b)}
              />
            ))}
          </View>

          {feedback === "correct" ? (
            <Text style={styles.feedbackGood}>Great thinking!</Text>
          ) : feedback === "incorrect" ? (
            <Text style={styles.feedbackTry}>Good try. Let's look again.</Text>
          ) : null}

          {showHint && hintsEnabled && !allSorted ? (
            <HintCard
              text={getSortingHint(taskMode)}
              visible
              animationEnabled={animationEnabled}
            />
          ) : null}
        </View>
      )}

      <View style={styles.buttons}>
        <AppButton
          label="Back to Zones"
          emoji="↩️"
          variant="secondary"
          onPress={() => {
            deactivateGameKeepAwake();
            navigation.navigate("ParkZone");
          }}
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  taskLabel: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.primary,
  },
  meta: {
    fontSize: 13,
    color: colors.mutedText,
    marginTop: 2,
  },
  promptBox: {
    backgroundColor: colors.board,
    borderRadius: layout.radius,
    borderWidth: 2,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 12,
  },
  prompt: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
  },
  encourage: {
    fontSize: 14,
    color: colors.mutedText,
    textAlign: "center",
    marginTop: 6,
  },
  tray: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    minHeight: 90,
    marginBottom: 8,
  },
  allDone: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary,
    textAlign: "center",
    paddingVertical: 24,
  },
  basketsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  feedbackGood: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.success,
    textAlign: "center",
    marginTop: 10,
  },
  feedbackTry: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.orange,
    textAlign: "center",
    marginTop: 10,
  },
  buttons: {
    marginTop: 18,
  },
});
