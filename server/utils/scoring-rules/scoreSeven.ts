// 七美德与七宗罪 · 计分
// 模型：7 宗罪与 7 美德是 14 条【独立】维度，分开测量、互不抵消。
// 罪孽指数 / 美德指数为两个独立分数；罪德共存卡标出“双高”组合。
// 全部正向计分：同意 = 该维度浓度高（Likert 1-5），缺失按中立 3 处理。
// 浓度 = 维度均分映射到 0-100（(均分-1)/4*100）。
// 计分阈值：low < 40，high >= 70，coexist >= 55。
import { sevenQuestions } from "../questions/seven-questions";
import type { ScoringResult } from "../score";

const SINS = [{"key":"pride","name":"傲慢","icon":"🦚","en":"PRIDE","tag":"不可一世 · 目中无人"},{"key":"greed","name":"贪婪","icon":"💰","en":"GREED","tag":"欲壑难填 · 多拿多占"},{"key":"lust","name":"色欲","icon":"🌹","en":"LUST","tag":"心动失控 · 欲壑难平"},{"key":"envy","name":"嫉妒","icon":"🍋","en":"ENVY","tag":"暗中比较 · 眼红他人"},{"key":"gluttony","name":"暴食","icon":"🍔","en":"GLUTTONY","tag":"欲罢不能 · 吃之无度"},{"key":"wrath","name":"暴怒","icon":"💥","en":"WRATH","tag":"一点就炸 · 火上心头"},{"key":"sloth","name":"懒惰","icon":"🛋️","en":"SLOTH","tag":"明日复明 · 迟迟不动"}];
const VIRTUES = [{"key":"humility","name":"谦卑","icon":"🤲","en":"HUMILITY","paired":"pride","tag":"虚怀若谷 · 知之为知"},{"key":"generosity","name":"慷慨","icon":"🎁","en":"GENEROSITY","paired":"greed","tag":"乐善好施 · 给得起"},{"key":"chastity","name":"贞洁","icon":"🕊️","en":"CHASTITY","paired":"lust","tag":"守心如玉 · 界限分明"},{"key":"kindness","name":"仁爱","icon":"💝","en":"KINDNESS","paired":"envy","tag":"与人为善 · 真心祝福"},{"key":"temperance","name":"节制","icon":"⚖️","en":"TEMPERANCE","paired":"gluttony","tag":"知止不殆 · 够即止"},{"key":"patience","name":"忍耐","icon":"🧘","en":"PATIENCE","paired":"wrath","tag":"静水流深 · 火熄于心"},{"key":"diligence","name":"勤奋","icon":"🔨","en":"DILIGENCE","paired":"sloth","tag":"行胜于言 · 说到做到"}];
const PAIRS: [string, string][] = [["pride","humility"],["greed","generosity"],["lust","chastity"],["envy","kindness"],["gluttony","temperance"],["wrath","patience"],["sloth","diligence"]];
const SIN_NOTES: Record<string, string> = {"pride":"你最突出的罪是傲慢：你相信自己是特别的，也最难承认自己是错的。","greed":"你最突出的罪是贪婪：你总觉得自己拥有的还不够。","lust":"你最突出的罪是色欲：欲望和心动的吸引力，常常盖过你的判断。","envy":"你最突出的罪是嫉妒：别人的幸福，是你心里那杆秤的砝码。","gluttony":"你最突出的罪是暴食：你习惯用「满足口腹」来补偿其他空缺。","wrath":"你最突出的罪是暴怒：你的火气来得快，烧得也快。","sloth":"你最突出的罪是懒惰：你想要的很多，动手的很少。"};
const VIRTUE_NOTES: Record<string, string> = {"humility":"你的守护美德是谦卑：你认得清自己，也听得进别人。","generosity":"你的守护美德是慷慨：你满足，也乐于分享。","chastity":"你的守护美德是贞洁：你对欲望有清醒的边界。","kindness":"你的守护美德是仁爱：你能真心为别人的好而高兴。","temperance":"你的守护美德是节制：你懂得「够了」在哪里。","patience":"你的守护美德是忍耐：你的脾气能被你驯服。","diligence":"你的守护美德是勤奋：你说到做到，机会来了敢伸手。"};
const SIN_TIERS = [{"max":20,"label":"圣洁之躯","text":"你的罪孽指数低得不像凡人。要么你真的清心寡欲，要么你把所有的「恶念」都藏得连自己都骗过了。无论哪种，都请保持呼吸——圣徒也是从凡人修出来的。"},{"max":40,"label":"凡人常态","text":"你和大多数人一样：会嘴馋、会偷懒、会吃醋、会发火，但都点到为止。这些不是罪，是活人的痕迹。七宗罪本来就是写给所有人的。"},{"max":60,"label":"罪业缠身","text":"你的七宗罪已经初具规模：某几条特别突出，其余的也蠢蠢欲动。别担心——看见哪条最重，就从哪条开始谈，这就是它存在的意义。"},{"max":80,"label":"七罪俱全","text":"你的罪业已经集齐了五六七八张卡：贪、嗔、痴、慢、疑，你至少占了四样。不过请记住：知道自己是什么样的人，比假装自己是圣徒更接近清醒。"},{"max":100,"label":"魔王转世","text":"你几乎把七宗罪当成了个人简历。很好，你是本周的限定反派。请带着这个头衔去看下面的逐维详解——然后想想，哪一条其实是你给自己披的保护色。"}];
const VIRTUE_TIERS = [{"max":20,"label":"尚在暗处","text":"你的美德指数低得惊人——不是你没有美德，是它还没找到出场的时机。别急，美德往往在需要它的时候才现身。"},{"max":40,"label":"微光初现","text":"你的美德正在积累：有一点善良、一点耐心、一点自律，但还不够稳定。它们像种子，需要被看见和使用才会长大。"},{"max":60,"label":"中人之德","text":"你的美德在正常范围：会分享、会忍耐、会守约，但也会犯懒、发火、眼红。这是活人的常态——德行不是完美，是在偏差里一次次回来。"},{"max":80,"label":"德性丰沛","text":"你的美德相当丰沛：慷慨、耐心、自律常常在线。你可能是那种朋友出事会第一个到场的人。请继续保持，也别忘了偶尔给自己放个假。"},{"max":100,"label":"圣人气象","text":"你的美德浓度高得几乎不像凡人。要么你真的宅心仁厚，要么你把「好人」人设维持得滴水不漏。无论是哪种，都请小心：圣人也会累，记得给自己留一点「坏脾气」。"}];
const SIN_BANDS: Record<string, { low: string; mid: string; high: string }> = {"pride":{"low":"你在这一条上相当清醒：能欣赏自己，也认得清自己的位置，被夸奖时不飘，被批评时也听得进去。这不叫没有傲慢，叫傲慢被养得很小。","mid":"你有一点「小骄傲」：喜欢被认可，偶尔会为自己得意，但整体不失分寸。这种健康的自尊恰恰是心理弹性的来源，只要别让它膨胀成「我永远是对的」。","high":"你的傲慢潜伏得挺深：很难认错，习惯性地觉得「我比他们都强」，被批评时第一反应是反击而不是反省。傲慢真正的代价不是坠落，而是听不见任何人的声音。试着承认一次「我错了」，世界不会塌。"},"greed":{"low":"你在这一条上很淡：对物质和好处没有执念，也不觉得「拿得不够」。贪婪的克星是满足感，而你似乎天生满足。这份「够了」的底气，是很多人求之不得的自由。","mid":"你有一点正常的「想要」：看到好处会心动，也会算计，但不会为了占有而失去分寸。适度地想要更好的生活，是人类进步的动力，只要它不反过来奴役你。","high":"你对「拥有」的胃口很大：总觉得自己拿得不够，分到好处时先算自己亏没亏，甚至会为了多占而费心算计。贪婪的可怕之处在于永不满足——得到越多，越觉得缺。试着把一次「得到」换成一次「给出」，你会尝到另一种满足。"},"lust":{"low":"你在这一条上很节制：对诱惑有清晰的边界，更看重安稳与长久，不容易被一时的心动牵着走。欲望对你来说不是洪水，是偶尔泛起的小浪。","mid":"你对「心动」有正常的分寸：会被吸引、会心动，但知道什么该止步。欲望本身没有错，它是生命力的一部分——关键在于你决定它，而不是它决定你。","high":"你很容易被欲望牵引：对吸引你的人或事投入大量注意力，有时明知不该仍难收住。这一宗罪真正的问题不是「有欲」，而是「失控」。给欲望一个清醒的边界——满足它和纵容它，是两回事。"},"envy":{"low":"你在这一条上很干净：真心为别人的好运气高兴，不比较，不眼红。嫉妒的土壤是「我缺」，而你似乎对自己的生活足够满意。这种不嫉妒是关系里最珍贵的润滑剂。","mid":"你有一点正常的酸：看到熟人过得好，心里会咯噔一下，但很快能平复，也能真诚祝福。这种健康的比较有激励作用——它提醒你，你也可以更好。只要别让它沉淀成长期的暗流。","high":"你心里有一架天平，总在称量别人的幸福和自己的落差：别人晒的生活让你不舒服，朋友的成就让你想比较。嫉妒烧的是别人的火，耗的却是你的能量。把目光从别人的跑道收回来，专注自己的赛程。"},"gluttony":{"low":"你在这一条上很自律：再喜欢的东西也能浅尝辄止，不容易被口腹之欲控制。欲望的闸门在你手里，而不是在胃里。","mid":"你享受美食，也会偶尔放纵，但大多时候能收住。会嘴馋、会吃撑、会后悔，这是所有凡人的日常。只要「偶尔」不变成「总是」，你就还在健康的轨道上。","high":"你在「吃」这件事上容易失控：好吃就停不下来，常常吃到撑，心情不好时更是习惯用食物填自己。暴食的本质往往不是馋，而是情绪——用胃去堵心里的洞。试着在伸手拿下一口之前，先问自己「我到底饿，还是烦？」"},"wrath":{"low":"你在这一条上很稳：被激怒时也能先按下来，不轻易失控，给别人也给自己留余地。这种「忍得住的脾气」是真正有力量的情绪管理——不是没有火，是火被驯服了。","mid":"你有正常范围的脾气：会发火，但发完就过，不记恨，也不升级。愤怒是人最诚实的警报器之一，它提醒你边界被碰了。关键是报警之后，别按着警报器不放。","high":"你的愤怒阈值很低：一点火星就能点燃，气头上说出的话比想的难听十倍，事后又常后悔。暴怒的火焰烧的是关系，也是你自己。下次火气上来时，先深呼吸六秒再开口——把「想砸东西」换成「想清楚自己到底在气什么」。"},"sloth":{"low":"你在这一条上相当勤勉：答应自己的事会兑现，机会来了会主动伸手。行动的意愿在你这里很充足，懒惰几乎没有落脚的地方。","mid":"你有时会拖延，有时会犯懒，但重要的事终会完成。会摸鱼、会赖床、会把事拖到最后一刻，这是大多数人的常态。只要别让「拖延」变成「永远不动」，你就还在轨道上。","high":"你深谙「明日复明日」：计划做了一堆，动手的没几个，明明知道该做却总被沙发和手机勾走。懒惰（acedia）在中世纪有个更重的名字叫「灵性倦怠」——不是不努力，是失去了行动的意愿。试着把「我要做完」改成「我先做五分钟」，很多事一旦开始，就没那么可怕。"}};
const VIRTUE_BANDS: Record<string, { low: string; mid: string; high: string }> = {"humility":{"low":"你的谦卑还在积蓄中：承认「我不懂」、接受比自己年轻的人指点，对你来说并不容易。这不一定是坏事——健康的自我价值感也需要一点「我配得上」的底气。关键是别让「不服」变成「听不见」。","mid":"你有一点谦逊的分寸：该虚心时虚心，该坚持时坚持。你能在「承认自己」和「维护自己」之间找到平衡，这是很成熟的状态。","high":"你的谦卑相当真：认错不扭捏，请教不羞耻，出了风头能回到人群里。谦卑不是贬低自己，而是「我清楚我是谁」——你显然清楚，而且这让你的自信更稳。"},"generosity":{"low":"你的慷慨还不常出勤：分享对你来说像是「割肉」，付出前会先盘算。这不一定说明你自私——只是你更需要先确认「我自己的够不够」。试着从一次小的、无压力的给予开始。","mid":"你有时慷慨有时计较：帮得上忙时会出手，但也会权衡。这种「有条件的大方」是大多数人的常态，只要它别在关键时刻缩回去。","high":"你的慷慨相当真实：愿意借出大部分，乐于分享，多付一点也不在意。慷慨的根基是安全感——你显然不缺。这份「给得起」的底气，是人际关系里最稀缺的礼物。"},"chastity":{"low":"你的自持力还在修炼：遇到吸引你的人或事，界限容易被冲破，也容易被一时的心动牵着走。这不是道德问题，是自控资源还没攒够——它和肌肉一样，练了才有。","mid":"你有一点自持的分寸：会被吸引、会心动，但知道什么该止步。你能在「享受心动」和「守住界限」之间拿捏，这是成人的基本功。","high":"你的自持相当稳：对诱惑有清晰的边界，更看重长久的踏实，不容易被一时冲动带偏。这种「守得住」不是无趣，而是把感情的主导权握在自己手里。"},"kindness":{"low":"你的仁爱还不多见：为别人的好事真心高兴、主动陪伴难过的人，对你来说并不顺手。这不一定意味着冷漠——也许只是你习惯把情绪留给自己。试着为别人的好消息说一句真心的「恭喜」。","mid":"你有一点仁爱的温度：多数时候能真心祝福，也会在朋友需要时出现，但偶尔也会酸一下、忙一下。这种「有温度也有私心」的状态很真实。","high":"你的仁爱相当丰沛：真心为别人的好运高兴，主动接住难过的人，把身边人当伙伴而非对手。仁爱的可贵在于它不图回报——你显然是个让人安心的存在。"},"temperance":{"low":"你的节制还在成长：面对喜欢的东西容易失控，说好「只吃一口」却停不下来。节制不是苦行，而是「我知道够在哪」——这条肌肉需要刻意练习。","mid":"你有点节制的分寸：多数时候能收住，偶尔放纵，但不会彻底失控。会嘴馋、会冲动、会后悔，这是凡人的日常——只要别让「偶尔」变成「总是」。","high":"你的节制相当清醒：再喜欢也能浅尝辄止，享受不会打乱计划。节制的本质不是压抑欲望，而是把主导权握回自己手里——你已经做到了。"},"patience":{"low":"你的忍耐还在修炼：遇事容易急，火气上来得快，等不了也忍不了。忍耐不是憋气，而是「我知道结果值得等」——它和情绪调节一样，是可以练的。","mid":"你有一点忍耐的分寸：多数时候能按住火、听完话，但也会被磨得不耐烦。这种「会烦但不炸」的状态是健康的，只要别让烦躁升级成失控。","high":"你的忍耐相当稳：被误会也能先听完解释，进展慢也能耐着性子，别人的失误愿意再给机会。忍耐是力量不是软弱——你显然深谙此道。"},"diligence":{"low":"你的勤奋还在沉睡：答应自己的事容易食言，机会来了习惯等它掉下来。勤奋不是自虐，而是「我知道自己在往哪走」——试着从一个「做完五分钟」的小承诺开始。","mid":"你有一点勤奋的节律：重要的事会完成，但也会拖延、摸鱼、差不多就行。这种「能勤也能懒」的状态是凡人的常态，只要别让懒成为默认选项。","high":"你的勤奋相当扎实：答应的事会兑现，机会来了敢伸手，没有截止也能把事情做完。勤奋的底气是自控，而自控是你最可靠的盟友。"}};
const DISCLAIMER = "免责声明：本测验为娱乐性质的自我探索测评。「七宗罪」「罪孽指数」「美德指数」均为趣味化表述，源自文化传统与流行心理学，并非道德评判，也不构成任何心理或宗教评估。如果你正经历真实的自控困难、情绪困扰或冲动失控，请寻求专业的心理帮助。";

