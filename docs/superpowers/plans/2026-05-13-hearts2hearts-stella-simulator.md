# Hearts2Hearts Stella Simulator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first playable Stella-only Hearts2Hearts AI chat romance simulator as a deployable Next.js web app with a mock DM engine and a disabled OpenAI provider boundary.

**Architecture:** Use a small Next.js app with domain logic isolated under `src/game`, route/content data under `src/game/stella`, UI components under `src/components`, and the app shell in `src/app/page.tsx`. All game progression goes through a provider interface so mock mode and future OpenAI mode share the same UI contract.

**Tech Stack:** Next.js, React, TypeScript, Vitest, Testing Library, browser `localStorage`, CSS modules/global CSS.

---

## File Structure

- `package.json`: scripts and dependencies for Next, Vitest, Testing Library.
- `tsconfig.json`: TypeScript configuration.
- `next.config.mjs`: Next.js config.
- `vitest.config.ts`: unit/component test config.
- `src/app/layout.tsx`: app metadata and document shell.
- `src/app/page.tsx`: top-level game state container.
- `src/app/globals.css`: complete visual system.
- `src/app/api/dm/route.ts`: disabled future OpenAI route.
- `src/game/types.ts`: shared domain types.
- `src/game/stella/profile.ts`: Stella route profile and identity definitions.
- `src/game/stella/events.ts`: opening scenes and event pool.
- `src/game/stages.ts`: relationship stage thresholds.
- `src/game/state.ts`: initial state creation and reducer helpers.
- `src/game/providers/types.ts`: provider request/response interface.
- `src/game/providers/mockProvider.ts`: local DM engine.
- `src/game/providers/openAIProvider.ts`: disabled provider adapter.
- `src/game/storage.ts`: local save/load/reset helpers.
- `src/components/CharacterCreation.tsx`: player setup form.
- `src/components/StellaRouteCard.tsx`: Stella route card.
- `src/components/StatPanel.tsx`: stat display.
- `src/components/PlayScreen.tsx`: transcript, choices, free action.
- `src/components/FictionNotice.tsx`: compact fiction/safety notice.
- `src/game/__tests__/state.test.ts`: initial state and relationship stage tests.
- `src/game/__tests__/mockProvider.test.ts`: mock progression tests.
- `src/game/__tests__/storage.test.ts`: local storage tests.
- `src/components/__tests__/gameFlow.test.tsx`: UI flow smoke test.

---

## Task 1: Scaffold Next.js And Test Tooling

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.mjs`
- Create: `vitest.config.ts`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/globals.css`

- [ ] **Step 1: Create project config files**

Create `package.json`:

```json
{
  "name": "hearts2hearts-stella-simulator",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.5.2",
    "@types/node": "^22.10.2",
    "@types/react": "^19.0.2",
    "@types/react-dom": "^19.0.2",
    "@vitejs/plugin-react": "^4.3.4",
    "jsdom": "^25.0.1",
    "typescript": "^5.7.2",
    "vitest": "^2.1.8"
  }
}
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "es2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "plugins": [{ "name": "next" }]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

Create `next.config.mjs`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
```

Create `vitest.config.ts`:

```ts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: []
  },
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname
    }
  }
});
```

- [ ] **Step 2: Create minimal app shell**

Create `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hearts2Hearts Stella Simulator",
  description: "A fictional parallel-world Stella romance simulator."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
```

Create `src/app/page.tsx`:

```tsx
export default function HomePage() {
  return (
    <main className="app-shell">
      <section className="panel">
        <p className="eyebrow">Hearts2Hearts Parallel World</p>
        <h1>Stella Simulator</h1>
        <p>Stella 单人线 Demo 正在初始化。</p>
      </section>
    </main>
  );
}
```

Create `src/app/globals.css`:

