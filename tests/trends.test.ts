import { describe, expect, it } from "vitest";
import { formatResultScore, isTypeOnlyTest } from "../app/utils/test-display";
import {
  buildTrendGroups,
  chartPoints,
  deltaColor,
  firstTs,
  firstValue,
  formatDelta,
  formatTrendTime,
  formatTrendValue,
  lastTs,
  lastValue,
} from "../app/utils/trends";

const options = { isTypeOnly: isTypeOnlyTest, formatScore: formatResultScore };

const rec = (key: string, result: Record<string, any>) => ({ key, result });

// PHQ-9 的真实形状：dimensionScores 里 highlight 是展示卡、symptoms 才是可比较维度
const phq = (totalScore: number, timestamp: string, endorsed: number) => ({
  testId: "phq9",
  testTitle: "PHQ-9 抑郁筛查量表",
  totalScore,
  maxScore: 27,
  level: totalScore >= 15 ? "中重度抑郁" : "轻度抑郁",
  timestamp,
  dimensionScores: {
    type: "phq9",
    highlight: { label: "动作迟缓或烦躁", freq: "几乎每天", value: 3, endorsedCount: endorsed },
    symptoms: { name: "达到阈值的症状数", score: endorsed, max: 9 },
  },
});

describe("buildTrendGroups：按量表分组、类型型量表不画总分", () => {
  it("只有一次记录的量表不进入趋势", () => {
    const groups = buildTrendGroups([rec("test_phq9_result_1", phq(10, "2026-01-01T00:00:00Z", 3))], options);
    expect(groups).toEqual([]);
  });

  it("同一量表的记录按时间正序，第 N 次才有意义", () => {
    const groups = buildTrendGroups(
      [
        rec("test_phq9_result_2", phq(7, "2026-01-02T00:00:00Z", 2)),
        rec("test_phq9_result_1", phq(18, "2026-01-01T00:00:00Z", 6)),
      ],
      options,
    );
    expect(groups).toHaveLength(1);
    expect(groups[0]!.records.map((r) => r.totalScore)).toEqual([18, 7]);
    expect(groups[0]!.records.map((r) => r.timestamp)).toEqual([
      "2026-01-01T00:00:00Z",
      "2026-01-02T00:00:00Z",
    ]);
  });

  it("可计分量表带总分序列与差值", () => {
    const g = buildTrendGroups(
      [
        rec("test_phq9_result_1", phq(18, "2026-01-01T00:00:00Z", 6)),
        rec("test_phq9_result_2", phq(7, "2026-01-02T00:00:00Z", 2)),
      ],
      options,
    )[0]!;
    expect(g.scored).toBe(true);
    expect(g.maxScore).toBe(27);
    expect(g.totalSeries.map((p) => p.value)).toEqual([18, 7]);
    expect(g.totalDelta).toBe(-11);
  });

  it("类型型量表（MBTI）不画总分折线，displayScore 退回 level", () => {
    const mbti = (level: string, ts: string) => ({
      testId: "mbti",
      testTitle: "MBTI 人格测试",
      totalScore: 49,
      maxScore: 100,
      level,
      timestamp: ts,
    });
    const g = buildTrendGroups(
      [
        rec("test_mbti_result_1", mbti("INFP", "2026-01-01T00:00:00Z")),
        rec("test_mbti_result_2", mbti("ENFP", "2026-01-02T00:00:00Z")),
      ],
      options,
    )[0]!;
    expect(g.scored).toBe(false);
    expect(g.totalSeries).toEqual([]);
    expect(g.totalDelta).toBe(0);
    expect(g.records.map((r) => r.displayScore)).toEqual(["INFP", "ENFP"]);
  });

  it("maxScore 为 0 的量表（多维自评）同样不画折线", () => {
    const multi = (ts: string) => ({
      testId: "multidim",
      testTitle: "心理多维量表",
      totalScore: 0,
      maxScore: 0,
      level: "作答有效",
      timestamp: ts,
    });
    const g = buildTrendGroups(
      [rec("test_multidim_result_1", multi("2026-01-01T00:00:00Z")),
       rec("test_multidim_result_2", multi("2026-01-02T00:00:00Z"))],
      options,
    )[0]!;
    expect(g.scored).toBe(false);
    expect(g.totalSeries).toEqual([]);
  });

  it("维度序列排除展示卡与汇总桶，只留可比较维度", () => {
    const g = buildTrendGroups(
      [
        rec("test_phq9_result_1", phq(18, "2026-01-01T00:00:00Z", 6)),
        rec("test_phq9_result_2", phq(7, "2026-01-02T00:00:00Z", 2)),
      ],
      options,
    )[0]!;
    expect(g.dimSeries.map((d) => d.key)).toEqual(["symptoms"]);
    expect(g.dimSeries[0]!.points.map((p) => p.value)).toEqual([6, 2]);
    expect(g.dimSeries[0]!.delta).toBe(-4);
  });

  it("只有一个点的维度连不成线", () => {
    const first = phq(18, "2026-01-01T00:00:00Z", 6);
    const second = phq(7, "2026-01-02T00:00:00Z", 2);
    delete (second.dimensionScores as any).symptoms;
    const g = buildTrendGroups(
      [rec("test_phq9_result_1", first), rec("test_phq9_result_2", second)],
      options,
    )[0]!;
    expect(g.dimSeries).toEqual([]);
  });

  it("有分数量表的排序在纯类型量表之前", () => {
    const mbti = (ts: string, level: string) => ({
      testId: "mbti", testTitle: "MBTI 人格测试", totalScore: 49, maxScore: 100, level, timestamp: ts,
    });
    const groups = buildTrendGroups(
      [
        rec("test_mbti_result_1", mbti("2026-01-01T00:00:00Z", "INFP")),
        rec("test_mbti_result_2", mbti("2026-01-02T00:00:00Z", "ENFP")),
        rec("test_phq9_result_1", phq(18, "2026-01-01T00:00:00Z", 6)),
        rec("test_phq9_result_2", phq(7, "2026-01-02T00:00:00Z", 2)),
      ],
      options,
    );
    expect(groups.map((g) => g.testId)).toEqual(["phq9", "mbti"]);
  });

  it("缺失 testId 的记录被忽略", () => {
    const groups = buildTrendGroups(
      [rec("a", { totalScore: 1, timestamp: "2026-01-01T00:00:00Z" }),
       rec("b", { totalScore: 2, timestamp: "2026-01-02T00:00:00Z" })],
      options,
    );
    expect(groups).toEqual([]);
  });
});

