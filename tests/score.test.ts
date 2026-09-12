import { describe, it, expect } from "vitest";
import { calculateScore, isRespondentMode } from "../server/utils/score";
import { bisQuestions } from "../server/utils/questions/bis-questions";
import {
  MULTIDIM_BASE_MAINS,
  MULTIDIM_QUESTION_WINDOWS,
  MULTIDIM_TRAIT_ORDER,
  MULTIDIM_WINDOW_LABEL,
  buildMultidimQuestions,
  multidimQuestionById,
  multidimQuestions,
  multidimWindowOf,
} from "../server/utils/questions/multidim-questions";

/** 生成 count 道题、每题 value 的作答 */
function full(count: number, value: number): Record<number, number> {
  const answers: Record<number, number> = {};
  for (let i = 1; i <= count; i++) answers[i] = value;
  return answers;
}

/** 生成 count 道题、总分恰为 total 的作答（每题 0~3，从第一题起贪心填满） */
function withTotal(count: number, total: number): Record<number, number> {
  const answers: Record<number, number> = {};
  let rest = total;
  for (let i = 1; i <= count; i++) {
    const v = Math.min(3, Math.max(0, rest));
    answers[i] = v;
    rest -= v;
  }
  return answers;
}

describe("calculateScore 基础评分", () => {
  it("PHQ-9：全选最高分 → 重度抑郁", () => {
    const r = calculateScore({ testId: "phq9", answers: full(9, 3) });
    expect(r.totalScore).toBe(27);
    expect(r.level).toBe("重度抑郁");
  });

  it("PHQ-9：全选最低分 → 无显著抑郁症状", () => {
    const r = calculateScore({ testId: "phq9", answers: full(9, 0) });
    expect(r.totalScore).toBe(0);
    expect(r.level).toBe("无显著抑郁症状");
  });

  it("GAD-7：全选最高分 → 重度焦虑", () => {
    const r = calculateScore({ testId: "gad7", answers: full(7, 3) });
    expect(r.totalScore).toBe(21);
    expect(r.level).toBe("重度焦虑");
  });

  // 回归：这四档曾整体错位一档（0~4 分被标成「轻度焦虑」，而同一条结果的建议却写「正常范围」）
  it("GAD-7：四档分级边界与标准分级一致", () => {
    const levelAt = (score: number) =>
      calculateScore({ testId: "gad7", answers: withTotal(7, score) }).level;

    expect(levelAt(0)).toBe("无显著焦虑症状");
    expect(levelAt(4)).toBe("无显著焦虑症状");
    expect(levelAt(5)).toBe("轻度焦虑");
    expect(levelAt(9)).toBe("轻度焦虑");
    expect(levelAt(10)).toBe("中度焦虑");
    expect(levelAt(14)).toBe("中度焦虑");
    expect(levelAt(15)).toBe("重度焦虑");
    expect(levelAt(21)).toBe("重度焦虑");
  });

  it("GAD-7：最低档标签与建议不得自相矛盾", () => {
    const r = calculateScore({ testId: "gad7", answers: withTotal(7, 0) });
    expect(r.level).toBe("无显著焦虑症状");
    expect(r.suggestion).toContain("正常范围");
    expect(r.level).not.toContain("轻度");
  });

  it("PSS-10：反向题应按反向计分", () => {
    // 反向题 4,5,7,8 反向后归 0，正向题 6 题 × 4 = 24
    const r = calculateScore({ testId: "pss", answers: full(10, 4) });
    expect(r.totalScore).toBe(24);
    expect(r.maxScore).toBe(40);
  });

  it("SDS：反向计分 + 标准分换算", () => {
    const r = calculateScore({ testId: "sds", answers: full(20, 1) });
    // 正向 10 题 ×1 + 反向 10 题 ×(5-1)=40 → raw 50 → 标准分 round(50*1.25)=63
    expect(r.rawScore).toBe(50);
    expect(r.standardizedScore).toBe(63);
    expect(r.maxScore).toBe(100);
  });

  it("SCL-90：全选 1 → 总均分 1、状态良好", () => {
    const r = calculateScore({ testId: "scl90", answers: full(90, 1) });
    expect(r.totalScore).toBe(90);
    expect(r.standardizedScore).toBe(1);
    expect(r.level).toBe("心理健康状况良好");
  });

  it("MDQ：13 症状 + 同现 + 功能损害 → 阳性筛查", () => {
    const r = calculateScore({ testId: "mdq", answers: full(15, 1) });
    expect(r.level).toBe("阳性筛查（建议进一步评估）");
    expect(r.dimensionScores?.isPositiveScreen).toBe(true);
  });

  it("RSES：反向题按反向计分，全选同值 → 中等自尊", () => {
    // 反向 5 题(3,5,8,9,10)补值 4 + 正向 5 题 ×1 = 25
    const r = calculateScore({ testId: "rses", answers: full(10, 1) });
    expect(r.totalScore).toBe(25);
    expect(r.maxScore).toBe(40);
    expect(r.level).toBe("中等自尊");
  });

  it("RSES：全选最高分 → 总分仍为 25（反向题等幅抵消）", () => {
    const r = calculateScore({ testId: "rses", answers: full(10, 4) });
    expect(r.totalScore).toBe(25);
  });

  it("七宗罪与七美德：全选最不像我 → 罪德指数均为 0", () => {
    const r = calculateScore({ testId: "seven", answers: full(60, 1) });
    expect(r.sevenReport?.sinIndex).toBe(0);
    expect(r.sevenReport?.virtueIndex).toBe(0);
    expect(r.sevenReport?.sins).toHaveLength(7);
    expect(r.sevenReport?.virtues).toHaveLength(7);
  });

  it("七宗罪与七美德：全选非常像我 → 罪德指数均为 100，双高共存 7 组", () => {
    const r = calculateScore({ testId: "seven", answers: full(60, 5) });
    expect(r.sevenReport?.sinIndex).toBe(100);
    expect(r.sevenReport?.virtueIndex).toBe(100);
    expect(r.sevenReport?.coexist).toHaveLength(7);
    expect(r.level).toBe("魔王转世 · 圣人气象");
  });

  it("七宗罪与七美德：全选中立 → 罪德指数均为 50，无共存", () => {
    const r = calculateScore({ testId: "seven", answers: full(60, 3) });
    expect(r.sevenReport?.sinIndex).toBe(50);
    expect(r.sevenReport?.virtueIndex).toBe(50);
    expect(r.sevenReport?.coexist).toHaveLength(0);
    expect(r.totalScore).toBe(50);
  });

  it("心理年龄：全选中立 → 六维中点加权合成 33 岁，迷航待航", () => {
    const r = calculateScore({ testId: "psy-age", answers: full(42, 3) });
    expect(r.totalScore).toBe(33);
    expect(r.psyAgeReport?.descriptor).toBe("两轴都在蓄力");
    expect(r.psyAgeReport?.archetype.id).toBe("mihang");
    expect(r.psyAgeReport?.dims).toHaveLength(6);
    expect(r.psyAgeReport?.maturity).toBe(50);
    expect(r.psyAgeReport?.youth).toBe(50);
    expect(r.psyAgeReport?.resLevel).toBe("担当适中");
    expect(r.psyAgeReport?.balance.label).toBe("非常均衡");
  });

  it("心理年龄：填生理年龄 22 → 心理 33 偏高约 11 岁", () => {
    const a = full(42, 3);
    a[43] = 22;
    const r = calculateScore({ testId: "psy-age", answers: a });
    expect(r.psyAgeReport?.chrono).toBe(22);
    expect(r.psyAgeReport?.diff).toBe(11);
    expect(r.psyAgeReport?.diffLabel).toBe("大 11 岁");
    expect(r.psyAgeReport?.describe).toBe("比你的实际年龄成熟");
  });
});


