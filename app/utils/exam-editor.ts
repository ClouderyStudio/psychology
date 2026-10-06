/**
 * 内部试卷可视化编辑器的纯逻辑层。
 *
 * 试卷以整卷 JSON 存在 ClouderyApi 的 ExamPapers 表单列里，历史数据由人手写 JSON 产生，
 * 字段可能缺失、类型不符、答案与选项对不上；这里把「外部数据 → 编辑器可用形状」的归一化
 * 和「什么样算一份合法试卷」的校验都收成纯函数，模板只负责渲染，规则可单独跑单测。
 *
 * 与后端 Domain/ExamPaperGrader.cs 保持一致的关键约定：
 *  - 题型缺省时按有无 options 推断（options 存在 => single，否则 judge）；
 *  - 多选答案是与选项标签同序拼接后的字符串（后端比较时会先按字符排序，故顺序无关）；
 *  - 判断题答案取选项标签 A（正确）/ B（错误），与 ExamPaper.vue 提交的值一致。
 */
import type { ExamOption, ExamQuestion, ExamSection } from "../types/exam";

export type ExamQuestionType = "judge" | "single" | "multiple" | "essay";

/** 题型顺序即编辑器下拉框顺序：由易到难 */
export const QUESTION_TYPES = ["judge", "single", "multiple", "essay"] as const;

export const QUESTION_TYPE_LABELS: Record<ExamQuestionType, string> = {
  judge: "判断题",
  single: "单选题",
  multiple: "多选题",
  essay: "简答题",
};

/** 判断题只有两个固定选项，与 ExamPaper.vue 的 judgeOptions 一致 */
export const JUDGE_OPTIONS: ExamOption[] = [
  { label: "A", text: "正确" },
  { label: "B", text: "错误" },
];

/** 单选/多选需要选项；判断与简答题不需要 */
export function needOptions(type: ExamQuestionType): boolean {
  return type === "single" || type === "multiple";
}

/** 题型缺省时按有无 options 推断，与后端 ExamPaperGrader 的判定一致 */
export function resolveType(question: Pick<ExamQuestion, "type" | "options">): ExamQuestionType {
  return question.type ?? (question.options != null ? "single" : "judge");
}

/**
 * 生成第 index 个选项的标签：A、B……Z、AA、AB……
 * 超过 26 个选项仍能保持唯一，避免多选题答案因标签重复而失去区分度。
 */
export function optionLabel(index: number): string {
  let n = Math.max(0, Math.floor(index));
  let label = "";
  do {
    label = String.fromCharCode(65 + (n % 26)) + label;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return label;
}

/** 新建一道指定题型的空白题目；单选/多选预置 4 个空选项，省去手点四次「添加选项」 */
export function createQuestion(type: ExamQuestionType = "single"): ExamQuestion {
  const question: ExamQuestion = { text: "", answer: "", type };
  if (needOptions(type)) {
    question.options = [0, 1, 2, 3].map((i) => ({ label: optionLabel(i), text: "" }));
  }
  return question;
}

/** 新建一章，默认带一道单选题作为骨架 */
export function createSection(): ExamSection {
  return { title: "", pointsPerQuestion: 1, questions: [createQuestion("single")] };
}

/** 新增试卷时的初始结构 */
export function blankSections(): ExamSection[] {
  return [createSection()];
}

function normalizeOptions(raw: unknown): ExamOption[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item, index) => {
    const source = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
    const rawLabel = typeof source.label === "string" ? source.label.trim() : "";
    return {
      // 历史数据可能漏写标签，用序号补一个，保证答案始终有可引用的锚点
      label: rawLabel || optionLabel(index),
      text: typeof source.text === "string" ? source.text : "",
    };
  });
}

function normalizeAnswer(raw: unknown): string {
  if (typeof raw === "string") return raw;
  // 手写 JSON 里答案可能写成数字（如 answer: 1），转成字符串再交给校验
  if (typeof raw === "number" && Number.isFinite(raw)) return String(raw);
  return "";
}

/** 把任意来源的单道题目收敛成编辑器可安全渲染的形状（不发明内容，只补齐结构） */
export function normalizeQuestion(raw: unknown): ExamQuestion {
  const source = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const options = normalizeOptions(source.options);
  const declared = typeof source.type === "string" ? (source.type as ExamQuestionType) : undefined;
  const type = declared && QUESTION_TYPES.includes(declared)
    ? declared
    : resolveType({ type: undefined, options: source.options != null ? options : undefined });

  const question: ExamQuestion = {
    text: typeof source.text === "string" ? source.text : "",
    answer: normalizeAnswer(source.answer),
    type,
  };
  // 判断/简答题即使带着历史遗留的 options 也原样保留，不做破坏性清理
  if (options.length) question.options = options;
  if (typeof source.note === "string" && source.note) question.note = source.note;
  return question;
}