function pct(mean: number): number {
  return Math.round(((mean - 1) / 4) * 100);
}
function bandKey(p: number): "low" | "mid" | "high" {
  return p < 40 ? "low" : p >= 70 ? "high" : "mid";
}
function tierFor(index: number, tiers: { max: number; label: string; text: string }[]) {
  return tiers.find((x) => index <= x.max) ?? tiers[tiers.length - 1]!;
}
function getAnswer(answers: Record<number, number>, id: number): number {
  return answers[id] ?? 3; // 缺答按中立 3
}

export function scoreSeven(answers: Record<number, number>): ScoringResult {
  // 按维度分组
  const group: Record<string, number[]> = {};
  for (const q of sevenQuestions) {
    if (!q.dimension) continue;
    (group[q.dimension] || (group[q.dimension] = [])).push(getAnswer(answers, q.id));
  }
  const conc = (key: string) => {
    const vals = group[key] || [];
    const mean = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 3;
    return pct(mean);
  };

  const sins = SINS.map((s) => {
    const p = conc(s.key);
    const bk = bandKey(p);
    return { ...s, pct: p, band: bk, bandLabel: bk === "low" ? "偏低" : bk === "high" ? "偏高" : "居中", text: SIN_BANDS[s.key]![bk] };
  });
  const virtues = VIRTUES.map((v) => {
    const p = conc(v.key);
    const bk = bandKey(p);
    return { ...v, pct: p, band: bk, bandLabel: bk === "low" ? "萌芽" : bk === "high" ? "丰沛" : "居中", text: VIRTUE_BANDS[v.key]![bk] };
  });

  const sinIndex = Math.round(sins.reduce((a, s) => a + s.pct, 0) / sins.length);
  const virtueIndex = Math.round(virtues.reduce((a, v) => a + v.pct, 0) / virtues.length);

  const dominantSin = [...sins].sort((a, b) => b.pct - a.pct)[0]!;
  const guardianVirtue = [...virtues].sort((a, b) => b.pct - a.pct)[0]!;

  const coexist = PAIRS
    .filter(([s, v]) => conc(s) >= 55 && conc(v) >= 55)
    .map(([sKey, vKey]) => {
      const s = sins.find((x) => x.key === sKey)!;
      const v = virtues.find((x) => x.key === vKey)!;
      return { sin: sKey, sinName: s.name, sinIcon: s.icon, sinPct: s.pct, virtue: vKey, virtueName: v.name, virtueIcon: v.icon, virtuePct: v.pct };
    });

  const sinTier = tierFor(sinIndex, SIN_TIERS);
  const virtueTier = tierFor(virtueIndex, VIRTUE_TIERS);

  const howToRead = [
    "罪与美德不是一体两面，而是两条独立的指标：你可以同时贪财又慷慨、要强又谦卑、又懒又自律——它们互不抵消。",
    "罪孽指数 = 7 宗罪的平均（" + sinIndex + "）；美德指数 = 7 美德的平均（" + virtueIndex + "）。主导之罪是罪端最高者，守护美德是美德浓度最高者。",
    "罪德共存卡标出罪与德同时偏高（≥55）的组合——那是你身上两股力量和平共处的地方。不是矛盾，是完整。",
    "所有维度均为趣味自评，非道德审判、非心理诊断。分数只是镜子，供自省与娱乐。",
  ];

  return {
    totalScore: sinIndex,
    maxScore: 100,
    level: sinTier.label + " · " + virtueTier.label,
    suggestion: howToRead.join("\n\n"),
    severity: 0.3,
    sevenReport: {
      sinIndex,
      virtueIndex,
      sinTier: { label: sinTier.label, text: sinTier.text },
      virtueTier: { label: virtueTier.label, text: virtueTier.text },
      sins,
      virtues,
      dominantSin: { key: dominantSin.key, name: dominantSin.name, icon: dominantSin.icon, pct: dominantSin.pct, note: SIN_NOTES[dominantSin.key]! },
      guardianVirtue: { key: guardianVirtue.key, name: guardianVirtue.name, icon: guardianVirtue.icon, pct: guardianVirtue.pct, note: VIRTUE_NOTES[guardianVirtue.key]! },
      coexist,
      pairs: PAIRS,
      howToRead,
      disclaimer: DISCLAIMER,
    },
  };
}