```css
:root {
  color-scheme: dark;
  --bg: #101113;
  --panel: #191b20;
  --panel-2: #22262d;
  --text: #f4f0e8;
  --muted: #a9adb5;
  --line: #343942;
  --accent: #e15d4f;
  --risk: #f0b84f;
  --calm: #68b7a4;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: radial-gradient(circle at top left, #2b2628 0, #101113 34rem);
  color: var(--text);
  font-family: Arial, "PingFang SC", "Microsoft YaHei", sans-serif;
}

button,
input,
select,
textarea {
  font: inherit;
}

.app-shell {
  min-height: 100vh;
  padding: 24px;
}

.panel {
  width: min(1040px, 100%);
  margin: 0 auto;
  border: 1px solid var(--line);
  background: color-mix(in srgb, var(--panel) 94%, transparent);
  border-radius: 8px;
  padding: 24px;
}

.eyebrow {
  margin: 0 0 8px;
  color: var(--accent);
  font-size: 12px;
  letter-spacing: 0;
  text-transform: uppercase;
}
```

- [ ] **Step 3: Install dependencies**

Run: `npm install`

Expected: `node_modules` and `package-lock.json` are created without dependency resolution errors.

- [ ] **Step 4: Verify scaffold**

Run: `npm run typecheck`

Expected: PASS with no TypeScript errors.

Run: `npm run build`

Expected: PASS and Next.js produces a production build.

- [ ] **Step 5: Commit scaffold**

Run:

```bash
git add package.json package-lock.json tsconfig.json next.config.mjs vitest.config.ts src/app
git commit -m "feat: scaffold Stella simulator app"
```

---

## Task 2: Add Game Types, Stella Data, And State Helpers

**Files:**
- Create: `src/game/types.ts`
- Create: `src/game/stella/profile.ts`
- Create: `src/game/stages.ts`
- Create: `src/game/state.ts`
- Create: `src/game/__tests__/state.test.ts`

- [ ] **Step 1: Write failing state tests**

Create `src/game/__tests__/state.test.ts`:

```ts
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
});
```

- [ ] **Step 2: Run tests and verify failure**

Run: `npm run test -- src/game/__tests__/state.test.ts`

Expected: FAIL because the game modules do not exist.

- [ ] **Step 3: Add domain types**

Create `src/game/types.ts`:

```ts
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
```

- [ ] **Step 4: Add Stella profile and identity data**

Create `src/game/stella/profile.ts`:

```ts
import type { GameStats, PlayerIdentity } from "@/game/types";

export const stellaProfile = {
  id: "stella",
  displayName: "斯特拉（Stella）",
  publicPersona:
    "公开场合的斯特拉（Stella）很放松，会开玩笑，镜头前带着酷感和速度感。她首先是 Hearts2Hearts 的 idol 成员，舞台、组合责任、公司安排和粉丝视线构成她生活的主轴。",
  privatePersonality:
    "私下的斯特拉（Stella）把工作和生活切得很清楚。她可以亲近，也可以突然把界限拉回原位。她会打架子鼓，节奏感和练习室里的专业状态很强，但这只是她作为 idol 的特色能力之一。",
  redFlags: [
    "讨厌被当成异国滤镜或被说不像亚洲人。",
    "不能接受别人质疑她的专业能力。",
    "反感标签化恋爱，不想被定义成谁的女友。"
  ],
  keywords: ["idol", "加拿大韩裔", "外放酷感", "架子鼓能力", "专业边界", "英文切换"]
};

export const identityLabels: Record<PlayerIdentity, string> = {
  music_show_staff: "音乐节目工作人员",
  translator: "翻译 / 海外商务助理",
  student_part_timer: "留学生 / 兼职生"
};

export const identityInitialStats: Record<PlayerIdentity, GameStats> = {
  music_show_staff: {
    affection: 8,
    publicAttention: 0,
    mood: 72,
    money: 2600,
    secrecy: 100,
    companyAlertness: 28,
    careerPressure: 68
  },
  translator: {
    affection: 7,
    publicAttention: 0,
    mood: 74,
    money: 3200,
    secrecy: 100,
    companyAlertness: 22,
    careerPressure: 64
  },
  student_part_timer: {
    affection: 5,
    publicAttention: 0,
    mood: 70,
    money: 1300,
    secrecy: 100,
    companyAlertness: 14,
    careerPressure: 58
  }
};
```

