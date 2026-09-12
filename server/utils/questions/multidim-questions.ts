import type { Option } from "~/types/test";

// 心理健康多维自评量表（AnonUsAl 编制）· 完整题库与出题器
//
// 题库共 145 题：20 个核心特征各 1 道主问（main）+ 2 道一致性复问（dup）
// + 2 道严重度问（sev）+ 2 道生活场景问（life），另含 5 道效度（测谎）题（lie）。
// 四种评估模式（极简 20 / 快速 45 / 标准 65 / 深度 105）由 buildMultidimQuestions
// 按「模式 + 种子」确定性生成：极简仅取 20 道主问，其余模式在每维度补充题池中
// 轮转抽取，并把效度题均匀插入。同一种子可复现同一套题，供提交校验使用。
//
// 移植自作者独立发布的网页版题库与出题逻辑；特征聚合与判别式评分见 scoreMultidim.ts。

export type MultidimKind = "main" | "dup" | "sev" | "life" | "lie";

export interface MultidimQuestion {
  id: number;
  text: string;
  /** 该题映射回的核心特征 id；效度题为 "lie" */
  trait: string;
  kind: MultidimKind;
}

// 五级作答：+1（非常符合）→ -1（完全不符合），中间为不确定
export const multidimOptions: Option[] = [
  { value: 1, label: "非常符合 / 频繁发生" },
  { value: 0.5, label: "比较符合 / 有时发生" },
  { value: 0, label: "不确定 / 很难说" },
  { value: -0.5, label: "不太符合 / 较少发生" },
  { value: -1, label: "完全不符合 / 从未发生" },
];

// 20 个核心特征（维度），决定总览与雷达图顺序
export const MULTIDIM_TRAIT_ORDER = [
  "low_mood",
  "anhedonia",
  "mania",
  "panic",
  "compulsion",
  "trauma",
  "sleep_issue",
  "focus_loss",
  "social_deficits",
  "social_fear",
  "body_image",
  "somatization",
  "hallucination",
  "impulse",
  "suicide",
  "energy_loss",
  "irritability",
  "self_esteem",
  "paranoia",
  "appetite",
] as const;

export const MULTIDIM_TRAIT_LABELS: Record<string, string> = {
  low_mood: "情绪低落",
  anhedonia: "兴趣减退",
  mania: "情绪高涨期",
  panic: "紧张担忧",
  compulsion: "强迫倾向",
  trauma: "创伤记忆",
  sleep_issue: "睡眠问题",
  focus_loss: "注意力问题",
  social_deficits: "社交互动困难",
  social_fear: "社交恐惧",
  body_image: "体型关注",
  somatization: "躯体化不适",
  hallucination: "幻觉体验",
  impulse: "冲动攻击",
  suicide: "自伤念头",
  energy_loss: "精力下降",
  irritability: "易怒烦躁",
  self_esteem: "自我价值感",
  paranoia: "多疑猜疑",
  appetite: "食欲变化",
};

/** 每个特征的科普说明（用于结果页维度总览与复制文本） */
export const MULTIDIM_TRAIT_DESC: Record<string, string> = {
  low_mood: "持续的情绪低落、悲伤或内心空虚，是常见的心境信号。",
  anhedonia: "对原本感兴趣的活动失去兴趣或愉悦感，感受变得平淡。",
  mania: "情绪异常高涨、精力过盛、思维奔逸或冲动增多。",
  panic: "过度的担心、紧张不安，可伴有心慌、呼吸急促等躯体反应。",
  compulsion: "反复出现难以控制的念头，或不得不重复某些行为。",
  trauma: "对创伤性事件反复回忆、闪回，或刻意回避相关情境。",
  sleep_issue: "入睡困难、易醒、早醒或睡眠质量差，影响日间状态。",
  focus_loss: "难以集中注意力、容易分心、健忘或难以按计划完成任务。",
  social_deficits: "在理解与参与人际互动上存在困难，社交过程感觉吃力。",
  social_fear: "在社交或表现场合感到强烈紧张，并倾向于回避。",
  body_image: "对自身体型、体重过度关注或持续不满。",
  somatization: "出现查无明确原因的身体不适，如头痛、胃痛、乏力等。",
  hallucination: "听到或看到他人无法感知的声音或景象。",
  impulse: "难以控制的冲动或攻击行为，事后常感后悔。",
  suicide: "觉得活着没有意义，或闪过结束生命的念头（需特别重视）。",
  energy_loss: "持续精力不足、疲乏无力，休息后也难以恢复。",
  irritability: "容易发怒、烦躁，情绪波动明显。",
  self_esteem: "自我评价偏低，觉得自己不够好、缺乏价值感。",
  paranoia: "对他人动机过度怀疑、猜忌，难以信任。",
  appetite: "食欲明显增加或减少，体重随之波动。",
};

