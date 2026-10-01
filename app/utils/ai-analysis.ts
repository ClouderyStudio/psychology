/**
 * AI 结果分析的前端纯函数。
 *
 * 与 ClouderyApi 的 `POST /exam/result-analysis` 一一对应（服务端实现在
 * Services/Cloudery/ResultAnalysisService.cs）：这里只负责把本机存档里的结果整理成
 * 请求体、把返回的四段文本切成可渲染的段落，以及判断何时该自动重新生成。
 * 刻意写成不依赖 DOM / Nuxt 的纯函数，便于在 node 下直接单测。
 */

/** 量表结果的类型：计分型（分数=困扰程度）、特质型（分数=相对倾向）、类型型（类型/画像，分数无高低含义） */
export type AiAnalysisScoreKind = "severity" | "trait" | "type";

export interface AiAnalysisDimension {
  name?: string;
  score?: number;
  max?: number;
  level?: string;
  /** 维度自带的解释文案（服务端会拼进提示词，帮助模型做具体剖析） */
  desc?: string;
}

/** 量表的画像数据：类型、指数、双轴、效度等非「分数」形式的结果 */
export interface AiAnalysisProfileItem {
  name: string;
  value: string;
}

export interface AiAnalysisRequest {
  testId: string;
  testTitle?: string;
  category?: string;
  scoreKind?: AiAnalysisScoreKind;
  totalScore?: number;
  maxScore?: number;
  minScore?: number;
  level?: string;
  severity?: number;
  scoreNote?: string;
  suggestion?: string;
  timeFrame?: string;
  respondent?: string;
  risk: boolean;
  note?: string;
  dimensions?: AiAnalysisDimension[];
  profile?: AiAnalysisProfileItem[];
}

export interface AiAnalysisPayload {
  analysis: string;
  engine: string;
  crisis: boolean;
  generatedAt: string;
}

/** 备注送入提示词前的上限（服务端同样截断，这里先截一次减少传输） */
export const NOTE_MAX_LENGTH = 1200;
/** 专业建议只作为「依据」拼进提示词，过长没有价值 */
export const SUGGESTION_MAX_LENGTH = 300;
/** 维度最多送 16 个，避免人格剖面类量表把提示词撑爆 */
export const DIMENSION_MAX_COUNT = 16;
/** 画像条目上限（类型、功能位置、各维度年龄等加起来不该超过这个数） */
export const PROFILE_MAX_COUNT = 12;
/** 单条画像文案上限 */
export const PROFILE_VALUE_MAX = 220;
/** 维度说明文案上限 */
export const DIMENSION_DESC_MAX = 60;
/** 本地兜底文本的自动重试间隔：模型恢复可用后过一段时间再自动试一次 */
export const LOCAL_ANALYSIS_TTL_MS = 10 * 60 * 1000;

/** 结果是「类型/画像」而不是程度高低的量表：分数不能当严重度解读 */
const TYPE_SCALES = new Set([
  "mbti",
  "temperament",
  "seven",
  "psy-age",
  "sixteenpf",
  "epq",
  "epq-rsc",
]);

/** 特质/倾向类量表：分数只描述相对倾向，不表示病态 */
const TRAIT_SCALES = new Set([
  "ipip-eis",
  "emotional-stability",
  "sccs",
  "bpns",
  "rses",
  "pss",
  "bis",
  "bpaq",
]);

function toNumber(value: unknown): number | undefined {
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return undefined;
}

function clampText(value: unknown, max: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.length > max ? trimmed.slice(0, max) : trimmed;
}

/**
 * 把若干片段用分隔符连起来，自动丢掉空片段（避免出现「：；」这类空槽）。
 * 片段内部的首尾空格保留：文案里常靠空格分隔数字与量词（「36 岁」「63%」）。
 */
function joinText(sep: string, parts: unknown[]): string {
  return parts
    .map((part) => (part === undefined || part === null ? "" : String(part)))
    .filter((part) => part.length > 0)
    .join(sep);
}