- [ ] **Step 5: Add relationship stages**

Create `src/game/stages.ts`:

```ts
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
```

- [ ] **Step 6: Add initial state creation**

Create `src/game/state.ts`:

```ts
import { getRelationshipStage } from "@/game/stages";
import { identityInitialStats } from "@/game/stella/profile";
import type { Choice, GameState, PlayerProfile, Scene } from "@/game/types";

const openingScenes: Record<PlayerProfile["identity"], Scene> = {
  music_show_staff: {
    id: "opening-music-show",
    title: "预录前的后门",
    location: "首尔汝矣岛电视台后门",
    body: "凌晨的后门全是线缆箱和热咖啡的味道。你抱着资料站在风口，黑色保姆车停下时，斯特拉（Stella）从车上下来，帽檐压得很低。她先看见快被风吹进水洼的通告单，伸手按住，语气轻快却不拖泥带水：“这个湿了，你会被骂吧？”",
    visibleReaction: "她把纸递给你后没有停留太久，经纪人的目光已经从车边扫过来。"
  },
  translator: {
    id: "opening-translator",
    title: "海外采访前的耳返",
    location: "海外品牌活动后台翻译席",
    body: "你临时接到通知，要补上一个海外采访的随行翻译。斯特拉（Stella）站在背景板旁调耳返，听见工作人员把问题翻得太满，忽然用英文低声说：“Not gonna lie, that is not what I meant.” 她看向你，像是在确认你有没有听懂真正的意思。",
    visibleReaction: "她没有求助，只是把选择权短暂交到你手里。"
  },
  student_part_timer: {
    id: "opening-student",
    title: "雨夜便利店",
    location: "弘大附近便利店夜班",
    body: "雨把玻璃门打得发白。你在夜班柜台后整理零钱，门铃响起，斯特拉（Stella）压着帽檐进来买冰水和能量棒。她手指上有练习留下的薄茧，付款时顺着店里的背景音乐轻轻敲了两下节拍。",
    visibleReaction: "她发现你认出了她，但没有退后，只是抬眼做了一个很轻的噤声手势。"
  }
};

const openingChoices: Choice[] = [
  { id: "professional-distance", label: "保持专业距离，不让她为难。", intent: "professional" },
  { id: "quiet-kindness", label: "小声表达善意，但不追问。", intent: "warm" },
  { id: "remember-detail", label: "记住这个细节，继续完成自己的事。", intent: "careful" }
];

export function createInitialGameState(player: PlayerProfile): GameState {
  const stats = identityInitialStats[player.identity];
  const relationshipStage = getRelationshipStage(stats.affection);
  const currentScene = openingScenes[player.identity];

  return {
    player,
    routeId: "stella",
    week: 1,
    stats,
    relationshipStage,
    currentScene,
    currentChoices: openingChoices,
    history: [{ id: currentScene.id, week: 1, scene: currentScene }],
    updatedAt: new Date().toISOString()
  };
}
```

- [ ] **Step 7: Verify tests pass**

Run: `npm run test -- src/game/__tests__/state.test.ts`

Expected: PASS.

- [ ] **Step 8: Commit game state foundation**

Run:

```bash
git add src/game
git commit -m "feat: add Stella game state foundation"
```

---

## Task 3: Build Mock DM Provider

**Files:**
- Create: `src/game/providers/types.ts`
- Create: `src/game/stella/events.ts`
- Create: `src/game/providers/mockProvider.ts`
- Create: `src/game/providers/openAIProvider.ts`
- Create: `src/game/__tests__/mockProvider.test.ts`

- [ ] **Step 1: Write failing provider tests**

Create `src/game/__tests__/mockProvider.test.ts`:

```ts
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
});
```

- [ ] **Step 2: Run tests and verify failure**

Run: `npm run test -- src/game/__tests__/mockProvider.test.ts`

