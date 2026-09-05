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
});
