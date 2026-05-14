import { describe, expect, it } from "vitest";
import { createInitialGameState } from "@/game/state";
import { mockProvider } from "@/game/providers/mockProvider";

describe("mockProvider", () => {
  it("advances the week and changes at least two stats for a structured choice", async () => {
    const state = createInitialGameState({
      name: "林夏",
      age: 23,
      identity: "music_show_staff",
      pacing: "balanced"
    });

    const result = await mockProvider.generateTurn({
      state,
      action: { type: "choice", choiceId: "quiet-kindness", label: "小声表达善意，但不追问。" }
    });

    expect(result.state.week).toBe(2);
    expect(result.state.history).toHaveLength(2);
    expect(Object.keys(result.statChanges).length).toBeGreaterThanOrEqual(2);
    expect(result.state.currentChoices).toHaveLength(3);
  });

  it("handles free action with a professional intent", async () => {
    const state = createInitialGameState({
      name: "林夏",
      age: 23,
      identity: "translator",
      pacing: "balanced"
    });

    const result = await mockProvider.generateTurn({
      state,
      action: { type: "free", text: "我用准确但克制的翻译帮她解围，不额外解释私人情绪。" }
    });

    expect(result.state.stats.affection).toBeGreaterThan(state.stats.affection);
    expect(result.state.currentScene.body).toContain("斯特拉（Stella）");
  });

  it("returns fresh scene and choice objects for generated turns", async () => {
    const state = createInitialGameState({
      name: "林夏",
      age: 23,
      identity: "student_part_timer",
      pacing: "balanced"
    });

    const first = await mockProvider.generateTurn({
      state,
      action: { type: "choice", choiceId: "offer-small-care", label: "完全改写过的文案", intent: "warm" }
    });
    const second = await mockProvider.generateTurn({
      state,
      action: { type: "choice", choiceId: "offer-small-care", label: "完全改写过的文案", intent: "warm" }
    });

    first.state.currentChoices[0].label = "污染选项";
    first.state.currentScene.title = "污染标题";
    first.state.history[1].scene.location = "污染地点";

    expect(first.state.stats.affection - state.stats.affection).toBe(4);
    expect(second.state.currentChoices[0].label).toBe("用专业方式回应，不把私人情绪带进去。");
    expect(second.state.currentScene.title).not.toBe("污染标题");
    expect(second.state.history[1].scene.location).not.toBe("污染地点");
  });
});
