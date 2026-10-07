<div align="center">

<h1>心灵驿站</h1>

![License](https://img.shields.io/badge/license-AGPL--3.0-blue.svg)
![Nuxt](https://img.shields.io/badge/Nuxt-4.4.5-00DC82?logo=nuxt.js)
![Vue](https://img.shields.io/badge/Vue-3.5.34-4FC08D?logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.0-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.3.0-06B6D4?logo=tailwindcss)

**[在线体验](https://pt.cldery.com)** | **[更新日志](https://github.com/ClouderyStudio/psychology/commits/main/)** | **[反馈建议](https://github.com/ClouderyStudio/psychology/issues)**

一个基于 Nuxt 4 开发的**专业心理健康测评平台**，提供多种标准化的心理测评量表，帮助用户了解自己的心理状态。

</div>

---

## 📋 项目简介

心灵驿站是一个开源的、注重隐私保护的心理测评工具集。平台优先保护隐私：**作答记录保存在用户浏览器本地**；提交后仅用于服务端**即时计算测评结果**，服务端**不持久化存储**任何测评数据。

### ✨ 核心特性

| 特性                | 说明                                  |
| ------------------- | ------------------------------------- |
| 🔒 **隐私优先**     | 作答数据保存在浏览器本地，服务端仅即时评分、不落库 |
| 📊 **专业量表**     | 收录多种国际通用心理测评量表          |
| 🎨 **舒适界面**     | 温暖配色 + 多种优质字体，阅读体验友好 |
| 📱 **响应式设计**   | 完美适配手机、平板、电脑              |
| ⚡ **答题进度保存** | 自动保存答题进度，刷新/退出不丢失     |
| 📈 **可视化报告**   | 测评结果图表化展示，结果一目了然      |
| 🤖 **AI 结果解读** | 进入结果页自动生成中文解读，按量表类型分流；可手动重新生成，备注是否交给 AI 由本人决定 |
| 👤 **多平台同步** | 用 Casdoor 账号登录后，测评结果云端存档，手机 / 平板 / 电脑共享同一份历史；不登录也完全可用 |

---

## 🧠 收录量表

### 症状筛查类

| 量表                     | 题数 | 说明                             |
| ------------------------ | ---- | -------------------------------- |
| **PHQ-9 抑郁筛查量表**   | 9题  | 评估过去两周内的抑郁症状严重程度 |
| **GAD-7 焦虑筛查量表**   | 7题  | 评估广泛性焦虑症状的严重程度     |
| **SCL-90 症状自评量表**  | 90题 | 全面评估9个维度的心理症状        |
| **SDS 抑郁自评量表**     | 20题 | 标准化抑郁症状自评工具           |
| **SAS 焦虑自评量表**     | 20题 | 标准化焦虑症状自评工具           |
| **BDC 伯恩斯抑郁症清单** | 15题 | 快速评估抑郁情绪程度             |
| **MDQ 心境障碍问卷**      | 15题 | 双相谱系障碍的标准化筛查工具       |
| **ASRM 躁狂自评量表**     | 5题  | 快速评估过去一周的躁狂症状         |
| **RSES 自尊量表**         | 10题 | 评估整体自我价值感与自尊水平       |
| **SIOSS 自杀意念自评量表** | 26题 | 从绝望感、乐观感缺失与睡眠困扰等维度筛查自杀风险 |
| **YMRS 杨氏躁狂评定量表**  | 11题 | 躁狂症状的自评简化筛查版，仅供粗筛参考 |
| **ISI 失眠严重程度指数**   | 7题  | 评估过去两周的失眠症状及其日间影响 |
| **MID-60 多维解离量表** | 60题 | 评估12个解离相关子维度，覆盖人格/现实解体、解离性失忆、功能性神经症状等 |
| **解离经验量表（DES-II）** | 28题 | 评估记忆缺失、人格/现实解体与吸收沉浸三类解离体验 |
| **躯体形式解离问卷（SDQ-20）** | 20题 | 评估过去一年躯体解离体验，含SDQ-5快速筛查 |
| **耶鲁-布朗强迫量表（Y-BOCS）** | 10题 | 评估强迫思维与强迫行为的严重程度 |
| **强迫量表修订版（OCI-R）** | 18题 | 含洗涤、检查、排序、强迫思维、中和、囤积六维度 |
| **创伤后应激严重度（PTSD·NSESSS）** | 9题 | 评估极端应激事件后过去7天的创伤后应激症状严重度 |
| **惊恐障碍严重度** | 10题 | DSM-5-TR，评估惊恐发作频率、担忧、躯体症状与回避 |
| **社交焦虑障碍严重度** | 10题 | DSM-5-TR，评估社交情境中的焦虑、躯体反应与回避 |
| **特定恐怖症严重度** | 10题 | DSM-5-TR，评估对特定事物/情境的恐惧、躯体反应与回避 |
| **广场恐怖严重度** | 10题 | DSM-5-TR，评估人群、公共交通、独自外出等情境中的恐惧与回避 |
| **分离焦虑障碍严重度** | 10题 | DSM-5-TR，评估与重要的人或家分离时的恐惧、担忧与回避 |
| **心理健康多维自评量表** | 20-105题 | 覆盖20个核心特征维度，含极简/快速/标准/深度四种模式、回答一致性与效度校验、乱序复测（AnonUsAl 编制） |

### 人格性格类

| 量表                    | 题数  | 说明                         |
| ----------------------- | ----- | ---------------------------- |
| **MBTI 人格测试**       | 109题 | 评估16种人格类型             |
| **气质类型测试**        | 60题  | 评估胆汁质、多血质等四种气质 |
| **16PF 卡特尔人格问卷** | 187题 | 评估16种人格特质             |
| **EPQ 艾森克人格问卷**  | 88题  | 评估内外向、神经质等维度     |
| **EPQ-RSC 简式量表**    | 48题  | 艾森克人格问卷中国简版       |
| **七美德与七宗罪**      | 60题  | 分别测量罪与德两条独立指数   |
| **心理年龄测验**        | 42题  | 基于发展心理学多维模型探查心理年龄 |
| **BIS-11 Barratt 冲动性量表** | 30题 | 评估注意力、运动与无计划三个维度的冲动性特质 |
| **BPAQ Buss-Perry 攻击性问卷** | 29题 | 评估身体攻击、言语攻击、愤怒与敌意倾向 |

### 专项量表类

| 量表                          | 题数 | 说明                       |
| ----------------------------- | ---- | -------------------------- |
| **PSS 压力感知量表**          | 10题 | 评估过去一个月的压力水平   |
| **BPNS 基本心理需求满足量表** | 21题 | 评估自主、胜任、归属需求   |
| **IPIP-EIS 情绪智力量表**     | 64题 | 评估情绪智力的7个维度      |
| **情绪稳定性测试**            | 30题 | 评估情绪稳定程度和抗压能力 |
| **SCCS 自我和谐量表**         | 35题 | 评估自我与经验的关系       |

### 📚 量表来源（部分）

各量表题项均参考其原始文献/官方版本整理；平台为自评简化版，仅供自我筛查，不构成医学诊断。

| 量表 | 来源 / 编制者 | 年份 | 来源网站 |
| --- | --- | --- | --- |
| PHQ-9 抑郁筛查 | Spitzer, Kroenke &amp; Williams | 1999/2001 | https://www.phqscreeners.com/ |
| GAD-7 焦虑筛查 | Spitzer, Kroenke &amp; Williams | 2006 | https://www.phqscreeners.com/ |
| PSS-10 压力感知 | Cohen, Kamarck &amp; Mermelstein | 1983 | — |
| SCL-90 症状自评 | Derogatis | 1977 | — |
| SDS 抑郁自评 | Zung | 1965 | — |
| SAS 焦虑自评 | Zung | 1971 | — |
| BDC 伯恩斯抑郁清单 | Burns | 1980s | — |
| MDQ 心境障碍问卷 | Hirschfeld 等 | 2000 | — |
| ASRM 躁狂自评 | Altman 等 | 1997 | — |
| RSES 自尊量表 | Rosenberg | 1965 | — |
| YMRS 杨氏躁狂 | Young 等 | 1978 | — |
| ISI 失眠严重度指数 | Morin 等 | 2006 | — |
| SIOSS 自杀意念自评 | 夏朝云 等（中文版） | 2002 | — |
| BIS-11 冲动性 | Barratt / Patton 等修订 | 1995 | — |
| BPAQ 攻击性 | Buss &amp; Perry | 1992 | — |
| 耶鲁-布朗强迫（Y-BOCS） | Goodman 等 | 1989 | https://xinlixue.cn/wb/archives/Y-BOCS.html |
| 强迫量表修订版（OCI-R） | Foa 等 | 2002（公共领域） | https://novopsych.com/assessments/diagnosis/obsessional-compulsive-inventory-revised-oci-r/ |
| 解离经验（DES-II） | Carlson &amp; Putnam | 1993 | https://traumadissociation.com/des |
| 躯体形式解离（SDQ-20） | Nijenhuis 等 | 1998 | https://traumadissociation.com/ |
| 多维解离（MID-60） | Dell | 2006 | — |
| PTSD 创伤后应激严重度（NSESSS） | APA DSM-5-TR（Kilpatrick/Resnick 等） | 2013/2022 | https://www.psychiatry.org/psychiatrists/practice/dsm/educational-resources/assessment-measures |
| 惊恐/社交焦虑/特定恐怖症/广场恐怖/分离焦虑严重度 | APA DSM-5-TR 成人严重度量表（Craske 等） | 2013/2022 | https://www.psychiatry.org/psychiatrists/practice/dsm/educational-resources/assessment-measures |
| BPNS 基本心理需求 | Deci &amp; Ryan（自我决定理论） | — | https://selfdeterminationtheory.org/ |
| IPIP-EIS 情绪智力 | IPIP 量表池 | — | https://ipip.ori.org/ |
| 心理健康多维自评量表 | AnonUsAl 编制（多维特征模型） | 2026（V2.2） | — |
| 16PF | Cattell | 1949 | — |
| EPQ | Eysenck | 1975 | — |
| EPQ-RSC | 艾森克问卷中国简版（钱铭怡 等修订） | — | — |
| MBTI | Myers &amp; Briggs（基于荣格类型论） | — | — |
| 气质类型 | 基于四气质学说 | — | — |
| SCCS 自我和谐 | 王登峰（中文） | — | — |
| 七美德与七宗罪 | 基于传统七宗罪/美德分类（平台整合） | — | — |
| 心理年龄 / 情绪稳定性 / 自研量具 | 平台自研或改编 | — | — |


---

## 🛠️ 技术栈

| 技术             | 说明                       |
| ---------------- | -------------------------- |
| **Nuxt.js 4**    | Vue.js 全栈框架            |
| **Vue 3**        | 渐进式 JavaScript 框架     |
| **TypeScript**   | 类型安全的 JavaScript 超集 |
| **Tailwind CSS** | 实用优先的 CSS 框架        |
| **Pinia**        | Vue 状态管理               |
| **Nitro**        | 高性能服务端引擎           |

### 字体设计

- **HarmonyOS Sans**：正文字体，无级字重，优雅可读
- **Recursive Mono**：等宽字体，代码友好

---

## 🚀 快速开始

### 环境要求

- Node.js 20.0 或更高版本
- npm / yarn / pnpm (我们更推荐 **pnpm**)

### 安装步骤

```bash
# 1. 克隆项目
git clone https://github.com/ClouderyStudio/psychology.git
cd psychology

# 2. 安装依赖
pnpm i

# 3. 启动开发服务器
pnpm dev

# 4. 构建生产版本
pnpm build
pnpm preview
```

### 开发命令

| 命令                       | 说明           |
| -------------------------- | -------------- |
| `pnpm dev`                 | 启动开发服务器 |
| `pnpm build`               | 构建生产版本   |
| `pnpm generate`            | 生成静态站点   |
| `pnpm preview`             | 预览生产构建   |
| `pnpm generate-build-time` | 生成构建时间   |
| `pnpm test`               | 运行单元测试   |

---

## 📁 项目结构

```
psychology/
├── app/
|   ├── assets/              # 静态资源
|   ├── components/          # Vue 组件
|   ├── composables/         # 组合式函数
|   ├── pages/               # 页面
|   │   ├── index.vue        # 首页（量表列表）
|   │   ├── about.vue        # 关于页面
|   │   ├── resources.vue    # 心理资源
|   │   ├── test/[id].vue    # 答题页面
|   │   ├── result.vue       # 结果页面
|   │   ├── history.vue      # 测评历史（含云同步入口）
|   │   ├── login.vue        # Casdoor 登录 / 回调
|   │   └── account.vue      # 账号中心（云端记录管理）
│   │   ├── exam/            # 内部测试（列表 / 答题）
│   │   └── admin.vue        # 后台管理面板
|   ├── plugins/             # 插件
|   ├── stores/              # Pinia 状态管理
|   └── types/               # TypeScript 类型定义
├── server/                  # 服务端
│   ├── api/                 # API 路由
│   └── utils/               # 工具函数（评分规则、题库）
├── public/                  # 公共资源
└── scripts/                 # 脚本

```

---

## 🔐 内部测试（/exam）与后台管理（/admin）

「内部测试」区域（`/exam`，含计算机基础 / 共享群规试卷）与后台管理面板（`/admin`）依赖 **ClouderyApi** 服务：试卷数据存储于 ClouderyApi 的数据库（`ExamPapers` 表，整卷 JSON 单表），由**前端直接请求** ClouderyApi 公开接口 `/exam/ExamPapers` 获取（跨域读，无需登录）。

> 为防作弊：试卷下发给测试端时**不含答案/解析**；交卷后由 ClouderyApi 判分接口（`POST /exam/ExamPapers/{id}/grade`）返回逐题对错与标准答案供核对。

### 依赖组件

| 组件            | 说明                                                              |
| --------------- | ----------------------------------------------------------------- |
| **ClouderyApi** | 试卷数据与登录鉴权后端（ASP.NET Core + MySQL），需已运行并完成迁移 |
| **访问密码**    | 进入 `/exam` 的密码（HMAC 签名凭证，同一浏览器 7 天内免重复输入）  |

### 环境变量

| 变量                            | 说明                                     | 默认值                    |
| ------------------------------- | ---------------------------------------- | ------------------------- |
| `NITRO_INTERNAL_TEST_PASSWORD`  | 进入内部测试的访问密码                    | `yunshu`                  |
| `NITRO_INTERNAL_SECRET`         | 签发访问凭证的 HMAC 签名密钥（生产必设）  | 回退到密码                |
| `NUXT_PUBLIC_CLOUDERY_API_BASE` | 前端直连 ClouderyApi（/exam、/admin 与账号 / 云同步）的基地址 | `https://localhost:7288`  |

> 前端跨域直连：需在 ClouderyApi 的 `Cors:AllowedOrigins` 放行本项目站点。开发环境 ClouderyApi 自签证书需在浏览器信任（`dotnet dev-certs https --trust`）。

### 后台管理面板（/admin）

- 用 **Casdoor 账号登录**：`GET /identity/auth/state` 取 state → 新窗口跳 Casdoor 登录 → 本站收到 `code` 后 `POST /identity/auth/callback` 建立会话。
- 试卷**列表 / 新增 / 编辑 / 删除**；写操作由 ClouderyApi 端 `[AdminOnly]` 校验（`Authorization:Admins` 白名单中的 CasdoorId）。
- 新增与编辑用可视化编辑器（`app/components/ExamPaperEditor.vue`）：章节 / 题目 / 选项增删改与上下移、题型切换（判断 / 单选 / 多选 / 简答）、点选正确答案、每题分值、解析备注；底部实时显示章节数 / 题量 / 满分并按规则校验，有未保存修改时关闭会二次确认。
- 编辑走管理员接口 `GET /exam/ExamPapers/{id}/full` 拉取含答案与解析的完整内容（公开列表接口为防作弊不下发答案）；保存为**整卷覆盖**，试卷 ID 由服务端生成。
- 首次启用时创建数据表并录入试卷：`dotnet ef database update --context ClouderyApiContext`（迁移 `AddExamPapers` 仅新增 `ExamPapers` 表，兼容既有 schema）。

### 试卷 JSON 结构（sections 数组）

```json
[ { "title": "一、判断题", "pointsPerQuestion": 0.5,
  "questions": [ { "text": "题干", "answer": "A", "note": "解析（可选）" } ] } ]
```

多选题加 `"type": "multiple"`，`answer` 由选项标签组成（如 `"ABC"`）；简答题加 `"type": "essay"`（`answer` 作参考答案存文本，不参与自动判分，也不计入满分）。不写 `type` 时按有无 `options` 推断为单选或判断，与后端判分逻辑一致。

## 🤖 AI 结果解读

结果页**不会自动请求模型**：首次使用会先展示一段说明，由用户点「我已了解，开始分析」后才会调用 ClouderyApi 的 `POST /exam/result-analysis` 生成中文解读，之后可随时点「重新生成」。解读按量表类型分流，不会把人格量表的分数当成严重程度：

| 量表类型 | 代表量表 | 解读重心 |
| -------- | -------- | -------- |
| 类型型 | MBTI、气质类型、七美德与七宗罪、心理年龄、16PF、EPQ | 直接给出类型 / 画像，不出现「得分为 X/Y」「等级为」，围绕偏好方向、功能位置与强度、各维度年龄展开 |
| 特质型 | 情绪智力、情绪稳定性、自我和谐、基本心理需要、自尊、压力感知、冲动性、攻击性 | 分数只描述相对倾向强弱，不使用「正常 / 异常」「严重 / 轻度」等病理化措辞，重点是倾向的两面性 |
| 计分型 | PHQ-9、GAD-7、SCL-90、SIOSS 等筛查类 | 用总分与等级说明程度，并挑出 2-3 个相对突出的维度报出名称与分值 |

### 隐私与数据流向

- 解读需要把该次结果的**分数、等级、维度与画像数据**发送到 ClouderyApi（再由服务端调用所配置的大模型）；不发送可用于识别身份的信息。
- **发送由用户触发**：没点「我已了解，开始分析」之前不会有任何请求，页面上的分数、等级与建议照常可看。
- **同意按量表分别记**：在 PHQ-9 上点过「我已了解」，不代表 MBTI 也同意 —— 换一个量表会重新弹出提示；同一个量表内（包括查看它的其它历史记录、点「重新生成」）不再重复问。已同意的量表记在本机（localStorage 键 `psychology-ai-analysis-consent`，内容是量表 ID 数组，最多 64 个）。
- 「把备注一起交给 AI」默认**不勾选**：不勾选时备注不会离开浏览器；勾选后需要重新生成才会生效，备注最多发送 1200 字。
- 只有模型真正返回的解读（`engine = "llm"`）会写入本机存档；服务端本地兜底文本（`engine = "local"`）不写入，过期后仅在界面提示可重新生成，不再自动重试。
- 模型不可用时服务端仍返回 200，以本地规则文本兜底，界面标注「本地生成」。

### 其他说明

- 同一 IP 对 `/exam/result-analysis` 限流 **8 次 / 300 秒**；超限时界面提示「生成得太频繁了，请过几分钟再试」。
- 「导出图片 / PDF」包含 AI 解读正文；「一键复制结果」**不含** AI 解读，避免解读被再次交给其它 AI 处理。
- 基地址与内部测试 / 后台管理共用 `NUXT_PUBLIC_CLOUDERY_API_BASE`（默认 `https://localhost:7288`），跨域需在 ClouderyApi 的 `Cors:AllowedOrigins` 中放行站点来源。

---

## 👤 账号与多平台同步

本站**不需要账号**即可使用：不登录也能测评、看历史，记录只存在浏览器 localStorage。登录后把结果同步到云端，即可在手机、平板、电脑等多平台共享同一份测评历史。

| 入口 | 说明 |
| ---- | ---- |
| `/login` | 使用 **Casdoor** 登录（唯一登录方式，无本地账号密码）；登录成功后自动回到登录前的页面 |
| `/account` | 账号中心：头像 / 用户名 / 邮箱、退出登录、立即同步、本机与云端记录数、自动同步开关、云端记录查看与删除、清空云端记录 |
| 导航栏「👤」 | 未登录显示「登录」，已登录显示用户名，点击进入 `/account` |

### 同步行为

- **登录即同步**：已登录且自动同步开启（默认开启；关闭状态记在 localStorage `psychology-cloud-sync`）时，进入页面会拉取云端记录与本机合并；测评完成保存时（`psychology:result-saved` 事件）单条即时上传。
- **合并规则**（`app/utils/cloud-results.ts` 的 `planCloudSync`）：以本机记录键 `test_<testId>_result_<时间戳>` 作为 `clientKey`。云端没有 → 上传；两端同名且本机更新 → 上传并补云端 Id；云端更新 → 只补 Id；云端独有 → 下载到本机。
- **删除**：登录后在历史页删除会同时删除云端记录（否则下次同步会被传回）；账号中心可单独删除云端记录或清空云端。
- **隐私**：未登录时数据仍只留在本机；登录后同步的是测评结果正文（含 AI 解读与备注）；账号信息只用于界面展示用户名 / 邮箱 / 头像。

### 配置

- 复用 `NUXT_PUBLIC_CLOUDERY_API_BASE`（默认 `https://localhost:7288`）访问 ClouderyApi 的 `/identity/auth/*` 与 `/exam/results`。
- **需在 Casdoor 应用中登记回调地址**：开发 `http://localhost:3000/login`、生产 `https://pt.cldery.com/login`，否则 Casdoor 会拒绝授权。
- 会话 Cookie 为 `SameSite=None; Secure`，因此**生产环境必须 HTTPS**，本地开发需信任 ClouderyApi 的自签证书（`dotnet dev-certs https --trust`）；跨域需在 ClouderyApi 的 `Cors:AllowedOrigins` 放行本站。
- 云端表由 ClouderyApi 侧维护：`dotnet ef database update --context ClouderyApiContext`（迁移 `AddExamResults`）。

### 相关实现文件

| 文件 | 说明 |
| ---- | ---- |
| `app/utils/cloud-results.ts` | 纯函数：本机记录 ↔ 云端记录互转与同步计划 |
| `app/utils/result-store.ts` | 本机存档读写，另有 `importCloudRecord` / `markCloudRecord` / `announceResultChange` |
| `app/composables/useAuth.ts` | Casdoor 登录 / 回调 / 登出与登录态 |
| `app/composables/useCloudSync.ts` | 同步编排：拉取、分批上传（每 100 条）、单条上传、删除与清空 |
| `app/plugins/cloud-sync.client.ts` | 启动时初始化同步并监听本机保存事件 |
| `tests/cloud-results.test.ts` | 同步计划与本机存档扩展的单元测试 |

## 📄 开源协议

本项目采用 **AGPL-3.0 许可证**。

### 📌 友情提示

- ✅ 个人学习、非营利组织、公益项目**完全免费使用**
- ✅ 欢迎基于本项目进行二次开发，但修改后**必须开源**并保留版权信息
- ✅ 如果你将本项目用于**网络服务**（如 SaaS 平台），**必须公开服务端源码**
- 📧 如有商业合作需求，欢迎联系：**admin@cldery.com**

> AGPL-3.0 是一个“强传染性”的开源协议，旨在保护开源生态的健康发展。
> 选择这个协议，是希望这份劳动成果能被共享而非垄断。

---

## 👥 贡献者

| 角色               | 姓名     | 贡献                                 |
| ------------------ | -------- | ------------------------------------ |
| **作者 · 主开发者** | 柒屹     | 全栈开发、UI设计、量表整合、技术架构 |
| **作者 · 开发者**   | 云竹     | 前端开发、量表内容、补充量表         |
| **开发者**          | AnonUsAl | 全栈开发、技术贡献                   |
| **开发者**          | 枝树 | 备用中                   |
- [柒屹](https://github.com/TulipQiyi) · [云竹](https://github.com/yunzhu666) · [AnonUsAl](https://github.com/AnonUsAl/) · [枝树](https://github.com/Zhishulo)

欢迎提交 Issue 和 Pull Request！

---

## 🙏 致谢

- 量表内容参考自专业心理学文献和公开资料
- 字体来自 Google Fonts 和 HarmonyOS 开源字体
- 感谢所有为本项目提供支持和建议的朋友

---

## 📞 紧急求助

如果您有自伤、伤人的念头，或感到无法应对当前困境，请立即拨打：

| 热线                           | 号码         | 说明                             |
| ------------------------------ | ------------ | -------------------------------- |
| **希望24热线**                 | 400-161-9995 | 全国心理危机干预热线，24小时服务 |
| **北京心理危机研究与干预中心** | 010-82951332 | 专业心理危机干预服务             |

---

<div align="center">

**用 ❤️ 打造 · 为心理健康贡献力量 · 云术工作室**

</div>
