/**
 * 测评结果的本机存档。
 *
 * 原实现把结果写进 sessionStorage，键固定为 `test_<id>_result`：
 *   - sessionStorage 随标签页关闭即清空，用户第二天回来历史记录全没了；
 *   - 同一个量表第二次测评直接覆盖第一次，无法对比两次变化。
 *
 * 这里改为：结果存 localStorage，每次测评一条带时间戳的记录
 * （`test_<id>_result_<timestamp>`），并保留「最近一次结果」指针供首页卡片使用。
 * 答题进度仍然留在 sessionStorage——那是进行中的临时状态，本就不该跨会话保留。
 */

const LAST_RESULT_KEY = "last_test_result";
const RECORD_RE = /^test_(.+)_result_(\d+)$/;
const LEGACY_RE = /^test_(.+)_result$/;

/** 每个量表最多保留的记录数（按时间倒序裁剪） */
const MAX_PER_TEST = 20;
/** 全部量表合计最多保留的记录数，避免长期使用后撑爆 localStorage */
const MAX_TOTAL = 200;

export interface StoredResult {
  /** localStorage 键，用于定位 / 删除单条记录 */
  key: string;
  result: any;
}

function ls(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function resultRecordKey(testId: string, ts: number): string {
  return `test_${testId}_result_${ts}`;
}

/**
 * 生成一个尚未被占用的记录键。
 * 连续两次提交可能落在同一毫秒内，直接拼接时间戳会撞键并静默覆盖上一条，
 * 因此占用时逐毫秒后移。
 */
function uniqueResultKey(store: Storage, testId: string, ts: number): string {
  let at = ts;
  let key = resultRecordKey(testId, at);
  let guard = 0;
  while (store.getItem(key) && guard++ < 1000) {
    at += 1;
    key = resultRecordKey(testId, at);
  }
  return key;
}

/** 从记录键中解析出 testId（键格式见 resultRecordKey） */
export function testIdFromRecordKey(key: string): string | null {
  const m = key.match(RECORD_RE);
  return m ? m[1]! : null;
}

function stamp(): string {
  return new Date().toISOString();
}

function readRecord(store: Storage, key: string): any | null {
  try {
    const raw = store.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function writeRecord(store: Storage, key: string, result: any): void {
  store.setItem(key, JSON.stringify({ ...result, resultKey: key, savedAt: stamp() }));
}

/** 按时间倒序裁剪，超出的旧记录直接删除 */
function pruneRecords(store: Storage): void {
  const all: { key: string; testId: string; ts: number }[] = [];
  for (let i = 0; i < store.length; i++) {
    const key = store.key(i);
    const m = key?.match(RECORD_RE);
    if (key && m) all.push({ key, testId: m[1]!, ts: Number(m[2]) });
  }
  all.sort((a, b) => b.ts - a.ts);

  const drop: string[] = [];
  const seenPerTest = new Map<string, number>();
  all.forEach((rec, idx) => {
    const n = (seenPerTest.get(rec.testId) ?? 0) + 1;
    seenPerTest.set(rec.testId, n);
    if (n > MAX_PER_TEST || idx >= MAX_TOTAL) drop.push(rec.key);
  });
  drop.forEach((key) => store.removeItem(key));
}

/**
 * 保存一条新记录，并同步「最近一次结果」。
 * 返回记录键；存储不可用或写入失败时返回 null（例如隐私模式下配额为 0）。
 */
export function saveResultRecord(result: any): string | null {
  const store = ls();
  if (!store || !result?.testId) return null;

  const key = uniqueResultKey(store, result.testId, Date.now());
  const payload = { ...result, resultKey: key, savedAt: stamp() };
  try {
    writeRecord(store, key, result);
    store.setItem(LAST_RESULT_KEY, JSON.stringify(payload));
  } catch (e) {
    console.error("保存测评结果失败", e);
    return null;
  }
  try {
    pruneRecords(store);
  } catch (e) {
    console.error("清理旧记录失败", e);
  }
  return key;
}

/** 覆盖写入已有记录（备注更新等），不存在时回退为新建 */
export function updateResultRecord(key: string | null, result: any): string | null {
  const store = ls();
  if (!store || !result?.testId) return null;
  if (!key || !RECORD_RE.test(key) || !store.getItem(key)) {
    return saveResultRecord(result);
  }
  try {
    writeRecord(store, key, result);
    const last = readRecord(store, LAST_RESULT_KEY);
    if (last && last.testId === result.testId) {
      store.setItem(LAST_RESULT_KEY, JSON.stringify({ ...result, resultKey: key, savedAt: last.savedAt || stamp() }));
    }
  } catch (e) {
    console.error("更新测评结果失败", e);
    return null;
  }
  return key;
}

export function listResultRecords(): StoredResult[] {
  const store = ls();
  if (!store) return [];
  const out: StoredResult[] = [];
  for (let i = 0; i < store.length; i++) {
    const key = store.key(i);
    if (!key || !RECORD_RE.test(key)) continue;
    const result = readRecord(store, key);
    if (result?.testId) out.push({ key, result });
  }
  out.sort(
    (a, b) =>
      new Date(b.result?.timestamp || 0).getTime() - new Date(a.result?.timestamp || 0).getTime(),
  );
  return out;
}

/** 某个量表的历史记录（时间倒序） */
export function recordsForTest(testId: string): StoredResult[] {
  return listResultRecords().filter((r) => r.result.testId === testId);
}

export function getResultRecord(key: string): any | null {
  const store = ls();
  if (!store || !RECORD_RE.test(key)) return null;
  return readRecord(store, key);
}

export function getLastResult(): any | null {
  const store = ls();
  if (!store) return null;
  return readRecord(store, LAST_RESULT_KEY);
}

export function clearLastResult(): void {
  ls()?.removeItem(LAST_RESULT_KEY);
}

export function removeResultRecord(key: string): void {
  const store = ls();
  if (!store) return;
  const result = readRecord(store, key);
  store.removeItem(key);
  // 若该记录正被「最近一次结果」引用，则回退到该量表剩余的最新一条，
  // 避免首页卡片继续展示一条已被删除的结果
  const last = readRecord(store, LAST_RESULT_KEY);
  if (result && last && last.testId === result.testId && last.resultKey === key) {
    const fallback = recordsForTest(result.testId)[0];
    if (fallback) {
      store.setItem(LAST_RESULT_KEY, JSON.stringify(fallback.result));
    } else {
      store.removeItem(LAST_RESULT_KEY);
    }
  }
}

/** 清空全部测评记录，返回删除条数 */
export function clearResultRecords(): number {
  const store = ls();
  if (!store) return 0;
  const keys = listResultRecords().map((r) => r.key);
  keys.forEach((key) => store.removeItem(key));
  store.removeItem(LAST_RESULT_KEY);
  return keys.length;
}

/**
 * 旧版本把结果存在 sessionStorage（每个量表一条、会被覆盖）。
 * 首次进入时迁移到 localStorage，避免升级后历史直接消失。
 * 返回迁移条数。
 */
export function migrateLegacyResultRecords(): number {
  if (typeof window === "undefined") return 0;
  const store = ls();
  if (!store) return 0;

  const legacy: { key: string; result: any }[] = [];
  try {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (!key || !LEGACY_RE.test(key)) continue;
      try {
        const result = JSON.parse(sessionStorage.getItem(key) || "null");
        if (result?.testId) legacy.push({ key, result });
      } catch {
        /* 单条解析失败不影响其余迁移 */
      }
    }
    // 「最近一次结果」也一并搬过来
    const lastRaw = sessionStorage.getItem(LAST_RESULT_KEY);
    if (lastRaw) {
      try {
        const last = JSON.parse(lastRaw);
        if (last?.testId && !legacy.some((l) => l.result.testId === last.testId)) {
          legacy.push({ key: "", result: last });
        }
      } catch {
        /* ignore */
      }
    }
  } catch (e) {
    console.error("读取旧版记录失败", e);
    return 0;
  }
  if (legacy.length === 0) return 0;

  let moved = 0;
  for (const item of legacy) {
    // 迁移时保留原始时间戳，历史排序不会因为迁移而错乱
    const ts = new Date(item.result.timestamp || Date.now()).getTime() || Date.now();
    serializeMigrated(item.result, ts);
    moved++;
  }
  try {
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const key = sessionStorage.key(i);
      if (key && (LEGACY_RE.test(key) || key === LAST_RESULT_KEY)) sessionStorage.removeItem(key);
    }
  } catch {
    /* ignore */
  }
  return moved;
}

function serializeMigrated(result: any, ts: number): void {
  const store = ls();
  if (!store) return;
  const key = uniqueResultKey(store, result.testId, ts);
  try {
    writeRecord(store, key, result);
    const last = getLastResult();
    if (!last || new Date(last.timestamp || 0).getTime() <= new Date(result.timestamp || 0).getTime()) {
      store.setItem(LAST_RESULT_KEY, JSON.stringify({ ...result, resultKey: key, savedAt: stamp() }));
    }
  } catch (e) {
    console.error("迁移旧版记录失败", e);
  }
}

/** 两份记录之间可直接比较的维度差值（仅对含维度分的量表有效） */
export interface DimensionDelta {
  trait: string;
  label: string;
  from: number;
  to: number;
  delta: number;
}

/**
 * dimensionScores 在各量表间有两种形态：数组（多数量表）与以特征为键的对象
 * （多维自评量表，含一个 type 标记）。这里统一成同一种结构再比对。
 */
function normalizeDimensions(result: any): Map<string, { label: string; value: number }> {
  const out = new Map<string, { label: string; value: number }>();
  const src = result?.dimensionScores;
  if (!src || typeof src !== "object") return out;

  if (Array.isArray(src)) {
    for (const d of src) {
      const key = String(d?.trait ?? d?.name ?? d?.label ?? "");
      if (!key) continue;
      out.set(key, {
        label: String(d?.name ?? d?.label ?? key),
        value: Number(d?.value ?? d?.score ?? 0),
      });
    }
    return out;
  }

  for (const [key, d] of Object.entries<any>(src)) {
    // 只保留"带数值分数的维度"：dimensionScores 里还混着数组（分档对照表）、
    // 布尔（安全标记）与纯文案对象（PHQ-9 的关键症状卡），它们不是可比较的维度，
    // 以前会被当成 value=0 的维度混进对比表。
    if (key === "type" || !d || typeof d !== "object" || Array.isArray(d)) continue;
    const raw = d.value ?? d.score ?? d.tScore ?? d.avg;
    if (raw === undefined || raw === null) continue;
    const value = Number(raw);
    if (!Number.isFinite(value)) continue;
    out.set(key, {
      label: String(d.name ?? d.label ?? key),
      value,
    });
  }
  return out;
}

export function dimensionDeltas(from: any, to: any): DimensionDelta[] {
  const prev = normalizeDimensions(from);
  const next = normalizeDimensions(to);
  const out: DimensionDelta[] = [];
  for (const [trait, cur] of next) {
    const before = prev.get(trait);
    if (!before) continue;
    out.push({
      trait,
      label: cur.label,
      from: before.value,
      to: cur.value,
      delta: Math.round((cur.value - before.value) * 100) / 100,
    });
  }
  return out;
}