describe("评分边界与维度补充", () => {
  // —— BDC 伯恩斯抑郁清单：四档边界 ——
  it("BDC：全 0 → 无抑郁；全 3 → 重度，满分为45", () => {
    const low = calculateScore({ testId: "bdc", answers: full(15, 0) });
    expect(low.totalScore).toBe(0);
    expect(low.level).toBe("没有抑郁症");
    const high = calculateScore({ testId: "bdc", answers: full(15, 3) });
    expect(high.totalScore).toBe(45);
    expect(high.maxScore).toBe(45);
    expect(high.level).toBe("严重抑郁");
  });

  it("BDC：15 / 30 分别落在轻度 / 中度", () => {
    expect(calculateScore({ testId: "bdc", answers: full(15, 1) }).level).toBe("轻度抑郁");
    expect(calculateScore({ testId: "bdc", answers: full(15, 2) }).level).toBe("中度抑郁");
  });

  // —— ASRM 躁狂自评量表 ——
  it("ASRM：全 4 → 高度提示；全 1 → 无明显；五项剖面齐全", () => {
    const high = calculateScore({ testId: "asrm", answers: full(5, 4) });
    expect(high.totalScore).toBe(20);
    expect(high.maxScore).toBe(20);
    expect(high.level).toBe("高度提示躁狂发作可能");
    const low = calculateScore({ testId: "asrm", answers: full(5, 1) });
    expect(low.totalScore).toBe(5);
    expect(low.level).toBe("无明显躁狂症状");
    const keys = Object.keys(low.dimensionScores ?? {}).filter((k) => k !== "type");
    expect(keys).toHaveLength(5);
  });

  // —— 情绪稳定性 ——
  it("情绪稳定性：全 0 → 不稳定；全 2 → 很稳定", () => {
    const low = calculateScore({ testId: "emotional-stability", answers: full(30, 0) });
    expect(low.totalScore).toBe(0);
    expect(low.level).toBe("不稳定");
    const high = calculateScore({ testId: "emotional-stability", answers: full(30, 2) });
    expect(high.totalScore).toBe(60);
    expect(high.maxScore).toBe(60);
    expect(high.level).toBe("很稳定");
  });

  it("情绪稳定性：前 12 题答 1 → 总分 12 → 不太稳定", () => {
    const a: Record<number, number> = {};
    for (let i = 1; i <= 12; i++) a[i] = 1;
    const r = calculateScore({ testId: "emotional-stability", answers: a });
    expect(r.totalScore).toBe(12);
    expect(r.level).toBe("不太稳定");
  });

  // —— MDQ 心境障碍问卷 ——
  it("MDQ：全 0 → 无明显；症状≥7 但未共现 → 高症状（需关注）", () => {
    const none = calculateScore({ testId: "mdq", answers: full(15, 0) });
    expect(none.dimensionScores?.symptomCount).toBe(0);
    expect(none.level).toBe("无明显躁狂症状");

    const a: Record<number, number> = {};
    for (let i = 1; i <= 7; i++) a[i] = 1;
    a[14] = 0; // 未共现
    a[15] = 1; // 有功能损害
    const r = calculateScore({ testId: "mdq", answers: a });
    expect(r.dimensionScores?.isPositiveScreen).toBe(false);
    expect(r.level).toBe("高症状（需关注）");
  });

  it("MDQ：症状≥7 + 共现 + 功能损害 → 阳性筛查", () => {
    const a: Record<number, number> = {};
    for (let i = 1; i <= 7; i++) a[i] = 1;
    a[14] = 1;
    a[15] = 1;
    const r = calculateScore({ testId: "mdq", answers: a });
    expect(r.dimensionScores?.isPositiveScreen).toBe(true);
    expect(r.level).toBe("阳性筛查（建议进一步评估）");
  });

  // —— RSES 双因子：自我胜任感 / 自我接纳 ——
  it("RSES：正向全 1 + 反向全 4 → 总分 10 低自尊，胜任感均分 1", () => {
    const a: Record<number, number> = {};
    [1, 2, 4, 6, 7].forEach((i) => (a[i] = 1));
    [3, 5, 8, 9, 10].forEach((i) => (a[i] = 4));
    const r = calculateScore({ testId: "rses", answers: a });
    expect(r.totalScore).toBe(10);
    expect(r.level).toBe("低自尊");
    expect(r.dimensionScores?.competence?.avg).toBe(1);
    expect(r.dimensionScores?.liking?.avg).toBe(1);
  });

  // —— PSS 两因子：无助感 / 自我效能 ——
  it("PSS：全 4 → 无助感维度 24、掌控感维度 0", () => {
    const r = calculateScore({ testId: "pss", answers: full(10, 4) });
    expect(r.totalScore).toBe(24);
    expect(r.dimensionScores?.helplessness?.score).toBe(24);
    expect(r.dimensionScores?.selfEfficacy?.score).toBe(0);
  });

  // —— SDS 精神运动维度（反向折算）——
  it("SDS：全答题取 1 → 精神运动维度均分为 4", () => {
    const r = calculateScore({ testId: "sds", answers: full(20, 1) });
    expect(r.dimensionScores?.psychomotor?.avg).toBe(4);
  });

  // —— SCL-90 维度结构 ——
  it("SCL-90：全 1 → 总分 90，各维度均分 1", () => {
    const r = calculateScore({ testId: "scl90", answers: full(90, 1) });
    expect(r.totalScore).toBe(90);
    expect(r.maxScore).toBe(450);
    expect(r.dimensionScores?.depression?.average).toBe(1);
    expect(r.dimensionScores?.somatization?.average).toBe(1);
  });

  // —— 缺失作答的行为说明：仅累计已作答题 ——
  it("PHQ-9：只作答部分题 → 只累计已作答的分值", () => {
    const r = calculateScore({ testId: "phq9", answers: { 1: 3, 2: 2 } });
    expect(r.totalScore).toBe(5);
  });
});

describe("人格类量表补充（temperament / EPQ / EPQ-RSC / MBTI / 16PF）", () => {
  // —— 气质类型：维度题号映射与典型度 ——
  it("temperament：只作答抑郁质题（值1）→ 一般抑郁质，维度得分正确", () => {
    const a: Record<number, number> = {};
    [3, 5, 12, 15, 20, 24, 28, 32, 35, 37, 41, 47, 51, 53, 59].forEach((i) => (a[i] = 1));
    const r = calculateScore({ testId: "temperament", answers: a });
    expect(r.dimensionScores?.melancholic?.score).toBe(15);
    expect(r.dimensionScores?.primaryType).toBe("melancholic");
    expect(r.dimensionScores?.typicalLevel).toBe("一般");
    expect(r.totalScore).toBe(15);
    expect(r.level).toBe("一般抑郁质");
  });

  it("temperament：抑郁质全 5 → 典型抑郁质（分差≥4 判定单一气质）", () => {
    const a: Record<number, number> = {};
    [3, 5, 12, 15, 20, 24, 28, 32, 35, 37, 41, 47, 51, 53, 59].forEach((i) => (a[i] = 5));
    const r = calculateScore({ testId: "temperament", answers: a });
    expect(r.dimensionScores?.melancholic?.score).toBe(75);
    expect(r.dimensionScores?.typicalLevel).toBe("典型");
    expect(r.level).toBe("典型抑郁质");
  });

  it("temperament：四维均作答为 1 → 全同分，判为混合气质、四维 15 分", () => {
    const r = calculateScore({ testId: "temperament", answers: full(60, 1) });
    expect(r.dimensionScores?.choleric?.score).toBe(15);
    expect(r.dimensionScores?.sanguine?.score).toBe(15);
    expect(r.dimensionScores?.phlegmatic?.score).toBe(15);
    expect(r.dimensionScores?.melancholic?.score).toBe(15);
    expect(r.level).toMatch(/混合型/);
  });

  // —— EPQ（88 题）：维度映射 / 反向计分 / 原始分 ——
  it("EPQ：全部答『是』→ 各量表原始分 (E18 / N24 / P12 / L5)", () => {
    const a: Record<number, number> = {};
    for (let i = 1; i <= 88; i++) a[i] = 1;
    const r = calculateScore({ testId: "epq", answers: a });
    expect(r.dimensionScores?.E?.raw).toBe(18);
    expect(r.dimensionScores?.N?.raw).toBe(24);
    expect(r.dimensionScores?.P?.raw).toBe(12);
    expect(r.dimensionScores?.L?.raw).toBe(5);
    expect(r.level).toMatch(/型人格$/);
  });

  it("EPQ：全部答『否』→ 反向题计 1，原始分 (E3 / N0 / P11 / L15)", () => {
    // E 反向题 21,29,45 共 3 题；N 全正向 0；P 反向 11 题；L 反向 15 题
    const a: Record<number, number> = {};
    for (let i = 1; i <= 88; i++) a[i] = 0;
    const r = calculateScore({ testId: "epq", answers: a });
    expect(r.dimensionScores?.E?.raw).toBe(3);
    expect(r.dimensionScores?.N?.raw).toBe(0);
    expect(r.dimensionScores?.P?.raw).toBe(11);
    expect(r.dimensionScores?.L?.raw).toBe(15);
  });

  // —— EPQ-RSC（48 题）：原始分与总分 ——
  it("EPQ-RSC：全部答『是』→ 原始分 (E11 / N12 / P5 / L3)，总分=E", () => {
    const a: Record<number, number> = {};
    for (let i = 1; i <= 48; i++) a[i] = 1;
    const r = calculateScore({ testId: "epq-rsc", answers: a });
    expect(r.dimensionScores?.E?.raw).toBe(11);
    expect(r.dimensionScores?.N?.raw).toBe(12);
    expect(r.dimensionScores?.P?.raw).toBe(5);
    expect(r.dimensionScores?.L?.raw).toBe(3);
    expect(r.totalScore).toBe(11);
    expect(r.level).toMatch(/倾向$/);
  });

  // —— MBTI：类型结构不变量 ——
  it("MBTI：level 为规范四字母且与 dimensionScores.type 一致", () => {
    const r = calculateScore({ testId: "mbti", answers: {} });
    const type = r.level as string;
    expect(type).toMatch(/^[EI][SN][TF][JP]$/);
    expect(r.dimensionScores?.type).toBe(type);
    expect("EI".includes(r.dimensionScores?.E_I?.result)).toBe(true);
    expect("SN".includes(r.dimensionScores?.S_N?.result)).toBe(true);
    expect("TF".includes(r.dimensionScores?.T_F?.result)).toBe(true);
    expect("JP".includes(r.dimensionScores?.J_P?.result)).toBe(true);
    expect(r.totalScore).toBeGreaterThanOrEqual(0);
    expect(r.totalScore).toBeLessThanOrEqual(100);
  });

  // —— 16PF：因素标准分与次级因素结构 ——
  it("16PF：16 个因素标准分均落在 1–10，次级因素 X1–X4 齐全", () => {
    const r = calculateScore({ testId: "sixteenPF", answers: {} });
    const factors = r.dimensionScores?.factors ?? {};
    ["A", "B", "C", "E", "F", "G", "H", "I", "L", "M", "N", "O", "Q1", "Q2", "Q3", "Q4"].forEach((k) => {
      expect(Number.isFinite(factors[k])).toBe(true);
      expect(factors[k]).toBeGreaterThanOrEqual(1);
      expect(factors[k]).toBeLessThanOrEqual(10);
    });
    expect(r.dimensionScores?.topFactors?.length).toBe(3);
    expect(Object.keys(r.dimensionScores?.secondaryFactors ?? {})).toContain("X1");
    expect(Object.keys(r.dimensionScores?.secondaryFactors ?? {})).toContain("X4");
    expect(r.level).toMatch(/型人格$/);
  });
});

