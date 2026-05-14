import { beforeEach, describe, expect, it, vi } from "vitest";
import { createInitialGameState } from "@/game/state";
import { clearSavedGame, loadSavedGame, saveGame } from "@/game/storage";

function createStorageDouble(): Storage {
  const values = new Map<string, string>();

  return {
    get length() {
      return values.size;
    },
    clear: () => values.clear(),
    getItem: (key: string) => values.get(key) ?? null,
    key: (index: number) => Array.from(values.keys())[index] ?? null,
    removeItem: (key: string) => {
      values.delete(key);
    },
    setItem: (key: string, value: string) => {
      values.set(key, value);
    }
  };
}

describe("storage", () => {
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: createStorageDouble()
    });
    window.localStorage.clear();
  });

  it("saves, loads, and clears a game state", () => {
    const state = createInitialGameState({
      name: "林夏",
      age: 23,
      identity: "student_part_timer",
      pacing: "balanced"
    });

    saveGame(state);
    expect(loadSavedGame()?.player.name).toBe("林夏");

    clearSavedGame();
    expect(loadSavedGame()).toBeNull();
  });

  it("cleans up invalid saved JSON", () => {
    window.localStorage.setItem("h2h.stella.save.v1", "{not-json");

    expect(loadSavedGame()).toBeNull();
    expect(window.localStorage.getItem("h2h.stella.save.v1")).toBeNull();
  });

  it("cleans up valid JSON that is not a game state", () => {
    window.localStorage.setItem("h2h.stella.save.v1", "{}");

    expect(loadSavedGame()).toBeNull();
    expect(window.localStorage.getItem("h2h.stella.save.v1")).toBeNull();
  });

  it("does not throw when storage methods fail", () => {
    const throwingStorage = {
      get length() {
        return 0;
      },
      clear: vi.fn(),
      getItem: vi.fn(() => {
        throw new Error("blocked");
      }),
      key: vi.fn(),
      removeItem: vi.fn(() => {
        throw new Error("blocked");
      }),
      setItem: vi.fn(() => {
        throw new Error("quota");
      })
    } satisfies Storage;

    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: throwingStorage
    });

    const state = createInitialGameState({
      name: "林夏",
      age: 23,
      identity: "student_part_timer",
      pacing: "balanced"
    });

    expect(() => saveGame(state)).not.toThrow();
    expect(loadSavedGame()).toBeNull();
    expect(() => clearSavedGame()).not.toThrow();
  });

  it("does not throw when localStorage is unavailable", () => {
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get() {
        throw new Error("security");
      }
    });

    const state = createInitialGameState({
      name: "林夏",
      age: 23,
      identity: "student_part_timer",
      pacing: "balanced"
    });

    expect(() => saveGame(state)).not.toThrow();
    expect(loadSavedGame()).toBeNull();
    expect(() => clearSavedGame()).not.toThrow();
  });
});
