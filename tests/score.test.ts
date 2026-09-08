import { describe, it, expect } from "vitest";
import { calculateScore } from "../server/utils/score";
import { bisQuestions } from "../server/utils/questions/bis-questions";

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

  // —— BIS-11 Barratt 冲动性量表：30 题 1-5，反向题 6-score，满分 150 ——
  it("BIS-11：全选 1 → 反向题折算为 5，总分 74、中等冲动", () => {
    const r = calculateScore({ testId: "bis", answers: full(30, 1) });
    expect(r.totalScore).toBe(74); // 19 正向×1 + 11 反向×(6-1)
    expect(r.maxScore).toBe(150);
    expect(r.level).toBe("中等冲动倾向");
    expect(r.dimensionScores?.attention?.score).toBe(22);
    expect(r.dimensionScores?.motor?.score).toBe(26);
    expect(r.dimensionScores?.nonplanning?.score).toBe(26);
  });

  it("BIS-11：全选 2 → 总分 82 → 较高冲动；全选 3 → 总分 90 → 高冲动", () => {
    const up = calculateScore({ testId: "bis", answers: full(30, 2) });
    expect(up.totalScore).toBe(82);
    expect(up.level).toBe("较高冲动倾向");
    const high = calculateScore({ testId: "bis", answers: full(30, 3) });
    expect(high.totalScore).toBe(90);
    expect(high.level).toBe("高冲动倾向");
  });

  it("BIS-11：反向题答 5、其余答 1 → 每题均折算 1 分，总分 30（地板）", () => {
    const a: Record<number, number> = {};
    for (const q of bisQuestions) a[q.id] = q.reverse ? 5 : 1;
    const r = calculateScore({ testId: "bis", answers: a });
    expect(r.totalScore).toBe(30);
    expect(r.level).toBe("低冲动倾向");
    expect(r.dimensionScores?.attention?.score).toBe(10);
    expect(r.dimensionScores?.motor?.score).toBe(10);
    expect(r.dimensionScores?.nonplanning?.score).toBe(10);
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
