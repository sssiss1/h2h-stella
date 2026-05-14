import { stellaProfile } from "@/game/stella/profile";
import { StatPanel } from "@/components/StatPanel";
import type { GameState } from "@/game/types";

interface Props {
  state: GameState;
  onEnter: () => void;
}

export function StellaRouteCard({ state, onEnter }: Props) {
  return (
    <section className="panel route-card">
      <div>
        <p className="eyebrow">攻略对象</p>
        <h1>{stellaProfile.displayName}</h1>
        <p>{stellaProfile.publicPersona}</p>
      </div>
      <div className="split">
        <article>
          <h2>私下性格</h2>
          <p>{stellaProfile.privatePersonality}</p>
        </article>
        <article>
          <h2>恋爱雷区</h2>
          <ul>
            {stellaProfile.redFlags.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>
      <div className="tag-row">
        {stellaProfile.keywords.map((keyword) => (
          <span key={keyword}>{keyword}</span>
        ))}
      </div>
      <article className="initial-stats">
        <h2>初始属性</h2>
        <StatPanel stats={state.stats} />
      </article>
      <p className="notice">初始关系阶段：{state.relationshipStage.label}</p>
      <button type="button" onClick={onEnter}>
        进入剧情
      </button>
    </section>
  );
}
