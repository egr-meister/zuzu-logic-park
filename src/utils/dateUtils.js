// Small, crash-safe date helpers. All local; no network, no tracking.

// Returns the current time as an ISO string.
export function getNowIso() {
  try {
    return new Date().toISOString();
  } catch (e) {
    return "";
  }
}

// Formats an ISO string into a friendly local date/time.
// Returns a safe placeholder for missing or invalid input.
export function formatDateTime(isoString) {
  if (!isoString || typeof isoString !== "string") return "—";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "—";
  try {
    const datePart = date.toLocaleDateString();
    const timePart = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return datePart + " " + timePart;
  } catch (e) {
    return "—";
  }
}