describe("chartPoints / 展示辅助", () => {
  it("少于两点不画线", () => {
    expect(chartPoints([])).toBe("");
    expect(chartPoints([5])).toBe("");
  });

  it("全部同值时画水平中线，x 均匀铺满 0-100", () => {
    expect(chartPoints([5, 5, 5])).toBe("0.00,15.00 50.00,15.00 100.00,15.00");
  });

  it("不同值时首点在底部、末点在顶部", () => {
    const pts = chartPoints([1, 3]).split(" ");
    expect(pts[0]).toBe("0.00,28.00");
    expect(pts[1]).toBe("100.00,2.00");
  });

  it("首尾取值与时间都有兜底", () => {
    expect(firstTs([])).toBe("");
    expect(lastTs([])).toBe("");
    expect(firstValue([])).toBe(0);
    expect(lastValue([])).toBe(0);
    const records = [{ timestamp: "2026-01-01T00:00:00Z" }, { timestamp: "2026-01-02T00:00:00Z" }] as any;
    expect(firstTs(records)).toBe("2026-01-01T00:00:00Z");
    expect(lastTs(records)).toBe("2026-01-02T00:00:00Z");
    expect(firstValue([{ ts: "a", value: 2 }])).toBe(2);
    expect(lastValue([{ ts: "a", value: 2 }])).toBe(2);
  });

  it("只标方向不下好坏结论：正值用主色、负值用次要色、零用弱色", () => {
    expect(formatDelta(3)).toBe("+3");
    expect(formatDelta(-3)).toBe("-3");
    expect(formatDelta(0)).toBe("0");
    expect(deltaColor(1)).toBe("var(--primary)");
    expect(deltaColor(-1)).toBe("var(--text-secondary)");
    expect(deltaColor(0)).toBe("var(--text-muted)");
  });

  it("展示数值最多两位小数，不把归一化浮点整串打出来", () => {
    // 多维自评量表的维度值就是这种形状：不收敛会把标注撑爆
    expect(formatTrendValue(0.10638297872340426)).toBe("0.11");
    expect(formatTrendValue(-0.21999999999999997)).toBe("-0.22");
    expect(formatTrendValue(-0.7674418604651163)).toBe("-0.77");
    expect(formatTrendValue(0.9215686274509804)).toBe("0.92");
    // 整数不拖小数尾巴，-0 也不显示成负数
    expect(formatTrendValue(12)).toBe("12");
    expect(formatTrendValue(12.005)).toBe("12.01");
    expect(formatTrendValue(-0.001)).toBe("0");
    expect(formatTrendValue(-0)).toBe("0");
  });

  it("差值同样收敛到两位（浮点尾巴不该出现在标注里）", () => {
    expect(formatDelta(0.10638297872340426 + 0.21999999999999997)).toBe("+0.33");
    expect(formatDelta(0.011363636363636373 + 0.2)).toBe("+0.21");
    expect(formatDelta(-0.3263527308346009)).toBe("-0.33");
  });

  it("时间格式化为中文，空值提示未知时间", () => {
    expect(formatTrendTime("")).toBe("未知时间");
    expect(formatTrendTime("2026-01-01T00:00:00Z")).toContain("2026");
  });
});
