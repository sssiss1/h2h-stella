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
  const stats = { ...identityInitialStats[player.identity] };
  const relationshipStage = getRelationshipStage(stats.affection);
  const currentScene = { ...openingScenes[player.identity] };
  const currentChoices = openingChoices.map((choice) => ({ ...choice }));

  return {
    player: { ...player },
    routeId: "stella",
    week: 1,
    stats,
    relationshipStage,
    currentScene,
    currentChoices,
    history: [{ id: currentScene.id, week: 1, scene: { ...currentScene } }],
    updatedAt: new Date().toISOString()
  };
}
