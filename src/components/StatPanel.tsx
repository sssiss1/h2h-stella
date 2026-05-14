import type { GameStats } from "@/game/types";

const statLabels: Array<[keyof GameStats, string]> = [
  ["affection", "好感度"],
  ["publicAttention", "人气值"],
  ["mood", "心情值"],
  ["money", "金钱"],
  ["secrecy", "恋情保密度"],
  ["companyAlertness", "公司警觉度"],
  ["careerPressure", "事业压力"]
];

export function StatPanel({ stats }: { stats: GameStats }) {
  return (
    <div className="stat-grid">
      {statLabels.map(([key, label]) => (
        <div key={key} className="stat-cell">
          <span>{label}</span>
          <strong>{stats[key]}</strong>
        </div>
      ))}
    </div>
  );
}
