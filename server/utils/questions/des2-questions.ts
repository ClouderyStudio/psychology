// DES-II 解离经验量表（28 题，0-100 滑块）
export type DES2Dimension =
  | 'amnesia'    // 记忆缺失
  | 'dpdr'       // 人格/现实解体
  | 'absorption' // 吸收沉浸

export interface DES2Question {
  id: number;
  text: string;
  /** 子量表归属；不属于任一子量表的题归 null（仅计入总分） */
  dimension: DES2Dimension | null;
}

export const des2Questions: DES2Question[] = [
  { id: 1, text: "我会沉浸在想法或正在做的事里，以致一时忽略周围正在发生的事情。", dimension: null },
  { id: 2, text: "当我看电影、阅读或听音乐时，常会有仿佛身临其境的感觉。", dimension: "absorption" },
  { id: 3, text: "我曾在走神后发现自己已经到了某处，却不太记得中间的过程。", dimension: "amnesia" },
  { id: 4, text: "与人交谈时，我会突然意识到自己刚才走神了，并不太记得刚刚说了什么。", dimension: "amnesia" },
  { id: 5, text: "我发现有自己写下的字迹或留下的痕迹，但不太记得何时完成。", dimension: "amnesia" },
  { id: 6, text: "我会对一些事情感到很熟悉，却一时想不起自己是否真的做过或经历过。", dimension: null },
  { id: 7, text: "我有过片刻觉得自己不像自己，或周围世界不真实的体验。", dimension: "dpdr" },
  { id: 8, text: "照镜子时，我曾短暂觉得镜中的自己像个陌生人。", dimension: "amnesia" },
  { id: 9, text: "阅读时我会走神，回过神来需要回读一段才发现没看进去。", dimension: null },
  { id: 10, text: "我曾突然意识到自己已经在某个地点，却对如何到达那儿记不清。", dimension: null },
  { id: 11, text: "我会深度专注于内在活动或手头的事，以至一时对外界声音反应很少。", dimension: "dpdr" },
  { id: 12, text: "我会有像在旁观或在梦里的感觉，身体或环境显得不真实或疏离。", dimension: "dpdr" },
  { id: 13, text: "我发现随身物品被移动或出现，但不太记得自己曾放置或拿取它们。", dimension: "dpdr" },
  { id: 14, text: "我会被音乐、自然或艺术深深吸引，注意力长时间沉浸其中。", dimension: "absorption" },
  { id: 15, text: "开车或通勤时，我会“回过神来才到站”，对途中细节记忆很少。", dimension: "absorption" },
  { id: 16, text: "当他人提起某次谈话或事件时，我几乎没有印象或完全想不起来。", dimension: null },
  { id: 17, text: "当我情绪或场景投入时，会明显忘记时间的流逝。", dimension: "absorption" },
  { id: 18, text: "回忆时我会出现非常生动的画面或感觉，像重新经历了一遍。", dimension: "absorption" },
  { id: 19, text: "在熟悉的地方，我有时会突然感觉格外陌生或与以往不同。", dimension: null },
  { id: 20, text: "当我专注或创作时，会进入心流，对外界刺激的反应明显减少。", dimension: "absorption" },
  { id: 21, text: "我经常进行白日梦或内在想象，沉浸其中后不易立刻抽离。", dimension: null },
  { id: 22, text: "我有时会觉得别人说话像从远处传来，自己像隔着一层。", dimension: null },
  { id: 23, text: "我发现自己拥有某些物品或消费记录，但完全不记得获取或下单。", dimension: null },
  { id: 24, text: "他人告诉我曾做过或说过一些事，但我对那段经历毫无印象。", dimension: null },
  { id: 25, text: "在强烈情绪或压力下，我会出现记忆空白或片段不连贯。", dimension: "amnesia" },
  { id: 26, text: "在社交场合或活动中，我有时对发生过的片段记不清或想不起来。", dimension: "amnesia" },
  { id: 27, text: "聆听音乐或故事时，我的脑中会自发浮现如临其境的画面与情节。", dimension: "dpdr" },
  { id: 28, text: "回想过去的自己时，我偶尔会有像在回看另一个人的生活的感觉。", dimension: "dpdr" },
];