describe("自我和谐 / 情绪智力 / 基本心理需求（SCCS、IPIP-EIS、BPNS）", () => {
  // —— SCCS 自我和谐量表（35 题，灵活性维度反向）——
  it("SCCS：全 1 → 高度和谐、百分制 100；灵活性维度反向折算均分为 5", () => {
    const r = calculateScore({ testId: "sccs", answers: full(35, 1) });
    expect(r.level).toBe("高度和谐");
    expect(r.totalScore).toBe(100);
    expect(r.maxScore).toBe(100);
    expect(r.dimensionScores?.disharmony?.avg).toBe(1);
    expect(r.dimensionScores?.flexibility?.avg).toBe(5);
    expect(r.dimensionScores?.rigidity?.avg).toBe(1);
    expect(r.dimensionScores?.harmonyIndex).toBe(5);
  });

  it("SCCS：全 5 → 严重不和谐；不和谐与刻板维度均分为 5", () => {
    const r = calculateScore({ testId: "sccs", answers: full(35, 5) });
    expect(r.level).toBe("严重不和谐");
    expect(r.totalScore).toBe(20);
    expect(r.dimensionScores?.disharmony?.avg).toBe(5);
    expect(r.dimensionScores?.flexibility?.avg).toBe(1);
    expect(r.dimensionScores?.rigidity?.avg).toBe(5);
  });

  // —— IPIP-EIS：测谎题与结构 ——
  it("IPIP-EIS：测谎题全 5 → 判定作答无效；7 个维度齐全", () => {
    const a: Record<number, number> = { 1: 3, 12: 5, 24: 5, 62: 5 };
    const r = calculateScore({ testId: "ipip-eis", answers: a });
    expect(r.dimensionScores?.isValid).toBe(false);
    expect(r.dimensionScores?.lieScore).toBe(5);
    expect(Object.keys(r.dimensionScores?.dimensions ?? {})).toHaveLength(7);
  });

  it("IPIP-EIS：测谎题全 1 → 判定作答有效", () => {
    const a: Record<number, number> = { 1: 3, 12: 1, 24: 1, 62: 1 };
    const r = calculateScore({ testId: "ipip-eis", answers: a });
    expect(r.dimensionScores?.isValid).toBe(true);
  });

  // —— BPNS：三维度基本心理需求 ——
  it("BPNS：三维度与整体等级结构齐全、总分百分制", () => {
    const r = calculateScore({ testId: "bpns", answers: { 1: 4, 2: 4, 3: 4 } });
    expect(["autonomy", "competence", "relatedness"].every((k) => k in (r.dimensionScores ?? {}))).toBe(true);
    // 整体等级使用 getOverallLevel 的四档文案
    expect(["心理需求满足良好", "心理需求基本满足", "心理需求部分满足", "心理需求满足不足"]).toContain(r.level);
    // 各维度等级使用独立文案
    for (const k of ["autonomy", "competence", "relatedness"]) {
      expect(["高度满足", "基本满足", "部分满足", "满足不足"]).toContain(r.dimensionScores?.[k]?.level);
    }
    expect(r.maxScore).toBe(100);
  });
});

