"use client";

import { useEffect, useState } from "react";
import { CharacterCreation } from "@/components/CharacterCreation";
import { FictionNotice } from "@/components/FictionNotice";
import { PlayScreen } from "@/components/PlayScreen";
import { StellaRouteCard } from "@/components/StellaRouteCard";
import { clearSavedGame, loadSavedGame, saveGame } from "@/game/storage";
import { createInitialGameState } from "@/game/state";
import type { GameState, PlayerProfile } from "@/game/types";

type View = "create" | "card" | "play";

export default function HomePage() {
  const [view, setView] = useState<View>("create");
  const [state, setState] = useState<GameState | null>(null);

  useEffect(() => {
    const saved = loadSavedGame();
    if (saved) {
      setState(saved);
      setView("play");
    }
  }, []);

  function handleCreate(profile: PlayerProfile) {
    const nextState = createInitialGameState(profile);
    setState(nextState);
    saveGame(nextState);
    setView("card");
  }

  function handleStateChange(nextState: GameState) {
    setState(nextState);
    saveGame(nextState);
  }

  function handleReset() {
    clearSavedGame();
    setState(null);
    setView("create");
  }

  return (
    <main className="app-shell">
      <FictionNotice />
      {view === "create" && <CharacterCreation onCreate={handleCreate} />}
      {view === "card" && state && <StellaRouteCard state={state} onEnter={() => setView("play")} />}
      {view === "play" && state && (
        <PlayScreen state={state} onStateChange={handleStateChange} onReset={handleReset} />
      )}
    </main>
  );
}
