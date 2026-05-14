export type PlayerIdentity = "music_show_staff" | "translator" | "student_part_timer";
export type Pacing = "slow_realistic" | "balanced" | "high_pressure" | "healing";

export type RelationshipStageId =
  | "stranger"
  | "remembered"
  | "interested"
  | "ambiguous"
  | "confirmed"
  | "in_love"
  | "trial";

export interface PlayerProfile {
  name: string;
  age: number;
  identity: PlayerIdentity;
  pacing: Pacing;
}

export interface GameStats {
  affection: number;
  publicAttention: number;
  mood: number;
  money: number;
  secrecy: number;
  companyAlertness: number;
  careerPressure: number;
}

export interface RelationshipStage {
  id: RelationshipStageId;
  label: string;
  minAffection: number;
}

export interface Scene {
  id: string;
  title: string;
  location: string;
  body: string;
  visibleReaction: string;
}

export interface Choice {
  id: string;
  label: string;
  intent: "careful" | "warm" | "bold" | "professional" | "withdraw" | "free";
}

export interface HistoryEntry {
  id: string;
  week: number;
  scene: Scene;
  selectedAction?: string;
  statChanges?: Partial<GameStats>;
}

export interface GameState {
  player: PlayerProfile;
  routeId: "stella";
  week: number;
  stats: GameStats;
  relationshipStage: RelationshipStage;
  currentScene: Scene;
  currentChoices: Choice[];
  history: HistoryEntry[];
  updatedAt: string;
}
