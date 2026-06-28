// Fullscreen / keep-awake helpers.
//
// Fullscreen sticky immersive behavior is primarily handled declaratively with
// the <SystemBars> component from react-native-edge-to-edge (see App.js and the
// task screens). These imperative helpers add a best-effort fallback and the
// keep-awake control used only on the active task/game screens.
//
// Every call is fully guarded so the app never crashes if an API is missing on
// a given platform or SDK version.

import { Platform } from "react-native";

const KEEP_AWAKE_TAG = "zuzu-logic-park-task";

// Lazily and safely load optional native modules.
function loadKeepAwake() {
  try {
    // eslint-disable-next-line global-require
    return require("expo-keep-awake");
  } catch (e) {
    return null;
  }
}

function loadSystemBars() {
  try {
    // eslint-disable-next-line global-require
    const mod = require("react-native-edge-to-edge");
    return mod?.SystemBars || null;
  } catch (e) {
    return null;
  }
}

// Hide the status and navigation bars (Android sticky immersive).
// Safe no-op if the API is unavailable.
export function enableStickyImmersiveMode() {
  try {
    const SystemBars = loadSystemBars();
    if (SystemBars && typeof SystemBars.setHidden === "function") {
      SystemBars.setHidden(true);
    }
  } catch (e) {
    // Ignore: declarative <SystemBars hidden /> already handles the common case.
  }
}

// Show the system bars again (used when leaving an immersive screen).
export function showSystemBars() {
  try {
    const SystemBars = loadSystemBars();
    if (SystemBars && typeof SystemBars.setHidden === "function") {
      SystemBars.setHidden(false);
    }
  } catch (e) {
    // Ignore.
  }
}

// Keep the screen awake while a child is actively working on a task.
export function activateGameKeepAwake() {
  try {
    const keepAwake = loadKeepAwake();
    if (keepAwake && typeof keepAwake.activateKeepAwakeAsync === "function") {
      keepAwake.activateKeepAwakeAsync(KEEP_AWAKE_TAG);
    } else if (keepAwake && typeof keepAwake.activateKeepAwake === "function") {
      keepAwake.activateKeepAwake(KEEP_AWAKE_TAG);
    }
  } catch (e) {
    // Keep awake is a nicety, not a requirement.
  }
}

// Release keep-awake when leaving an active task screen.
export function deactivateGameKeepAwake() {
  try {
    const keepAwake = loadKeepAwake();
    if (keepAwake && typeof keepAwake.deactivateKeepAwake === "function") {
      keepAwake.deactivateKeepAwake(KEEP_AWAKE_TAG);
    }
  } catch (e) {
    // Ignore.
  }
}

// Alias kept for clarity at call sites that just want to ensure keep-awake is
// released on static screens.
export function disableKeepAwakeSafely() {
  deactivateGameKeepAwake();
}

export { Platform };
