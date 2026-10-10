// 亲密关系经历量表修订版（ECR-R）· 题库
//
// 编制：Fraley RC, Waller NG, Brennan KA. An item-response theory analysis of
// self-report measures of adult attachment. Journal of Personality and Social
// Psychology. 2000;78(2):350-365. 题项由 Brennan、Clark 与 Shaver（1998）的
// ECR 题库用项目反应理论筛选而来。
// 官方题项页：https://labs.psychology.illinois.edu/~rcfraley/measures/ecrritems.htm
//
// 授权提示：原作者声明非商业研究可免费使用，未经许可不得用于商业用途。
//
// 结构：36 题，两个分量表各 18 题——
//   · 依恋焦虑 anxiety：第 1-18 题
//   · 依恋回避 avoidance：第 19-36 题
// 每题 1-7 计分，分量表分 = 该 18 题的均值（1-7）。（注意：本量表与题序不同的
// 中文版 ECR（李同归、加藤和生 2006）不是同一套题，引用时不要混用。）
//
// 反向题（官方 2013-06-05 勘误后的版本，也是本文件采用的版本）：
//   焦虑：第 9、11 题；回避：第 20、22、26、27、28、29、30、31、33、34、35、36 题。
//   第 21 题不反向。反向算法：score = 8 - 原作答。
//
// 官方指导语强调「问的是你在亲密关系中一般的感受，不只是当前这段关系」；
// 本平台的说明里保留这一点，便于没有伴侣的人按过往关系作答。

import type { Option } from "~/types/test";

export const ecrrOptions: Option[] = [
  { value: 1, label: "强烈不同意" },
  { value: 2, label: "不同意" },
  { value: 3, label: "有点不同意" },
  { value: 4, label: "中立" },
  { value: 5, label: "有点同意" },
  { value: 6, label: "同意" },
  { value: 7, label: "强烈同意" },
];

export interface ECRRQuestion {
  id: number;
  text: string;
  dimension: "anxiety" | "avoidance";
  reverse?: boolean;
}

export const ecrrQuestions: ECRRQuestion[] = [
  { id: 1, dimension: "anxiety", text: "我害怕会失去伴侣的爱。" },
  { id: 2, dimension: "anxiety", text: "我常担心伴侣会不想和我在一起。" },
  { id: 3, dimension: "anxiety", text: "我常担心伴侣并不是真的爱我。" },
  { id: 4, dimension: "anxiety", text: "我担心伴侣不像我在乎他/她那样在乎我。" },
  { id: 5, dimension: "anxiety", text: "我常希望伴侣对我的感情和我对他/她的感情一样强烈。" },
  { id: 6, dimension: "anxiety", text: "我很担心我们的关系。" },
  { id: 7, dimension: "anxiety", text: "伴侣不在我身边时，我担心他/她可能对别人产生兴趣。" },
  { id: 8, dimension: "anxiety", text: "当我向伴侣表达感情时，我害怕他/她没有同样的感觉。" },
  { id: 9, dimension: "anxiety", reverse: true, text: "我很少担心伴侣会离开我。" },
  { id: 10, dimension: "anxiety", text: "伴侣会让我对自己产生怀疑。" },
  { id: 11, dimension: "anxiety", reverse: true, text: "我不常担心被抛弃。" },
  { id: 12, dimension: "anxiety", text: "我发现伴侣不愿达到我希望的亲密程度。" },
  { id: 13, dimension: "anxiety", text: "伴侣有时会无缘无故地改变对我的感情。" },
  { id: 14, dimension: "anxiety", text: "我渴望非常亲密，有时会把别人吓跑。" },
  { id: 15, dimension: "anxiety", text: "我害怕一旦伴侣真正了解我，就不会喜欢真实的我。" },
  { id: 16, dimension: "anxiety", text: "得不到伴侣应有的关爱和支持，让我很恼火。" },
  { id: 17, dimension: "anxiety", text: "我担心自己不如别人。" },
  { id: 18, dimension: "anxiety", text: "伴侣似乎只有在我生气时才注意到我。" },
  { id: 19, dimension: "avoidance", text: "我不愿让伴侣看到我内心深处的感受。" },
  { id: 20, dimension: "avoidance", reverse: true, text: "与伴侣分享我私密的想法和感受时，我感到自在。" },
  { id: 21, dimension: "avoidance", text: "我发现很难允许自己依赖伴侣。" },
  { id: 22, dimension: "avoidance", reverse: true, text: "与伴侣亲近让我感到非常自在。" },
  { id: 23, dimension: "avoidance", text: "向伴侣敞开心扉让我感到不自在。" },
  { id: 24, dimension: "avoidance", text: "我不愿与伴侣过于亲近。" },
  { id: 25, dimension: "avoidance", text: "当伴侣想要非常亲近时，我会感到不自在。" },
  { id: 26, dimension: "avoidance", reverse: true, text: "我发现与伴侣亲近相对容易。" },
  { id: 27, dimension: "avoidance", reverse: true, text: "对我而言，与伴侣亲近并不困难。" },
  { id: 28, dimension: "avoidance", reverse: true, text: "我通常会与伴侣讨论我的问题和忧虑。" },
  { id: 29, dimension: "avoidance", reverse: true, text: "需要的时候向伴侣求助是有帮助的。" },
  { id: 30, dimension: "avoidance", reverse: true, text: "我几乎什么事都告诉伴侣。" },
  { id: 31, dimension: "avoidance", reverse: true, text: "我会和伴侣商量事情。" },
  { id: 32, dimension: "avoidance", text: "伴侣过于亲近时我会紧张。" },
  { id: 33, dimension: "avoidance", reverse: true, text: "依赖伴侣让我感到自在。" },
  { id: 34, dimension: "avoidance", reverse: true, text: "我发现依赖伴侣很容易。" },
  { id: 35, dimension: "avoidance", reverse: true, text: "对伴侣表达亲昵对我很容易。" },
  { id: 36, dimension: "avoidance", reverse: true, text: "伴侣真正理解我和我的需要。" },
];
