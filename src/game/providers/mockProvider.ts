import { getRelationshipStage } from "@/game/stages";
import { defaultChoices, sceneFromTemplate, stellaEvents } from "@/game/stella/events";
import type { GameState, GameStats } from "@/game/types";
import type { DmProvider, GenerateTurnRequest, GenerateTurnResult, PlayerAction } from "./types";

function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

function classifyIntent(action: PlayerAction): "professional" | "warm" | "withdraw" | "bold" | "careful" {
  if (action.type === "choice" && action.intent && action.intent !== "free") {
    return action.intent;
  }

  const text = action.type === "choice" ? `${action.choiceId} ${action.label}` : action.text;
  if (/专业|工作|克制|翻译|边界|professional/i.test(text)) return "professional";
  if (/关心|善意|照顾|水|温柔|care/i.test(text)) return "warm";
  if (/后退|离开|降低风险|不打扰|withdraw/i.test(text)) return "withdraw";
  if (/靠近|直接|表白|追问|bold/i.test(text)) return "bold";
  return "careful";
}

function changesForIntent(intent: ReturnType<typeof classifyIntent>, state: GameState): Partial<GameStats> {
  const base: Record<ReturnType<typeof classifyIntent>, Partial<GameStats>> = {
    professional: { affection: 3, companyAlertness: -2, careerPressure: -1 },
    warm: { affection: 4, mood: 2, secrecy: -2 },
    withdraw: { secrecy: 4, companyAlertness: -3, mood: -2 },
    bold: { affection: 5, secrecy: -8, companyAlertness: 6, careerPressure: 3 },
    careful: { affection: 2, mood: 1, secrecy: 1 }
  };

  const changes = { ...base[intent] };
  if (state.player.pacing === "high_pressure") {
    changes.companyAlertness = (changes.companyAlertness ?? 0) + 3;
    changes.careerPressure = (changes.careerPressure ?? 0) + 2;
  }
  if (state.player.pacing === "healing") {
    changes.mood = (changes.mood ?? 0) + 2;
  }
  return changes;
}

function applyStatChanges(stats: GameStats, changes: Partial<GameStats>): GameStats {
  return {
    affection: clamp(stats.affection + (changes.affection ?? 0)),
    publicAttention: clamp(stats.publicAttention + (changes.publicAttention ?? 0)),
    mood: clamp(stats.mood + (changes.mood ?? 0)),
    money: Math.max(0, stats.money + (changes.money ?? 0)),
    secrecy: clamp(stats.secrecy + (changes.secrecy ?? 0)),
    companyAlertness: clamp(stats.companyAlertness + (changes.companyAlertness ?? 0)),
    careerPressure: clamp(stats.careerPressure + (changes.careerPressure ?? 0))
  };
}

function selectEvent(state: GameState) {
  const candidates = stellaEvents.filter((event) => event.identities.includes(state.player.identity));
  return candidates[state.week % candidates.length] ?? stellaEvents[0];
}

export const mockProvider: DmProvider = {
  id: "mock",
  async generateTurn(request: GenerateTurnRequest): Promise<GenerateTurnResult> {
    const intent = classifyIntent(request.action);
    const statChanges = changesForIntent(intent, request.state);
    const stats = applyStatChanges(request.state.stats, statChanges);
    const template = selectEvent(request.state);
    const scene = sceneFromTemplate(template);
    const currentScene = { ...scene };
    const relationshipStage = getRelationshipStage(stats.affection);
    const week = request.state.week + 1;

    const selectedAction =
      request.action.type === "choice" ? request.action.label : `自由行动：${request.action.text}`;

    const state: GameState = {
      ...request.state,
      week,
      stats,
      relationshipStage,
      currentScene,
      currentChoices: defaultChoices.map((choice) => ({ ...choice })),
      history: [
        ...request.state.history,
        {
          id: `${scene.id}-${week}`,
          week,
          scene: { ...scene },
          selectedAction,
          statChanges
        }
      ],
      updatedAt: new Date().toISOString()
    };

    const warnings: string[] = [];
    if (stats.secrecy < 35) warnings.push("恋情保密度偏低，后续可能触发曝光危机。");
    if (stats.companyAlertness > 75) warnings.push("公司警觉度偏高，经纪人可能介入。");
    if (stats.mood < 25) warnings.push("心情值偏低，玩家可能进入情绪崩溃事件。");

    return { state, statChanges, warnings };
  }
};
