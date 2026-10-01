import { describe, expect, it } from "vitest";
import {
  DIMENSION_MAX_COUNT,
  LOCAL_ANALYSIS_TTL_MS,
  NOTE_MAX_LENGTH,
  PROFILE_MAX_COUNT,
  SUGGESTION_MAX_LENGTH,
  analysisEngineLabel,
  buildAnalysisRequest,
  extractDimensions,
  extractProfile,
  resolveScoreKind,
  shouldRefreshAnalysis,
  splitAnalysisSections,
} from "../app/utils/ai-analysis";

/** 换行在模板里显式写出，避免依赖文件里的转义 */
const NL = "\n";

describe("buildAnalysisRequest", () => {
  it("没有 testId 时不组装请求", () => {
    expect(buildAnalysisRequest(null)).toBeNull();
    expect(buildAnalysisRequest({})).toBeNull();
    expect(buildAnalysisRequest({ testId: "   " })).toBeNull();
  });

  it("只带服务端用得上的字段，缺省字段不出现", () => {
    const req = buildAnalysisRequest({
      testId: "phq9",
      testTitle: "抑郁自评",
      totalScore: 12,
      maxScore: 27,
      level: "中度",
      severity: 0.55,
    });
    expect(req).toEqual({
      testId: "phq9",
      risk: false,
      scoreKind: "severity",
      testTitle: "抑郁自评",
      totalScore: 12,
      maxScore: 27,
      level: "中度",
      severity: 0.55,
    });
    expect(req && "note" in req).toBe(false);
    expect(req && "dimensions" in req).toBe(false);
    expect(req && "profile" in req).toBe(false);
    expect(req && "suggestion" in req).toBe(false);
  });

  it("备注默认不发送，显式允许才带上", () => {
    const result = { testId: "phq9", note: "最近加班较多" };
    expect(buildAnalysisRequest(result)?.note).toBeUndefined();
    expect(buildAnalysisRequest(result, { includeNote: false })?.note).toBeUndefined();
    expect(buildAnalysisRequest(result, { includeNote: true })?.note).toBe("最近加班较多");
    // 空备注等同于没有备注
    expect(buildAnalysisRequest({ testId: "phq9", note: "  " }, { includeNote: true })?.note).toBeUndefined();
  });

  it("备注与专业建议超长时截断", () => {
    const req = buildAnalysisRequest(
      { testId: "phq9", note: "备".repeat(5000), suggestion: "建".repeat(1000) },
      { includeNote: true },
    );
    expect(req?.note?.length).toBe(NOTE_MAX_LENGTH);
    expect(req?.suggestion?.length).toBe(SUGGESTION_MAX_LENGTH);
  });

  it("risk 只在显式为 true 时置位", () => {
    expect(buildAnalysisRequest({ testId: "sioss" })?.risk).toBe(false);
    expect(buildAnalysisRequest({ testId: "sioss" }, { risk: true })?.risk).toBe(true);
    expect(buildAnalysisRequest({ testId: "sioss" }, { risk: false })?.risk).toBe(false);
  });

  it("category / timeFrame 来自调用方（结果对象里没有）", () => {
    const req = buildAnalysisRequest({ testId: "phq9" }, { category: "symptom", timeFrame: "近两周" });
    expect(req?.category).toBe("symptom");
    expect(req?.timeFrame).toBe("近两周");
  });

  it("丢弃非有限数值与空文案", () => {
    const req = buildAnalysisRequest({
      testId: "phq9",
      totalScore: Number.NaN,
      maxScore: "abc",
      level: "   ",
      scoreNote: "",
      severity: Number.POSITIVE_INFINITY,
    });
    expect(req).toEqual({ testId: "phq9", risk: false, scoreKind: "severity" });
  });

  it("数字字符串按数字收下", () => {
    expect(buildAnalysisRequest({ testId: "phq9", totalScore: "12" })?.totalScore).toBe(12);
  });
});

