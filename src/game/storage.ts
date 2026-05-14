import type { GameState } from "@/game/types";

const SAVE_KEY = "h2h.stella.save.v1";

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isValidSavedGame(value: unknown): value is GameState {
  if (!isRecord(value)) return false;
  if (!isRecord(value.player) || !isRecord(value.stats) || !isRecord(value.currentScene)) return false;
  if (!Array.isArray(value.currentChoices) || !Array.isArray(value.history)) return false;

  return (
    value.routeId === "stella" &&
    typeof value.week === "number" &&
    typeof value.player.name === "string" &&
    typeof value.player.age === "number" &&
    typeof value.player.identity === "string" &&
    typeof value.player.pacing === "string" &&
    typeof value.stats.affection === "number" &&
    typeof value.stats.publicAttention === "number" &&
    typeof value.stats.mood === "number" &&
    typeof value.stats.money === "number" &&
    typeof value.stats.secrecy === "number" &&
    typeof value.stats.companyAlertness === "number" &&
    typeof value.stats.careerPressure === "number" &&
    typeof value.currentScene.title === "string" &&
    value.currentChoices.length > 0 &&
    value.history.length > 0
  );
}

function removeSave(storage: Storage): void {
  try {
    storage.removeItem(SAVE_KEY);
  } catch {
    // Corrupt saves are ignored even if cleanup is unavailable.
  }
}

export function saveGame(state: GameState): void {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    // Saving should never break active gameplay.
  }
}

export function loadSavedGame(): GameState | null {
  const storage = getStorage();
  if (!storage) return null;

  let raw: string | null;
  try {
    raw = storage.getItem(SAVE_KEY);
  } catch {
    return null;
  }

  try {
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!isValidSavedGame(parsed)) {
      removeSave(storage);
      return null;
    }
    return parsed;
  } catch {
    removeSave(storage);
    return null;
  }
}

export function clearSavedGame(): void {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.removeItem(SAVE_KEY);
  } catch {
    // Clearing should be best-effort in restricted storage contexts.
  }
}
