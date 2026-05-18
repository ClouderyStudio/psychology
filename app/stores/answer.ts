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
      this.saveToSession()
    },
    
    clearAnswers() {
      this.answers = {}
      this.currentTestId = null
      this.result = null
      this.clearSession()
    },
    
    setCurrentTest(testId: string) {
      if (this.currentTestId !== testId) {
        this.answers = {}
        this.result = null
      }
      this.currentTestId = testId
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
    
    saveToSession() {
      if (typeof window !== 'undefined' && this.currentTestId) {
        try {
          sessionStorage.setItem(`test_${this.currentTestId}_answers`, JSON.stringify(this.answers))
        } catch (e) {
          console.error('保存进度失败', e)
        }
      }
    },
    
    loadFromSession() {
      if (typeof window !== 'undefined' && this.currentTestId) {
        try {
          const saved = sessionStorage.getItem(`test_${this.currentTestId}_answers`)
          if (saved) {
            this.answers = JSON.parse(saved)
          } else {
            this.answers = {}
          }
        } catch (e) {
          console.error('加载进度失败', e)
          this.answers = {}
        }
      }
    },
    
    clearSession() {
      if (typeof window !== 'undefined' && this.currentTestId) {
        try {
          sessionStorage.removeItem(`test_${this.currentTestId}_answers`)
        } catch (e) {
          console.error('清除进度失败', e)
        }
      }
    },
    
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