import { psyAgeQuestions } from "../questions/psy-age-questions";
import type { ScoringResult } from "../score";

const LIKERT_MIN = 1;
const LIKERT_MAX = 5;
const NEUTRAL = 3;
// 相对生理年龄判断"偏年轻/平衡/偏成熟"的阈值（岁）
const DIFF_YOUNG = -10;
const DIFF_OLD = 10;
// 未填写生理年龄时使用的固定分档
const FIXED_YOUNG = 28;
const FIXED_OLD = 48;
const DUO_THRESHOLD = 60;

const DIMENSIONS = [
  { key: 'cog', name: '认知活力', short: '认知', role: 'youth',  minAge: 16, maxAge: 56, weight: 0.16, cluster: 'youth',    about: '好奇心、认知弹性与学习取向' },
  { key: 'emo', name: '情绪成熟', short: '情绪', role: 'mature', minAge: 16, maxAge: 42, weight: 0.15, cluster: 'maturity', about: '情绪调节能力与情绪洞察' },
  { key: 'prd', name: '审慎自律', short: '审慎', role: 'mature', minAge: 16, maxAge: 46, weight: 0.14, cluster: 'maturity', about: '冲动控制与延迟满足' },
  { key: 'fut', name: '未来导向', short: '时间观', role: 'mature', minAge: 16, maxAge: 44, weight: 0.12, cluster: 'maturity', about: '时间观：当下享乐 vs 长远规划' },
  { key: 'soc', name: '社会开放', short: '社会', role: 'youth',  minAge: 16, maxAge: 54, weight: 0.12, cluster: 'youth',    about: '对新关系、新文化的开放度' },
  { key: 'vit', name: '活力体能', short: '活力', role: 'youth',  minAge: 16, maxAge: 56, weight: 0.15, cluster: 'youth',    about: '精力水平与身体活动意愿' },
  { key: 'res', name: '责任担当', short: '责任', role: 'mature', minAge: 16, maxAge: 60, weight: 0.16, cluster: 'none',     about: '责任心、承诺感与稳定性（不计入年龄）' }
];

const DUO = {
  maturity: { name: '成熟度', dims: ['emo', 'prd', 'fut'] },
  youth: { name: '少年感', dims: ['cog', 'soc', 'vit'] },
};

const ARCHETYPES = [
  { id: 'chizi', m: 1, y: 1, title: '赤子之心型', short: '成熟与童心兼备', text: '这是最难得的状态：既看清了世事（成熟度），又没弄丢好奇活泼的童心（少年感）。孟子说"大人者，不失其赤子之心者也"——真正的成熟不是变得世故，而是看懂了世界之后，仍然愿意像孩子一样去好奇、去热爱。请珍惜这种平衡，它是很多人一生都在寻找的。' },
  { id: 'shishi', m: 1, y: 0, title: '世事洞明型', short: '通透有余，童心欠费', text: '你看世界的眼光已经相当通透：情绪稳定、懂得取舍、计划长远。这份成熟是真实的、可贵的。但如果少年感偏低，也许是生活把你"稳"住了——提醒自己：成熟不等于疲惫，偶尔安排一点"没意义但开心"的事，给童心放个假。' },
  { id: 'tianzhen', m: 0, y: 1, title: '天真烂漫型', short: '少年气十足', text: '你身上有满满的少年气：好奇、爱玩、精力旺盛、乐意结交新朋友。这是极珍贵的生命力。如果成熟度暂时偏低，通常只是"经历还在积累"——世界还欠你一些磨砺，而你恰好有的是时间去接住它。' },
  { id: 'mihang', m: 0, y: 0, title: '迷航待航型', short: '两轴都在蓄力', text: '你现在可能正处于"两头都不太够"的阶段：既感觉不到通透，也没多少冲劲。这通常不是人格问题，而是阶段性的——累了、忙了、迷茫了。别急着给自己贴标签，先恢复状态，两条轴都会慢慢回来。' }
];

