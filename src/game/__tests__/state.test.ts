import { describe, expect, it } from "vitest";
import { createInitialGameState } from "@/game/state";
import { getRelationshipStage } from "@/game/stages";

describe("game state", () => {
  it("creates identity-specific initial state for a translator", () => {
    const state = createInitialGameState({
      name: "林夏",
      age: 23,
      identity: "translator",
      pacing: "balanced"
    });

    expect(state.player.name).toBe("林夏");
    expect(state.routeId).toBe("stella");
    expect(state.week).toBe(1);
    expect(state.stats.secrecy).toBe(100);
    expect(state.stats.companyAlertness).toBeGreaterThanOrEqual(18);
    expect(state.currentScene.location).toContain("海外");
  });

  it("maps affection to relationship stages without skipping early stages", () => {
    expect(getRelationshipStage(8).label).toBe("陌生人");
    expect(getRelationshipStage(22).label).toBe("有印象");
    expect(getRelationshipStage(52).label).toBe("暧昧期");
    expect(getRelationshipStage(91).label).toBe("考验期");
  });

  it("returns fresh state objects for each new game", () => {
    const first = createInitialGameState({
      name: "林夏",
      age: 23,
      identity: "translator",
      pacing: "balanced"
    });
    const second = createInitialGameState({
      name: "林夏",
      age: 23,
      identity: "translator",
      pacing: "balanced"
    });

    first.stats.affection = 99;
    first.currentScene.title = "污染测试";
    first.currentChoices[0].label = "污染选项";
    first.history[0].scene.location = "污染地点";

    expect(second.stats.affection).toBe(7);
    expect(second.currentScene.title).toBe("海外采访前的耳返");
    expect(second.currentChoices[0].label).toBe("保持专业距离，不让她为难。");
    expect(second.history[0].scene.location).toBe("海外品牌活动后台翻译席");
  });
});
