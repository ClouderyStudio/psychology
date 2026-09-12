// MID-60 多维解离量表（60 题，0–10）· 计分
import type { ScoringResult } from "../score";
import { mid60Questions, type MID60Dimension } from "../questions/mid60-questions";

// 12 个子量表：题目成员直接从题库推导（dimension 字段即成员表），
// 避免计分侧另抄一份题号清单而与题目内容脱节。
const SUBSCALE_META: Array<{ key: MID60Dimension; name: string; cutoff: number }> = [
  { key: "amnesia", name: "近期遗忘", cutoff: 10 },
  { key: "alter", name: "替换人格意识", cutoff: 20 },
  { key: "angry", name: "愤怒侵入", cutoff: 18 },
  { key: "persec", name: "迫害侵入", cutoff: 18 },
  { key: "dpdr", name: "人格解体/现实解体", cutoff: 20 },
  { key: "memory-distress", name: "记忆困扰", cutoff: 30 },
  { key: "autobio", name: "自传记忆丧失", cutoff: 34 },
  { key: "flashback", name: "闪回", cutoff: 16 },
  { key: "fns", name: "功能性神经症状", cutoff: 10 },
  { key: "pnes", name: "心因性非癫痫发作", cutoff: 10 },
  { key: "trance", name: "恍惚", cutoff: 11.7 },
  { key: "identity", name: "自我困惑", cutoff: 33.3 },
];

export const MID60_SUBSCALES = SUBSCALE_META.map((m) => ({
  ...m,
  items: mid60Questions.filter((q) => q.dimension === m.key).map((q) => q.id),
}));

// 自伤相关条目（题 22/44/58）
const SELF_HARM_ITEMS = [22, 44, 58];

function getAnswerValue(answers: Record<number, number>, id: number, fallback = 0): number {
  return answers[id] ?? fallback;
}

// 分档只描述**症状强度**，不输出障碍名。
// 第三批报告 2 指出：原分档直接把「可能存在解离障碍（如 OSDD 或 DID）和 PTSD」
// 当作结果标签输出，而该标签是由错位的子量表堆出来的；本实现又是公开条目整理的
// 60 题版本，不是经验证的完整版 MID，更不该给出障碍名。障碍名改到
// 「文献对照」里呈现，并明确标注不是诊断结论。
// 分档与「文献对照」一一对应，避免用字符串匹配去反查对照文案
const BANDS: Array<{ max: number; range: string; level: string; literature: string }> = [
  { max: 7, range: "0–7", level: "解离体验极低", literature: "一般人群的常见区间" },
  { max: 14, range: "7–14", level: "解离体验偏低", literature: "极少出现有诊断意义的解离体验" },
  { max: 20, range: "15–20", level: "轻度解离体验", literature: "文献中此区间开始出现需要留意的解离症状" },
  { max: 30, range: "21–30", level: "中度解离体验", literature: "文献中超过 21% 常被视为临床显著，需专业评估" },
  { max: 40, range: "31–40", level: "较重解离体验", literature: "文献中此区间常见于解离障碍与 PTSD 的临床样本" },
  { max: 64, range: "41–64", level: "重度解离体验", literature: "文献中此区间与 DID / 严重解离障碍的临床样本重合度较高" },
  { max: 100, range: "64 以上", level: "极重度解离体验", literature: "高于多数临床样本；也需排查夸大、神经质或精神病性症状" },
];

const LAST_BAND = BANDS[BANDS.length - 1]!;

function band(pct: number) {
  const b = BANDS.find((x) => pct <= x.max) ?? LAST_BAND;
  return { level: b.level, desc: b.range + "%", literature: b.literature };
}

/** 区间与文献样本的对照。仅供读者理解分档来源，不构成诊断结论。 */
export const MID60_BAND_REFERENCE = BANDS.map((b) => ({
  range: b.range + "%",
  literature: b.literature,
}));

export function scoreMID60(answers: Record<number, number>): ScoringResult {
  let sum = 0;
  for (let i = 1; i <= 60; i++) sum += getAnswerValue(answers, i);
  const pct = Math.round((sum / 60) * 100) / 10; // 总分 = 均值×10（0–100，保留1位小数）

  // 子量表分数
  const dims: Record<string, any> = {};
  const aboveList: Array<{ name: string; score: number; cutoff: number }> = [];
  for (const s of MID60_SUBSCALES) {
    let ssum = 0;
    for (const it of s.items) ssum += getAnswerValue(answers, it);
    const spct = Math.round((ssum / s.items.length) * 100) / 10; // 子量表 = 均值×10
    dims[s.key] = {
      name: s.name,
      score: spct,
      max: 100,
      cutoff: s.cutoff,
      itemCount: s.items.length,
      above: spct >= s.cutoff,
      desc: spct >= s.cutoff ? `已达参考线（${s.cutoff}%），值得进一步留意` : `未达参考线（${s.cutoff}%）`,
    };
    if (spct >= s.cutoff) aboveList.push({ name: s.name, score: spct, cutoff: s.cutoff });
  }

  const { level, desc, literature } = band(pct);
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
     "参考等级：" + level + "（" + desc + "）——本等级只描述症状强度，不是诊断",
     "• " + aboveText,
     "",
     "文献对照（不是诊断结论）：" + literature,
     "",
     "参考语义：普通人群（社区样本）平均约12.9%，临床 DID 样本平均约56.8%，完整版218题MID中 DID 平均约51、OSDD-1 平均约39。",
     "高分解读：总分很高（尤其>80）也可能源于把日常遗忘/注意力不集中（如 ADHD）误当失忆、自闭个体对“时间比例”题理解差异、强烈求助动机乃至故意夸大；须经面询澄清，不能仅凭分数下结论。",
     "局限：本量表仅为筛查，不能单独作为诊断依据；本实现的 60 题与子量表归属按公开条目整理并经逐条语义核对，与完整版 218 题 MID 的子量表构成不完全一致，参考线只作提示。如需更精确评估，可做结构化访谈（SCID-D / DDIS / TADS-I）或完整218题MID。",
     safetyText,
    ].filter(Boolean).join("\n");

  return {
    totalScore: pct,
    maxScore: 100,
    level,
    suggestion,
    severity: Math.round((pct / 100) * 1000) / 1000,
    dimensionScores: {
      type: "mid60",
      safety,
      selfHarmMax,
      bandReference: MID60_BAND_REFERENCE,
      ...dims,
    },
  };
}