Expected: FAIL because provider files do not exist.

- [ ] **Step 3: Add provider interfaces**

Create `src/game/providers/types.ts`:

```ts
import type { GameState, GameStats } from "@/game/types";

export type PlayerAction =
  | { type: "choice"; choiceId: string; label: string }
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
```

- [ ] **Step 4: Add Stella event templates**

Create `src/game/stella/events.ts`:

```ts
import type { Choice, PlayerIdentity, Scene } from "@/game/types";

export interface StellaEventTemplate {
  id: string;
  tags: string[];
  identities: PlayerIdentity[];
  title: string;
  location: string;
  body: string;
  visibleReaction: string;
}

export const stellaEvents: StellaEventTemplate[] = [
  {
    id: "practice-boundary",
    tags: ["work", "boundary"],
    identities: ["music_show_staff", "translator"],
    title: "鼓点后的停顿",
    location: "公司地下练习室外走廊",
    body: "走廊隔音不算好，低频鼓点从门缝里震出来。你路过时，斯特拉（Stella）刚结束一段练习，额发湿着，手里还握着鼓棒。她看见你停下，先笑了一下，又很快把门带上：“工作区到这里就好。”",
    visibleReaction: "她不是生气，更像是在提醒你：靠近可以，但不能越线。"
  },
  {
    id: "english-switch",
    tags: ["language", "identity"],
    identities: ["translator", "student_part_timer"],
    title: "Not gonna lie",
    location: "活动后台临时休息区",
    body: "工作人员的玩笑绕到她的海外背景，气氛短暂变轻。斯特拉（Stella）靠在桌边，笑意还在，声音却切成英文：“Not gonna lie, this is not cool.” 她没有看起来那么需要别人保护，但她注意到了你有没有跟着笑。",
    visibleReaction: "她把水瓶转了一圈，等你给出反应。"
  },
  {
    id: "fan-risk-corner",
    tags: ["fandom", "secrecy"],
    identities: ["music_show_staff", "student_part_timer", "translator"],
    title: "照片边角",
    location: "电视台侧门附近",
    body: "一张站姐预览图在粉丝群里流开，角落里有一个模糊的人影，衣服颜色和你今天的一样。斯特拉（Stella）没有立刻联系你，但你在工作群里看见经纪人开始询问侧门动线。",
    visibleReaction: "你能看见的只有公共消息里的收紧，和她迟迟没有发来的解释。"
  },
  {
    id: "ordinary-life-gap",
    tags: ["money", "ordinary-life"],
    identities: ["student_part_timer"],
    title: "便利店的账单",
    location: "弘大附近便利店仓库",
    body: "你在仓库里算这个月房租和班表，手机弹出 Hearts2Hearts 新行程热帖。斯特拉（Stella）离你的生活很近，又像隔着一整座城市。门铃响起时，你下意识把账单翻过去。",
    visibleReaction: "她只买了一瓶水，却看见你动作里的慌张。"
  }
];

export const defaultChoices: Choice[] = [
  { id: "answer-professionally", label: "用专业方式回应，不把私人情绪带进去。", intent: "professional" },
  { id: "offer-small-care", label: "给出很小的关心，留足她后退的空间。", intent: "warm" },
  { id: "step-back", label: "主动后退，优先降低风险。", intent: "withdraw" }
];

export function sceneFromTemplate(template: StellaEventTemplate): Scene {
  return {
    id: template.id,
    title: template.title,
    location: template.location,
    body: template.body,
    visibleReaction: template.visibleReaction
  };
}
```

- [ ] **Step 5: Implement mock provider**

Create `src/game/providers/mockProvider.ts`:

```ts
import { getRelationshipStage } from "@/game/stages";
import { defaultChoices, sceneFromTemplate, stellaEvents } from "@/game/stella/events";
import type { GameState, GameStats } from "@/game/types";
import type { DmProvider, GenerateTurnRequest, GenerateTurnResult, PlayerAction } from "./types";

function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

function classifyIntent(action: PlayerAction): "professional" | "warm" | "withdraw" | "bold" | "careful" {
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
    const relationshipStage = getRelationshipStage(stats.affection);
    const week = request.state.week + 1;

    const selectedAction =
      request.action.type === "choice" ? request.action.label : `自由行动：${request.action.text}`;

    const state: GameState = {
      ...request.state,
      week,
      stats,
      relationshipStage,
      currentScene: scene,
      currentChoices: defaultChoices,
      history: [
        ...request.state.history,
        {
          id: `${scene.id}-${week}`,
          week,
          scene,
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
```

- [ ] **Step 6: Add disabled OpenAI provider**

Create `src/game/providers/openAIProvider.ts`:

```ts
import type { DmProvider, GenerateTurnRequest, GenerateTurnResult } from "./types";

export const openAIProvider: DmProvider = {
  id: "openai",
  async generateTurn(_request: GenerateTurnRequest): Promise<GenerateTurnResult> {
    throw new Error("OpenAI provider is not configured in version 1. Use mock mode.");
  }
};
```

- [ ] **Step 7: Verify provider tests pass**

Run: `npm run test -- src/game/__tests__/mockProvider.test.ts`

Expected: PASS.

- [ ] **Step 8: Commit mock provider**

Run:

```bash
git add src/game
git commit -m "feat: add Stella mock DM provider"
```

---

## Task 4: Add Local Save Helpers

**Files:**
- Create: `src/game/storage.ts`
- Create: `src/game/__tests__/storage.test.ts`

- [ ] **Step 1: Write failing storage tests**

Create `src/game/__tests__/storage.test.ts`:

```ts
import { beforeEach, describe, expect, it } from "vitest";
import { createInitialGameState } from "@/game/state";
import { clearSavedGame, loadSavedGame, saveGame } from "@/game/storage";

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("saves, loads, and clears a game state", () => {
    const state = createInitialGameState({
      name: "林夏",
      age: 23,
      identity: "student_part_timer",
      pacing: "balanced"
    });

    saveGame(state);
    expect(loadSavedGame()?.player.name).toBe("林夏");

    clearSavedGame();
    expect(loadSavedGame()).toBeNull();
  });
});
```

- [ ] **Step 2: Run tests and verify failure**

Run: `npm run test -- src/game/__tests__/storage.test.ts`

Expected: FAIL because `src/game/storage.ts` does not exist.

- [ ] **Step 3: Implement storage helpers**

Create `src/game/storage.ts`:

```ts
import type { GameState } from "@/game/types";

const SAVE_KEY = "h2h.stella.save.v1";

export function saveGame(state: GameState): void {
  window.localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

export function loadSavedGame(): GameState | null {
  const raw = window.localStorage.getItem(SAVE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as GameState;
  } catch {
    window.localStorage.removeItem(SAVE_KEY);
    return null;
  }
}

export function clearSavedGame(): void {
  window.localStorage.removeItem(SAVE_KEY);
}
```

- [ ] **Step 4: Verify storage tests pass**

Run: `npm run test -- src/game/__tests__/storage.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit storage helpers**

Run:

```bash
git add src/game/storage.ts src/game/__tests__/storage.test.ts
git commit -m "feat: add local game save helpers"
```

---

## Task 5: Build Character Creation And Route Card UI

**Files:**
- Create: `src/components/FictionNotice.tsx`
- Create: `src/components/CharacterCreation.tsx`
- Create: `src/components/StellaRouteCard.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add compact fiction notice**

Create `src/components/FictionNotice.tsx`:

```tsx
export function FictionNotice() {
  return (
    <p className="notice">
      平行世界虚构文游设定，不代表现实人物经历、私生活或真实性格。所有角色均按成年设定处理。
    </p>
  );
}
```

- [ ] **Step 2: Add character creation component**

Create `src/components/CharacterCreation.tsx`:

