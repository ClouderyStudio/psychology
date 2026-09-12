// 心理健康多维自评量表（AnonUsAl 编制）· 计分
//
// 移植自作者独立发布网页版的判别式评分引擎，保留：
//   1) 按题型加权聚合 20 个核心特征得分（-1..1）；
//   2) 以疾病特征向量做判别式匹配，输出各参考方向的特征吻合度（0-100%）；
//   3) 回答一致性（主问 vs 一致性复问）与效度（理想化倾向）校验；
//   4) 严重程度分级与分档建议。
// 仅作自我了解与筛查参考，不构成诊断。
import type { RespondentMode, ScoringResult } from "../score";
import {
  MULTIDIM_MODES,
  MULTIDIM_TRAIT_DESC,
  MULTIDIM_TRAIT_LABELS,
  MULTIDIM_TRAIT_ORDER,
  MULTIDIM_WINDOW_LABEL,
  multidimQuestionById,
  multidimQuestions,
  multidimWindowOf,
  type MultidimKind,
  type MultidimWindow,
} from "../questions/multidim-questions";

/* ===== 参考方向（疾病特征库）已移除 =====
 *
 * 原实现用 17 条诊断特征向量做判别式匹配，向用户输出「障碍名 + 特征吻合度 N%」。
 * 该输出存在三处无法在现有数据上修复的问题（见 reports/ 的问题报告 P0-2 / P1-1 / P1-2）：
 *   1) 它度量的是「作答与模板的接近度」而非症状强度，症状减轻时吻合度反而可能上升（非单调）；
 *   2) 归一化分母取自模板全权重，且特征在 0.35 处硬截断，分数不连续、不具可比性；
 *   3) 一次性输出 17 个方向、其中十余个标 severe，且用两周窗口匹配慢性 / 发育性病程。
 * 在缺乏心理测量学校准的前提下这些数字不具备可重复性，故不再输出，
 * 改为只呈现 20 个维度的相对特征强度（见下方 traits 与 summary）。

/** 题型权重：严重度问信息最具体，主问为主导，复问仅作印证 */
const KIND_WEIGHT: Record<string, number> = { main: 1.0, dup: 0.5, sev: 1.2, life: 0.8 };

/**
 * 结果结构版本号。历史记录留在浏览器本地，结构变更后旧记录缺字段，
 * 结果页据此提示「该记录由旧版本生成」，避免直接白屏。
 */
export const MULTIDIM_REPORT_VERSION = "2.3";

/** 安全 / 关注信号：维度加权均值达到该值即视为该方向成立 */
const SIGNAL_MEAN = 0.5;
/** 维度内低于该均值视为“未出现一致信号”（与 getTraitScores 的活跃阈值同口径） */
const SIGNAL_MEAN_QUIET = 0.35;

/** 描述感知异常本身的条目（主问与一致性复问） */
const PERCEPTION_KINDS: MultidimKind[] = ["main", "dup"];
/** 条件式追问条目（严重度问 / 生活场景问）：只有在主诉成立时才被提问 */
const FOLLOW_UP_KINDS: MultidimKind[] = ["sev", "life"];

/**
 * 安全 / 关注信号。
 * 与维度分使用同一套题目，并记录触发来源（条目级 or 维度级）与维度分，
 * 便于前端在两者不一致时给出解释，而不是并列两个相反结论。
 */
interface MultidimSignal {
  trait: string;
  label: string;
  level: "danger" | "warn";
  /** 触发该信号时该维度的加权均值 */
  traitMean: number;
  /** 以条目级方式触发时的题号（维度级触发为空数组） */
  itemIds: number[];
  /** 供前端直接展示的说明文案 */
  detail: string;
}

/** 某维度中作出肯定回答（≥0.5）的题号；kinds 为 null 表示不限题型 */
function hitItems(
  trait: string,
  kinds: MultidimKind[] | null,
  answers: Record<number, number>,
): number[] {
  return multidimQuestions
    .filter((q) => q.trait === trait && (!kinds || kinds.includes(q.kind)))
    .filter((q) => (answerOf(answers, q.id) ?? -1) >= 0.5)
    .map((q) => q.id);
}

/** 维度均值的展示格式，与 20 维总览保持一致 */
function fmtMean(v: number | undefined): string {
  if (v === undefined) return "无数据";
  return (v > 0 ? "+" : "") + v.toFixed(2);
}