export const multidimQuestions: MultidimQuestion[] = [
  { id: 1, trait: "low_mood", kind: "main", text: "你是不是经常情绪低落，心里空落落的，怎么也高兴不起来？" },
  { id: 2, trait: "anhedonia", kind: "main", text: "以前特别喜欢做的事，现在是不是觉得没什么意思了？" },
  { id: 3, trait: "mania", kind: "main", text: "有没有过那么一段时间，你精力特别旺盛、几乎不用睡觉，脑子还转得飞快？" },
  { id: 4, trait: "panic", kind: "main", text: "你是不是总忍不住担心这担心那，一紧张起来还会心慌、喘不上气？" },
  { id: 5, trait: "compulsion", kind: "main", text: "脑子里会不会反复冒出一些念头，或者你总得反复检查、反复洗手才安心？" },
  { id: 6, trait: "trauma", kind: "main", text: "有没有经历过特别可怕的事，之后那些画面还会不受控制地冒出来？" },
  { id: 7, trait: "sleep_issue", kind: "main", text: "你是不是经常睡不着、半夜容易醒，或者醒得特别早？" },
  { id: 8, trait: "focus_loss", kind: "main", text: "是不是很难长时间集中注意力，东西也经常乱放，事情总拖着做不完？" },
  { id: 9, trait: "social_deficits", kind: "main", text: "跟人打交道时，你是不是常常看不懂别人的表情和话里的意思，接话也挺吃力？" },
  { id: 10, trait: "social_fear", kind: "main", text: "在别人面前说话、被人盯着，或者参加聚会时，你是不是特别紧张，怕被人评头论足？" },
  { id: 11, trait: "body_image", kind: "main", text: "你是不是特别在意自己的体重和身材，甚至会因此刻意少吃东西？" },
  { id: 12, trait: "somatization", kind: "main", text: "你是不是经常头疼、胃疼、心慌或者没力气，去医院又查不出什么毛病？" },
  { id: 13, trait: "hallucination", kind: "main", text: "有没有听到过别人听不到的声音，或者看到过别人看不到的东西，当时还觉得特别真实？" },
  { id: 14, trait: "impulse", kind: "main", text: "有没有一时冲动跟人吵过架、砸过东西，事后又特别后悔？" },
  { id: 15, trait: "suicide", kind: "main", text: "最近这两周，你有没有觉得活着没什么意思，甚至闪过不想活了的念头？" },
  { id: 16, trait: "low_mood", kind: "dup", text: "最近这两周，你是不是大部分时间都闷闷不乐，怎么也开心不起来？" },
  { id: 17, trait: "anhedonia", kind: "dup", text: "那些以前让你特别开心的事，现在是不是都不想碰了？" },
  { id: 18, trait: "mania", kind: "dup", text: "有没有连续好几天几乎不用睡觉，却还是精力满满、脑子停不下来？" },
  { id: 19, trait: "panic", kind: "dup", text: "你是不是常常没来由地心慌、坐不住，总觉得有什么不好的事要发生？" },
  { id: 20, trait: "compulsion", kind: "dup", text: "你是不是会忍不住反复检查、收拾或者洗手，明明知道没必要却停不下来？" },
  { id: 21, trait: "trauma", kind: "dup", text: "以前经历过的吓人的事，会不会突然在脑子里重演，让你像又经历了一遍一样难受？" },
  { id: 22, trait: "sleep_issue", kind: "dup", text: "你的睡眠是不是一直不太好——难入睡、半夜醒或者醒太早，白天也没精神？" },
  { id: 23, trait: "focus_loss", kind: "dup", text: "你是不是经常走神、丢三落四，连简单的事也容易拖到最后才做？" },
  { id: 24, trait: "social_fear", kind: "dup", text: "被陌生人看着、或者要在人前说话时，你会不会紧张到手心冒汗、说话都不利索？" },
  { id: 25, trait: "body_image", kind: "dup", text: "你会不会总盯着体重数字和身材看，一焦虑就刻意少吃甚至不吃饭？" },
  { id: 26, trait: "somatization", kind: "dup", text: "一紧张或压力大，你身体就跟着出状况，比如胸闷、拉肚子、肌肉发紧，可检查又没事？" },
  { id: 27, trait: "hallucination", kind: "dup", text: "身边明明没人，你有没有听到过有人说话、叫你名字，或者在议论你？" },
  { id: 28, trait: "impulse", kind: "dup", text: "生气或受挫的时候，你是不是常常忍不住想摔东西、大吼，甚至动手？" },
  { id: 29, trait: "suicide", kind: "dup", text: "特别低落的时候，你有没有闪过伤害自己、或者一了百了的念头？" },
  { id: 30, trait: "low_mood", kind: "sev", text: "这种情绪低落是不是几乎天天都有，而且已经持续两个多星期，影响到工作或生活了？" },
  { id: 31, trait: "anhedonia", kind: "sev", text: "对什么都提不起劲的状态，是不是已经明显影响到你的学习、工作或者跟人来往？" },
  { id: 32, trait: "mania", kind: "sev", text: "那种特别亢奋的状态有没有连续持续好几天，还让你做出一些平时不会做的冲动事？" },
  { id: 33, trait: "panic", kind: "sev", text: "紧张心慌是不是发作得特别频繁，已经影响到日常活动，或者让你开始躲着某些场合？" },
  { id: 34, trait: "compulsion", kind: "sev", text: "反复出现的念头或动作，是不是每天都要花掉你大把时间，想停也停不下来？" },
  { id: 35, trait: "trauma", kind: "sev", text: "那些不好的回忆是不是频繁冒出来，让你睡不着、躲着相关的场景，甚至影响正常生活？" },
  { id: 36, trait: "sleep_issue", kind: "sev", text: "睡不好是不是让你白天特别累、注意力也变差，而且已经持续好一阵子了？" },
  { id: 37, trait: "focus_loss", kind: "sev", text: "注意力不集中的问题是不是从小就有，一直影响你的学习、工作或者做事效率？" },
  { id: 38, trait: "social_fear", kind: "sev", text: "因为害怕社交场合，你是不是已经开始躲着聚会、推掉一些机会？" },
  { id: 39, trait: "body_image", kind: "sev", text: "对体重和身材的担心，是不是已经让你体重掉了不少，或者影响到健康和生活？" },
  { id: 40, trait: "somatization", kind: "sev", text: "身体上的不舒服是不是频繁到影响工作、学习或睡觉，甚至让你一趟趟跑医院？" },
  { id: 41, trait: "hallucination", kind: "sev", text: "这种听到或看到不存在的东西的经历，是不是反复出现，让你害怕、困扰，甚至影响生活？" },
  { id: 42, trait: "impulse", kind: "sev", text: "这种控制不住的冲动是不是反复出现，已经影响到你的人际关系、工作，或者给你惹过麻烦？" },
  { id: 43, trait: "suicide", kind: "sev", text: "自杀的念头是不是经常冒出来，甚至你还认真想过具体的方式和计划？" },
  { id: 44, trait: "low_mood", kind: "dup", text: "就算遇到开心的事，你是不是也笑不出来，心里总像压着块石头？" },
  { id: 45, trait: "anhedonia", kind: "dup", text: "以前的爱好，像运动、打游戏、看书、追剧，你现在是不是都提不起劲？" },
  { id: 46, trait: "mania", kind: "dup", text: "有没有一段时间你说话比平时快很多、想法一个接一个，旁边的人都觉得你停不下来？" },
  { id: 47, trait: "panic", kind: "dup", text: "有没有明明没什么危险，你却突然心跳加速、喘不上气，觉得自己快失控或要晕倒？" },
  { id: 48, trait: "compulsion", kind: "dup", text: "数字、顺序或者东西的摆法一旦不对，你是不是就浑身难受，非得重新弄好才踏实？" },
  { id: 49, trait: "trauma", kind: "dup", text: "你是不是经常做跟那件事有关的噩梦，或者白天突然感觉自己又“回到”了当时的场景？" },
  { id: 50, trait: "sleep_issue", kind: "dup", text: "躺在床上是不是经常要翻来覆去半个小时以上才能睡着，脑子里乱七八糟停不下来？" },
  { id: 51, trait: "focus_loss", kind: "dup", text: "开会、上课或者看书时，你是不是经常走神，回过神来才发现错过了一大段？" },
  { id: 52, trait: "social_deficits", kind: "dup", text: "别人的玩笑或者话里有话，你是不是经常接不住，过后才反应过来对方什么意思？" },
  { id: 53, trait: "social_fear", kind: "dup", text: "当众发言、跟人一起吃饭或者做自我介绍时，你会不会紧张到手抖、脸红、声音发颤？" },
  { id: 54, trait: "body_image", kind: "dup", text: "照镜子或看照片时，你是不是总觉得自己身材“不够好”，可别人都说挺正常的？" },
  { id: 55, trait: "somatization", kind: "dup", text: "你是不是常觉得浑身酸痛、发紧或者没力气，但医生说各项检查都正常？" },
  { id: 56, trait: "hallucination", kind: "dup", text: "你有没有听到过别人说不存在的声音，或者一个人待着时听到清清楚楚的说话声？" },
  { id: 57, trait: "impulse", kind: "dup", text: "情绪一上头，你是不是会不管不顾地摔门、砸东西，或者说出特别伤人的话？" },
  { id: 58, trait: "suicide", kind: "dup", text: "痛苦到极点的时候，你有没有觉得“离开反而是解脱”，虽然理智上知道不该这么想？" },
  { id: 59, trait: "low_mood", kind: "sev", text: "这种低落是不是让你觉得未来没什么希望，连吃饭、做事的劲头都没了？" },
  { id: 60, trait: "anhedonia", kind: "sev", text: "提不起劲的状态是不是已经持续好几个星期，让你觉得日子过得没什么盼头？" },
  { id: 61, trait: "mania", kind: "sev", text: "亢奋的时候，你有没有乱花钱、冒险投资或者冲动辞职，事后又后悔不已？" },
  { id: 62, trait: "panic", kind: "sev", text: "这种心慌紧张是不是一周会发作好几次，你还总在担心“下一次什么时候来”？" },
  { id: 63, trait: "compulsion", kind: "sev", text: "反复确认、洗手或收拾，是不是每天都要占用你一个多小时，明明没必要却停不下来？" },
  { id: 64, trait: "trauma", kind: "sev", text: "闪回或噩梦是不是频繁到你会刻意躲开相关的人、地方或话题？" },
  { id: 65, trait: "sleep_issue", kind: "sev", text: "睡不够是不是让你白天头疼、烦躁、注意力差，而且已经持续一个多月了？" },
  { id: 66, trait: "focus_loss", kind: "sev", text: "注意力的问题是不是从小就有，一直影响你的成绩、工作表现或者生活条理？" },
  { id: 67, trait: "social_deficits", kind: "sev", text: "跟人打交道的吃力是不是从小就这样，让你在人群里总觉得自己格格不入？" },
  { id: 68, trait: "social_fear", kind: "sev", text: "因为害怕社交，你是不是错过过聚会、面试、公开课这类机会，事后还责怪自己？" },
  { id: 69, trait: "body_image", kind: "sev", text: "对体重身材的执念，是不是已经让你明显消瘦、没力气，甚至出现停经之类的健康问题？" },
  { id: 70, trait: "somatization", kind: "sev", text: "身体不舒服是不是让你反复请假、跑了好几趟医院，却一直查不出明确原因？" },
  { id: 71, trait: "hallucination", kind: "sev", text: "奇怪的感知是不是让你怀疑自己出了问题，还不敢让别人知道？" },
  { id: 72, trait: "impulse", kind: "sev", text: "冲动行事有没有让你跟亲友闹翻、丢了工作，或者卷入过冲突纠纷？" },
  { id: 73, trait: "suicide", kind: "sev", text: "自杀的念头是不是已经影响到你的正常生活，让你没法集中注意力、吃不下饭也睡不着觉？" },
  { id: 74, trait: "low_mood", kind: "life", text: "早上刚醒来时，你是不是常觉得比睡前更沉重，连起床的力气都没有？" },
  { id: 75, trait: "anhedonia", kind: "life", text: "以前很期待的事，比如聚会、旅行、新电影，现在是不是反而觉得麻烦、想推掉？" },
  { id: 76, trait: "mania", kind: "life", text: "亢奋的时候，你是不是觉得自己无所不能，好多事能同时搞定，几乎不用休息？" },
  { id: 77, trait: "panic", kind: "life", text: "想到要去人多的地方，比如挤地铁、上课、逛商场，你会不会提前就开始紧张？" },
  { id: 78, trait: "compulsion", kind: "life", text: "你会不会因为怕脏、怕出错，反复洗手、反复检查门窗有没有锁好？" },
  { id: 79, trait: "trauma", kind: "life", text: "听到某种声音、闻到某种气味或者看到类似画面时，你会不会突然紧张、警觉或者发抖？" },
  { id: 80, trait: "sleep_issue", kind: "life", text: "你是不是经常凌晨两三点就醒了，之后怎么也睡不着，只能干躺着到天亮？" },
  { id: 81, trait: "focus_loss", kind: "life", text: "你是不是经常找不到钥匙、手机，或者一转身就忘了自己刚才要干嘛？" },
  { id: 82, trait: "social_deficits", kind: "life", text: "一群人聊天时，你是不是常常不知道什么时候该插话，说完才发现自己说了不合时宜的话？" },
  { id: 83, trait: "social_fear", kind: "life", text: "发消息或打电话之前，你是不是总要反复斟酌措辞，怕说错了被人笑话？" },
  { id: 84, trait: "body_image", kind: "life", text: "你是不是经常称体重，体重数字稍微一浮动，就能影响你一整天的心情？" },
  { id: 85, trait: "somatization", kind: "life", text: "压力大或者心情不好的时候，你的胃、头或者心脏是不是最先“闹脾气”？" },
  // 归属修正：该题描述的是被害 / 关系观念，不含任何感知异常成分，
  // 原先误归 hallucination，会导致「幻觉体验」维度与安全提示同时出现相反结论。
  { id: 86, trait: "paranoia", kind: "life", text: "有没有过你认定有人在监视、议论或者针对你，但其实拿不出任何证据？" },
  { id: 87, trait: "impulse", kind: "life", text: "等红灯、排队或者被人插队时，你是不是常常压不住火，想立刻发作？" },
  { id: 88, trait: "suicide", kind: "life", text: "你有没有过伤害自己的行为，比如割伤自己、撞头，用这种方式来缓解痛苦？" },
  { id: 89, trait: "low_mood", kind: "life", text: "别人安慰你的时候，你是不是常觉得他们根本不理解你，心情还是好不起来？" },
  { id: 90, trait: "anhedonia", kind: "life", text: "就算把一件事做完了，你是不是也没什么成就感，只觉得“总算结束了”？" },
  { id: 91, trait: "mania", kind: "life", text: "躁动的那几天，你是不是特别容易因为一点小事就发火、跟人吵起来，过后又很快没事了？" },
  { id: 92, trait: "panic", kind: "life", text: "你会不会刻意躲开某些场景，比如人挤人的地方、密闭的空间，就怕自己又紧张起来？" },
  { id: 93, trait: "compulsion", kind: "life", text: "你在检查、洗手或收拾东西时被人打断，会不会特别焦虑，非得从头再来一遍？" },
  { id: 94, trait: "trauma", kind: "life", text: "你是不是一直处于一种草木皆兵的警觉状态，很难真正放松下来？" },
  { id: 95, trait: "sleep_issue", kind: "life", text: "是不是第二天越有重要的事，你前一晚反而越睡不着？" },
  { id: 96, trait: "focus_loss", kind: "life", text: "需要长时间安静坐着的事，对你来说是不是特别难熬，根本坐不住？" },
  { id: 97, trait: "social_deficits", kind: "life", text: "除非别人明说，不然你是不是很难猜到对方为什么生气或者难过？" },
  { id: 98, trait: "social_deficits", kind: "dup", text: "你是不是常常觉得自己体会不到别人的情绪，也猜不到对方在想什么？" },
  { id: 99, trait: "social_deficits", kind: "sev", text: "跟人打交道的困难，是不是已经明显影响到你的学习、工作或者日常关系？" },
  { id: 100, trait: "social_fear", kind: "life", text: "聚会结束后，你是不是会一遍遍回想自己当时的表现，越想越觉得自己出了丑？" },
  { id: 101, trait: "body_image", kind: "life", text: "吃饱之后你会不会特别内疚，然后想办法催吐、节食或者拼命运动来“补偿”？" },
  { id: 102, trait: "somatization", kind: "life", text: "你有没有过身体不舒服却查不出原因，等心情一好，症状也跟着减轻的经历？" },
  { id: 103, trait: "hallucination", kind: "life", text: "出现奇怪的感知时，你是不是会害怕、脑子发乱，甚至不敢一个人待在房间里？" },
  { id: 104, trait: "impulse", kind: "life", text: "冲动过后你是不是常特别后悔，可下一次来了还是控制不住自己？" },
  { id: 105, trait: "suicide", kind: "life", text: "身边一个人的时候，你是不是更容易冒出关于死亡、想离开的强烈念头？" },
  { id: 106, trait: "energy_loss", kind: "main", text: "你是不是常觉得精力不够、浑身发软，明明没干什么也提不起劲？" },
  { id: 107, trait: "energy_loss", kind: "dup", text: "早上醒来时，你是不是常觉得跟没睡过一样，一整天都昏昏沉沉？" },
  { id: 108, trait: "energy_loss", kind: "dup", text: "你有没有发现，做同样的事比以前费劲多了，很容易就累得不行？" },
  { id: 109, trait: "energy_loss", kind: "sev", text: "这种累到被掏空的感觉，是不是频繁到影响工作、学习或者日常生活了？" },
  { id: 110, trait: "energy_loss", kind: "sev", text: "就算休息和睡眠都够了，你是不是还是一直觉得疲乏、没力气？" },
  { id: 111, trait: "energy_loss", kind: "life", text: "下班或放学回到家，你是不是常常累得什么都不想干，就想瘫着？" },
  { id: 112, trait: "energy_loss", kind: "life", text: "跟人社交完之后，你是不是常觉得被掏空了，要好久才能缓过来？" },
  { id: 113, trait: "irritability", kind: "main", text: "你是不是常常因为一点小事就烦躁、想发火，事后又觉得其实没必要？" },
  { id: 114, trait: "irritability", kind: "dup", text: "别人随口一句话、一个小动作，是不是就容易让你觉得被冒犯，忍不住想发火？" },
  { id: 115, trait: "irritability", kind: "dup", text: "就算没什么特别的原因，你是不是也常处在一点就着的状态？" },
  { id: 116, trait: "irritability", kind: "sev", text: "你有没有过气到控制不住、摔东西砸东西的时候，情绪上来根本收不住？" },
  { id: 117, trait: "irritability", kind: "sev", text: "发火的时候，你会不会说出或做出一些事后后悔的事，甚至对最亲的人也这样？" },
  { id: 118, trait: "irritability", kind: "life", text: "排队、堵车、等回复这种小事，是不是经常让你烦躁到受不了？" },
  { id: 119, trait: "irritability", kind: "life", text: "跟家人或同事相处时，你是不是常因为一点小事就吵起来、互不相让？" },
  { id: 120, trait: "self_esteem", kind: "main", text: "你是不是常觉得自己不如别人，怀疑自己的价值和能力？" },
  { id: 121, trait: "self_esteem", kind: "dup", text: "就算事情进展得很顺利，你是不是也很难相信那是靠自己努力得来的？" },
  { id: 122, trait: "self_esteem", kind: "dup", text: "你是不是习惯性地把自己往坏处想，觉得自己什么都做不好？" },
  { id: 123, trait: "self_esteem", kind: "sev", text: "这种自我否定的想法是不是频繁到让你不敢尝试新东西、也不敢跟人交往？" },
  { id: 124, trait: "self_esteem", kind: "sev", text: "你是不是常觉得自己是家里人的负担，或者觉得自己活着没什么意义？" },
  { id: 125, trait: "self_esteem", kind: "life", text: "面对新任务或挑战时，你脑子里冒出来的第一个念头是不是“我不行”？" },
  { id: 126, trait: "self_esteem", kind: "life", text: "别人一句批评，会不会让你长时间陷在自我怀疑里走不出来？" },
  { id: 127, trait: "paranoia", kind: "main", text: "就算没什么证据，你是不是也常觉得别人在议论你、针对你？" },
  { id: 128, trait: "paranoia", kind: "dup", text: "你是不是常怀疑身边人的用意，觉得他们表面客气、背后另有目的？" },
  { id: 129, trait: "paranoia", kind: "dup", text: "别人看你一眼、低声说句话这种普通小事，你是不是常会觉得是在说自己？" },
  { id: 130, trait: "paranoia", kind: "sev", text: "疑心是不是已经影响你信任别人，甚至让你很难跟人正常相处？" },
  { id: 131, trait: "paranoia", kind: "sev", text: "你有没有过因为认定别人针对你而跟人激烈对峙，结果发现只是一场误会？" },
  { id: 132, trait: "paranoia", kind: "life", text: "在公共场合，你是不是常觉得有陌生人在注意你、议论你？" },
  { id: 133, trait: "paranoia", kind: "life", text: "朋友或同事开个玩笑，你是不是常觉得是在旁敲侧击地针对你？" },
  { id: 134, trait: "appetite", kind: "main", text: "你的胃口是不是变化挺大的——要么什么都吃不下，要么控制不住地想吃？" },
  { id: 135, trait: "appetite", kind: "dup", text: "体重是不是在短时间内明显变了，你自己也说不清为什么？" },
  { id: 136, trait: "appetite", kind: "dup", text: "你会不会用不吃饭或者大吃大喝的方式来应对情绪？" },
  { id: 137, trait: "appetite", kind: "sev", text: "吃饭的问题是不是已经影响到你的健康、体力或者日常生活了？" },
  { id: 138, trait: "appetite", kind: "sev", text: "关于食物、体重和身材的念头，是不是占据了你大量时间，怎么也控制不住？" },
  { id: 139, trait: "appetite", kind: "life", text: "一到饭点，你是不是常常一点胃口都没有，或者反过来总想吃东西？" },
  { id: 140, trait: "appetite", kind: "life", text: "聚餐或者别人劝你吃饭时，你是不是常因为自己吃饭的问题感到焦虑、尴尬？" },
  { id: 141, trait: "lie", kind: "lie", text: "我长这么大，从来没对任何人说过一句谎话。" },
  { id: 142, trait: "lie", kind: "lie", text: "不管发生什么事，我都能完全管住自己的情绪，从来不会发脾气。" },
  { id: 143, trait: "lie", kind: "lie", text: "我几乎从来不觉得累，也几乎不需要什么休息。" },
  { id: 144, trait: "lie", kind: "lie", text: "我答应别人的事一定能做到，从来不会食言。" },
  // 原第 145 题为「我经常能准确猜到别人接下来会说什么、做什么」——该题考察的是社会认知 / 共情自评，
  // 与掩饰、理想化无关，且与 social_deficits 维度反向耦合（社交敏锐者如实作答反被记为掩饰），故替换为
  // 同族的罕见条目。
  { id: 145, trait: "lie", kind: "lie", text: "我从来没有对任何人产生过反感、不满或者嫉妒。" },
];