```tsx
"use client";

import { identityLabels } from "@/game/stella/profile";
import type { Pacing, PlayerIdentity, PlayerProfile } from "@/game/types";

interface Props {
  onCreate: (profile: PlayerProfile) => void;
}

const pacingOptions: Array<{ value: Pacing; label: string }> = [
  { value: "slow_realistic", label: "慢热现实向" },
  { value: "balanced", label: "标准韩剧向" },
  { value: "high_pressure", label: "高压舆论向" },
  { value: "healing", label: "日常治愈向" }
];

export function CharacterCreation({ onCreate }: Props) {
  function handleSubmit(formData: FormData) {
    const name = String(formData.get("name") || "林夏").trim();
    const age = Number(formData.get("age") || 23);
    const identity = String(formData.get("identity")) as PlayerIdentity;
    const pacing = String(formData.get("pacing")) as Pacing;

    onCreate({
      name: name || "林夏",
      age: Number.isFinite(age) && age >= 18 ? age : 23,
      identity,
      pacing
    });
  }

  return (
    <section className="panel stack">
      <div>
        <p className="eyebrow">角色创建</p>
        <h1>Stella 单人线</h1>
      </div>
      <form action={handleSubmit} className="form-grid">
        <label>
          姓名
          <input name="name" defaultValue="林夏" />
        </label>
        <label>
          年龄
          <input name="age" type="number" min={18} defaultValue={23} />
        </label>
        <label>
          玩家身份
          <select name="identity" defaultValue="translator">
            {Object.entries(identityLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          剧情节奏
          <select name="pacing" defaultValue="balanced">
            {pacingOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">确定并生成角色卡</button>
      </form>
    </section>
  );
}
```

- [ ] **Step 3: Add Stella route card**

Create `src/components/StellaRouteCard.tsx`:

```tsx
import { stellaProfile } from "@/game/stella/profile";
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
      <p className="notice">初始关系阶段：{state.relationshipStage.label}</p>
      <button type="button" onClick={onEnter}>
        进入剧情
      </button>
    </section>
  );
}
```

- [ ] **Step 4: Wire creation and route card in page**

Replace `src/app/page.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { CharacterCreation } from "@/components/CharacterCreation";
import { FictionNotice } from "@/components/FictionNotice";
import { StellaRouteCard } from "@/components/StellaRouteCard";
import { createInitialGameState } from "@/game/state";
import type { GameState, PlayerProfile } from "@/game/types";

type View = "create" | "card" | "play";

export default function HomePage() {
  const [view, setView] = useState<View>("create");
  const [state, setState] = useState<GameState | null>(null);

  function handleCreate(profile: PlayerProfile) {
    setState(createInitialGameState(profile));
    setView("card");
  }

  useEffect(() => {
    if (view === "play") {
      document.title = "Stella Simulator";
    }
  }, [view]);

  return (
    <main className="app-shell">
      <FictionNotice />
      {view === "create" && <CharacterCreation onCreate={handleCreate} />}
      {view === "card" && state && <StellaRouteCard state={state} onEnter={() => setView("play")} />}
      {view === "play" && state && (
        <section className="panel">
          <p className="eyebrow">剧情准备完成</p>
          <h1>{state.currentScene.title}</h1>
          <p>{state.currentScene.body}</p>
        </section>
      )}
    </main>
  );
}
```

- [ ] **Step 5: Extend CSS for forms and cards**

Append to `src/app/globals.css`:

```css
.stack {
  display: grid;
  gap: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

label {
  display: grid;
  gap: 8px;
  color: var(--muted);
}

input,
select,
textarea {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: var(--panel-2);
  color: var(--text);
  padding: 11px 12px;
}

button {
  border: 0;
  border-radius: 6px;
  background: var(--accent);
  color: white;
  padding: 12px 16px;
  cursor: pointer;
}

.notice {
  width: min(1040px, 100%);
  margin: 0 auto 12px;
  color: var(--muted);
  font-size: 13px;
}

.route-card {
  display: grid;
  gap: 20px;
}

.split {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.split article {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--panel-2);
  padding: 16px;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-row span {
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 6px 10px;
  color: var(--muted);
}

@media (max-width: 720px) {
  .app-shell {
    padding: 14px;
  }

  .form-grid,
  .split {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 6: Verify UI compiles**

Run: `npm run typecheck`

Expected: PASS.

Run: `npm run build`

Expected: PASS.

- [ ] **Step 7: Commit creation UI**

Run:

```bash
git add src/app src/components
git commit -m "feat: add Stella route creation flow"
```

---

## Task 6: Build Play Screen And Wire Mock Progression

**Files:**
- Create: `src/components/StatPanel.tsx`
- Create: `src/components/PlayScreen.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add stat panel**

