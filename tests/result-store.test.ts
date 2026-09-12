import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  clearLastResult,
  clearResultRecords,
  dimensionDeltas,
  getLastResult,
  getResultRecord,
  listResultRecords,
  migrateLegacyResultRecords,
  recordsForTest,
  removeResultRecord,
  resultRecordKey,
  saveResultRecord,
  testIdFromRecordKey,
  updateResultRecord,
} from "../app/utils/result-store";

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
let session: MemoryStorage;

beforeEach(() => {
  local = new MemoryStorage();
  session = new MemoryStorage();
  (globalThis as any).window = { localStorage: local, sessionStorage: session };
  (globalThis as any).sessionStorage = session;
});

afterEach(() => {
  delete (globalThis as any).window;
  delete (globalThis as any).sessionStorage;
});

const makeResult = (testId: string, timestamp: string, extra: Record<string, any> = {}) => ({
  success: true,
  testId,
  testTitle: testId,
  totalScore: 10,
  maxScore: 30,
  level: "轻度",
  timestamp,
  ...extra,
});

describe("本机测评存档（result-store）", () => {
  it("每次测评写一条独立记录，不再互相覆盖", () => {
    const k1 = saveResultRecord(makeResult("phq9", "2026-01-01T10:00:00.000Z"));
    const k2 = saveResultRecord(makeResult("phq9", "2026-02-01T10:00:00.000Z"));
    expect(k1).not.toBe(k2);

    const records = recordsForTest("phq9");
    expect(records).toHaveLength(2);
    // 时间倒序：最新在前
    expect(records[0]!.result.timestamp).toBe("2026-02-01T10:00:00.000Z");
    expect(records[1]!.result.timestamp).toBe("2026-01-01T10:00:00.000Z");
    // 原实现把两条都写进同一个 sessionStorage 键，第二次会覆盖第一次
    expect(listResultRecords()).toHaveLength(2);
  });

  it("记录键可解析回 testId，且保留 resultKey / savedAt 便于定位", () => {
    const key = saveResultRecord(makeResult("epq-rsc", "2026-01-01T10:00:00.000Z"))!;
    expect(key).toMatch(/^test_epq-rsc_result_\d+$/);
    expect(testIdFromRecordKey(key)).toBe("epq-rsc");
    expect(testIdFromRecordKey("last_test_result")).toBeNull();

    const record = getResultRecord(key);
    expect(record.resultKey).toBe(key);
    expect(record.savedAt).toBeTruthy();
  });

  it("「最近一次结果」指向最新一条，并在删除后回退或清空", () => {
    saveResultRecord(makeResult("gad7", "2026-01-01T10:00:00.000Z"));
    const latestKey = saveResultRecord(makeResult("gad7", "2026-02-01T10:00:00.000Z"))!;
    expect(getLastResult().timestamp).toBe("2026-02-01T10:00:00.000Z");

    // 删除最新一条：指针回退到仍存在的那条，而不是留下悬空引用
    removeResultRecord(latestKey);
    expect(getLastResult().timestamp).toBe("2026-01-01T10:00:00.000Z");

    // 删完最后一条：指针一并清除，首页卡片不会继续展示已删除的结果
    removeResultRecord(recordsForTest("gad7")[0]!.key);
    expect(getLastResult()).toBeNull();
    expect(listResultRecords()).toHaveLength(0);
  });

  it("备注就地写回，不额外产生一条记录", () => {
    const key = saveResultRecord(makeResult("sds", "2026-01-01T10:00:00.000Z"))!;
    updateResultRecord(key, makeResult("sds", "2026-01-01T10:00:00.000Z", { note: "最近加班较多" }));

    expect(recordsForTest("sds")).toHaveLength(1);
    expect(getResultRecord(key).note).toBe("最近加班较多");
    expect(getLastResult().note).toBe("最近加班较多");
  });

  it("记录键失效时回退为新建，不静默丢数据", () => {
    const key = updateResultRecord("test_sds_result_999", makeResult("sds", "2026-01-01T10:00:00.000Z"));
    expect(key).not.toBe("test_sds_result_999");
    expect(recordsForTest("sds")).toHaveLength(1);
    expect(updateResultRecord(null, makeResult("sds", "2026-03-01T10:00:00.000Z"))).toBeTruthy();
    expect(recordsForTest("sds")).toHaveLength(2);
  });

  it("旧版 sessionStorage 记录迁移到本机存档，且不重复计数", () => {
    session.setItem("test_mbti_result", JSON.stringify(makeResult("mbti", "2025-12-01T10:00:00.000Z")));
    session.setItem("test_phq9_result", JSON.stringify(makeResult("phq9", "2025-12-02T10:00:00.000Z")));
    session.setItem("last_test_result", JSON.stringify(makeResult("phq9", "2025-12-02T10:00:00.000Z")));
    // 进度键不该被迁移
    session.setItem("test_phq9_answers", JSON.stringify({ 1: 2 }));

    expect(migrateLegacyResultRecords()).toBe(2);
    const records = listResultRecords();
    expect(records).toHaveLength(2);
    // 迁移保留原始时间戳，历史排序不因迁移而错乱
    expect(records[0]!.result.timestamp).toBe("2025-12-02T10:00:00.000Z");
    expect(records[1]!.result.timestamp).toBe("2025-12-01T10:00:00.000Z");
    // 旧键已清理，且进度键不受影响
    expect(session.getItem("test_mbti_result")).toBeNull();
    expect(session.getItem("last_test_result")).toBeNull();
    expect(session.getItem("test_phq9_answers")).toBe("{\"1\":2}");

    // 再次迁移不应产生重复记录（幂等）
    expect(migrateLegacyResultRecords()).toBe(0);
    expect(listResultRecords()).toHaveLength(2);
  });

  it("清空全部记录同时清掉指针", () => {
    saveResultRecord(makeResult("a", "2026-01-01T10:00:00.000Z"));
    saveResultRecord(makeResult("b", "2026-01-02T10:00:00.000Z"));
    expect(clearResultRecords()).toBe(2);
    expect(listResultRecords()).toHaveLength(0);
    expect(getLastResult()).toBeNull();

    saveResultRecord(makeResult("c", "2026-01-03T10:00:00.000Z"));
    clearLastResult();
    expect(getLastResult()).toBeNull();
    expect(listResultRecords()).toHaveLength(1);
  });

  it("存储不可用（隐私模式 / 无 window）时不抛错", () => {
    delete (globalThis as any).window;
    expect(saveResultRecord(makeResult("x", "2026-01-01T10:00:00.000Z"))).toBeNull();
    expect(listResultRecords()).toEqual([]);
    expect(getLastResult()).toBeNull();
    expect(clearResultRecords()).toBe(0);
    expect(migrateLegacyResultRecords()).toBe(0);
    expect(resultRecordKey("x", 1)).toBe("test_x_result_1");
  });

  it("维度对比同时支持数组与多维自评的对象形态", () => {
    const arrayShape = {
      dimensionScores: [
        { name: "情绪低落", value: 1.2 },
        { name: "兴趣减退", value: 0.4 },
      ],
    };
    const nextArrayShape = {
      dimensionScores: [
        { name: "情绪低落", value: 0.7 },
        { name: "兴趣减退", value: 0.9 },
      ],
    };
    const deltas = dimensionDeltas(arrayShape, nextArrayShape);
    expect(deltas.map((d) => d.label)).toEqual(["情绪低落", "兴趣减退"]);
    expect(deltas[0]!.delta).toBe(-0.5);
    expect(deltas[1]!.delta).toBe(0.5);

    // 多维自评量表：{ type: "multidim", <trait>: { name, score, max } }
    const multidimShape = {
      dimensionScores: { type: "multidim", low_mood: { name: "情绪低落", score: -0.5, max: 1 } },
    };
    const nextMultidimShape = {
      dimensionScores: { type: "multidim", low_mood: { name: "情绪低落", score: 0.25, max: 1 } },
    };
    const mdDeltas = dimensionDeltas(multidimShape, nextMultidimShape);
    expect(mdDeltas).toHaveLength(1);
    expect(mdDeltas[0]!.trait).toBe("low_mood");
    expect(mdDeltas[0]!.delta).toBe(0.75);
    // type 标记不是维度，不应出现在对比里
    expect(mdDeltas.some((d) => d.trait === "type")).toBe(false);

    // 维度集合不同（不同模式 / 不同量表）时只比对交集，不编造数据
    const unrelated = { dimensionScores: [{ name: "完全不同的维度", value: 1 }] };
    expect(dimensionDeltas(arrayShape, unrelated)).toEqual([]);
    expect(dimensionDeltas(null, null)).toEqual([]);
  });
});