/**
 * 判定量表的类型。
 * 站点自己的 testId 是最可靠的依据（同一个 category 里既有类型量表也有计分量表），
 * 因此先查表，category 只作为兜底。
 */
export function resolveScoreKind(testId: unknown, category?: unknown): AiAnalysisScoreKind {
  const id = typeof testId === "string" ? testId.trim().toLowerCase() : "";
  if (TYPE_SCALES.has(id)) return "type";
  if (TRAIT_SCALES.has(id)) return "trait";
  const cat = typeof category === "string" ? category.trim().toLowerCase() : "";
  if (cat.includes("personality") || cat.includes("人格") || cat.includes("性格")) return "trait";
  return "severity";
}

/** 维度键 → 中文名（各量表沿用同一批键，只在维度自身没带名字时使用） */
const DIMENSION_LABELS: Record<string, string> = {
  E_I: "外倾-内倾（E/I）",
  S_N: "实感-直觉（S/N）",
  T_F: "思考-情感（T/F）",
  J_P: "判断-感知（J/P）",
  choleric: "胆汁质",
  sanguine: "多血质",
  phlegmatic: "粘液质",
  melancholic: "抑郁质",
  disharmony: "自我与经验的不和谐",
  flexibility: "自我灵活性",
  rigidity: "自我刻板性",
  autonomy: "自主性",
  relatedness: "归属感",
  positive_express: "积极表达",
  negative_express: "消极表达",
  attention: "注意情绪",
  emotional_decision: "情绪性决策",
  reactive_joy: "反应性快乐",
  reactive_sadness: "反应性悲伤",
  empathy: "同理心关注",
};

/** MBTI 的四个偏好轴：原始分只反映作答分布，方向以字母为准，因此不当作维度分数送出 */
const MBTI_AXIS_KEYS = new Set(["E_I", "S_N", "T_F", "J_P"]);

/** 单个字母 → 中文倾向名 */
const MBTI_LETTERS: Record<string, string> = {
  E: "外倾(E)",
  I: "内倾(I)",
  S: "实感(S)",
  N: "直觉(N)",
  T: "思考(T)",
  F: "情感(F)",
  J: "判断(J)",
  P: "感知(P)",
};

/** 卡特尔 16PF 的因素名（factors 是纯数字键值对象，需要名字表才可读） */
const SIXTEEN_PF_LABELS: Record<string, string> = {
  A: "乐群性",
  B: "聪慧性",
  C: "稳定性",
  E: "恃强性",
  F: "兴奋性",
  G: "有恒性",
  H: "敢为性",
  I: "敏感性",
  L: "怀疑性",
  M: "幻想性",
  N: "世故性",
  O: "忧虑性",
  Q1: "实验性",
  Q2: "独立性",
  Q3: "自律性",
  Q4: "紧张性",
};

/** 「Introversion - 内倾」→「内倾」；没有分隔符时原样返回 */
function chineseTail(value: unknown): string {
  const raw = typeof value === "string" ? value.trim() : "";
  if (!raw) return "";
  const parts = raw.split(/[-–—:：]/);
  return (parts[parts.length - 1] || raw).trim();
}

function firstLetter(value: unknown): string {
  const raw = typeof value === "string" ? value.trim() : "";
  return raw ? raw.charAt(0).toUpperCase() : "";
}

/** 等级文案：优先显式字段，其次是 MBTI 这类单字母方向（原始分不能当等级） */
function shortLevel(raw: Record<string, unknown>): string | undefined {
  const explicit = clampText(raw.level, 24) ?? clampText(raw.bandLabel, 24) ?? clampText(raw.harmonyLevel, 24);
  if (explicit) return explicit;
  const result = clampText(raw.result, 24);
  if (result) {
    const mapped = MBTI_LETTERS[result.toUpperCase()];
    if (mapped) return mapped;
  }
  return undefined;
}

