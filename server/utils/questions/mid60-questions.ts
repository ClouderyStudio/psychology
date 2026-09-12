import type { Option } from "~/types/test";

// MID-60 维度：12 个相关子量表（对应题目均值×10 得 0–100% 子量表分）
export type MID60Dimension =
  | 'amnesia' // 近期遗忘（Amnesia）
  | 'alter' // 替换人格意识（Alter awareness）
  | 'angry' // 愤怒侵入（Angry intrusions）
  | 'persec' // 迫害侵入（Persecutory intrusions）
  | 'dpdr' // 人格解体/现实解体（DP/DR）
  | 'memory-distress' // 记忆困扰（Memory distress）
  | 'autobio' // 自传记忆丧失（Autobiographical memory loss）
  | 'flashback' // 闪回（Flashbacks）
  | 'fns' // 功能性神经症状（FNS/转换障碍）
  | 'pnes' // 心因性非癫痫发作（PNES）
  | 'trance' // 恍惚（Trance states）
  | 'identity' // 自我困惑（Identity confusion）;

export interface MID60Question {
  id: number;
  text: string;
  dimension: MID60Dimension;
}

// 0–10 频率评分（0=从不，10=总是）
export const mid60Options: Option[] = Array.from({ length: 11 }, (_, i) => ({
  value: i,
  label: String(i),
}));

/**
 * MID-60 多维解离量表（Multidimensional Inventory of Dissociation，60 题）。
 * 依据 MPSTEAM Wiki 公开条目整理（Dell, 2006）。
 * 计分：每题 0–10；总分 = 全体 60 题均值 × 10（0–100%）。
 * 12 个子量表分 = 各自题目均值 × 10，与各自临界值（%）比较。
 *
 * 【题目归属即唯一事实来源】下面每条题目的 dimension 字段就是子量表成员表，
 * 计分侧（scoreMID60.ts）据此推导各子量表题目集合，不再另抄一份题号清单——
 * 原实现两处各写一份，且都与题目内容对不上（第三批报告 2）。
 *
 * 子量表-题号对照（2026-09 逐条按题目语义复核后）：
 *   近期遗忘 amnesia:            1,7,8,20,42,45,48,50,58
 *   替换人格意识 alter:          3,36,39,49,57
 *   愤怒侵入 angry:              28,33,35,46,60
 *   迫害侵入 persec:             22,37,44,56,59
 *   人格/现实解体 dpdr:          2,9,11,13,17,25,53
 *   记忆困扰 memory-distress:    38,43,47,52
 *   自传记忆丧失 autobio:        16,19,24,29,34
 *   闪回 flashback:              4,15,31,40,54
 *   功能性神经症状 fns:          5,10,14,18,21
 *   心因性非癫痫发作 pnes:       26
 *   恍惚 trance:                 6,27,30,32,41,51
 *   自我困惑 identity:           12,23,55
 *
 * 本次修正的条目（原归属 → 现归属，依据题目内容而非题号）：
 *   1  记忆困扰 → 近期遗忘   "忘记当天较早时做过的事情"就是近期遗忘本身
 *   7  人格解体 → 近期遗忘   "别人说你做过某些事但你完全不记得"是遗忘，不是解体
 *   8  记忆困扰 → 近期遗忘   "不记得上一顿吃了什么"同上
 *   20 记忆困扰 → 近期遗忘   "别人刚说过的话你立刻就忘"同上
 *   50 人格解体 → 近期遗忘   "回过神来发现你做过不记得做过的事"同上
 *   6  自我困惑 → 恍惚       "出现恍惚(出神)…对周围失去觉察"是恍惚的定义式条目
 *   21 恍惚 → 功能性神经症状 "行走困难(无已知医学原因)"与其他 FNS 条目同一句式
 *   47 人格解体 → 记忆困扰   "完全忘记如何做你本会做的事"是技能性遗忘，不是解体
 *   11 自我困惑 → 人格/现实解体 "与自己的行为疏离"是自我脱离，不是"我是谁"的困惑
 *   17 自我困惑 → 人格/现实解体 "与周围一切都断开连接"是现实脱离
 * 注意：条目 42/45/48/58 描述的是"对自身行为的遗忘"（发现自己身处某处、
 *   外观改变、手里拿着东西），归入近期遗忘是对的；原实现的近期遗忘只装了
 *   这四条，反而接不到任何一条"忘记最近发生的事"，导致该维度恒为 0。
 */
