import type { Choice, GameState, GameStats } from "@/game/types";

export type PlayerAction =
  | { type: "choice"; choiceId: string; label: string; intent?: Choice["intent"] }
  | { type: "free"; text: string };

export interface GenerateTurnRequest {
  state: GameState;
  action: PlayerAction;
}

export interface GenerateTurnResult {
  state: GameState;
  statChanges: Partial<GameStats>;
  warnings: string[];
}

export interface DmProvider {
  id: "mock" | "openai";
  generateTurn(request: GenerateTurnRequest): Promise<GenerateTurnResult>;
}
