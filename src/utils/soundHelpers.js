// Gentle, optional success feedback.
//
// This app intentionally avoids heavy audio libraries and DOES NOT request any
// device permissions (no microphone, and no vibration permission either).
// Success feedback in Zuzu Logic Park is purely visual (soft scale/opacity
// animation). These helpers are safe no-ops that respect the sound setting so
// the rest of the app can call them without special-casing, and they can never
// crash even if a future audio engine is unavailable.

// Returns true when gentle feedback is allowed by the current settings.
function feedbackEnabled(settings) {
  return settings?.soundEnabled ?? true;
}

// Called on a correct answer. Visual feedback is handled by the screens;
// this hook stays a guarded no-op so no permission or library is required.
export function playCorrectSoundIfEnabled(settings) {
  try {
    if (!feedbackEnabled(settings)) return;
    // Intentionally no audio playback: keeps the app permission-free and
    // fully offline. Visual feedback is shown by the calling screen.
  } catch (e) {
    // Feedback is optional and must never break the experience.
  }
}

// Called when a whole task is completed.
export function playCompleteSoundIfEnabled(settings) {
  try {
    if (!feedbackEnabled(settings)) return;
    // Intentionally no audio playback (see note above).
  } catch (e) {
    // Ignore.
  }
}