export const mid60Questions: MID60Question[] = [
  { id: 1, text: "忘记当天较早时做过的事情", dimension: "amnesia" },
  { id: 2, text: "出现某种情绪(如恐惧/悲伤/愤怒/快乐),但感觉它不像是\"你的\"情绪", dimension: "dpdr" },
  { id: 3, text: "在脑海中听到一个孩子的声音", dimension: "alter" },
  { id: 4, text: "如此生动地重新经历创伤事件,以至于完全失去与当下所在之处的联系(仿佛你回到当时彼处)", dimension: "flashback" },
  { id: 5, text: "吞咽困难(无已知医学原因)", dimension: "fns" },
  { id: 6, text: "出现恍惚(出神),你盯着某处发呆,对周围正在发生的事失去觉察", dimension: "trance" },
  { id: 7, text: "别人说你最近做过某些事,但你完全不记得", dimension: "amnesia" },
  { id: 8, text: "不记得上一顿吃了什么,甚至不记得是否吃过", dimension: "amnesia" },
  { id: 9, text: "周围的事物感觉不真实", dimension: "dpdr" },
  { id: 10, text: "一时看不见(仿佛失明,无已知医学原因)", dimension: "fns" },
  { id: 11, text: "走过场般做日常事,却强烈感到与自己的行为疏离", dimension: "dpdr" },
  { id: 12, text: "对你究竟是谁感到不确定", dimension: "identity" },
  { id: 13, text: "他人、物体或周围世界让你感到不真实", dimension: "dpdr" },
  { id: 14, text: "瘫痪或无法移动(无已知医学原因)", dimension: "fns" },
  { id: 15, text: "被闪回困扰到难以起床开始一天", dimension: "flashback" },
  { id: 16, text: "不记得 5 岁之后童年的大部分时光", dimension: "autobio" },
  { id: 17, text: "感到与周围一切都断开连接", dimension: "dpdr" },
  { id: 18, text: "一时听不见(仿佛失聪,无已知医学原因)", dimension: "fns" },
  { id: 19, text: "感到你的过去有片段缺失", dimension: "autobio" },
  { id: 20, text: "别人刚说过的话你立刻就忘", dimension: "amnesia" },
  { id: 21, text: "行走困难(无已知医学原因)", dimension: "fns" },
  { id: 22, text: "在脑海中听到一个声音想要你伤害自己", dimension: "persec" },
  { id: 23, text: "对你究竟是谁感到非常困惑", dimension: "identity" },
  { id: 24, text: "觉得生命早期发生过重要事情,但想不起来", dimension: "autobio" },
  { id: 25, text: "感到像隔着雾看世界,人和物体显得遥远或不清晰", dimension: "dpdr" },
  { id: 26, text: "出现发作/抽搐,但医生找不到原因(提示PNES可能)", dimension: "pnes" },
  { id: 27, text: "过于频繁或持续太久地进入恍惚(出神),以至于干扰日常活动/责任", dimension: "trance" },
  { id: 28, text: "话语自己从你口中说出,仿佛不受你的控制", dimension: "angry" },
  { id: 29, text: "感到你的记忆有很大的空白", dimension: "autobio" },
  { id: 30, text: "恍惚(出神)可持续数小时", dimension: "trance" },
  { id: 31, text: "不好的记忆涌入脑海,难以摆脱", dimension: "flashback" },
  { id: 32, text: "不知不觉就滑入恍惚(出神)", dimension: "trance" },
  { id: 33, text: "话从你口中说出,但你并未主动说;你不知道它们从何而来", dimension: "angry" },
  { id: 34, text: "几乎记不起你的过去", dimension: "autobio" },
  { id: 35, text: "生气时做过或说过的事,冷静后不记得", dimension: "angry" },
  { id: 36, text: "感觉你有多重人格", dimension: "alter" },
  { id: 37, text: "在脑海中听到辱骂你的声音(如\"懦弱/愚蠢/下贱/婊子\"等)", dimension: "persec" },
  { id: 38, text: "记忆差给你带来严重困难", dimension: "memory-distress" },
  { id: 39, text: "你内在还有他人(或部分),他们有各自的名字", dimension: "alter" },
  { id: 40, text: "极其生动地重历过往创伤,仿佛能看见/听见/闻到它", dimension: "flashback" },
  { id: 41, text: "连续数天处于恍惚(出神)", dimension: "trance" },
  { id: 42, text: "发现自己改变了外表(剪/换了发型、衣服、化妆等),却不记得这样做过", dimension: "amnesia" },
  { id: 43, text: "因忘记太多而困扰或不安", dimension: "memory-distress" },
  { id: 44, text: "在脑海中听到一个声音要你去死", dimension: "persec" },
  { id: 45, text: "突然发现自己在家中奇怪的地方(壁橱里、床下、蜷缩在地上等),不知道如何到那里", dimension: "amnesia" },
  { id: 46, text: "感到内在有某种东西在控制你的行为与言语", dimension: "angry" },
  { id: 47, text: "完全忘记如何做你本会做的事(如开车、阅读、用电脑、弹琴等)", dimension: "memory-distress" },
  { id: 48, text: "突然发现自己身处某处(海滩、工作地、夜店、车里等),不记得如何到达", dimension: "amnesia" },
  { id: 49, text: "感到内在有另一个人,若它愿意,它可以出来说话", dimension: "alter" },
  { id: 50, text: "\"回过神来\"发现你做过一些不记得做过的事(打碎东西、自伤、打扫整屋等)", dimension: "amnesia" },
  { id: 51, text: "很难保持清醒而不进入恍惚(出神)", dimension: "trance" },
  { id: 52, text: "突然不知道如何开展你的工作", dimension: "memory-distress" },
  { id: 53, text: "你的身体突然感觉不像是你的", dimension: "dpdr" },
  { id: 54, text: "连续几天被闪回困扰", dimension: "flashback" },
  { id: 55, text: "对你的情绪感到困惑或拿不准", dimension: "identity" },
  { id: 56, text: "在脑海中听到一个声音对你说\"闭嘴\"", dimension: "persec" },
  { id: 57, text: "你内在有另一个部分,它的记忆、行为和感受与你不同", dimension: "alter" },
  { id: 58, text: "有时\"回过神来\"发现手里拿着药或刀片(或其他自伤物品)", dimension: "amnesia" },
  { id: 59, text: "在脑海中听到一个声音说你不好、没有价值或是个失败者", dimension: "persec" },
  { id: 60, text: "有一个非常愤怒的部分\"出来\",它会说/做你从不会说/做的事", dimension: "angry" },
];
