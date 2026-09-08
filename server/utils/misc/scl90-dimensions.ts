// SCL-90 维度定义
export const scl90Dimensions = {
  somatization: {
    name: "躯体化",
    nameEn: "Somatization",
    icon: "💪",
    description:
      "主要反映身体不适感，包括心血管、胃肠道、呼吸等系统的主诉不适，以及头痛、肌肉酸痛等其他躯体表现。",
    highScore: "高分提示可能存在多种躯体不适，这些不适常与情绪压力有关。",
    lowScore: "低分提示身体状况良好，较少出现与情绪相关的躯体不适。",
  },
  obsessive: {
    name: "强迫症状",
    nameEn: "Obsessive-Compulsive",
    icon: "🔄",
    description:
      "指那些明知没有必要但又无法摆脱的思想、冲动和行为，以及一些一般的行为障碍症状。",
    highScore:
      "高分提示可能存在反复出现的不必要想法或行为，做事追求完美，难以做决定。",
    lowScore: "低分提示思维灵活，做事自然，较少有强迫性行为或想法。",
  },
  interpersonal: {
    name: "人际关系敏感",
    nameEn: "Interpersonal Sensitivity",
    icon: "👥",
    description:
      "主要指个人在人际交往中的不自在感和自卑感，特别是在与他人比较时更为突出。",
    highScore:
      "高分提示可能存在人际交往困扰，常感到不自在、自卑，过分在意他人评价。",
    lowScore: "低分提示人际关系良好，自信大方，能够自然与他人相处。",
  },
  depression: {
    name: "抑郁",
    nameEn: "Depression",
    icon: "😔",
    description:
      "反映与临床抑郁症状相关的广泛问题，包括兴趣减退、缺乏活动动力、情绪低落等。",
    highScore: "高分提示可能存在明显的抑郁情绪，兴趣减退，感到生活无意义。",
    lowScore: "低分提示情绪状态良好，积极乐观，对生活有热情。",
  },
  anxiety: {
    name: "焦虑",
    nameEn: "Anxiety",
    icon: "😰",
    description:
      "指临床上与焦虑症状相关的表现，包括紧张、颤抖、惊恐发作等体验。",
    highScore: "高分提示可能存在明显的焦虑症状，感到紧张不安，有莫名的恐惧感。",
    lowScore: "低分提示情绪平稳，较少感到紧张或不安。",
  },
  hostility: {
    name: "敌对",
    nameEn: "Hostility",
    icon: "😠",
    description:
      "反映个体在思维、情感及行为上的敌对表现，包括厌烦、争论、冲动等。",
    highScore: "高分提示可能有较强的敌对倾向，易怒，容易与人发生争执。",
    lowScore: "低分提示性情平和，容易与人相处，少有敌对情绪。",
  },
  phobic: {
    name: "恐怖",
    nameEn: "Phobic Anxiety",
    icon: "😨",
    description:
      "指与特定情境或对象相关的恐惧反应，如空旷场所、社交场合、公共交通工具等。",
    highScore:
      "高分提示可能存在特定场所或对象的恐惧感，会主动回避令其害怕的情境。",
    lowScore: "低分提示较少有特定恐惧，能够正常面对各种情境。",
  },
  paranoid: {
    name: "偏执",
    nameEn: "Paranoid Ideation",
    icon: "🔍",
    description: "指个体在思维上的投射性思维、猜疑、关系妄想等偏执性思维特征。",
    highScore: "高分提示可能有较强的猜疑心，容易误解他人意图，感觉被针对。",
    lowScore: "低分提示思维开放，信任他人，较少有猜疑倾向。",
  },
  psychotic: {
    name: "精神病性",
    nameEn: "Psychoticism",
    icon: "🧠",
    description: "反映精神分裂症相关的症状体验，包括幻听、思维被控制感等。",
    highScore: "高分提示可能存在较严重的精神症状，需要专业评估。",
    lowScore: "低分提示思维清晰，现实感良好。",
  },
  additional: {
    name: "其他",
    nameEn: "Additional Items",
    icon: "📋",
    description: "反映饮食、睡眠等方面的额外问题，不属于上述九个维度。",
    highScore: "高分提示可能存在睡眠、饮食等方面的困扰。",
    lowScore: "低分提示睡眠、饮食等基本生理功能良好。",
  },
};