/** 20 特征针对性建议库 */
const ADVICE_MAP: Record<string, string> = {
  low_mood: "尝试把任务拆成小而具体的目标逐步完成；若低落持续两周以上且明显影响生活，建议咨询专业人员。",
  anhedonia: "可先恢复既往喜欢的低强度活动，不要求立刻投入，先安排固定时间尝试 20 分钟。",
  mania: "留意睡眠需求明显减少、言语与冲动增多等信号，必要时与信任的人沟通，并考虑专业评估。",
  panic: "练习腹式呼吸（吸气 4 秒—屏息 2 秒—呼气 6 秒），并记录引发担忧的具体情境以便复盘。",
  compulsion: "尝试把重复行为推迟 5 分钟再决定是否执行，逐步打破“想法—行为”的循环。",
  trauma: "避免独自承受与孤立自己；若闪回或回避明显影响生活，建议寻求创伤方向的专业心理治疗。",
  sleep_issue: "固定起床时间、睡前 1 小时远离屏幕蓝光，午睡不超过 30 分钟，避免依赖酒精助眠。",
  focus_loss: "采用番茄工作法（专注 25 分钟—休息 5 分钟），一次只处理一项任务。",
  social_deficits: "从每周一次低压力的社交（如与熟人共进午餐）开始，逐步增加互动频率。",
  social_fear: "先练习在低风险场合主动发言一次，成功后记录感受，逐步扩大舒适范围。",
  body_image: "减少称重与照镜频率，把注意力转向身体功能（体力、耐力、睡眠质量）而非外形。",
  somatization: "如已排除器质性疾病，可尝试规律运动与渐进式肌肉放松，缓解躯体紧张。",
  hallucination: "请勿独自承受，建议尽快到精神科就诊评估，最好由家人陪同前往。",
  impulse: "冲动来临时先离开现场、默数十秒再回应；若已伤及他人或自身，请立即就医。",
  suicide: "请立即联系信任的人或拨打心理援助热线 12356；如有具体计划请拨打 120 或前往就近医院急诊。",
  energy_loss: "在保证睡眠的前提下，每天安排 10 分钟轻度活动（散步、拉伸）激活身体节律。",
  irritability: "留意诱发情境，尝试延迟 10 秒回应；规律运动有助于释放紧张。",
  self_esteem: "每天记录 1 件完成的小事或他人的积极反馈，逐步矫正消极的自我评价。",
  paranoia: "在得出结论前先与可信的人核实事实；若猜疑已影响关系与生活，建议专业评估。",
  appetite: "保持三餐固定时间，即使不饿也少量进食，观察食欲变化与情绪波动的关联。",
};

function answerOf(answers: Record<number, number>, id: number): number | undefined {
  const v = answers[id];
  return typeof v === "number" && Number.isFinite(v) ? v : undefined;
}

/* ===== 按特征聚合：同特征多题按题型加权平均，返回全量均值（-1..1）===== */
function aggregateTraitMeans(answers: Record<number, number>): Record<string, number> {
  const agg: Record<string, { sum: number; w: number }> = {};
  for (const key of Object.keys(answers)) {
    const qid = Number(key);
    const q = multidimQuestionById[qid];
    if (!q || q.kind === "lie") continue;
    const v = answerOf(answers, qid);
    if (v === undefined) continue;
    const w = KIND_WEIGHT[q.kind] ?? 1.0;
    const entry = (agg[q.trait] = agg[q.trait] || { sum: 0, w: 0 });
    entry.sum += v * w;
    entry.w += w;
  }
  const means: Record<string, number> = {};
  for (const t of Object.keys(agg)) means[t] = agg[t]!.sum / agg[t]!.w;
  return means;
}

/** 某维度的展示标签（缺失时回退到特征 id） */
function traitLabel(trait: string): string {
  return MULTIDIM_TRAIT_LABELS[trait] || trait;
}

/**
 * 本次实际作答中，某维度各题的时间窗口构成。
 * 同一维度下混合了「最近两周」与「长期 / 曾经」条目时，均值本身是跨窗口的，
 * 应当在结果里标注出来，而不是让读者以为它只反映近期状态。
 */
