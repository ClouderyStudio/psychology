export interface PsyAgeQuestion {
  id: number
  text: string
  type?: 'likert' | 'number'
  dimension: string | null
  reverse?: boolean
  min?: number
  max?: number
}

// 42 道 Likert 计分题（1-42）+ 末尾生理年龄（43，number 题，可不填）
export const psyAgeQuestions: PsyAgeQuestion[] = [
  { id: 1, dimension: 'cog', text: '面对一个全新的领域或技能，我的第一反应是兴奋地想试试，而不是担心自己学不会。' },
  { id: 2, dimension: 'cog', text: '我经常被一个有趣的问题或想法吸引，一钻进去就忘了时间。' },
  { id: 3, dimension: 'cog', reverse: true, text: '比起尝试新方法，我更习惯用自己熟悉的套路把事情做完。' },
  { id: 4, dimension: 'cog', text: '我时常追问"为什么"，对身边事物的原理保持好奇。' },
  { id: 5, dimension: 'emo', text: '遇到挫折时，我通常能较快平复情绪，并冷静思考下一步。' },
  { id: 6, dimension: 'emo', text: '别人的一句评价，很难让我长时间情绪低落或沾沾自喜。' },
  { id: 7, dimension: 'emo', text: '气头上说出去的话，冷静下来后我常常会后悔。' },
  { id: 8, dimension: 'emo', text: '我会先弄清楚自己为什么难过，再决定要不要表达出来。' },
  { id: 9, dimension: 'prd', text: '购物之前，我会认真比较和规划，很少一时冲动就下单。' },
  { id: 10, dimension: 'prd', text: '开口之前，我通常已经想清楚这话该不该说、该怎么说。' },
  { id: 11, dimension: 'prd', text: '面对诱人的机会，我会先想清楚风险，再决定要不要冲。' },
  { id: 12, dimension: 'prd', reverse: true, text: '我常常凭一时兴起就做出决定，过后又后悔。' },
  { id: 13, dimension: 'fut', text: '我会认真为几年后的人生做规划，而不是只盯着眼前。' },
  { id: 14, dimension: 'fut', text: '比起及时享乐，我更愿意把资源留给未来的自己。' },
  { id: 15, dimension: 'fut', reverse: true, text: '"活在当下、开心就好"是我的人生信条。' },
  { id: 16, dimension: 'fut', text: '想到未来的自己，我会因此调整现在的选择。' },
  { id: 17, dimension: 'soc', text: '在陌生的聚会里，我很快就能和别人熟络起来。' },
  { id: 18, dimension: 'soc', text: '我愿意去了解年轻人热衷的新事物（新梗、新文化、新音乐）。' },
  { id: 19, dimension: 'soc', text: '比起维系老朋友，我更愿意主动结识新的朋友。' },
  { id: 20, dimension: 'soc', reverse: true, text: '我觉得"年轻人玩的东西"跟我没什么关系。' },
  { id: 21, dimension: 'vit', text: '大多数日子里，我都觉得自己精力充沛、干劲十足。' },
  { id: 22, dimension: 'vit', text: '我喜欢需要活动身体的运动或娱乐（跑步、爬山、跳舞等）。' },
  { id: 23, dimension: 'vit', text: '只要休息一小会儿，我就能快速恢复、重新投入。' },
  { id: 24, dimension: 'vit', reverse: true, text: '我常常觉得疲惫，做什么都提不起劲。' },
  { id: 25, dimension: 'res', text: '答应了别人的事，我会想办法做到，即使需要额外付出。' },
  { id: 26, dimension: 'res', text: '我会提前整理好手头的事务，很少把事情拖到最后。' },
  { id: 27, dimension: 'res', text: '认定目标之后，我很少轻易改变主意。' },
  { id: 28, dimension: 'res', text: '在团队或集体里，我常常是主动承担起来的那个人。' },
  { id: 29, dimension: 'cog', text: '当听到一个颠覆我原有想法的观点时，我会好奇地听完，而不是立刻反驳。' },
  { id: 30, dimension: 'cog', text: '我的兴趣面很广，愿意涉猎和自己专业或工作无关的领域。' },
  { id: 31, dimension: 'emo', text: '难过的时候，我能分辨自己是在"处理情绪"，还是单纯"陷入情绪"。' },
  { id: 32, dimension: 'emo', text: '面对批评，我会先想想对方说得有没有道理，而不是立刻反驳。' },
  { id: 33, dimension: 'prd', text: '做重要决定之前，我会先列一列可能的风险和代价。' },
  { id: 34, dimension: 'prd', text: '我很少因为一时头脑发热就答应别人。' },
  { id: 35, dimension: 'fut', text: '关于十年后的自己想过怎样的生活，我心里有一个大致的方向。' },
  { id: 36, dimension: 'fut', text: '看到喜欢的东西，我会先想想它在未来的生活里还用不用得上。' },
  { id: 37, dimension: 'soc', text: '旅行或去新地方时，我更想自己去探索，而不是只跟着熟悉的安排走。' },
  { id: 38, dimension: 'soc', text: '身边朋友聊起我不了解的新话题时，我会想插一句"这是什么"，而不是假装没听到。' },
  { id: 39, dimension: 'vit', text: '即使一天安排得很满，我也很少觉得"撑不下去"。' },
  { id: 40, dimension: 'vit', text: '我觉得自己的身体状态和几年前相比，没有明显变差。' },
  { id: 41, dimension: 'res', text: '如果是我负责的事出了岔子，我会主动认领并补救，而不是推给环境。' },
  { id: 42, dimension: 'res', text: '答应下来的事，就算临时不想做了，我也会硬着头皮完成。' },

  // 末尾：生理年龄（"最后再问"）
  { id: 43, type: 'number', dimension: null, min: 6, max: 99, text: '最后一道：请填写你的生理年龄（周岁）。这一步会帮报告对比"心理年龄 vs 生理年龄"；如果不方便填，也可以留空跳过。' },
]

export const psyAgeOptions = [
  { value: 1, label: '非常不同意' },
  { value: 2, label: '不同意' },
  { value: 3, label: '中立' },
  { value: 4, label: '同意' },
  { value: 5, label: '非常同意' },
]

// 供计分引用的反向题 id
export const psyAgeReverseIds = [3, 12, 15, 20, 24]