const RESPONSIBILITY = {
  title: '担当力',
  note: '责任感是"担当"，不是"年龄"——它反映你靠不靠谱、扛不扛事，但不参与心理年龄计算。',
  levels: [
    { max: 2.49, label: '尚在成长', bandKey: 'young' },
    { max: 3.49, label: '担当适中', bandKey: 'balanced' },
    { max: 5.01, label: '担当稳健', bandKey: 'old' },
  ],
};

const BALANCE_TEXT = [
  { max: 6, label: '非常均衡', text: '你的六个维度心理年龄彼此接近，说明你的心理状态在"青春"与"成熟"之间分布得很均匀，没有明显的跷跷板。' },
  { max: 11, label: '有一定分化', text: '你的维度之间有差异：有的层面偏年轻、有的偏成熟。这不是问题——大多数人都是如此，分化本身恰恰说明你有弹性。' },
  { max: 99, label: '两极分化明显', text: '你在不同维度上的心理年龄差异较大：有些层面充满少年气，有些层面却相当老练。这种"冰与火"的组合会让你在不同场合表现出截然不同的面貌——关键在于何时调用哪一面。' },
];

const BAND_LABEL: Record<string, string> = { young: '偏年轻', balanced: '均衡', old: '偏成熟' };

const BANDS: Record<string, Record<string, string>> = {
  cog: {
  young: '你的认知风格更像充满探索欲的少年：对新事物天然开放、学习速度快。研究显示，这种快速学习与灵活切换的能力（接近 Cattell 所说的"流体智力"）通常是年轻心理状态的标志。建议：在保持输入新鲜感的同时，也让经验沉淀为判断力——把学到的变成用得上的。',
  balanced: '你的好奇心与经验储备取得了不错的平衡：既愿意尝试新事物，也能借助过往经验做判断。这接近"流体智力"与"晶体智力"相互配合的理想状态——既能快速上手，也有厚度。',
  old: '你的认知风格偏保守求稳，习惯用熟悉的路径解决问题。这不一定差——经验与直觉常常更高效（"晶体智力"随年龄积累），但建议偶尔主动接触完全陌生的领域，哪怕只是学一个无关的小技能，也能保持大脑可塑性的激活。'
  },
  emo: {
  young: '你的情绪反应偏向直接和即时：来得快、去得也快，比较容易被他人的评价带动。这在人生早期很常见，本身没有对错。可以练习"先给情绪命名、再决定行动"——给情绪一个缓冲，会大幅减少冲动后的内耗。',
  balanced: '你能在情绪与理性之间灵活切换：既允许自己感受，也能在关键时刻稳住。研究显示情绪稳定性普遍随年龄增长而提高，你正处在健康的轨道上。',
  old: '你的情绪非常稳定，很少被外界扰动，甚至习惯独自消化情绪。这是成熟的重要标志，但请留意是否过度压抑——真正的成熟是"能放下"，而不是"不需要"。偶尔允许情绪出来透气，也是健康的一部分。'
  },
  prd: {
  young: '你倾向于凭直觉和冲动行动，喜欢即时满足。冲动控制与大脑前额叶的成熟度密切相关，通常随年龄发展。建议在做重要决定前给自己设置一个"冷静期"——哪怕只是睡一觉再说。',
  balanced: '你懂得在"想要"和"需要"之间权衡：既能享受当下的快乐，也能控制住冲动。这是冲动性与审慎性协调良好的表现，也是许多成人仍在学习的功课。',
  old: '你高度审慎、凡事三思，延迟满足能力强，这让你非常可靠。但若审慎过头，可能错过本应尝试的体验。偶尔允许自己"冲动一次"——一次说走就走的旅行，或一个计划之外的爱好——也是心理弹性的体现。'
  },
  fut: {
  young: '你活在当下，优先即时体验，很少为长远做打算。按 Zimbardo 与 Boyd 的时间观理论，这是典型的"当下享乐"取向：它让你擅长享受生活、不内耗，但适当把目光放远一点——哪怕只是存一笔小钱、规划一次学习——会显著减少未来的焦虑。',
  balanced: '你既能享受此刻，也会为未来打算——这正是 Zimbardo 和 Boyd 提出的"平衡时间观"，是与幸福感相关的最理想时间观组合之一：不被过去拖累，不为未来焦虑，也不错过当下。',
  old: '你高度未来导向，凡事为长远打算，延迟满足能力强，这让你的生活有掌控感。但过度规划未来可能牺牲当下的快乐——请记住：未来由无数个当下组成，偶尔"奖励当下"不是失策，而是可持续策略。'
  },
  soc: {
  young: '你乐于认识新朋友、拥抱新文化，社交弹性很高。对新经验保持开放（大五人格中的"开放性"）通常与更年轻的主观年龄相关。这是一份珍贵的心理资源，能让你的世界持续变大。',
  balanced: '你既保有与老朋友的深厚联结，也愿意结识新的人和事。社会关系在"深度"与"广度"之间保持均衡——这是成熟而开放的状态，既有归属感，也有新鲜感。',
  old: '你更偏好熟悉的人际圈子和熟悉的事物，对新社交场景兴致不高。这与"社会情绪选择理论"中偏晚期的特征一致——人们会更聚焦少数有意义的关系。只要内心满足，就无可厚非；但偶尔伸出一只脚到新圈子，可能有意想不到的收获。'
  },
  vit: {
  young: '你的精力水平和身体活动意愿都很高，这是生理与心理活力俱佳的信号。大量纵向研究发现，"感觉自己年轻"与更好的身体功能、更长的健康寿命相关。请继续保持规律运动。',
  balanced: '你的精力处于健康水平：既能投入高强度的活动，也懂得适时休息。这种"知道何时充电"的节律感，本身是一种成熟。',
  old: '你常感到疲惫、对体力活动兴致不高。这可能是生活节奏或状态使然，值得认真关注：规律运动——哪怕只是每天散步二十分钟——都能显著改善主观精力与情绪，效果常在几周内可见。'
  },
  res: {
  young: '你的责任心还在"生长中"：习惯自由、抗拒束缚，对承诺和截止日期比较随性。责任感会随年龄稳步上升，不必苛责自己；但可以从小处开始练习——先守住一个小承诺，把它变成习惯。',
  balanced: '你在自由与责任之间找到了舒服的平衡：对自己负责，也乐于对他人负责，同时不失去松弛感。这种"靠谱而不紧绷"的状态，是最让人感到安心的品质之一。',
  old: '你是那个"靠谱担当"的存在，常常是团队与家庭的压舱石。这是最被社会珍视的特质之一。但请留意，别把责任全揽在自己身上——学会放手与求助，同样是成熟的一部分，甚至更重要。'
  },
};