describe("SIOSS / BIS-11 / BPAQ / YMRS / ISI 计分（2026-09 新增）", () => {
  // —— SIOSS 自杀意念自评量表：26 题是/否，掩饰 5 条不计分，满分 21，≥12 阳性 ——
  it("SIOSS：全选『是』→ 掩饰 0、总分 16、筛查阳性，维度构成正确", () => {
    const r = calculateScore({ testId: "sioss", answers: full(26, 1) });
    expect(r.totalScore).toBe(16); // 21 道计分题 - 5 道反向乐观/睡眠题答"是"不得分
    expect(r.maxScore).toBe(21);
    expect(r.level).toBe("存在自杀意念（筛查阳性）");
    expect(r.dimensionScores?.hopeless?.score).toBe(12);
    expect(r.dimensionScores?.hopeless?.max).toBe(12);
    expect(r.dimensionScores?.optimism?.score).toBe(1); // 题 22 答“是”正向计 1 分
    expect(r.dimensionScores?.optimism?.max).toBe(5); // 含题22
    expect(r.dimensionScores?.sleep?.score).toBe(3);
    expect(r.dimensionScores?.sleep?.max).toBe(4);
    expect(r.dimensionScores?.dangerEndorsed).toBe(true); // 题11/17/22/26 任一条目答"是"
    expect(r.dimensionScores?.concealment?.score).toBe(0);
    expect(r.dimensionScores?.concealment?.valid).toBe(true);
    expect(r.dimensionScores?.reliability).toBe("reliable");
  });

  it("SIOSS：掩饰题如实答『是』、其余答『否』→ 总分 5、未检出，乐观反向 4/5", () => {
    const a: Record<number, number> = {};
    [6, 9, 13, 15, 25].forEach((i) => (a[i] = 1)); // 5 条掩饰题答"是"
    const r = calculateScore({ testId: "sioss", answers: a });
    expect(r.totalScore).toBe(5); // 仅 5 条反向题（1,5,7,10,21）答"否"各计 1
    expect(r.level).toBe("未检出明显自杀意念");
    expect(r.dimensionScores?.concealment?.score).toBe(0);
    expect(r.dimensionScores?.optimism?.score).toBe(4); // 1/7/10/21 反向答"否"得 1；题 22 不作答正向=0
    expect(r.dimensionScores?.optimism?.max).toBe(5);
    expect(r.dimensionScores?.hopeless?.score).toBe(0);
    expect(r.dimensionScores?.dangerEndorsed).toBe(false);
  });

  it("SIOSS：题 22（曾经自杀过）答『是』→ 总分不足 12 仍触发危险信号分支", () => {
    const a: Record<number, number> = {};
    [6, 9, 13, 15, 25].forEach((i) => (a[i] = 1));
    a[22] = 1; // 题 22 归入乐观因子，正向计分
    const r = calculateScore({ testId: "sioss", answers: a });
    expect(r.totalScore).toBe(6);
    expect(r.level).toBe("存在需要关注的自杀相关危险信号");
    expect(r.dimensionScores?.optimism?.score).toBe(5); // 1/7/10/21 反向答"否"=4 + 题 22 正向答"是"=1
    expect(r.dimensionScores?.dangerEndorsed).toBe(true);
  });

  it("SIOSS：全选『否』→ 掩饰分 5/5，判定作答不可靠", () => {
    const r = calculateScore({ testId: "sioss", answers: full(26, 0) });
    expect(r.dimensionScores?.concealment?.score).toBe(5);
    expect(r.dimensionScores?.concealment?.valid).toBe(false);
    expect(r.dimensionScores?.reliability).toBe("unreliable");
    expect(r.level).toBe("结果参考价值有限（掩饰倾向明显）");
  });

  // —— BIS-11 Barratt 冲动性量表：30 题 1-5，11 题反向计分 ——
  // 反向题把总分范围压窄：全选 1 → 19 正向×1 + 11 反向×5 = 74，全选 5 → 106。
  // 分档切点必须按可达区间 74–106 设置，否则「低冲动倾向」永远不可达（第三批报告 1）。
  it("BIS-11：全选最低档 → 总分 74，落在最低一档（旧实现误判为中等冲动）", () => {
    const r = calculateScore({ testId: "bis", answers: full(30, 1) });
    expect(r.totalScore).toBe(74); // 19 正向×1 + 11 反向×(6-1)
    expect(r.level).toBe("低冲动倾向");
    expect(r.severity).toBe(0);
    expect(r.dimensionScores?.attention?.score).toBe(22);
    expect(r.dimensionScores?.motor?.score).toBe(26);
    expect(r.dimensionScores?.nonplanning?.score).toBe(26);
  });

  it("BIS-11：全选最高档 → 总分 106，落在最高一档", () => {
    const r = calculateScore({ testId: "bis", answers: full(30, 5) });
    expect(r.totalScore).toBe(106);
    expect(r.level).toBe("高冲动倾向");
    expect(r.severity).toBe(1);
  });

  it("BIS-11：低/中低/中高/高四档全部可达", () => {
    const mid = calculateScore({ testId: "bis", answers: full(30, 3) });
    expect(mid.totalScore).toBe(90); // 均值 3 → 正反向折算后仍为 3
    expect(mid.level).toBe("较高冲动倾向");
    expect(mid.severity).toBe(0.5);

    expect(calculateScore({ testId: "bis", answers: full(30, 2) }).level).toBe(
      "中等偏低冲动倾向",
    );
    expect(calculateScore({ testId: "bis", answers: full(30, 4) }).level).toBe("高冲动倾向");

    // 四档标签互不相同，且不出现「理论满分 150 却达不到」的档位落空
    const levels = new Set(
      [1, 2, 3, 4, 5].map(
        (v) => calculateScore({ testId: "bis", answers: full(30, v) }).level,
      ),
    );
    expect(levels.size).toBeGreaterThanOrEqual(3);
  });

  it("BIS-11：分数口径写明可达区间，分母不再用理论满分 150", () => {
    const r = calculateScore({ testId: "bis", answers: full(30, 3) });
    expect(r.minScore).toBe(74);
    expect(r.maxScore).toBe(106);
    expect(r.scoreNote).toContain("74");
    expect(r.scoreNote).toContain("106");
    expect(r.scoreNote).toContain("150"); // 理论满分只作说明
    expect(r.suggestion).toContain("可达区间 74–106");
    // 各维度同时给出可达上下限
    expect(r.dimensionScores?.attention?.min).toBe(22);
    expect(r.dimensionScores?.attention?.max).toBe(38);
  });

  it("BIS-11：反向题全部按语义方向计分（题号锁定，防止误改）", () => {
    // 反向题清单经逐条语义核对：答「总是」代表更不冲动的条目才反向
    const reverseIds = bisQuestions.filter((q) => q.reverse).map((q) => q.id);
    expect(reverseIds.sort((a, b) => a - b)).toEqual([
      1, 10, 11, 13, 14, 15, 16, 20, 21, 22, 24,
    ]);
    // 逐题验证：把某题从最低档改到最高档，总分必须按该题方向升降
    const base = calculateScore({ testId: "bis", answers: full(30, 1) }).totalScore;
    for (const q of bisQuestions) {
      const a = full(30, 1);
      a[q.id] = 5;
      const delta = calculateScore({ testId: "bis", answers: a }).totalScore - base;
      expect(delta).toBe(q.reverse ? -4 : 4);
    }
  });

  it("BIS-11：语义上明确指向「低冲动」的条目确为反向计分", () => {
    // 第三批报告用「我能认真思考并完成一项任务」举例，认为它未被反向计分。
    // 该条在本表中是 id 11，逐题探针显示它确实反向（总分 -4），报告看到的是
    // 显示序号与题目 id 不一致造成的错位；此用例锁定语义方向。
    for (const id of [11, 14, 20, 15, 16, 22, 1, 10, 21]) {
      const a = full(30, 1);
      a[id] = 5;
      expect(calculateScore({ testId: "bis", answers: a }).totalScore).toBeLessThan(74);
    }
  });

  // —— BPAQ Buss-Perry 攻击性量表：29 题 1-5 全正向，满分 145 ——
  it("BPAQ：全选 1 → 总分 29 低攻击，四维 (8/7/7/7)", () => {
    const r = calculateScore({ testId: "bpaq", answers: full(29, 1) });
    expect(r.totalScore).toBe(29);
    expect(r.maxScore).toBe(145);
    expect(r.level).toBe("攻击倾向较低");
    expect(r.dimensionScores?.physical?.score).toBe(8);
    expect(r.dimensionScores?.verbal?.score).toBe(7);
    expect(r.dimensionScores?.anger?.score).toBe(7);
    expect(r.dimensionScores?.hostility?.score).toBe(7);
  });

  it("BPAQ：全选 3 → 87 较明显；身体攻击 8 题答 4 其余 1 → 总分 53 仍判『较强』", () => {
    const mid = calculateScore({ testId: "bpaq", answers: full(29, 3) });
    expect(mid.totalScore).toBe(87);
    expect(mid.level).toBe("攻击倾向较明显");
    const a: Record<number, number> = {};
    [1, 5, 9, 13, 17, 21, 25, 29].forEach((i) => (a[i] = 4)); // 身体攻击 32/40
    const r = calculateScore({ testId: "bpaq", answers: a });
    expect(r.dimensionScores?.physical?.score).toBe(32);
    expect(r.totalScore).toBe(53);
    expect(r.level).toBe("攻击倾向较强"); // 身体攻击维度≥28 触发联合高判
  });

  it("BPAQ：全选 5 → 总分 145 满分 → 攻击倾向较强", () => {
    const r = calculateScore({ testId: "bpaq", answers: full(29, 5) });
    expect(r.totalScore).toBe(145);
    expect(r.level).toBe("攻击倾向较强");
    expect(r.dimensionScores?.physical?.score).toBe(40);
  });

  // —— YMRS 杨氏躁狂（简化自评，11 题 0-4，满分 44）——
  it("YMRS：全 4 → 44 明显躁狂；全 1 → 11 亚临床；恰好 12 → 轻躁狂边界", () => {
    const high = calculateScore({ testId: "ymrs", answers: full(11, 4) });
    expect(high.totalScore).toBe(44);
    expect(high.maxScore).toBe(44);
    expect(high.level).toBe("提示明显躁狂症状（请尽快就医）");
    const sub = calculateScore({ testId: "ymrs", answers: full(11, 1) });
    expect(sub.totalScore).toBe(11);
    expect(sub.level).toBe("亚临床躁狂倾向");
    const a: Record<number, number> = { 1: 2 };
    for (let i = 2; i <= 11; i++) a[i] = 1;
    const edge = calculateScore({ testId: "ymrs", answers: a });
    expect(edge.totalScore).toBe(12);
    expect(edge.level).toBe("提示可能存在轻躁狂");
  });

  // —— ISI 失眠严重程度指数：7 题 0-4，满分 28 ——
  it("ISI：全 4 → 28 严重失眠；全 0 → 无临床失眠", () => {
    const high = calculateScore({ testId: "isi", answers: full(7, 4) });
    expect(high.totalScore).toBe(28);
    expect(high.maxScore).toBe(28);
    expect(high.level).toBe("严重临床失眠");
    const none = calculateScore({ testId: "isi", answers: full(7, 0) });
    expect(none.totalScore).toBe(0);
    expect(none.level).toBe("无临床失眠");
  });

  it("ISI：14 → 亚临床失眠；恰好 15 → 中度临床失眠", () => {
    const sub = calculateScore({ testId: "isi", answers: full(7, 2) });
    expect(sub.totalScore).toBe(14);
    expect(sub.level).toBe("亚临床失眠（轻度）");
    const a = full(7, 2);
    a[7] = 3;
    const mid = calculateScore({ testId: "isi", answers: a });
    expect(mid.totalScore).toBe(15);
    expect(mid.level).toBe("中度临床失眠");
  });
});

