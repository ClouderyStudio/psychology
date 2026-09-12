import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * 题目集合凭证。
 *
 * 多维自评量表的题目由「模式 + 种子」在服务端现算，客户端把 mode / seed 原样回传。
 * 原实现直接采信这两个值：客户端可以把 seed 换成任意字符串、把 mode 换成更短的模式，
 * 于是「生成题目的参数」与「评分时的参数」可以不是同一套。
 * 这里在出题时签发一枚 HMAC 凭证，提交时以凭证内的参数为准。
 */

const SECRET =
  process.env.NITRO_QUESTION_SECRET ||
  process.env.NITRO_INTERNAL_SECRET ||
  process.env.NITRO_INTERNAL_TEST_PASSWORD ||
  "yunshu-question";

/** 凭证有效期：12 小时（足够一次测评，且不会长期可复用） */
const TTL_MS = 12 * 60 * 60 * 1000;

export interface QuestionTokenPayload {
  testId: string;
  mode?: string;
  seed?: string;
  iat: number;
}

function sign(payloadB64: string): string {
  return createHmac("sha256", SECRET).update(payloadB64).digest("hex");
}

/** 签发题目集合凭证（格式：payloadBase64url.signature） */
export function createQuestionToken(payload: {
  testId: string;
  mode?: string;
  seed?: string;
}): string {
  const body: QuestionTokenPayload = {
    testId: payload.testId,
    iat: Date.now(),
  };
  if (payload.mode) body.mode = payload.mode;
  if (payload.seed) body.seed = payload.seed;
  const b64 = Buffer.from(JSON.stringify(body)).toString("base64url");
  return `${b64}.${sign(b64)}`;
}

/** 校验凭证；无效、过期或 testId 不匹配时返回 null */
export function verifyQuestionToken(
  token: unknown,
  expectedTestId: string,
): QuestionTokenPayload | null {
  if (!token || typeof token !== "string") return null;
  const dot = token.indexOf(".");
  if (dot <= 0) return null;

  const payloadB64 = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = sign(payloadB64);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf8"),
    ) as QuestionTokenPayload;
    if (!payload || typeof payload !== "object") return null;
    if (payload.testId !== expectedTestId) return null;
    if (typeof payload.iat !== "number" || Date.now() - payload.iat > TTL_MS) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}
