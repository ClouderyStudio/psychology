import { beforeEach, describe, expect, it } from "vitest";
import {
  cloudRecordToLocalResult,
  cloudSummary,
  localKeyForCloud,
  localSavedAtIso,
  planCloudSync,
  recordTimestamp,
  toUploadBody,
  type CloudResult,
  type LocalRecord,
} from "../app/utils/cloud-results";
import { importCloudRecord, markCloudRecord, getResultRecord } from "../app/utils/result-store";

/** 测试环境是 node，这里给一个最小的 Web Storage 实现 */
class MemoryStorage implements Storage {
  private map = new Map<string, string>();
  get length() {
    return this.map.size;
  }
  clear() {
    this.map.clear();
  }
  getItem(key: string) {
    return this.map.has(key) ? this.map.get(key)! : null;
  }
  key(index: number) {
    return [...this.map.keys()][index] ?? null;
  }
  removeItem(key: string) {
    this.map.delete(key);
  }
  setItem(key: string, value: string) {
    this.map.set(key, String(value));
  }
}

let local: MemoryStorage;

beforeEach(() => {
  local = new MemoryStorage();
  (globalThis as any).window = { localStorage: local, dispatchEvent: () => true };
});

const TS = 1759300000000; // 2026-10-01T09:46:40.000Z
const iso = (ms: number) => new Date(ms).toISOString();

const localRecord = (testId: string, ts: number, extra: Record<string, any> = {}): LocalRecord => ({
  key: `test_${testId}_result_${ts}`,
  result: { testId, testTitle: testId.toUpperCase(), timestamp: iso(ts), totalScore: 12, ...extra },
});

const cloudRecord = (over: Partial<CloudResult> = {}): CloudResult => ({
  id: "cloud-1",
  clientKey: null,
  testId: "phq9",
  testTitle: "PHQ-9",
  savedAt: iso(TS),
  updatedAt: iso(TS),
  payload: { testId: "phq9", totalScore: 12 },
  ...over,
});

