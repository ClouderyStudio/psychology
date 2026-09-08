import { describe, it, expect } from "vitest";
import { createInternalToken, validateInternalToken } from "../server/utils/internal-auth";

describe("内部测试访问令牌", () => {
  it("有效令牌可通过校验", () => {
    const token = createInternalToken();
    expect(token.split(".")).toHaveLength(2);
    expect(validateInternalToken(token)).toBe(true);
  });

  it("空值 / 畸形值应被拒绝", () => {
    expect(validateInternalToken(null)).toBe(false);
    expect(validateInternalToken("")).toBe(false);
    expect(validateInternalToken("not-a-token")).toBe(false);
    expect(validateInternalToken("payload.only")).toBe(false);
  });

  it("篡改签名应被拒绝", () => {
    const token = createInternalToken();
    const flip = token.endsWith("0") ? "1" : "0";
    expect(validateInternalToken(token.slice(0, -1) + flip)).toBe(false);
  });

  it("伪造 payload（复用自己的旧签名）应被拒绝", () => {
    const token = createInternalToken();
    const fakePayload = Buffer.from(
      JSON.stringify({ v: "granted", iat: 1 }),
    ).toString("base64url");
    expect(validateInternalToken(fakePayload + "." + token.split(".")[1])).toBe(false);
  });
});
