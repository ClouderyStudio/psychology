/**
 * 提交结算的幂等缓存。
 *
 * 客户端已有「提交中」锁，但锁只在此刻的会话内有效：网络慢时的重试、双击、
 * 或刷新页面后再次提交，都会让同一份作答被结算多次，在本机存档里多出重复记录。
 * 这里按幂等键缓存短期结果，重复提交直接回放。
 *
 * 进程内实现，多实例部署时应换成共享存储（Redis 等）。
 */

const TTL_MS = 10 * 60 * 1000;
const MAX_ENTRIES = 2000;

const cache = new Map<string, { at: number; payload: any }>();

/** 读取缓存；已过期返回 null 并顺手清理 */
export function readIdempotent(key: string | null): any | null {
  if (!key) return null;
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > TTL_MS) {
    cache.delete(key);
    return null;
  }
  return hit.payload;
}

export function writeIdempotent(key: string | null, payload: any): void {
  if (!key) return;
  if (cache.size >= MAX_ENTRIES) {
    const now = Date.now();
    for (const [k, v] of cache) {
      if (now - v.at > TTL_MS) cache.delete(k);
    }
    // 仍然超限时按插入顺序淘汰最早的一批（Map 保持插入顺序）
    while (cache.size >= MAX_ENTRIES) {
      const oldest = cache.keys().next();
      if (oldest.done) break;
      cache.delete(oldest.value);
    }
  }
  cache.set(key, { at: Date.now(), payload });
}

/** 组合幂等键：客户端标识 + 量表 + 客户端提交 id */
export function idempotencyKey(
  clientId: string,
  testId: string,
  submissionId: unknown,
): string | null {
  if (typeof submissionId !== "string") return null;
  const id = submissionId.trim();
  if (id.length === 0 || id.length > 128) return null;
  return `${clientId}:${testId}:${id}`;
}

/** 仅供测试使用 */
export function resetIdempotencyCache(): void {
  cache.clear();
}
