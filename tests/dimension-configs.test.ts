import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  buildDimensionConfig,
  dimensionBuilders,
  type DimensionConfig,
} from "../app/utils/dimension-configs";

// result.vue 的 enrichedScale 是「哪些量表要渲染维度剖面」的白名单，
// 与 dimensionBuilders 的登记表必须一一对应，否则量表会静默不显示维度。
const resultVue = readFileSync(
  new URL("../app/pages/result.vue", import.meta.url),
  "utf8",
);
const scaleBlock = resultVue.slice(resultVue.indexOf("const enrichedScale"));
const scaleMatch = scaleBlock.match(/\[([^\]]*)\]\.includes\(id\)/);
const enrichedScaleIds = (scaleMatch?.[1] ?? "")
  .split(",")
  .map((token) => token.trim().replace(/^['"]|['"]$/g, ""))
  .filter(Boolean);

const FALLBACK: DimensionConfig = {
  title: "",
  icon: "📊",
  color: "var(--primary)",
  hint: "",
  subtitle: "",
  columns: "repeat(auto-fill, minmax(240px, 1fr))",
  items: [],
  highlightCard: null,
};

function expectValidItems(config: DimensionConfig) {
  expect(config.items.length).toBeGreaterThan(0);
  for (const item of config.items) {
    expect(Number.isFinite(item.value), item.key).toBe(true);
    expect(item.value, item.key).toBeGreaterThanOrEqual(0);
    expect(item.value, item.key).toBeLessThanOrEqual(100);
  }
}

describe("维度配置注册表", () => {
  it("enrichedScale 白名单里的每个 testId 都已登记 builder", () => {
    expect(enrichedScaleIds.length).toBe(38);
    for (const id of enrichedScaleIds) {
      expect(dimensionBuilders[id], id).toBeTypeOf("function");
    }
  });

  it("未登记的 testId 返回与重构前完全一致的兜底结果", () => {
    const config = buildDimensionConfig("__nonexistent__", {});
    expect(config).toEqual(FALLBACK);
    expect(config.items.length).toBe(0);
    expect(config.highlightCard).toBeNull();
  });

  it("scores 缺省 / 为 null 时也不抛错", () => {
    expect(() => buildDimensionConfig("__nonexistent__", null)).not.toThrow();
    expect(() => buildDimensionConfig("epq", null)).not.toThrow();
  });

  it("多维量表：epq / sixteenPF / mid60 / des2 产出合法 items", () => {
    const epq = buildDimensionConfig("epq", {
      E: { tScore: 62, name: "E", highDesc: "外向" },
      N: { tScore: 48 },
      P: { tScore: 30 },
      L: { tScore: 55, validity: "作答真实" },
    });
    expect(epq.icon).toBe("🧠");
    expect(epq.color).toBe("var(--personality)");
    expect(epq.items).toHaveLength(4);
    expect(epq.items[0]!.display).toBe("62 T");
    expect(epq.items[0]!.desc).toBe("外向");
    expectValidItems(epq);

    const pf = buildDimensionConfig("sixteenPF", { factors: { A: 10, B: 1 } });
    expect(pf.items).toHaveLength(16);
    expect(pf.columns).toBe("repeat(auto-fill, minmax(200px, 1fr))");
    expect(pf.items.find((i) => i.key === "A")!.value).toBe(100);
    expect(pf.items.find((i) => i.key === "B")!.value).toBe(0);
    expectValidItems(pf);

    const mid60 = buildDimensionConfig("mid60", {
      amnesia: { score: 42.5, above: true, name: "记忆缺失" },
    });
    expect(mid60.items).toHaveLength(12);
    expect(mid60.items[0]!.display).toBe("42.5%");
    expect(mid60.items[0]!.level).toBe("超参考线");
    expect(mid60.items[1]!.level).toBe("");
    expectValidItems(mid60);

    const des2 = buildDimensionConfig("des2", { amnesia: { score: 33.3 } });
    expect(des2.items).toHaveLength(3);
    expect(des2.items[0]!.value).toBe(33.3);
    expectValidItems(des2);
  });

  it("单维 / 单维加子量表：hspr / ptsd 产出合法 items", () => {
    const hspr = buildDimensionConfig("hspr", {
      total: { score: 5.25, max: 7, level: "高敏感倾向" },
      positive: { score: 6, max: 7 },
    });
    expect(hspr.items).toHaveLength(2);
    expect(hspr.items[0]!.value).toBe(75);
    expect(hspr.items[0]!.display).toBe("5.25/7");
    expect(hspr.items[1]!.display).toBe("6.00/7");
    expectValidItems(hspr);

    const ptsd = buildDimensionConfig("ptsd", {
      total: { score: 18, max: 36, level: "中度" },
    });
    expect(ptsd.items).toHaveLength(1);
    expect(ptsd.items[0]!.value).toBe(50);
    expectValidItems(ptsd);
  });

  it("highlightCard 分支：phq9 / gad7 只产出卡片，不产出 items", () => {
    for (const id of ["phq9", "gad7"]) {
      const config = buildDimensionConfig(id, {
        highlight: { label: "情绪低落", freq: "几乎每天", endorsedCount: 5 },
      });
      expect(config.items).toHaveLength(0);
      expect(config.highlightCard).toEqual({
        label: "情绪低落",
        freq: "几乎每天",
        endorsedCount: 5,
      });
    }
    const phq9 = buildDimensionConfig("phq9", {});
    expect(phq9.title).toBe("关键症状");
    expect(buildDimensionConfig("gad7", {}).title).toBe("主要担忧 / 紧张表现");
    expect(phq9.highlightCard).toEqual({ label: "—", freq: "—", endorsedCount: 0 });
  });
});
