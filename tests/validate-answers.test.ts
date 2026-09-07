import { describe, it, expect } from "vitest";
import { validateAnswers, type QuestionLike } from "../server/utils/validate-answers";

// 三题量表：题1、题2 为 0-3 选项题，题3 为可选 number 题
const questions: QuestionLike[] = [
  { id: 1, options: [{ value: 0 }, { value: 1 }, { value: 2 }, { value: 3 }] },
  { id: 2, options: [{ value: 0 }, { value: 1 }, { value: 2 }, { value: 3 }] },
  { id: 3, type: "number" },
];

describe("validateAnswers 作答校验", () => {
  it("完整合法的作答 → 返回 null", () => {
    expect(validateAnswers(questions, { 1: 2, 2: 1 })).toBeNull();
  });

  it("number 题为可选题，未作答不报错", () => {
    expect(validateAnswers(questions, { 1: 2, 2: 1 })).toBeNull();
  });

  it("缺失必答题 → 返回未完成提示", () => {
    expect(validateAnswers(questions, { 1: 2 })).toMatch(/还有 1 道题未作答/);
  });

  it("空作答 → 返回未完成提示", () => {
    expect(validateAnswers(questions, {})).toMatch(/未作答/);
  });

  it("包含量表之外的题号 → 返回无效作答提示", () => {
    expect(validateAnswers(questions, { 1: 1, 2: 1, 99: 3 })).toMatch(/题号：99/);
  });

  it("值超出选项范围 → 返回选项无效提示", () => {
    expect(validateAnswers(questions, { 1: 9, 2: 1 })).toMatch(/第 1 题/);
  });

  it("答案非有限数字（NaN） → 返回格式错误", () => {
    expect(validateAnswers(questions, { 1: NaN, 2: 1 })).toMatch(/答案格式不正确/);
  });
});

describe("validateAnswers 边界", () => {
  it("仅 number 题的量表，空作答可通过（无必答题）", () => {
    const onlyNumber: QuestionLike[] = [{ id: 1, type: "number" }];
    expect(validateAnswers(onlyNumber, {})).toBeNull();
  });

  it("无题目列表时视为通过（不做校验）", () => {
    expect(validateAnswers([], { 5: 1 })).toBeNull();
  });
});
