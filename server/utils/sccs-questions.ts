export interface SCCSQuestion {
  id: number
  text: string
  dimension: 'disharmony' | 'flexibility' | 'rigidity'
  reverse: boolean
}

// SCCS 题目数据 (35题)
export const sccsQuestions: SCCSQuestion[] = [
  // 维度1：自我与经验的不和谐 (16题) - 正向计分
  { id: 1, text: '我经常觉得自己的表现不如别人', dimension: 'disharmony', reverse: false },
  { id: 2, text: '有时候我会对自己产生怀疑', dimension: 'disharmony', reverse: false },
  { id: 3, text: '我觉得别人对我的看法和我对自己的看法不太一样', dimension: 'disharmony', reverse: false },
  { id: 4, text: '我经常为自己的决定感到后悔', dimension: 'disharmony', reverse: false },
  { id: 5, text: '我觉得自己不够了解自己', dimension: 'disharmony', reverse: false },
  { id: 6, text: '面对困难时，我常常不知道如何是好', dimension: 'disharmony', reverse: false },
  { id: 7, text: '我经常觉得内心很矛盾', dimension: 'disharmony', reverse: false },
  { id: 8, text: '我觉得自己的能力没有得到充分发挥', dimension: 'disharmony', reverse: false },
  { id: 9, text: '有时候我会做一些连自己都不理解的事情', dimension: 'disharmony', reverse: false },
  { id: 10, text: '我常常担心别人怎么看我', dimension: 'disharmony', reverse: false },
  { id: 11, text: '我觉得自己的情绪很难控制', dimension: 'disharmony', reverse: false },
  { id: 12, text: '有时候我觉得自己不是真正的自己', dimension: 'disharmony', reverse: false },
  { id: 13, text: '我对自己的评价经常改变', dimension: 'disharmony', reverse: false },
  { id: 14, text: '我觉得自己不够自信', dimension: 'disharmony', reverse: false },
  { id: 15, text: '很多时候我不确定自己真正想要什么', dimension: 'disharmony', reverse: false },
  { id: 16, text: '我对自己的某些方面感到不满意', dimension: 'disharmony', reverse: false },
  
  // 维度2：自我的灵活性 (12题) - 反向计分
  { id: 17, text: '即使情况变得很糟糕，我也能找到应对的办法', dimension: 'flexibility', reverse: true },
  { id: 18, text: '面对批评，我能够虚心接受并加以改进', dimension: 'flexibility', reverse: true },
  { id: 19, text: '当计划被打乱时，我能很快调整过来', dimension: 'flexibility', reverse: true },
  { id: 20, text: '我愿意尝试用不同的方法解决问题', dimension: 'flexibility', reverse: true },
  { id: 21, text: '遭遇失败后，我能从中吸取教训并继续前进', dimension: 'flexibility', reverse: true },
  { id: 22, text: '我能够理解与自己不同的观点', dimension: 'flexibility', reverse: true },
  { id: 23, text: '环境变化时，我能较快适应', dimension: 'flexibility', reverse: true },
  { id: 24, text: '面对压力时，我能找到放松的方式', dimension: 'flexibility', reverse: true },
  { id: 25, text: '我愿意改变自己来适应新的情况', dimension: 'flexibility', reverse: true },
  { id: 26, text: '遇到困难时，我会主动寻求帮助', dimension: 'flexibility', reverse: true },
  { id: 27, text: '我能够从多个角度看待问题', dimension: 'flexibility', reverse: true },
  { id: 28, text: '即使事情没有按预期发展，我也能保持平和心态', dimension: 'flexibility', reverse: true },
  
  // 维度3：自我的刻板性 (7题) - 正向计分
  { id: 29, text: '我一旦形成了对某事的看法就很难改变', dimension: 'rigidity', reverse: false },
  { id: 30, text: '我认为我的性格基本上是固定不变的', dimension: 'rigidity', reverse: false },
  { id: 31, text: '我很难接受与自己不同的意见', dimension: 'rigidity', reverse: false },
  { id: 32, text: '做事情时，我喜欢按习惯的方式来进行', dimension: 'rigidity', reverse: false },
  { id: 33, text: '我觉得改变自己是很困难的事', dimension: 'rigidity', reverse: false },
  { id: 34, text: '我倾向于用固定的标准看待周围的事物', dimension: 'rigidity', reverse: false },
  { id: 35, text: '我不太愿意尝试新的体验', dimension: 'rigidity', reverse: false }
]

// SCCS 选项
export const sccsOptions = [
  { value: 1, label: '完全不符合' },
  { value: 2, label: '比较不符合' },
  { value: 3, label: '不确定' },
  { value: 4, label: '比较符合' },
  { value: 5, label: '完全符合' }
]

// 维度信息
export const sccsDimensions = {
  disharmony: {
    name: '自我与经验的不和谐',
    icon: '🌊',
    short: '不和谐',
    color: 'var(--primary)'
  },
  flexibility: {
    name: '自我的灵活性',
    icon: '🌿',
    short: '灵活性',
    color: 'var(--special)'
  },
  rigidity: {
    name: '自我的刻板性',
    icon: '🪨',
    short: '刻板性',
    color: 'var(--personality)'
  }
}