/** 维度说明：desc/description 优先，其次高低分描述，最后是 about */
function pickDesc(raw: Record<string, unknown>): string | undefined {
  const direct = clampText(raw.desc, DIMENSION_DESC_MAX) ?? clampText(raw.description, DIMENSION_DESC_MAX);
  if (direct) return direct;
  const high = clampText(raw.highDesc, 30);
  const low = clampText(raw.lowDesc, 30);
  if (high || low) return joinText("；", ["偏高：" + (high ?? "—"), "偏低：" + (low ?? "—")]);
  return clampText(raw.about, DIMENSION_DESC_MAX);
}

function toDimension(key: string, value: unknown): AiAnalysisDimension | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const raw = value as Record<string, unknown>;
  const score = toNumber(
    raw.score ?? raw.value ?? raw.avg ?? raw.total ?? raw.tScore ?? raw.percent ?? raw.pct,
  );
  const level = shortLevel(raw);
  if (score === undefined && level === undefined) return undefined;

  const dim: AiAnalysisDimension = {
    name: clampText(raw.name, 40) ?? clampText(raw.label, 40) ?? DIMENSION_LABELS[key] ?? key,
  };
  if (score !== undefined) dim.score = score;
  const max = toNumber(raw.max ?? raw.maxScore);
  if (max !== undefined && max > 0) dim.max = max;
  if (level) dim.level = level;
  const desc = pickDesc(raw);
  if (desc) dim.desc = desc;
  return dim;
}

function collectDimensions(
  source: unknown,
  depth: number,
  out: AiAnalysisDimension[],
  visited: Set<unknown>,
): void {
  if (!source || typeof source !== "object") return;
  if (out.length >= DIMENSION_MAX_COUNT) return;
  if (visited.has(source)) return;
  visited.add(source);

  const isMbtiRoot = !Array.isArray(source) && typeof (source as Record<string, unknown>).type === "string";
  const entries: Array<[string, unknown]> = Array.isArray(source)
    ? source.map((entry: any, i) => [
        String(entry?.trait ?? entry?.factor ?? entry?.key ?? i),
        entry,
      ])
    : Object.entries(source as Record<string, unknown>);

  for (const [key, value] of entries) {
    if (out.length >= DIMENSION_MAX_COUNT) return;
    if (key === "type" || key === "note") continue;
    if (isMbtiRoot && MBTI_AXIS_KEYS.has(key)) continue; // MBTI 的偏好方向由 profile 的字母给出
    if (!value || typeof value !== "object") continue;

    const dim = toDimension(key, value);
    if (dim) {
      out.push(dim);
      continue;
    }
    if (depth < 2) collectDimensions(value, depth + 1, out, visited);
  }
}

/**
 * 从 dimensionScores 里抽出可解释的维度。
 *
 * 各量表的维度结构并不统一：数组（多数量表）或按特征为键的对象；分数键名可能是
 * score / value / avg / tScore / total，还有纯文案对象（PHQ-9 的关键症状卡）与
 * 数组、布尔标记混在同一个对象里。没有分数也没有等级的条目直接丢弃，
 * 嵌套容器（如情绪智力量表把维度放在 dimensions 下）会向下钻一层。
 */
export function extractDimensions(dimensionScores: unknown): AiAnalysisDimension[] {
  const out: AiAnalysisDimension[] = [];
  collectDimensions(dimensionScores, 0, out, new Set<unknown>());
  return out;
}

/**
 * 组装量表的画像数据。
 *
 * 类型型量表（MBTI / 七美德与七宗罪 / 心理年龄）与多维自评量表的结果主体不是分数，
 * 而是类型名、指数、双轴、维度年龄、效度这些结构化内容；只把总分送过去，
 * 模型就只能给出「分数偏高、注意休息」式的空话。这里按量表把结果里真正有信息量的
 * 字段整理成短句，作为提示词里的依据。
 */
