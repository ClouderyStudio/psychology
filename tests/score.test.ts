import { describe, it, expect } from "vitest";
import { calculateScore } from "../server/utils/score";

/** 生成 count 道题、每题 value 的作答 */
function full(count: number, value: number): Record<number, number> {
  const answers: Record<number, number> = {};
  for (let i = 1; i <= count; i++) answers[i] = value;
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