describe("extractDimensions", () => {
  it("数组形态：name/trait + score/value", () => {
    expect(
      extractDimensions([
        { trait: "hopeless", name: "绝望感", score: 8, max: 12, level: "偏高" },
        { name: "睡眠困扰", value: 2 },
      ]),
    ).toEqual([
      { name: "绝望感", score: 8, max: 12, level: "偏高" },
      { name: "睡眠困扰", score: 2 },
    ]);
  });

  it("对象形态：键名兜底、avg / tScore 都算分数", () => {
    expect(
      extractDimensions({
        E: { name: "外向", tScore: 62 },
        N: { avg: 2.5, level: "中等" },
      }),
    ).toEqual([
      { name: "外向", score: 62 },
      { name: "N", score: 2.5, level: "中等" },
    ]);
  });

  it("丢弃没有分数的纯文案对象、数组、布尔与 type 标记", () => {
    expect(
      extractDimensions({
        type: "multidim",
        highlight: { label: "入睡困难", freq: "几乎每天" },
        stages: [1, 2, 3],
        valid: true,
        anger: { name: "愤怒", score: 18, max: 35 },
      }),
    ).toEqual([{ name: "愤怒", score: 18, max: 35 }]);
  });

  it("最多送出 16 个维度", () => {
    const many: Record<string, any> = {};
    for (let i = 0; i < 25; i++) many["d" + i] = { name: "维度" + i, score: i };
    const dims = extractDimensions(many);
    expect(dims).toHaveLength(DIMENSION_MAX_COUNT);
    expect(dims[0]!.name).toBe("维度0");
  });

  it("非对象输入返回空数组", () => {
    expect(extractDimensions(undefined)).toEqual([]);
    expect(extractDimensions("x")).toEqual([]);
    expect(extractDimensions(null)).toEqual([]);
  });
});

describe("splitAnalysisSections", () => {
  it("按空行切分四段并去掉段首编号", () => {
    const text = ["1) 结果解读：总分偏高。", "2) 状态分析：近期压力较大。", "3) 自助建议：规律作息。", "4) 求助指引：必要时就诊。"].join(NL + NL);
    expect(splitAnalysisSections(text)).toEqual([
      "结果解读：总分偏高。",
      "状态分析：近期压力较大。",
      "自助建议：规律作息。",
      "求助指引：必要时就诊。",
    ]);
  });

  it("四段挤在同一行时按句末编号切开", () => {
    const text = "1) 结果解读：总分偏高。2) 状态分析：近期压力较大。3) 自助建议：规律作息。";
    expect(splitAnalysisSections(text)).toEqual([
      "结果解读：总分偏高。",
      "状态分析：近期压力较大。",
      "自助建议：规律作息。",
    ]);
  });

  it("支持全角括号与中文序号", () => {
    expect(splitAnalysisSections("1）第一段。" + NL + "2）第二段。")).toEqual(["第一段。", "第二段。"]);
    expect(splitAnalysisSections("一、第一段。" + NL + "二、第二段。")).toEqual(["第一段。", "第二段。"]);
  });

  it("不把小数字段切开", () => {
    expect(splitAnalysisSections("1) 得分 0.5 分，属轻度范围。")).toEqual(["得分 0.5 分，属轻度范围。"]);
  });

  it("没有编号时整段返回", () => {
    expect(splitAnalysisSections("这是一段没有编号的分析。")).toEqual(["这是一段没有编号的分析。"]);
  });

  it("统一 CRLF 并忽略空白/非字符串", () => {
    expect(splitAnalysisSections("1) 甲\r\n\r\n2) 乙")).toEqual(["甲", "乙"]);
    expect(splitAnalysisSections("   ")).toEqual([]);
    expect(splitAnalysisSections(undefined)).toEqual([]);
    expect(splitAnalysisSections({} as any)).toEqual([]);
  });
});