function traitWindows(trait: string, answers: Record<number, number>) {
  const ids = multidimQuestions
    .filter((q) => q.trait === trait && q.kind !== "lie")
    .map((q) => q.id)
    .filter((id) => answerOf(answers, id) !== undefined);
  const windows = [...new Set(ids.map((id) => multidimWindowOf(id)))];
  return {
    windows,
    mixed: windows.length > 1,
    label: windows.map((w) => MULTIDIM_WINDOW_LABEL[w]).join(" + "),
  };
}
/** 回答一致性：一致性复问与同特征主问的差异 ≤ 0.5 记为一致 */
function computeCredibility(answers: Record<number, number>) {
  const mainIdByTrait: Record<string, number> = {};
  for (const q of multidimQuestions) {
    if (q.kind === "main") mainIdByTrait[q.trait] = q.id;
  }
  const pairs: Array<[number, number]> = [];
  for (const q of multidimQuestions) {
    if (q.kind !== "dup") continue;
    const mainId = mainIdByTrait[q.trait];
    if (mainId === undefined) continue;
    const a = answerOf(answers, mainId);
    const b = answerOf(answers, q.id);
    if (a !== undefined && b !== undefined) pairs.push([a, b]);
  }
  if (pairs.length < 2) return null;
  const consistent = pairs.filter(([a, b]) => Math.abs(a - b) <= 0.5).length;
  const rate = consistent / pairs.length;
  const level = rate >= 0.8 ? "回答一致性 · 高" : rate >= 0.5 ? "回答一致性 · 中" : "回答一致性 · 低";
  const kind = rate >= 0.8 ? "high" : rate >= 0.5 ? "mid" : "low";
  return { rate, total: pairs.length, consistent, level, kind };
}

/**
 * 效度：效度题是“几乎没人能做到”的罕见条目，答“符合”计分，得分越高越可能理想化作答。
 *
 * 字段语义（原实现把两者写反，见 reports/ 的问题报告 P1-3）：
 *   score = 命中得分之和（可为小数），items = 本次实际作答的效度题量，
 *   hits  = 选择“符合”方向的题数，rate = score / items。
 * 阈值按 rate 归一化，效度题量变化时判定行为保持一致。
 */
function computeLies(answers: Record<number, number>) {
  const lieIds = multidimQuestions.filter((q) => q.kind === "lie").map((q) => q.id);
  const answered = lieIds.filter((id) => answerOf(answers, id) !== undefined);
  if (answered.length === 0) return null;
  const values = answered.map((id) => answerOf(answers, id) as number);
  const score = values.reduce((s, v) => s + Math.max(0, v), 0);
  const items = answered.length;
  const hits = values.filter((v) => v >= 0.5).length;
  const rate = score / items;
  let level = "可信";
  let detail = "效度题中未出现明显的理想化作答倾向。";
  if (rate > 0.6) {
    level = "回答一致性存疑";
    detail = "您有多道效度题选择了“非常符合/比较符合”，可能存在美化回答的倾向。本次评估结果请谨慎参考，建议放松心态后重新作答。";
  } else if (rate > 0.3) {
    level = "存在理想化倾向";
    detail = "部分效度题选择了较为理想的自我评价，可能存在轻微美化倾向，结果仅作参考。";
  } else if (rate > 0.1) {
    level = "基本可信";
    detail = "效度题整体通过，仅个别条目选择了较理想的自我评价，属常见作答倾向，结果整体可参考。";
  }
  return { score, items, hits, rate, level, detail, alert: rate > 0.3 };
}

/**
 * 严重程度：由 20 个维度的加权均值（即结果页「20 项特征强度总览」展示的同一组数字）汇总。
 *
 * 原实现只对「正向作答」求平均（`values.filter(a => a > 0)`），负值与 0 被整体丢弃，
 * 因此 105 题里只要有一题答「非常符合」，总评就会被推到极重度——总评等级实际由单条题目决定。
 * 现改为与维度分同源，保证「维度总览」与「总评等级」不可能互相矛盾。
 *
 * 字段语义：
 *   mean     = 全部已作答维度的均值（含负值与 0），负值代表整体否认
 *   marked   = 达到「中度」及以上的维度数（≥0.45），是分级的主要依据
 *   elevated = 达到关注线（≥0.25）的维度数
 *   pct      = 困扰覆盖面（elevated / 维度总数，0-100），语义为「有多少维度需要关注」
 *   strongTraits = 信号最强的 4 个维度（按均值降序，而非题目顺序）
 */