/* ===== 题目时间窗口 =====
 *
 * 全量表统一说明为「最近两周」，但题库中有相当一部分题目明确指向别的时间范围：
 * 「从小学起就有」「有没有过那么一段时间」「曾经经历过」。若不作标注，作答者会把
 * 长期特征、既往发作与近两周状态混在同一份作答里计分——这正是问题报告中
 * 「用两周窗口匹配慢性 / 发育性病程」的成因，也会让同一维度下的题目互相打架。
 */

export type MultidimWindow = "2w" | "episode" | "lifelong";

export const MULTIDIM_WINDOW_LABEL: Record<MultidimWindow, string> = {
  "2w": "最近两周",
  episode: "曾经有过的一段时期",
  lifelong: "长期 / 从小一直",
};

/**
 * 与默认窗口（最近两周）不同的题号。
 * 判定依据只看题干自身的表述，不引入任何临床推断：
 *   - 出现「从小」「一直」「习惯性地」→ lifelong
 *   - 出现「有没有过（那么一段时间）」「曾经」「那几天」「错过过」→ episode
 */
export const MULTIDIM_QUESTION_WINDOWS: Record<number, MultidimWindow> = {
  // —— 既往发作 / 曾经有过（发作性疾病与创伤经历） ——
  3: "episode", // 情绪高涨：有没有过那么一段时间
  6: "episode", // 创伤：有没有经历过特别可怕的事
  13: "episode", // 幻觉：有没有听到过
  14: "episode", // 冲动：有没有一时冲动跟人吵过架
  18: "episode", // 情绪高涨：有没有连续好几天几乎不用睡觉
  27: "episode",
  29: "episode", // 自伤念头：特别低落的时候有没有闪过
  32: "episode",
  46: "episode",
  47: "episode", // 惊恐：有没有突然心跳加速
  56: "episode",
  58: "episode",
  61: "episode",
  68: "episode", // 社交恐惧：是不是错过过机会
  72: "episode",
  76: "episode",
  86: "episode", // 被害观念：有没有过你认定有人在监视
  88: "episode", // 自伤行为：有没有过伤害自己的行为
  91: "episode",
  102: "episode", // 躯体化：有没有过查不出原因的经历
  116: "episode",
  131: "episode", // 多疑：有没有过因为认定别人针对你而对峙
  // —— 长期 / 从小一直（发育性与特质性条目） ——
  9: "lifelong", // 社交互动困难主问
  22: "lifelong", // 睡眠：一直不太好
  37: "lifelong", // 注意力：从小就有
  52: "lifelong",
  66: "lifelong", // 注意力：从小就有
  67: "lifelong", // 社交互动困难：从小就这样
  82: "lifelong",
  94: "lifelong", // 创伤：一直处于草木皆兵的警觉状态
  96: "lifelong",
  97: "lifelong",
  98: "lifelong",
  122: "lifelong", // 自我价值感：习惯性地把自己往坏处想
};

