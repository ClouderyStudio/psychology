import { describe, expect, it } from "vitest";
import {
  addQuestionOption,
  blankSections,
  createQuestion,
  duplicateQuestion,
  formatPoints,
  isMultipleSelected,
  needOptions,
  normalizeQuestion,
  normalizeSections,
  optionLabel,
  paperStats,
  removeQuestionOption,
  resolveType,
  setQuestionType,
  toggleMultipleLabel,
  validateSections,
} from "../app/utils/exam-editor";

describe("optionLabel", () => {
  it("按 Excel 列名规则顺延，超过 26 个仍唯一", () => {
    expect(optionLabel(0)).toBe("A");
    expect(optionLabel(1)).toBe("B");
    expect(optionLabel(25)).toBe("Z");
    expect(optionLabel(26)).toBe("AA");
    expect(optionLabel(27)).toBe("AB");
  });
});

describe("resolveType / needOptions", () => {
  it("缺省题型按有无 options 推断，与后端判分一致", () => {
    expect(resolveType({ options: [{ label: "A", text: "甲" }] })).toBe("single");
    expect(resolveType({ options: undefined })).toBe("judge");
    // 空数组在 JSON 里仍然存在，后端按 Options != null 判成单选，前端必须跟着
    expect(resolveType({ options: [] })).toBe("single");
  });

  it("只有单选和多选需要选项", () => {
    expect(needOptions("single")).toBe(true);
    expect(needOptions("multiple")).toBe(true);
    expect(needOptions("judge")).toBe(false);
    expect(needOptions("essay")).toBe(false);
  });
});

describe("normalizeSections", () => {
  it("非数组输入退化为空卷而不是抛错", () => {
    expect(normalizeSections(null)).toEqual([]);
    expect(normalizeSections({ title: "x" })).toEqual([]);
    expect(normalizeSections("[]")).toEqual([]);
  });

  it("补齐缺失字段并保留显式题型", () => {
    const sections = normalizeSections([
      {
        title: "一、基础",
        pointsPerQuestion: 2,
        questions: [
          { text: "有选项", options: [{ label: "A", text: "甲" }], answer: "A" },
          { text: "无选项", answer: "A" },
          { text: "作文", answer: "略", type: "essay", options: null },
        ],
      },
    ]);

    expect(sections).toHaveLength(1);
    expect(sections[0]!.pointsPerQuestion).toBe(2);
    expect(sections[0]!.questions[0]!.type).toBe("single");
    expect(sections[0]!.questions[1]!.type).toBe("judge");
    expect(sections[0]!.questions[2]!.type).toBe("essay");
    expect(sections[0]!.questions[2]!.options).toBeUndefined();
  });

  it("选项漏写标签时按序号补标签，数字答案转字符串", () => {
    const question = normalizeQuestion({
      text: "题",
      options: [{ text: "甲" }, { label: "B", text: "乙" }],
      answer: 1,
    });
    expect(question.options!.map((o) => o.label)).toEqual(["A", "B"]);
    expect(question.answer).toBe("1");
  });

  it("分值清空（空字符串）时视为未设置，不写成 0", () => {
    const sections = normalizeSections([{ title: "章", pointsPerQuestion: "", questions: [] }]);
    expect(sections[0]!.pointsPerQuestion).toBeUndefined();
  });

  it("未知题型按有无选项回退，不产生非法 type", () => {
    const a = normalizeQuestion({ text: "t", type: "weird", options: [{ label: "A", text: "" }] });
    const b = normalizeQuestion({ text: "t", type: "weird" });
    expect(a.type).toBe("single");
    expect(b.type).toBe("judge");
  });
});

