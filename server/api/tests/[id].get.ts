import type { Test } from "~/types/test";
import {
  bdcOptions,
  bdcQuestions,
} from "~~/server/utils/questions/bdc-questions";
import {
  bpnsOptions,
  bpnsQuestions,
} from "~~/server/utils/questions/bpns-questions";
import {
  emotionalStabilityOptions,
  emotionalStabilityQuestions,
} from "~~/server/utils/questions/emotional-stability-questions";
import {
  epqOptions,
  epqQuestions,
} from "~~/server/utils/questions/epq-questions";
import {
  epqRscOptions,
  epqRscQuestions,
} from "~~/server/utils/questions/epq-rsc-questions";
import {
  ipipEisQuestions,
  ipipEisOptions,
} from "~~/server/utils/questions/ipip-eis-questions";
import {
  mbtiOptions,
  mbtiQuestions,
} from "~~/server/utils/questions/mbti-questions";
import {
  sccsOptions,
  sccsQuestions,
} from "~~/server/utils/questions/sccs-questions";
import {
  getOptionsForQuestion,
  sixteenPFQuestions,
} from "~~/server/utils/questions/sixteenPF-questions";
import {
  temperamentOptions,
  temperamentQuestions,
} from "~~/server/utils/questions/temperament-questions";
import {
  mdqOptions,
  mdqQuestions,
} from "~~/server/utils/questions/mdq-questions";
import {
  asrmOptions,
  asrmQuestions,
} from "~~/server/utils/questions/asrm-questions";
import {
  gad7Options,
  gad7Questions,
} from "~~/server/utils/questions/gad7-questions";
import {
  phq9Options,
  phq9Questions,
} from "~~/server/utils/questions/phq9-questions";
import {
  pss10Options,
  pss10Questions,
} from "~~/server/utils/questions/pss10-questions";
import {
  sasOptions,
  sasQuestions,
} from "~~/server/utils/questions/sas-questions";
import {
  scl90Options,
  scl90Questions,
} from "~~/server/utils/questions/scl90-questions";
import {
  sdsOptions,
  sdsQuestions,
} from "~~/server/utils/questions/sds-questions";
import {
  rsesOptions,
  rsesQuestions,
} from "~~/server/utils/questions/rses-questions";
import {
  sevenOptions,
  sevenQuestions,
} from "~~/server/utils/questions/seven-questions";
import {
  psyAgeOptions,
  psyAgeQuestions,
} from "~~/server/utils/questions/psy-age-questions";
import {
  siossOptions,
  siossQuestions,
} from "~~/server/utils/questions/sioss-questions";
import {
  bisOptions,
  bisQuestions,
} from "~~/server/utils/questions/bis-questions";
import {
  bpaqOptions,
  bpaqQuestions,
} from "~~/server/utils/questions/bpaq-questions";
import {
  ymrsOptions,
  ymrsQuestions,
} from "~~/server/utils/questions/ymrs-questions";
import {
  isiOptions,
  isiQuestions,
} from "~~/server/utils/questions/isi-questions";
import {
  mid60Questions,
} from "~~/server/utils/questions/mid60-questions";
import {
  des2Questions,
} from "~~/server/utils/questions/des2-questions";
import { sdq20Questions } from "~~/server/utils/questions/sdq20-questions";
import { ybocsQuestions } from "~~/server/utils/questions/ybocs-questions";
import { ocirQuestions } from "~~/server/utils/questions/ocir-questions";
import { ptsdQuestions, ptsdOptions } from "~~/server/utils/questions/ptsd-questions";
import { panicQuestions, panicOptions } from "~~/server/utils/questions/panic-questions";
import { socialQuestions, socialOptions } from "~~/server/utils/questions/social-questions";
import { phobiaQuestions, phobiaOptions } from "~~/server/utils/questions/phobia-questions";
import { agoraQuestions, agoraOptions } from "~~/server/utils/questions/agora-questions";
import { sepanxQuestions, sepanxOptions } from "~~/server/utils/questions/sepanx-questions";
import { auditQuestions } from "~~/server/utils/questions/audit-questions";
import { igdsOptions, igdsQuestions } from "~~/server/utils/questions/igds-questions";
import { eat26Options, eat26Questions } from "~~/server/utils/questions/eat26-questions";
import { scoffOptions, scoffQuestions } from "~~/server/utils/questions/scoff-questions";
import { asrsOptions, asrsQuestions } from "~~/server/utils/questions/asrs-questions";
import { ecrrOptions, ecrrQuestions } from "~~/server/utils/questions/ecrr-questions";
import {
  psqiDaytimeOptions,
  psqiFrequencyOptions,
  psqiQualityOptions,
  psqiQuestions,
} from "~~/server/utils/questions/psqi-questions";
import { swlsOptions, swlsQuestions } from "~~/server/utils/questions/swls-questions";
import {
  buildMultidimQuestions,
  isMultidimMode,
  MULTIDIM_MODES,
  MULTIDIM_WINDOW_LABEL,
  multidimOptions,
  multidimWindowOf,
} from "~~/server/utils/questions/multidim-questions";
import { testIntros } from "~~/server/utils/test-intros";
import { createQuestionToken } from "~~/server/utils/question-token";
import { enforceRateLimit } from "~~/server/utils/rate-limit";
import { timeFrameOf, contextHintOf } from "~~/server/utils/test-timeframe";

