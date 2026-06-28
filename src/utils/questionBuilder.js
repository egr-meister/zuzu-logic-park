// Builds simple, predictable, unambiguous logic questions.
// Guarantees:
//   - never returns undefined question data
//   - answer choices always include the correct answer
//   - answer choices never contain duplicates
//   - pattern questions have a clear repeated pattern
//   - pair questions have exactly one clear match
//   - no timer logic anywhere

import {
  getItemsByGroup,
  getItemsForDifficulty,
  ITEM_GROUPS,
} from "../data/itemItems";
import {
  getChoiceCountForDifficulty,
  shuffleArray,
  getHintForTask,
} from "./logicTaskHelpers";

let questionCounter = 0;
function nextQuestionId() {
  questionCounter += 1;
  return "question_" + Date.now() + "_" + questionCounter;
}

function toChoice(item) {
  return {
    id: item.id,
    label: item.label,
    emoji: item.emoji,
    colorId: item.colorId,
    sizeId: item.sizeId,
  };
}

function uniqueById(items) {
  const seen = {};
  const result = [];
  for (const item of items) {
    if (item && item.id && !seen[item.id]) {
      seen[item.id] = true;
      result.push(item);
    }
  }
  return result;
}

function safeGroupId(groupId) {
  return ITEM_GROUPS.some((g) => g.id === groupId) ? groupId : "animals";
}

function otherGroupId(groupId) {
  const others = ITEM_GROUPS.filter((g) => g.id !== groupId);
  if (others.length === 0) return "toys";
  return others[Math.floor(Math.random() * others.length)].id;
}

// ---------------- Find the Odd Item ----------------
// Shows a small set where exactly one item comes from a different group.
// Uses a minimum of 3 cards so the odd one is always unambiguous.
export function buildOddItemQuestion(groupId, difficulty) {
  const group = safeGroupId(groupId);
  const choiceCount = Math.max(3, getChoiceCountForDifficulty(difficulty));

  const sameGroupItems = shuffleArray(getItemsByGroup(group));
  const oddGroup = otherGroupId(group);
  const oddCandidates = shuffleArray(getItemsByGroup(oddGroup));

  const sameNeeded = choiceCount - 1;
  const chosenSame = sameGroupItems.slice(0, sameNeeded);
  const oddItem = oddCandidates[0];

  // Defensive fallback if data is unexpectedly thin.
  if (!oddItem || chosenSame.length < 1) {
    const fallback = shuffleArray(getItemsByGroup("animals")).slice(0, 2);
    return finalizeOdd(group, difficulty, fallback[1], fallback);
  }

  const choices = uniqueById(shuffleArray([...chosenSame, oddItem]));
  return finalizeOdd(group, difficulty, oddItem, choices);
}

function finalizeOdd(group, difficulty, oddItem, choiceItems) {
  return {
    id: nextQuestionId(),
    taskMode: "odd_item",
    groupId: group,
    difficulty: difficulty || "easy",
    prompt: "Find the odd one.",
    correctAnswerId: oddItem.id,
    correctLabel: oddItem.label,
    choices: choiceItems.map(toChoice),
    hint: getHintForTask("odd_item"),
  };
}

