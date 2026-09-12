import { defineStore } from "pinia";
import {
  clearLastResult,
  getLastResult,
  migrateLegacyResultRecords,
  saveResultRecord,
  updateResultRecord,
} from "../utils/result-store";

interface AnswerState {
  answers: Record<number, number>;
  currentTestId: string | null;
  result: any | null;
  lastResult: any | null; // 最近一次测评结果
  /** 当前 result 对应的本机存档键（历史记录里的某一条） */
  currentResultKey: string | null;
}

export const useAnswerStore = defineStore("answer", {
  state: (): AnswerState => ({
    answers: {},
    currentTestId: null,
    result: null,
    lastResult: null,
    currentResultKey: null,
  }),

  actions: {
    // 整体替换答案集并保存一次（单一数据源，删除/新增保持一致）
    setAnswers(newAnswers: Record<number, number>) {
      this.answers = newAnswers;
      this.saveToSession();
    },

    clearAnswers() {
      this.answers = {};
      this.currentTestId = null;
      this.result = null;
      // 不清除 lastResult
    },

    setCurrentTest(testId: string) {
      if (this.currentTestId !== testId) {
        this.answers = {};
        this.result = null;
      }
      this.currentTestId = testId;
      this.loadFromSession();
    },

    /**
     * 保存一次新的测评结果：写入本机存档（localStorage，一次测评一条记录），
     * 供首页卡片使用的「最近一次结果」同步更新。
     * 返回本次记录键，失败时为 null。
     */
    setResult(result: any): string | null {
      this.result = result;
      this.lastResult = result;
      this.currentResultKey = result ? saveResultRecord(result) : null;
      return this.currentResultKey;
    },

    /**
     * 打开一条已有记录（历史页「查看」）：只装载、不新建记录，
     * 否则每次翻看历史都会多出一条重复记录。
     */
    loadResultRecord(result: any, key: string | null) {
      this.result = result;
      this.currentResultKey = key;
    },

    getCurrentResultKey() {
      return this.currentResultKey;
    },

    /** 备注就地写回当前记录；没有记录键时（异常路径）退化为新建 */
    updateResultNote(note: string) {
      if (!this.result?.testId) return null;

      const updatedResult = {
        ...this.result,
        note: note.slice(0, 500),
        noteUpdatedAt: new Date().toISOString(),
      };
      this.result = updatedResult;
      this.lastResult = updatedResult;
      this.currentResultKey = updateResultRecord(
        this.currentResultKey,
        updatedResult,
      );
      return updatedResult;
    },

    getResult() {
      return this.result;
    },

    getLastResult() {
      if (this.lastResult) return this.lastResult;
      this.lastResult = getLastResult();
      return this.lastResult;
    },

    clearLastResult() {
      this.lastResult = null;
      this.currentResultKey = null;
      clearLastResult();
    },

    /**
     * 记录在存储层被改动（历史页删除 / 清空）后丢弃内存缓存，
     * 避免首页卡片继续展示已删除的结果。
     */
    clearResultCache() {
      this.result = null;
      this.lastResult = null;
      this.currentResultKey = null;
    },

    getAnswers() {
      return this.answers;
    },

    saveToSession() {
      if (typeof window !== "undefined" && this.currentTestId) {
        try {
          if (Object.keys(this.answers).length > 0) {
            sessionStorage.setItem(
              `test_${this.currentTestId}_answers`,
              JSON.stringify(this.answers),
            );
          } else {
            sessionStorage.removeItem(`test_${this.currentTestId}_answers`);
          }
        } catch (e) {
          console.error("保存进度失败", e);
        }
      }
    },

    /** 一次性把旧版本存在 sessionStorage 里的结果搬进本机存档 */
    migrateLegacyResults() {
      return migrateLegacyResultRecords();
    },

    loadFromSession() {
      if (typeof window !== "undefined" && this.currentTestId) {
        try {
          const saved = sessionStorage.getItem(
            `test_${this.currentTestId}_answers`,
          );
          if (saved) {
            this.answers = JSON.parse(saved);
          } else {
            this.answers = {};
          }
        } catch (e) {
          console.error("加载进度失败", e);
          this.answers = {};
        }
      }
    },
  },
});