const HOW_TO_READ = [
  '心理年龄不是一条线，而是两条独立的轴：成熟度（认清世事）与少年感（永葆童心）。它们可以同时很高——正如"看清世界"与"童心未泯"可以共存，这也是最理想的状态。',
  '心理年龄是"画像"，不是"标签"。它由多个维度加权合成，任何单一数字（包括顶部那个概括值）都只是参考，请以双轴画像和逐维度解析为准。',
  '责任担当不计入年龄——它是"担当"而非"年龄"，单独立卡展示。',
  '如果你年纪较轻，绝对的心理年龄数字往往会显得偏大——它是按"典型成年人"校准的。请以"与生理年龄的差值"和双轴画像为准，而不是只盯着那个数字。',
  '心理年龄反映的是"当前状态"，不是固定宿命。主观年龄会随生活事件、压力、关系与作息而波动，也可以被主动调整——运动、学习新事物、建立新关系、练习情绪觉察，都是被研究支持的调整方式。'
];

const BASIS_INTRO = '本测验的维度与计分方式并非凭空设计，而是从多个经同行评议的发展心理学与人格心理学框架中提炼而来。参考文献按 GB/T 7714-2015 著录，供你进一步查阅；每条下方附"引用说明"解释其与本测验的关系。';

const REFERENCES = [
  { type: 'M', authors: 'BIRREN J E, CUNNINGHAM W R', year: '1985', title: 'Research on the psychology of aging: principles, concepts and theory', container: 'In J. E. Birren & K. W. Schaie (Eds.), Handbook of the psychology of aging (2nd ed.)', publisher: 'New York: Van Nostrand Reinhold', note: '首次系统提出"生物年龄 / 心理年龄 / 社会年龄"三维度划分，将心理年龄定义为个体适应环境变化的"适应能力"——本测验七个维度的总框架来源。' },
  { type: 'M', authors: 'BALTES P B, REESE H W', year: '1984', title: 'The life-span perspective in developmental psychology', container: 'In M. H. Bornstein & M. E. Lamb (Eds.), Developmental psychology: an advanced textbook', publisher: 'Hillsdale, NJ: Lawrence Erlbaum Associates', note: '毕生发展观：发展贯穿一生、多方向且具有可塑性——"心理年龄是动态画像而非固定标签"的理论基础。' },
  { type: 'J', authors: 'KOTTER-GRÜHN D, KORNATD A E, STEPHAN Y', year: '2016', title: 'Looking beyond chronological age: current knowledge and future directions in the study of subjective age', journal: 'Gerontology', volume: '62', issue: '1', pages: '86-93', doi: '10.1159/000438671', note: '主观年龄研究综述："感觉多年轻"能预测身心健康与长寿。这是本测验"社会开放 / 活力体能"维度及结尾自感年龄的直接依据。' },
  { type: 'J', authors: 'ZIMBARDO P G, BOYD J N', year: '1999', title: 'Putting time in perspective: a valid, reliable individual-differences metric', journal: 'Journal of Personality and Social Psychology', volume: '77', issue: '6', pages: '1271-1288', doi: '10.1037/0022-3514.77.6.1271', note: 'ZTPI 时间观量表：提出"当下享乐—未来导向—过去取向"等因子与"平衡时间观"。"未来导向"维度据此构建。' },
  { type: 'J', authors: 'CATTELL R B', year: '1963', title: 'Theory of fluid and crystallized intelligence: a critical experiment', journal: 'Journal of Educational Psychology', volume: '54', issue: '1', pages: '1-22', doi: '10.1037/h0046743', note: '流体智力（快速学习、灵活推理，随年龄先升后降）与晶体智力（经验积累）的经典区分——"认知活力"维度的理论依据。' },
  { type: 'J', authors: 'ROBERTS B W, MROCZEK D', year: '2008', title: 'Personality trait change in adulthood', journal: 'Current Directions in Psychological Science', volume: '17', issue: '1', pages: '31-35', doi: '10.1111/j.1467-8721.2008.00543.x', note: '人格成熟化研究：尽责性、情绪稳定性通常随年龄稳步上升——"审慎自律"与"责任担当"维度的依据。' },
  { type: 'J', authors: 'CARSTENSEN L L', year: '2006', title: 'The influence of a sense of time on human development', journal: 'Science', volume: '312', issue: '5782', pages: '1913-1915', doi: '10.1126/science.1127488', note: '社会情绪选择理论：当人感知时间有限时会更聚焦少数有意义的情绪目标——解释"社会开放"维度中偏年长者更专注的关系偏好。' },
  { type: 'J', authors: 'MCCRAE R R, COSTA P T', year: '1997', title: 'Personality trait structure as a human universal', journal: 'American Psychologist', volume: '52', issue: '5', pages: '509-516', doi: '10.1037/0003-066X.52.5.509', note: '大五人格跨文化普遍性：开放性、尽责性等维度为人格结构提供参照。' },
  { type: 'M', authors: 'ERIKSON E H', year: '1963', title: 'Childhood and society', edition: '2nd ed.', publisher: 'New York: W. W. Norton', note: '心理社会发展八阶段："繁殖感 vs 停滞"等阶段任务为"成熟"与"责任"提供发展心理学背景。' },
  { type: 'J', authors: 'STEPHAN Y, SUTIN A R, TERRACCIANO A', year: '2017', title: 'Feeling older and risk of hospitalization: evidence from three longitudinal cohorts', journal: 'Health Psychology', volume: '36', issue: '6', pages: '634-637', doi: '10.1037/hea0000488', note: '纵向研究：自感年龄偏大者的住院与健康风险更高——主观年龄不是"感觉而已"，它有可测量的健康后果。' }
];

