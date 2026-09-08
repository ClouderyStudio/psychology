import type { Option } from "~/types/test";

// SDS 抑郁自评量表 — 20题
export const sdsQuestions = [
  { id: 1, text: "我觉得闷闷不乐，情绪低沉" },
  { id: 2, text: "我觉得一天中早晨最好", reverse: true },
  { id: 3, text: "我一阵阵哭出来或觉得想哭" },
  { id: 4, text: "我晚上睡眠不好" },
  { id: 5, text: "我吃得跟平常一样多", reverse: true },
  { id: 6, text: "我与异性密切接触时和以往一样感到愉快", reverse: true },
  { id: 7, text: "我发觉我的体重在下降" },
  { id: 8, text: "我有便秘的苦恼" },
  { id: 9, text: "我心跳比平时快" },
  { id: 10, text: "我无缘无故地感到疲乏" },
  { id: 11, text: "我的头脑跟平常一样清楚", reverse: true },
  { id: 12, text: "我觉得经常做的事情并没有困难", reverse: true },
  { id: 13, text: "我觉得不安而平静不下来" },
  { id: 14, text: "我对将来抱有希望", reverse: true },
  { id: 15, text: "我比平常容易生气激动" },
  { id: 16, text: "我觉得作出决定是容易的", reverse: true },
  { id: 17, text: "我觉得自己是个有用的人，有人需要我", reverse: true },
  { id: 18, text: "我的生活过得很有意思", reverse: true },
  { id: 19, text: "我认为如果我死了，别人会生活得好些" },
  { id: 20, text: "平常感兴趣的事我仍然感兴趣", reverse: true }
];

// SDS 选项（1-4分，4点计分）
export const sdsOptions: Option[] = [
  { value: 1, label: "没有或很少时间" },
  { value: 2, label: "小部分时间" },
  { value: 3, label: "相当多时间" },
  { value: 4, label: "绝大部分或全部时间" }
];