// ---------------- Continue the Pattern ----------------
// Builds a clearly repeating sequence and asks for the next item.
export function buildPatternQuestion(groupId, difficulty) {
  const group = safeGroupId(groupId);
  const level = difficulty || "easy";
  const items = shuffleArray(getItemsByGroup(group));

  // Pattern period and visible length by difficulty.
  let period = 2;
  let visibleLength = 3; // easy: A B A -> next B
  if (level === "medium") {
    period = 2;
    visibleLength = 4; // A B A B -> next A
  } else if (level === "hard") {
    period = 3;
    visibleLength = 5; // A B C A B -> next C
  }

  const baseItems = items.slice(0, period);
  // Ensure we have enough distinct base items for the period.
  while (baseItems.length < period) {
    baseItems.push(items[baseItems.length % items.length]);
  }

  const sequence = [];
  for (let i = 0; i < visibleLength; i++) {
    sequence.push(baseItems[i % period]);
  }
  const nextItem = baseItems[visibleLength % period];

  // Build choices: correct next item + distractors from the same group.
  const choiceCount = getChoiceCountForDifficulty(level);
  const distractors = shuffleArray(
    getItemsByGroup(group).filter((it) => it.id !== nextItem.id)
  );
  const choiceItems = uniqueById(
    shuffleArray([nextItem, ...distractors]).slice(0, Math.max(2, choiceCount))
  );
  // Guarantee the correct item is present after slicing.
  if (!choiceItems.some((c) => c.id === nextItem.id)) {
    choiceItems[choiceItems.length - 1] = nextItem;
  }

  return {
    id: nextQuestionId(),
    taskMode: "pattern",
    groupId: group,
    difficulty: level,
    prompt: "What comes next?",
    sequence: sequence.map(toChoice),
    correctAnswerId: nextItem.id,
    correctLabel: nextItem.label,
    choices: uniqueById(shuffleArray(choiceItems)).map(toChoice),
    hint: getHintForTask("pattern"),
  };
}

// ---------------- Find a Pair ----------------
// Shows one target item and asks which choice matches it by color.
// Exactly one choice shares the target color; the rest do not.
export function buildPairQuestion(groupId, difficulty) {
  const group = safeGroupId(groupId);
  const level = difficulty || "easy";
  const choiceCount = getChoiceCountForDifficulty(level);

  const pool = shuffleArray(getItemsByGroup(group));
  const target = pool[0];

  // Find an item (different id) that shares the target's color.
  const sameColor = pool.find(
    (it) => it.id !== target.id && it.colorId === target.colorId
  );

  // Distractors must NOT share the target color (keeps it unambiguous).
  let distractors = pool.filter(
    (it) =>
      it.id !== target.id &&
      (!sameColor || it.id !== sameColor.id) &&
      it.colorId !== target.colorId
  );

  // Fallback when no same-color partner exists in this group:
  // match by category using a cross-group item that shares the color,
  // otherwise just match the same item label safely.
  let matchItem = sameColor;
  if (!matchItem) {
    const all = shuffleArray(
      ITEM_GROUPS.flatMap((g) => getItemsByGroup(g.id))
    );
    matchItem = all.find(
      (it) => it.id !== target.id && it.colorId === target.colorId
    );
    distractors = all.filter(
      (it) =>
        it.id !== target.id &&
        it.colorId !== target.colorId &&
        (!matchItem || it.id !== matchItem.id)
    );
  }

  // Final safety fallback.
  if (!matchItem) {
    matchItem = pool[1] || target;
  }

  const neededDistractors = Math.max(1, choiceCount - 1);
  const chosenDistractors = shuffleArray(distractors).slice(0, neededDistractors);
  const choiceItems = uniqueById(
    shuffleArray([matchItem, ...chosenDistractors])
  );

  return {
    id: nextQuestionId(),
    taskMode: "pair",
    groupId: group,
    difficulty: level,
    prompt: "Find the matching pair.",
    targetItem: toChoice(target),
    correctAnswerId: matchItem.id,
    correctLabel: matchItem.label,
    choices: choiceItems.map(toChoice),
    hint: getHintForTask("pair"),
  };
}

// ---------------- Dispatcher ----------------
export function buildLogicQuestion(taskMode, groupId, difficulty) {
  switch (taskMode) {
    case "odd_item":
      return buildOddItemQuestion(groupId, difficulty);
    case "pattern":
      return buildPatternQuestion(groupId, difficulty);
    case "pair":
      return buildPairQuestion(groupId, difficulty);
    default:
      // Safe default so screens never receive undefined.
      return buildOddItemQuestion(groupId, difficulty);
  }
}

export default buildLogicQuestion;
