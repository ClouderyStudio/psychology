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

### 专项量表类

| 量表                          | 题数 | 说明                       |
| ----------------------------- | ---- | -------------------------- |
| **PSS 压力感知量表**          | 10题 | 评估过去一个月的压力水平   |
| **BPNS 基本心理需求满足量表** | 21题 | 评估自主、胜任、归属需求   |
| **IPIP-EIS 情绪智力量表**     | 64题 | 评估情绪智力的7个维度      |
| **情绪稳定性测试**            | 30题 | 评估情绪稳定程度和抗压能力 |
| **SCCS 自我和谐量表**         | 35题 | 评估自我与经验的关系       |

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
|   │   └── result.vue       # 结果页面
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

「内部测试」区域（`/exam`，含计算机基础 / 共享群规试卷）与后台管理面板（`/admin`）依赖 **ClouderyApi** 服务：试卷数据存储在 ClouderyApi 的数据库（`ExamPapers` 表，整卷 JSON 单表），由本项目的服务端代理 `server/api/internal/papers*` 转发下发，前端不直接连数据库。

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
| `CLOUDERY_API_BASE`             | 服务端代理访问 ClouderyApi 的基地址       | `https://localhost:7288`  |
| `NUXT_PUBLIC_CLOUDERY_API_BASE` | 前端（/admin）访问 ClouderyApi 的基地址   | `https://localhost:7288`  |

> 开发环境 ClouderyApi 使用自签 HTTPS 证书：浏览器需 `dotnet dev-certs https --trust`，服务端代理已放行自签证书（见 `server/api/internal/papers*`）。生产环境请填正式域名，并去掉代理的证书放行、不要全局关闭 TLS 校验。

### 后台管理面板（/admin）

- 用 **Casdoor 账号登录**：`GET /identity/auth/state` 取 state → 新窗口跳 Casdoor 登录 → 本站收到 `code` 后 `POST /identity/auth/callback` 建立会话。
- 试卷**列表 / 新增 / 编辑（JSON）/ 删除**；写操作由 ClouderyApi 端 `[AdminOnly]` 校验（`Authorization:Admins` 白名单中的 CasdoorId）。
- 首次启用时创建数据表并录入试卷：`dotnet ef database update --context ClouderyApiContext`（迁移 `AddExamPapers` 仅新增 `ExamPapers` 表，兼容既有 schema）。

### 试卷 JSON 结构（sections 数组）

```json
[ { "title": "一、判断题", "pointsPerQuestion": 0.5,
  "questions": [ { "text": "题干", "answer": "A", "note": "解析（可选）" } ] } ]
```

多选题加 `"type": "multiple"`，`answer` 由选项标签组成（如 `"ABC"`）。
### 环境变量

| 变量                            | 说明                                     | 默认值                    |
| ------------------------------- | ---------------------------------------- | ------------------------- |
| `NITRO_INTERNAL_TEST_PASSWORD`  | 进入内部测试的访问密码                    | `yunshu`                  |
| `NITRO_INTERNAL_SECRET`         | 签发访问凭证的 HMAC 签名密钥（生产必设）  | 回退到密码                |
| `CLOUDERY_API_BASE`             | 服务端代理访问 ClouderyApi 的基地址       | `https://localhost:7288`  |
| `NUXT_PUBLIC_CLOUDERY_API_BASE` | 前端（/admin）访问 ClouderyApi 的基地址   | `https://localhost:7288`  |

> 开发环境 ClouderyApi 使用自签 HTTPS 证书：浏览器需 `dotnet dev-certs https --trust`，服务端代理已放行自签证书（见 `server/api/internal/papers*`）。生产环境请填正式域名，并去掉代理的证书放行、不要全局关闭 TLS 校验。

### 后台管理面板（/admin）

- 用 **Casdoor 账号登录**：`GET /identity/auth/state` 取 state → 新窗口跳 Casdoor 登录 → 本站收到 `code` 后 `POST /identity/auth/callback` 建立会话。
- 试卷**列表 / 新增 / 编辑（JSON）/ 删除**；写操作由 ClouderyApi 端 `[AdminOnly]` 校验（`Authorization:Admins` 白名单中的 CasdoorId）。
- 首次启用时创建数据表并录入试卷：`dotnet ef database update --context ClouderyApiContext`（迁移 `AddExamPapers` 仅新增 `ExamPapers` 表，兼容既有 schema）。

### 试卷 JSON 结构（sections 数组）

```json
[ { "title": "一、判断题", "pointsPerQuestion": 0.5,
  "questions": [ { "text": "题干", "answer": "A", "note": "解析（可选）" } ] } ]
```

多选题加 `"type": "multiple"`，`answer` 由选项标签组成（如 `"ABC"`）。

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

- [柒屹](https://github.com/TulipQiyi) · [云竹](https://github.com/yunzhu666) · [AnonUsAl](https://github.com/AnonUsAl/)

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