describe("MID-60 多维解离量表", () => {
  it("全 0 → 总分0，无解离体验", () => {
    const r = calculateScore({ testId: "mid60", answers: full(60, 0) });
    expect(r.totalScore).toBe(0);
    expect(r.level).toBe("无解离体验");
  });

  it("全 10 → 总分100，提示严重解离", () => {
    const r = calculateScore({ testId: "mid60", answers: full(60, 10) });
    expect(r.totalScore).toBe(100);
    expect(r.level).toBe("严重的解离和创伤后症状");
  });

  it("自伤题（22）≥5 → 触发安全提示", () => {
    const a = full(60, 1);
    a[22] = 6;
    const r = calculateScore({ testId: "mid60", answers: a });
    expect(r.suggestion).toContain("安全提示");
  });

  it("单题PNES（题26）=10 → 子量表达临界值", () => {
    const a = full(60, 0);
    a[26] = 10;
    const r = calculateScore({ testId: "mid60", answers: a });
    expect(r.dimensionScores?.pnes?.above).toBe(true);
    expect(r.totalScore).toBeGreaterThan(0);
  });
});

describe("DES-II 解离经验量表", () => {
  it("全 0 → 总分0，低；全 100 → 总分100，显著解离倾向", () => {
    const low = calculateScore({ testId: "des2", answers: full(28, 0) });
    expect(low.totalScore).toBe(0);
    expect(low.level).toBe("低");
    const high = calculateScore({ testId: "des2", answers: full(28, 100) });
    expect(high.totalScore).toBe(100);
    expect(high.level).toBe("显著解离倾向");
  });

  it("总分 25 → 中度（20-29）", () => {
    const mid = calculateScore({ testId: "des2", answers: full(28, 25) });
    expect(mid.totalScore).toBe(25);
    expect(mid.level).toBe("中度");
  });

  it("Amnesia 六题置满 → 记忆缺失子量表=100", () => {
    const a = full(28, 0);
    [3,4,5,8,25,26].forEach((i) => (a[i] = 100));
    const r = calculateScore({ testId: "des2", answers: a });
    expect(r.dimensionScores?.amnesia?.score).toBe(100);
    expect(r.totalScore).toBeGreaterThan(0);
  });
});

describe("SDQ-20 躯体形式解离问卷", () => {
  it("全 1 → 总分 20，较低躯体解离症状；全 5 → 总分 100，高度", () => {
    const low = calculateScore({ testId: "sdq20", answers: full(20, 1) });
    expect(low.totalScore).toBe(20);
    expect(low.level).toBe("较低躯体解离症状");
    const high = calculateScore({ testId: "sdq20", answers: full(20, 5) });
    expect(high.totalScore).toBe(100);
    expect(high.level).toBe("高度躯体解离症状");
  });

  it("总分 48 → 显著躯体解离症状（40-49）", () => {
    const a = full(20, 1);
    [1,2,3,5,6,9,10].forEach((i) => (a[i] = 5));  // 7 题置 5（20+4*7=48），保持 SDQ-5 各题=1
    const r = calculateScore({ testId: "sdq20", answers: a });
    expect(r.totalScore).toBe(48);
    expect(r.level).toBe("显著躯体解离症状");
  });

  it("SDQ-5 五题置满 → sdq5 子量表=25；其余 1 时总分=40", () => {
    const a = full(20, 1);
    [4,8,13,15,18].forEach((i) => (a[i] = 5));
    const r = calculateScore({ testId: "sdq20", answers: a });
    expect(r.dimensionScores?.sdq5?.score).toBe(25);
    expect(r.totalScore).toBe(40);
  });
});

describe("Y-BOCS 耶鲁-布朗强迫量表", () => {
  it("全 0 → 总分 0，亚临床；全 4 → 总分 40，极重度", () => {
    const low = calculateScore({ testId: "ybocs", answers: full(10, 0) });
    expect(low.totalScore).toBe(0);
    expect(low.level).toBe("亚临床");
    const high = calculateScore({ testId: "ybocs", answers: full(10, 4) });
    expect(high.totalScore).toBe(40);
    expect(high.level).toBe("极重度");
  });

  it("强迫思维 5 题置满 → 子量表=20，总分 20 → 中度", () => {
    const a = full(10, 0);
    [1,2,3,4,5].forEach((i) => (a[i] = 4));
    const r = calculateScore({ testId: "ybocs", answers: a });
    expect(r.dimensionScores?.obsessions?.score).toBe(20);
    expect(r.dimensionScores?.compulsions?.score).toBe(0);
    expect(r.totalScore).toBe(20);
    expect(r.level).toBe("中度");
  });
});

describe("OCI-R 强迫量表修订版", () => {
  it("全 0 → OCD=0，低于临床界值；全 4 → OCD=60 极重度，囤积=12", () => {
    const low = calculateScore({ testId: "ocir", answers: full(18, 0) });
    expect(low.totalScore).toBe(0);
    expect(low.level).toBe("低于临床界值");
    expect(low.dimensionScores?.hoarding?.score).toBe(0);
    const high = calculateScore({ testId: "ocir", answers: full(18, 4) });
    expect(high.totalScore).toBe(60);
    expect(high.level).toBe("极重度困扰（Extremely）");
    expect(high.dimensionScores?.hoarding?.score).toBe(12);
  });

  it("洗涤三题置满 → 子量表=12，OCD=12 → 轻度困扰", () => {
    const a = full(18, 0);
    [5,11,17].forEach((i) => (a[i] = 4));
    const r = calculateScore({ testId: "ocir", answers: a });
    expect(r.dimensionScores?.washing?.score).toBe(12);
    expect(r.totalScore).toBe(12);
    expect(r.level).toBe("轻度困扰（A little）");
  });

  it("囤积三题置 3 → 囤积=9 达界值；其余 0 时 OCD=0", () => {
    const a = full(18, 0);
    [1,7,13].forEach((i) => (a[i] = 3));
    const r = calculateScore({ testId: "ocir", answers: a });
    expect(r.dimensionScores?.hoarding?.score).toBe(9);
    expect(r.dimensionScores?.hoarding?.level).toBe("达到囤积界值（≥6）");
    expect(r.totalScore).toBe(0);
  });
});
describe("PTSD 创伤后应激严重度（PTSD）", () => {
  it("全 0 → 总分 0，无/亚临床；全 4 → 总分 36，极重度", () => {
    const low = calculateScore({ testId: "ptsd", answers: full(9, 0) });
    expect(low.totalScore).toBe(0);
    expect(low.level).toBe("无/亚临床");
    const high = calculateScore({ testId: "ptsd", answers: full(9, 4) });
    expect(high.totalScore).toBe(36);
    expect(high.level).toBe("极重度");
  });
});


