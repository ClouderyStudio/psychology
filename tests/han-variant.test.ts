import { describe, it, expect, beforeAll } from "vitest";
import { decideSync, type HanConverter } from "../app/utils/hanVariantDom";

/**
 * 本文件测两件事：
 *  1. decideSync —— 记原文/记写入值的判断逻辑，出错的后果是「静默改坏文案」，
 *     比报错更危险，所以必须有测试兜住（尤其是切回简体能不能完整还原）。
 *  2. 真实的 OpenCC s2t 转换 —— 确认 API 用法对、歧义字由词典按词处理、且可反复施加。
 */

// 一个假转换器：把 A 映射成 B，便于精确断言（不依赖真实词典）
const fake: HanConverter = (t) => t.replaceAll("A", "B");
// 还原用不到转换器（convert=null），但要覆盖「假转换器 + 真实还原」的组合

describe("decideSync：原文与写入值的状态机", () => {
  it("首次遇到 → 当前值即原文，并写入转换结果", () => {
    const r = decideSync("A", undefined, fake);
    expect(r.origin).toEqual({ base: "A", written: "B" });
    expect(r.want).toBe("B");
  });

  it("简体档首次遇到 → 原文与写入值相同", () => {
    const r = decideSync("A", undefined, null);
    expect(r.origin).toEqual({ base: "A", written: "A" });
    expect(r.want).toBe("A");
  });

  it("DOM 仍是我们写入的值 → 用原文重算，不叠加转换", () => {
    const first = decideSync("A", undefined, fake);
    const again = decideSync(first.want, first.origin, fake);
    expect(again.origin).toEqual({ base: "A", written: "B" });
    expect(again.want).toBe("B");
  });

  it("切回简体 → 必须用原文还原（关键回归：只记原文的实现会在这里把繁体吞掉）", () => {
    const toTrad = decideSync("A", undefined, fake);
    // 当前 DOM 是繁体 B，状态里 base=A / written=B
    const back = decideSync(toTrad.want, toTrad.origin, null);
    expect(back.want).toBe("A");
    expect(back.origin).toEqual({ base: "A", written: "A" });
  });

  it("切回简体后再切繁体 → 仍然得到繁体，且原文没被污染", () => {
    const t1 = decideSync("A", undefined, fake);
    const s1 = decideSync(t1.want, t1.origin, null);
    const t2 = decideSync(s1.want, s1.origin, fake);
    expect(t2.want).toBe("B");
    expect(t2.origin.base).toBe("A");
  });

  it("外部改写（Vue 换了新内容）→ 当前值成为新原文，旧文案不会盖回来", () => {
    const first = decideSync("A", undefined, fake);
    // Vue 把节点写成了全新内容 C（既不是 base A，也不是 written B）
    const after = decideSync("C", first.origin, fake);
    expect(after.origin.base).toBe("C");
    expect(after.want).toBe("C"); // 假转换器只替换 A，所以 C 保持不变
  });

  it("外部改写后切回简体 → 还原成被改写后的内容，而不是最初的内容", () => {
    const first = decideSync("A", undefined, fake);
    const after = decideSync("C", first.origin, fake);
    const back = decideSync(after.want, after.origin, null);
    expect(back.want).toBe("C");
  });

  it("连续多次同步是稳定的（不会来回抖动）", () => {
    let origin = decideSync("A", undefined, fake).origin;
    for (let i = 0; i < 5; i++) {
      const r = decideSync("B", origin, fake);
      expect(r.want).toBe("B");
      origin = r.origin;
    }
    expect(origin.base).toBe("A");
  });
});

describe("真实 OpenCC 转换", () => {
  let toTw: HanConverter;
  let toHk: HanConverter;
  let toGeneric: HanConverter;

  beforeAll(async () => {
    const { Converter } = await import("opencc-js/cn2t");
    toTw = Converter({ from: "cn", to: "tw" });
    toHk = Converter({ from: "cn", to: "hk" });
    toGeneric = Converter({ from: "cn", to: "t" });
  });

  it("台湾正体：常用字转换正确", () => {
    expect(toTw("心理测评中心")).toBe("心理測評中心");
    expect(toTw("抑郁与焦虑")).toBe("抑鬱與焦慮");
    expect(toTw("这个功能很方便")).toBe("這個功能很方便");
  });

  it("歧义字按词处理，而不是逐字硬转", () => {
    // 「干」在不同词里应转成不同字，这正是要靠短语词典（而非纯字级映射）的原因
    expect(toTw("干活")).toBe("幹活");
    expect(toTw("干燥")).toBe("乾燥");
    expect(toTw("里应外合")).toBe("裡應外合");
  });

  it("通用档 s2t 会产出陈旧字形 —— 这是本项目不用它的原因", () => {
    // 若哪天有人把 to 改成 't'，这些断言会提醒他为什么不该改
    expect(toGeneric("吃面")).toBe("喫麪");
    expect(toGeneric("床铺")).toBe("牀鋪");
    expect(toGeneric("为什么")).toBe("爲什麼");
    expect(toGeneric("这里")).toBe("這裏");
  });

  it("台湾与香港两档在若干常用字上确有差别", () => {
    expect(toTw("里面")).toBe("裡面");
    expect(toHk("里面")).toBe("裏面");
    expect(toTw("着火")).toBe("著火");
    expect(toHk("着火")).toBe("着火");
    expect(toTw("污秽")).toBe("汙穢");
    expect(toHk("污秽")).toBe("污穢");
    // 也有两档一致的
    expect(toTw("复诊")).toBe(toHk("复诊"));
    expect(toTw("还是")).toBe(toHk("还是"));
  });

  it("转换是幂等的（对已转换文本再转一次不再变化）", () => {
    const samples = ["心理健康", "抑郁与焦虑", "打分与评估", "复杂的一周", "里应外合"];
    for (const s of samples) {
      const once = toTw(s);
      expect(toTw(once)).toBe(once);
      expect(toHk(once)).toBe(toHk(toHk(once)));
    }
  });

  it("不含可转换字的文本原样返回（如数字、英文）", () => {
    expect(toTw("PHQ-9 21/27 ok")).toBe("PHQ-9 21/27 ok");
  });
});
