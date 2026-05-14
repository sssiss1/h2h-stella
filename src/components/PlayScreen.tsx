"use client";

import { useState } from "react";
import { StatPanel } from "@/components/StatPanel";
import { generateGameTurn } from "@/game/actions";
import type { Choice, GameState } from "@/game/types";

interface Props {
  state: GameState;
  onStateChange: (state: GameState) => void;
  onReset: () => void;
}

export function PlayScreen({ state, onStateChange, onReset }: Props) {
  const [freeText, setFreeText] = useState("");
  const [warnings, setWarnings] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitChoice(choice: Choice) {
    setIsLoading(true);
    setError(null);

    try {
      const result = await generateGameTurn({
        state,
        action: { type: "choice", choiceId: choice.id, label: choice.label, intent: choice.intent }
      });
      setWarnings(result.warnings);
      onStateChange(result.state);
    } catch {
      setError("剧情推进失败，请再试一次。");
    } finally {
      setIsLoading(false);
    }
  }

  async function submitFreeAction() {
    if (!freeText.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await generateGameTurn({
        state,
        action: { type: "free", text: freeText.trim() }
      });
      setFreeText("");
      setWarnings(result.warnings);
      onStateChange(result.state);
    } catch {
      setError("自由行动发送失败，请再试一次。");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="play-layout">
      <aside className="panel side-panel">
        <p className="eyebrow">第 {state.week} 周</p>
        <h1>当前关系：{state.relationshipStage.label}</h1>
        <p>当前场景：{state.currentScene.location}</p>
        <StatPanel stats={state.stats} />
        <button type="button" className="secondary-button" onClick={onReset} disabled={isLoading}>
          重置存档
        </button>
      </aside>

      <section className="panel story-panel">
        <p className="eyebrow">当前攻略对象：斯特拉（Stella）</p>
        <h1>{state.currentScene.title}</h1>
        {state.history.length > 1 && (
          <div className="history-list" aria-label="此前剧情记录">
            <p className="eyebrow">此前剧情</p>
            {state.history.slice(0, -1).map((entry) => (
              <article key={entry.id} className="history-entry">
                <p className="eyebrow">第 {entry.week} 周 | {entry.scene.location}</p>
                <h2>{entry.scene.title}</h2>
                {entry.selectedAction && <p className="selected-action">你的行动：{entry.selectedAction}</p>}
                <p>{entry.scene.body}</p>
                <p>{entry.scene.visibleReaction}</p>
              </article>
            ))}
          </div>
        )}
        <div className="story-body">
          <p className="eyebrow">当前回合</p>
          <p>{state.currentScene.body}</p>
          <p>{state.currentScene.visibleReaction}</p>
        </div>

        {warnings.length > 0 && (
          <div className="warning-box">
            {warnings.map((warning) => (
              <p key={warning}>{warning}</p>
            ))}
          </div>
        )}

        {error && (
          <div className="warning-box" role="alert">
            <p>{error}</p>
          </div>
        )}

        <div className="choice-list">
          {state.currentChoices.map((choice) => (
            <button type="button" key={choice.id} onClick={() => submitChoice(choice)} disabled={isLoading}>
              {choice.label}
            </button>
          ))}
        </div>

        <div className="free-action">
          <label htmlFor="free-action-input">自由行动</label>
          <textarea
            id="free-action-input"
            value={freeText}
            onChange={(event) => setFreeText(event.target.value)}
            placeholder="自由行动：写下你想怎么回应。"
            rows={4}
          />
          <button type="button" onClick={submitFreeAction} disabled={isLoading || !freeText.trim()}>
            发送自由行动
          </button>
        </div>
      </section>
    </section>
  );
}