/** 题目所属时间窗口；未在覆盖表中列出的题目一律按「最近两周」处理 */
export function multidimWindowOf(id: number): MultidimWindow {
  return MULTIDIM_QUESTION_WINDOWS[id] ?? "2w";
}

/** 题号 → 题目元数据，供评分规则按特征/题型聚合 */
export const multidimQuestionById = Object.fromEntries(
  multidimQuestions.map((q) => [q.id, q]),
) as Record<number, MultidimQuestion>;

/* ===== 评估模式与出题 ===== */

export type MultidimMode = "light" | "fast" | "standard" | "deep";

export interface MultidimModeInfo {
  id: MultidimMode;
  name: string;
  desc: string;
  questionsCount: number;
}

// 四种模式均覆盖全部 20 个核心特征维度；题量越大，每维度的补充题越多
export const MULTIDIM_MODES: MultidimModeInfo[] = [
  { id: "light", name: "极简自测", desc: "每维度一题（20 题），快速了解整体特征方向", questionsCount: 20 },
  { id: "fast", name: "快速筛查", desc: "每维度主问 + 1 道补充题，兼顾速度与信息量", questionsCount: 45 },
  { id: "standard", name: "标准评估", desc: "每维度主问 + 2 道补充题，推荐选择", questionsCount: 65 },
  { id: "deep", name: "深度评估", desc: "每维度主问 + 4 道补充题，分析最细致", questionsCount: 105 },
];

