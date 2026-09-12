import type { H3Event } from "h3";

/**
 * 进程内固定窗口限流。
 *
 * 提交接口原先没有任何限流：同一 IP 可以无限次调用，服务端每次都要重建题库、
 * 校验作答并跑完整评分，属于纯放大面。这里做最小可用的防护——单实例内存计数，
 * 够挡住脚本刷接口与误触发的重试风暴；多实例部署时应替换为共享存储（Redis 等）。
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

/** 桶数量上限，防止被大量不同 IP 撑爆内存 */
const MAX_BUCKETS = 5000;

function prune(now: number): void {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
  if (buckets.size <= MAX_BUCKETS) return;
  // 仍超限时按过期时间淘汰最旧的一批
  const sorted = [...buckets.entries()].sort(
    (a, b) => a[1].resetAt - b[1].resetAt,
  );
  for (let i = 0; i < sorted.length - MAX_BUCKETS; i++) {
    buckets.delete(sorted[i]![0]);
  }
}

/** 取客户端标识：优先 x-forwarded-for 的第一段，退回 socket 地址 */
export function clientKey(event: H3Event): string {
  const headers = getRequestHeaders(event);
  const forwarded = headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0]!.trim();
  }
  const real = headers["x-real-ip"];
  if (typeof real === "string" && real.length > 0) return real;
  return event.node?.req?.socket?.remoteAddress || "unknown";
}

export interface RateLimitOptions {
  /** 计数维度（附加在客户端标识前），便于不同接口各自计数 */
  scope: string;
  /** 窗口内允许的次数 */
  limit: number;
  /** 窗口长度（毫秒） */
  windowMs: number;
}

/**
 * 记账并返回是否放行；超限时抛出 429。
 * 返回剩余额度，便于在响应头里透出。
 */
export function enforceRateLimit(
  event: H3Event,
  { scope, limit, windowMs }: RateLimitOptions,
): { remaining: number; resetAt: number } {
  const now = Date.now();
  prune(now);

  const key = `${scope}:${clientKey(event)}`;
  const current = buckets.get(key);
  const bucket =
    current && current.resetAt > now
      ? current
      : { count: 0, resetAt: now + windowMs };
  bucket.count += 1;
  buckets.set(key, bucket);

  const remaining = Math.max(limit - bucket.count, 0);
  setResponseHeader(event, "x-ratelimit-limit", String(limit));
  setResponseHeader(event, "x-ratelimit-remaining", String(remaining));
  setResponseHeader(event, "x-ratelimit-reset", String(Math.ceil(bucket.resetAt / 1000)));

  if (bucket.count > limit) {
    const retryAfter = Math.max(Math.ceil((bucket.resetAt - now) / 1000), 1);
    // retry-after 在 H3 的头部类型表里是数值型，此处直接传数字
    setResponseHeader(event, "retry-after", retryAfter);
    throw createError({
      statusCode: 429,
      message: `操作过于频繁，请 ${retryAfter} 秒后再试`,
    });
  }

  return { remaining, resetAt: bucket.resetAt };
}

/** 仅供测试使用：清空计数 */
export function resetRateLimits(): void {
  buckets.clear();
}
