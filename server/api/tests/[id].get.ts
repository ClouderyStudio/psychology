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

// 按题目 id 升序排序（题库文件顺序可能与出题顺序不同）
function sortQuestionsById<T extends { id: number }>(questions: T[]): T[] {
  return [...questions].sort((a, b) => a.id - b.id);
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  const testDatabase: Record<string, Test> = {
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
  };

  const test = testDatabase[id as string];
  if (!test) {
    throw createError({
      statusCode: 404,
      statusMessage: "测评不存在",
      message: `未找到ID为 ${id} 的测评`,
    });
  }

  return {
    success: true,
    data: test,
  };
});
