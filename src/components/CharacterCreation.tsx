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
