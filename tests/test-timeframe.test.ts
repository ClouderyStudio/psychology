import { describe, expect, it } from "vitest";
import {
  TEST_TIME_FRAME,
  TEST_CONTEXT_HINT,
  timeFrameOf,
  contextHintOf,
} from "../server/utils/test-timeframe";

// 两个接口都只用到 Nitro 自动导入，补上最小实现后可直接调用（同 scale-coverage.test.ts）
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
(globalThis as any).getQuery = () => ({});

const { default: listTests } = await import("../server/api/tests/list.get");
const { default: getTest } = await import("../server/api/tests/[id].get");

const listed = (listTests as any)().data as Array<{ id: string; timeFrame?: string }>;
const listedIds = listed.map((t) => t.id);

const fetchTest = async (id: string) => {
  currentId = id;
  const res = await (getTest as any)({});
  return res.data as { id: string; instructions?: string; timeFrame?: string; contextHint?: string };
};

describe("评估时间范围与作答前提", () => {
  it("结果页拿到的列表与作答页拿到的详情使用同一份时间范围", async () => {
    for (const id of listedIds) {
      const fromList = listed.find((t) => t.id === id)!.timeFrame;
      const fromDetail = (await fetchTest(id)).timeFrame;
      expect(fromDetail, id).toBe(fromList);
      expect(fromDetail, id).toBe(timeFrameOf(id));
    }
    // 映射表里不能有平台上不存在的量表 id
    for (const id of Object.keys(TEST_TIME_FRAME)) {
      expect(listedIds, id).toContain(id);
    }
    for (const id of Object.keys(TEST_CONTEXT_HINT)) {
      expect(listedIds, id).toContain(id);
    }
  });

  it("量表说明里写了时间窗口的，必须显式下发 window（不能靠题面猜）", async () => {
    // 第三批报告 6：PHQ-9 两周、GAD-7 两周、SDS/SAS 一周、严重度量表 7 天、
    // ASRM 一周、YMRS 48 小时、ISI 两周、PSS 一个月、SDQ-20 一年——窗口各不相同，
    // 页面上却没有统一的「本次窗口」提示
    const hasWindow = /(过去|最近|近)\s*(一|两|1|2|7|48|\d+)?\s*(周|天|小时|个月|年)/;
    const checked: string[] = [];
    for (const id of listedIds) {
      const t = await fetchTest(id);
      if (!t.instructions || !hasWindow.test(t.instructions)) continue;
      checked.push(id);
      expect(t.timeFrame, `${id} 的说明写了时间窗口，结果里却没有 timeFrame`).toBeTruthy();
      // 窗口不能自相矛盾：说明里出现"一周/1周"就不能下发"两周"
      if (/过去\s*一周|最近\s*一周|过去\s*1\s*周/.test(t.instructions)) {
        expect(t.timeFrame, id).toContain("一周");
      }
      if (/过去\s*两周|最近\s*两周|过去\s*2\s*周/.test(t.instructions)) {
        expect(t.timeFrame, id).toMatch(/两周|2\s*周/);
      }
      if (/48\s*小时/.test(t.instructions)) {
        expect(t.timeFrame, id).toContain("48");
      }
      if (/过去\s*一年/.test(t.instructions)) {
        expect(t.timeFrame, id).toContain("一年");
      }
    }
    // 覆盖到报告点名的那些量表
    for (const id of ["phq9", "gad7", "sds", "sas", "scl90", "pss", "ymrs", "isi", "asrm", "sdq20", "ocir", "ptsd", "panic", "agora"]) {
      expect(checked, id).toContain(id);
    }
  });

  it("窗口不明确的量表也要写清楚，不能被读成统一的两周", async () => {
    // MDQ 问「是否有过」、DES-II 问「出现的时间比例」，两者都没有近期窗口，
    // 必须显式说明，否则会被默认为"最近两周"
    expect((await fetchTest("mdq")).timeFrame).toContain("不限近期");
    expect((await fetchTest("des2")).timeFrame).toContain("无固定窗口");
    // 多维自评的少数题目另有窗口，主窗口要写明"少数题目另行标注"
    expect((await fetchTest("multidim")).timeFrame).toContain("另行标注");
    // 没有固定窗口的量表不下发 timeFrame，而不是下发一个空串
    for (const id of ["bis", "bpaq", "rses", "sioss", "epq", "mbti", "sixteenPF"]) {
      expect((await fetchTest(id)).timeFrame, id).toBeUndefined();
    }
  });

  it("严重度量表把「这些情境」的具体所指固定下发给作答页", async () => {
    // 这些量表的题面统一写「这些情境」，前提只出现在量表说明里，翻页后就看不到
    for (const [id, hint] of Object.entries(TEST_CONTEXT_HINT)) {
      const t = await fetchTest(id);
      expect(t.contextHint, id).toBe(hint);
      expect(hint.length, id).toBeGreaterThan(10);
      // 前提必须与说明一致，不能各写一套
      expect(t.instructions, id).toBeTruthy();
    }
    // 广场恐怖的说明原本只说「这些情境」而不解释所指，已补上具体情境
    const agora = await fetchTest("agora");
    expect(agora.instructions).toContain("人群");
    expect(agora.instructions).toContain("独自出行或离家");
    // 没有前提要交代的量表不下发 contextHint
    for (const id of ["phq9", "gad7", "bis", "rses"]) {
      expect((await fetchTest(id)).contextHint, id).toBeUndefined();
    }
  });

  it("timeFrameOf / contextHintOf 对未知与空值返回 undefined", () => {
    expect(timeFrameOf("not-a-test")).toBeUndefined();
    expect(timeFrameOf(undefined)).toBeUndefined();
    expect(timeFrameOf(null)).toBeUndefined();
    expect(contextHintOf("not-a-test")).toBeUndefined();
    expect(contextHintOf(undefined)).toBeUndefined();
    expect(timeFrameOf("phq9")).toBe("最近两周");
  });
});