describe("shouldRefreshAnalysis", () => {
  const now = Date.parse("2026-10-01T10:00:00Z");
  const ago = (ms: number) => new Date(now - ms).toISOString();

  it("没有缓存就必须生成", () => {
    expect(shouldRefreshAnalysis(undefined, now)).toBe(true);
    expect(shouldRefreshAnalysis(null, now)).toBe(true);
    expect(shouldRefreshAnalysis({}, now)).toBe(true);
    expect(shouldRefreshAnalysis({ analysis: "" }, now)).toBe(true);
  });

  it("AI 生成的结果一直复用，不再重复请求模型", () => {
    expect(shouldRefreshAnalysis({ analysis: "x", engine: "llm", generatedAt: ago(30 * 24 * 3600e3) }, now)).toBe(false);
  });

  it("本地兜底文本在 TTL 内复用，超过 TTL 再试一次", () => {
    expect(shouldRefreshAnalysis({ analysis: "x", engine: "local", generatedAt: ago(60e3) }, now)).toBe(false);
    expect(shouldRefreshAnalysis({ analysis: "x", engine: "local", generatedAt: ago(LOCAL_ANALYSIS_TTL_MS - 1) }, now)).toBe(false);
    expect(shouldRefreshAnalysis({ analysis: "x", engine: "local", generatedAt: ago(LOCAL_ANALYSIS_TTL_MS) }, now)).toBe(true);
  });

  it("generatedAt 不可解析时重新生成", () => {
    expect(shouldRefreshAnalysis({ analysis: "x", engine: "local", generatedAt: "not-a-date" }, now)).toBe(true);
    expect(shouldRefreshAnalysis({ analysis: "x", engine: "local" }, now)).toBe(true);
  });
});

describe("resolveScoreKind", () => {
  it("类型型量表：总分不代表程度高低", () => {
    expect(resolveScoreKind("mbti")).toBe("type");
    expect(resolveScoreKind("psy-age")).toBe("type");
    expect(resolveScoreKind("seven")).toBe("type");
    expect(resolveScoreKind("sixteenPF")).toBe("type");
    expect(resolveScoreKind("epq-rsc")).toBe("type");
  });

  it("特质型量表：分数只表示相对倾向", () => {
    expect(resolveScoreKind("rses")).toBe("trait");
    expect(resolveScoreKind("ipip-eis")).toBe("trait");
    expect(resolveScoreKind("emotional-stability")).toBe("trait");
    expect(resolveScoreKind("bpaq")).toBe("trait");
  });

  it("其余按计分型处理，category 只作兜底", () => {
    expect(resolveScoreKind("phq9")).toBe("severity");
    expect(resolveScoreKind("scl90", "symptom")).toBe("severity");
    expect(resolveScoreKind("multidim", "symptom")).toBe("severity");
    expect(resolveScoreKind("未知量表", "personality")).toBe("trait");
    expect(resolveScoreKind(undefined)).toBe("severity");
  });
});

describe("extractDimensions 的边界形态", () => {
  it("嵌套容器向下钻一层（情绪智力量表的 dimensions）", () => {
    expect(extractDimensions({ dimensions: { empathy: { score: 3.5, desc: "能察觉他人情绪" } } })).toEqual([
      { name: "同理心关注", score: 3.5, desc: "能察觉他人情绪" },
    ]);
  });

  it("带 type 标记的总分表里跳过 MBTI 四个偏好轴（方向由字母给出）", () => {
    expect(
      extractDimensions({
        E_I: { score: 24, avg: 2.4, result: "I" },
        type: "INFP",
        innerOuter: { consistency: 100, status: "内在偏好与外在表现较一致" },
      }),
    ).toEqual([]);
  });

  it("保留维度说明：desc 优先，其次高低分描述", () => {
    expect(
      extractDimensions({
        E: { name: "外向", tScore: 62, desc: "典型高分" },
        topFactors: [{ factor: "A", name: "乐群性", score: 10, highDesc: "外向、热情", lowDesc: "缄默、孤独" }],
      }),
    ).toEqual([
      { name: "外向", score: 62, desc: "典型高分" },
      { name: "乐群性", score: 10, desc: "偏高：外向、热情；偏低：缄默、孤独" },
    ]);
  });

  it("纯数字对象（16PF 因素分、原始分）不当作维度", () => {
    expect(extractDimensions({ factors: { A: 5, B: 6 }, rawScores: { A: 3 } })).toEqual([]);
  });
});

