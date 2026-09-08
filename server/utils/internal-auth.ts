import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * 内部测试访问令牌
 * 采用 HMAC-SHA256 签名，避免凭证被前端篡改或伪造。
 * 密钥来自服务端环境变量（绝不下发到客户端 bundle）。
 */
const SECRET =
  process.env.NITRO_INTERNAL_SECRET ||
  process.env.NITRO_INTERNAL_TEST_PASSWORD ||
  "yunshu";

// 令牌有效期：7 天
const TTL_MS = 7 * 24 * 60 * 60 * 1000;

interface InternalPayload {
  v: "granted";
  iat: number;
}

function sign(payloadB64: string): string {
  return createHmac("sha256", SECRET).update(payloadB64).digest("hex");
}

/** 签发一枚访问令牌（格式：payloadBase64url.signature） */
export function createInternalToken(): string {
  const payload = Buffer.from(
    JSON.stringify({ v: "granted", iat: Date.now() } satisfies InternalPayload),
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

/** 校验令牌是否有效（签名正确且在有效期内） */
export function validateInternalToken(
  token: string | undefined | null,
): boolean {
  if (!token || typeof token !== "string") return false;
  const dot = token.indexOf(".");
  if (dot <= 0) return false;

  const payloadB64 = token.slice(0, dot);
  const sig = token.slice(dot + 1);

  const expected = sign(payloadB64);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

  try {
    const payload = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf8"),
    ) as InternalPayload;
    if (payload.v !== "granted") return false;
    if (typeof payload.iat !== "number" || Date.now() - payload.iat > TTL_MS) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
