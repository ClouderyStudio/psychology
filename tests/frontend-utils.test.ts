import { describe, expect, it } from "vitest";
import {
  TYPE_ONLY_TESTS,
  formatResultScore,
  isTypeOnlyTest,
} from "../app/utils/test-display";
import {
  SEVERITY_LEVELS,
  sevColor,
  sevRank,
  sevRankFromScore,
  sevTone,
} from "../app/utils/severity";
import {
  epqInterpret,
  sixteenPFInterpret,
} from "../app/utils/personality-interpret";

// ---- 1) app/utils/test-display.ts：无总分量表的展示口径 ----
describe("test-display：类型量表展示口径", () => {
  it("TYPE_ONLY_TESTS 是非空字符串数组且无重复项", () => {
    expect(Array.isArray(TYPE_ONLY_TESTS)).toBe(true);
    expect(TYPE_ONLY_TESTS.length).toBeGreaterThan(0);
    for (const id of TYPE_ONLY_TESTS) expect(typeof id).toBe("string");
    expect(new Set(TYPE_ONLY_TESTS).size).toBe(TYPE_ONLY_TESTS.length);
  });

  it("TYPE_ONLY_TESTS 包含 mbti / ecrr / multidim", () => {
    for (const id of ["mbti", "ecrr", "multidim"]) {
      expect(TYPE_ONLY_TESTS).toContain(id);
    }
  });

  it("isTypeOnlyTest 对 null / undefined / 空串返回 false", () => {
    expect(isTypeOnlyTest(null)).toBe(false);
    expect(isTypeOnlyTest(undefined)).toBe(false);
    expect(isTypeOnlyTest("")).toBe(false);
    expect(isTypeOnlyTest("mbti")).toBe(true);
    expect(isTypeOnlyTest("phq9")).toBe(false);
  });

  it("formatResultScore：falsy 入参一律返回 --", () => {
    expect(formatResultScore()).toBe("--");
    expect(formatResultScore(null)).toBe("--");
    expect(formatResultScore(undefined)).toBe("--");
    expect(formatResultScore(0)).toBe("--");
    expect(formatResultScore("")).toBe("--");
  });

  it("formatResultScore：type-only 量表返回 level，缺失时返回 --", () => {
    expect(formatResultScore({ testId: "mbti", level: "INTJ" })).toBe("INTJ");
    expect(formatResultScore({ testId: "ecrr" })).toBe("--");
    expect(formatResultScore({ testId: "multidim", level: "" })).toBe("--");
    expect(formatResultScore({ testId: "mbti", totalScore: 3, maxScore: 9 })).toBe("--");
  });

  it("formatResultScore：普通量表返回 totalScore/maxScore", () => {
    expect(formatResultScore({ testId: "phq9", totalScore: 5, maxScore: 27 })).toBe("5/27");
    expect(formatResultScore({ testId: "phq9", totalScore: 0, maxScore: 27 })).toBe("0/27");
    expect(formatResultScore({ testId: "phq9" })).toBe("0/--");
  });
});

// ---- 2) app/utils/severity.ts：严重度等级与配色令牌 ----
describe("severity：等级序号与 --sev-* 令牌", () => {
  it("SEVERITY_LEVELS 恰好 5 项且顺序为 很低/较低/中等/较高/很高", () => {
    expect([...SEVERITY_LEVELS]).toEqual(["很低", "较低", "中等", "较高", "很高"]);
  });

  it("sevRank：1..5 顺序映射，未收录字符串 / null / undefined 返回 0", () => {
    expect(SEVERITY_LEVELS.map(sevRank)).toEqual([1, 2, 3, 4, 5]);
    expect(sevRank("很低")).toBe(1);
    expect(sevRank("很高")).toBe(5);
    expect(sevRank("中等")).toBe(3);
    expect(sevRank("不存在")).toBe(0);
    expect(sevRank(null)).toBe(0);
    expect(sevRank(undefined)).toBe(0);
  });

  it("sevRankFromScore：只断言已确定的边界（0.3 / 0.6 切点）", () => {
    expect(sevRankFromScore(0)).toBe(1);
    expect(sevRankFromScore(0.29)).toBe(1);
    expect(sevRankFromScore(0.3)).toBe(3);
    expect(sevRankFromScore(0.59)).toBe(3);
    expect(sevRankFromScore(0.6)).toBe(5);
    expect(sevRankFromScore(1)).toBe(5);
    expect(sevRankFromScore(NaN)).toBe(1);
    expect(sevRankFromScore(Infinity)).toBe(1);
  });

  it("sevColor / sevTone 使用 --sev-N 令牌", () => {
    expect(sevColor(3)).toBe("var(--sev-3)");
    expect(sevTone(3)).toEqual({
      backgroundColor: "var(--sev-3-soft)",
      color: "var(--sev-3-text)",
    });
  });
});

// ---- 3) app/utils/personality-interpret.ts：静态解读表完整性 ----
const PF_FACTORS = ["A", "B", "C", "E", "F", "G", "H", "I", "L", "M", "N", "O", "Q1", "Q2", "Q3", "Q4"];

describe("personality-interpret：静态解读表完整性", () => {
  it("sixteenPFInterpret 的键恰好是 16PF 的 16 个因素", () => {
    expect(Object.keys(sixteenPFInterpret).sort()).toEqual([...PF_FACTORS].sort());
  });

  it("每个因素的 low/high 四个字段 t/good/bad/tip 都是非空字符串", () => {
    for (const key of PF_FACTORS) {
      const unit = sixteenPFInterpret[key];
      expect(unit, key).toBeTruthy();
      expect(typeof unit.name, key).toBe("string");
      for (const pole of ["low", "high"]) {
        const p = unit[pole];
        expect(p, key + "." + pole).toBeTruthy();
        for (const field of ["t", "good", "bad", "tip"]) {
          expect(typeof p[field], key + "." + pole + "." + field).toBe("string");
          expect(p[field].trim().length, key + "." + pole + "." + field).toBeGreaterThan(0);
        }
      }
    }
  });

  it("epqInterpret 的键为 E/N/P/L，每项有非空 name/high/low", () => {
    expect(Object.keys(epqInterpret).sort()).toEqual(["E", "L", "N", "P"]);
    for (const key of ["E", "N", "P", "L"]) {
      const value = epqInterpret[key];
      expect(value, key).toBeTruthy();
      for (const field of ["name", "high", "low"]) {
        expect(typeof value[field], key + "." + field).toBe("string");
        expect(value[field].trim().length, key + "." + field).toBeGreaterThan(0);
      }
    }
  });
});