// 按题目 id 升序排序（题库文件顺序可能与出题顺序不同）
function sortQuestionsById<T extends { id: number }>(questions: T[]): T[] {
  return [...questions].sort((a, b) => a.id - b.id);
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  // 多维自评量表：支持 ?mode=light|fast|standard|deep&seed=xxx 按模式出题。
  // 未指定模式时返回空题目（前端先展示模式选择）；种子用于乱序复测与提交校验复现。
  const query = getQuery(event);
  const multidimMode = isMultidimMode(query.mode) ? query.mode : null;
  // 种子由客户端提供、只用于选出题顺序。限制长度，避免超长字符串让哈希与出题成为放大面。
  const rawSeed = typeof query.seed === "string" ? query.seed.trim() : "";
  const multidimSeed = rawSeed.length > 0 && rawSeed.length <= 64 ? rawSeed : undefined;

  // 每次请求都要按种子现算整套题库，加一层限流挡住脚本刷取
  if (multidimMode) {
    enforceRateLimit(event, {
      scope: "multidim-questions",
      limit: 60,
      windowMs: 10 * 60 * 1000,
    });
  }

  const testDatabase: Record<string, Test & { modes?: typeof MULTIDIM_MODES }> = {
    phq9: {
      id: "phq9",
      title: "PHQ-9 抑郁筛查量表",
      description: "在过去的两周里，您生活中以下症状出现的频率有多少？",
      instructions: "请根据您的实际情况，选择最符合您过去两周内感受的选项。",
      questions: phq9Questions.map((q) => ({
        id: q.id,
        text: q.text,
        options: phq9Options,
      })),
      scoringRules: {
        type: "sum",
      },
    },

    gad7: {
      id: "gad7",
      title: "GAD-7 焦虑筛查量表",
      description: "在过去的两周里，您被以下问题困扰的频率有多少？",
      instructions: "请根据您的实际情况，选择最符合您过去两周内感受的选项。",
      questions: gad7Questions.map((q) => ({
        id: q.id,
        text: q.text,
        options: gad7Options,
      })),
      scoringRules: {
        type: "sum",
      },
    },

    pss: {
      id: "pss",
      title: "压力感知量表 (PSS-10)",
      description: "在过去的一个月里，您有多频繁地出现以下情况？",
      instructions:
        "请根据过去一个月您的真实感受，选择最符合的选项。注意：部分题目需要反向计分。",
      questions: pss10Questions.map((q) => ({
        id: q.id,
        text: q.text,
        options: pss10Options,
        reversed: q.reverse,
      })),
      scoringRules: {
        type: "sum",
      },
    },

    scl90: {
      id: "scl90",
      title: "SCL-90 症状自评量表",
      description:
        "以下列出了有些人可能会有的问题，请仔细阅读每一条，根据最近一星期以内您的实际感觉，选择最符合的选项。",
      instructions:
        "请根据您最近一周的真实感受，选择最符合的选项。该量表包含90个题目，大约需要15-20分钟完成。",
      questions: scl90Questions.map((q) => ({
        id: q.id,
        text: q.text,
        options: scl90Options,
      })),
      scoringRules: {
        type: "scl90",
      },
    },

    sds: {
      id: "sds",
      title: "抑郁自评量表 (SDS)",
      description: "请根据您过去一周的实际感觉，选择最符合的选项。",
      instructions:
        "请仔细阅读每一条题目，根据您过去一周的实际感觉选择最符合的选项。注意：部分题目需要反向计分。",
      questions: sdsQuestions.map((q) => ({
        id: q.id,
        text: q.text,
        options: sdsOptions,
        reversed: q.reverse,
      })),
      scoringRules: {
        type: "sds",
      },
    },

    sas: {
      id: "sas",
      title: "焦虑自评量表 (SAS)",
      description: "请根据您过去一周的实际感觉，选择最符合的选项。",
      instructions:
        "请仔细阅读每一条题目，根据您过去一周的实际感觉选择最符合的选项。注意：部分题目需要反向计分。",
      questions: sasQuestions.map((q) => ({
        id: q.id,
        text: q.text,
        options: sasOptions,
        reversed: q.reverse,
      })),
      scoringRules: {
        type: "sas",
      },
    },

    mbti: {
      id: "mbti",
      title: "MBTI 人格测试",
      description:
        "本测试基于荣格的心理类型理论，结合情境假设与日常问题，帮助您了解自己在四个维度上的偏好以及内在/外在性格差异。",
      instructions:
        "请根据您的真实情况和第一反应选择最符合的选项。每个题目没有对错之分，请选择最贴近您日常行为和情境反应的描述。共109题，大约需要15-18分钟。",
      questions: mbtiQuestions.map((q) => ({
        id: q.id,
        text: q.text,
        options: mbtiOptions,
        dimension: q.dimension,
        reversed: q.reverse,
      })),
      scoringRules: {
        type: "mbti",
      },
    },
    sccs: {
      id: "sccs",
      title: "自我和谐量表",
      description: "本量表用于评估您自我与经验的关系，了解您的内心和谐程度。",
      instructions:
        "请根据您的实际情况，选择最符合您感受的选项。共35题，大约需要8-10分钟。",
      questions: sccsQuestions.map((q) => ({
        id: q.id,
        text: q.text,
        options: sccsOptions,
        dimension: q.dimension,
        reversed: q.reverse,
      })),
      scoringRules: {
        type: "sccs",
      },
    },
    temperament: {
      id: "temperament",
      title: "气质类型测试",
      description:
        "本测试基于古希腊医生希波克拉底的四液说，帮助您了解自己的气质类型。",
      instructions:
        "请根据您的真实情况选择最符合的选项。共60题，大约需要10-15分钟。每题有5个选项：很符合、较符合、一般、较不符合、很不符合。",
      questions: temperamentQuestions.map((q) => ({
        id: q.id,
        text: q.text,
        options: temperamentOptions,
        dimension: q.dimension,
      })),
      scoringRules: {
        type: "temperament",
      },
    },
    bdc: {
      id: "bdc",
      title: "伯恩斯抑郁症清单",
      description:
        "本量表由美国心理治疗专家David D. Burns博士设计，用于快速评估您的抑郁情绪程度。",
      instructions:
        "请根据您过去一周（包括今天）的真实感受，选择最符合的选项。每题有4个选项：没有、轻度、中度、严重。共15题，大约需要3-5分钟。",
      questions: bdcQuestions.map((q) => ({
        id: q.id,
        text: q.text,
        options: bdcOptions,
      })),
      scoringRules: {
        type: "bdc",
      },
    },
    epq: {
      id: "epq",
      title: "艾森克人格问卷",
      description:
        "本问卷由英国心理学家艾森克编制，是国际上广泛使用的人格测量工具。",
      instructions:
        '请根据您的真实情况回答下列问题。每个问题都有"是"和"否"两个选项，请选择最符合您的选项。共88题，大约需要15-20分钟。',
      questions: epqQuestions.map((q) => ({
        id: q.id,
        text: q.text,
        options: epqOptions,
        scale: q.scale,
        reversed: q.reverse,
      })),
      scoringRules: {
        type: "epq",
      },
    },
    "epq-rsc": {
      id: "epq-rsc",
      title: "艾森克人格问卷简式量表",
      description:
        "本问卷由北京大学钱铭怡教授等修订，是EPQ的中国版简式量表，共48题。",
      instructions:
        '请回答下列问题。回答"是"时，就在"是"上打"√"；回答"否"时就在"否"上打"√"。每个答案无所谓正确与错误。请尽快回答，不要在每道题目上太多思索。回答时不要考虑应该怎样，只回答你平时是怎样的。每题都要回答。共48题，大约需要10-15分钟。',
      questions: epqRscQuestions.map((q) => ({
        id: q.id,
        text: q.text,
        options: epqRscOptions,
        scale: q.scale,
        reversed: q.reverse,
      })),
      scoringRules: {
        type: "epq-rsc",
      },
    },
    "emotional-stability": {
      id: "emotional-stability",
      title: "情绪稳定性测试",
      description:
        "本测试用于测量您的情绪稳定性程度，帮助了解自己的情绪特点和抗压能力。",
      instructions:
        "请根据您的实际情况，做出回答。符合的，则选择“是”；难以回答的，则选择“？”；不符合的，选择“否”。做这个测验不必多思考，请用10分钟左右的时间完成，每题只能选择一个答案。",
      questions: emotionalStabilityQuestions.map((q) => ({
        id: q.id,
        text: q.text,
        options: emotionalStabilityOptions,
      })),
      scoringRules: {
        type: "emotional-stability",
      },
    },
    sixteenPF: {
      id: "sixteenPF",
      title: "卡特尔16种人格因素问卷",
      description:
        '本测验共有187道题目，都是有关个人的兴趣与态度方面的问题。每个人对这些问题是会有不同看法的，回答自然也是不同的，因而对问题如何回答，并没有"对"与"错"之分，只是表明您对这些问题的态度。',
      instructions:
        "请根据您的真实情况选择最符合的选项。每题通常有三个选项，请根据题目类型选择相应的答案。请尽量凭第一感觉作答，不要过多思考。共187题，大约需要30-45分钟。",
      questions: sixteenPFQuestions.map((q) => ({
        id: q.id,
        text: q.text,
        options: getOptionsForQuestion(q),
        factor: q.factor,
        reversed: q.reverse,
      })),
      scoringRules: {
        type: "sixteenPF",
      },
    },
    bpns: {
      id: "bpns",
      title: "基本心理需求满足量表",
      description:
        "本量表基于自我决定理论，帮助您了解在自主、胜任和归属三个方面的心理需求满足程度。",
      instructions:
        '请根据您过去一周的真实感受，选择最符合的选项。每题有7个选项：从"完全不符合"到"完全符合"。共21题，大约需要3-5分钟。',
      questions: sortQuestionsById(bpnsQuestions).map((q) => ({
        id: q.id,
        text: q.text,
        options: bpnsOptions,
        dimension: q.dimension,
        reversed: q.reverse,
      })),
      scoringRules: {
        type: "bpns",
      },
    },
    "ipip-eis": {
      id: "ipip-eis",
      title: "情绪智力量表",
      description:
        "本量表基于国际人格项目库(IPIP)开发，用于评估个体的情绪智力水平，包括情绪表达、注意、决策和共情等方面。",
      instructions:
        '请根据您的真实情况，选择最符合的选项。每题有5个选项：从"非常不符合"到"非常符合"。共64题，大约需要8-12分钟。量表包含2道测标题，请认真作答。',
      questions: sortQuestionsById(ipipEisQuestions).map((q) => ({
        id: q.id,
        text: q.text,
        options: ipipEisOptions,
        dimension: q.dimension,
        reversed: q.reverse,
      })),
      scoringRules: {
        type: "ipip-eis",
      },
    },
    mdq: {
      id: "mdq",
      title: "心境障碍问卷",
      description:
        "心境障碍问卷(MDQ)是双相谱系障碍的标准化筛查工具，包含15道题，评估躁狂/轻躁狂症状的终身经历。",
      instructions:
        '请根据您过去是否有过类似经历如实回答。每题有2个选项："是"或"否"。共15题，大约需要3-5分钟。',
      questions: mdqQuestions.map((q) => ({
        id: q.id,
        text: q.text,
        options: mdqOptions,
      })),
      scoringRules: {
        type: "mdq",
      },
    },
    asrm: {
      id: "asrm",
      title: "Altman躁狂自评量表",
      description:
        "Altman躁狂自评量表(ASRM)用于快速评估过去一周的躁狂症状严重程度，包含5个核心问题。",
      instructions:
        '请根据您过去一周的真实感受，选择最符合的选项。每题有5个选项，从"完全没有"到"非常明显"。共5题，大约需要1-2分钟。',
      questions: asrmQuestions.map((q) => ({
        id: q.id,
        text: q.text,
        options: asrmOptions,
      })),
      scoringRules: {
        type: "asrm",
      },
    },
    rses: {
      id: "rses",
      title: "Rosenberg 自尊量表",
      description:
        "罗森伯格自尊量表(Rosenberg Self-Esteem Scale)用于评估个体的整体自我价值感与自尊水平，包含10个问题。",
      instructions:
        "请根据您的实际情况，选择最符合您感受的选项。共10题，大约需要2-3分钟。",
      questions: rsesQuestions.map((q) => ({
        id: q.id,
        text: q.text,
        options: rsesOptions,
        reversed: q.reverse,
      })),
      scoringRules: {
        type: "rses",
      },
    },
    seven: {
      id: "seven",
      title: "七美德与七宗罪",
      description:
        "分别测量 7 宗罪与 7 美德两条独立指数。罪与德互不抵消——你可以同时贪婪又慷慨。趣味化自评，供自省与娱乐，非道德审判。",
      instructions:
        "请根据您的真实情况，选择最符合的选项。每题 5 个选项，从「完全不像我」到「非常像我」。共 60 题，大约需要 8-12 分钟。题面已做情景化处理，看不出哪个答案更好。",
      questions: sortQuestionsById(sevenQuestions).map((q) => ({
        id: q.id,
        text: q.text,
        options: sevenOptions,
        dimension: q.dimension,
      })),
      scoringRules: {
        type: "seven",
      },
    },
    "psy-age": {
      id: "psy-age",
      title: "心理年龄测验",
      description:
        "基于发展心理学多维年龄模型（Baltes · Birren），用 42 道题勾勒认知、情绪、时间观、活力等七维画像，并以「成熟度 × 少年感」双轴解读你的心理年龄。",
      instructions:
        "请凭第一直觉，选择最符合你的选项（非常不同意 → 非常同意）。共 42 道陈述题，约需 5-8 分钟；最后一道会请填写你的生理年龄（可不填），便于对比心理年龄与生理年龄。",
      questions: sortQuestionsById(psyAgeQuestions).map((q) => ({
        id: q.id,
        text: q.text,
        dimension: q.dimension,
        type: q.type === "number" ? "number" : undefined,
        min: q.min != null ? q.min : undefined,
        max: q.max != null ? q.max : undefined,
        options: q.type === "number" ? [] : psyAgeOptions,
      })),
      scoringRules: {
        type: "psy-age",
      },
    },
    sioss: {
      id: "sioss",
      title: "自杀意念自评量表",
      description:
        "自杀意念自评量表(SIOSS)由夏朝云等编制，从绝望感、乐观感缺失、睡眠困扰等维度评估自杀意念，用于自杀风险的早期识别与筛查。",
      instructions:
        '请仔细阅读每一条，把意思弄明白，然后根据您自己的实际情况如实作答。每题有2个选项："是"或"否"，每一条都要回答，不要拖延太久。量表中包含测谎（掩饰）条目，请尽量真实作答，否则结果可能无效。共26题，大约需要3-5分钟。本量表仅作筛查参考，不能替代专业诊断。',
      questions: siossQuestions.map((q) => ({
        id: q.id,
        text: q.text,
        options: siossOptions,
        dimension: q.dimension,
      })),
      scoringRules: {
        type: "sioss",
      },
    },
    bis: {
      id: "bis",
      title: "Barratt 冲动性量表（第11版）",
      description:
        "Barratt冲动性量表（BIS-11）由Patton等编制，评估注意力、运动和无计划三个维度的冲动性人格特质。",
      instructions:
        '请根据您的实际情况，选择最符合您日常行为方式的选项。每题有5个选项："从不/很少"到"总是"。共30题，大约需要8-12分钟。注意：部分题目需要反向计分，请凭第一印象作答，不要过度思考。',
      questions: bisQuestions.map((q) => ({
        id: q.id,
        text: q.text,
        options: bisOptions,
        dimension: q.dimension,
        reversed: q.reverse,
      })),
      scoringRules: {
        type: "bis",
      },
    },
    bpaq: {
      id: "bpaq",
      title: "Buss-Perry 攻击性问卷",
      description:
        "Buss-Perry攻击性问卷（BPAQ）由Buss和Perry编制，从身体攻击、言语攻击、愤怒和敌意四个维度评估攻击性倾向。",
      instructions:
        '请根据您的实际情况，选择最符合您行为特征的选项。每题有5个选项："完全不符合"到"完全符合"。共29题，大约需要6-10分钟。本量表用于了解攻击性倾向，结果仅作筛查参考。',
      questions: bpaqQuestions.map((q) => ({
        id: q.id,
        text: q.text,
        options: bpaqOptions,
        dimension: q.dimension,
      })),
      scoringRules: {
        type: "bpaq",
      },
    },
    ymrs: {
      id: "ymrs",
      title: "杨氏躁狂评定量表",
      description:
        "杨氏躁狂评定量表（YMRS）由Young等编制，原版为临床他评量表，本实现改为自评简化版本，仅作粗筛参考。",
      instructions:
        '请评估您过去48小时内的状态。每题有5个选项："无"到"严重"。共11题，大约需要3-5分钟。注意：YMRS原版是精神科医生评估患者的专业工具，本简化版结果仅供参考，不能替代临床诊断。如您怀疑自己存在躁狂或轻躁狂，请尽快咨询精神科医生。',
      questions: ymrsQuestions.map((q) => ({
        id: q.id,
        text: q.text,
        options: ymrsOptions,
      })),
      scoringRules: {
        type: "ymrs",
      },
    },
    isi: {
      id: "isi",
      title: "失眠严重程度指数",
      description:
        "失眠严重程度指数（ISI）由Morin等编制，评估过去2周失眠问题的性质、症状和日间影响。",
      instructions:
        '请根据您过去2周的真实睡眠情况，选择最符合的选项。每题有5个选项："无"到"极重度"。共7题，大约需要2-3分钟。',
      questions: isiQuestions.map((q) => ({
        id: q.id,
        text: q.text,
        options: isiOptions,
        dimension: q.dimension,
      })),
      scoringRules: {
        type: "isi",
      },
    },
    mid60: {
      id: "mid60",
      title: "MID-60 多维解离量表",
      description:
        "多维解离量表（Multidimensional Inventory of Dissociation，MID-60）用于评估解离体验的频率与严重程度，覆盖DID/OSDD、人格解体/现实解体、解离性失忆、PTSD及功能性神经症状等相关症状。",
      instructions:
        '请基于最近一个月的真实体验作答，每题用 0–10 打分：0=从不，10=总是。共60题，大约需要10-15分钟。',
      questions: mid60Questions.map((q) => ({
        id: q.id,
        text: q.text,
        type: "range",
        min: 0,
        max: 10,
        minLabel: "从不",
        maxLabel: "总是",
        dimension: q.dimension,
      })),
      scoringRules: {
        type: "mid60",
      },
    },
    des2: {
      id: "des2",
      title: "解离经验量表",
      description:
        "解离经验量表（DES-II）由 Bernstein & Putnam 编制，评估记忆缺失、人格/现实解体与吸收沉浸三类解离体验，是国际常用的解离筛查工具。",
      instructions:
        "每题用滑块选择 0-100%，表示该体验在日常生活中出现的时间比例。建议按直觉作答，尽量不要反复修改。",
      questions: des2Questions.map((q) => ({
        id: q.id,
        text: q.text,
        type: "range",
        min: 0,
        max: 100,
        step: 10,
        minLabel: "从未出现",
        maxLabel: "总是出现",
        dimension: q.dimension,
      })),
      scoringRules: {
        type: "des2",
      },
    },
        sdq20: {
      id: "sdq20",
      title: "躯体形式解离问卷",
      description: "SDQ-20 由 Nijenhuis 等编制，评估过去一年各类躯体解离体验（感觉异常、运动障碍、知觉变化等），含 SDQ-5 快速筛查子集。",
      instructions: "每题用滑块选择 1-5，表示该躯体体验在过去一年出现的程度（1=完全没有，5=非常多）。建议按直觉作答，尽量不要反复修改。",
      questions: sdq20Questions.map((q) => ({
        id: q.id,
        text: q.text,
        type: "range",
        min: 1,
        max: 5,
        step: 1,
        minLabel: "完全没有",
        maxLabel: "非常多",
      })),
      scoringRules: {
        type: "sdq20",
      },
    },
    ybocs: {
      id: "ybocs",
      title: "耶鲁-布朗强迫量表",
      description: "Y-BOCS 由 Goodman 等 1989 年编制，用 0-4 评估强迫思维与强迫行为的严重程度（各 5 题），是不依赖具体症状内容的金标准评估工具。",
      instructions: "每题用滑块选择 0-4（0=无，1=轻，2=中，3=重，4=极重），评估最近一周内强迫思维与强迫行为的平均水平。建议按直觉作答，尽量不要反复修改。",
      questions: ybocsQuestions.map((q) => ({
        id: q.id,
        text: q.text,
        type: "likert",
        options: q.options,
      })),
      scoringRules: {
        type: "ybocs",
      },
    },
    ocir: {
      id: "ocir",
      title: "强迫量表修订版",
      description: "OCI-R 由 Foa 等 2002 年编制（公共领域），用 0-4 评估过去一个月强迫症状带来的困扰，含洗涤、检查、排序、强迫思维、中和、囤积 6 个子量表。",
      instructions: "每题用滑块选择 0-4，表示该体验在过去一个月给您造成的困扰程度（0=完全没有，1=有一点，2=中等，3=相当多，4=极其）。建议按直觉作答。",
      questions: ocirQuestions.map((q) => ({
        id: q.id,
        text: q.text,
        type: "likert",
        options: [
          { value: 0, label: "完全没有" },
          { value: 1, label: "有一点" },
          { value: 2, label: "中等程度" },
          { value: 3, label: "相当多" },
          { value: 4, label: "极其" },
        ],
      })),
      scoringRules: {
        type: "ocir",
      },
    },
    ptsd: {
      id: "ptsd",
      title: "创伤后应激严重度（PTSD）",
      description: "PTSD 严重度短量表（NSESSS，9 题）评估经历极端应激事件后过去 7 天的创伤后应激症状，含闪回、回避、消极信念/情绪与警觉增高。",
      instructions: "请回想一次令你深感痛苦的极端应激事件（如意外、暴力、灾难、重大丧失等），然后按过去 7 天内这些困扰的程度作答（完全没有 / 有一点 / 中等程度 / 相当多 / 极其）。若未经历过类似事件，本量表可不作答。",
      questions: ptsdQuestions.map((q) => ({
        id: q.id,
        text: q.text,
        type: "likert",
        options: ptsdOptions,
      })),
      scoringRules: {
        type: "ptsd",
      },
    },
    panic: {
      id: "panic",
      title: "惊恐障碍严重度",
      description: "惊恐障碍成人严重度量表（DSM-5-TR，10 题）评估过去 7 天惊恐发作的频率、相关担忧、躯体症状与回避。",
      instructions: "惊恐发作是突然到来的强烈恐惧，可伴有心跳加速、气短、头晕、出汗、怕失控或濒死。请按过去 7 天内的实际频率作答（从未 / 偶尔 / 一半时间 / 大部分时间 / 几乎所有时间）。",
      questions: panicQuestions.map((q) => ({
        id: q.id,
        text: q.text,
        type: "likert",
        options: panicOptions,
      })),
      scoringRules: {
        type: "panic",
      },
    },
    social: {
      id: "social",
      title: "社交焦虑障碍严重度",
      description: "社交焦虑（社交恐怖）成人严重度量表（DSM-5-TR，10 题）评估过去 7 天在社交情境中的焦虑、躯体反应与回避。",
      instructions: "社交情境包括公开讲话、开会、聚会、自我介绍、交谈、被表扬、向人求助、当众吃饭写字等。请按过去 7 天内的实际频率作答（从未 / 偶尔 / 一半时间 / 大部分时间 / 几乎所有时间）。",
      questions: socialQuestions.map((q) => ({
        id: q.id,
        text: q.text,
        type: "likert",
        options: socialOptions,
      })),
      scoringRules: {
        type: "social",
      },
    },
    phobia: {
      id: "phobia",
      title: "特定恐怖症严重度",
      description: "特定恐怖症成人严重度量表（DSM-5-TR，10 题）评估过去 7 天对特定事物/情境的恐惧、躯体反应与回避。",
      instructions: "请先选定最令你焦虑的一类情境（驾驶/飞行/隧道/桥梁/封闭空间、动物或昆虫、高处/风暴/水、血液/针头/注射、呛噎或呕吐），然后按该类情境在过去 7 天内的实际频率作答（从未 / 偶尔 / 一半时间 / 大部分时间 / 几乎所有时间）。",
      questions: phobiaQuestions.map((q) => ({
        id: q.id,
        text: q.text,
        type: "likert",
        options: phobiaOptions,
      })),
      scoringRules: {
        type: "phobia",
      },
    },
    agora: {
      id: "agora",
      title: "广场恐怖严重度",
      description: "广场恐怖成人严重度量表（DSM-5-TR，10 题）评估过去 7 天在人群、公共场所、使用交通工具、独自出行或离家等情境中的恐惧与回避。",
      instructions:
        "这里的情境指：人群、公共场所、乘坐交通工具、独自出行或离家。请按这些情境在过去 7 天内的实际频率作答（从未 / 偶尔 / 一半时间 / 大部分时间 / 几乎所有时间）。",
      questions: agoraQuestions.map((q) => ({
        id: q.id,
        text: q.text,
        type: "likert",
        options: agoraOptions,
      })),
      scoringRules: {
        type: "agora",
      },
    },
    sepanx: {
      id: "sepanx",
      title: "分离焦虑障碍严重度",
      description: "分离焦虑障碍成人严重度量表（DSM-5-TR，10 题）评估过去 7 天与重要的人或家分离时的恐惧、担忧、躯体反应与回避。",
      instructions: "分离焦虑指离开家、或与重要的人分开时的过度恐惧与担忧。请按过去 7 天内的实际频率作答（从未 / 偶尔 / 一半时间 / 大部分时间 / 几乎所有时间）。",
      questions: sepanxQuestions.map((q) => ({
        id: q.id,
        text: q.text,
        type: "likert",
        options: sepanxOptions,
      })),
      scoringRules: {
        type: "sepanx",
      },
    },
    audit: {
      id: "audit",
      title: "酒精使用障碍筛查量表（AUDIT）",
      description:
        "WHO 协作项目编制（Saunders 等 1993），10 题评估饮酒量、依赖症状与有害后果，总分 0-40，≥8 提示危险或有害饮酒。",
      instructions:
        "请按你过去一年的真实情况作答。第 1-3 题问的是一般的饮酒情况，第 4-10 题问过去一年；第 9、10 题若「有但不在过去一年」也算有相关经历。不饮酒者第 1 题选「从不」，其余题目选最低档即可。结果用于筛查参考，不构成诊断。",
      questions: auditQuestions.map((q) => ({
        id: q.id,
        text: q.text,
        type: "likert",
        options: q.options,
      })),
      scoringRules: {
        type: "audit",
      },
    },
    igds: {
      id: "igds",
      title: "网络游戏障碍量表（简式）",
      description:
        "Pontes 与 Griffiths 2015 年编制（IGDS9-SF），9 题对应 DSM-5 网络游戏障碍的 9 条标准，其中 ≥5 条达到「非常频繁」提示症状与网络游戏障碍相符。",
      instructions:
        "请按过去 12 个月的情况作答，每题从「从不 / 很少 / 有时 / 经常 / 非常频繁」中选择。官方判定依据是「非常频繁」的条目数（≥5 条），而非总分高低。结果用于筛查参考，不构成诊断。",
      questions: igdsQuestions.map((q) => ({
        id: q.id,
        text: q.text,
        type: "likert",
        options: igdsOptions,
      })),
      scoringRules: {
        type: "igds",
      },
    },
    eat26: {
      id: "eat26",
      title: "进食态度测验（EAT-26）",
      description:
        "Garner 等 1982 年编制的进食态度筛查量表，26 题覆盖节食、贪食与食物关注、口腔控制三个方向，总分 0-78，≥20 为官方筛查阳性线。",
      instructions:
        "请按你平时的实际感受作答，每题从「总是 / 经常 / 常常 / 有时 / 很少 / 从不」中选择。本量表问的是一贯的进食态度与行为，没有固定时间窗口；结果用于筛查参考，不构成诊断。",
      // 26 题共用一套 value 唯一的档位选项；第 26 题的反向计分在 scoreEAT26 里处理
      questions: eat26Questions.map((q) => ({
        id: q.id,
        text: q.text,
        type: "likert",
        options: eat26Options,
      })),
      scoringRules: {
        type: "eat26",
      },
    },
    scoff: {
      id: "scoff",
      title: "SCOFF 进食障碍筛查问卷",
      description:
        "Morgan 等 1999 年编制的 5 题进食障碍筛查问卷（Sick / Control / One stone / Fat / Food），二分类作答，≥2 项为筛查阳性。",
      instructions:
        "每题回答「是」或「否」，无需判断程度。SCOFF 只有阳性与阴性两档结果，用于提示是否需要专业评估，不构成诊断。",
      questions: scoffQuestions.map((q) => ({
        id: q.id,
        text: q.text,
        type: "likert",
        options: scoffOptions,
      })),
      scoringRules: {
        type: "scoff",
      },
    },
    asrs: {
      id: "asrs",
      title: "成人 ADHD 自评量表（ASRS-v1.1）",
      description:
        "世界卫生组织（WHO）成人 ADHD 工作组编制（2003），18 题对应 DSM-IV-TR 的 ADHD 症状条目，Part A 的阴影计数 ≥4 提示症状可能与成人 ADHD 相符。",
      instructions:
        "请按过去 6 个月的真实情况作答，每题从「从不 / 很少 / 有时 / 常常 / 非常频繁」中选择。本量表仅适用于 18 岁以上人群；判定依据是 Part A（第 1-6 题）中达到各自频率阈值的题数，而不是总分高低。结果用于筛查参考，不构成诊断。",
      questions: asrsQuestions.map((q) => ({
        id: q.id,
        text: q.text,
        type: "likert",
        options: asrsOptions,
      })),
      scoringRules: {
        type: "asrs",
      },
    },
    ecrr: {
      id: "ecrr",
      title: "亲密关系经历量表修订版（ECR-R）",
      description:
        "Fraley、Waller 与 Brennan 2000 年编制，36 题分别测量成人依恋的焦虑与回避两个维度（各 18 题），用于了解自己在亲密关系中的依恋倾向。",
      instructions:
        "请按你在亲密关系中一般的感受作答（不只是当前这一段关系），每题从 1=强烈不同意 到 7=强烈同意。第 9、11、20、22、26-31、33-36 题为反向表述，照实选择即可，计分时系统会自动处理。本量表不产出总分，结果呈现两个维度的均分。",
      questions: ecrrQuestions.map((q) => ({
        id: q.id,
        text: q.text,
        type: "likert",
        options: ecrrOptions,
        dimension: q.dimension,
      })),
      scoringRules: {
        type: "ecrr",
      },
    },
    psqi: {
      id: "psqi",
      title: "匹兹堡睡眠质量指数（PSQI）",
      description:
        "Buysse 等 1989 年编制，18 个自评条目折算成 7 个成分（睡眠质量、入睡时间、睡眠时间、睡眠效率、睡眠障碍、催眠药物、日间功能障碍），总分 0-21，分越高睡眠越差。",
      instructions:
        "请按最近一个月的真实睡眠情况作答。第 1-4 题用滑块选择就寝时间、入睡用时、起床时间与实际睡眠时长；第 5-9 题按出现频率或程度选择。总分 >5 提示睡眠质量差（国内常用界值为 >7）。结果用于筛查参考，不构成诊断。",
      questions: psqiQuestions.map((q) => {
        if (q.input === "range") {
          return {
            id: q.id,
            text: q.text,
            type: "range" as const,
            min: q.min,
            max: q.max,
            step: q.step,
            minLabel: q.minLabel,
            maxLabel: q.maxLabel,
          };
        }
        let options = psqiFrequencyOptions;
        if (q.code === "Q6") options = psqiQualityOptions;
        if (q.code === "Q9") options = psqiDaytimeOptions;
        return {
          id: q.id,
          text: q.text,
          type: "likert" as const,
          options,
        };
      }),
      scoringRules: {
        type: "psqi",
      },
    },
    swls: {
      id: "swls",
      title: "生活满意度量表（SWLS）",
      description:
        "Diener 等 1985 年编制的主观幸福感量表，5 题 7 点评分，总分 5-35，分越高表示对整体生活越满意（方向与症状量表相反）。",
      instructions:
        "请按你对自己整个人生的整体判断作答，每题从 1=非常不同意 到 7=非常同意。本量表问的不是最近的情绪，而是你对生活现状的总体评价；没有对错，凭第一感觉作答即可。",
      questions: swlsQuestions.map((q) => ({
        id: q.id,
        text: q.text,
        type: "likert",
        options: swlsOptions,
      })),
      scoringRules: {
        type: "swls",
      },
    },
    multidim: {
      id: "multidim",
      title: "心理健康多维自评量表",
      description:
        "基于多维特征模型的心理健康自评量表，覆盖 20 个核心特征维度，并内置回答一致性与作答效度校验。选择评估模式后按模式出题。",
      instructions:
        "请选择最符合的选项（非常符合 / 比较符合 / 不确定 / 不太符合 / 完全不符合）。多数题目问的是最近两周的情况；少数题目会在题号旁标注其他时间范围（如「曾经有过的一段时期」「长期 / 从小一直」），请按该题标注的范围作答。本量表为自评参考与科普用途，不构成临床诊断，不能替代专业医疗。",
      questions: multidimMode
        ? buildMultidimQuestions(multidimMode, multidimSeed).map((q) => {
            // 标注题目的时间窗口：少数题目问的不是「最近两周」，
            // 不标注会让作答者把长期特征与近期状态混在一起作答。
            const win = q.kind === "lie" ? null : multidimWindowOf(q.id);
            return {
              id: q.id,
              text: q.text,
              type: "likert" as const,
              options: multidimOptions,
              window: win,
              windowLabel: win ? MULTIDIM_WINDOW_LABEL[win] : null,
            };
          })
        : [],
      scoringRules: {
        type: "multidim",
      },
      modes: MULTIDIM_MODES,
    },
  };

  const test = testDatabase[id as string];
  if (!test) {
    throw createError({
      statusCode: 404,
      statusMessage: "测评不存在",
      message: `未找到ID为 ${id} 的测评`,
    });
  }

  const intro = testIntros[id as string];
  // 评估时间范围与作答前提统一取自 server/utils/test-timeframe.ts：
  // 作答页需要固定展示"这次在评什么时间段"，结果页的量表列表也需要同一份数据，
  // 各写一份迟早会漂移。
  const timing = {
    ...(timeFrameOf(String(id)) ? { timeFrame: timeFrameOf(String(id)) } : {}),
    ...(contextHintOf(String(id)) ? { contextHint: contextHintOf(String(id)) } : {}),
  };
  const payload: any = intro ? { ...test, ...timing, intro } : { ...test, ...timing };

  // 多维自评量表：签发出题凭证。提交时以凭证内的 mode / seed 为准，
  // 避免客户端的「出题参数」与「评分参数」可以不是同一套。
  if (multidimMode) {
    payload.questionToken = createQuestionToken({
      testId: String(id),
      mode: multidimMode,
      seed: multidimSeed,
    });
  }

  return {
    success: true,
    data: payload,
  };
});
