import type { RelationshipStage } from "@/game/types";

export const relationshipStages: RelationshipStage[] = [
  { id: "stranger", label: "陌生人", minAffection: 0 },
  { id: "remembered", label: "有印象", minAffection: 16 },
  { id: "interested", label: "产生兴趣", minAffection: 31 },
  { id: "ambiguous", label: "暧昧期", minAffection: 51 },
  { id: "confirmed", label: "确认关系", minAffection: 66 },
  { id: "in_love", label: "热恋期", minAffection: 81 },
  { id: "trial", label: "考验期", minAffection: 91 }
];

export function getRelationshipStage(affection: number): RelationshipStage {
  return relationshipStages.reduce((current, stage) => {
    return affection >= stage.minAffection ? stage : current;
  }, relationshipStages[0]);
}
