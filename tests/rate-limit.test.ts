import { beforeEach, describe, expect, it } from "vitest";

/**
 * rate-limit 依赖 Nitro 的自动导入（getRequestHeaders / setResponseHeader / createError）。
 * 这里是 node 测试环境，没有 Nitro 运行时，因此先补上最小实现再动态引入模块。
 */
(globalThis as any).getRequestHeaders = (event: any) => event.headers || {};
(globalThis as any).setResponseHeader = (event: any, name: string, value: unknown) => {
  event.responseHeaders = event.responseHeaders || {};
  event.responseHeaders[name] = value;
};
(globalThis as any).createError = (options: any) => {
  const err: any = new Error(options.message);
  err.statusCode = options.statusCode;
  err.statusMessage = options.statusMessage;
  return err;
};

const { clientKey, enforceRateLimit, resetRateLimits } = await import(
  "../server/utils/rate-limit"
);

const makeEvent = (headers: Record<string, string> = {}, remoteAddress = "10.0.0.1") => ({
  headers,
  node: { req: { socket: { remoteAddress } } },
}) as any;

const opts = { scope: "test", limit: 3, windowMs: 60_000 };

beforeEach(() => resetRateLimits());

describe("接口限流（rate-limit）", () => {
  it("窗口内放行至上限，超出后抛 429 并给出重试时间", () => {
    const event = makeEvent();
    for (let i = 0; i < 3; i++) {
      expect(() => enforceRateLimit(event, opts)).not.toThrow();
    }
    // 第 4 次超限
    let thrown: any = null;
    try {
      enforceRateLimit(event, opts);
    } catch (e) {
      thrown = e;
    }
    expect(thrown).not.toBeNull();
    expect(thrown.statusCode).toBe(429);
    expect(thrown.message).toContain("过于频繁");
    expect(event.responseHeaders["retry-after"]).toBeGreaterThan(0);
    expect(event.responseHeaders["x-ratelimit-remaining"]).toBe("0");
  });

  it("不同客户端各自计数，互不牵连", () => {
    const a = makeEvent({}, "10.0.0.1");
    const b = makeEvent({}, "10.0.0.2");
    for (let i = 0; i < 3; i++) enforceRateLimit(a, opts);
    expect(() => enforceRateLimit(a, opts)).toThrow();
    // 另一个客户端不受影响
    expect(() => enforceRateLimit(b, opts)).not.toThrow();
  });

  it("不同 scope 各自计数（提交与出题互不占用额度）", () => {
    const event = makeEvent();
    for (let i = 0; i < 3; i++) enforceRateLimit(event, { ...opts, scope: "submit" });
    expect(() => enforceRateLimit(event, { ...opts, scope: "submit" })).toThrow();
    expect(() => enforceRateLimit(event, { ...opts, scope: "questions" })).not.toThrow();
  });

  it("窗口过期后重新计数", () => {
    const event = makeEvent();
    for (let i = 0; i < 3; i++) enforceRateLimit(event, { ...opts, windowMs: 1 });
    // windowMs = 1ms，等待后应重新放行
    const start = Date.now();
    while (Date.now() - start < 5) {
      /* 等待窗口过期 */
    }
    expect(() => enforceRateLimit(event, { ...opts, windowMs: 1 })).not.toThrow();
  });

  it("放行时透出剩余额度，便于观测", () => {
    const event = makeEvent();
    enforceRateLimit(event, opts);
    expect(event.responseHeaders["x-ratelimit-limit"]).toBe("3");
    expect(event.responseHeaders["x-ratelimit-remaining"]).toBe("2");
    enforceRateLimit(event, opts);
    expect(event.responseHeaders["x-ratelimit-remaining"]).toBe("1");
  });

  it("客户端标识优先取 x-forwarded-for 第一段，其次 x-real-ip，最后退回 socket", () => {
    expect(clientKey(makeEvent({ "x-forwarded-for": "1.1.1.1, 2.2.2.2" }))).toBe("1.1.1.1");
    expect(clientKey(makeEvent({ "x-real-ip": "3.3.3.3" }, "10.0.0.9"))).toBe("3.3.3.3");
    expect(clientKey(makeEvent({}, "10.0.0.9"))).toBe("10.0.0.9");
    expect(clientKey({ headers: {}, node: { req: {} } } as any)).toBe("unknown");
    // 同一来源的代理头不会因为带空格被判成不同客户端
    expect(clientKey(makeEvent({ "x-forwarded-for": " 4.4.4.4 , 5.5.5.5" }))).toBe("4.4.4.4");
  });
});