export function isMultidimMode(value: unknown): value is MultidimMode {
  return value === "light" || value === "fast" || value === "standard" || value === "deep";
}

// 严重议题优先被问到（与原始版本一致）
const SEVERE_WEIGHT: Record<string, number> = {
  suicide: 1.6,
  hallucination: 1.6,
  somatization: 1.3,
  impulse: 1.3,
  paranoia: 1.3,
};

const EXTRA_PER: Record<MultidimMode, number> = { light: 0, fast: 1, standard: 2, deep: 4 };

/** 全部模式共有 20 道核心特征主问 */
export const MULTIDIM_BASE_MAINS = 20;

// 32 位种子 PRNG（mulberry32）：同一种子出题完全一致，供提交校验复现题目集合
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(seed?: string): number {
  const s = seed && seed.length > 0 ? seed : "default";
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function shuffled<T>(arr: readonly T[], rnd: () => number): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    const tmp = a[i]!;
    a[i] = a[j]!;
    a[j] = tmp;
  }
  return a;
}

/**
 * 按模式 + 种子生成题目序列（等价于原始版本的 buildSequence）：
 * 主问 → 每维度按轮转补齐补充题 → 均匀插入效度题。
 * 极简模式仅返回 20 道核心主问（不含效度题）。
 */
export function buildMultidimQuestions(
  mode: MultidimMode = "standard",
  seed?: string,
): MultidimQuestion[] {
  const rnd = mulberry32(hashSeed(seed));
  // 严重议题优先被问到：按权重分层，层内再打乱。
  // 原实现是「先 sort 再整体 shuffled」——均匀洗牌会把排序完全抵消，
  // 严重条目（自伤 / 幻觉）从未真正提前，安全排序形同虚设。
  const mainPool = multidimQuestions.filter((q) => q.kind === "main");
  const tierOf = (trait: string) => SEVERE_WEIGHT[trait] || 1;
  const mains = [...new Set(mainPool.map((q) => tierOf(q.trait)))]
    .sort((a, b) => b - a)
    .flatMap((w) => shuffled(mainPool.filter((q) => tierOf(q.trait) === w), rnd));

  // 极简自测：全部 20 个核心主问，每维度一题
  if (mode === "light") return mains.slice(0, 20);

  const extras: Record<string, MultidimQuestion[]> = {};
  for (const q of multidimQuestions) {
    if (q.kind === "main" || q.kind === "lie") continue;
    (extras[q.trait] = extras[q.trait] || []).push(q);
  }
  for (const t of Object.keys(extras)) extras[t] = shuffled(extras[t]!, rnd);

  const extraPer = EXTRA_PER[mode];
  const seq = mains.slice();
  const order = mains
    .map((q) => q.trait)
    .concat(Object.keys(extras).filter((t) => !mains.some((q) => q.trait === t)));
  const quota = MULTIDIM_BASE_MAINS + Object.keys(extras).length * extraPer;
  let guard = 0;
  while (seq.length < quota && guard++ < 3000) {
    let added = false;
    for (const t of order) {
      if (seq.length >= quota) break;
      const pool = extras[t];
      if (pool && pool.length > 0) {
        seq.push(pool.pop()!);
        added = true;
      }
    }
    if (!added) break;
  }

  // 效度题均匀插入主问区之后（避开前 20 道主问）
  const lies = shuffled(
    multidimQuestions.filter((q) => q.kind === "lie"),
    rnd,
  );
  const lieStart = MULTIDIM_BASE_MAINS + 1;
  const lieSpan = Math.max(seq.length - lieStart - 2, 10);
  const positions = [0.18, 0.4, 0.6, 0.8, 0.94]
    .map((p) => Math.min(seq.length - 1, lieStart + Math.round(lieSpan * p)))
    .sort((a, b) => b - a);
  for (let i = 0; i < lies.length; i++) {
    seq.splice(positions[i]!, 0, lies[i]!);
  }
  return seq.slice(0, quota + lies.length);
}