Create `src/components/StatPanel.tsx`:

```tsx
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
```

- [ ] **Step 2: Add play screen**

Create `src/components/PlayScreen.tsx`:

```tsx
"use client";

import { useState } from "react";
import { StatPanel } from "@/components/StatPanel";
import { mockProvider } from "@/game/providers/mockProvider";
import type { GameState } from "@/game/types";

interface Props {
  state: GameState;
  onStateChange: (state: GameState) => void;
  onReset: () => void;
}

export function PlayScreen({ state, onStateChange, onReset }: Props) {
  const [freeText, setFreeText] = useState("");
  const [warnings, setWarnings] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function submitChoice(choiceId: string, label: string) {
    setIsLoading(true);
    const result = await mockProvider.generateTurn({
      state,
      action: { type: "choice", choiceId, label }
    });
    setWarnings(result.warnings);
    onStateChange(result.state);
    setIsLoading(false);
  }

  async function submitFreeAction() {
    if (!freeText.trim()) return;
    setIsLoading(true);
    const result = await mockProvider.generateTurn({
      state,
      action: { type: "free", text: freeText.trim() }
    });
    setFreeText("");
    setWarnings(result.warnings);
    onStateChange(result.state);
    setIsLoading(false);
  }

  return (
    <section className="play-layout">
      <aside className="panel side-panel">
        <p className="eyebrow">第 {state.week} 周</p>
        <h1>当前关系：{state.relationshipStage.label}</h1>
        <p>当前场景：{state.currentScene.location}</p>
        <StatPanel stats={state.stats} />
        <button type="button" className="secondary-button" onClick={onReset}>
          重置存档
        </button>
      </aside>

      <section className="panel story-panel">
        <p className="eyebrow">当前攻略对象：斯特拉（Stella）</p>
        <h1>{state.currentScene.title}</h1>
        <div className="story-body">
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

        <div className="choice-list">
          {state.currentChoices.map((choice) => (
            <button
              type="button"
              key={choice.id}
              onClick={() => submitChoice(choice.id, choice.label)}
              disabled={isLoading}
            >
              {choice.label}
            </button>
          ))}
        </div>

        <div className="free-action">
          <textarea
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
```

- [ ] **Step 3: Wire play screen and storage in page**

Replace `src/app/page.tsx`:

```tsx
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
```

- [ ] **Step 4: Add play CSS**

Append to `src/app/globals.css`:

