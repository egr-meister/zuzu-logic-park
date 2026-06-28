// Logic Task screen — runs Find the Odd Item, Continue the Pattern, Find a Pair.
// No timer, no countdown, no pressure. Keep-awake is active only here.

import React, { useState, useRef, useEffect, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import ScreenContainer from "../components/ScreenContainer";
import ZuzuCharacter from "../components/ZuzuCharacter";
import ItemCard from "../components/ItemCard";
import PatternRow from "../components/PatternRow";
import PairCard from "../components/PairCard";
import HintCard from "../components/HintCard";
import AppButton from "../components/AppButton";
import EmptyState from "../components/EmptyState";

import { colors, layout } from "../theme/colors";
import { buildLogicQuestion } from "../utils/questionBuilder";
import {
  isCorrectAnswer,
  getMistakesBeforeHint,
  getTaskLabel,
} from "../utils/logicTaskHelpers";
import { loadAppData } from "../storage/appStorage";
import { playCorrectSoundIfEnabled } from "../utils/soundHelpers";
import {
  activateGameKeepAwake,
  deactivateGameKeepAwake,
} from "../utils/immersiveHelpers";

const ENCOURAGEMENTS = ["Take your time.", "Look carefully.", "Zuzu can help."];

function roundsForDifficulty(difficulty) {
  if (difficulty === "medium") return 5;
  if (difficulty === "hard") return 6;
  return 4;
}

export default function LogicTaskScreen({ navigation, route }) {
  const taskMode = route?.params?.taskMode ?? "odd_item";
  const groupId = route?.params?.groupId ?? "animals";
  const difficulty = route?.params?.difficulty ?? "easy";
  const zoneId = route?.params?.zoneId ?? taskMode;

  const totalRounds = roundsForDifficulty(difficulty);
  const hintThreshold = getMistakesBeforeHint(difficulty);

  const [settings, setSettings] = useState(null);
  const [roundIndex, setRoundIndex] = useState(0);
  const [question, setQuestion] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [solved, setSolved] = useState(false);
  const [roundMistakes, setRoundMistakes] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // Accumulated totals across the whole task (refs avoid stale closures).
  const correctRef = useRef(0);
  const incorrectRef = useRef(0);
  const hintsRef = useRef(0);
  const hintCountedRef = useRef(false);
  const advanceTimer = useRef(null);

  // Keep the screen awake only while this active task is on screen.
  useFocusEffect(
    useCallback(() => {
      activateGameKeepAwake();
      return () => {
        deactivateGameKeepAwake();
        if (advanceTimer.current) clearTimeout(advanceTimer.current);
      };
    }, [])
  );

  // Load settings once.
  useEffect(() => {
    let active = true;
    loadAppData().then((data) => {
      if (active) setSettings(data?.settings ?? null);
    });
    return () => {
      active = false;
    };
  }, []);

  // Build a new question whenever the round changes.
  useEffect(() => {
    const q = buildLogicQuestion(taskMode, groupId, difficulty);
    setQuestion(q);
    setSelectedId(null);
    setSolved(false);
    setRoundMistakes(0);
    setShowHint(false);
    hintCountedRef.current = false;
  }, [roundIndex, taskMode, groupId, difficulty]);

  const hintsEnabled = settings?.hintsEnabled ?? true;
  const animationEnabled = settings?.answerAnimationEnabled ?? true;

  const finishTask = useCallback(() => {
    const result = {
      taskMode,
      groupId,
      difficulty,
      correct: correctRef.current,
      incorrect: incorrectRef.current,
      hintsUsed: hintsRef.current,
      completedAt: new Date().toISOString(),
    };
    deactivateGameKeepAwake();
    navigation.replace("TaskResult", { result, zoneId, taskMode, groupId, difficulty });
  }, [navigation, taskMode, groupId, difficulty, zoneId]);

  const handleChoice = (choice) => {
    if (solved || !question) return;
    const correct = isCorrectAnswer(choice.id, question.correctAnswerId);
    setSelectedId(choice.id);

    if (correct) {
      correctRef.current += 1;
      setSolved(true);
      playCorrectSoundIfEnabled(settings);
      advanceTimer.current = setTimeout(() => {
        if (roundIndex + 1 >= totalRounds) {
          finishTask();
        } else {
          setRoundIndex((i) => i + 1);
        }
      }, 850);
    } else {
      incorrectRef.current += 1;
      const newMistakes = roundMistakes + 1;
      setRoundMistakes(newMistakes);
      if (hintsEnabled && newMistakes >= hintThreshold) {
        setShowHint(true);
        if (!hintCountedRef.current) {
          hintsRef.current += 1;
          hintCountedRef.current = true;
        }
      }
      // Allow another try: clear the wrong selection shortly after feedback.
      advanceTimer.current = setTimeout(() => setSelectedId(null), 650);
    }
  };

  const cardStatus = (choice) => {
    if (selectedId !== choice.id) return "none";
    if (solved) return "correct";
    return isCorrectAnswer(choice.id, question?.correctAnswerId)
      ? "correct"
      : "incorrect";
  };

  const choices = question?.choices ?? [];
  const encouragement = ENCOURAGEMENTS[roundIndex % ENCOURAGEMENTS.length];

  return (
    <ScreenContainer>
      <View style={styles.headerRow}>
        <ZuzuCharacter size={56} mood={solved ? "wow" : "happy"} />
        <View style={styles.headerText}>
          <Text style={styles.taskLabel}>{getTaskLabel(taskMode)}</Text>
          <Text style={styles.meta}>
            {capitalize(groupId)} · {capitalize(difficulty)} · Round{" "}
            {Math.min(roundIndex + 1, totalRounds)}/{totalRounds}
          </Text>
        </View>
      </View>

      {!question || choices.length === 0 ? (
        <EmptyState
          title="Let's try another one"
          message="Zuzu is getting a new task ready. Tap Back to choose again."
        />
      ) : (
        <View>
          <View style={styles.promptBox}>
            <Text style={styles.prompt}>{question.prompt}</Text>
            <Text style={styles.encourage}>{encouragement}</Text>
          </View>

          {taskMode === "pattern" ? (
            <View style={styles.visual}>
              <PatternRow sequence={question.sequence} />
            </View>
          ) : null}

          {taskMode === "pair" ? (
            <View style={styles.visual}>
              <PairCard item={question.targetItem} />
            </View>
          ) : null}

          <View style={styles.choices}>
            {choices.map((choice) => (
              <ItemCard
                key={choice.id}
                item={choice}
                status={cardStatus(choice)}
                disabled={solved}
                showColorDot={taskMode === "pair"}
                animationEnabled={animationEnabled}
                onPress={() => handleChoice(choice)}
              />
            ))}
          </View>

          {solved ? (
            <Text style={styles.feedbackGood}>Great thinking!</Text>
          ) : roundMistakes > 0 ? (
            <Text style={styles.feedbackTry}>Good try. Let's look again.</Text>
          ) : null}

          {showHint && hintsEnabled ? (
            <HintCard
              text={question.hint}
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
  visual: {
    alignItems: "center",
    marginBottom: 12,
  },
  choices: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
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