export function extractProfile(result: any): AiAnalysisProfileItem[] {
  const items: AiAnalysisProfileItem[] = [];
  const push = (name: string, value: unknown) => {
    if (items.length >= PROFILE_MAX_COUNT) return;
    // 画像条目允许是数字（原始分、标准分、年龄等），统一按文案送出
    const text = clampText(typeof value === "number" ? String(value) : value, PROFILE_VALUE_MAX);
    if (!text) return;
    items.push({ name, value: text });
  };

  // MBTI：类型、四轴偏好、功能位置与强度、内外一致、气质面具
  const mbti = result?.mbtiReport;
  if (mbti && typeof mbti === "object") {
    push("类型", joinText(" ", [mbti.type ?? result?.level, mbti.typeName]));
    const prefs: any[] = Array.isArray(mbti.preferences) ? mbti.preferences : [];
    if (prefs.length) {
      push(
        "四轴偏好",
        prefs
          .map((p) => {
            const side = p?.selected === firstLetter(p?.left) ? p?.left : p?.right;
            return joinText("：", [p?.title, joinText(" ", [p?.selected, chineseTail(side)])]);
          })
          .join("；"),
      );
    }
    const roles: any[] = Array.isArray(mbti.functionStack?.roles) ? mbti.functionStack.roles : [];
    if (roles.length) {
      push(
        "功能位置",
        roles
          .map((r) => joinText("：", [joinText("", [r?.title, "（" + (r?.subtitle ?? "") + "）"]), joinText(" ", [r?.function, r?.label])]))
          .join("；"),
      );
    }
    const natural: any[] = Array.isArray(mbti.functionScores?.natural) ? mbti.functionScores.natural : [];
    if (natural.length) {
      push("功能强度", natural.map((f) => joinText("", [f?.code, "-", f?.label, " ", f?.percent, "%"])).join("；"));
    }
    const io = mbti.innerOuterProfile;
    if (io && typeof io === "object") {
      push(
        "内外一致",
        joinText("", [
          "内在 ", io.innerType, " / 外在 ", io.outerType,
          "，一致度 ", io.consistency, "%：", io.status,
        ]),
      );
      const dims: any[] = Array.isArray(io.dimensions) ? io.dimensions.slice(0, 4) : [];
      if (dims.length) {
        push(
          "内/外倾向",
          dims
            .map((d) => joinText("", [
              d?.title, "：内在 ", d?.innerLetter, " ", d?.innerPercent,
              "% / 外在 ", d?.outerLetter, " ", d?.outerPercent, "%",
            ]))
            .join("；"),
        );
      }
    }
    if (mbti.mask && typeof mbti.mask === "object") {
      push(
        "气质面具",
        joinText("", [
          mbti.mask.name, "（罕见度 ", mbti.mask.rarity ?? "—",
          "，面具占 ", mbti.mask.maskRatio ?? "—", "，气质 ", mbti.mask.temperament ?? "—", "）",
        ]),
      );
    }
  }

  // 七美德与七宗罪：两个指数、主导之罪、守护美德、各维度百分比、罪德共存
  const seven = result?.sevenReport;
  if (seven && typeof seven === "object") {
    push("罪孽指数", joinText("", [seven.sinIndex, "/100 · ", seven.sinTier?.label]));
    push("美德指数", joinText("", [seven.virtueIndex, "/100 · ", seven.virtueTier?.label]));
    if (seven.dominantSin) {
      push("主导之罪", joinText("", [seven.dominantSin.name, " ", seven.dominantSin.pct, "%（", seven.dominantSin.tag, "）"]));
    }
    if (seven.guardianVirtue) {
      push("守护美德", joinText("", [seven.guardianVirtue.name, " ", seven.guardianVirtue.pct, "%"]));
    }
    const sins: any[] = Array.isArray(seven.sins) ? seven.sins : [];
    if (sins.length) {
      push("七宗罪分布", sins.map((s) => joinText("", [s?.name, " ", s?.pct, "%（", s?.bandLabel, "）"])).join("、"));
    }
    const virtues: any[] = Array.isArray(seven.virtues) ? seven.virtues : [];
    if (virtues.length) {
      push("七美德分布", virtues.map((v) => joinText("", [v?.name, " ", v?.pct, "%（", v?.bandLabel, "）"])).join("、"));
    }
    const coexist: any[] = Array.isArray(seven.coexist) ? seven.coexist : [];
    if (coexist.length) {
      push(
        "罪德共存",
        coexist
          .map((c) => joinText("", [c?.sinName, " ", c?.sinPct, "% 与 ", c?.virtueName, " ", c?.virtuePct, "%"]))
          .join("；"),
      );
    }
  }

  // 心理年龄：年龄值、双轴、原型、责任感、各维度年龄
  const age = result?.psyAgeReport;
  if (age && typeof age === "object") {
    push(
      "心理年龄",
      joinText("", [
        age.psychAge ?? result?.totalScore ?? "", " 岁（", age.descriptor,
        age.archetype?.title ? " · " + age.archetype.title : "", "）",
      ]),
    );
    push(
      "双轴画像",
      joinText("", [
        "成熟度 ", age.maturity ?? "—", " / 少年感 ", age.youth ?? "—",
        age.balance?.label ? "，六维分布：" + age.balance.label : "",
      ]),
    );
    if (age.resLevel) push("责任感", age.resLevel);
    const dims: any[] = Array.isArray(age.dims) ? age.dims : [];
    if (dims.length) {
      push("心理年龄维度", dims.map((d) => joinText("", [d?.name, " ", d?.age, " 岁（", d?.bandLabel, "）"])).join("；"));
    }
  }

  // 心理健康多维自评量表：总体结论、安全信号、作答可信度
  const multi = result?.multidimReport;
  if (multi && typeof multi === "object") {
    const summary = multi.summary ?? {};
    push(
      "总体结论",
      joinText("", [
        summary.level, "；突出方向：", summary.traitsText || "无明显",
        "；严重信号：", summary.severeText || "未检出",
        "；需关注：", summary.concernText || "未检出",
        "（达到关注标准的维度 ", summary.elevated ?? 0, "/", summary.traitTotal ?? 0, "）",
      ]),
    );
    const severe: any[] = Array.isArray(multi.severeSignalDetails) ? multi.severeSignalDetails : [];
    if (severe.length) {
      push("安全信号", severe.map((s) => joinText("", [s?.label, "（", s?.level, "）"])).join("；"));
    }
    if (multi.validity && typeof multi.validity === "object") {
      push("作答可信度", multi.validity.valid ? "作答可信" : joinText("", ["可信度偏低：", multi.validity.reason]));
    }
  }

  // 卡特尔 16PF：因素分是纯数字对象，配合因素名送出才有解读价值
  const factors = result?.dimensionScores?.factors;
  if (factors && typeof factors === "object" && !Array.isArray(factors)) {
    push(
      "16 因素分（1-10，5 分附近为中等）",
      Object.entries(factors as Record<string, unknown>)
        .map(([key, value]) => joinText(" ", [SIXTEEN_PF_LABELS[key] ?? key, toNumber(value) ?? value]))
        .join("、"),
    );
  }

  if (result?.rawScore !== undefined) push("原始分", result.rawScore);
  if (result?.standardizedScore !== undefined) push("标准分", result.standardizedScore);

  return items;
}

