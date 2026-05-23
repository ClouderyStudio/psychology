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
  { id: 1, text: '在朋友聚会或小组活动中，如果大家都沉默，我通常愿意先开口带动气氛', dimension: 'EI', reverse: false, questionType: 'scenario' },
  { id: 2, text: '参加大型聚会后我感到精力充沛', dimension: 'EI', reverse: false },
  { id: 3, text: '如果一个任务可以选择独自完成或和几个人协作，我通常会选择一起推进', dimension: 'EI', reverse: false, questionType: 'scenario' },
  { id: 4, text: '我很容易和陌生人交谈', dimension: 'EI', reverse: false },
  { id: 5, text: '周末有一个认识新朋友的活动时，只要状态允许，我通常会愿意去看看', dimension: 'EI', reverse: false, questionType: 'scenario' },
  { id: 6, text: '我说话时喜欢边想边说', dimension: 'EI', reverse: false },
  { id: 7, text: '我有广泛的社交圈子', dimension: 'EI', reverse: false },
  { id: 8, text: '我喜欢热闹的环境', dimension: 'EI', reverse: false },
  { id: 9, text: '连续参加几场社交活动后，我通常需要独处一会儿才能恢复状态', dimension: 'EI', reverse: true, questionType: 'scenario' },
  { id: 10, text: '我更喜欢小范围的深入交流', dimension: 'EI', reverse: true },
  { id: 11, text: '在多人聊天时，如果话题推进很快，我常会先听一阵再表达观点', dimension: 'EI', reverse: true, questionType: 'scenario' },
  { id: 12, text: '我更喜欢一个人工作', dimension: 'EI', reverse: true },
  { id: 13, text: '我觉得独处很享受', dimension: 'EI', reverse: true },
  { id: 14, text: '我更喜欢和少数知己相处', dimension: 'EI', reverse: true },
  { id: 15, text: '被突然问到复杂问题时，我更希望先想几秒钟再回答', dimension: 'EI', reverse: true, questionType: 'scenario' },
  { id: 16, text: '我觉得社交活动很消耗精力', dimension: 'EI', reverse: true },
  { id: 17, text: '到了一个新环境后，我通常会主动认识身边的人或加入正在进行的交流', dimension: 'EI', reverse: false, questionType: 'scenario' },
  { id: 18, text: '我喜欢认识新朋友', dimension: 'EI', reverse: false },
  { id: 19, text: '在聚会中我总是很活跃', dimension: 'EI', reverse: false },
  { id: 20, text: '我更喜欢做而不是说', dimension: 'EI', reverse: true },
  { id: 21, text: '我喜欢表达自己的想法', dimension: 'EI', reverse: false },
  { id: 22, text: '我享受安静的时光', dimension: 'EI', reverse: true },
  { id: 23, text: '我乐于助人解决问题', dimension: 'EI', reverse: false },
  { id: 24, text: '我更关注自己的内心世界', dimension: 'EI', reverse: true },
  
  // ========== S/N 维度 (实感/直觉) - 共 23 题 ==========
  { id: 25, text: '听到一个新计划时，我会先问清楚具体步骤、时间和可验证的信息', dimension: 'SN', reverse: false, questionType: 'scenario' },
  { id: 26, text: '我相信眼见为实', dimension: 'SN', reverse: false },
  { id: 27, text: '学习新东西时，我更喜欢先看到可操作的例子和实际用途', dimension: 'SN', reverse: false, questionType: 'scenario' },
  { id: 28, text: '我关注当下和现实', dimension: 'SN', reverse: false },
  { id: 29, text: '我喜欢按部就班的方式', dimension: 'SN', reverse: false },
  { id: 30, text: '我重视经验和传统', dimension: 'SN', reverse: false },
  { id: 31, text: '接到任务时，如果要求比较模糊，我会希望对方补充明确标准和细节', dimension: 'SN', reverse: false, questionType: 'scenario' },
  { id: 32, text: '我擅长记忆事实', dimension: 'SN', reverse: false },
  { id: 33, text: '我喜欢稳定的环境', dimension: 'SN', reverse: false },
  { id: 34, text: '我相信已经验证的方法', dimension: 'SN', reverse: false },
  { id: 35, text: '看到一个普通现象时，我常会忍不住想它未来可能发展成什么样', dimension: 'SN', reverse: true, questionType: 'scenario' },
  { id: 36, text: '我信任自己的直觉', dimension: 'SN', reverse: true },
  { id: 37, text: '我喜欢抽象的概念', dimension: 'SN', reverse: true },
  { id: 38, text: '如果旧方法能用但不够有趣，我会想试试有没有新的做法', dimension: 'SN', reverse: true, questionType: 'scenario' },
  { id: 39, text: '我喜欢思考理论和模型', dimension: 'SN', reverse: true },
  { id: 40, text: '我关注整体和模式', dimension: 'SN', reverse: true },
  { id: 41, text: '我喜欢想象未来的场景', dimension: 'SN', reverse: true },
  { id: 42, text: '讨论方案时，我常能从别人没注意到的角度提出另一种可能', dimension: 'SN', reverse: true, questionType: 'scenario' },
  { id: 43, text: '我重视创意和灵感', dimension: 'SN', reverse: true },
  { id: 44, text: '我喜欢探索未知领域', dimension: 'SN', reverse: true },
  { id: 45, text: '我喜欢解决复杂问题', dimension: 'SN', reverse: true },
  { id: 46, text: '我相信自己的预感', dimension: 'SN', reverse: true },
  { id: 47, text: '当大家默认照旧处理时，我会想问一句“有没有完全不同的办法”', dimension: 'SN', reverse: true, questionType: 'scenario' },
  
  // ========== T/F 维度 (思考/情感) - 共 23 题 ==========
  { id: 48, text: '面对重要选择时，我会先列出利弊、证据和后果，再考虑感受', dimension: 'TF', reverse: false, questionType: 'scenario' },
  { id: 49, text: '我认为公平比仁慈更重要', dimension: 'TF', reverse: false },
  { id: 50, text: '如果发现方案里有明显漏洞，即使气氛不错，我也会倾向于直接指出来', dimension: 'TF', reverse: false, questionType: 'scenario' },
  { id: 51, text: '我更看重原则和标准', dimension: 'TF', reverse: false },
  { id: 52, text: '我善于分析问题', dimension: 'TF', reverse: false },
  { id: 53, text: '别人请我提建议时，我会认为指出不足比只说好听的话更有帮助', dimension: 'TF', reverse: false, questionType: 'scenario' },
  { id: 54, text: '我重视客观事实', dimension: 'TF', reverse: false },
  { id: 55, text: '我认为结果比过程重要', dimension: 'TF', reverse: false },
  { id: 56, text: '我擅长辩论和争论', dimension: 'TF', reverse: false },
  { id: 57, text: '我注重效率而非人情', dimension: 'TF', reverse: false },
  { id: 58, text: '我会把个人情感放在一边做决定', dimension: 'TF', reverse: false },
  { id: 59, text: '做决定前，如果会影响身边的人，我会先想他们可能有什么感受', dimension: 'TF', reverse: true, questionType: 'scenario' },
  { id: 60, text: '我认为人际关系很重要', dimension: 'TF', reverse: true },
  { id: 61, text: '需要指出别人问题时，我会先斟酌措辞，避免让对方难堪', dimension: 'TF', reverse: true, questionType: 'scenario' },
  { id: 62, text: '我重视和谐与融洽', dimension: 'TF', reverse: true },
  { id: 63, text: '我善于体察他人的情绪', dimension: 'TF', reverse: true },
  { id: 64, text: '我容易受他人情绪影响', dimension: 'TF', reverse: true },
  { id: 65, text: '我更看重善意而非正确', dimension: 'TF', reverse: true },
  { id: 66, text: '讨论开始变得尖锐时，我通常会尝试缓和气氛或换一种说法', dimension: 'TF', reverse: true, questionType: 'scenario' },
  { id: 67, text: '我重视团队和谐', dimension: 'TF', reverse: true },
  { id: 68, text: '团队要做取舍时，我会特别在意这个决定会不会让某些人被忽略', dimension: 'TF', reverse: true, questionType: 'scenario' },
  { id: 69, text: '我乐于帮助他人', dimension: 'TF', reverse: true },
  { id: 70, text: '我重视情感连接', dimension: 'TF', reverse: true },
  
  // ========== J/P 维度 (判断/感知) - 共 23 题 ==========
  { id: 71, text: '一周开始前，我通常会先想好主要安排和要完成的事情', dimension: 'JP', reverse: false, questionType: 'scenario' },
  { id: 72, text: '遇到重要事项时，我会提前订时间、查资料或准备备用方案', dimension: 'JP', reverse: false, questionType: 'scenario' },
  { id: 73, text: '我喜欢清单和时间表', dimension: 'JP', reverse: false },
  { id: 74, text: '如果选项太多，我会希望尽快确定一个方向，而不是一直悬着', dimension: 'JP', reverse: false, questionType: 'scenario' },
  { id: 75, text: '我做事有条不紊', dimension: 'JP', reverse: false },
  { id: 76, text: '我喜欢稳定的节奏', dimension: 'JP', reverse: false },
  { id: 77, text: '我会按时完成任务', dimension: 'JP', reverse: false },
  { id: 78, text: '我喜欢把事情做完', dimension: 'JP', reverse: false },
  { id: 79, text: '我重视效率和结果', dimension: 'JP', reverse: false },
  { id: 80, text: '我喜欢可预测的事情', dimension: 'JP', reverse: false },
  { id: 81, text: '我对截止日期很重视', dimension: 'JP', reverse: false },
  { id: 82, text: '面对还不确定的事情，我宁愿先保留几个选择，不急着定死', dimension: 'JP', reverse: true, questionType: 'scenario' },
  { id: 83, text: '我喜欢随性自由的生活方式', dimension: 'JP', reverse: true },
  { id: 84, text: '临时出现有趣机会时，即使原计划要调整，我也愿意即兴跟上', dimension: 'JP', reverse: true, questionType: 'scenario' },
  { id: 85, text: '我讨厌被计划束缚', dimension: 'JP', reverse: true },
  { id: 86, text: '我会拖延到最后一刻', dimension: 'JP', reverse: true },
  { id: 87, text: '我喜欢灵活的安排', dimension: 'JP', reverse: true },
  { id: 88, text: '执行计划过程中，如果现场情况变化，我会自然地边走边调整', dimension: 'JP', reverse: true, questionType: 'scenario' },
  { id: 89, text: '我喜欢探索各种可能', dimension: 'JP', reverse: true },
  { id: 90, text: '我适应能力强', dimension: 'JP', reverse: true },
  { id: 91, text: '我会同时进行多个项目', dimension: 'JP', reverse: true },
  { id: 92, text: '有截止日期时，我常在最后阶段进入高效冲刺状态', dimension: 'JP', reverse: true, questionType: 'scenario' },
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