// 各维度包含的题目
export const scl90DimensionItems = {
  somatization: [1, 4, 12, 27, 40, 42, 48, 49, 52, 53, 56, 58],
  obsessive: [3, 9, 10, 28, 38, 45, 46, 51, 55, 65],
  interpersonal: [6, 21, 34, 36, 37, 41, 61, 69, 73],
  depression: [5, 14, 15, 20, 22, 26, 29, 30, 31, 32, 54, 71, 79, 88, 89],
  anxiety: [2, 17, 23, 33, 39, 57, 72, 78, 80, 86],
  hostility: [11, 24, 63, 67, 74, 81],
  phobic: [13, 25, 47, 50, 70, 75, 82],
  paranoid: [8, 18, 43, 68, 76, 83],
  psychotic: [7, 16, 35, 62, 77, 84, 85, 87, 90],
  additional: [19, 44, 59, 60, 64, 66, 89],
};

// 维度评分标准
export const scl90DimensionLevels = [
  {
    min: 1,
    max: 1.5,
    level: "很低",
    description: "该维度状况很好，几乎没有问题",
  },
  { min: 1.5, max: 2, level: "较低", description: "该维度状况良好，问题较少" },
  {
    min: 2,
    max: 2.5,
    level: "中等",
    description: "该维度存在一定问题，值得关注",
  },
  {
    min: 2.5,
    max: 3.5,
    level: "较高",
    description: "该维度问题较明显，需要关注",
  },
  {
    min: 3.5,
    max: 5,
    level: "很高",
    description: "该维度问题严重，建议寻求专业帮助",
  },
];

// 获取等级信息的辅助函数
function getLevelInfo(average: number): { level: string; description: string } {
  // 先按顺序匹配
  for (const levelInfo of scl90DimensionLevels) {
    if (average >= levelInfo.min && average < levelInfo.max) {
      return { level: levelInfo.level, description: levelInfo.description };
    }
  }
  // 处理边界情况：average >= 5 或 average === 5
  if (average >= 5) {
    const lastLevel = scl90DimensionLevels[scl90DimensionLevels.length - 1];
    return { level: lastLevel!.level, description: lastLevel!.description };
  }
  // 默认返回中等水平
  return { level: "中等", description: "该维度存在一定问题，值得关注" };
}

// 计算维度均分的函数
export function calculateDimensionScores(
  answers: Record<number, number>,
): Record<
  string,
  { total: number; average: number; level: string; description: string }
> {
  const dimensionScores: Record<
    string,
    { total: number; average: number; level: string; description: string }
  > = {};

  for (const [dimKey, items] of Object.entries(scl90DimensionItems)) {
    let total = 0;
    let count = 0;

    for (const itemId of items) {
      if (answers[itemId] !== undefined) {
        total += answers[itemId];
        count++;
      }
    }

    const average = count > 0 ? total / count : 1;
    const { level, description } = getLevelInfo(average);

    dimensionScores[dimKey] = {
      total,
      average: Math.round(average * 100) / 100,
      level,
      description,
    };
  }

  return dimensionScores;
}

// 获取维度名称（中文）
export function getDimensionName(dimKey: string): string {
  const dim = scl90Dimensions[dimKey as keyof typeof scl90Dimensions];
  return dim?.name || dimKey;
}

// 获取维度图标
export function getDimensionIcon(dimKey: string): string {
  const dim = scl90Dimensions[dimKey as keyof typeof scl90Dimensions];
  return dim?.icon || "📌";
}

// 获取维度描述
export function getDimensionDescription(dimKey: string): string {
  const dim = scl90Dimensions[dimKey as keyof typeof scl90Dimensions];
  return dim?.description || "";
}

// 获取高分描述
export function getHighScoreDescription(dimKey: string): string {
  const dim = scl90Dimensions[dimKey as keyof typeof scl90Dimensions];
  return dim?.highScore || "";
}

// 获取低分描述
export function getLowScoreDescription(dimKey: string): string {
  const dim = scl90Dimensions[dimKey as keyof typeof scl90Dimensions];
  return dim?.lowScore || "";
}