function computeSeverity(traitMeans: Record<string, number>) {
  const values = MULTIDIM_TRAIT_ORDER.map((t) => traitMeans[t]).filter(
    (v): v is number => v !== undefined,
  );
  if (values.length === 0) return null;

  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const elevated = values.filter((v) => v >= 0.25).length;
  const marked = values.filter((v) => v >= 0.45).length;
  const strongTraits = MULTIDIM_TRAIT_ORDER.map((t) => ({ t, v: traitMeans[t] ?? -1 }))
    .filter((x) => x.v >= 0.45)
    .sort((a, b) => b.v - a.v)
    .slice(0, 4)
    .map((x) => MULTIDIM_TRAIT_LABELS[x.t])
    .filter((x): x is string => Boolean(x));

  let level: string;
  if (marked === 0) {
    level = mean < -0.25 ? "未见异常" : "正常";
  } else if (marked <= 4) {
    level = "轻度";
  } else if (marked <= 9) {
    level = "中度";
  } else if (marked <= 14) {
    level = "重度";
  } else {
    level = "极重度";
  }

  return { level, pct: Math.round((elevated / values.length) * 100), mean, elevated, marked, strongTraits };
}

/**
 * 作答风格（直线作答 / 低变异）检测。
 *
 * 原实现的「回答一致性」只比对「主问 vs 复问」，对全选同一选项的直线作答完全不敏感：
 * 105 题全选同一选项时一致率恒为 1，反而拿到「回答一致性 · 高」的背书。
 */
function computeResponseStyle(answers: Record<number, number>) {
  const values = multidimQuestions
    .filter((q) => q.kind !== "lie")
    .map((q) => answerOf(answers, q.id))
    .filter((v): v is number => v !== undefined);
  if (values.length < 10) return null;

  const counts = new Map<number, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  const modeShare = Math.max(...counts.values()) / values.length;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;

  // 全选同一选项，或 95% 以上集中在同一选项且方差极低 → 直线作答
  const flat = counts.size === 1 || (modeShare >= 0.95 && variance < 0.02);
  return {
    flat,
    modeShare: Number(modeShare.toFixed(4)),
    variance: Number(variance.toFixed(4)),
    distinct: counts.size,
    answered: values.length,
  };
}

function traitLevel(s: number): { text: string; kind: "none" | "mild" | "moderate" | "severe" | "extreme" } {
  if (s < -0.25) return { text: "未见异常", kind: "none" };
  const a = Math.abs(s);
  if (a < 0.25) return { text: "正常", kind: "none" };
  if (a < 0.45) return { text: "轻度", kind: "mild" };
  if (a < 0.65) return { text: "中度", kind: "moderate" };
  if (a < 0.85) return { text: "重度", kind: "severe" };
  return { text: "极重度", kind: "extreme" };
}