describe("惊恐障碍严重度（PANIC）", () => {
  it("全 0 → 总分 0，无/亚临床；全 4 → 总分 40，极重度", () => {
    const low = calculateScore({ testId: "panic", answers: full(10, 0) });
    expect(low.totalScore).toBe(0);
    expect(low.level).toBe("无/亚临床");
    const high = calculateScore({ testId: "panic", answers: full(10, 4) });
    expect(high.totalScore).toBe(40);
    expect(high.level).toBe("极重度");
  });

  it("全 1 → 总分 10，平均分 1.0 → 轻度", () => {
    const r = calculateScore({ testId: "panic", answers: full(10, 1) });
    expect(r.totalScore).toBe(10);
    expect(r.level).toBe("轻度");
  });
});


describe("社交焦虑障碍严重度（SOCIAL）", () => {
  it("全 0 → 总分 0，无/亚临床；全 4 → 总分 40，极重度", () => {
    const low = calculateScore({ testId: "social", answers: full(10, 0) });
    expect(low.totalScore).toBe(0);
    expect(low.level).toBe("无/亚临床");
    const high = calculateScore({ testId: "social", answers: full(10, 4) });
    expect(high.totalScore).toBe(40);
    expect(high.level).toBe("极重度");
  });
});


describe("特定恐怖症严重度（PHOBIA）", () => {
  it("全 0 → 总分 0，无/亚临床；全 4 → 总分 40，极重度", () => {
    const low = calculateScore({ testId: "phobia", answers: full(10, 0) });
    expect(low.totalScore).toBe(0);
    expect(low.level).toBe("无/亚临床");
    const high = calculateScore({ testId: "phobia", answers: full(10, 4) });
    expect(high.totalScore).toBe(40);
    expect(high.level).toBe("极重度");
  });
});


describe("广场恐怖严重度（AGORA）", () => {
  it("全 0 → 总分 0，无/亚临床；全 4 → 总分 40，极重度", () => {
    const low = calculateScore({ testId: "agora", answers: full(10, 0) });
    expect(low.totalScore).toBe(0);
    expect(low.level).toBe("无/亚临床");
    const high = calculateScore({ testId: "agora", answers: full(10, 4) });
    expect(high.totalScore).toBe(40);
    expect(high.level).toBe("极重度");
  });
});


describe("分离焦虑障碍严重度（SEPANX）", () => {
  it("全 0 → 总分 0，无/亚临床；全 4 → 总分 40，极重度", () => {
    const low = calculateScore({ testId: "sepanx", answers: full(10, 0) });
    expect(low.totalScore).toBe(0);
    expect(low.level).toBe("无/亚临床");
    const high = calculateScore({ testId: "sepanx", answers: full(10, 4) });
    expect(high.totalScore).toBe(40);
    expect(high.level).toBe("极重度");
  });
});



