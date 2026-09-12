import { beforeEach, describe, expect, it } from "vitest";
import {
  createQuestionToken,
  verifyQuestionToken,
} from "../server/utils/question-token";
import {
  idempotencyKey,
  readIdempotent,
  resetIdempotencyCache,
  writeIdempotent,
} from "../server/utils/idempotency";

/* ===== 出题凭证 ===== */

describe("出题凭证（question-token）", () => {
  it("签发后可校验，并原样带回出题参数", () => {
    const token = createQuestionToken({ testId: "multidim", mode: "deep", seed: "s-123" });
    const payload = verifyQuestionToken(token, "multidim");
    expect(payload).not.toBeNull();
    expect(payload!.mode).toBe("deep");
    expect(payload!.seed).toBe("s-123");
    expect(typeof payload!.iat).toBe("number");
  });

  it("不带种子的模式同样可校验", () => {
    const token = createQuestionToken({ testId: "multidim", mode: "light" });
    const payload = verifyQuestionToken(token, "multidim");
    expect(payload!.mode).toBe("light");
    expect(payload!.seed).toBeUndefined();
  });

  it("篡改 payload 或签名都会失效", () => {
    const token = createQuestionToken({ testId: "multidim", mode: "light" });
    const [body, sig] = token.split(".");

    // 把 mode 从 light 改成 deep（重新编码 payload，签名不变）
    const forged = Buffer.from(
      JSON.stringify({ testId: "multidim", mode: "deep", iat: Date.now() }),
    ).toString("base64url");
    expect(verifyQuestionToken(`${forged}.${sig}`, "multidim")).toBeNull();

    expect(verifyQuestionToken(`${body}.${"0".repeat(sig!.length)}`, "multidim")).toBeNull();
    expect(verifyQuestionToken(body!, "multidim")).toBeNull();
  });

  it("拒绝非字符串、空串与格式错误的值", () => {
    for (const bad of [undefined, null, 42, {}, [], "", ".", "abc", ".sig"]) {
      expect(verifyQuestionToken(bad, "multidim")).toBeNull();
    }
  });

  it("testId 不匹配时失效——凭证不能跨量表复用", () => {
    const token = createQuestionToken({ testId: "multidim", mode: "fast" });
    expect(verifyQuestionToken(token, "phq9")).toBeNull();
    expect(verifyQuestionToken(token, "multidim")).not.toBeNull();
  });

  it("签发的是 HMAC 签名而非明文，payload 不含密钥", () => {
    const token = createQuestionToken({ testId: "multidim", mode: "standard", seed: "abc" });
    expect(token).toMatch(/^[A-Za-z0-9_-]+\.[0-9a-f]{64}$/);
    const body = JSON.parse(Buffer.from(token.split(".")[0]!, "base64url").toString("utf8"));
    expect(Object.keys(body).sort()).toEqual(["iat", "mode", "seed", "testId"]);
  });
});

/* ===== 幂等 ===== */

describe("提交幂等（idempotency）", () => {
  beforeEach(() => resetIdempotencyCache());

  it("同一幂等键回放同一份结果", () => {
    const key = idempotencyKey("1.2.3.4", "phq9", "abc-123");
    expect(key).toBe("1.2.3.4:phq9:abc-123");
    expect(readIdempotent(key)).toBeNull();

    writeIdempotent(key, { success: true, data: { totalScore: 12 } });
    expect(readIdempotent(key)!.data.totalScore).toBe(12);
  });

  it("不同客户端 / 量表 / 提交 id 互不影响", () => {
    const a = idempotencyKey("1.1.1.1", "phq9", "same");
    const b = idempotencyKey("2.2.2.2", "phq9", "same");
    const c = idempotencyKey("1.1.1.1", "gad7", "same");
    writeIdempotent(a, { data: { mark: "a" } });
    expect(readIdempotent(b)).toBeNull();
    expect(readIdempotent(c)).toBeNull();
    expect(readIdempotent(a)!.data.mark).toBe("a");
  });

  it("缺失或非法的提交 id 不参与幂等（退化为每次结算）", () => {
    expect(idempotencyKey("1.1.1.1", "phq9", undefined)).toBeNull();
    expect(idempotencyKey("1.1.1.1", "phq9", "")).toBeNull();
    expect(idempotencyKey("1.1.1.1", "phq9", "   ")).toBeNull();
    expect(idempotencyKey("1.1.1.1", "phq9", 42)).toBeNull();
    expect(idempotencyKey("1.1.1.1", "phq9", "x".repeat(129))).toBeNull();
    expect(readIdempotent(null)).toBeNull();
    // 写入 null 键不应抛错，也不应产生可读条目
    expect(() => writeIdempotent(null, { data: 1 })).not.toThrow();
  });

  it("提交 id 两侧空白被归一化（同一份作答不会因空格被当成两次）", () => {
    expect(idempotencyKey("ip", "phq9", " abc ")).toBe(idempotencyKey("ip", "phq9", "abc"));
  });
});