export function scoreMultidim(
  answers: Record<number, number>,
  mode?: string,
  respondent: RespondentMode = "self",
): ScoringResult {
  const modeName = MULTIDIM_MODES.find((m) => m.id === mode)?.name || "标准评估";
  // 代答（知情者依据观察作答）：作答来源不同，效度与一致性结论不能沿用自评口径
  const isProxy = respondent === "proxy";
  const traitMeans = aggregateTraitMeans(answers);
  // 严重度与维度总览同源：都取自这组加权均值
  const severity = computeSeverity(traitMeans);

  // —— 安全信号（danger 级）与关注信号（warn 级）——
  // 设计约束：
  //   1) 信号与维度分使用同一套题目，「幻觉」只能由感知异常条目触发；
  //   2) 自伤 / 轻生按条目触发（安全优先，与 PHQ-9 第 9 题同口径），不设均值门槛；
  //   3) 条目级触发与维度分不一致时输出解释，而不是并列两个相反结论。
  const signals: MultidimSignal[] = [];
  const hallucinationMean = traitMeans.hallucination ?? 0;
  const perceptionHits = hitItems("hallucination", PERCEPTION_KINDS, answers);
  const perceptionFollowUpHits = hitItems("hallucination", FOLLOW_UP_KINDS, answers);
  const suicideHits = hitItems("suicide", null, answers);

  if (suicideHits.length > 0) {
    signals.push({
      trait: "suicide",
      label: "自伤或轻生的念头",
      level: "danger",
      traitMean: traitMeans.suicide ?? 0,
      itemIds: suicideHits,
      detail: `您在第 ${suicideHits.join("、")} 题上作出了肯定回答（该维度整体得分 ${fmtMean(traitMeans.suicide)}）。安全筛查条目按单题处理，无论整体得分高低都请优先按上方提示采取行动。`,
    });
  }

  if (perceptionHits.length > 0 || hallucinationMean >= SIGNAL_MEAN) {
    const byItemOnly = perceptionHits.length > 0 && hallucinationMean < SIGNAL_MEAN_QUIET;
    signals.push({
      trait: "hallucination",
      label: "幻觉体验（听到或看到不存在的事物）",
      level: "danger",
      traitMean: hallucinationMean,
      itemIds: perceptionHits,
      detail: byItemOnly
        ? `您在第 ${perceptionHits.join("、")} 题上作出了肯定回答；该维度整体得分 ${fmtMean(hallucinationMean)}，其余条目未出现一致信号。这属于条目级提示，建议与专业人员当面核对。`
        : perceptionHits.length > 0
          ? `您在第 ${perceptionHits.join("、")} 题上作出了肯定回答，该维度整体得分 ${fmtMean(hallucinationMean)}。`
          : `该维度整体得分 ${fmtMean(hallucinationMean)}，属于需要优先处理的方向。`,
    });
  } else if (perceptionFollowUpHits.length > 0) {
    signals.push({
      trait: "hallucination",
      label: "对感知异常的担忧（主诉条目未肯定）",
      level: "warn",
      traitMean: hallucinationMean,
      itemIds: perceptionFollowUpHits,
      detail: `您在第 ${perceptionFollowUpHits.join("、")} 题上作出了肯定回答，但描述具体感知异常的主问与复问均未肯定，建议核对前后作答是否一致。`,
    });
  }

  for (const [trait, label] of [
    ["paranoia", "强烈的被害 / 关系观念"],
    ["impulse", "难以控制的冲动或攻击行为"],
  ] as const) {
    const mean = traitMeans[trait] ?? 0;
    if (mean >= SIGNAL_MEAN) {
      signals.push({
        trait,
        label,
        level: "warn",
        traitMean: mean,
        itemIds: [],
        detail: `该维度整体得分 ${fmtMean(mean)}，属于需要关注的方向。`,
      });
    }
  }

  const severeSignals = signals.filter((s) => s.level === "danger");
  const concernSignals = signals.filter((s) => s.level === "warn");
  const severeUnique = [...new Set(severeSignals.map((s) => s.label))];
  const concernUnique = [...new Set(concernSignals.map((s) => s.label))];

  // 作答有效性：直线作答不产出任何结论，避免给无效作答盖上「评估结果良好」的章
  const responseStyle = computeResponseStyle(answers);
  const invalidResponse = responseStyle?.flat === true;
  const validity = {
    valid: !invalidResponse,
    reason: invalidResponse
      ? "全部或几乎所有题目选择了同一选项，属直线作答，本次结果不具备参考价值，请重新作答。"
      : "",
    responseStyle,
  };

  // 「结果良好」的判据同样改为维度分布：没有任何维度达到关注线，也没有安全 / 关注信号。
  // 原实现用判别式吻合度 < 40 判定，等于把「是否异常」也压在同一个不具可比性的相似度分数上。
  const isNormal =
    !invalidResponse &&
    severeUnique.length === 0 &&
    concernUnique.length === 0 &&
    (severity?.elevated ?? 0) === 0;

  // 主要特征方向：正向确认且信号较强的前 4 项
  const topTraits = MULTIDIM_TRAIT_ORDER.flatMap((t) => {
    const v = traitMeans[t];
    return v !== undefined && v >= 0.35 ? [{ t, v }] : [];
  })
    .sort((a, b) => b.v - a.v)
    .slice(0, 4)
    .map((x) => traitLabel(x.t));

  // 代答：掩饰题（「我长这么大从来没说过一句谎话」）与主问-复问一致率都是为自评设计的，
  // 代答者回答的是「我观察到的这个人」，套用同一套效度判据会给出没有依据的结论，
  // 因此只保留作答行为层面的直线作答检测，效度与一致性一律标为不适用。
  let credibility = computeCredibility(answers);
  if (isProxy && credibility) {
    credibility = {
      rate: 0,
      total: credibility.total ?? 0,
      consistent: 0,
      level: "回答一致性 · 不适用（知情者代答）",
      kind: "low",
    };
  }
  if (invalidResponse) {
    credibility = {
      rate: 0,
      total: credibility?.total ?? 0,
      consistent: 0,
      level: "回答一致性 · 不适用（直线作答）",
      kind: "low",
    };
  }
  let lie = computeLies(answers);
  if (isProxy && lie) {
    lie = {
      ...lie,
      level: "不适用（知情者代答）",
      detail:
        "本次为他人代答。掩饰与理想化条目针对的是当事人的自我报告，代答者无法据此判断，故效度校验不适用。",
      alert: false,
    };
  }
  if (invalidResponse && lie) {
    lie = {
      ...lie,
      level: "不适用（直线作答）",
      detail: "本次作答为直线作答，效度校验不适用；请放松心态后重新作答。",
      alert: true,
    };
  }
  // 20 维特征总览（含未作答维度）
  const traits = MULTIDIM_TRAIT_ORDER.map((t) => {
    const value = traitMeans[t];
    if (value === undefined) {
      return { trait: t, label: MULTIDIM_TRAIT_LABELS[t], value: 0, width: 0, display: "—", noData: true, level: "无数据", levelKind: "none" as const };
    }
    const lv = traitLevel(value);
    const win = traitWindows(t, answers);
    return {
      trait: t,
      label: MULTIDIM_TRAIT_LABELS[t],
      value,
      width: Math.round(Math.min(Math.abs(value), 1) * 100),
      display: (value > 0 ? "+" : "") + value.toFixed(2),
      noData: false,
      level: lv.text,
      levelKind: lv.kind,
      // 该维度本次作答覆盖的时间窗口；mixed 为 true 表示维度分是跨窗口合成的
      window: win.label,
      windows: win.windows,
      windowMixed: win.mixed,
    };
  });

  // 跨窗口合成的维度提示：这些维度的分数同时包含近期状态与长期 / 既往特征
  const mixedWindowTraits = traits.filter((row) => !row.noData && row.windowMixed);
  const windowNotice =
    mixedWindowTraits.length > 0
      ? `以下维度本次同时包含「最近两周」与其他时间范围的条目，其分数是跨窗口合成的，解读时请留意：${mixedWindowTraits.map((r) => `${r.label}（${r.window}）`).join("；")}。`
      : "";

  // 程度分布统计
  const lvCount: Record<string, number> = {};
  for (const row of traits) lvCount[row.level] = (lvCount[row.level] || 0) + 1;
  const statParts: string[] = [];
  for (const key of ["极重度", "重度", "中度", "轻度", "正常", "未见异常", "无数据"]) {
    if (lvCount[key]) statParts.push(`${key} ${lvCount[key]} 项`);
  }
  const traitStatsText = statParts.length > 0 ? `程度分布：${statParts.join(" · ")}` : "";

  // —— 专业建议 ——
  const posEntries = Object.keys(traitMeans)
    .map((t) => ({ t, v: traitMeans[t]! }))
    .filter((x) => x.v > 0.3)
    .sort((a, b) => b.v - a.v);
  const posAvg = posEntries.length > 0 ? posEntries.reduce((s, x) => s + x.v, 0) / posEntries.length : 0;
  const sevLevel = severity ? severity.level : posAvg > 0.65 ? "重度" : posAvg > 0.45 ? "中度" : posAvg > 0.25 ? "轻度" : "正常";

  let overallKind: "danger" | "heavy" | "moderate" | "light" | "invalid";
  let overall: string;
  if (invalidResponse) {
    overallKind = "invalid";
    overall =
      "本次作答被判为直线作答（全部或几乎所有题目选择了同一选项），无法据此得出任何结论。请放松心态、按实际情况重新作答一次；如对题目有疑问，可先选择「不确定」。";
  } else if (severeUnique.length > 0) {
    overallKind = "danger";
    overall = `请优先处理安全事项：您回答中出现了${severeUnique.join("、")}相关信号。请立即联系信任的亲友，或拨打全国统一心理援助热线 12356（24 小时、免费）；若念头强烈或已有具体计划，请拨打 120 或前往就近医院急诊，并尽快安排精神科评估。`;
  } else if (sevLevel === "极重度" || sevLevel === "重度") {
    overallKind = "heavy";
    overall = "您回答中的多项信号较强，建议近期安排一次专业评估（精神科或心理门诊），不要独自应对。本量表结果可作为与专业人员沟通时的参考材料。";
  } else if (sevLevel === "中度" || concernUnique.length > 0) {
    overallKind = "moderate";
    overall =
      concernUnique.length > 0
        ? `您回答中出现了${concernUnique.join("、")}相关信号，建议在未来 2–4 周关注对应方面的变化，尝试下方针对性建议；若持续无改善，建议进行专业咨询。`
        : "您回答中部分方面存在信号，建议在未来 2–4 周关注对应方面的变化，尝试下方针对性建议；若持续无改善，建议进行专业咨询。";
  } else {
    overallKind = "light";
    overall = "您回答整体信号较弱。建议保持规律作息、适度运动与稳定的社交联结，并定期关注自己的情绪状态。";
  }

  const severeSet = new Set(["suicide", "hallucination"]);
  const targeted = posEntries
    .slice(0, 3)
    .map((x) => ({
      trait: x.t,
      label: traitLabel(x.t),
      text: ADVICE_MAP[x.t] || "",
      severe: severeSet.has(x.t),
    }))
    .filter((x) => x.text);

  const isMild = severeUnique.length === 0 && (sevLevel === "轻度" || sevLevel === "正常" || sevLevel === "未见异常");
  const daily = [
    "作息：固定入睡与起床时间，保证 7–8 小时睡眠。",
    "运动：每周 3–5 次、每次约 30 分钟的中等强度运动（快走、慢跑等），有助于情绪调节。",
    isMild
      ? "联结：与家人、朋友保持定期联系，分享生活中的点滴，维系稳定的社会支持。"
      : "联结：与家人、朋友保持定期联系；如情绪困扰持续存在，请及时寻求专业帮助。",
  ];

  let followUp: string;
  if (severeUnique.length > 0) {
    followUp = "本次回答包含需要重视的信号，建议尽快（1 周内）安排专业评估；若经评估无需干预，可在专业指导下制定复测计划。";
  } else if (sevLevel === "极重度" || sevLevel === "重度") {
    followUp = "建议 2–4 周后复测一次，观察变化趋势；若期间症状加重，请提前寻求专业评估。";
  } else if (sevLevel === "中度") {
    followUp = "建议 1 个月后复测；期间保持规律作息与适度运动，记录情绪波动的时间与诱因。";
  } else if (sevLevel === "轻度") {
    followUp = "建议 1–3 个月后复测，结合日常自我观察判断是否需要进一步关注。";
  } else {
    followUp = "可每 3–6 个月进行一次常规自评，持续关注自身状态变化。";
  }
  const adviceNote =
    "以上建议根据您的回答自动生成，仅供自我调节参考，不构成诊断或治疗方案；如需帮助，请咨询精神科或心理专业人员。";

  // 评估摘要
  const posCount = Object.keys(traitMeans).filter((t) => traitMeans[t]! > 0.3).length;
  // 条目级安全信号与维度分不一致时（例如仅在感知异常主问上肯定、其余条目均否认），
  // 总览不再显示「未见异常」与安全提示并列，而是明确以安全信号为准并指向说明。
  const severityQuiet = !severity || severity.elevated === 0;
  const signalOverridesLevel = severeUnique.length > 0 && severityQuiet;
  const sumLevel = invalidResponse
    ? "作答无效"
    : signalOverridesLevel
      ? "需优先处理"
      : isNormal
        ? "正常"
        : severity
          ? severity.level
          : "轻度";
  const sumLevelKind = invalidResponse
    ? "warn"
    : signalOverridesLevel
      ? "severe"
      : isNormal
        ? "ok"
        : severity && (severity.level === "极重度" || severity.level === "重度")
          ? "severe"
          : severity && severity.level === "中度"
            ? "warn"
            : "ok";
  let summaryNote: string;
  if (invalidResponse) {
    summaryNote = validity.reason;
  } else if (severeUnique.length > 0) {
    summaryNote = "本次回答包含需要重视的安全信号，请优先参照上方安全提示采取行动，并尽快安排专业评估。";
  } else if (concernUnique.length > 0) {
    summaryNote = `本次回答在「${concernUnique.join("、")}」方向上出现需要关注的信号，建议参照上方提示与针对性建议，并在 2–4 周后复测观察变化。`;
  } else if (isNormal) {
    summaryNote = "各维度信号整体平稳，未发现达到关注标准的异常信号；建议保持规律作息与适度运动，并定期自我关注。";
  } else if (posCount <= 2) {
    summaryNote = `本次评估在 ${posCount} 项特征上出现正向信号，程度尚不突出；建议参考下方针对性建议，并在 2–4 周后复测观察变化。`;
  } else {
    summaryNote = `本次评估在 ${posCount} 项特征上检出正向信号，以「${topTraits.join("、")}」较为明显；建议结合专业建议进行自我调节，必要时寻求专业评估。`;
  }

  const summary = {
    level: sumLevel,
    levelKind: sumLevelKind,
    traitsText: topTraits.length > 0 ? topTraits.join("、") : "无明显特征方向",
    severeText: severeUnique.length > 0 ? "检出（详见安全提示）" : "未检出",
    severeKind: severeUnique.length > 0 ? "severe" : "ok",
    concernText: concernUnique.length > 0 ? concernUnique.join("、") : "未检出",
    concernKind: concernUnique.length > 0 ? "warn" : "ok",
    // 参考方向不再输出障碍名与吻合度百分比，改为提示需关注的维度数
    elevated: severity?.elevated ?? 0,
    traitTotal: MULTIDIM_TRAIT_ORDER.length,
    note: summaryNote,
  };

  // 复制 / 分享用的纯文本建议
  const suggestionParts: string[] = [overall];
  if (targeted.length > 0) {
    suggestionParts.push("");
    suggestionParts.push("【针对性建议】");
    for (const item of targeted) suggestionParts.push(`• ${item.label}：${item.text}`);
  }
  suggestionParts.push("");
  suggestionParts.push("【日常建议】");
  for (const item of daily) suggestionParts.push(`• ${item}`);
  suggestionParts.push("");
  suggestionParts.push(`【复测建议】${followUp}`);
  const suggestion = suggestionParts.join("\n");

  // 维度分数（供结果复制 / 历史回顾使用；结果页由专用组件渲染）
  const dimensionScores: Record<string, any> = { type: "multidim" };
  for (const row of traits) {
    dimensionScores[row.trait] = {
      name: row.label,
      score: row.value,
      max: 1,
      level: row.level,
      desc: MULTIDIM_TRAIT_DESC[row.trait],
    };
  }

  // 结果「等级」只描述整体信号强度，不再挂具体障碍名与吻合度百分比：
  // 该量表自述不具备心理测量学验证，输出带百分比的诊断名会把参考信息读成结论。
  const level = invalidResponse
    ? "作答无效：疑似直线作答，请重新作答"
    : isNormal
      ? "评估结果良好"
      : `多维特征自评 · ${severity?.level ?? "轻度"}`;
  const severityValue = invalidResponse ? 0 : (severity?.pct ?? 0) / 100;

  return {
    // 本量表不产出可累加的总分（维度强度是相对值，参考方向已不再计分），
    // 置 0 以避免被任何展示层当作「分数」读。
    totalScore: 0,
    maxScore: 0,
    level,
    suggestion,
    severity: severityValue,
    dimensionScores,
    multidimReport: {
      reportVersion: MULTIDIM_REPORT_VERSION,
      modeName,
      // 作答来源：代答会系统性改变结果的含义，必须在报告里显式标注
      respondent: {
        mode: respondent,
        label: isProxy ? "他人代答（知情者评估）" : "本人自评",
        notice: isProxy
          ? "本报告由他人依据观察代答生成，反映的是代答者看到的侧面，不是当事人的自我感受。代答通常会高估可被观察到的行为表现（睡眠、发脾气、丢三落四），并显著低估只有本人才知道的内在体验（情绪低落、空虚、自伤念头），因此本报告只适合作为与当事人或专业人员沟通的材料。"
          : "",
      },
      isNormal,
      traits,
      traitStatsText,
      windowNotice,
      mixedWindowTraits: mixedWindowTraits.map((r) => ({ trait: r.trait, label: r.label, window: r.window })),
      summary,
      severity,
      credibility,
      lie,
      severeSignals: severeUnique,
      severeSignalDetails: severeSignals,
      concernSignals: concernUnique,
      concernSignalDetails: concernSignals,
      validity,
      topTraits,
      posCount,
      advice: { overallKind, overall, targeted, daily, followUp, note: adviceNote },
    },
  };
}
