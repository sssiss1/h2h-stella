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
