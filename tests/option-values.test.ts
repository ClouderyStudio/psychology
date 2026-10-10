import { describe, expect, it } from "vitest";

// 作答页用 option.value 判断「哪一项被选中」（app/pages/test/[id].vue），
// 因此同一题内的 option.value 必须唯一；一旦重复，多个选项会同时显示为选中，
// 而且用户到底选了哪一档在数据上无法区分。EAT-26 曾因为把「有时 / 很少 / 从不」
// 三个 0 分档直接写成 value 0 而触发该问题，这里做全量表回归。
(globalThis as any).defineEventHandler = (handler: any) => handler;
(globalThis as any).getRequestHeaders = () => ({});
(globalThis as any).setResponseHeader = () => {};
(globalThis as any).createError = (options: any) => {
  const err: any = new Error(options?.message || options?.statusMessage || "error");
  Object.assign(err, options);
  return err;
};
let currentId = "";
(globalThis as any).getRouterParam = () => currentId;
(globalThis as any).getQuery = () => ({ mode: "standard", seed: "1" });

const { default: listTests } = await import("../server/api/tests/list.get");
const { default: getTest } = await import("../server/api/tests/[id].get");

const listedIds = ((listTests as any)().data as Array<{ id: string }>).map((t) => t.id);

const fetchTest = async (id: string) => {
  currentId = id;
  const res = await (getTest as any)({});
  return res.data as {
    id: string;
    questions?: Array<{ id: number; options?: Array<{ value: number; label: string }> }>;
  };
};

describe("选项取值完整性", () => {
  it("每道题的选项 value 都唯一且 label 不重复", async () => {
    for (const id of listedIds) {
      const test = await fetchTest(id);
      for (const q of test.questions || []) {
        const options = q.options || [];
        if (options.length === 0) continue;
        const values = options.map((o) => o.value);
        expect(new Set(values).size, `${id} 第 ${q.id} 题的选项 value 有重复：${values.join(",")}`).toBe(
          values.length,
        );
        const labels = options.map((o) => o.label);
        expect(new Set(labels).size, `${id} 第 ${q.id} 题的选项文字有重复`).toBe(labels.length);
      }
    }
  });

  it("EAT-26 六个档位的 value 依次为 5/4/3/2/1/0", async () => {
    const test = await fetchTest("eat26");
    expect(test.questions).toHaveLength(26);
    for (const q of test.questions || []) {
      expect((q.options || []).map((o) => o.value)).toEqual([5, 4, 3, 2, 1, 0]);
      expect((q.options || []).map((o) => o.label)).toEqual([
        "总是",
        "经常",
        "常常",
        "有时",
        "很少",
        "从不",
      ]);
    }
  });
});
