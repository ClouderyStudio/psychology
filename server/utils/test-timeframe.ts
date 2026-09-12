// 评估时间范围与作答前提：作答页、量表列表接口、结果页共用一份，避免各写一份而漂移。
//
// 为什么需要它（第三批报告 6）：各量表的窗口并不一致——PHQ-9 / GAD-7 是两周、
// SDS / SAS / SCL-90 是一周、YMRS 是 48 小时、ISI 是两周、PSS 是一个月、
// SDQ-20 是一年，而题面里往往看不出用的是哪个窗口；严重度量表的题面统一写
// 「这些情境」，前提只出现在量表说明里，翻页后就看不到了。把窗口单独下发，
// 作答页与结果页才能固定展示"这次到底在评什么时间段"。

/** 各量表的评估时间范围。未列出的量表没有固定窗口（对自身的一贯描述）。 */
export const TEST_TIME_FRAME: Record<string, string> = {
  phq9: "最近两周",
  gad7: "最近两周",
  pss: "过去一个月",
  scl90: "最近一周",
  sds: "过去一周",
  sas: "过去一周",
  bdc: "过去一周（含今天）",
  bpns: "过去一周",
  // MDQ 问的是"是否有过"，没有近期窗口，明确写出来避免被当成"最近两周"
  mdq: "是否有过类似经历（不限近期）",
  asrm: "过去一周",
  ymrs: "过去 48 小时",
  isi: "过去 2 周",
  mid60: "最近一个月",
  sdq20: "过去一年",
  ybocs: "最近一周",
  ocir: "过去一个月",
  ptsd: "过去 7 天",
  panic: "过去 7 天",
  social: "过去 7 天",
  phobia: "过去 7 天",
  agora: "过去 7 天",
  sepanx: "过去 7 天",
  // 多维自评：多数题目是最近两周，少数题目在题号旁另行标注
  multidim: "最近两周（少数题目另行标注）",
  // DES-II 问的是"出现的时间比例"，本身没有窗口，写明以免被误读
  des2: "日常生活中出现的时间比例（无固定窗口）",
};

/**
 * 作答前提：题面里只写「这些情境」的严重度量表，把具体所指固定展示在题目上方。
 * 内容与各自的 instructions 一致，只是不再随翻页消失。
 */
export const TEST_CONTEXT_HINT: Record<string, string> = {
  panic: "惊恐发作 = 突然到来的强烈恐惧，可伴心跳加速、气短、头晕、出汗、怕失控或濒死。",
  social:
    "社交情境 = 公开讲话、开会、聚会、自我介绍、交谈、被表扬、向人求助、当众吃饭写字等。",
  phobia:
    "请先选定最令你焦虑的一类情境（驾驶/飞行/隧道/桥梁/封闭空间、动物或昆虫、高处/风暴/水、血液/针头/注射、呛噎或呕吐），再按该类情境作答。",
  agora: "广场情境 = 人群、公共场所、乘坐交通工具、独自出行或离家。",
  sepanx: "分离焦虑 = 离开家、或与重要的人分开时的过度恐惧与担忧。",
};

export function timeFrameOf(testId: string | undefined | null): string | undefined {
  return testId ? TEST_TIME_FRAME[testId] : undefined;
}

export function contextHintOf(testId: string | undefined | null): string | undefined {
  return testId ? TEST_CONTEXT_HINT[testId] : undefined;
}