describe("extractProfile", () => {
  const mbtiResult = {
    testId: "mbti",
    level: "INFP",
    mbtiReport: {
      type: "INFP",
      typeName: "治愈者型 - 理想主义、忠诚、有热情",
      preferences: [
        { title: "你的注意力总倾向", left: "Extraversion - 外倾", right: "Introversion - 内倾", selected: "I" },
        { title: "你更偏好的信息获取方式是", left: "Sensing - 实际感知", right: "Intuition - 跨越觉察", selected: "N" },
      ],
      functionStack: {
        roles: [{ title: "你的人格之脑", subtitle: "核心动力", function: "Fi", label: "循心" }],
      },
      functionScores: { natural: [{ code: "Fi", label: "循心", percent: 13.9 }] },
      innerOuterProfile: {
        innerType: "INFP",
        outerType: "INFP",
        consistency: 100,
        status: "内在偏好与外在表现较一致",
        dimensions: [{ title: "能量与表达", innerLetter: "E", innerPercent: 75, outerLetter: "E", outerPercent: 75 }],
      },
      mask: { name: "SP 面具「现实火花」", rarity: "6.00%", maskRatio: "13.00%", temperament: "NF" },
    },
  };

  it("MBTI：给出类型、四轴方向、功能位置与强度、内外一致、气质面具", () => {
    expect(extractProfile(mbtiResult)).toEqual([
      { name: "类型", value: "INFP 治愈者型 - 理想主义、忠诚、有热情" },
      {
        name: "四轴偏好",
        value: "你的注意力总倾向：I 内倾；你更偏好的信息获取方式是：N 跨越觉察",
      },
      { name: "功能位置", value: "你的人格之脑（核心动力）：Fi 循心" },
      { name: "功能强度", value: "Fi-循心 13.9%" },
      { name: "内外一致", value: "内在 INFP / 外在 INFP，一致度 100%：内在偏好与外在表现较一致" },
      { name: "内/外倾向", value: "能量与表达：内在 E 75% / 外在 E 75%" },
      { name: "气质面具", value: "SP 面具「现实火花」（罕见度 6.00%，面具占 13.00%，气质 NF）" },
    ]);
  });

  it("七美德与七宗罪：两个指数、主导之罪、守护美德、分布与共存", () => {
    const items = extractProfile({
      testId: "seven",
      sevenReport: {
        sinIndex: 50,
        virtueIndex: 50,
        sinTier: { label: "罪业缠身" },
        virtueTier: { label: "中人之德" },
        dominantSin: { name: "傲慢", pct: 63, tag: "不可一世 · 目中无人" },
        guardianVirtue: { name: "贞洁", pct: 63 },
        sins: [
          { name: "傲慢", pct: 63, bandLabel: "居中" },
          { name: "色欲", pct: 56, bandLabel: "居中" },
        ],
        virtues: [{ name: "谦卑", pct: 50, bandLabel: "居中" }],
        coexist: [{ sinName: "色欲", sinPct: 56, virtueName: "贞洁", virtuePct: 63 }],
      },
    });
    expect(items).toEqual([
      { name: "罪孽指数", value: "50/100 · 罪业缠身" },
      { name: "美德指数", value: "50/100 · 中人之德" },
      { name: "主导之罪", value: "傲慢 63%（不可一世 · 目中无人）" },
      { name: "守护美德", value: "贞洁 63%" },
      { name: "七宗罪分布", value: "傲慢 63%（居中）、色欲 56%（居中）" },
      { name: "七美德分布", value: "谦卑 50%（居中）" },
      { name: "罪德共存", value: "色欲 56% 与 贞洁 63%" },
    ]);
  });

  it("心理年龄：年龄值、双轴、责任感与各维度年龄", () => {
    expect(
      extractProfile({
        testId: "psy-age",
        totalScore: 33,
        psyAgeReport: {
          psychAge: 33,
          descriptor: "两轴都在蓄力",
          archetype: { title: "迷航待航型" },
          maturity: 50,
          youth: 56,
          balance: { label: "非常均衡" },
          resLevel: "担当适中",
          dims: [
            { name: "认知活力", age: 36, bandLabel: "均衡" },
            { name: "情绪成熟", age: 26, bandLabel: "偏年轻" },
          ],
        },
      }),
    ).toEqual([
      { name: "心理年龄", value: "33 岁（两轴都在蓄力 · 迷航待航型）" },
      { name: "双轴画像", value: "成熟度 50 / 少年感 56，六维分布：非常均衡" },
      { name: "责任感", value: "担当适中" },
      { name: "心理年龄维度", value: "认知活力 36 岁（均衡）；情绪成熟 26 岁（偏年轻）" },
    ]);
  });

  it("多维自评量表：总体结论、安全信号与作答可信度", () => {
    expect(
      extractProfile({
        testId: "multidim",
        multidimReport: {
          summary: {
            level: "极重度",
            traitsText: "社交互动困难、体型关注",
            severeText: "检出（详见安全提示）",
            concernText: "未检出",
            elevated: 20,
            traitTotal: 20,
          },
          severeSignalDetails: [{ label: "自伤或轻生的念头", level: "danger" }],
          validity: { valid: true },
        },
      }),
    ).toEqual([
      {
        name: "总体结论",
        value: "极重度；突出方向：社交互动困难、体型关注；严重信号：检出（详见安全提示）；需关注：未检出（达到关注标准的维度 20/20）",
      },
      { name: "安全信号", value: "自伤或轻生的念头（danger）" },
      { name: "作答可信度", value: "作答可信" },
    ]);
  });

  it("卡特尔 16PF 的因素分要配上因素名", () => {
    expect(extractProfile({ testId: "sixteenPF", dimensionScores: { factors: { A: 5, F: 10 } } })).toEqual([
      { name: "16 因素分（1-10，5 分附近为中等）", value: "乐群性 5、兴奋性 10" },
    ]);
  });

  it("原始分、标准分与条目上限", () => {
    expect(extractProfile({ testId: "des2", rawScore: 12, standardizedScore: 55 })).toEqual([
      { name: "原始分", value: "12" },
      { name: "标准分", value: "55" },
    ]);

    const many = extractProfile({
      ...mbtiResult,
      sevenReport: {
        sinIndex: 1,
        virtueIndex: 2,
        sinTier: { label: "a" },
        virtueTier: { label: "b" },
        sins: [{ name: "傲慢", pct: 1, bandLabel: "低" }],
        virtues: [{ name: "谦卑", pct: 2, bandLabel: "低" }],
      },
      psyAgeReport: { psychAge: 30, dims: [{ name: "认知活力", age: 30, bandLabel: "均衡" }] },
      multidimReport: { summary: { level: "正常" }, validity: { valid: true } },
      rawScore: 1,
      standardizedScore: 2,
    });
    expect(many.length).toBe(PROFILE_MAX_COUNT);
  });

  it("没有画像数据时返回空数组", () => {
    expect(extractProfile(null)).toEqual([]);
    expect(extractProfile({ testId: "phq9" })).toEqual([]);
  });
});