/** 归一化整卷 sections；非数组一律按空卷处理，编辑器不会因为脏数据崩掉 */
export function normalizeSections(input: unknown): ExamSection[] {
  if (!Array.isArray(input)) return [];
  return input.map((raw) => {
    const source = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
    const section: ExamSection = {
      title: typeof source.title === "string" ? source.title : "",
      questions: Array.isArray(source.questions) ? source.questions.map(normalizeQuestion) : [],
    };
    // v-model.number 清空输入框时得到空字符串，Number("") 是 0，这里一并判掉
    const points = typeof source.pointsPerQuestion === "number"
      ? source.pointsPerQuestion
      : Number(source.pointsPerQuestion);
    if (Number.isFinite(points) && points > 0) section.pointsPerQuestion = points;
    return section;
  });
}

/** 深拷贝一道题，用于「复制此题」——options 必须另起数组，否则两题会共享同一批选项对象 */
export function duplicateQuestion(question: ExamQuestion): ExamQuestion {
  const copy: ExamQuestion = { ...question };
  if (question.options) copy.options = question.options.map((opt) => ({ ...opt }));
  return copy;
}

/** 切换题型时同步修正选项与答案，避免留下「多选却没有选项」这类半成品 */
export function setQuestionType(question: ExamQuestion, type: ExamQuestionType): void {
  question.type = type;
  if (needOptions(type)) {
    // 从判断/简答切过来时选项是全新生成的：旧答案指向的选项已经不存在，必须一并清掉，
    // 否则会出现「正确选项是空白的 A」这种看起来配置好了、实际全错的卷子。
    if (!question.options || !question.options.length) {
      question.options = [0, 1, 2, 3].map((i) => ({ label: optionLabel(i), text: "" }));
      question.answer = "";
      return;
    }
    if (question.options.length < 2) {
      while (question.options.length < 4) {
        question.options.push({ label: optionLabel(question.options.length), text: "" });
      }
    }
    if (type === "single" && !question.options.some((opt) => opt.label === question.answer)) {
      question.answer = "";
    }
    return;
  }
  // 切到判断/简答：选项保留但不再参与判分，只把答案收敛到该题型允许的取值
  if (type === "judge" && question.answer !== "A" && question.answer !== "B") {
    question.answer = "";
  }
}

/** 多选题的答案是与标签逐字拼接的字符串，这里按字符判断某个选项是否被选中 */
export function isMultipleSelected(answer: string, label: string): boolean {
  return answer.includes(label);
}

/** 勾选/取消一个多选选项，返回重新排序去重后的答案字符串 */
export function toggleMultipleLabel(answer: string, label: string): string {
  const selected = new Set(answer.split(""));
  if (selected.has(label)) selected.delete(label);
  else selected.add(label);
  return [...selected].sort().join("");
}

/** 在末尾追加一个选项，标签按当前数量顺延 */
export function addQuestionOption(question: ExamQuestion): void {
  if (!question.options) question.options = [];
  question.options.push({ label: optionLabel(question.options.length), text: "" });
}

/**
 * 删除一个选项：后面的选项标签整体上移，已选答案按「旧标签 → 新标签」映射后重写，
 * 这样删掉中间一个选项不会把其余题目的正确答案指向错误的选项。
 */
export function removeQuestionOption(question: ExamQuestion, index: number): void {
  const options = question.options;
  if (!options || index < 0 || index >= options.length) return;

  const removedLabel = options[index]!.label;
  const remaining = options.filter((_, i) => i !== index);
  const remap = new Map<string, string>();
  remaining.forEach((opt, i) => remap.set(opt.label, optionLabel(i)));
  remaining.forEach((opt, i) => { opt.label = optionLabel(i); });
  question.options = remaining;

  if (resolveType(question) === "multiple") {
    question.answer = question.answer
      .split("")
      .filter((c) => c !== removedLabel)
      .map((c) => remap.get(c) ?? c)
      .sort()
      .join("");
    return;
  }
  if (question.answer === removedLabel) {
    question.answer = "";
    return;
  }
  question.answer = remap.get(question.answer) ?? question.answer;
}

export interface ExamIssue {
  level: "error" | "warning";
  /** 稳定的定位串（如 sections[0].questions[1].answer），便于在测试里精确断言 */
  path: string;
  message: string;
}

