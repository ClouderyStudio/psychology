import { defineStore } from "pinia";

interface AnswerState {
  answers: Record<number, number>;
  currentTestId: string | null;
  result: any | null;
  lastResult: any | null; // 新增：最后一次测评结果
}

export const useAnswerStore = defineStore("answer", {
  state: (): AnswerState => ({
    answers: {},
    currentTestId: null,
    result: null,
    lastResult: null,
  }),

  actions: {
    setAnswer(questionId: number, value: number) {
      this.answers[questionId] = value;
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

    setResult(result: any) {
      this.result = result;
      // 保存为最后一次结果
      this.lastResult = result;
      this.saveLastResultToSession(result);

      // 保存到当前测评的结果
      if (typeof window !== "undefined" && result && result.testId) {
        try {
          sessionStorage.setItem(
            `test_${result.testId}_result`,
            JSON.stringify(result),
          );
        } catch (e) {
          console.error("保存测评结果失败", e);
        }
      }
    },

    getResult() {
      return this.result;
    },

    getLastResult() {
      // 优先从内存获取
      if (this.lastResult) {
        return this.lastResult;
      }
      // 尝试从 sessionStorage 加载
      if (typeof window !== "undefined") {
        try {
          const saved = sessionStorage.getItem("last_test_result");
          if (saved) {
            this.lastResult = JSON.parse(saved);
            return this.lastResult;
          }
        } catch (e) {
          console.error("加载最后结果失败", e);
        }
      }
      return null;
    },

    clearLastResult() {
      this.lastResult = null;
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("last_test_result");
      }
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

    saveLastResultToSession(result: any) {
      if (typeof window !== "undefined" && result) {
        try {
          sessionStorage.setItem("last_test_result", JSON.stringify(result));
        } catch (e) {
          console.error("保存最后结果失败", e);
        }
      }
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

    clearSession() {
      if (typeof window !== "undefined" && this.currentTestId) {
        try {
          sessionStorage.removeItem(`test_${this.currentTestId}_answers`);
        } catch (e) {
          console.error("清除进度失败", e);
        }
      }
    },

    hasUnfinishedTest(testId: string): boolean {
      if (typeof window === "undefined") return false;
      try {
        const saved = sessionStorage.getItem(`test_${testId}_answers`);
        if (saved) {
          const answers = JSON.parse(saved);
          return Object.keys(answers).length > 0;
        }
      } catch (e) {
        console.error("检查进度失败", e);
      }
      return false;
    },
  },
});
