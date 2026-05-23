export interface MBTIQuestion {
  id: number
  text: string
  dimension: 'EI' | 'SN' | 'TF' | 'JP'
  reverse: boolean // true 表示反向计分
  layer?: 'inner' | 'outer'
  questionType?: 'baseline' | 'scenario' | 'daily'
}

// MBTI 109 道题目
export const mbtiQuestions: MBTIQuestion[] = [
  // ========== E/I 维度 (外向/内向) - 共 24 题 ==========
  { id: 1, text: '我喜欢成为人群中的焦点', dimension: 'EI', reverse: false },
  { id: 2, text: '参加大型聚会后我感到精力充沛', dimension: 'EI', reverse: false },
  { id: 3, text: '我喜欢在团队中工作而不是单独工作', dimension: 'EI', reverse: false },
  { id: 4, text: '我很容易和陌生人交谈', dimension: 'EI', reverse: false },
  { id: 5, text: '我喜欢参加社交活动', dimension: 'EI', reverse: false },
  { id: 6, text: '我说话时喜欢边想边说', dimension: 'EI', reverse: false },
  { id: 7, text: '我有广泛的社交圈子', dimension: 'EI', reverse: false },
  { id: 8, text: '我喜欢热闹的环境', dimension: 'EI', reverse: false },
  { id: 9, text: '我需要独处的时间来恢复精力', dimension: 'EI', reverse: true },
  { id: 10, text: '我更喜欢小范围的深入交流', dimension: 'EI', reverse: true },
  { id: 11, text: '在社交场合我倾向于倾听', dimension: 'EI', reverse: true },
  { id: 12, text: '我更喜欢一个人工作', dimension: 'EI', reverse: true },
  { id: 13, text: '我觉得独处很享受', dimension: 'EI', reverse: true },
  { id: 14, text: '我更喜欢和少数知己相处', dimension: 'EI', reverse: true },
  { id: 15, text: '我需要思考后再说话', dimension: 'EI', reverse: true },
  { id: 16, text: '我觉得社交活动很消耗精力', dimension: 'EI', reverse: true },
  { id: 17, text: '我主动与人交往', dimension: 'EI', reverse: false },
  { id: 18, text: '我喜欢认识新朋友', dimension: 'EI', reverse: false },
  { id: 19, text: '在聚会中我总是很活跃', dimension: 'EI', reverse: false },
  { id: 20, text: '我更喜欢做而不是说', dimension: 'EI', reverse: true },
  { id: 21, text: '我喜欢表达自己的想法', dimension: 'EI', reverse: false },
  { id: 22, text: '我享受安静的时光', dimension: 'EI', reverse: true },
  { id: 23, text: '我乐于助人解决问题', dimension: 'EI', reverse: false },
  { id: 24, text: '我更关注自己的内心世界', dimension: 'EI', reverse: true },
  
  // ========== S/N 维度 (实感/直觉) - 共 23 题 ==========
  { id: 25, text: '我注重事实和细节', dimension: 'SN', reverse: false },
  { id: 26, text: '我相信眼见为实', dimension: 'SN', reverse: false },
  { id: 27, text: '我更喜欢实用的信息', dimension: 'SN', reverse: false },
  { id: 28, text: '我关注当下和现实', dimension: 'SN', reverse: false },
  { id: 29, text: '我喜欢按部就班的方式', dimension: 'SN', reverse: false },
  { id: 30, text: '我重视经验和传统', dimension: 'SN', reverse: false },
  { id: 31, text: '我喜欢具体明确的指示', dimension: 'SN', reverse: false },
  { id: 32, text: '我擅长记忆事实', dimension: 'SN', reverse: false },
  { id: 33, text: '我喜欢稳定的环境', dimension: 'SN', reverse: false },
  { id: 34, text: '我相信已经验证的方法', dimension: 'SN', reverse: false },
  { id: 35, text: '我喜欢思考未来的可能性', dimension: 'SN', reverse: true },
  { id: 36, text: '我信任自己的直觉', dimension: 'SN', reverse: true },
  { id: 37, text: '我喜欢抽象的概念', dimension: 'SN', reverse: true },
  { id: 38, text: '我喜欢创新和尝试新方法', dimension: 'SN', reverse: true },
  { id: 39, text: '我喜欢思考理论和模型', dimension: 'SN', reverse: true },
  { id: 40, text: '我关注整体和模式', dimension: 'SN', reverse: true },
  { id: 41, text: '我喜欢想象未来的场景', dimension: 'SN', reverse: true },
  { id: 42, text: '我善于发现新的可能性', dimension: 'SN', reverse: true },
  { id: 43, text: '我重视创意和灵感', dimension: 'SN', reverse: true },
  { id: 44, text: '我喜欢探索未知领域', dimension: 'SN', reverse: true },
  { id: 45, text: '我喜欢解决复杂问题', dimension: 'SN', reverse: true },
  { id: 46, text: '我相信自己的预感', dimension: 'SN', reverse: true },
  { id: 47, text: '我喜欢打破常规', dimension: 'SN', reverse: true },
  
  // ========== T/F 维度 (思考/情感) - 共 23 题 ==========
  { id: 48, text: '我做决定主要依靠逻辑', dimension: 'TF', reverse: false },
  { id: 49, text: '我认为公平比仁慈更重要', dimension: 'TF', reverse: false },
  { id: 50, text: '我会直接指出问题', dimension: 'TF', reverse: false },
  { id: 51, text: '我更看重原则和标准', dimension: 'TF', reverse: false },
  { id: 52, text: '我善于分析问题', dimension: 'TF', reverse: false },
  { id: 53, text: '批评是帮助改进的方式', dimension: 'TF', reverse: false },
  { id: 54, text: '我重视客观事实', dimension: 'TF', reverse: false },
  { id: 55, text: '我认为结果比过程重要', dimension: 'TF', reverse: false },
  { id: 56, text: '我擅长辩论和争论', dimension: 'TF', reverse: false },
  { id: 57, text: '我注重效率而非人情', dimension: 'TF', reverse: false },
  { id: 58, text: '我会把个人情感放在一边做决定', dimension: 'TF', reverse: false },
  { id: 59, text: '我关心他人的感受', dimension: 'TF', reverse: true },
  { id: 60, text: '我认为人际关系很重要', dimension: 'TF', reverse: true },
  { id: 61, text: '我会委婉地表达批评', dimension: 'TF', reverse: true },
  { id: 62, text: '我重视和谐与融洽', dimension: 'TF', reverse: true },
  { id: 63, text: '我善于体察他人的情绪', dimension: 'TF', reverse: true },
  { id: 64, text: '我容易受他人情绪影响', dimension: 'TF', reverse: true },
  { id: 65, text: '我更看重善意而非正确', dimension: 'TF', reverse: true },
  { id: 66, text: '我会避免冲突和争执', dimension: 'TF', reverse: true },
  { id: 67, text: '我重视团队和谐', dimension: 'TF', reverse: true },
  { id: 68, text: '我会考虑决定对大家的影响', dimension: 'TF', reverse: true },
  { id: 69, text: '我乐于帮助他人', dimension: 'TF', reverse: true },
  { id: 70, text: '我重视情感连接', dimension: 'TF', reverse: true },
  
  // ========== J/P 维度 (判断/感知) - 共 23 题 ==========
  { id: 71, text: '我喜欢有计划的生活', dimension: 'JP', reverse: false },
  { id: 72, text: '我会提前做安排', dimension: 'JP', reverse: false },
  { id: 73, text: '我喜欢清单和时间表', dimension: 'JP', reverse: false },
  { id: 74, text: '我喜欢尽快做决定', dimension: 'JP', reverse: false },
  { id: 75, text: '我做事有条不紊', dimension: 'JP', reverse: false },
  { id: 76, text: '我喜欢稳定的节奏', dimension: 'JP', reverse: false },
  { id: 77, text: '我会按时完成任务', dimension: 'JP', reverse: false },
  { id: 78, text: '我喜欢把事情做完', dimension: 'JP', reverse: false },
  { id: 79, text: '我重视效率和结果', dimension: 'JP', reverse: false },
  { id: 80, text: '我喜欢可预测的事情', dimension: 'JP', reverse: false },
  { id: 81, text: '我对截止日期很重视', dimension: 'JP', reverse: false },
  { id: 82, text: '我喜欢保持选择的开放', dimension: 'JP', reverse: true },
  { id: 83, text: '我喜欢随性自由的生活方式', dimension: 'JP', reverse: true },
  { id: 84, text: '我喜欢即兴发挥', dimension: 'JP', reverse: true },
  { id: 85, text: '我讨厌被计划束缚', dimension: 'JP', reverse: true },
  { id: 86, text: '我会拖延到最后一刻', dimension: 'JP', reverse: true },
  { id: 87, text: '我喜欢灵活的安排', dimension: 'JP', reverse: true },
  { id: 88, text: '我会根据情况做调整', dimension: 'JP', reverse: true },
  { id: 89, text: '我喜欢探索各种可能', dimension: 'JP', reverse: true },
  { id: 90, text: '我适应能力强', dimension: 'JP', reverse: true },
  { id: 91, text: '我会同时进行多个项目', dimension: 'JP', reverse: true },
  { id: 92, text: '我喜欢截止日期前的冲刺', dimension: 'JP', reverse: true },
  { id: 93, text: '我享受当下的体验', dimension: 'JP', reverse: true },

  // ========== 情境假设与日常问题：用于补充统计内在/外在性格 - 共 16 题 ==========
  { id: 94, text: '如果临时被安排在小组汇报中开场，我通常能迅速进入表达状态', dimension: 'EI', reverse: false, layer: 'outer', questionType: 'scenario' },
  { id: 95, text: '结束一天的事务后，我更想留出一段不被打扰的时间整理自己', dimension: 'EI', reverse: true, layer: 'inner', questionType: 'daily' },
  { id: 96, text: '如果朋友临时邀请我参加陌生人的聚会，我通常会先评估这是否消耗精力', dimension: 'EI', reverse: true, layer: 'outer', questionType: 'scenario' },
  { id: 97, text: '当想法还没完全成形时，说出来常会让我越讲越清楚', dimension: 'EI', reverse: false, layer: 'inner', questionType: 'daily' },
  { id: 98, text: '面对陌生城市出行，我会先确认路线、时间和具体地点', dimension: 'SN', reverse: false, layer: 'outer', questionType: 'scenario' },
  { id: 99, text: '我常在普通事件里联想到未来趋势、隐含意义或新的可能', dimension: 'SN', reverse: true, layer: 'inner', questionType: 'daily' },
  { id: 100, text: '做重要选择时，亲眼可见的数据和经验比灵感更让我安心', dimension: 'SN', reverse: false, layer: 'inner', questionType: 'scenario' },
  { id: 101, text: '日常聊天中，我喜欢提出一些跳出常规的可能性', dimension: 'SN', reverse: true, layer: 'outer', questionType: 'daily' },
  { id: 102, text: '团队意见冲突时，我会先厘清规则、责任和事实', dimension: 'TF', reverse: false, layer: 'outer', questionType: 'scenario' },
  { id: 103, text: '做决定后，我仍会反复感受这个选择是否照顾到了重要的人', dimension: 'TF', reverse: true, layer: 'inner', questionType: 'daily' },
  { id: 104, text: '需要给负面反馈时，我会优先考虑对方能否接受', dimension: 'TF', reverse: true, layer: 'outer', questionType: 'scenario' },
  { id: 105, text: '我习惯在心里把问题拆成原因、证据和结论', dimension: 'TF', reverse: false, layer: 'inner', questionType: 'daily' },
  { id: 106, text: '出门旅行前，我倾向于提前订好关键行程和备选方案', dimension: 'JP', reverse: false, layer: 'outer', questionType: 'scenario' },
  { id: 107, text: '即使手上有计划，我内心也希望保留临时改变的空间', dimension: 'JP', reverse: true, layer: 'inner', questionType: 'daily' },
  { id: 108, text: '如果计划突然变化，我通常会先观察新机会，而不是急着恢复原计划', dimension: 'JP', reverse: true, layer: 'outer', questionType: 'scenario' },
  { id: 109, text: '我会通过整理清单、日程或环境让自己心里更安定', dimension: 'JP', reverse: false, layer: 'inner', questionType: 'daily' }
]

// 选项配置
export const mbtiOptions = [
  { value: 0, label: '非常不同意' },
  { value: 1, label: '不同意' },
  { value: 2, label: '中立' },
  { value: 3, label: '同意' },
  { value: 4, label: '非常同意' }
]