/**
 * 组装请求体；没有 testId 时返回 null（服务端也要求 testId）。
 * 备注只有显式允许时才带上——用户的隐私选择不能被默认值悄悄推翻。
 */
export function buildAnalysisRequest(
  result: any,
  opts: { includeNote?: boolean; risk?: boolean; category?: string; timeFrame?: string } = {},
): AiAnalysisRequest | null {
  const testId = typeof result?.testId === "string" ? result.testId.trim() : "";
  if (!testId) return null;

  const req: AiAnalysisRequest = { testId, risk: opts.risk === true };

  const testTitle = clampText(result?.testTitle, 80);
  if (testTitle) req.testTitle = testTitle;
  const category = clampText(opts.category, 40);
  if (category) req.category = category;
  req.scoreKind = resolveScoreKind(testId, category ?? result?.category);
  const totalScore = toNumber(result?.totalScore);
  if (totalScore !== undefined) req.totalScore = totalScore;
  const maxScore = toNumber(result?.maxScore);
  if (maxScore !== undefined) req.maxScore = maxScore;
  const minScore = toNumber(result?.minScore);
  if (minScore !== undefined) req.minScore = minScore;
  const level = clampText(result?.level, 60);
  if (level) req.level = level;
  const severity = toNumber(result?.severity);
  if (severity !== undefined) req.severity = severity;
  const scoreNote = clampText(result?.scoreNote, 200);
  if (scoreNote) req.scoreNote = scoreNote;
  const suggestion = clampText(result?.suggestion, SUGGESTION_MAX_LENGTH);
  if (suggestion) req.suggestion = suggestion;
  const timeFrame = clampText(opts.timeFrame, 60);
  if (timeFrame) req.timeFrame = timeFrame;
  const respondent = clampText(result?.respondent, 40);
  if (respondent) req.respondent = respondent;

  const dimensions = extractDimensions(result?.dimensionScores);
  if (dimensions.length) req.dimensions = dimensions;

  const profile = extractProfile(result);
  if (profile.length) req.profile = profile;

  if (opts.includeNote) {
    const note = clampText(result?.note, NOTE_MAX_LENGTH);
    if (note) req.note = note;
  }
  return req;
}

