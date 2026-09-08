import type { Option } from "~/types/test";

// SAS 焦虑自评量表 — 20题
export const sasQuestions = [
  { id: 1, text: "我觉得比平常容易紧张和着急" },
  { id: 2, text: "我无缘无故地感到害怕" },
  { id: 3, text: "我容易心里烦乱或觉得惊恐" },
  { id: 4, text: "我觉得我可能将要发疯" },
  { id: 5, text: "我觉得一切都很好，也不会发生什么不幸", reverse: true },
  { id: 6, text: "我手脚发抖打颤" },
  { id: 7, text: "我因为头痛、颈痛和背痛而苦恼" },
  { id: 8, text: "我感觉容易衰弱和疲乏" },
  { id: 9, text: "我觉得心平气和，并且容易安静坐着", reverse: true },
  { id: 10, text: "我觉得心跳得很快" },
  { id: 11, text: "我因为一阵阵头晕而苦恼" },
  { id: 12, text: "我有晕倒发作，或觉得要晕倒似的" },
  { id: 13, text: "我吸气呼气都感到很容易", reverse: true },
  { id: 14, text: "我手脚麻木和刺痛" },
  { id: 15, text: "我因为胃痛和消化不良而苦恼" },
  { id: 16, text: "我常常要小便" },
  { id: 17, text: "我的手常常是干燥温暖的", reverse: true },
  { id: 18, text: "我脸红发热" },
  { id: 19, text: "我容易入睡并且一夜睡得很好", reverse: true },
  { id: 20, text: "我做恶梦" }
];

// SAS 选项（1-4分，4点计分）
export const sasOptions: Option[] = [
  { value: 1, label: "没有或很少时间" },
  { value: 2, label: "小部分时间" },
  { value: 3, label: "相当多时间" },
  { value: 4, label: "绝大部分或全部时间" }
];
