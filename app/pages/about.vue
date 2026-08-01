<template>
  <div class="min-h-screen py-12" style="background-color: var(--bg)">
    <div class="container mx-auto px-4 max-w-4xl">
      <div
        class="rounded-2xl overflow-hidden"
        style="background-color: var(--card-bg); box-shadow: var(--shadow-lg)"
      >
        <!-- 头部 -->
        <div
          class="p-8 text-center"
          style="background-color: var(--primary); color: white"
        >
          <div
            class="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
            style="background-color: rgba(255, 255, 255, 0.2)"
          >
            <span class="text-4xl">🧠</span>
          </div>
          <h1 class="text-3xl font-bold mb-2">关于我们</h1>
          <p style="color: rgba(255, 255, 255, 0.9)">专业的心理健康测评平台</p>
        </div>

        <!-- 内容 -->
        <div class="p-8 space-y-6">
          <!-- 我们的使命 -->
          <div>
            <h2
              class="text-2xl font-bold mb-3 flex items-center gap-2"
              style="color: var(--text)"
            >
              <span>🎯</span> 我们的使命
            </h2>
            <p class="leading-relaxed" style="color: var(--text-secondary)">
              我们致力于提供专业、便捷、私密的心理健康测评服务，帮助更多人了解自己的心理状态，
              及时发现潜在的心理健康问题，并引导用户寻求适当的帮助。
            </p>
          </div>

          <!-- 专业量表 -->
          <div>
            <h2
              class="text-2xl font-bold mb-3 flex items-center gap-2"
              style="color: var(--text)"
            >
              <span>📋</span> 专业量表
            </h2>
            <p class="leading-relaxed" style="color: var(--text-secondary)">
              平台提供多种国际通用的专业心理测评量表，包括抑郁筛查(PHQ-9)、焦虑筛查(GAD-7)、
              压力感知(PSS-10)、症状自评(SCL-90)、抑郁自评(SDS)和焦虑自评(SAS)等，
              均由专业心理学团队审核和维护。
            </p>
          </div>

          <!-- 隐私保护 -->
          <div>
            <h2
              class="text-2xl font-bold mb-3 flex items-center gap-2"
              style="color: var(--text)"
            >
              <span>🔒</span> 隐私保护
            </h2>
            <p class="leading-relaxed" style="color: var(--text-secondary)">
              我们高度重视您的隐私安全。所有测评数据仅保存在您的浏览器中，
              不会上传到服务器，确保您的心理健康信息完全由您自己掌控。
            </p>
          </div>

          <!-- 作者与贡献者 -->
          <div>
            <h2
              class="text-2xl font-bold mb-4 flex items-center gap-2"
              style="color: var(--text)"
            >
              <span>👥</span> 致谢
            </h2>

            <div
              class="developer-card p-4 rounded-lg mb-4"
              style="background-color: var(--primary-light)"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                  style="background-color: var(--primary); color: white"
                >
                  <img
                    src="https://q1.qlogo.cn/g?b=qq&nk=2675256772&s=100"
                    class="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div>
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="text-xl font-bold" style="color: var(--text)"
                      >柒屹</span
                    >
                    <span
                      class="text-xs px-2 py-1 rounded-full"
                      style="background-color: var(--primary); color: white"
                      >作者 & 主开发者</span
                    >
                  </div>
                  <p class="text-sm mt-1" style="color: var(--text-secondary)">
                    全栈开发 · UI设计 · 量表整合 · 技术架构
                  </p>
                  <div class="flex gap-3 mt-2">
                    <a
                      href="https://github.com/TulipQiyi"
                      class="text-xs"
                      style="color: var(--special)"
                      >GitHub</a
                    >
                  </div>
                </div>
              </div>
            </div>

            <div
              class="developer-card p-4 rounded-lg mb-4"
              style="background-color: var(--bg)"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                  style="background-color: var(--special); color: white"
                >
                  <img
                    src="https://q1.qlogo.cn/g?b=qq&nk=2457483710&s=100"
                    class="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div>
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="text-xl font-bold" style="color: var(--text)"
                      >云竹</span
                    >
                    <span
                      class="text-xs px-2 py-1 rounded-full"
                      style="background-color: var(--special); color: white"
                      >作者 & 开发者</span
                    >
                  </div>
                  <p class="text-sm mt-1" style="color: var(--text-secondary)">
                    前端开发 · 量表内容 · 补充量表
                  </p>
                  <div class="flex gap-3 mt-2">
                    <a
                      href="https://github.com/yunzhu666"
                      class="text-xs"
                      style="color: var(--special)"
                      >GitHub</a
                    >
                  </div>
                </div>
              </div>
            </div>

            <div class="developer-card p-4 rounded-lg mb-4" style="background-color: var(--bg);">
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                  style="background-color: var(--disharmony); color: white;">
                  <img src="https://q1.qlogo.cn/g?b=qq&nk=3353739856&s=100"
                    class="w-full h-full rounded-full object-cover" />
                </div>
                <div>
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="text-xl font-bold" style="color: var(--text);">AnonUsAl</span>
                    <span class="text-xs px-2 py-1 rounded-full"
                      style="background-color: var(--disharmony); color: white;">全栈开发</span>
                  </div>
                  <p class="text-sm mt-1" style="color: var(--text-secondary);">
                    全栈开发 · 技术贡献
                  </p>
                  <div class="flex gap-3 mt-2">
                    <a href="https://github.com/AnonUsAl/" class="text-xs" style="color: var(--special);">GitHub</a>
                    <a href="https://user.qzone.qq.com/3353739856" class="text-xs" style="color: var(--personality);">QQ空间</a>
                  </div>
                </div>
              </div>
            </div>

            <div class="supporter-card p-4 rounded-lg" style="background-color: var(--bg);">
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                  style="background-color: var(--personality); color: white;">
                  <img src="https://q1.qlogo.cn/g?b=qq&nk=1770464015&s=100"
                    class="w-full h-full rounded-full object-cover" />
                </div>
                <div>
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="text-xl font-bold" style="color: var(--text);">Olivia</span>
                    <span class="text-xs px-2 py-1 rounded-full"
                      style="background-color: var(--personality); color: white;">❤ 主要支持者</span>
                  </div>
                  <p class="text-sm mt-1" style="color: var(--text-secondary);">
                    用户体验代表 · 提供宝贵反馈 · 鼓励和支持
                  </p>
                </div>
              </div>
            </div>

            <div class="mt-3 text-center text-xs" style="color: var(--text-muted);">
              感谢其他所有为本平台提供支持和建议的朋友们
            </div>
          </div>

          <!-- 技术栈 -->
          <div>
            <h2
              class="text-2xl font-bold mb-4 flex items-center gap-2"
              style="color: var(--text)"
            >
              <span>⚙️</span> 技术栈
            </h2>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div
                class="tech-card p-3 rounded-lg"
                style="background-color: var(--bg)"
              >
                <div class="flex items-center gap-2">
                  <span class="text-xl">🟢</span>
                  <div>
                    <div class="font-semibold" style="color: var(--text)">
                      Nuxt.js 4
                    </div>
                    <div class="text-xs" style="color: var(--text-muted)">
                      Vue.js 框架
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="tech-card p-3 rounded-lg"
                style="background-color: var(--bg)"
              >
                <div class="flex items-center gap-2">
                  <span class="text-xl">💚</span>
                  <div>
                    <div class="font-semibold" style="color: var(--text)">
                      Vue 3
                    </div>
                    <div class="text-xs" style="color: var(--text-muted)">
                      渐进式框架
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="tech-card p-3 rounded-lg"
                style="background-color: var(--bg)"
              >
                <div class="flex items-center gap-2">
                  <span class="text-xl">📘</span>
                  <div>
                    <div class="font-semibold" style="color: var(--text)">
                      TypeScript
                    </div>
                    <div class="text-xs" style="color: var(--text-muted)">
                      类型安全
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="tech-card p-3 rounded-lg"
                style="background-color: var(--bg)"
              >
                <div class="flex items-center gap-2">
                  <span class="text-xl">🎨</span>
                  <div>
                    <div class="font-semibold" style="color: var(--text)">
                      Tailwind CSS
                    </div>
                    <div class="text-xs" style="color: var(--text-muted)">
                      实用优先 CSS
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="tech-card p-3 rounded-lg"
                style="background-color: var(--bg)"
              >
                <div class="flex items-center gap-2">
                  <span class="text-xl">🍍</span>
                  <div>
                    <div class="font-semibold" style="color: var(--text)">
                      Pinia
                    </div>
                    <div class="text-xs" style="color: var(--text-muted)">
                      状态管理
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="tech-card p-3 rounded-lg"
                style="background-color: var(--bg)"
              >
                <div class="flex items-center gap-2">
                  <span class="text-xl">🚀</span>
                  <div>
                    <div class="font-semibold" style="color: var(--text)">
                      EdgeOne
                    </div>
                    <div class="text-xs" style="color: var(--text-muted)">
                      服务端引擎
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 字体设计 -->
          <div>
            <h2
              class="text-2xl font-bold mb-4 flex items-center gap-2"
              style="color: var(--text)"
            >
              <span>✍️</span> 字体设计
            </h2>
            <div class="space-y-4">
              <!-- HarmonyOS Sans -->
              <div
                class="font-card p-4 rounded-lg"
                style="background-color: var(--bg)"
              >
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <span class="text-xl">📝</span>
                    <span class="font-semibold" style="color: var(--text)"
                      >HarmonyOS Sans</span
                    >
                  </div>
                  <span
                    class="text-xs px-2 py-1 rounded"
                    style="
                      background-color: var(--primary-light);
                      color: var(--primary);
                    "
                    >正文字体</span
                  >
                </div>
                <p
                  class="text-sm"
                  style="color: var(--text-secondary)"
                  :style="{ fontFamily: 'HarmonyOS Sans, sans-serif' }"
                >
                  这是一段使用 HarmonyOS Sans 字体的示例文字。HarmonyOS Sans
                  是华为开发的无级字重可变字体，具有优雅的造型和优秀的可读性，适合长时间阅读。
                </p>
                <div class="mt-2 text-xs" style="color: var(--text-muted)">
                  字体特点：无级字重、优化曲线、国际化支持
                </div>
              </div>

              <!-- Recursive Mono -->
              <div
                class="font-card p-4 rounded-lg"
                style="background-color: var(--bg)"
              >
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <span class="text-xl">⌨️</span>
                    <span class="font-semibold" style="color: var(--text)"
                      >Recursive Mono</span
                    >
                  </div>
                  <span
                    class="text-xs px-2 py-1 rounded"
                    style="
                      background-color: var(--primary-light);
                      color: var(--primary);
                    "
                    >等宽字体</span
                  >
                </div>
                <p class="text-sm" style="color: var(--text-secondary)">
                  Recursive Mono is a variable font that combines monospace and
                  proportional styles.
                  <br />
                  代码示例：const mbtiType = calculateMBTI(answers);
                </p>
                <div class="mt-2 text-xs" style="color: var(--text-muted)">
                  字体特点：可变字体、单等宽双模式、代码友好
                </div>
              </div>
            </div>
          </div>

          <!-- 特色功能 -->
          <div>
            <h2
              class="text-2xl font-bold mb-3 flex items-center gap-2"
              style="color: var(--text)"
            >
              <span>✨</span> 特色功能
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div
                class="feature-item flex items-center gap-3 p-3 rounded-lg"
                style="background-color: var(--bg)"
              >
                <span class="text-2xl">💾</span>
                <div>
                  <div class="font-semibold" style="color: var(--text)">
                    本地存储
                  </div>
                  <div class="text-xs" style="color: var(--text-muted)">
                    数据保存在浏览器，隐私安全
                  </div>
                </div>
              </div>
              <div
                class="feature-item flex items-center gap-3 p-3 rounded-lg"
                style="background-color: var(--bg)"
              >
                <span class="text-2xl">📱</span>
                <div>
                  <div class="font-semibold" style="color: var(--text)">
                    响应式设计
                  </div>
                  <div class="text-xs" style="color: var(--text-muted)">
                    完美适配手机、平板、电脑
                  </div>
                </div>
              </div>
              <div
                class="feature-item flex items-center gap-3 p-3 rounded-lg"
                style="background-color: var(--bg)"
              >
                <span class="text-2xl">🎨</span>
                <div>
                  <div class="font-semibold" style="color: var(--text)">
                    深色主题
                  </div>
                  <div class="text-xs" style="color: var(--text-muted)">
                    保护视力，舒适体验
                  </div>
                </div>
              </div>
              <div
                class="feature-item flex items-center gap-3 p-3 rounded-lg"
                style="background-color: var(--bg)"
              >
                <span class="text-2xl">📊</span>
                <div>
                  <div class="font-semibold" style="color: var(--text)">
                    可视化报告
                  </div>
                  <div class="text-xs" style="color: var(--text-muted)">
                    直观了解测评结果
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 免责声明 -->
          <div
            class="p-4 rounded-lg"
            style="background-color: var(--warning-bg)"
          >
            <h3
              class="font-semibold mb-2 flex items-center gap-2"
              style="color: var(--text)"
            >
              <span>⚠️</span> 免责声明
            </h3>
            <p class="text-sm" style="color: var(--warning-text)">
              本平台提供的心理测评结果仅供参考，不能替代专业医疗诊断。
              如果您感到明显的心理困扰，请及时寻求专业心理咨询师或医生的帮助。
            </p>
          </div>

          <!-- 紧急求助 -->
          <div
            class="p-4 rounded-lg"
            style="
              background-color: var(--warning-bg);
              border-left: 4px solid var(--warning-border);
            "
          >
            <h3
              class="font-semibold mb-2 flex items-center gap-2"
              style="color: var(--text)"
            >
              <span>📞</span> 紧急求助
            </h3>
            <p class="text-sm" style="color: var(--warning-text)">
              如果您有自伤、伤人的念头，或感到无法应对当前困境，请立即拨打：
              <br />• 希望24热线：400-161-9995（全国心理援助） <br />•
              北京心理危机研究与干预中心：010-82951332
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tech-card,
.feature-item {
  transition: all 0.2s ease;
}

.tech-card:hover,
.feature-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.font-card {
  border-left: 3px solid var(--primary);
  transition: all 0.2s ease;
}

.font-card:hover {
  transform: translateX(4px);
}
</style>