/** 逐章逐题检查；error 会阻止保存，warning 只提示（如未写解析） */
export function validateSections(sections: ExamSection[]): ExamIssue[] {
  const issues: ExamIssue[] = [];
  if (!sections.length) {
    issues.push({ level: "error", path: "sections", message: "试卷至少需要一个章节" });
    return issues;
  }

  sections.forEach((section, sIndex) => {
    const sectionName = "第 " + (sIndex + 1) + " 章";
    if (!section.title.trim()) {
      issues.push({ level: "error", path: "sections[" + sIndex + "].title", message: sectionName + "缺少章节标题" });
    }
    const points = section.pointsPerQuestion;
    // 未设置有两种来源：字段缺失，或在编辑器里把分值输入框清空（v-model.number 得到空字符串）。
    // 两者在后端都按 1 分判分，所以只提示、不阻断；显式的 0 或负数才是真的配置错误。
    if (typeof points !== "number" || !Number.isFinite(points)) {
      issues.push({ level: "warning", path: "sections[" + sIndex + "].pointsPerQuestion", message: sectionName + "未设置每题分值，按 1 分计" });
    } else if (points <= 0) {
      issues.push({ level: "error", path: "sections[" + sIndex + "].pointsPerQuestion", message: sectionName + "每题分值必须大于 0" });
    }
    if (!section.questions.length) {
      issues.push({ level: "error", path: "sections[" + sIndex + "].questions", message: sectionName + "还没有题目" });
      return;
    }

    section.questions.forEach((question, qIndex) => {
      const base = "sections[" + sIndex + "].questions[" + qIndex + "]";
      const questionName = sectionName + "第 " + (qIndex + 1) + " 题";
      const type = resolveType(question);
      if (!question.text.trim()) {
        issues.push({ level: "error", path: base + ".text", message: questionName + "缺少题干" });
      }

      if (needOptions(type)) {
        const options = question.options ?? [];
        if (options.length < 2) {
          issues.push({ level: "error", path: base + ".options", message: questionName + "至少需要 2 个选项" });
        }
        const seen = new Set<string>();
        options.forEach((opt, oIndex) => {
          if (seen.has(opt.label)) {
            issues.push({ level: "error", path: base + ".options[" + oIndex + "].label", message: questionName + "选项标签 " + opt.label + " 重复" });
          }
          seen.add(opt.label);
          if (!opt.text.trim()) {
            issues.push({ level: "warning", path: base + ".options[" + oIndex + "].text", message: questionName + "选项 " + opt.label + " 内容为空" });
          }
        });

        if (!question.answer) {
          issues.push({ level: "error", path: base + ".answer", message: questionName + "未设置正确答案" });
        } else if (type === "single") {
          if (!seen.has(question.answer)) {
            issues.push({ level: "error", path: base + ".answer", message: questionName + "的答案 " + question.answer + " 不在选项范围内" });
          }
        } else {
          const unknown = question.answer.split("").filter((c) => !seen.has(c));
          if (unknown.length) {
            issues.push({ level: "error", path: base + ".answer", message: questionName + "的答案包含不存在的选项 " + unknown.join("、") });
          }
        }
        return;
      }

      if (type === "judge") {
        if (!question.answer) {
          issues.push({ level: "error", path: base + ".answer", message: questionName + "未设置正确答案" });
        } else if (question.answer !== "A" && question.answer !== "B") {
          // 后端按字面比较，交卷端只会提交 A/B，保留怪答案会被判成永远答错
          issues.push({ level: "warning", path: base + ".answer", message: questionName + "的答案「" + question.answer + "」不是 A（正确）或 B（错误），阅卷时永远判错" });
        }
        return;
      }

      if (!question.answer.trim()) {
        issues.push({ level: "warning", path: base + ".answer", message: questionName + "未填写参考答案，交卷核对时无法对照" });
      }
    });
  });

  return issues;
}

export interface ExamPaperStats {
  sectionCount: number;
  questionCount: number;
  scorableCount: number;
  essayCount: number;
  /** 满分只算可评分题（与 ExamPaper.vue 的展示口径一致，简答题不计分） */
  totalPoints: number;
}

export function paperStats(sections: ExamSection[]): ExamPaperStats {
  let questionCount = 0;
  let scorableCount = 0;
  let essayCount = 0;
  let totalPoints = 0;

  for (const section of sections) {
    const points = typeof section.pointsPerQuestion === "number" && section.pointsPerQuestion > 0
      ? section.pointsPerQuestion
      : 1;
    for (const question of section.questions) {
      questionCount++;
      if (resolveType(question) === "essay") {
        essayCount++;
      } else {
        scorableCount++;
        totalPoints += points;
      }
    }
  }

  return { sectionCount: sections.length, questionCount, scorableCount, essayCount, totalPoints };
}

/** 分值展示：整数不带小数点，小数保留一位，与答题端 formatPoints 一致 */
export function formatPoints(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}