describe("setQuestionType", () => {
  it("切到单选/多选时补足选项，并清掉越界答案", () => {
    const question = createQuestion("judge");
    question.answer = "A";
    setQuestionType(question, "single");
    expect(question.options).toHaveLength(4);
    expect(question.answer).toBe("");
  });

  it("切到判断题时丢弃非 A/B 的答案", () => {
    const question = createQuestion("single");
    question.answer = "B";
    setQuestionType(question, "judge");
    expect(question.answer).toBe("B");

    const other = createQuestion("single");
    other.answer = "C";
    setQuestionType(other, "judge");
    expect(other.answer).toBe("");
  });

  it("单选切多选时答案跟着走，多选切单选时多字答案被清空", () => {
    const single = createQuestion("single");
    single.answer = "B";
    setQuestionType(single, "multiple");
    expect(single.answer).toBe("B");

    single.answer = "AC";
    setQuestionType(single, "single");
    expect(single.answer).toBe("");
  });

  it("切到简答题保留原答案作为参考答案", () => {
    const question = createQuestion("single");
    question.answer = "A";
    setQuestionType(question, "essay");
    expect(question.answer).toBe("A");
  });
});

describe("多选答案", () => {
  it("按字符勾选并排序，顺序无关", () => {
    let answer = "";
    answer = toggleMultipleLabel(answer, "C");
    answer = toggleMultipleLabel(answer, "A");
    expect(answer).toBe("AC");
    expect(isMultipleSelected(answer, "A")).toBe(true);
    expect(isMultipleSelected(answer, "B")).toBe(false);

    answer = toggleMultipleLabel(answer, "A");
    expect(answer).toBe("C");
  });
});

describe("选项增删", () => {
  it("追加选项时标签顺延", () => {
    const question = createQuestion("single");
    addQuestionOption(question);
    expect(question.options!.map((o) => o.label)).toEqual(["A", "B", "C", "D", "E"]);
  });

  it("删除中间选项后重排标签，并把答案映射到新标签", () => {
    const question = createQuestion("single");
    question.options = [
      { label: "A", text: "甲" },
      { label: "B", text: "乙" },
      { label: "C", text: "丙" },
    ];
    question.answer = "C";

    removeQuestionOption(question, 0);

    expect(question.options!.map((o) => o.label)).toEqual(["A", "B"]);
    expect(question.options!.map((o) => o.text)).toEqual(["乙", "丙"]);
    expect(question.answer).toBe("B");
  });

  it("删掉的正是正确选项时答案清空", () => {
    const question = createQuestion("single");
    question.answer = "A";
    removeQuestionOption(question, 0);
    expect(question.answer).toBe("");
  });

  it("多选题删除选项后答案同步收缩", () => {
    const question = createQuestion("multiple");
    question.options = [
      { label: "A", text: "甲" },
      { label: "B", text: "乙" },
      { label: "C", text: "丙" },
    ];
    question.answer = "AB";

    removeQuestionOption(question, 0);

    // 删掉 A 后：B、C 变成 A、B，答案 AB 里的 A 消失、B 映射为 A
    expect(question.options!.map((o) => o.text)).toEqual(["乙", "丙"]);
    expect(question.answer).toBe("A");
  });
});

describe("duplicateQuestion", () => {
  it("选项是独立副本，改副本不影响原题", () => {
    const question = createQuestion("single");
    question.text = "原题";
    const copy = duplicateQuestion(question);
    copy.options![0]!.text = "改过";
    expect(question.options![0]!.text).toBe("");
    expect(copy.text).toBe("原题");
  });
});