const DISCLAIMER = '免责声明：本测验为自我探索用途的趣味测评。题目改编自公开发表的心理学框架，但并非标准化临床量表，结果不构成诊断、评估或替代专业心理咨询。如果你正经历持续的情绪困扰，请寻求专业心理从业者的帮助。';

export function scorePsyAge(answers: Record<number, number>): ScoringResult {
  // 生理年龄（可不填，末尾 number 题 id=43）
  let chrono: number | null = null;
  {
    const raw = answers[43];
    if (typeof raw === 'number' && raw >= 6 && raw <= 99) chrono = raw;
  }

  // 7 个维度的特质分（反向题先转换；缺答按中立 3）
  const dims = DIMENSIONS.map((d) => {
    const qs = psyAgeQuestions.filter((q) => q.dimension === d.key);
    const vals = qs.map((q) => {
      const raw = answers[q.id];
      const v = raw == null ? NEUTRAL : raw;
      return q.reverse ? LIKERT_MAX + LIKERT_MIN - v : v;
    });
    const trait = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : NEUTRAL;
    return { ...d, trait };
  });

  // 责任担当不计入年龄
  const ageDims = DIMENSIONS.filter((d) => d.cluster !== 'none');

  const bandFor = (age: number): string => {
    if (chrono != null) {
      const diff = age - chrono;
      if (diff <= DIFF_YOUNG) return 'young';
      if (diff >= DIFF_OLD) return 'old';
      return 'balanced';
    }
    if (age <= FIXED_YOUNG) return 'young';
    if (age >= FIXED_OLD) return 'old';
    return 'balanced';
  };

  // 各维度心理年龄
  const ages: Record<string, number> = {};
  dims.forEach((d) => {
    if (d.cluster === 'none') { ages[d.key] = 0; return; }
    const M = d.role === 'mature' ? d.trait : LIKERT_MAX + LIKERT_MIN - d.trait;
    ages[d.key] = d.minAge + (M - LIKERT_MIN) / (LIKERT_MAX - LIKERT_MIN) * (d.maxAge - d.minAge);
  });

  const withAge = ageDims.map((d) => ({
    key: d.key, name: d.name, short: d.short, about: d.about, role: d.role,
    age: ages[d.key]!, band: bandFor(ages[d.key]!),
  }));

  const totalW = ageDims.reduce((s, d) => s + d.weight, 0);
  const basePsychAge = ageDims.reduce((s, d) => s + ages[d.key]! * d.weight / totalW, 0);
  const psychAge = basePsychAge; // 本平台不采集作答节律，不做犹豫修正
  const sd = Math.sqrt(withAge.reduce((s, d) => s + Math.pow(d.age - basePsychAge, 2), 0) / withAge.length);

  // 双轴：成熟度 × 少年感
  const meanTrait = (keys: string[]) => {
    const vals = keys.map((k) => dims.find((x) => x.key === k)?.trait ?? NEUTRAL);
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  };
  const toPct = (v: number) => (v - LIKERT_MIN) / (LIKERT_MAX - LIKERT_MIN) * 100;
  const maturity = toPct(meanTrait(DUO.maturity.dims));
  const youth = toPct(meanTrait(DUO.youth.dims));
  const mHi = maturity >= DUO_THRESHOLD;
  const yHi = youth >= DUO_THRESHOLD;
  const archetype = ARCHETYPES.find((a) => a.m === (mHi ? 1 : 0) && a.y === (yHi ? 1 : 0))
    ?? ARCHETYPES[ARCHETYPES.length - 1]!;

  // 责任担当（不计入年龄）
  const resDim = dims.find((x) => x.cluster === 'none');
  const resTrait = resDim ? resDim.trait : NEUTRAL;
  const resLevelObj = RESPONSIBILITY.levels.find((l) => resTrait <= l.max)
    ?? RESPONSIBILITY.levels[RESPONSIBILITY.levels.length - 1]!;
  const resLevel = resLevelObj.label!;
  const resBandKey = resLevelObj.bandKey!;

  // 平衡度
  const balanceObj = BALANCE_TEXT.find((b) => sd <= b.max)
    ?? BALANCE_TEXT[BALANCE_TEXT.length - 1]!;
  const balance = { label: balanceObj.label!, text: balanceObj.text! };

  // 与生理年龄的差值
  const diff = chrono != null ? psychAge - chrono : null;
  const diffLabel = (() => {
    if (diff == null) return '—';
    const d = Math.round(diff);
    if (d === 0) return '相当';
    return d < 0 ? '小 ' + (-d) + ' 岁' : '大 ' + d + ' 岁';
  })();

  const describe = (() => {
    if (chrono != null) {
      const d = psychAge - chrono;
      if (d <= -12) return '显著年轻于你的实际年龄';
      if (d <= -5) return '比你的实际年龄年轻';
      if (d < 5) return '与你实际年龄相当';
      if (d < 12) return '比你的实际年龄成熟';
      return '显著成熟于你的实际年龄';
    }
    if (psychAge <= 25) return '显著的年轻态';
    if (psychAge <= 35) return '偏年轻的心理状态';
    if (psychAge <= 45) return '中年的平衡状态';
    if (psychAge <= 55) return '偏成熟的心理状态';
    return '显著的成熟态';
  })();

  const heroNote = (() => {
    if (diff != null) {
      const d = Math.round(diff);
      const rel = d === 0 ? '相当' : (d < 0 ? '年轻 ' + (-d) + ' 岁' : '成熟 ' + d + ' 岁');
      return '你的心理年龄比生理年龄' + rel + '。这个概括值由 6 个年龄相关维度（不含责任担当）加权合成，只是一个参考——请以"成熟度 × 少年感"双轴画像为准。';
    }
    return '这是由 6 个年龄相关维度加权合成的概括值，只是一个参考——请以"成熟度 × 少年感"双轴画像为准。';
  })();

  const dimList = withAge.map((d) => ({
    key: d.key, name: d.name, short: d.short, about: d.about,
    age: Math.round(d.age), band: d.band,
    bandLabel: BAND_LABEL[d.band]!,
    bandText: BANDS[d.key]?.[d.band] ?? '',
  }));

  return {
    totalScore: Math.round(psychAge),
    maxScore: 100,
    level: archetype.short!,
    suggestion: HOW_TO_READ.join("\n"),
    severity: 0,
    psyAgeReport: {
      psychAge: Math.round(psychAge),
      basePsychAge: Math.round(basePsychAge * 10) / 10,
      descriptor: archetype.short!,
      describe,
      chrono,
      diff: diff == null ? null : Math.round(diff),
      diffLabel,
      heroNote,
      archetype: { id: archetype.id!, title: archetype.title!, short: archetype.short!, text: archetype.text! },
      maturity: Math.round(maturity),
      youth: Math.round(youth),
      mHi,
      yHi,
      resLevel,
      resBandKey,
      resTrait: Math.round(resTrait * 10) / 10,
      responsibilityNote: RESPONSIBILITY.note!,
      balance,
      dims: dimList,
      howToRead: HOW_TO_READ,
      basisIntro: BASIS_INTRO,
      references: REFERENCES,
      disclaimer: DISCLAIMER,
    },
  };
}
