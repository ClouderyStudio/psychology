// OCI-R 强迫量表修订版（18 题，0-4 求和）· 计分
import type { ScoringResult } from "../score";

// 6 个子量表，各 3 题（DSM-5 已将囤积单列为囤积障碍，此处单列）
const SUBSCALES: Array<{ key: string; name: string; items: number[]; desc: string }> = [
  { key: "washing", name: "洗涤 (Washing)", items: [5,11,17], desc: "污染担忧与过度洗涤/清洁行为。" },
  { key: "checking", name: "检查 (Checking)", items: [2,8,14], desc: "因疑虑反复检查（锁、电器等），以防不良后果。" },
  { key: "ordering", name: "排序/对称 (Ordering)", items: [3,9,15], desc: "对对称、精确、按特定方式摆放物品的强烈需求。" },
  { key: "obsessing", name: "强迫思维 (Obsessing)", items: [6,12,18], desc: "反复侵入的不愉快想法，并难以控制、摆脱。" },
  { key: "neutralizing", name: "中和 (Neutralising)", items: [4,10,16], desc: "用计数、重复数字等心理仪式来中和/抵消侵入想法。" },
  { key: "hoarding", name: "囤积 (Hoarding)", items: [1,7,13], desc: "难以丢弃物品、过度收集（DSM-5 中属囤积障碍维度）。" },
];

// 子量表每题平均对应的困扰程度
function subBand(avg: number) {
  if (avg < 0.5) return "几乎没有"
  if (avg < 1.5) return "轻度（一点点）"
  if (avg < 2.5) return "中度（中等程度）"
  if (avg < 3.5) return "重度（相当多）"
  return "极重度（极其）"
}

// OCD 总分（除囤积外的 15 题，0-60）参考界值 12 与严重度分档（NovoPsych，基于 OCD 临床样本）
function ocdBand(t: number) {
  if (t < 12) return { level: "低于临床界值", range: "<12" }
  if (t <= 21) return { level: "轻度困扰（A little）", range: "12–21" }
  if (t <= 36) return { level: "中度困扰（Moderately）", range: "22–36" }
  if (t <= 51) return { level: "重度困扰（A lot）", range: "37–51" }
  return { level: "极重度困扰（Extremely）", range: "52–60" }
}

export function scoreOCIR(answers: Record<number, number>): ScoringResult {
  const val = (id: number) => answers[id] ?? 0;
  let ocd = 0;
  let total = 0;
  for (let i = 1; i <= 18; i++) total += val(i);
  const dims: Record<string, any> = {};
  for (const s of SUBSCALES) {
    let ssum = 0;
    for (const it of s.items) ssum += val(it);
    const avg = ssum / s.items.length;
    dims[s.key] = { name: s.name, score: ssum, max: 12, level: s.key === "hoarding" ? (ssum >= 6 ? "达到囤积界值（≥6）" : "低于囤积界值（<6）") : subBand(avg), desc: s.desc };
    if (s.key !== "hoarding") ocd += ssum;
  }
  const { level, range } = ocdBand(ocd);
  const hd = dims.hoarding.score ?? 0;
  const suggestion = "【OCI-R 强迫量表修订版】OCD 症状总分 " + ocd + " / 60（5 个强迫子量表共 15 题，0-4 分/题）\n"
    + "参考等级：" + level + "（" + range + "）。OCD 参考界值 ≥12；12-21 轻度、22-36 中度、37-51 重度、52-60 极重度\n"
    + "• 囤积维度（单独计）" + hd + " / 12，参考界值 ≥6\n"
    + "• 子量表：洗涤 " + dims.washing.score + " · 检查 " + dims.checking.score + " · 排序 " + dims.ordering.score + " · 强迫思维 " + dims.obsessing.score + " · 中和 " + dims.neutralizing.score + " · 囤积 " + hd + "\n\n"
    + "参考说明：OCI-R 由 Foa 等 2002 年编制（公共领域量表），用 18 题评估过去一个月强迫症状带来的困扰（0=完全没有，4=极其）。当代评分（遵循 DSM-5）将囤积与 OCD 分开：前 5 个子量表（15 题）计 OCD，囤积（3 题）单独计。\n"
    + "注意：囤积子量表与 OCD 其余子量表构念不同；若 OCD 或囤积达到临床界值或明显影响生活，请寻求精神科或临床心理专业评估。\n\n"
    + "本量表仅用于教育与自我筛查，不构成临床诊断。";

  return {
    totalScore: ocd,
    maxScore: 60,
    level,
    suggestion,
    severity: Math.round((ocd / 60) * 1000) / 1000,
    dimensionScores: { type: "ocir", ...dims },
  };
}
