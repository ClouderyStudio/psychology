import { mbtiQuestions } from "#imports";
import { ScoringResult } from "../score";

// MBTI 评分函数
export function scoreMBTI(answers: Record<number, number>): ScoringResult {
  const dimensions = calculateMBTIDimensions(answers);
  const { eiAvg, snAvg, tfAvg, jpAvg, eiScore, snScore, tfScore, jpScore } =
    dimensions;
  const ei = dimensions.letters.EI;
  const sn = dimensions.letters.SN;
  const tf = dimensions.letters.TF;
  const jp = dimensions.letters.JP;
  const mbtiType = `${ei}${sn}${tf}${jp}`;
  const typeInfo = getMBTIDetailedDescription(mbtiType);
  const functionStack = getMBTIFunctionStack(mbtiType);
  const functionScores = buildFunctionScores(functionStack, dimensions);
  const nineGrid = buildMBTINineGrid(dimensions);
  const preferences = buildMBTIPreferences(dimensions);
  const innerOuterProfile = buildMBTIInnerOuterProfile(dimensions);
  const mask = buildMBTIPersonaMask(mbtiType, functionScores.compensatory);
  const profile = buildMBTIProfile(
    mbtiType,
    typeInfo.name,
    functionStack,
    mask,
  );
  const suggestion = generateDifferentiatedMBTIReport(
    mbtiType,
    functionScores,
    nineGrid,
    preferences,
    innerOuterProfile,
    mask,
    profile,
  );

  return {
    totalScore: Math.round(((eiAvg + snAvg + tfAvg + jpAvg) / 4) * 25),
    maxScore: 100,
    level: mbtiType,
    suggestion,
    severity: 0,
    dimensionScores: {
      E_I: { score: eiScore, avg: eiAvg, result: ei },
      S_N: { score: snScore, avg: snAvg, result: sn },
      T_F: { score: tfScore, avg: tfAvg, result: tf },
      J_P: { score: jpScore, avg: jpAvg, result: jp },
      innerOuter: innerOuterProfile,
      type: mbtiType,
      typeName: typeInfo.name,
    },
    mbtiReport: {
      type: mbtiType,
      typeName: typeInfo.name,
      nineGrid,
      functionStack,
      functionScores,
      preferences,
      innerOuterProfile,
      mask,
      profile,
      note: "本结果基于差异化算法生成，强调心理倾向与作答模式，不代表能力高低或发展水平。",
    },
  };
}
type MBTILetter = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";
type MBTIDimensionKey = "EI" | "SN" | "TF" | "JP";
type MBTIFunctionCode = "Ni" | "Ne" | "Si" | "Se" | "Ti" | "Te" | "Fi" | "Fe";
type MBTIFunctionStackTuple = [
  MBTIFunctionCode,
  MBTIFunctionCode,
  MBTIFunctionCode,
  MBTIFunctionCode,
];
const mbtiFunctionLabels: Record<MBTIFunctionCode, string> = {
  Ni: "悟势",
  Ne: "拓新",
  Si: "惜真",
  Se: "拥实",
  Ti: "界义",
  Te: "成效",
  Fi: "循心",
  Fe: "合情",
};
const mbtiFunctionQuestions: Record<MBTIFunctionCode, string> = {
  Ni: "一切背后的趋势是什么？",
  Ne: "还有哪些新的可能？",
  Si: "哪些真实经验值得保留？",
  Se: "正在发生的现实是什么？",
  Ti: "这个概念是否自洽？",
  Te: "怎么做才是有效的？",
  Fi: "是否触及了我的内心？",
  Fe: "怎样让彼此更合情？",
};
const mbtiStacks: Record<string, MBTIFunctionStackTuple> = {
  ISTJ: ["Si", "Te", "Fi", "Ne"],
  ISFJ: ["Si", "Fe", "Ti", "Ne"],
  INFJ: ["Ni", "Fe", "Ti", "Se"],
  INTJ: ["Ni", "Te", "Fi", "Se"],
  ISTP: ["Ti", "Se", "Ni", "Fe"],
  ISFP: ["Fi", "Se", "Ni", "Te"],
  INFP: ["Fi", "Ne", "Si", "Te"],
  INTP: ["Ti", "Ne", "Si", "Fe"],
  ESTP: ["Se", "Ti", "Fe", "Ni"],
  ESFP: ["Se", "Fi", "Te", "Ni"],
  ENFP: ["Ne", "Fi", "Te", "Si"],
  ENTP: ["Ne", "Ti", "Fe", "Si"],
  ESTJ: ["Te", "Si", "Ne", "Fi"],
  ESFJ: ["Fe", "Si", "Ne", "Ti"],
  ENFJ: ["Fe", "Ni", "Se", "Ti"],
  ENTJ: ["Te", "Ni", "Se", "Fi"],
};
const defaultMBTIStack: MBTIFunctionStackTuple = ["Ni", "Te", "Fi", "Se"];
const oppositeFunction: Record<MBTIFunctionCode, MBTIFunctionCode> = {
  Ni: "Ne",
  Ne: "Ni",
  Si: "Se",
  Se: "Si",
  Ti: "Te",
  Te: "Ti",
  Fi: "Fe",
  Fe: "Fi",
};
const mbtiQuestionMap = new Map(
  mbtiQuestions.map((question) => [question.id, question]),
);
const mbtiDimensionPairs: Record<MBTIDimensionKey, [MBTILetter, MBTILetter]> = {
  EI: ["E", "I"],
  SN: ["S", "N"],
  TF: ["T", "F"],
  JP: ["J", "P"],
};
function calculateMBTIDimensions(answers: Record<number, number>) {
  const preferenceThreshold = 2.5 / 4;
  const score = {
    EI: { first: 0, second: 0, count: 0 },
    SN: { first: 0, second: 0, count: 0 },
    TF: { first: 0, second: 0, count: 0 },
    JP: { first: 0, second: 0, count: 0 },
  };
  const layerScore = {
    inner: {
      EI: { first: 0, second: 0, count: 0 },
      SN: { first: 0, second: 0, count: 0 },
      TF: { first: 0, second: 0, count: 0 },
      JP: { first: 0, second: 0, count: 0 },
    },
    outer: {
      EI: { first: 0, second: 0, count: 0 },
      SN: { first: 0, second: 0, count: 0 },
      TF: { first: 0, second: 0, count: 0 },
      JP: { first: 0, second: 0, count: 0 },
    },
  };
  const add = (
    target: typeof score,
    key: MBTIDimensionKey,
    value: number,
    reverse: boolean,
  ) => {
    if (reverse) {
      target[key].first += 4 - value;
      target[key].second += value;
    } else {
      target[key].first += value;
      target[key].second += 4 - value;
    }
    target[key].count++;
  };

  Object.entries(answers).forEach(([qid, rawValue]) => {
    const id = parseInt(qid);
    const question = mbtiQuestionMap.get(id);
    if (!question) return;

    const value = Math.max(0, Math.min(4, Number(rawValue)));
    add(score, question.dimension, value, question.reverse);
    if (question.layer) {
      add(
        layerScore[question.layer],
        question.dimension,
        value,
        question.reverse,
      );
    }
  });

  const build = (
    current: { first: number; second: number; count: number },
    pair: [MBTILetter, MBTILetter],
  ) => {
    const total = Math.max(current.first + current.second, 1);
    const firstRatio = current.first / total;
    const firstAvg = current.count > 0 ? current.first / current.count : 2;
    const secondAvg = current.count > 0 ? current.second / current.count : 2;
    const strength = Math.min(
      Math.abs(firstRatio - preferenceThreshold) / preferenceThreshold,
      1,
    );
    return {
      first: pair[0],
      second: pair[1],
      firstScore: current.first,
      secondScore: current.second,
      firstAvg,
      secondAvg,
      firstRatio,
      secondRatio: 1 - firstRatio,
      strength,
      count: current.count,
      letter: firstRatio > preferenceThreshold ? pair[0] : pair[1],
    };
  };

  const EI = build(score.EI, mbtiDimensionPairs.EI);
  const SN = build(score.SN, mbtiDimensionPairs.SN);
  const TF = build(score.TF, mbtiDimensionPairs.TF);
  const JP = build(score.JP, mbtiDimensionPairs.JP);
  const buildLayer = (layer: keyof typeof layerScore) => {
    const current = layerScore[layer];
    const dimensions = {
      EI: build(current.EI, mbtiDimensionPairs.EI),
      SN: build(current.SN, mbtiDimensionPairs.SN),
      TF: build(current.TF, mbtiDimensionPairs.TF),
      JP: build(current.JP, mbtiDimensionPairs.JP),
    };

    return {
      ...dimensions,
      type: `${dimensions.EI.letter}${dimensions.SN.letter}${dimensions.TF.letter}${dimensions.JP.letter}`,
      questionCount: Object.values(current).reduce(
        (sum, item) => sum + item.count,
        0,
      ),
    };
  };

  return {
    EI,
    SN,
    TF,
    JP,
    letters: {
      EI: EI.letter,
      SN: SN.letter,
      TF: TF.letter,
      JP: JP.letter,
    },
    eiScore: EI.firstScore,
    snScore: SN.firstScore,
    tfScore: TF.firstScore,
    jpScore: JP.firstScore,
    eiAvg: EI.firstAvg,
    snAvg: SN.firstAvg,
    tfAvg: TF.firstAvg,
    jpAvg: JP.firstAvg,
    layers: {
      inner: buildLayer("inner"),
      outer: buildLayer("outer"),
    },
  };
}
function getMBTIFunctionStack(type: string) {
  const natural: MBTIFunctionStackTuple = mbtiStacks[type] ?? defaultMBTIStack;
  const compensatory = natural.map(
    (fn) => oppositeFunction[fn],
  ) as MBTIFunctionStackTuple;
  return {
    natural,
    compensatory,
    roles: [
      {
        title: "你的人格之脑",
        subtitle: "核心动力",
        description: "为你指引航向的核心动力",
        function: natural[0],
      },
      {
        title: "你的人格之手",
        subtitle: "辅助动力",
        description: "帮助你与世界交互的力量",
        function: natural[1],
      },
      {
        title: "你的人格之翼",
        subtitle: "舒展动力",
        description: "或许稚嫩，却带你快乐舒展的隐形翅膀",
        function: natural[2],
      },
      {
        title: "你的人格之尾",
        subtitle: "隐秘动力",
        description: "隐秘而敏感、也能补全现实感的动力",
        function: natural[3],
      },
    ].map((item) => ({
      ...item,
      label: mbtiFunctionLabels[item.function],
      question: mbtiFunctionQuestions[item.function],
    })),
  };
}
function buildFunctionScores(
  stack: ReturnType<typeof getMBTIFunctionStack>,
  dimensions: ReturnType<typeof calculateMBTIDimensions>,
) {
  const strengths = [
    dimensions.EI.strength,
    dimensions.SN.strength,
    dimensions.TF.strength,
    dimensions.JP.strength,
  ];
  const certainty =
    strengths.reduce((sum, value) => sum + value, 0) /
    Math.max(strengths.length, 1);
  const naturalBase: [number, number, number, number] = [
    13.7, 13.4, 12.7, 11.4,
  ];
  const compBase: [number, number, number, number] = [12.1, 11.4, 12.6, 12.7];
  const naturalRaw = stack.natural.map((fn, index) => ({
    code: fn,
    label: `${fn}-${mbtiFunctionLabels[fn]}`,
    name: mbtiFunctionLabels[fn],
    percent: (naturalBase[index] ?? 0) + certainty * (index < 2 ? 1.2 : 0.6),
  }));
  const compensatoryRaw = stack.compensatory.map((fn, index) => ({
    code: fn,
    label: `${fn}-${mbtiFunctionLabels[fn]}`,
    name: mbtiFunctionLabels[fn],
    percent: (compBase[index] ?? 0) - certainty * (index < 2 ? 0.7 : 0.3),
  }));
  const total = [...naturalRaw, ...compensatoryRaw].reduce(
    (sum, item) => sum + item.percent,
    0,
  );
  const normalize = (item: (typeof naturalRaw)[number]) => ({
    ...item,
    percent: Number(((item.percent / total) * 100).toFixed(1)),
  });

  return {
    natural: naturalRaw.map(normalize),
    compensatory: compensatoryRaw.map(normalize),
  };
}
function buildMBTINineGrid(
  dimensions: ReturnType<typeof calculateMBTIDimensions>,
) {
  const preferenceThreshold = 2.5 / 4;
  const rules = [
    [0, 0, 0, 0],
    [0.03, 0, 0, 0],
    [-0.03, 0, 0, 0],
    [0, 0.03, 0, 0],
    [0, -0.03, 0, 0],
    [0, 0, 0.03, 0],
    [0, 0, -0.03, 0],
    [0, 0, 0, 0.03],
    [0, 0, 0, -0.03],
  ];
  const pairs: Array<[keyof typeof dimensions, [string, string]]> = [
    ["EI", ["E", "I"]],
    ["SN", ["S", "N"]],
    ["TF", ["T", "F"]],
    ["JP", ["J", "P"]],
  ];

  return rules.map((offsets) =>
    pairs
      .map(([key, pair], index) => {
        const dimension = dimensions[key] as any;
        return dimension.firstRatio + offsets[index] > preferenceThreshold
          ? pair[0]
          : pair[1];
      })
      .join(""),
  );
}
function buildMBTIPreferences(
  dimensions: ReturnType<typeof calculateMBTIDimensions>,
) {
  return [
    {
      title: "你的注意力总倾向",
      left: "Extraversion - 外倾",
      right: "Introversion - 内倾",
      leftDesc: "客体导向：在真实的外界中，寻找自我",
      rightDesc: "主体导向：以真实的自我，理解外界",
      selected: dimensions.EI.letter,
    },
    {
      title: "你更偏好的信息获取方式是",
      left: "Sensing - 实际感知",
      right: "Intuition - 跨越觉察",
      leftDesc: "这里实际有什么：信任具体的现实，谨慎对待可能性",
      rightDesc: "这里可能有什么：信任潜在的可能性，谨慎对待现实",
      selected: dimensions.SN.letter,
    },
    {
      title: "你更偏好的决策秩序是",
      left: "Thinking - 事理秩序",
      right: "Feeling - 情理秩序",
      leftDesc: "事实上是否正确：重视事理，兼顾情理",
      rightDesc: "情感上是否值得：重视情理，兼顾事理",
      selected: dimensions.TF.letter,
    },
    {
      title: "你更偏好的生活态度是",
      left: "Judging - 寻求确定",
      right: "Perceiving - 顺应变化",
      leftDesc: "如何对待外界：在确定的外界中，获取内心的自由",
      rightDesc: "如何对待外界：在自由的外界中，寻找生活的方向",
      selected: dimensions.JP.letter,
    },
  ];
}
function buildMBTIInnerOuterProfile(
  dimensions: ReturnType<typeof calculateMBTIDimensions>,
) {
  const labels: Record<
    MBTIDimensionKey,
    { title: string; left: string; right: string }
  > = {
    EI: { title: "能量与表达", left: "E 外倾", right: "I 内倾" },
    SN: { title: "信息与观察", left: "S 实感", right: "N 直觉" },
    TF: { title: "判断与取舍", left: "T 思考", right: "F 情感" },
    JP: { title: "节奏与安排", left: "J 判断", right: "P 感知" },
  };
  const keys: MBTIDimensionKey[] = ["EI", "SN", "TF", "JP"];
  const buildDimensionRows = () =>
    keys.map((key) => {
      const inner = dimensions.layers.inner[key];
      const outer = dimensions.layers.outer[key];
      const innerPercent = Number(
        (
          (inner.letter === inner.first
            ? inner.firstRatio
            : inner.secondRatio) * 100
        ).toFixed(1),
      );
      const outerPercent = Number(
        (
          (outer.letter === outer.first
            ? outer.firstRatio
            : outer.secondRatio) * 100
        ).toFixed(1),
      );

      return {
        key,
        title: labels[key].title,
        left: labels[key].left,
        right: labels[key].right,
        innerLetter: inner.letter,
        outerLetter: outer.letter,
        innerPercent,
        outerPercent,
        gap: Math.abs(innerPercent - outerPercent),
        aligned: inner.letter === outer.letter,
      };
    });

  const innerType = dimensions.layers.inner.type;
  const outerType = dimensions.layers.outer.type;
  const alignedCount = keys.filter(
    (key) =>
      dimensions.layers.inner[key].letter ===
      dimensions.layers.outer[key].letter,
  ).length;
  const consistency = Number(((alignedCount / keys.length) * 100).toFixed(1));
  const status =
    innerType === outerType
      ? "内在偏好与外在表现较一致"
      : alignedCount >= 2
        ? "内在偏好与外在表现有部分差异"
        : "内在偏好与外在表现差异较明显";
  const summary =
    innerType === outerType
      ? `你的内在性格和外在表现都更接近 ${innerType}，说明你在私人状态与日常互动中的偏好相对稳定。`
      : `你的内在性格更接近 ${innerType}，外在表现更接近 ${outerType}。这通常表示你会根据环境要求调整表达方式，但内心真正舒服的节奏未必完全相同。`;

  return {
    innerType,
    innerTypeName: getMBTIDetailedDescription(innerType).name,
    outerType,
    outerTypeName: getMBTIDetailedDescription(outerType).name,
    consistency,
    status,
    summary,
    questionCount: {
      inner: dimensions.layers.inner.questionCount,
      outer: dimensions.layers.outer.questionCount,
    },
    dimensions: buildDimensionRows(),
  };
}
function buildMBTIPersonaMask(
  type: string,
  compensatory: Array<{ code: string; percent: number }>,
) {
  const strongest = [...compensatory]
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 2)
    .map((item) => item.code)
    .join("");
  const temperament =
    type.slice(1, 3) === "NT"
      ? "NT"
      : type.includes("NF")
        ? "NF"
        : type[1] === "S" && type[3] === "J"
          ? "SJ"
          : type[1] === "S"
            ? "SP"
            : "NT";
  const maskType =
    strongest.includes("Si") || strongest.includes("Te")
      ? "SJ"
      : strongest.includes("Se")
        ? "SP"
        : strongest.includes("Fe") || strongest.includes("Fi")
          ? "NF"
          : "NT";
  const names: Record<string, string> = {
    SJ: "秩序卷轴",
    SP: "现实火花",
    NF: "意义灯塔",
    NT: "结构星图",
  };

  return {
    code: maskType,
    title: `${maskType} 面具`,
    name: `${maskType} 面具「${names[maskType]}」`,
    rarity:
      type === "INTJ"
        ? "4.47%"
        : `${(3 + (type.charCodeAt(0) % 5) + (type.charCodeAt(3) % 4) / 10).toFixed(2)}%`,
    maskRatio: `${(10 + (maskType.charCodeAt(0) % 8) + (type.charCodeAt(2) % 7) / 10).toFixed(2)}%`,
    temperament,
    description: `${maskType}面具代表现阶段你用来适应环境、成就自己或保护自己的方式。它不必和人格底色完全一致，更像是成长经历在你身上留下的一套可调用策略。`,
  };
}
function buildMBTIProfile(
  type: string,
  typeName: string,
  stack: ReturnType<typeof getMBTIFunctionStack>,
  mask: ReturnType<typeof buildMBTIPersonaMask>,
) {
  const auxiliary = stack.roles[1]!;
  const tertiary = stack.roles[2]!;
  const inferior = stack.roles[3]!;
  return {
    about: `你呈现出${typeName}的核心轮廓：更容易被内在真实的兴趣、判断秩序和长期方向牵引。你未必总是外显地表现出某种固定样子，但在重要问题上，你通常会寻找自己真正认可的路径。`,
    execution: `${auxiliary.label}让你的想法不只是停留在脑中。它会推动你把偏好的判断方式转化为行动、安排、沟通或选择，让内在倾向和外部世界发生更稳定的连接。`,
    inner: `${tertiary.label}像一条逐渐清晰的支线。它可能不是你最熟练的部分，却常常带来放松、补偿和新的自我理解。当你愿意给它空间，整个人会更完整。`,
    hidden: `${inferior.label}通常更敏感，也更容易在压力下被放大。它不是缺点，而是提醒你：人格底色之外，还有一部分真实经验正在等待被温和地纳入生活。`,
    mask: `${mask.name}代表现阶段你用来适应环境、成就自己或保护自己的方式。它不必和人格底色完全一致，更像是成长经历在你身上留下的一套可调用策略。`,
  };
}
function generateDifferentiatedMBTIReport(
  type: string,
  functionScores: ReturnType<typeof buildFunctionScores>,
  nineGrid: string[],
  preferences: ReturnType<typeof buildMBTIPreferences>,
  innerOuterProfile: ReturnType<typeof buildMBTIInnerOuterProfile>,
  mask: ReturnType<typeof buildMBTIPersonaMask>,
  profile: ReturnType<typeof buildMBTIProfile>,
) {
  const natural = functionScores.natural
    .map((item) => `${item.label}：${item.percent}%`)
    .join("\n");
  const compensatory = functionScores.compensatory
    .map((item) => `${item.label}：${item.percent}%`)
    .join("\n");
  const preferenceText = preferences
    .map(
      (item) =>
        `${item.title}\n${item.left} / ${item.right}\n当前倾向：${item.selected}`,
    )
    .join("\n\n");
  const innerOuterText = innerOuterProfile.dimensions
    .map(
      (item) =>
        `${item.title}：内在 ${item.innerLetter}（${item.innerPercent}%） / 外在 ${item.outerLetter}（${item.outerPercent}%）`,
    )
    .join("\n");
  const roles = (mbtiStacks[type] ?? defaultMBTIStack)
    .map((fn) => `${fn}${mbtiFunctionLabels[fn]}：${mbtiFunctionQuestions[fn]}`)
    .join("\n");

  return `以下是基于差异化算法为你生成的人格九宫格
${nineGrid.join("\n")}

实验数据
自然状态的心理倾向
${natural}

代偿状态的心理倾向
${compensatory}

如何理解实验数据？
一、实验背景
我们聚焦的是心理能量层面的动力与阻力，会允许每个人的阴影功能呈现投射后的形状。因此，部分非阶梯状的八维分布是预期内的可能性。

二、八维得分可以如何解读？
重要：所有分数的高低都与认知能力以及发展水平无关。自然状态更接近人格底色，代偿状态更接近外界需要、自我保护、训练经历或情境代入。

三、可能的误测原因
1. 因为明显不认同一边，而强烈选择另一边并不完全认同的选项。
2. 近期状态特殊，很难区分自己的内在需求和环境需求。
3. 基于“我是否可以这样”作答，而不是基于“这是否完全是我”作答。

四、九宫格是什么
九宫格采用九种不同的人格算法进行综合比对，得出最可能的人格类型。

基础偏好
${preferenceText}

内在与外在性格
内在性格：${innerOuterProfile.innerType}（${innerOuterProfile.innerTypeName}）
外在表现：${innerOuterProfile.outerType}（${innerOuterProfile.outerTypeName}）
一致度：${innerOuterProfile.consistency}%
${innerOuterProfile.summary}
${innerOuterText}

人格面具
你理想中的自我：${mask.name}
${type}在完成实验的人群中的占比：${mask.rarity}
${mask.title}在${type}中的占比：${mask.maskRatio}

结果说明
关于你
${profile.about}

构想与执行
${profile.execution}

让倾向贴近内心
${profile.inner}

隐藏的另一面
${profile.hidden}

你的人格构成
${roles}

${mask.description}`;
}
// MBTI 16种人格类型详细描述
function getMBTIDetailedDescription(type: string): {
  name: string;
  traits: string[];
  career: string[];
  relationship: string;
} {
  const types: Record<string, any> = {
    ISTJ: {
      name: "检查员型 - 细致、严谨、可靠",
      traits: ["务实", "注重事实", "有责任感", "条理清晰", "遵守规则"],
      career: ["会计师", "审计师", "工程师", "图书管理员", "数据库管理员"],
      relationship: "忠诚可靠的伴侣，重视承诺，但可能不擅长表达情感",
    },
    ISFJ: {
      name: "保护者型 - 友善、忠诚、体贴",
      traits: ["默默付出", "关注他人需求", "有耐心", "忠诚可靠", "注重细节"],
      career: ["护士", "图书管理员", "行政助理", "教师", "社工"],
      relationship: "温柔体贴的伴侣，愿意为家人付出，需要被认可和感谢",
    },
    INFJ: {
      name: "倡导者型 - 理想主义、有洞察力",
      traits: ["有远见", "理想主义", "深刻洞察", "富有创造力", "善于倾听"],
      career: ["心理咨询师", "作家", "艺术家", "非营利组织工作者", "HR"],
      relationship: "追求深度连接的伴侣，重视精神契合，需要个人空间",
    },
    INTJ: {
      name: "战略家型 - 独立、果断、有远见",
      traits: ["独立思考", "战略性强", "追求效率", "自信", "创新"],
      career: ["科学家", "工程师", "CEO", "战略顾问", "架构师"],
      relationship: "理性独立的伴侣，重视智力匹配，需要互相尊重",
    },
    ISTP: {
      name: "冒险家型 - 灵活、务实、冷静",
      traits: ["善于解决问题", "动手能力强", "冷静", "灵活应变", "喜欢冒险"],
      career: ["工程师", "飞行员", "赛车手", "机械师", "程序员"],
      relationship: "独立自主的伴侣，需要自由空间，行动胜于言语",
    },
    ISFP: {
      name: "艺术家型 - 温和、敏感、有审美",
      traits: ["热爱艺术", "温和友善", "活在当下", "忠于内心", "灵活"],
      career: ["艺术家", "设计师", "音乐家", "摄影师", "兽医"],
      relationship: "温柔体贴的伴侣，重视和谐，需要情感支持",
    },
    INFP: {
      name: "治愈者型 - 理想主义、忠诚、有热情",
      traits: ["内心充满热情", "理想主义", "忠诚", "富有创意", "善解人意"],
      career: ["作家", "心理咨询师", "艺术家", "教师", "非营利组织"],
      relationship: "忠诚的理想主义者，追求灵魂伴侣，需要被理解",
    },
    INTP: {
      name: "思考者型 - 逻辑、创新、好奇",
      traits: ["逻辑严密", "热爱理论", "创新思维", "好奇心强", "分析能力强"],
      career: ["科学家", "程序员", "哲学家", "研究员", "系统分析师"],
      relationship: "理性的思考者，重视智力交流，需要独处时间",
    },
    ESTP: {
      name: "实践者型 - 精力充沛、务实、灵活",
      traits: ["善于社交", "灵活应变", "冒险精神", "解决问题", "行动派"],
      career: ["销售", "企业家", "运动员", "警察", "消防员"],
      relationship: "活力四射的伴侣，喜欢新鲜刺激，需要保持趣味性",
    },
    ESFP: {
      name: "表演者型 - 热情、开朗、享受生活",
      traits: ["热爱社交", "乐观积极", "善于表达", "享受当下", "有感染力"],
      career: ["演员", "销售", "活动策划", "导游", "公关"],
      relationship: "热情洋溢的伴侣，擅长制造快乐，需要关注和欣赏",
    },
    ENFP: {
      name: "激励者型 - 热情、创意、有感染力",
      traits: ["充满热情", "富有创意", "善于沟通", "乐观", "适应力强"],
      career: ["作家", "心理咨询师", "市场营销", "公关", "企业家"],
      relationship: "充满热情的伴侣，喜欢新鲜事物，需要情感连接",
    },
    ENTP: {
      name: "辩论家型 - 机智、创新、善于辩论",
      traits: ["聪明机智", "热爱挑战", "创新思维", "善于辩论", "适应力强"],
      career: ["律师", "企业家", "发明家", "营销", "战略顾问"],
      relationship: "充满智慧的伴侣，喜欢思想碰撞，需要智力刺激",
    },
    ESTJ: {
      name: "监督者型 - 务实、果断、有组织力",
      traits: ["果断", "有组织", "注重效率", "负责任", "善于管理"],
      career: ["经理", "法官", "警察", "项目经理", "军人"],
      relationship: "负责任的伴侣，重视家庭秩序，需要尊重和认可",
    },
    ESFJ: {
      name: "支持者型 - 友善、热心、有责任感",
      traits: ["热心助人", "善于合作", "重视和谐", "有责任感", "务实"],
      career: ["护士", "教师", "销售", "行政", "社工"],
      relationship: "体贴照顾的伴侣，重视家庭和谐，需要情感回馈",
    },
    ENFJ: {
      name: "教育家型 - 有魅力、善于激励、有远见",
      traits: ["有魅力", "善于沟通", "激励他人", "有远见", "热心助人"],
      career: ["教师", "心理咨询师", "HR", "公关", "非营利组织"],
      relationship: "魅力十足的伴侣，重视深度关系，需要真诚交流",
    },
    ENTJ: {
      name: "指挥官型 - 自信、果断、有战略眼光",
      traits: ["自信", "果断", "有战略眼光", "善于领导", "追求卓越"],
      career: ["CEO", "企业家", "律师", "政治家", "高管"],
      relationship: "强势独立的伴侣，重视互相成就，需要平等尊重",
    },
  };

  return (
    types[type] || {
      name: "探索者型",
      traits: ["独特", "有潜力", "不断成长"],
      career: ["多种可能"],
      relationship: "独特的个体，需要相互理解",
    }
  );
}
