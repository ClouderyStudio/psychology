// 七美德与七宗罪 · 60题（56 计分 + 4 缓冲）
// 模型：7 宗罪与 7 美德是 14 条【独立】维度，分开测量、互不抵消。
// 全部正向计分（同意 = 该维度浓度高）；题面已做“隐晦化”处理。
// 来源：Evagrius → 格里高利一世 → 阿奎那；现代心理实证见 scoreSeven 引用。
import type { Option } from "~/types/test";

export type SevenSide = "sin" | "virtue" | "filler";

export interface SevenQuestion {
  id: number;
  side: SevenSide;
  dimension: string | null; // 对应罪/德的 key；filler 维度为 null
  text: string;
}

export const sevenQuestions: SevenQuestion[] = [
  { id: 1, side: "sin", dimension: "pride", text: "团队赢了一场比赛时，我总觉得最大的功劳应该记在我头上。" },
  { id: 2, side: "sin", dimension: "pride", text: "如果是我错了，我很难当众承认“是我错了”。" },
  { id: 3, side: "sin", dimension: "pride", text: "我心里常常觉得，身边很多人其实不如我。" },
  { id: 4, side: "sin", dimension: "pride", text: "别人的建议我常常听不进去，因为我觉得他们不懂我要做的事。" },
  { id: 5, side: "virtue", dimension: "humility", text: "被一个年纪比我小很多的人指点，我也能虚心听完。" },
  { id: 6, side: "virtue", dimension: "humility", text: "遇到不懂的事，我会坦然说“我不懂”，而不是硬撑。" },
  { id: 7, side: "virtue", dimension: "humility", text: "出了风头之后，我能很快回到人群里，不觉得“这本来就是我的位置”。" },
  { id: 8, side: "virtue", dimension: "humility", text: "做错了事之后，我会主动道歉，而不是找理由。" },
  { id: 9, side: "sin", dimension: "greed", text: "看到别人手里的好东西，我常常会想“为什么不是我的”。" },
  { id: 10, side: "sin", dimension: "greed", text: "每次分到好处，我总觉得“我怎么才拿这么点”。" },
  { id: 11, side: "sin", dimension: "greed", text: "为了多占一点便宜，我可以花不少心思去算计。" },
  { id: 12, side: "sin", dimension: "greed", text: "别人请客时我会很开心，但轮到我请客时，我会不自觉地算这笔账。" },
  { id: 13, side: "virtue", dimension: "generosity", text: "朋友急需用钱时，我可以毫不犹豫地把大部分借给他。" },
  { id: 14, side: "virtue", dimension: "generosity", text: "把东西分享给别人，对我来说是件开心的事，而不是割肉。" },
  { id: 15, side: "virtue", dimension: "generosity", text: "如果一顿饭能让大家开心，我不会在意自己多付一点。" },
  { id: 16, side: "virtue", dimension: "generosity", text: "看到别人遇到困难，我会主动伸出援手，不问回报。" },
  { id: 17, side: "sin", dimension: "lust", text: "我很容易对刚认识不久的人产生好感和心动。" },
  { id: 18, side: "sin", dimension: "lust", text: "对我来说，“来电”的感觉比“安稳”重要得多。" },
  { id: 19, side: "sin", dimension: "lust", text: "吸引我的人一出现，我很难不把注意力放到他身上。" },
  { id: 20, side: "sin", dimension: "lust", text: "看到外形很吸引我的人，我会忍不住多看几眼，很难移开目光。" },
  { id: 21, side: "virtue", dimension: "chastity", text: "即使遇到很吸引我的人，我也能守住自己的界限。" },
  { id: 22, side: "virtue", dimension: "chastity", text: "比起一时的心动，我更看重长期踏实的陪伴。" },
  { id: 23, side: "virtue", dimension: "chastity", text: "热恋期过去之后，我更期待平淡安稳的日常，而不是不断寻找新刺激。" },
  { id: 24, side: "virtue", dimension: "chastity", text: "我能把精力放在更重要的事情上，不被一时的冲动牵着走。" },
  { id: 25, side: "sin", dimension: "envy", text: "看到别人晒的幸福，我心里会莫名地不舒服。" },
  { id: 26, side: "sin", dimension: "envy", text: "朋友考得比我好时，我嘴上恭喜，心里却会偷偷比较。" },
  { id: 27, side: "sin", dimension: "envy", text: "别人的成功，有时候会让我觉得自己的努力都白费了。" },
  { id: 28, side: "sin", dimension: "envy", text: "群里有人分享好消息时，我常常懒得捧场，甚至有点酸。" },
  { id: 29, side: "virtue", dimension: "kindness", text: "真心为别人的好运高兴，对我来说是件自然的事。" },
  { id: 30, side: "virtue", dimension: "kindness", text: "身边人过得好，我更愿意把他们当成可以学习的伙伴，而不是对手。" },
  { id: 31, side: "virtue", dimension: "kindness", text: "朋友获得了比我好的机会，我会替他开心，而不是失落。" },
  { id: 32, side: "virtue", dimension: "kindness", text: "身边有人难过时，我会主动陪他说说话，而不是当作没看见。" },
  { id: 33, side: "filler", dimension: null, text: "我早上起床后的状态，比晚上更好。" },
  { id: 34, side: "sin", dimension: "gluttony", text: "一遇到好吃的，我就很难停下来，常常吃到撑。" },
  { id: 35, side: "sin", dimension: "gluttony", text: "我常因为嘴馋，打乱原本定好的饮食计划。" },
  { id: 36, side: "sin", dimension: "gluttony", text: "心情不好的时候，我习惯用“吃点好的”来安抚自己。" },
  { id: 37, side: "sin", dimension: "gluttony", text: "明明说好只吃一口，我常常会控制不住再来第二口、第三口。" },
  { id: 38, side: "virtue", dimension: "temperance", text: "再喜欢的东西，我也能浅尝辄止，不让自己失控。" },
  { id: 39, side: "virtue", dimension: "temperance", text: "我很少因为贪一时之快，把身体搞得很难受。" },
  { id: 40, side: "virtue", dimension: "temperance", text: "面对一堆好吃的，我通常会先想“身体需不需要”，而不是“嘴巴想不想”。" },
  { id: 41, side: "virtue", dimension: "temperance", text: "享受归享受，我从不让享受打乱真正重要的计划。" },
  { id: 42, side: "sin", dimension: "wrath", text: "被人故意激怒时，我很难压住火，常常当场就炸。" },
  { id: 43, side: "sin", dimension: "wrath", text: "排队、堵车、被人插队，这些事很容易让我火冒三丈。" },
  { id: 44, side: "sin", dimension: "wrath", text: "我气头上说出的话，常常比我想的难听得多。" },
  { id: 45, side: "sin", dimension: "wrath", text: "被人一而再地冒犯时，我会有“要让对方知道厉害”的冲动。" },
  { id: 46, side: "virtue", dimension: "patience", text: "遇到再讨厌的事，我也能先把脾气按住，冷静了再处理。" },
  { id: 47, side: "virtue", dimension: "patience", text: "别人的失误，我通常愿意再给一次机会，而不是马上翻脸。" },
  { id: 48, side: "virtue", dimension: "patience", text: "即使被人当众误会，我也能先听完解释，而不是立刻发作。" },
  { id: 49, side: "virtue", dimension: "patience", text: "即使事情进展得很慢，我也能耐着性子等，不轻易烦躁。" },
  { id: 50, side: "sin", dimension: "sloth", text: "明明知道该做的事，我常常一拖再拖，直到火烧眉毛。" },
  { id: 51, side: "sin", dimension: "sloth", text: "比起“开始做”，我更擅长“计划着做”——但就是不动手。" },
  { id: 52, side: "sin", dimension: "sloth", text: "日子能轻松过的话，我不会主动给自己加码。" },
  { id: 53, side: "sin", dimension: "sloth", text: "需要额外努力才能做好的一件事，我常常会选择“差不多就行”。" },
  { id: 54, side: "virtue", dimension: "diligence", text: "答应自己的事（比如锻炼、学习），我会认真兑现。" },
  { id: 55, side: "virtue", dimension: "diligence", text: "看到机会，我会主动去争取，而不是等它掉下来。" },
  { id: 56, side: "virtue", dimension: "diligence", text: "即使没有截止日期，我也会按自己的节奏把事情做完，而不是无限期搁置。" },
  { id: 57, side: "virtue", dimension: "diligence", text: "做完一件麻烦事之后，我更愿意趁热打铁继续，而不是立刻躺平。" },
  { id: 58, side: "filler", dimension: null, text: "比起甜食，我更喜欢咸口的东西。" },
  { id: 59, side: "filler", dimension: null, text: "我习惯把重要的日子记在备忘录里。" },
  { id: 60, side: "filler", dimension: null, text: "下雨天待在家，比出门更自在。" }
];

// Likert 1-5 自评选项（同意 = 该维度浓度高）
export const sevenOptions: Option[] = [
  { value: 1, label: "完全不像我" },
  { value: 2, label: "有点不像我" },
  { value: 3, label: "说不清" },
  { value: 4, label: "有点像我" },
  { value: 5, label: "非常像我" },
];
