/**
 * 云端存档与本机存档之间的转换与同步规划（纯函数，无网络、无 localStorage）。
 *
 * 云端接口是 ClouderyApi 的 /exam/results（见该仓库 Controllers/Cloudery/ExamResultsController.cs）：
 * 一条记录 = 站点本机存档的整份 JSON（payload）+ 少量用于排序/去重的元数据。
 * 本机记录键（test_<id>_result_<毫秒时间戳>）直接当 clientKey 上传，
 * 因此「同一份记录」在两端始终同键，重复同步不会产生副本。
 *
 * 决策都在这里做完并单测（tests/cloud-results.test.ts），
 * app/composables/useCloudSync.ts 只负责按计划发请求、写本机存档。
 */

/** 云端返回的一条记录 */
export interface CloudResult {
  id: string;
  clientKey?: string | null;
  testId: string;
  testTitle?: string | null;
  savedAt?: string | null;
  updatedAt?: string | null;
  payload?: any;
}

/** 本机存档里的一条记录（与 result-store 的 StoredResult 结构一致） */
export interface LocalRecord {
  key: string;
  result: any;
}

/** 上传给云端的一条记录 */
export interface CloudUploadBody {
  clientKey: string;
  testId: string;
  testTitle?: string;
  savedAt?: string;
  payload: any;
}

export interface CloudSyncPlan {
  /** 需要上传（云端没有，或本机的这份更新） */
  upload: { key: string; body: CloudUploadBody }[];
  /** 两端都有，只需给本机记录补上 cloudId */
  adopt: { key: string; cloudId: string }[];
  /** 云端有、本机没有，需要写入本机存档 */
  download: { key: string; cloudId: string; result: any }[];
}

/** 与 result-store 的 RECORD_RE 保持一致 */
const RECORD_RE = /^test_(.+)_result_(\d+)$/;

/** 本机记录键里的毫秒时间戳（非该格式返回 null） */
export function recordTimestamp(key: string): number | null {
  const m = RECORD_RE.exec(key);
  if (!m) return null;
  const ts = Number(m[2]);
  return Number.isFinite(ts) ? ts : null;
}

/** 这条本机记录「什么时候存的」：键里的时间戳优先，其次结果对象自带的字段 */
export function localSavedAtIso(key: string, result?: any): string | null {
  const ts = recordTimestamp(key);
  if (ts !== null) return new Date(ts).toISOString();

  const raw = result?.savedAt || result?.timestamp;
  if (typeof raw === "string" && raw) {
    const parsed = Date.parse(raw);
    if (Number.isFinite(parsed)) return new Date(parsed).toISOString();
  }
  return null;
}

/** 本机记录 → 上传体；缺少 testId 无法归档，返回 null */
export function toUploadBody(key: string, result: any): CloudUploadBody | null {
  const testId = typeof result?.testId === "string" ? result.testId.trim() : "";
  if (!testId) return null;

  const savedAt = localSavedAtIso(key, result);
  const body: CloudUploadBody = { clientKey: key, testId, payload: result };
  if (typeof result?.testTitle === "string" && result.testTitle) body.testTitle = result.testTitle;
  if (savedAt) body.savedAt = savedAt;
  return body;
}

/** 云端记录落到本机时用哪个键：能用 clientKey 就沿用，保证两端同键 */
export function localKeyForCloud(cloud: CloudResult): string {
  if (cloud.clientKey && RECORD_RE.test(cloud.clientKey)) return cloud.clientKey;

  const parsed = Date.parse(String(cloud.savedAt || cloud.updatedAt || ""));
  const at = Number.isFinite(parsed) ? parsed : 0;
  return `test_${cloud.testId}_result_${at}`;
}

/** 云端记录 → 本机记录体：保留原始 payload，并记下云端 Id 与云端键 */
export function cloudRecordToLocalResult(cloud: CloudResult): any {
  const payload = cloud.payload && typeof cloud.payload === "object" ? cloud.payload : {};
  const result: any = { ...payload, testId: cloud.testId, cloudId: cloud.id };
  if (cloud.clientKey) result.cloudKey = cloud.clientKey;
  if (cloud.savedAt) result.cloudSavedAt = cloud.savedAt;
  return result;
}

/** 云端记录的「新旧」时间戳（毫秒） */
function cloudTime(cloud: CloudResult): number {
  return Date.parse(String(cloud.savedAt || cloud.updatedAt || ""));
}

/**
 * 生成本机 ⇄ 云端的同步计划。
 * 只读入两份列表，不做任何写入，因此可以放心重放（同步失败后重试结果一致）。
 */
export function planCloudSync(local: LocalRecord[], cloud: CloudResult[]): CloudSyncPlan {
  const plan: CloudSyncPlan = { upload: [], adopt: [], download: [] };

  const localByKey = new Map<string, LocalRecord>();
  const localByCloudId = new Map<string, LocalRecord>();
  for (const record of local) {
    localByKey.set(record.key, record);
    const cloudId = record.result?.cloudId;
    if (typeof cloudId === "string" && cloudId) localByCloudId.set(cloudId, record);
  }

  const cloudById = new Map<string, CloudResult>();
  const cloudByKey = new Map<string, CloudResult>();
  const cloudByCloudIdOfLocal = new Map<string, CloudResult>();
  for (const record of cloud) {
    cloudById.set(record.id, record);
    if (record.clientKey) cloudByKey.set(record.clientKey, record);
  }
  // 本机记录里记下的 cloudKey 是最后一次同步到的云端键（键被规范化过时可能与本机键不同）
  for (const record of local) {
    const cloudKey = record.result?.cloudKey;
    if (typeof cloudKey === "string" && cloudByKey.has(cloudKey)) {
      cloudByCloudIdOfLocal.set(record.key, cloudByKey.get(cloudKey)!);
    }
  }

  for (const record of local) {
    const body = toUploadBody(record.key, record.result);
    if (!body) continue;

    const remote =
      cloudByCloudIdOfLocal.get(record.key) ||
      cloudByKey.get(record.key) ||
      (typeof record.result?.cloudId === "string" ? cloudById.get(record.result.cloudId) : undefined);

    if (!remote) {
      plan.upload.push({ key: record.key, body });
      continue;
    }

    if (record.result?.cloudId !== remote.id) {
      plan.adopt.push({ key: record.key, cloudId: remote.id });
    }

    const localMs = recordTimestamp(record.key) ?? Date.parse(String(record.result?.savedAt || ""));
    const remoteMs = cloudTime(remote);
    if (Number.isFinite(localMs) && Number.isFinite(remoteMs) && localMs > remoteMs) {
      plan.upload.push({ key: record.key, body });
    }
  }

  for (const record of cloud) {
    const known =
      (record.clientKey ? localByKey.get(record.clientKey) : undefined) || localByCloudId.get(record.id);
    if (known) continue;
    plan.download.push({
      key: localKeyForCloud(record),
      cloudId: record.id,
      result: cloudRecordToLocalResult(record),
    });
  }

  return plan;
}

/** 云端记录的条数概览（账号页/历史页展示用） */
export function cloudSummary(cloud: CloudResult[]): { total: number; tests: number } {
  const tests = new Set<string>();
  for (const record of cloud) if (record?.testId) tests.add(record.testId);
  return { total: cloud.length, tests: tests.size };
}
