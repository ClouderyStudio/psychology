import { defineStore } from 'pinia'

interface AnswerState {
  answers: Record<number, number>
  currentTestId: string | null
  result: any | null
}

export const useAnswerStore = defineStore('answer', {
  state: (): AnswerState => ({
    answers: {},
    currentTestId: null,
    result: null
  }),
  
  actions: {
    setAnswer(questionId: number, value: number) {
      this.answers[questionId] = value
      // 保存到 sessionStorage
      this.saveToSession()
    },
    
    clearAnswers() {
      this.answers = {}
      this.currentTestId = null
      this.result = null
      this.clearSession()
    },
    
    setCurrentTest(testId: string) {
      // 如果切换了不同的测评，清空之前的答案
      if (this.currentTestId !== testId) {
        this.answers = {}
        this.result = null
      }
      this.currentTestId = testId
      // 从 sessionStorage 恢复
      this.loadFromSession()
    },
    
    setResult(result: any) {
      this.result = result
    },
    
    getResult() {
      return this.result
    },
    
    getAnswers() {
      return this.answers
    },
    
    // 保存到 sessionStorage
    saveToSession() {
      if (typeof window !== 'undefined' && this.currentTestId) {
        try {
          sessionStorage.setItem(`test_${this.currentTestId}_answers`, JSON.stringify(this.answers))
        } catch (e) {
          console.error('保存进度失败', e)
        }
      }
    },
    
    // 从 sessionStorage 加载
    loadFromSession() {
      if (typeof window !== 'undefined' && this.currentTestId) {
        try {
          const saved = sessionStorage.getItem(`test_${this.currentTestId}_answers`)
          if (saved) {
            this.answers = JSON.parse(saved)
          }
        } catch (e) {
          console.error('加载进度失败', e)
        }
      }
    },
    
    // 清除 sessionStorage
    clearSession() {
      if (typeof window !== 'undefined' && this.currentTestId) {
        try {
          sessionStorage.removeItem(`test_${this.currentTestId}_answers`)
        } catch (e) {
          console.error('清除进度失败', e)
        }
      }
    },
    
    // 检查是否有未完成的测评
    hasUnfinishedTest(testId: string): boolean {
      if (typeof window === 'undefined') return false
      try {
        const saved = sessionStorage.getItem(`test_${testId}_answers`)
        if (saved) {
          const answers = JSON.parse(saved)
          return Object.keys(answers).length > 0
        }
      } catch (e) {
        console.error('检查进度失败', e)
      }
      return false
    }
  }
})