describe("validateSections", () => {
  const valid = () => normalizeSections([
    {
      title: "一、基础",
      pointsPerQuestion: 2,
      questions: [
        { text: "判断", type: "judge", answer: "A" },
        { text: "单选", type: "single", options: [{ label: "A", text: "甲" }, { label: "B", text: "乙" }], answer: "A" },
        { text: "多选", type: "multiple", options: [{ label: "A", text: "甲" }, { label: "B", text: "乙" }, { label: "C", text: "丙" }], answer: "AC" },
        { text: "作文", type: "essay", answer: "略" },
      ],
    },
  ]);

  it("完整试卷没有 error", () => {
    const issues = validateSections(valid());
    expect(issues.filter((i) => i.level === "error")).toEqual([]);
  });

  it("空卷报错", () => {
    expect(validateSections([])).toEqual([
      { level: "error", path: "sections", message: "试卷至少需要一个章节" },
    ]);
  });

  it("缺章节标题与空章节都报错", () => {
    const issues = validateSections(normalizeSections([{ title: "  ", questions: [] }]));
    expect(issues.map((i) => i.path)).toContain("sections[0].title");
    expect(issues.map((i) => i.path)).toContain("sections[0].questions");
  });

  it("缺题干报错", () => {
    const sections = valid();
    sections[0]!.questions[0]!.text = "   ";
    const issues = validateSections(sections);
    expect(issues).toContainEqual({
      level: "error",
      path: "sections[0].questions[0].text",
      message: "第 1 章第 1 题缺少题干",
    });
  });

  it("单选答案不在选项范围内报错", () => {
    const sections = valid();
    sections[0]!.questions[1]!.answer = "Z";
    const issues = validateSections(sections);
    expect(issues).toContainEqual({
      level: "error",
      path: "sections[0].questions[1].answer",
      message: "第 1 章第 2 题的答案 Z 不在选项范围内",
    });
  });

  it("多选答案含未定义选项时报错", () => {
    const sections = valid();
    sections[0]!.questions[2]!.answer = "AD";
    const issues = validateSections(sections);
    expect(issues).toContainEqual({
      level: "error",
      path: "sections[0].questions[2].answer",
      message: "第 1 章第 3 题的答案包含不存在的选项 D",
    });
  });

  it("选项不足两个报错", () => {
    const sections = valid();
    sections[0]!.questions[1]!.options = [{ label: "A", text: "甲" }];
    sections[0]!.questions[1]!.answer = "A";
    const issues = validateSections(sections);
    expect(issues).toContainEqual({
      level: "error",
      path: "sections[0].questions[1].options",
      message: "第 1 章第 2 题至少需要 2 个选项",
    });
  });

  it("判断题答案不是 A/B 时给出警告（后端按字面判会永远算错）", () => {
    const sections = valid();
    sections[0]!.questions[0]!.answer = "对";
    const issues = validateSections(sections);
    expect(issues).toContainEqual({
      level: "warning",
      path: "sections[0].questions[0].answer",
      message: "第 1 章第 1 题的答案「对」不是 A（正确）或 B（错误），阅卷时永远判错",
    });
  });

  it("未设置分值只警告，不阻断保存", () => {
    const sections = valid();
    delete sections[0]!.pointsPerQuestion;
    const issues = validateSections(sections);
    expect(issues).toContainEqual({
      level: "warning",
      path: "sections[0].pointsPerQuestion",
      message: "第 1 章未设置每题分值，按 1 分计",
    });
  });

  it("分值为 0 报错", () => {
    const sections = valid();
    sections[0]!.pointsPerQuestion = 0;
    const issues = validateSections(sections);
    expect(issues).toContainEqual({
      level: "error",
      path: "sections[0].pointsPerQuestion",
      message: "第 1 章每题分值必须大于 0",
    });
  });

  it("分值输入框被清空（空字符串）只警告，不阻断保存", () => {
    const sections = valid();
    // v-model.number 清空输入框会写回空字符串，而非 undefined
    (sections[0] as { pointsPerQuestion?: unknown }).pointsPerQuestion = "";
    const issues = validateSections(sections);
    expect(issues.filter((i) => i.level === "error")).toEqual([]);
    expect(issues).toContainEqual({
      level: "warning",
      path: "sections[0].pointsPerQuestion",
      message: "第 1 章未设置每题分值，按 1 分计",
    });
  });
});

describe("paperStats", () => {
  it("满分只算可评分题，简答题单独计数", () => {
    const sections = normalizeSections([
      { title: "章", pointsPerQuestion: 2, questions: [
        { text: "a", type: "judge", answer: "A" },
        { text: "b", type: "essay", answer: "略" },
      ] },
    ]);
    expect(paperStats(sections)).toEqual({
      sectionCount: 1,
      questionCount: 2,
      scorableCount: 1,
      essayCount: 1,
      totalPoints: 2,
    });
  });

  it("分值缺省按 1 分计", () => {
    expect(paperStats(blankSections()).totalPoints).toBe(1);
  });
});

describe("formatPoints", () => {
  it("整数不带小数点", () => {
    expect(formatPoints(2)).toBe("2");
    expect(formatPoints(2.5)).toBe("2.5");
  });
});