```css
.play-layout {
  width: min(1180px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  gap: 16px;
  align-items: start;
}

.side-panel,
.story-panel {
  margin: 0;
}

.stat-grid {
  display: grid;
  gap: 8px;
  margin: 18px 0;
}

.stat-cell {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  border-bottom: 1px solid var(--line);
  padding: 8px 0;
}

.stat-cell span {
  color: var(--muted);
}

.story-body {
  display: grid;
  gap: 12px;
  line-height: 1.8;
}

.choice-list,
.free-action {
  display: grid;
  gap: 10px;
  margin-top: 18px;
}

.choice-list button {
  text-align: left;
  background: var(--panel-2);
  border: 1px solid var(--line);
}

.secondary-button {
  width: 100%;
  background: transparent;
  border: 1px solid var(--line);
}

.warning-box {
  margin-top: 16px;
  border: 1px solid color-mix(in srgb, var(--risk), transparent 35%);
  border-radius: 8px;
  background: color-mix(in srgb, var(--risk), transparent 88%);
  padding: 12px;
  color: var(--text);
}

.warning-box p {
  margin: 0;
}

@media (max-width: 900px) {
  .play-layout {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 5: Verify play flow manually**

Run: `npm run dev`

Expected: Next dev server starts and shows a local URL.

Open the local URL and verify:

- Character creation appears first.
- Creating a translator starts a Stella card.
- Entering the story shows the stat panel and opening scene.
- Clicking a choice advances to week 2 and changes stats.
- Refreshing keeps the save.
- Reset returns to character creation.

- [ ] **Step 6: Commit play screen**

Run:

```bash
git add src/app src/components
git commit -m "feat: add playable Stella mock loop"
```

---

## Task 7: Add Disabled API Route And UI Flow Smoke Test

**Files:**
- Create: `src/app/api/dm/route.ts`
- Create: `src/components/__tests__/gameFlow.test.tsx`

- [ ] **Step 1: Add disabled API route**

Create `src/app/api/dm/route.ts`:

```ts
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "OpenAI provider is not configured in version 1. Mock mode is active."
    },
    { status: 501 }
  );
}
```

- [ ] **Step 2: Add UI flow smoke test**

Create `src/components/__tests__/gameFlow.test.tsx`:

```tsx
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";

describe("game flow", () => {
  it("creates a player and enters the Stella story", async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    expect(screen.getByText("Stella 单人线")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "确定并生成角色卡" }));
    expect(screen.getByText("斯特拉（Stella）")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "进入剧情" }));
    expect(screen.getByText(/当前攻略对象：斯特拉（Stella）/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run full verification**

Run: `npm run test`

Expected: PASS.

Run: `npm run typecheck`

Expected: PASS.

Run: `npm run build`

Expected: PASS.

- [ ] **Step 4: Commit API route and smoke test**

Run:

```bash
git add src/app/api src/components/__tests__
git commit -m "feat: add disabled DM API route"
```

---

## Task 8: Final Polish And Browser Verification

**Files:**
- Modify as needed: `src/app/globals.css`
- Modify as needed: `src/components/*.tsx`
- Modify as needed: `src/game/stella/events.ts`

- [ ] **Step 1: Run the app**

Run: `npm run dev`

Expected: server starts successfully.

- [ ] **Step 2: Browser verification**

Use the in-app browser to inspect the local URL.

Verify desktop viewport:

- Text does not overlap.
- Stat panel is readable.
- Buttons fit their labels.
- Free action textarea and submit button are visible.
- The first screen is the actual game flow, not a landing page.

Verify mobile viewport:

- Layout stacks to one column.
- Form controls are not clipped.
- Choice buttons remain readable.
- Story text does not overflow its panel.

- [ ] **Step 3: Content verification**

Play three short sessions:

- Music show staff opening.
- Translator opening.
- Student / part-time worker opening.

Expected:

- Each identity has a distinct first scene.
- Stella is described as an idol member first.
- Drumming appears only as a performance skill, not as her job.
- Choices change at least two stats.
- Refresh keeps the save.
- Reset clears the save.

- [ ] **Step 4: Final verification commands**

Run: `npm run test`

Expected: PASS.

Run: `npm run typecheck`

Expected: PASS.

Run: `npm run build`

Expected: PASS.

- [ ] **Step 5: Commit final polish**

Run:

```bash
git add src
git commit -m "polish: verify Stella simulator demo"
```

---

## Self-Review

- Spec coverage: The plan covers deployable web scaffold, Stella-only scope, three identities, story/strategy loop, mock provider, disabled OpenAI boundary, local save, fiction notice, and verification.
- Scope control: Full eight-member selection, real image generation, accounts, cloud saves, and real OpenAI generation remain out of version 1.
- Type consistency: `PlayerIdentity`, `Pacing`, `GameState`, `GameStats`, `DmProvider`, and provider request/response names are consistent across tasks.
- Placeholder scan: No task depends on unspecified implementation details. The OpenAI path is explicitly disabled in version 1.