describe("心理健康多维自评量表（MULTIDIM）", () => {
  /** 按模式 + 种子取题，全部填同一作答值 */
  function answersFor(mode: "light" | "fast" | "standard" | "deep", seed: string, value: number) {
    const answers: Record<number, number> = {};
    for (const q of buildMultidimQuestions(mode, seed)) answers[q.id] = value;
    return answers;
  }

  /**
   * 非直线作答：按题号规律让作答值轻微起伏，避免被判为直线作答，
   * 用于验证计分口径本身（效度题固定取 base）。
   */
  function answersWavy(
    mode: "light" | "fast" | "standard" | "deep",
    seed: string,
    base: number,
    step = base < 0 ? 0.5 : -0.5,
  ) {
    const answers: Record<number, number> = {};
    buildMultidimQuestions(mode, seed).forEach((q, i) => {
      if (q.kind === "lie") {
        answers[q.id] = base;
        return;
      }
      const v = i % 5 === 0 ? base + step : base;
      answers[q.id] = Math.max(-1, Math.min(1, v));
    });
    return answers;
  }

  it("四种模式题量分别为 20 / 45 / 65 / 105", () => {
    expect(buildMultidimQuestions("light", "s").length).toBe(20);
    expect(buildMultidimQuestions("fast", "s").length).toBe(45);
    expect(buildMultidimQuestions("standard", "s").length).toBe(65);
    expect(buildMultidimQuestions("deep", "s").length).toBe(105);
  });

  it("严重议题优先出题：自伤 / 幻觉主问固定排在最前面", () => {
    const severe = ["suicide", "hallucination", "somatization", "impulse", "paranoia"];
    for (const mode of ["light", "fast", "standard", "deep"] as const) {
      for (const seed of ["s1", "s2", "seed-A", "1789217692677"]) {
        const seq = buildMultidimQuestions(mode, seed);
        const head = seq.slice(0, severe.length).map((q) => q.trait);
        // 原实现「先排序再整体洗牌」被洗牌抵消，这里锁死分层顺序
        expect([...head].sort()).toEqual([...severe].sort());
        // 自伤主问必须在第 5 题以内被问到
        const suicideMain = seq.findIndex((q) => q.trait === "suicide" && q.kind === "main");
        expect(suicideMain).toBeGreaterThanOrEqual(0);
        expect(suicideMain).toBeLessThan(severe.length);
        // 效度题不占用主问区
        expect(seq.slice(0, MULTIDIM_BASE_MAINS).every((q) => q.kind !== "lie")).toBe(true);
      }
    }
  });

  it("同一种子出题一致，不同种子题目集合不同（乱序复测）", () => {
    const a = buildMultidimQuestions("standard", "seed-A").map((q) => q.id);
    const b = buildMultidimQuestions("standard", "seed-A").map((q) => q.id);
    const c = buildMultidimQuestions("standard", "seed-B").map((q) => q.id);
    expect(a).toEqual(b);
    expect(a).not.toEqual(c);
  });

  it("标准模式整体「不确定」→ 结果良好、效度可信", () => {
    const r = calculateScore({ testId: "multidim", answers: answersWavy("standard", "t1", 0) });
    const rep: any = r.multidimReport;
    expect(rep.isNormal).toBe(true);
    expect(r.level).toBe("评估结果良好");
    expect(rep.severity.level).toBe("正常");
    expect(rep.lie.level).toBe("可信");
    expect(rep.credibility.level).toBe("回答一致性 · 高");
  });

  it("标准模式整体「非常符合」→ 检出安全信号、效度存疑、严重度极重度，20 维均有数据", () => {
    const r = calculateScore({ testId: "multidim", answers: answersWavy("standard", "t2", 1) });
    const rep: any = r.multidimReport;
    expect(rep.severeSignals).toContain("自伤或轻生的念头");
    expect(rep.severeSignals).toContain("幻觉体验（听到或看到不存在的事物）");
    expect(rep.lie.level).toBe("回答一致性存疑");
    expect(rep.severity.level).toBe("极重度");
    expect(rep.traits.filter((t: any) => !t.noData)).toHaveLength(20);
    expect(rep.severity.elevated).toBe(20);
    expect(r.level).toContain("多维特征自评");
  });

  /* ===== 补充报告 D4：知情者代答 ===== */

  it("代答时效度与一致性校验标为不适用，并标注数据来源", () => {
    const answers = answersWavy("standard", "t7", 1);
    const proxy: any = calculateScore({
      testId: "multidim",
      answers,
      mode: "standard",
      respondent: "proxy",
    }).multidimReport;

    expect(proxy.respondent.mode).toBe("proxy");
    expect(proxy.respondent.label).toContain("代答");
    // 代答说明必须点出「高估可观察行为、低估内在体验」这一系统性偏差
    expect(proxy.respondent.notice).toContain("低估");
    expect(proxy.respondent.notice).toContain("高估");

    // 掩饰题与主问-复问一致率都是为自评设计的，代答不适用
    expect(proxy.lie.level).toBe("不适用（知情者代答）");
    expect(proxy.lie.alert).toBe(false);
    expect(proxy.credibility.level).toBe("回答一致性 · 不适用（知情者代答）");
    expect(proxy.credibility.rate).toBe(0);

    // 维度分与安全信号不受作答来源影响，仍按同一套口径计算
    expect(proxy.severity.elevated).toBe(20);
    expect(proxy.severeSignals.length).toBeGreaterThan(0);
  });

  it("自评（默认）不受代答分支影响", () => {
    const answers = answersWavy("standard", "t7", 1);
    const self: any = calculateScore({ testId: "multidim", answers, mode: "standard" })
      .multidimReport;
    expect(self.respondent.mode).toBe("self");
    expect(self.respondent.label).toBe("本人自评");
    expect(self.respondent.notice).toBe("");
    expect(self.credibility.level).toBe("回答一致性 · 高");
    expect(self.lie.level).toBe("回答一致性存疑");
  });

  it("代答 + 直线作答仍判无效（作答行为问题优先于来源标注）", () => {
    const rep: any = calculateScore({
      testId: "multidim",
      answers: answersAll({}),
      mode: "standard",
      respondent: "proxy",
    }).multidimReport;
    expect(rep.validity.valid).toBe(false);
    expect(rep.summary.level).toBe("作答无效");
    expect(rep.lie.alert).toBe(true);
  });

  it("respondent 取值校验：只有 self / proxy 被接受", () => {
    expect(isRespondentMode("self")).toBe(true);
    expect(isRespondentMode("proxy")).toBe(true);
    for (const bad of ["SELF", "proxy ", "", null, undefined, 0, {}, "other"]) {
      expect(isRespondentMode(bad)).toBe(false);
    }
  });

  it("结果不再输出障碍名与吻合度百分比（P0-2 / P1-1 / P1-2）", () => {
    const r = calculateScore({ testId: "multidim", answers: answersWavy("standard", "t6", 1) });
    const rep: any = r.multidimReport;
    // 判别式匹配的三类输出全部下线
    expect(rep.matches).toBeUndefined();
    expect(rep.conditions).toBeUndefined();
    expect(rep.confidence).toBeUndefined();
    expect(rep.summary.matchText).toBeUndefined();

    // 整个响应里不得出现任何诊断名或「吻合度」字样
    const payload = JSON.stringify(r);
    for (const term of [
      "抑郁障碍",
      "焦虑障碍",
      "边缘型",
      "自闭症",
      "精神分裂",
      "强迫症",
      "双相",
      "PTSD",
      "ADHD",
      "吻合度",
    ]) {
      expect(payload).not.toContain(term);
    }

    // 总分位不再被当作分数读：本量表不产出可累加的总分
    expect(r.totalScore).toBe(0);
    expect(r.maxScore).toBe(0);

    // 严重度仍可用，且语义为「困扰覆盖面」
    expect(rep.severity.pct).toBe(100);
    expect(rep.summary.elevated).toBe(20);
    expect(rep.summary.traitTotal).toBe(20);
  });

  it("标准模式整体「完全不符合」→ 未见异常、结果良好", () => {
    const r = calculateScore({ testId: "multidim", answers: answersWavy("standard", "t3", -1) });
    const rep: any = r.multidimReport;
    expect(rep.isNormal).toBe(true);
    expect(rep.severity.level).toBe("未见异常");
    expect(rep.traits.every((t: any) => t.level === "未见异常")).toBe(true);
  });

  it("极简模式（20 题，无复问/效度题）→ 效度与一致性为空，20 维仍有数据", () => {
    const r = calculateScore({ testId: "multidim", answers: answersWavy("light", "t4", 1) });
    const rep: any = r.multidimReport;
    expect(rep.lie).toBeNull();
    expect(rep.credibility).toBeNull();
    expect(rep.traits.filter((t: any) => !t.noData)).toHaveLength(20);
  });

  /* ===== 问题报告 P0-1 / P1-3 的回归用例 ===== */

  /** 全题库按同一作答值填充，再覆写个别题号；不依赖抽题种子 */
  function answersAll(overrides: Record<number, number>, base = -1) {
    const answers: Record<number, number> = {};
    for (const q of multidimQuestions) answers[q.id] = base;
    return Object.assign(answers, overrides);
  }

  it("第 86 题（被害 / 关系观念）归属 paranoia，不再计入幻觉维度", () => {
    expect(multidimQuestionById[86].trait).toBe("paranoia");
    // 幻觉维度只保留真正描述感知异常的条目
    const hallucinationIds = multidimQuestions
      .filter((q) => q.trait === "hallucination")
      .map((q) => q.id);
    expect(hallucinationIds).not.toContain(86);
    expect(hallucinationIds).toContain(13);
  });

  it("仅第 86 题肯定作答 → 不再触发幻觉安全提示（被害观念不冒充精神病性体验）", () => {
    const r = calculateScore({ testId: "multidim", answers: answersAll({ 86: 1 }) });
    const rep: any = r.multidimReport;
    expect(rep.severeSignals).not.toContain("幻觉体验（听到或看到不存在的事物）");
    expect(rep.severeSignals).toHaveLength(0);
    expect(rep.severeSignalDetails).toHaveLength(0);
    // 幻觉维度维持「未见异常」，与安全提示不再互相矛盾
    const hallucination = rep.traits.find((t: any) => t.trait === "hallucination");
    expect(hallucination.levelKind).toBe("none");
  });

  it("仅感知异常主问（第 13 题）肯定作答 → 触发幻觉提示，并解释与维度分的差异", () => {
    const r = calculateScore({ testId: "multidim", answers: answersAll({ 13: 1 }) });
    const rep: any = r.multidimReport;
    expect(rep.severeSignals).toContain("幻觉体验（听到或看到不存在的事物）");
    const detail = rep.severeSignalDetails.find((s: any) => s.trait === "hallucination");
    expect(detail.itemIds).toContain(13);
    // 条目级触发时必须给出解释，而不是与「未见异常」并列
    expect(detail.detail).toContain("13");
    expect(detail.detail).toContain("条目级提示");
    // 维度分与安全提示冲突时，总览以安全信号为准并指向说明，不再并列「未见异常」
    expect(rep.summary.level).toBe("需优先处理");
    const hallucination = rep.traits.find((t: any) => t.trait === "hallucination");
    expect(hallucination.levelKind).toBe("none");
  });

  it("仅感知异常追问（第 71 题）肯定作答 → 只给关注方向，不升级为精神病性安全提示", () => {
    const r = calculateScore({ testId: "multidim", answers: answersAll({ 71: 1 }) });
    const rep: any = r.multidimReport;
    expect(rep.severeSignals).toHaveLength(0);
    expect(rep.concernSignals).toContain("对感知异常的担忧（主诉条目未肯定）");
  });

  it("被害观念与冲动攻击只进关注信号，与幻觉安全提示分离", () => {
    const paranoiaIds = multidimQuestions.filter((q) => q.trait === "paranoia").map((q) => q.id);
    const impulseIds = multidimQuestions.filter((q) => q.trait === "impulse").map((q) => q.id);
    const positives: Record<number, number> = {};
    for (const id of [...paranoiaIds, ...impulseIds]) positives[id] = 1;
    const r = calculateScore({ testId: "multidim", answers: answersAll(positives) });
    const rep: any = r.multidimReport;
    expect(rep.severeSignals).toHaveLength(0);
    expect(rep.concernSignals).toContain("强烈的被害 / 关系观念");
    expect(rep.concernSignals).toContain("难以控制的冲动或攻击行为");
  });

  it("自伤 / 轻生按条目触发（安全优先），单题肯定即可触发", () => {
    const r = calculateScore({ testId: "multidim", answers: answersAll({ 105: 1 }) });
    const rep: any = r.multidimReport;
    expect(rep.severeSignals).toContain("自伤或轻生的念头");
    const detail = rep.severeSignalDetails.find((s: any) => s.trait === "suicide");
    expect(detail.itemIds).toEqual([105]);
    expect(detail.detail).toContain("安全筛查条目按单题处理");
  });

  it("效度字段语义：score / items / hits / rate，阈值按题量归一化", () => {
    const r = calculateScore({ testId: "multidim", answers: answersWavy("standard", "t5", 1) });
    const rep: any = r.multidimReport;
    expect(rep.lie.items).toBe(5);
    expect(rep.lie.score).toBeCloseTo(5, 5);
    expect(rep.lie.hits).toBe(5);
    expect(rep.lie.rate).toBeCloseTo(1, 5);
    expect(rep.lie.level).toBe("回答一致性存疑");
    // 语义颠倒的旧字段名不再出现
    expect(rep.lie.total).toBeUndefined();
    expect(rep.lie.count).toBeUndefined();
  });

  it("效度题不再包含与理想化无关的「读心」条目", () => {
    const lieTexts = multidimQuestions.filter((q) => q.kind === "lie").map((q) => q.text);
    expect(lieTexts).toHaveLength(5);
    expect(lieTexts.some((t) => t.includes("猜到别人接下来"))).toBe(false);
  });

  /* ===== 问题报告 P0-3 / P0-4 的回归用例 ===== */

  it("直线作答（全选同一选项）→ 判定为作答无效，不再输出「评估结果良好」", () => {
    for (const value of [1, 0.5, 0, -0.5, -1]) {
      const r = calculateScore({
        testId: "multidim",
        answers: answersFor("standard", "flat", value),
      });
      const rep: any = r.multidimReport;
      expect(rep.validity.valid).toBe(false);
      expect(rep.validity.responseStyle.flat).toBe(true);
      expect(rep.isNormal).toBe(false);
      expect(rep.summary.level).toBe("作答无效");
      expect(rep.advice.overallKind).toBe("invalid");
      expect(r.level).toContain("作答无效");
      expect(r.totalScore).toBe(0);
      expect(r.severity).toBe(0);
    }
  });

  it("直线作答下效度与一致性校验一并失效，不再给无效作答背书", () => {
    const r = calculateScore({ testId: "multidim", answers: answersFor("standard", "flat2", -1) });
    const rep: any = r.multidimReport;
    // 旧实现：全选「完全不符合」→ 回答一致性·高 + 效度可信 + 评估结果良好
    expect(rep.credibility.level).toContain("不适用");
    expect(rep.credibility.rate).toBe(0);
    expect(rep.lie.level).toBe("不适用（直线作答）");
    expect(rep.lie.alert).toBe(true);
  });

  it("非直线但整体否认的作答仍判为有效", () => {
    const r = calculateScore({ testId: "multidim", answers: answersWavy("standard", "ok", -1) });
    const rep: any = r.multidimReport;
    expect(rep.validity.valid).toBe(true);
    expect(rep.validity.responseStyle.flat).toBe(false);
    expect(rep.isNormal).toBe(true);
  });

  it("总评由维度分布决定：单条题目不再能拉动总评等级", () => {
    // 全库否认，仅第 86 题肯定 → 20 维全部未见异常，总评也必须是未见异常
    const quiet = calculateScore({ testId: "multidim", answers: answersAll({ 86: 1 }) });
    const quietRep: any = quiet.multidimReport;
    expect(quietRep.severity.level).toBe("未见异常");
    expect(quiet.level).toBe("评估结果良好");

    // 反向：其余题目全部最重，只把第 86 题答成「不太符合」→ 总评不得回落为正常
    const heavy = calculateScore({ testId: "multidim", answers: answersAll({ 86: -0.5 }, 1) });
    const heavyRep: any = heavy.multidimReport;
    expect(["重度", "极重度"]).toContain(heavyRep.severity.level);
  });

  it("严重度百分比语义为「困扰覆盖面」，不再是把均值拉伸到 50-100", () => {
    const rep: any = calculateScore({
      testId: "multidim",
      answers: answersWavy("standard", "cov", 0, -0.5),
    }).multidimReport;
    expect(rep.severity.marked).toBe(0);
    expect(rep.severity.elevated).toBe(0);
    expect(rep.severity.pct).toBe(0); // 旧实现恒为 50
    expect(rep.severity.level).toBe("正常");
  });

  it("整体作答加重时严重度等级与覆盖面单调不降", () => {
    const rank: Record<string, number> = {
      未见异常: 0,
      正常: 1,
      轻度: 2,
      中度: 3,
      重度: 4,
      极重度: 5,
    };
    /** 前 positiveDims 个维度整体肯定、其余整体否认；每维度末题各降一档避免被判为直线作答 */
    const build = (positiveDims: number) => {
      const answers: Record<number, number> = {};
      const byTrait = new Map<string, number[]>();
      for (const q of multidimQuestions) {
        if (q.kind === "lie") {
          answers[q.id] = -1;
          continue;
        }
        const list = byTrait.get(q.trait) ?? [];
        list.push(q.id);
        byTrait.set(q.trait, list);
      }
      MULTIDIM_TRAIT_ORDER.forEach((trait, idx) => {
        const ids = byTrait.get(trait) ?? [];
        const on = idx < positiveDims;
        ids.forEach((id, i) => {
          const last = i === ids.length - 1;
          answers[id] = on ? (last ? 0.5 : 1) : last ? -0.5 : -1;
        });
      });
      return answers;
    };

    const rows = [1, 6, 12, 19].map((n) => {
      const rep: any = calculateScore({ testId: "multidim", answers: build(n) }).multidimReport;
      expect(rep.validity.valid).toBe(true);
      return { n, level: rank[rep.severity.level]!, pct: rep.severity.pct };
    });
    for (let i = 1; i < rows.length; i++) {
      expect(rows[i]!.level).toBeGreaterThanOrEqual(rows[i - 1]!.level);
      expect(rows[i]!.pct).toBeGreaterThanOrEqual(rows[i - 1]!.pct);
    }
    expect(rows[rows.length - 1]!.level).toBeGreaterThan(rows[0]!.level);
  });

  /* ===== 问题报告 P1-1 的回归用例：时间窗口 ===== */

  it("每道题都有明确的时间窗口，且覆盖表只收录真实存在的题号", () => {
    const ids = new Set(multidimQuestions.map((q) => q.id));
    for (const q of multidimQuestions) {
      expect(["2w", "episode", "lifelong"]).toContain(multidimWindowOf(q.id));
    }
    for (const key of Object.keys(MULTIDIM_QUESTION_WINDOWS)) {
      expect(ids.has(Number(key))).toBe(true);
    }
    // 三种窗口都有中文标签，供作答页直接展示
    for (const w of ["2w", "episode", "lifelong"] as const) {
      expect(MULTIDIM_WINDOW_LABEL[w].length).toBeGreaterThan(0);
    }
  });

  it("题干写明「从小」「一直」的归入长期窗口，「有没有过」的归入既往窗口", () => {
    // 长期 / 发育性条目
    for (const id of [9, 22, 37, 66, 67, 94, 122]) {
      expect(multidimWindowOf(id)).toBe("lifelong");
    }
    // 既往发作 / 曾经经历
    for (const id of [3, 6, 18, 46, 86, 88, 131]) {
      expect(multidimWindowOf(id)).toBe("episode");
    }
    // 明确写「最近两周」的仍为默认窗口
    for (const id of [15, 16, 30]) {
      expect(multidimWindowOf(id)).toBe("2w");
    }
    // 默认窗口占比过半，说明该表只做例外标注
    const nonDefault = Object.keys(MULTIDIM_QUESTION_WINDOWS).length;
    expect(nonDefault).toBeLessThan(multidimQuestions.length / 2);
  });

  it("结果按维度标注时间窗口，跨窗口合成的维度会被点名", () => {
    const rep: any = calculateScore({
      testId: "multidim",
      answers: answersAll({}),
    }).multidimReport;

    const focusLoss = rep.traits.find((t: any) => t.trait === "focus_loss");
    expect(focusLoss.windowMixed).toBe(true);
    expect(focusLoss.windows).toContain("lifelong");
    expect(focusLoss.windows).toContain("2w");

    const sleepIssue = rep.traits.find((t: any) => t.trait === "sleep_issue");
    expect(sleepIssue.windowMixed).toBe(true);

    // 全部条目都是最近两周的维度不应被标记
    const compulsion = rep.traits.find((t: any) => t.trait === "compulsion");
    expect(compulsion.windowMixed).toBe(false);
    expect(compulsion.windows).toEqual(["2w"]);

    expect(rep.windowNotice).toContain("跨窗口");
    expect(rep.mixedWindowTraits.length).toBeGreaterThan(0);
    expect(rep.mixedWindowTraits.map((x: any) => x.trait)).toContain("focus_loss");
  });

  it("strongTraits 取信号最强的 4 项，而非题目顺序靠前的 4 项", () => {
    const selfEsteemIds = multidimQuestions
      .filter((q) => q.trait === "self_esteem")
      .map((q) => q.id);
    const overrides: Record<number, number> = {};
    for (const id of selfEsteemIds) overrides[id] = 1;
    const rep: any = calculateScore({
      testId: "multidim",
      answers: answersAll({ ...overrides, 1: 0.5, 2: 0.5, 3: -1, 4: 0.5, 5: 0.5 }),
      }).multidimReport;
    expect(rep.severity.strongTraits).toContain("自我价值感");
    expect(rep.severity.strongTraits[0]).toBe("自我价值感");
  });
});
