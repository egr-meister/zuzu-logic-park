// Simple, calm React Native Animated configs.
// No heavy animation libraries, no flashing, no stressful motion.
// All values are gentle and safe in release builds.

// Soft scale-up "pop" used when an answer is correct.
export function getCorrectAnswerAnimationConfig() {
  return {
    toValue: 1.08,
    duration: 220,
    useNativeDriver: true,
    restValue: 1,
  };
}

// Gentle fade/scale used on the task complete screen.
export function getTaskCompleteAnimationConfig() {
  return {
    toValue: 1,
    fromValue: 0.9,
    duration: 320,
    useNativeDriver: true,
  };
}

// Soft fade-in for a hint card (Zuzu's speech bubble).
export function getHintAnimationConfig() {
  return {
    toValue: 1,
    fromValue: 0,
    duration: 260,
    useNativeDriver: true,
  };
}
