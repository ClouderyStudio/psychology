import { describe, expect, it } from "vitest";
import { testIntros } from "../server/utils/test-intros";

// list.get.ts 只用到一个 Nitro 自动导入，补上最小实现后即可直接调用
(globalThis as any).defineEventHandler = (handler: any) => handler;
const { default: listTests } = await import("../server/api/tests/list.get");

const listedIds = new Set(
  ((listTests as any)().data as { id: string }[]).map((t) => t.id),
);

describe("量表覆盖边界声明", () => {
  it("多维自评量表明确写出覆盖与不覆盖的方向", () => {
    const intro = testIntros.multidim!;
    expect(intro.coverage).toBeTruthy();
    expect(intro.coverage).toContain("不覆盖");
    // 报告指出的缺口：20 个维度里没有任何解离方向，必须点名
    expect(intro.coverage).toContain("解离");
    // 避免「没有提示」被读成「没有问题」
    expect(intro.coverage).toContain("不等于");
    // 报告点名的其余缺口也要写明，不能只提解离
    expect(intro.coverage).toContain("情感麻木");
    expect(intro.coverage).toContain("性别身份");
    // 报告实测的关键词命中数为 0，这一事实应写进声明
    expect(intro.coverage).toContain("命中数为 0");
  });

  it("相关量表都指向平台上真实存在的量表，且各自说明理由", () => {
    const related = testIntros.multidim!.related || [];
    expect(related.length).toBeGreaterThan(0);
    for (const rel of related) {
      expect(listedIds.has(rel.id)).toBe(true);
      expect(rel.title.length).toBeGreaterThan(0);
      expect(rel.reason.length).toBeGreaterThan(10);
    }
    // 解离相关的三张量表都应被引导到
    const ids = related.map((r) => r.id);
    expect(ids).toContain("mid60");
    expect(ids).toContain("des2");
    expect(ids).toContain("sdq20");
  });

  it("其它量表的 intro 结构完整（origin / purpose / audience 均非空）", () => {
    for (const [id, intro] of Object.entries(testIntros)) {
      expect(intro.origin.length, id).toBeGreaterThan(0);
      expect(intro.purpose.length, id).toBeGreaterThan(0);
      expect(intro.audience.length, id).toBeGreaterThan(0);
    }
  });
});
