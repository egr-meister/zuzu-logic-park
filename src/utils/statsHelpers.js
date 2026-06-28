// Learning statistics helpers. All values are local and never become NaN.

const TASK_MODE_KEYS = ["odd_item", "pattern", "pair", "sort_color", "sort_size"];
const GROUP_KEYS = ["animals", "toys", "fruits"];

// Returns a fresh, fully-populated stats object.
export function createDefaultStats() {
  const byTaskMode = {};
  for (const key of TASK_MODE_KEYS) {
    byTaskMode[key] = { completed: 0, correct: 0, incorrect: 0 };
  }
  const byGroup = {};
  for (const key of GROUP_KEYS) {
    byGroup[key] = { completed: 0 };
  }
  return {
    correct: 0,
    incorrect: 0,
    completedTasks: 0,
    hintsUsed: 0,
    byTaskMode,
    byGroup,
  };
}

// Deep-merges stored stats with defaults so missing keys never crash the app.
export function mergeStats(stored) {
  const base = createDefaultStats();
  if (!stored || typeof stored !== "object") return base;

  const merged = {
    correct: toNumber(stored.correct),
    incorrect: toNumber(stored.incorrect),
    completedTasks: toNumber(stored.completedTasks),
    hintsUsed: toNumber(stored.hintsUsed),
    byTaskMode: { ...base.byTaskMode },
    byGroup: { ...base.byGroup },
  };

  for (const key of TASK_MODE_KEYS) {
    const node = stored.byTaskMode?.[key] || {};
    merged.byTaskMode[key] = {
      completed: toNumber(node.completed),
      correct: toNumber(node.correct),
      incorrect: toNumber(node.incorrect),
    };
  }
  for (const key of GROUP_KEYS) {
    const node = stored.byGroup?.[key] || {};
    merged.byGroup[key] = { completed: toNumber(node.completed) };
  }
  return merged;
}

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

// Records the result of one completed task into a new stats object.
export function recordTaskResult(stats, result) {
  const base = mergeStats(stats);
  const r = result || {};
  const mode = TASK_MODE_KEYS.includes(r.taskMode) ? r.taskMode : null;
  const group = GROUP_KEYS.includes(r.groupId) ? r.groupId : null;

  const correct = toNumber(r.correct);
  const incorrect = toNumber(r.incorrect);
  const hintsUsed = toNumber(r.hintsUsed);

  base.correct += correct;
  base.incorrect += incorrect;
  base.hintsUsed += hintsUsed;
  base.completedTasks += 1;

  if (mode) {
    base.byTaskMode[mode].completed += 1;
    base.byTaskMode[mode].correct += correct;
    base.byTaskMode[mode].incorrect += incorrect;
  }
  if (group) {
    base.byGroup[group].completed += 1;
  }
  return base;
}

export function getTotalCorrect(stats) {
  return mergeStats(stats).correct;
}

export function getTotalIncorrect(stats) {
  return mergeStats(stats).incorrect;
}

export function getTotalCompletedTasks(stats) {
  return mergeStats(stats).completedTasks;
}

export function getHintsUsed(stats) {
  return mergeStats(stats).hintsUsed;
}

// Returns a fresh empty stats object (used by the reset flow).
export function resetStats() {
  return createDefaultStats();
}

export { TASK_MODE_KEYS, GROUP_KEYS };