describe("buildAnalysisRequest 的量表类型与画像", () => {
  it("类型型量表带上 scoreKind 与画像，且不送无意义的偏好轴分数", () => {
    const req = buildAnalysisRequest(
      {
        testId: "mbti",
        testTitle: "MBTI 人格测试",
        level: "INFP",
        totalScore: 51,
        maxScore: 100,
        dimensionScores: { E_I: { score: 24, avg: 2.4, result: "I" }, type: "INFP" },
        mbtiReport: { type: "INFP", typeName: "治愈者型" },
      },
      { category: "personality" },
    );
    expect(req?.scoreKind).toBe("type");
    expect(req?.profile).toEqual([{ name: "类型", value: "INFP 治愈者型" }]);
    expect(req?.dimensions).toBeUndefined();
  });

  it("计分型量表：维度照常送出，画像缺失也不影响", () => {
    const req = buildAnalysisRequest({
      testId: "phq9",
      totalScore: 14,
      maxScore: 27,
      level: "中度",
      dimensionScores: { 绝望感: { score: 8, desc: "对前景感到无望" } },
    });
    expect(req?.scoreKind).toBe("severity");
    expect(req?.dimensions).toEqual([{ name: "绝望感", score: 8, desc: "对前景感到无望" }]);
    expect(req?.profile).toBeUndefined();
  });
});

describe("analysisEngineLabel", () => {
  it("区分模型结果与本地兜底", () => {
    expect(analysisEngineLabel("llm")).toBe("AI 生成");
    expect(analysisEngineLabel("local")).toBe("本地生成");
    expect(analysisEngineLabel(undefined)).toBe("本地生成");
  });
});