describe("云端存档的纯转换逻辑（cloud-results）", () => {
  it("记录键里的时间戳可解析，非本机记录键返回 null", () => {
    expect(recordTimestamp(`test_phq9_result_${TS}`)).toBe(TS);
    expect(recordTimestamp("test_phq9_result")).toBeNull();
    expect(recordTimestamp("last_test_result")).toBeNull();
  });

  it("上传体以本机记录键为 clientKey，savedAt 取键里的时间戳", () => {
    const body = toUploadBody(`test_phq9_result_${TS}`, { testId: "phq9", testTitle: "PHQ-9" })!;
    expect(body.clientKey).toBe(`test_phq9_result_${TS}`);
    expect(body.testId).toBe("phq9");
    expect(body.testTitle).toBe("PHQ-9");
    expect(body.savedAt).toBe(iso(TS));
    expect(body.payload).toEqual({ testId: "phq9", testTitle: "PHQ-9" });
  });

  it("没有 testId 的记录不上传", () => {
    expect(toUploadBody(`test_x_result_${TS}`, {})).toBeNull();
    expect(toUploadBody(`test_x_result_${TS}`, { testId: "  " })).toBeNull();
  });

  it("savedAt 缺失时退回结果对象自带的 timestamp", () => {
    expect(localSavedAtIso("last_test_result", { timestamp: iso(TS) })).toBe(iso(TS));
    expect(localSavedAtIso("last_test_result", {})).toBeNull();
  });

  it("云端记录沿用合法 clientKey，服务端生成的键则按时间重造本机键", () => {
    expect(localKeyForCloud(cloudRecord({ clientKey: `test_phq9_result_${TS}` }))).toBe(
      `test_phq9_result_${TS}`,
    );
    expect(localKeyForCloud(cloudRecord({ clientKey: "phq9@2026-10-01T09:46:40.0000000Z" }))).toBe(
      `test_phq9_result_${TS}`,
    );
  });

  it("云端记录落回本机时保留 payload 并记下云端标识", () => {
    const result = cloudRecordToLocalResult(cloudRecord({ clientKey: `test_phq9_result_${TS}` }));
    expect(result.totalScore).toBe(12);
    expect(result.testId).toBe("phq9");
    expect(result.cloudId).toBe("cloud-1");
    expect(result.cloudKey).toBe(`test_phq9_result_${TS}`);
  });

  it("同步计划：本机独有 → 上传", () => {
    const plan = planCloudSync([localRecord("phq9", TS)], []);
    expect(plan.upload.map((u) => u.key)).toEqual([`test_phq9_result_${TS}`]);
    expect(plan.adopt).toEqual([]);
    expect(plan.download).toEqual([]);
  });

  it("同步计划：两端都有且本机更新 → 上传并补 cloudId", () => {
    const local = [localRecord("phq9", TS + 60000)];
    const cloud = [cloudRecord({ id: "c1", clientKey: `test_phq9_result_${TS + 60000}`, savedAt: iso(TS) })];
    const plan = planCloudSync(local, cloud);
    expect(plan.upload).toHaveLength(1);
    expect(plan.adopt).toEqual([{ key: `test_phq9_result_${TS + 60000}`, cloudId: "c1" }]);
    expect(plan.download).toEqual([]);
  });

  it("同步计划：云端更新 → 只补 cloudId，不上传", () => {
    const local = [localRecord("phq9", TS)];
    const cloud = [cloudRecord({ id: "c1", clientKey: `test_phq9_result_${TS}`, savedAt: iso(TS + 60000) })];
    const plan = planCloudSync(local, cloud);
    expect(plan.upload).toEqual([]);
    expect(plan.adopt).toEqual([{ key: `test_phq9_result_${TS}`, cloudId: "c1" }]);
  });

  it("同步计划：云端独有 → 下载，且不重复下载已补过 cloudId 的记录", () => {
    const cloud = [cloudRecord({ id: "c1", clientKey: `test_phq9_result_${TS}` })];
    const first = planCloudSync([], cloud);
    expect(first.download).toHaveLength(1);
    expect(first.download[0]!.key).toBe(`test_phq9_result_${TS}`);

    // 模拟「下载并补 cloudId」之后的第二次同步：应该什么都不用做
    const applied: LocalRecord = {
      key: first.download[0]!.key,
      result: first.download[0]!.result,
    };
    const second = planCloudSync([applied], cloud);
    expect(second.upload).toEqual([]);
    expect(second.adopt).toEqual([]);
    expect(second.download).toEqual([]);
  });

  it("同步计划：本机已完整同步（含 cloudId）时为空计划", () => {
    const key = `test_phq9_result_${TS}`;
    const plan = planCloudSync(
      [{ key, result: { testId: "phq9", cloudId: "c1" } }],
      [cloudRecord({ id: "c1", clientKey: key, savedAt: iso(TS) })],
    );
    expect(plan).toEqual({ upload: [], adopt: [], download: [] });
  });

  it("云端概览统计记录数与涉及的量表数", () => {
    const summary = cloudSummary([
      cloudRecord({ id: "a", testId: "phq9" }),
      cloudRecord({ id: "b", testId: "phq9" }),
      cloudRecord({ id: "c", testId: "mbti" }),
    ]);
    expect(summary).toEqual({ total: 3, tests: 2 });
  });
});

describe("本机存档接受云端记录（result-store 扩展）", () => {
  it("importCloudRecord 按给定键写入，并可补 cloudId", () => {
    const key = `test_gad7_result_${TS}`;
    const written = importCloudRecord(key, { testId: "gad7", totalScore: 5, cloudId: "c9" });
    expect(written).toBe(key);
    expect(getResultRecord(key).totalScore).toBe(5);
    expect(getResultRecord(key).cloudId).toBe("c9");
  });

  it("importCloudRecord 遇到非本机格式的键时另生成一个合法键", () => {
    const written = importCloudRecord("gad7@server-key", { testId: "gad7", totalScore: 3 });
    expect(written).toMatch(/^test_gad7_result_\d+$/);
    expect(getResultRecord(written!).totalScore).toBe(3);
  });

  it("markCloudRecord 补写云端 Id；键不存在或格式不合规时不动", () => {
    const key = `test_rses_result_${TS}`;
    importCloudRecord(key, { testId: "rses", totalScore: 20 });
    expect(markCloudRecord(key, "c42")).toBe(true);
    expect(getResultRecord(key).cloudId).toBe("c42");
    // 已是同一个 cloudId：无需写
    expect(markCloudRecord(key, "c42")).toBe(false);
    expect(markCloudRecord(`test_rses_result_${TS + 1}`, "c43")).toBe(false);
    expect(markCloudRecord("bad-key", "c44")).toBe(false);
  });

  it("importCloudRecord 不广播 result-saved（否则同步下来的记录会被再次上传）", () => {
    let events = 0;
    (globalThis as any).window = {
      localStorage: local,
      dispatchEvent: () => {
        events += 1;
        return true;
      },
    };
    importCloudRecord(`test_sds_result_${TS}`, { testId: "sds", totalScore: 40 });
    expect(events).toBe(0);
  });
});
