// MID-60 多维解离量表（60 题，0–10）· 计分
import type { ScoringResult } from "../score";

// 12 个相关子量表：对应题目均值 × 10（0–100%），与各自临界值（%）比较
const SUBSCALES: Array<{ key: string; name: string; items: number[]; cutoff: number }> = [
  { key: 'amnesia', name: '近期遗忘', items: [42,45,48,58], cutoff: 10 },
  { key: 'alter', name: '替换人格意识', items: [3,36,39,49,57], cutoff: 20 },
  { key: 'angry', name: '愤怒侵入', items: [28,33,35,46,60], cutoff: 18 },
  { key: 'persec', name: '迫害侵入', items: [22,37,44,56,59], cutoff: 18 },
  { key: 'dpdr', name: '人格解体/现实解体', items: [2,7,9,13,25,47,50,53], cutoff: 20 },
  { key: 'memory-distress', name: '记忆困扰', items: [1,8,20,38,43,52], cutoff: 30 },
  { key: 'autobio', name: '自传记忆丧失', items: [16,19,24,29,34], cutoff: 34 },
  { key: 'flashback', name: '闪回', items: [4,15,31,40,54], cutoff: 16 },
  { key: 'fns', name: '功能性神经症状', items: [5,10,14,18], cutoff: 10 },
  { key: 'pnes', name: '心因性非癫痫发作', items: [26], cutoff: 10 },
  { key: 'trance', name: '恍惚', items: [21,27,30,32,41,51], cutoff: 11.7 },
  { key: 'identity', name: '自我困惑', items: [6,11,12,17,23,55], cutoff: 33.3 },
];

// 自伤相关条目（题 22/44/58）
const SELF_HARM_ITEMS = [22, 44, 58];

function getAnswerValue(answers: Record<number, number>, id: number, fallback = 0): number {
  return answers[id] ?? fallback;
}

function band(pct: number) {
  if (pct <= 7) return { level: "无解离体验", desc: "0–7%" };
  if (pct <= 14) return { level: "很少有诊断意义的解离体验", desc: "7–14%" };
  if (pct <= 20) return { level: "轻度解离症状", desc: "15–20%，可能存在PTSD或轻度解离障碍" };
  if (pct <= 30) return { level: "可能存在解离障碍和/或 PTSD", desc: "21–30%，超21%提示临床显著症状" };
  if (pct <= 40) return { level: "可能存在解离障碍（如OSDD或DID）和 PTSD", desc: "31–40%" };
  if (pct <= 64) return { level: "可能患有DID或严重解离障碍和 PTSD", desc: "41–64%" };
  return { level: "严重的解离和创伤后症状", desc: "64%以上，也应考虑神经质、求助行为或症状夸大等" };
}

export function scoreMID60(answers: Record<number, number>): ScoringResult {
  let sum = 0;
  for (let i = 1; i <= 60; i++) sum += getAnswerValue(answers, i);
  const pct = Math.round((sum / 60) * 100) / 10; // 总分 = 均值×10（0–100，保留1位小数）

  // 子量表分数
  const dims: Record<string, any> = {};
  const aboveList: Array<{ name: string; score: number; cutoff: number }> = [];
  for (const s of SUBSCALES) {
    let ssum = 0;
    for (const it of s.items) ssum += getAnswerValue(answers, it);
    const spct = Math.round((ssum / s.items.length) * 100) / 10; // 子量表 = 均值×10
    dims[s.key] = {
      name: s.name,
      score: spct,
      max: 100,
      cutoff: s.cutoff,
      above: spct >= s.cutoff,
      desc: spct >= s.cutoff ? `已达参考线（${s.cutoff}%），值得进一步留意` : `未达参考线（${s.cutoff}%）`,
    };
    if (spct >= s.cutoff) aboveList.push({ name: s.name, score: spct, cutoff: s.cutoff });
  }

  const { level, desc } = band(pct);
  const selfHarmMax = Math.max(...SELF_HARM_ITEMS.map((id) => getAnswerValue(answers, id)));
  const safety = selfHarmMax >= 5;

  const aboveText = aboveList.length
    ? "高于参考线的子量表：" + aboveList.map((a) => `${a.name}（${a.score}%）`).join("、")
    : "各子量表均未超过参考线。";

  const safetyText = safety
    ? "\n\n——安全提示——\n您在自伤相关条目（题22/44/58）上分数较高。若当前存在自伤或自杀想法，请尽快寻求帮助：\n· 全国心理援助热线：400-161-9995\n· 24小时心理危机热线（北京）：010-82951332\n· 紧急情况请拨打 120 或前往医院急诊。"
    : "";

  const suggestion =
    ["【MID-60 多维解离量表】总分 " + pct.toFixed(1) + "%（0–100）",
     "参考等级：" + level + "（" + desc + "）",
     "• " + aboveText,
     "",
     "参考语义：普通人群（社区样本）平均约12.9%，临床 DID 样本平均约56.8%，完整版218题MID中 DID 平均约51、OSDD-1 平均约39。",
     "高分解读：总分很高（尤其>80）也可能源于把日常遗忘/注意力不集中（如 ADHD）误当失忆、自闭个体对“时间比例”题理解差异、强烈求助动机乃至故意夸大；须经面询澄清，不能仅凭分数下结论。",
     "局限：本量表仅为筛查，不能单独作为诊断依据；如需更精确评估，可做结构化访谈（SCID-D / DDIS / TADS-I）或完整218题MID。",
     safetyText,
    ].filter(Boolean).join("\n");

  return {
    totalScore: pct,
    maxScore: 100,
    level,
    suggestion,
    severity: Math.round((pct / 100) * 1000) / 1000,
    dimensionScores: { type: "mid60", safety, selfHarmMax, ...dims },
  };
}
