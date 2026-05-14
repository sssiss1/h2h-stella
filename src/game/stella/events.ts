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
    title: "彩排后的停顿",
    location: "公司地下练习室外走廊",
    body: "走廊隔音不算好，Hearts2Hearts 的舞台走位音乐从门缝里漏出来。你路过时，斯特拉（Stella）刚结束一段彩排，额发湿着，手里还握着下一首表演用的鼓棒。她看见你停下，先笑了一下，又很快把门带上：“工作区到这里就好。”",
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