/** 四个段落的编号形式：1) 1） 1. / 一、 二、 …… */
const SECTION_MARKER = /(?:\d[)）.]|[一二三四五六七八九十]、)\s*/;
const MARKER_AT_START = new RegExp("^(?:" + SECTION_MARKER.source + ")");

/**
 * 把分析文本切成段落。
 *
 * 服务端要求模型按「1)2)3)4)」写四段并保持纯文本，但换行是模型自己的自由：
 * 可能段间空行、可能每段一行、也可能四段挤在同一行。这里统一处理：
 * 先在句末标点后给编号补一个换行，再按换行切开，最后去掉段首编号
 * （编号由界面上的序号徽标呈现）。
 */
export function splitAnalysisSections(analysis: unknown): string[] {
  if (typeof analysis !== "string") return [];
  const raw = analysis.replace(/\r\n?/g, "\n").trim();
  if (!raw) return [];

  // 句末标点 + 编号 => 换行；只在标点后处理，避免把 "0.5 分" 这类小数点切开
  const marked = raw.replace(
    /([。！？!?；;])[ \t]*(?=(?:\d[)）]|[一二三四五六七八九十]、))/g,
    "$1\n",
  );

  return marked
    .split(/\n+/)
    .map((line) => line.trim().replace(MARKER_AT_START, "").trim())
    .filter((line) => line.length > 0);
}

/**
 * 是否该在主界面自动生成/刷新分析。
 * engine 为 llm 的结果一直复用（不重复花额度）；本地兜底文本只是规则拼装，
 * 超过 TTL 就再试一次模型，避免模型或密钥恢复后用户仍一直看到兜底内容。
 */
export function shouldRefreshAnalysis(cached: any, now: number = Date.now()): boolean {
  if (!cached || typeof cached !== "object" || !cached.analysis) return true;
  if (cached.engine === "llm") return false;
  const at = Date.parse(String(cached.generatedAt ?? ""));
  if (!Number.isFinite(at)) return true;
  return now - at >= LOCAL_ANALYSIS_TTL_MS;
}

/** 结果来源标签：AI 模型 / 服务端本地兜底 */
export function analysisEngineLabel(engine: unknown): string {
  return engine === "llm" ? "AI 生成" : "本地生成";
}
