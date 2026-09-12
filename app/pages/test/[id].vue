<template>
  <div class="min-h-screen py-8" style="background-color: var(--bg);">
    <div class="container mx-auto px-4 max-w-3xl">
      <!-- 加载状态 -->
      <div v-if="!test" class="text-center py-12">
        <div class="text-2xl" style="color: var(--text-secondary);">加载中...</div>
      </div>

      <!-- 测评内容 -->
      <div v-else>
        <!-- 开发模式调试菜单 -->
        <DevOnly>
          <div class="fixed bottom-4 right-4 z-50">
            <button @click="showDebugMenu = !showDebugMenu"
              class="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
              style="background-color: var(--special); color: white;">
              🐛
            </button>

            <div v-if="showDebugMenu" class="absolute bottom-12 right-0 mb-2 w-48 rounded-lg shadow-lg overflow-hidden"
              style="background-color: var(--card-bg);">
              <div class="py-1">
                <button @click="quickCompleteAll"
                  class="w-full px-4 py-2 text-left text-sm transition-colors"
                  style="color: var(--text);"
                  @mouseenter="elStyle($event, { backgroundColor: 'var(--bg)' })"
                  @mouseleave="elStyle($event, { backgroundColor: 'transparent' })">
                  🚀 随机完成所有题目
                </button>
                <button @click="quickCompleteCurrentPage"
                  class="w-full px-4 py-2 text-left text-sm transition-colors"
                  style="color: var(--text);"
                  @mouseenter="elStyle($event, { backgroundColor: 'var(--bg)' })"
                  @mouseleave="elStyle($event, { backgroundColor: 'transparent' })">
                  📄 随机完成当前页
                </button>
                <button @click="completeCurrentPageWithFirstOption"
                  class="w-full px-4 py-2 text-left text-sm transition-colors"
                  style="color: var(--text);"
                  @mouseenter="elStyle($event, { backgroundColor: 'var(--bg)' })"
                  @mouseleave="elStyle($event, { backgroundColor: 'transparent' })">
                  🛜 当前页全选第一个
                </button>
                <button @click="completeCurrentPageWithLastOption"
                  class="w-full px-4 py-2 text-left text-sm transition-colors"
                  style="color: var(--text);"
                  @mouseenter="elStyle($event, { backgroundColor: 'var(--bg)' })"
                  @mouseleave="elStyle($event, { backgroundColor: 'transparent' })">
                  🔚 当前页全选最后一个
                </button>
                <hr class="my-1" style="border-color: var(--primary-light);">
                <button @click="clearAllAnswers"
                  class="w-full px-4 py-2 text-left text-sm transition-colors"
                  style="color: var(--warning-text);"
                  @mouseenter="elStyle($event, { backgroundColor: 'var(--bg)' })"
                  @mouseleave="elStyle($event, { backgroundColor: 'transparent' })">
                  🗑️ 清除所有答案
                </button>
              </div>
            </div>
          </div>
        </DevOnly>

        <!-- 开始页：答题前确认是否打乱顺序 -->
        <template v-if="!started">
          <div class="rounded-xl overflow-hidden mb-6" style="background-color: var(--card-bg); box-shadow: var(--shadow-lg);">
            <div class="p-6" style="background-color: var(--primary); color: white;">
              <h1 class="text-2xl font-bold mb-2">{{ test.title }}</h1>
              <p style="color: rgba(255,255,255,0.9);">{{ test.instructions }}</p>
              <p class="text-sm mt-2" style="color: rgba(255,255,255,0.7);">
                <template v-if="isMultidim && !selectedMode">⚠️ 请先选择评估模式</template>
                <template v-else>⚠️ 请根据您的真实感受作答，共 {{ totalQuestions }} 题</template>
              </p>
            </div>

            <!-- 量表介绍（由来 / 作用 / 适配人群）默认全部展示 -->
            <div v-if="test.intro" class="border-b px-6 pt-4 pb-5 text-sm" style="border-color: var(--primary-light);">
              <div class="font-semibold text-base mb-3" style="color: var(--text);">📖 量表介绍</div>
              <!-- 重要提示（如缺乏文献/实证支持）：醒目展示 -->
              <div v-if="test.intro?.notice" class="mb-4 p-4 rounded-lg"
                style="background-color: var(--warning-bg); border: 1px solid var(--warning-border); border-left: 4px solid var(--warning-border); color: var(--warning-text);">
                <div class="font-bold mb-1">⚠️ 重要提示</div>
                <p class="leading-relaxed">{{ test.intro.notice }}</p>
              </div>
              <div class="space-y-4">
                <div v-if="test.intro?.origin">
                  <div class="font-semibold mb-1" style="color: var(--primary);">📜 由来</div>
                  <p class="leading-relaxed" style="color: var(--text-secondary);">{{ test.intro?.origin }}</p>
                </div>
                <div v-if="test.intro?.purpose">
                  <div class="font-semibold mb-1" style="color: var(--primary);">🎯 作用</div>
                  <p class="leading-relaxed" style="color: var(--text-secondary);">{{ test.intro?.purpose }}</p>
                </div>
                <div v-if="test.intro?.audience">
                  <div class="font-semibold mb-1" style="color: var(--primary);">👥 适配人群</div>
                  <p class="leading-relaxed" style="color: var(--text-secondary);">{{ test.intro?.audience }}</p>
                </div>
                <!-- 覆盖边界：明确写出本量表不测什么，避免被读成「查得全」 -->
                <div v-if="test.intro?.coverage">
                  <div class="font-semibold mb-1" style="color: var(--primary);">🧭 覆盖范围与边界</div>
                  <p class="leading-relaxed whitespace-pre-line" style="color: var(--text-secondary);">{{ test.intro?.coverage }}</p>
                </div>
                <div v-if="test.intro?.related?.length">
                  <div class="font-semibold mb-2" style="color: var(--primary);">🔗 相关量表</div>
                  <div class="space-y-2">
                    <button v-for="rel in test.intro.related" :key="rel.id" type="button"
                      @click="goRelatedTest(rel.id)"
                      class="w-full text-left p-3 rounded-lg transition-colors"
                      style="background-color: var(--bg); border: 1px solid var(--border);">
                      <div class="font-medium" style="color: var(--primary);">{{ rel.title }} →</div>
                      <p class="text-xs mt-1 leading-relaxed" style="color: var(--text-secondary);">{{ rel.reason }}</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- SIOSS 专属：测评前告知书与安全提醒 -->
            <div v-if="isFormalTest" class="p-6">
              <div class="formal-decree">
                <div class="formal-decree-seal">郑重声明</div>
                <div class="formal-decree-title">自杀意念自评量表 · 测评前告知书</div>
                <div class="formal-decree-sub">SIOSS · Self-rating Idea of Suicide Scale</div>
                <div class="formal-decree-body">
本量表将询问您近期与自杀相关的想法、感受与睡眠情况，含若干<b>强烈危险信号条目</b>。
请您在<b>私密、安全</b>的环境下凭<b>真实感受</b>作答；掩饰会让结果失真，也可能让您错失及时的帮助。
本量表仅为<b>筛查工具</b>，<b>不能替代专业诊断</b>。无论结果如何，如果您当下正经历难以承受的痛苦，或反复出现结束生命的念头，请<b>立即</b>联系下方专业援助。
                </div>
                <div class="formal-decree-hotline">
                  <strong>全国心理援助热线：12356</strong>（24 小时，免费，由国家卫健委统一管理）<br>
                  <strong>希望 24 热线：400-161-9995</strong>（24 小时）<br>
                  <strong>北京心理危机研究与干预中心：010-82951332</strong><br>
                  紧急情况请拨打 <strong>120</strong>，或前往就近医院急诊。
                </div>
              </div>
            </div>

            <div v-else class="p-6">
              <!-- 多维自评量表：先选择评估模式 -->
              <template v-if="isMultidim && !selectedMode">
                <div class="font-semibold mb-1" style="color: var(--text);">选择评估模式</div>
                <p class="text-sm mb-4" style="color: var(--text-secondary);">
                  四种模式均覆盖全部 20 个核心特征维度；模式越深，每维度的补充题越多、分析越细。每次进入按新种子随机抽题，便于乱序复测。
                </p>
                <div class="grid sm:grid-cols-2 gap-3">
                  <button v-for="mm in multidimModes" :key="mm.id" @click="pickMode(mm.id)"
                    class="text-left p-4 rounded-lg transition-all"
                    style="background-color: var(--bg); border: 1px solid var(--border);">
                    <div class="flex items-center justify-between gap-2">
                      <span class="font-semibold" style="color: var(--text);">{{ mm.name }}</span>
                      <span class="text-xs px-2 py-0.5 rounded-full"
                        style="background-color: var(--primary-light); color: var(--primary);">{{ mm.questionsCount }} 题</span>
                    </div>
                    <p class="text-sm mt-1" style="color: var(--text-secondary);">{{ mm.desc }}</p>
                  </button>
                </div>
              </template>

              <template v-else>
                <div v-if="isMultidim"
                  class="mb-4 p-3 rounded-lg flex items-center justify-between gap-3 flex-wrap"
                  style="background-color: var(--bg); border: 1px solid var(--border);">
                  <span class="text-sm" style="color: var(--text-secondary);">
                    当前模式：<b style="color: var(--text);">{{ currentModeName }}</b> · {{ totalQuestions }} 题
                  </span>
                  <span class="flex gap-2">
                    <button class="text-xs px-3 py-1.5 rounded-lg" @click="rerollQuestions"
                      style="background-color: var(--primary-light); color: var(--primary);">🎲 换一套题</button>
                    <button class="text-xs px-3 py-1.5 rounded-lg" @click="changeMode"
                      style="background-color: var(--card-bg); color: var(--text-secondary); border: 1px solid var(--border);">切换模式</button>
                  </span>
                </div>
                <!-- 作答方式：代答会改变结果的含义，先选清楚再开始 -->
                <div class="mt-3 p-4 rounded-lg" style="background-color: var(--bg);">
                  <div class="font-semibold" style="color: var(--text);">🧑‍🤝‍🧑 谁来作答</div>
                  <p class="text-sm mt-1 mb-3" style="color: var(--text-secondary);">
                    代答会降低结果可靠性：可被观察到的行为（睡眠、发脾气）容易被高估，
                    只有本人才知道的内在体验（情绪低落、空虚、自伤念头）容易被低估。
                  </p>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <label v-for="opt in respondentOptions" :key="opt.value"
                      class="flex items-start p-3 rounded-lg cursor-pointer transition-all"
                      :style="{
                        backgroundColor: respondent === opt.value ? 'var(--primary-light)' : 'var(--card-bg)',
                        border: respondent === opt.value ? '1px solid var(--primary)' : '1px solid var(--border)'
                      }">
                      <input type="radio" :value="opt.value" v-model="respondent" class="w-4 h-4 mr-3 mt-0.5"
                        :style="{ accentColor: 'var(--primary)' }">
                      <div>
                        <div class="font-medium text-sm" style="color: var(--text);">{{ opt.label }}</div>
                        <p class="text-xs mt-1" style="color: var(--text-secondary);">{{ opt.desc }}</p>
                      </div>
                    </label>
                  </div>
                </div>

                <label class="flex items-start p-4 rounded-lg cursor-pointer transition-all mt-3" style="background-color: var(--bg);">
                  <input type="checkbox" v-model="shuffleOrder" class="w-4 h-4 mr-3 mt-0.5" :style="{ accentColor: 'var(--primary)' }">
                  <div>
                    <div class="font-semibold" style="color: var(--text);">🔀 打乱题目顺序</div>
                    <p class="text-sm mt-1" style="color: var(--text-secondary);">勾选后随机排列题目顺序，降低惯性作答的干扰；不勾选则按原顺序作答。</p>
                  </div>
                </label>

                <!-- 答题方式：每页 10 题 / 一页一题 -->
                <div class="mt-3 p-4 rounded-lg" style="background-color: var(--bg);">
                  <div class="font-semibold" style="color: var(--text);">📄 答题方式</div>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                    <button v-for="opt in perPageOptions" :key="opt.value" type="button"
                      @click="setPerPageMode(opt.value)"
                      class="text-left px-3 py-2 rounded-lg transition-all"
                      :style="{
                        backgroundColor: perPageMode === opt.value ? 'var(--primary-light)' : 'var(--card-bg)',
                        border: perPageMode === opt.value ? '2px solid var(--primary)' : '1px solid var(--border)',
                      }"
                      :aria-pressed="perPageMode === opt.value">
                      <span class="block font-semibold text-sm"
                        :style="{ color: perPageMode === opt.value ? 'var(--primary)' : 'var(--text)' }">
                        {{ opt.label }}
                      </span>
                      <span class="block text-xs mt-0.5" style="color: var(--text-secondary);">{{ opt.desc }}</span>
                    </button>
                  </div>
                </div>

                <!-- 文字大小：答题前可直接放大，全站生效 -->
                <div class="mt-3 p-4 rounded-lg" style="background-color: var(--bg);">
                  <div class="font-semibold" style="color: var(--text);">🔤 文字大小</div>
                  <div class="grid grid-cols-3 gap-2 mt-3">
                    <button v-for="opt in fontScaleOptions" :key="opt.id" type="button"
                      @click="setFontScale(opt.id)"
                      class="px-2 py-2 rounded-lg text-center transition-all"
                      :style="{
                        backgroundColor: fontScale === opt.id ? 'var(--primary-light)' : 'var(--card-bg)',
                        border: fontScale === opt.id ? '2px solid var(--primary)' : '1px solid var(--border)',
                      }"
                      :aria-pressed="fontScale === opt.id">
                      <span class="block font-semibold text-sm"
                        :style="{ color: fontScale === opt.id ? 'var(--primary)' : 'var(--text)' }">
                        {{ opt.label }}
                      </span>
                      <span class="block text-xs mt-0.5" style="color: var(--text-secondary);">{{ opt.percent }}%</span>
                    </button>
                  </div>
                </div>

                <!-- 字体：答题前可直接更换，全站生效 -->
                <div class="mt-3 p-4 rounded-lg" style="background-color: var(--bg);">
                  <div class="font-semibold" style="color: var(--text);">🅰 字体</div>
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                    <button v-for="opt in fontFamilyOptions" :key="opt.id" type="button"
                      @click="setFontFamily(opt.id)"
                      class="px-2 py-2 rounded-lg text-center transition-all"
                      :style="{
                        backgroundColor: fontFamily === opt.id ? 'var(--primary-light)' : 'var(--card-bg)',
                        border: fontFamily === opt.id ? '2px solid var(--primary)' : '1px solid var(--border)',
                      }"
                      :aria-pressed="fontFamily === opt.id">
                      <span class="block font-semibold text-sm"
                        :style="{ fontFamily: 'var(' + opt.stackVar + ')', color: fontFamily === opt.id ? 'var(--primary)' : 'var(--text)' }">
                        {{ opt.label }}
                      </span>
                      <span class="block text-xs mt-0.5" style="color: var(--text-secondary);">{{ opt.desc }}</span>
                    </button>
                  </div>
                </div>

                <!-- 字重：答题前可直接加粗，全站生效 -->
                <div class="mt-3 p-4 rounded-lg" style="background-color: var(--bg);">
                  <div class="font-semibold" style="color: var(--text);">🅱 字重</div>
                  <div class="grid grid-cols-2 gap-2 mt-3">
                    <button v-for="opt in fontWeightOptions" :key="opt.id" type="button"
                      @click="setFontWeight(opt.id)"
                      class="px-2 py-2 rounded-lg text-center transition-all"
                      :style="{
                        backgroundColor: fontWeight === opt.id ? 'var(--primary-light)' : 'var(--card-bg)',
                        border: fontWeight === opt.id ? '2px solid var(--primary)' : '1px solid var(--border)',
                      }"
                      :aria-pressed="fontWeight === opt.id">
                      <span class="block text-sm"
                        :style="{ fontWeight: opt.id === 'bold' ? 'var(--fw-semibold)' : 'var(--fw-normal)', color: fontWeight === opt.id ? 'var(--primary)' : 'var(--text)' }">
                        {{ opt.label }}
                      </span>
                      <span class="block text-xs mt-0.5" style="color: var(--text-secondary);">{{ opt.desc }}</span>
                    </button>
                  </div>
                </div>

                <button @click="startTest" class="w-full mt-4 py-3 rounded-lg font-semibold text-white transition-all"
                  style="background-color: var(--primary); box-shadow: var(--shadow-sm);">
                  开始答题
                </button>
              </template>
            </div>

            <!-- SIOSS 正式模式：阅读声明后方可答题 -->
            <div v-if="isFormalTest" class="px-6 pb-6">
              <label class="flex items-start p-4 rounded-lg cursor-pointer transition-all mb-4"
                style="background-color: var(--bg); border: 1px solid var(--border);">
                <input type="checkbox" v-model="shuffleOrder" class="w-4 h-4 mr-3 mt-0.5" :style="{ accentColor: 'var(--primary)' }">
                <div>
                  <div class="font-semibold" style="color: var(--text);">🔀 打乱题目顺序</div>
                  <p class="text-sm mt-1" style="color: var(--text-secondary);">勾选后随机排列题目顺序，降低惯性作答的干扰；不勾选则按原顺序作答。</p>
                </div>
              </label>

              <!-- 答题方式：每页 10 题 / 一页一题（高敏感量表一页一题更专注） -->
              <div class="mb-4 p-4 rounded-lg" style="background-color: var(--bg); border: 1px solid var(--border);">
                <div class="font-semibold" style="color: var(--text);">📄 答题方式</div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                  <button v-for="opt in perPageOptions" :key="opt.value" type="button"
                    @click="setPerPageMode(opt.value)"
                    class="text-left px-3 py-2 rounded-lg transition-all"
                    :style="{
                      backgroundColor: perPageMode === opt.value ? 'var(--primary-light)' : 'var(--card-bg)',
                      border: perPageMode === opt.value ? '2px solid var(--primary)' : '1px solid var(--border)',
                    }"
                    :aria-pressed="perPageMode === opt.value">
                    <span class="block font-semibold text-sm"
                      :style="{ color: perPageMode === opt.value ? 'var(--primary)' : 'var(--text)' }">
                      {{ opt.label }}
                    </span>
                    <span class="block text-xs mt-0.5" style="color: var(--text-secondary);">{{ opt.desc }}</span>
                  </button>
                </div>
              </div>

              <!-- 文字大小：答题前可直接放大，全站生效 -->
              <div class="mb-4 p-4 rounded-lg" style="background-color: var(--bg); border: 1px solid var(--border);">
                <div class="font-semibold" style="color: var(--text);">🔤 文字大小</div>
                <div class="grid grid-cols-3 gap-2 mt-3">
                  <button v-for="opt in fontScaleOptions" :key="opt.id" type="button"
                    @click="setFontScale(opt.id)"
                    class="px-2 py-2 rounded-lg text-center transition-all"
                    :style="{
                      backgroundColor: fontScale === opt.id ? 'var(--primary-light)' : 'var(--card-bg)',
                      border: fontScale === opt.id ? '2px solid var(--primary)' : '1px solid var(--border)',
                    }"
                    :aria-pressed="fontScale === opt.id">
                    <span class="block font-semibold text-sm"
                      :style="{ color: fontScale === opt.id ? 'var(--primary)' : 'var(--text)' }">
                      {{ opt.label }}
                    </span>
                    <span class="block text-xs mt-0.5" style="color: var(--text-secondary);">{{ opt.percent }}%</span>
                  </button>
                </div>
              </div>

              <!-- 字体：答题前可直接更换，全站生效 -->
              <div class="mb-4 p-4 rounded-lg" style="background-color: var(--bg); border: 1px solid var(--border);">
                <div class="font-semibold" style="color: var(--text);">🅰 字体</div>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                  <button v-for="opt in fontFamilyOptions" :key="opt.id" type="button"
                    @click="setFontFamily(opt.id)"
                    class="px-2 py-2 rounded-lg text-center transition-all"
                    :style="{
                      backgroundColor: fontFamily === opt.id ? 'var(--primary-light)' : 'var(--card-bg)',
                      border: fontFamily === opt.id ? '2px solid var(--primary)' : '1px solid var(--border)',
                    }"
                    :aria-pressed="fontFamily === opt.id">
                    <span class="block font-semibold text-sm"
                      :style="{ fontFamily: 'var(' + opt.stackVar + ')', color: fontFamily === opt.id ? 'var(--primary)' : 'var(--text)' }">
                      {{ opt.label }}
                    </span>
                    <span class="block text-xs mt-0.5" style="color: var(--text-secondary);">{{ opt.desc }}</span>
                  </button>
                </div>
              </div>

              <!-- 字重：答题前可直接加粗，全站生效 -->
              <div class="mb-4 p-4 rounded-lg" style="background-color: var(--bg); border: 1px solid var(--border);">
                <div class="font-semibold" style="color: var(--text);">🅱 字重</div>
                <div class="grid grid-cols-2 gap-2 mt-3">
                  <button v-for="opt in fontWeightOptions" :key="opt.id" type="button"
                    @click="setFontWeight(opt.id)"
                    class="px-2 py-2 rounded-lg text-center transition-all"
                    :style="{
                      backgroundColor: fontWeight === opt.id ? 'var(--primary-light)' : 'var(--card-bg)',
                      border: fontWeight === opt.id ? '2px solid var(--primary)' : '1px solid var(--border)',
                    }"
                    :aria-pressed="fontWeight === opt.id">
                    <span class="block text-sm"
                      :style="{ fontWeight: opt.id === 'bold' ? 'var(--fw-semibold)' : 'var(--fw-normal)', color: fontWeight === opt.id ? 'var(--primary)' : 'var(--text)' }">
                      {{ opt.label }}
                    </span>
                    <span class="block text-xs mt-0.5" style="color: var(--text-secondary);">{{ opt.desc }}</span>
                  </button>
                </div>
              </div>

              <label class="flex items-start p-3 rounded-lg cursor-pointer transition-all"
                style="background-color: var(--bg); border: 1px solid var(--border);">
                <input type="checkbox" v-model="formalAcknowledged" class="w-4 h-4 mr-3 mt-1"
                  :style="{ accentColor: 'var(--danger)' }">
                <div style="color: var(--text);">
                  <span class="font-semibold">我已阅读并理解上述声明。</span>
                  <span class="text-sm block mt-1" style="color: var(--text-secondary);">勾选后即可进入正式答题。如感到情绪激动或缺乏安全私密环境，建议先拨打上方热线或暂缓作答。</span>
                </div>
              </label>
              <button @click="startTest" :disabled="!formalAcknowledged"
                class="w-full mt-4 py-3 rounded-lg font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                :style="{
                  backgroundColor: formalAcknowledged ? 'var(--primary)' : 'var(--text-muted)',
                  color: 'white',
                  boxShadow: 'var(--shadow-sm)',
                }">
                {{ formalAcknowledged ? '进入正式测评' : '请先确认已阅读声明' }}
              </button>
            </div>
          </div>
        </template>

        <template v-else>
        <!-- 进度条 -->
        <div class="mb-6">
          <div class="flex justify-between text-sm mb-2" style="color: var(--text-secondary);">
            <span>答题进度</span>
            <span>{{ answeredCount }} / {{ requiredCount }}</span>
          </div>
          <div class="w-full rounded-full h-2" style="background-color: var(--primary-light);">
            <div class="rounded-full h-2 transition-all duration-300"
              :style="{ width: `${progress}%`, backgroundColor: 'var(--primary)' }"></div>
          </div>
        </div>

        <!-- 分页信息和操作按钮 -->
        <div class="flex justify-between items-center mb-4">
          <div class="text-sm" style="color: var(--text-muted);">
            第 {{ currentPage }} / {{ totalPages }} {{ isOnePerPage ? '题' : '页' }}
          </div>
          <div class="flex gap-2">
            <div v-if="!isOnePerPage" class="text-sm" style="color: var(--text-muted);">
              本页 {{ currentPageQuestions.length }} 题
            </div>
            <!-- 清除本页答案按钮 -->
            <button v-if="hasCurrentPageAnswers" @click="clearCurrentPageAnswers"
              class="text-xs px-2 py-1 rounded transition-colors"
              style="background-color: var(--warning-bg); color: var(--warning-text);" title="清除当前页所有答案">
              🗑️ 清除本页
            </button>
            <!-- 清除所有答案按钮 -->
            <button v-if="answeredCount > 0" @click="clearAllAnswers"
              class="text-xs px-2 py-1 rounded transition-colors"
              style="background-color: var(--warning-bg); color: var(--warning-text);" title="清除所有答案">
              🗑️ 清除全部
            </button>
          </div>
        </div>

        <!-- 快速跳转区域 -->
        <div v-if="totalPages > 5" class="flex flex-wrap items-center justify-center gap-3 mb-6 p-3 rounded-lg"
          style="background-color: var(--card-bg); box-shadow: var(--shadow-sm);">
          <span class="text-sm" style="color: var(--text-secondary);">快速跳转：</span>

          <!-- 页码按钮（一页一题时页码过多，隐藏按钮组，仅保留输入框跳转） -->
          <div v-if="!isOnePerPage" class="flex flex-wrap gap-1">
            <button v-for="page in visiblePages" :key="page" @click="goToPage(page)"
              class="min-w-[32px] h-8 rounded-md text-sm transition-all" :style="{
                'background-color': currentPage === page ? 'var(--primary)' : 'var(--card-bg)',
                'color': currentPage === page ? 'white' : 'var(--text-secondary)',
                'box-shadow': 'var(--shadow-sm)'
              }">
              <template v-if="page === -1">...</template>
              <template v-else>{{ page }}</template>
            </button>
          </div>

          <!-- 输入框跳转 -->
          <div class="flex items-center gap-2 ml-2">
            <span class="text-xs" style="color: var(--text-muted);">前往</span>
            <input type="number" v-model.number="jumpPage" :min="1" :max="totalPages"
              class="w-16 px-2 py-1 text-center rounded border text-sm"
              style="background-color: var(--bg); border-color: var(--primary-light); color: var(--text);"
              @keyup.enter="jumpToPage" />
            <span class="text-xs" style="color: var(--text-muted);">{{ isOnePerPage ? '题' : '页' }}</span>
            <button @click="jumpToPage" class="px-3 py-1 rounded text-xs transition-colors"
              style="background-color: var(--primary); color: white;"
              @mouseenter="elStyle($event, { backgroundColor: 'var(--primary-dark)' })"
              @mouseleave="elStyle($event, { backgroundColor: 'var(--primary)' })">
              GO
            </button>
          </div>
        </div>

        <!-- 页码导航 -->
        <div v-else class="flex justify-center gap-2 mb-6">
          <button v-for="page in totalPages" :key="page" @click="goToPage(page)"
            class="w-8 h-8 rounded-md text-sm transition-all" :style="{
              backgroundColor: currentPage === page ? 'var(--primary)' : 'var(--card-bg)',
              color: currentPage === page ? 'white' : 'var(--text-secondary)',
              boxShadow: currentPage === page ? 'var(--shadow-sm)' : 'none'
            }">
            {{ page }}
          </button>
        </div>

        <!-- 测评信息 -->
        <div class="rounded-xl overflow-hidden mb-6"
          style="background-color: var(--card-bg); box-shadow: var(--shadow-lg);">
          <div class="p-6" style="background-color: var(--primary); color: white;">
            <h1 class="text-2xl font-bold mb-2">{{ test.title }}</h1>
            <p style="color: rgba(255,255,255,0.9);">{{ test.instructions }}</p>
            <p class="text-sm mt-2" style="color: rgba(255,255,255,0.7);">
              ⚠️ 请根据您的真实感受作答，共 {{ totalQuestions }} 题
            </p>
          </div>

          <!-- 作答范围常驻（第三批报告 6）：各量表窗口并不一致（PHQ-9 两周 / SDS 一周 /
               YMRS 48 小时 / SDQ-20 一年），而窗口只写在头部说明里，翻页后会滚出视野。
               量表说明本身不再重复展示——头部已经有了；这里只补它没说的两件事：
               这次评的是哪个时间段，以及题面里「这些情境」具体指什么。 -->
          <div v-if="test.timeFrame || test.contextHint" class="px-6 py-3 border-t"
            style="border-color: var(--primary-light); background-color: var(--bg);">
            <span v-if="test.timeFrame" class="text-xs px-2 py-0.5 rounded-full font-semibold whitespace-nowrap"
              style="background-color: var(--primary-light); color: var(--primary);">
              作答范围 · {{ test.timeFrame }}
            </span>
            <p v-if="test.contextHint" class="text-xs mt-2" style="color: var(--text-secondary);">{{ test.contextHint }}</p>
          </div>

          <!-- SIOSS 正式模式：答题中持续提示 -->
          <div v-if="isFormalTest" class="formal-top-warning" style="border-radius: 0;">
            <div class="formal-top-warning-icon">⚠️</div>
            <div class="formal-top-warning-body">
              <b>专业量表 · 请如实作答</b><br>
              量表含若干与自杀相关的题目，请凭真实感受作答。<b>掩饰会让结果失真</b>，更可能让您错失及时帮助。<br>
              如感到情绪激动或需要倾诉，请拨 <b>12356</b>（全国心理援助热线，24 小时，免费）。
            </div>
          </div>

          <!-- 题目列表（当前页） -->
          <div class="p-6 space-y-8">
            <div v-for="(question, index) in currentPageQuestions" :key="question.id"
              :class="[isFormalTest && SIOSS_DANGER_ITEMS.has(question.id) ? 'formal-question formal-question-danger' : '']"
              class="border-b last:border-0 pb-6 last:pb-0" style="border-color: var(--primary-light);">
              <p class="text-lg font-semibold mb-4" style="color: var(--text);">
                {{ getGlobalQuestionNumber(question.id) }}. {{ question.text }}
                <span v-if="isFormalTest && SIOSS_DANGER_ITEMS.has(question.id)"
                  class="formal-question-danger-tag">
                  危险信号条目
                </span>
                <span v-if="question.window && question.window !== '2w'"
                  class="inline-block ml-2 align-middle text-xs px-2 py-0.5 rounded-full whitespace-nowrap"
                  :style="{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }">
                  作答范围 · {{ question.windowLabel }}
                </span>
              </p>

              <div class="space-y-3">
                <!-- number 题（数字输入，如生理年龄）：可不填 -->
                <template v-if="isNumberQuestion(question)">
                  <div class="p-3 rounded-lg" style="background-color: var(--bg);">
                    <input type="number" v-model.number="answers[question.id]" :min="question.min ?? 0"
                      :max="question.max ?? 99" inputmode="numeric" placeholder="请输入数字"
                      class="w-full px-3 py-2 rounded-lg border text-base"
                      :style="{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--primary)', color: 'var(--text)' }">
                    <p class="text-xs mt-2" style="color: var(--text-muted);">可不填；若填写，报告将对比「心理年龄 vs 生理年龄」。</p>
                  </div>
                </template>
                <!-- range 题（滑块，如 MID-60 的 0-10 频率）：必答 -->
                <template v-else-if="isRangeQuestion(question)">
                  <div class="p-3 rounded-lg" style="background-color: var(--bg);">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-xs" style="color: var(--text-muted);">{{ question.min ?? 0 }}{{ question.minLabel ? ' · ' + question.minLabel : '' }}</span>
                      <span class="font-semibold text-lg tabular-nums" style="color: var(--primary);">{{ answers[question.id] === undefined ? '未选择' : answers[question.id] }}</span>
                      <span class="text-xs" style="color: var(--text-muted);">{{ question.max ?? 10 }}{{ question.maxLabel ? ' · ' + question.maxLabel : '' }}</span>
                    </div>
                    <input type="range" :min="question.min ?? 0" :max="question.max ?? 100" :step="question.step ?? 1"
                      :value="answers[question.id] ?? rangeMid(question)"
                      @pointerdown="ensureRange(question.id, question.min, question.max)"
                      @input="onRangeInput(question.id, $event)"
                      @change="scheduleAutoAdvance(520)"
                      class="w-full h-2" :style="{ accentColor: 'var(--primary)' }">
                  </div>
                </template>
                <template v-else>
                <label v-for="option in question.options" :key="option.value"
                  class="flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200"
                  :class="{ 'border-2': answers[question.id] === option.value }" :style="{
                    backgroundColor: answers[question.id] === option.value ? 'var(--primary-light)' : 'var(--bg)',
                    borderColor: answers[question.id] === option.value ? 'var(--primary)' : 'transparent'
                  }">
                  <input type="radio" :name="`q${question.id}`" :value="option.value" v-model="answers[question.id]"
                    class="w-4 h-4 mr-3" :style="{ accentColor: 'var(--primary)' }"
                    @change="scheduleAutoAdvance()">
                  <span style="color: var(--text);">{{ option.label }}</span>
                </label>
                </template>
              </div>
            </div>
          </div>

          <!-- 分页导航按钮 -->
          <div class="p-6 flex justify-between gap-4" style="background-color: var(--bg);">
            <button @click="prevPage"
              class="px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              :style="{
                backgroundColor: 'var(--card-bg)',
                color: 'var(--text-secondary)',
                boxShadow: 'var(--shadow-sm)'
              }">
              {{ currentPage === 1 ? '返回主页' : '← 上一页' }}
            </button>

            <button v-if="!isLastPage" @click="nextPage"
              class="px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              :style="{
                backgroundColor: 'var(--primary)',
                color: 'white',
                boxShadow: 'var(--shadow-sm)'
              }">
              下一页 →
            </button>

            <button v-else @click="onSubmitClick" :disabled="!canClickSubmit"
              class="flex-1 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              :style="{
                backgroundColor: canClickSubmit ? 'var(--primary)' : 'var(--text-muted)',
                color: 'white',
                boxShadow: 'var(--shadow-sm)'
              }">
              {{ submitButtonText }}
            </button>
          </div>
        </div>

        <!-- 快速跳转提示（仅当页数较多时显示；一页一题时页码过多，不显示） -->
        <div v-if="totalPages > 5 && !isOnePerPage" class="text-center">
          <div class="inline-flex gap-2 flex-wrap justify-center">
            <button v-for="page in visiblePages" :key="page" @click="goToPage(page)"
              class="w-10 h-10 rounded-lg transition-all" :style="{
                backgroundColor: currentPage === page ? 'var(--primary)' : 'var(--card-bg)',
                color: currentPage === page ? 'white' : 'var(--text-secondary)',
                boxShadow: 'var(--shadow-sm)'
              }">
              {{ page === -1 ? '...' : page }}
            </button>
          </div>
        </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAnswerStore } from '~/stores/answer'

const route = useRoute()
const router = useRouter()
const testId = route.params.id as string
const answerStore = useAnswerStore()
const { $toast, $confirm } = useNuxtApp()

// SIOSS（自杀意念）属于高敏感量表，使用专门的「正式模式」：衬线字体 / 墨色 + 警示红 / 强化危机警告。
const FORMAL_TESTS = ['sioss']
const isFormalTest = computed(() => FORMAL_TESTS.includes(testId))

// SIOSS 强烈危险信号条目（与 scoreSIOSS.dangerItems 一致）：答"是"需严肃对待
const SIOSS_DANGER_ITEMS = new Set<number>([11, 17, 22, 26])


// 客户端标志
const isClient = ref(false)

// ===== 答题方式：每页 10 题（默认）/ 一页一题 =====
type PerPageMode = 'ten' | 'one'
const PER_PAGE_STORAGE_KEY = 'psychology_per_page_mode'
const perPageMode = ref<PerPageMode>('ten')
const isOnePerPage = computed(() => perPageMode.value === 'one')
const questionsPerPage = computed(() => (isOnePerPage.value ? 1 : 10))

// ===== 文字大小：答题前可直接调整（全站生效并记住选择）=====
const { fontScale, setFontScale, fontScaleOptions } = useFontScale()

// ===== 字体：答题前可直接更换（全站生效并记住选择）=====
const { fontFamily, setFontFamily, fontFamilyOptions } = useFontFamily()

// ===== 字重：答题前可直接加粗（全站生效并记住选择）=====
const { fontWeight, setFontWeight, fontWeightOptions } = useFontWeight()

const perPageOptions: { value: PerPageMode; label: string; desc: string }[] = [
  { value: 'ten', label: '每页 10 题', desc: '一次浏览多题' },
  { value: 'one', label: '一页一题', desc: '选完自动下一题' },
]

// 切换答题方式并记住选择（下次进入默认沿用）
function setPerPageMode(mode: PerPageMode) {
  perPageMode.value = mode
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(PER_PAGE_STORAGE_KEY, mode)
  } catch (e) {
    console.error('保存答题方式失败', e)
  }
}

// 获取题库数据
// 多维自评量表题目随 ?mode&seed 变化：URL 用响应式 getter，切换模式/换题时自动重新拉取。
// URL 未带 mode 时（如从首页卡片 / NavBar「继续测评」进入），回退读取上次保存的模式与种子，
// 以便恢复同一套题目与作答进度（提交校验也依赖同一套题目）。
const storedMode = ref('')
const storedSeed = ref('')
if (typeof window !== 'undefined' && testId === 'multidim') {
  storedMode.value = sessionStorage.getItem(`test_${testId}_mode`) || ''
  storedSeed.value = sessionStorage.getItem(`test_${testId}_seed`) || ''
}

const effectiveMode = computed(() => {
  if (testId !== 'multidim') return ''
  const m = route.query.mode
  return (typeof m === 'string' && m) || storedMode.value
})
const effectiveSeed = computed(() => {
  if (testId !== 'multidim') return ''
  const s = route.query.seed
  return (typeof s === 'string' && s) || storedSeed.value
})
const multidimQuery = computed(() => {
  if (testId !== 'multidim' || !effectiveMode.value) return ''
  const seed = effectiveSeed.value
  return `?mode=${encodeURIComponent(effectiveMode.value)}${seed ? `&seed=${encodeURIComponent(seed)}` : ''}`
})
const { data: response, error } = await useFetch(() => `/api/tests/${testId}${multidimQuery.value}`)
const test = computed<any>(() => {
  const data: any = (response.value as any)?.data
  return Array.isArray(data) ? null : data
})

// 服务端签发的出题凭证：提交时回传，服务端以凭证内的 mode / seed 为准，
// 保证「生成题目的参数」与「评分时的参数」一致
const questionToken = computed(() => (test.value as any)?.questionToken || '')

// ===== 多维自评量表：模式选择 + 乱序复测 =====
const isMultidim = computed(() => testId === 'multidim')
const multidimModes = computed<any[]>(() => ((test.value as any)?.modes as any[]) || [])
const selectedMode = computed(() => effectiveMode.value || null)
const currentModeName = computed(
  () => multidimModes.value.find((m) => m.id === selectedMode.value)?.name || selectedMode.value || '',
)

// 切换模式 / 换一套题前，清空当前作答与题序，避免旧题号混入新题集
function resetForNewQuestionSet() {
  answers.value = {}
  if (typeof window !== 'undefined') {
    // 显式移除旧作答：clearAnswers() 会把 currentTestId 置空，导致 saveToSession 不再写入
    sessionStorage.removeItem(`test_${testId}_answers`)
  }
  answerStore.clearAnswers()
  // 重新绑定当前测评，保证换模式后续的作答仍能持续写入进度
  answerStore.setCurrentTest(testId)
  clearOrder()
  started.value = false
  currentPage.value = 1
}

// 选择模式：写入 mode + 新种子（种子使每次进入随机抽题，实现乱序复测）
function pickMode(mode: string) {
  resetForNewQuestionSet()
  router.replace({ query: { mode, seed: String(Date.now()) } })
}

// 换一套题：同模式、新种子
function rerollQuestions() {
  if (!selectedMode.value) return
  resetForNewQuestionSet()
  router.replace({ query: { mode: selectedMode.value, seed: String(Date.now()) } })
}

// 返回模式选择（同时清除已保存的模式/种子/总数，避免又被自动恢复）
function changeMode() {
  resetForNewQuestionSet()
  storedMode.value = ''
  storedSeed.value = ''
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(`test_${testId}_mode`)
    sessionStorage.removeItem(`test_${testId}_seed`)
    sessionStorage.removeItem(`test_${testId}_total`)
  }
  router.replace({ query: {} })
}

// 使用 Pinia 存储答案
const answers = ref<Record<number, number>>({})

// 分页相关
const currentPage = ref(1)

// 所有题目
// 当前题序（初始为题库顺序，可被「打乱」重排）
const allQuestions = ref<any[]>([])
const started = ref(false)        // 是否已进入答题（每次进入都先显示开始页询问是否打乱）
const shuffleOrder = ref(false)   // 开始页勾选：是否打乱题目顺序
const isSubmitting = ref(false)   // 提交中锁：防止重复提交

// 幂等键：一次测评一个 id（进入答题时生成），重复提交只结算一次
const submissionId = `${testId}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`

// 作答来源：默认本人自评。他人代答时服务端会把效度与一致性校验标为不适用，
// 并在报告里显式标注数据来源
const respondent = ref<'self' | 'proxy'>('self')
const respondentOptions = [
  { value: 'self' as const, label: '本人自评', desc: '由当事人自己按最近的真实感受作答，结果按自评口径解读。' },
  { value: 'proxy' as const, label: '他人代答', desc: '由家属、朋友或长期陪伴者依据观察作答；报告会标注代答，效度与一致性校验不适用。' },
]

// 多维自评量表不默认乱序：服务端已按「严重议题优先」排好序（自伤 / 幻觉条目排在前面），
// 默认乱序会把该安全排序完全打掉。需要乱序复测时由用户在开始页勾选。

// SIOSS 等高敏感量表：勾选"已阅读声明"才可进入
const formalAcknowledged = ref(false)

// 打乱算法（Fisher-Yates）
function shuffleArr<T>(arr: T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = a[i] as T
    a[i] = a[j] as T
    a[j] = tmp
  }
  return a
}

// 数字输入题（如生理年龄）固定到最后，不参与打乱
function pinNumberLast(list: any[]): any[] {
  const nums = list.filter((q) => q?.type === 'number')
  const rest = list.filter((q) => q?.type !== 'number')
  return rest.concat(nums)
}

// 题目顺序的持久化 / 恢复（保证刷新后顺序一致）
const orderKey = "test_" + testId + "_order"
function saveOrder(ids: number[]) {
  if (typeof window === "undefined") return
  try { sessionStorage.setItem(orderKey, JSON.stringify(ids)) } catch (e) { console.error("保存题目顺序失败", e) }
}
function loadOrder(): number[] | null {
  if (typeof window === "undefined") return null
  try {
    const raw = sessionStorage.getItem(orderKey)
    if (!raw) return null
    const ids = JSON.parse(raw)
    return Array.isArray(ids) ? (ids as number[]) : null
  } catch { return null }
}
function clearOrder() {
  if (typeof window === "undefined") return
  sessionStorage.removeItem(orderKey)
}

// 题库加载后填充题目顺序；若存在已保存顺序（之前打乱过）则恢复。
// 注意：不据此自动跳过开始页——每次进入都先询问「是否打乱」。
watch(
  () => test.value,
  (t) => {
    if (!t || !t.questions) return
    const savedOrder = loadOrder()
    if (savedOrder && savedOrder.length === t.questions.length) {
      const byId = new Map<number, any>()
      t.questions.forEach((q: any) => byId.set(q.id, q))
      allQuestions.value = pinNumberLast(savedOrder.map((id) => byId.get(id)).filter(Boolean) as any[])
    } else {
      allQuestions.value = t.questions.slice()
    }
  },
  { immediate: true }
)

// 开始答题：按勾选决定是否打乱顺序
function startTest() {
  const t = test.value
  if (!t) return
  if (shuffleOrder.value) {
    // 数字输入题（如生理年龄）固定到最后，不参与打乱
    allQuestions.value = pinNumberLast(shuffleArr(t.questions))
    saveOrder(allQuestions.value.map((q) => q.id))
  } else {
    allQuestions.value = t.questions.slice()
    clearOrder()
  }
  started.value = true
  // 若已在恢复的进度中（onMounted 已定位到对应页码），保留该页；否则回到第一页
  const saved = answerStore.getAnswers()
  const hasSaved = saved && Object.keys(saved).length > 0
  if (!hasSaved) currentPage.value = 1
  if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" })
}
const totalQuestions = computed(() => allQuestions.value.length)
const totalPages = computed(() =>
  Math.max(1, Math.ceil(totalQuestions.value / questionsPerPage.value))
)

// 当前页显示的题目
const currentPageQuestions = computed(() => {
  const start = (currentPage.value - 1) * questionsPerPage.value
  const end = start + questionsPerPage.value
  return allQuestions.value.slice(start, end)
})

// 当前页题目ID列表
const currentPageQuestionIds = computed(() => currentPageQuestions.value.map(q => q.id))

// 计算显示题号（按当前题序的位置，打乱后也为连续编号）
const getGlobalQuestionNumber = (questionId: number) => {
  const idx = allQuestions.value.findIndex((q) => q.id === questionId)
  return idx >= 0 ? idx + 1 : questionId
}

// number 题（数字输入，如生理年龄）——不计入必答完成度，可留空
const isNumberQuestion = (q: any) => q?.type === 'number'
const isRangeQuestion = (q: any) => q?.type === 'range'

// 滑块输入：把滑块的值写入作答对象
function onRangeInput(id: number, e: Event) {
  const v = Number((e.target as HTMLInputElement).value)
  answers.value[id] = v
}

// 滑块未作答时的默认停留位置（中间值，避免停在边界以致“选边界要先移开再移回”）
function rangeMid(q: any): number {
  const min = typeof q?.min === 'number' ? q.min : 0
  const max = typeof q?.max === 'number' ? q.max : 10
  return Math.round((min + max) / 2)
}

// 用户在滑块上按下开始拖动时，若尚未作答先用中间值占位；此后拖动即可选任意数值（含两端）
function ensureRange(id: number, min?: number, max?: number) {
  if (answers.value[id] === undefined) {
    answers.value[id] = Math.round(((min ?? 0) + (max ?? 10)) / 2)
  }
}

// 必答题目（排除 number 题）
const requiredQuestions = computed(() => allQuestions.value.filter(q => !isNumberQuestion(q)))
const requiredIds = computed(() => requiredQuestions.value.map(q => q.id))
const requiredCount = computed(() => requiredIds.value.length)

// 记录进度元数据：实际必答题目数（分母），供首页卡片 / NavBar「未完成测评」使用。
// 各量表题量固定，但多维量表随模式变化（20/45/65/105），且 number 题为选答，
// 因此不能直接用列表里的 questionsCount 当分母。
watch(requiredCount, (total) => {
  if (typeof window === 'undefined' || total <= 0) return
  sessionStorage.setItem(`test_${testId}_total`, String(total))
}, { immediate: true })

// 多维量表另存当前模式与种子：从首页卡片 / NavBar 继续时据此恢复同一套题目，
// 既保证进度能续答，也保证提交校验用的题目集合一致。
watch([selectedMode, effectiveSeed], ([mode, seed]) => {
  if (typeof window === 'undefined' || testId !== 'multidim') return
  if (mode) {
    storedMode.value = mode
    sessionStorage.setItem(`test_${testId}_mode`, mode)
  }
  if (seed) {
    storedSeed.value = seed
    sessionStorage.setItem(`test_${testId}_seed`, seed)
  }
}, { immediate: true })

// 计算已答题数（仅计必答题）
const answeredCount = computed(() => requiredIds.value.filter(id => answers.value[id] !== undefined).length)
const remainingCount = computed(() => requiredCount.value - answeredCount.value)
const isComplete = computed(() => answeredCount.value === requiredCount.value && requiredCount.value > 0)

// 当前页是否有答案
const hasCurrentPageAnswers = computed(() => {
  return currentPageQuestionIds.value.some(id => answers.value[id] !== undefined)
})

// 当前页是否已全部作答
const isCurrentPageComplete = computed(() => {
  return currentPageQuestionIds.value.every(id => answers.value[id] !== undefined)
})

// 是否是最后一页
const isLastPage = computed(() => currentPage.value === totalPages.value)

// 总进度
const progress = computed(() => (answeredCount.value / requiredCount.value) * 100 || 0)

// 可见页码（用于快速跳转）
const visiblePages = computed(() => {
  const range: number[] = []
  for (let i = 1; i <= totalPages.value; i++) {
    range.push(i)
  }
  return range
})

// 清除当前页的所有答案
const clearCurrentPageAnswers = () => {
  const toClearCount = currentPageQuestionIds.value.filter(id => answers.value[id] !== undefined).length
  if (toClearCount === 0) {
    $toast.info('当前页没有需要清除的答案', '提示')
    return
  }

  $confirm({
    title: '确认清除',
    message: `确定要清除当前页（第 ${currentPage.value} 页）的 ${toClearCount} 个答案吗？此操作不可恢复。`,
    onConfirm: () => {
      // 删除当前页答案后重建对象触发响应式；由 watch(answers) 整体同步 store 与 sessionStorage
      currentPageQuestionIds.value.forEach(id => {
        if (answers.value[id] !== undefined) {
          delete answers.value[id]
        }
      })
      answers.value = { ...answers.value }

      $toast.success(`已清除第 ${currentPage.value} 页的 ${toClearCount} 个答案`, '完成')
    }
  })
}

// 清除所有答案
const clearAllAnswers = () => {
  if (answeredCount.value === 0) {
    $toast.info('没有需要清除的答案', '提示')
    return
  }

  $confirm({
    title: '确认清除',
    message: `确定要清除所有 ${answeredCount.value} 个答案吗？此操作不可恢复。`,
    onConfirm: () => {
      // 清空答案对象触发响应式；由 watch(answers) 整体清空 store 与 sessionStorage
      answers.value = {}

      // 重置到第一页（回到开始页）
      currentPage.value = 1
      started.value = false
      clearOrder()

      $toast.success('已清除所有答案', '完成')
    }
  })
}

// 初始化时加载已保存的答案
// 从上次作答恢复：定位到最后一题的页码
// （多维量表从「继续测评」进入时 URL 无 mode，题目要等客户端回退取回后再定位）
const pendingResumePosition = ref(false)
function positionToLastAnswered(saved: Record<number, number>) {
  const answeredIds = Object.keys(saved || {}).map(Number)
  if (answeredIds.length === 0) return
  const lastAnsweredId = answeredIds.reduce((max, id) => (id > max ? id : max), 0)
  const questionIndex = allQuestions.value.findIndex((q) => q.id === lastAnsweredId)
  if (questionIndex !== -1) {
    currentPage.value = Math.floor(questionIndex / questionsPerPage.value) + 1
  }
}

onMounted(async () => {
  // 恢复上次选择的答题方式（须在任何页码计算之前确定每页题数）
  try {
    const savedMode = localStorage.getItem(PER_PAGE_STORAGE_KEY)
    if (savedMode === 'one' || savedMode === 'ten') perPageMode.value = savedMode
  } catch (e) {
    console.error('读取答题方式失败', e)
  }

  jumpPage.value = currentPage.value
  isClient.value = true

  if (answerStore.currentTestId !== testId) {
    answerStore.setCurrentTest(testId)
  }

  const savedAnswers = answerStore.getAnswers()

  // 多维量表在未选定模式前不恢复旧作答（旧题集可能与当前模式不一致）
  const canRestore = !isMultidim.value || !!selectedMode.value

  if (savedAnswers && Object.keys(savedAnswers).length > 0 && canRestore) {
    const completedCount = Object.keys(savedAnswers).length
    // 分母用保存的实际题量：多维量表随模式为 20/45/65/105，且题目可能尚未取回
    const storedTotal = Number(sessionStorage.getItem(`test_${testId}_total`))
    const totalCount = totalQuestions.value > 0
      ? totalQuestions.value
      : (Number.isFinite(storedTotal) && storedTotal > 0 ? storedTotal : 0)

    answers.value = { ...savedAnswers }

    // 有进行中的作答：直接从已恢复（打乱）的顺序继续，跳过开始页
    started.value = true

    if (totalQuestions.value > 0) {
      positionToLastAnswered(savedAnswers)
    } else {
      // 题集尚未就绪，等 allQuestions 填充后再定位
      pendingResumePosition.value = true
    }

    if (completedCount === totalCount && totalCount > 0) {
      $toast.info(`您已完成所有 ${completedCount} 题，请提交测评`, '温馨提示')
    } else {
      $toast.info(`检测到您上次答题进度：已完成 ${completedCount}/${totalCount || '?'} 题`, '继续答题')
    }
  } else {
    answers.value = {}
  }

  if (isMultidim.value) {
    $confirm({
      title: '重要提示',
      message: '此量表没有相关文献支持，也未经过实验或临床测试，不具备心理测量学验证。请勿将其结果当作临床诊断或筛查结论；如您正受情绪困扰，请咨询精神科或心理专业人员。',
      confirmText: '我已了解',
      cancelText: '关闭',
    })
  }
})

// 题集回退取回后，补上"定位到上次题号"（见 onMounted 中的 pendingResumePosition）
watch([totalQuestions, allQuestions], () => {
  if (!pendingResumePosition.value || totalQuestions.value <= 0) return
  positionToLastAnswered(answerStore.getAnswers() || {})
  pendingResumePosition.value = false
})

// 监听答案变化，整体同步 store 与 sessionStorage 并刷新进度
watch(answers, (newAnswers) => {
  answerStore.setAnswers(newAnswers)
  // 实时刷新“未完成的测评”进度（NavBar 下拉与首页卡片）
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('refreshProgress'))
  }
}, { deep: true })

// ===== 一页一题：作答后自动前进 =====
let autoAdvanceTimer: ReturnType<typeof setTimeout> | null = null

function cancelAutoAdvance() {
  if (autoAdvanceTimer !== null) {
    clearTimeout(autoAdvanceTimer)
    autoAdvanceTimer = null
  }
}

// 作答后自动跳到下一题（仅一页一题模式；最后一题停留等待提交）
function scheduleAutoAdvance(delay = 320) {
  if (!isOnePerPage.value || !started.value) return
  cancelAutoAdvance()
  autoAdvanceTimer = setTimeout(() => {
    autoAdvanceTimer = null
    if (!isOnePerPage.value || !started.value || isLastPage.value) return
    currentPage.value++
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }, delay)
}

onUnmounted(cancelAutoAdvance)

// 定位到第一道未作答的必答题（一页一题模式下用于找回漏答的题）
function goToFirstUnanswered(): boolean {
  const idx = allQuestions.value.findIndex(
    (q) => !isNumberQuestion(q) && answers.value[q.id] === undefined,
  )
  if (idx === -1) return false
  currentPage.value = Math.floor(idx / questionsPerPage.value) + 1
  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  $toast.info(`已定位到第 ${idx + 1} 题（尚未作答）`, '还有题目未完成')
  return true
}

// 提交按钮文案与可点击性：一页一题时允许点击以定位漏答，多题模式保持原有禁用逻辑
const submitButtonText = computed(() => {
  if (isSubmitting.value) return '提交中…'
  if (isComplete.value) return '提交测评'
  return `还需完成 ${remainingCount.value} 题`
})
const canClickSubmit = computed(() => {
  if (isSubmitting.value) return false
  return isComplete.value || isOnePerPage.value
})
function onSubmitClick() {
  if (isComplete.value) {
    submitTest()
    return
  }
  if (!goToFirstUnanswered()) {
    $toast.warning(`请完成所有题目后再提交（还剩 ${remainingCount.value} 题）`, '提示')
  }
}

// 分页导航函数
function nextPage() {
  cancelAutoAdvance()
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else if (!isCurrentPageComplete.value) {
    $toast.warning(`请先完成当前页的所有题目（第${currentPage.value}页）再继续`, '提示')
  }
}

function prevPage() {
  cancelAutoAdvance()
  if (currentPage.value > 1) {
    currentPage.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    goBack()
  }
}

// 跳转页码输入框
const jumpPage = ref(1)

// 跳转到指定页面的函数
const jumpToPage = () => {
  cancelAutoAdvance()
  let targetPage = jumpPage.value
  if (isNaN(targetPage)) targetPage = 1
  targetPage = Math.max(1, Math.min(totalPages.value, targetPage))

  if (targetPage === currentPage.value) {
    // 同一页，不做处理
    return
  }

  // 执行跳转
  currentPage.value = targetPage
  jumpPage.value = targetPage
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const goToPage = (page: number) => {
  if (page === -1) return
  if (page === currentPage.value) return

  cancelAutoAdvance()
  currentPage.value = page
  jumpPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 监听当前页变化，同步 jumpPage
watch(currentPage, (newPage) => {
  jumpPage.value = newPage
})

// 退出确认
// 跳转到互补量表（如多维自评 → 解离量表）
function goRelatedTest(id: string) {
  if (!id) return
  router.push(`/test/${id}`)
}

function goBack() {
  if (answeredCount.value > 0 && !isComplete.value) {
    $confirm({
      title: '确认退出',
      message: '您有未完成的测评，确定要退出吗？您的进度会自动保存，下次可以继续答题。',
      onConfirm: () => {
        router.push('/')
      }
    })
  } else {
    router.push('/')
  }
}

// 提交测评
async function submitTest() {
  if (isSubmitting.value) return
  if (!isComplete.value) {
    $toast.warning(`请完成所有题目后再提交（还剩 ${remainingCount.value} 题）`, '提示')
    return
  }

  // SIOSS 等高敏感量表：提交前正式确认，提示作答环境与如实作答
  if (isFormalTest.value) {
    $confirm({
      title: '郑重 · 确认提交测评',
      message:
        '请确认：\n\n· 您已在私密、安全的环境下凭真实感受作答；\n· 您理解掩饰（测谎）分偏高会让结果失真，并可能让您错失及时帮助；\n· 您已知悉下方全国心理援助热线：\n  —— 12356（24 小时，免费）\n  —— 希望 24 热线 400-161-9995\n  —— 北京心理危机研究与干预中心 010-82951332\n\n提交后系统将立即给出筛查结果。无论结果如何，如有持续痛苦或出现结束生命的念头，请立即寻求专业帮助。',
      confirmText: '确认提交',
      cancelText: '再检查一下',
      onConfirm: async () => {
        await doSubmit()
      }
    })
    return
  }

  $confirm({
    title: '确认提交',
    message: '确定要提交测评吗？提交后将无法修改答案。',
    onConfirm: async () => {
      await doSubmit()
    }
  })
}

// 实际执行提交
async function doSubmit() {
  if (isSubmitting.value) return
  isSubmitting.value = true
  try {
    $toast.info('正在提交中，请稍候...', '提交中')

    const submitBody: any = {
      testId,
      answers: answers.value,
    }
    // 多维自评量表：带回评估模式、种子与出题凭证，服务端据此复现同一套题目再做校验
    if (isMultidim.value) {
      submitBody.mode = selectedMode.value
      submitBody.seed = effectiveSeed.value || undefined
      if (questionToken.value) submitBody.questionToken = questionToken.value
    }
    // 幂等键：同一次测评重复提交（双击、超时重试）只结算一次
    submitBody.submissionId = submissionId
    submitBody.respondent = respondent.value

    const result = await $fetch('/api/submit', {
      method: 'POST',
      body: submitBody
    })

    if (result?.success) {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(`test_${testId}_answers`)
        // 清除进度元数据：提交后重新进入应重新选择模式，而不是续答旧题集
        sessionStorage.removeItem(`test_${testId}_total`)
        sessionStorage.removeItem(`test_${testId}_mode`)
        sessionStorage.removeItem(`test_${testId}_seed`)
        window.dispatchEvent(new CustomEvent('refreshProgress'))
        window.dispatchEvent(new CustomEvent('newResult'))  // 触发新结果事件
      }
      storedMode.value = ''
      storedSeed.value = ''

      answerStore.clearAnswers()

      // 结果写入本机存档（一次测评一条记录），带上记录键跳转，
      // 刷新结果页时仍定位到本次记录，而不是笼统的「最近一次结果」
      const recordKey = answerStore.setResult(result.data)

      $toast.success('测评提交成功！', '完成')
      await router.push(recordKey ? { path: '/result', query: { key: recordKey } } : '/result')
    }
  } catch (error: any) {
    console.error('提交失败', error)
    $toast.error(
      error?.data?.statusMessage || error?.data?.message || '提交失败，请稍后重试',
      '错误',
    )
  } finally {
    isSubmitting.value = false
  }
}

// 错误处理
if (error.value) {
  console.error('加载测评失败', error.value)
  router.push('/')
}

// 调试取值：单选/选项题取 options；range 滑块在 min..max 内取值（first/last/random）
function valueForQuestion(q: any, mode: "first" | "last" | "random"): number | undefined {
  if (q?.type === "range") {
    const min = typeof q.min === "number" ? q.min : 0
    const max = typeof q.max === "number" ? q.max : 10
    if (mode === "first") return min
    if (mode === "last") return max
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
  const options = q?.options
  if (options && options.length > 0) {
    let idx = 0
    if (mode === "last") idx = options.length - 1
    else if (mode === "random") idx = Math.floor(Math.random() * options.length)
    return options[idx]!.value
  }
  return undefined
}

// 快速随机完成所有题目（调试用）
const quickCompleteAll = () => {
  // 确认对话框
  $confirm({
    title: '调试模式',
    message: `确定要随机完成所有 ${totalQuestions.value} 道题目吗？此操作将覆盖已有答案。`,
    confirmText: '确定',
    cancelText: '取消',
    onConfirm: () => {
      const newAnswers: Record<number, number> = {}

      // 遍历所有题目（单选取随机选项；range 滑块取随机值）
      for (const question of allQuestions.value) {
        const v = valueForQuestion(question, "random")
        if (v !== undefined) newAnswers[question.id] = v
      }

      // 应用答案（watch(answers) 会整体同步 store 与 sessionStorage）
      answers.value = newAnswers

      // 跳转到最后一页
      currentPage.value = totalPages.value

      // 显示成功提示
      $toast.success(`已完成 ${Object.keys(newAnswers).length} 道题目（随机答案）`, '调试完成')

      // 刷新导航栏进度
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('refreshProgress'))
      }
    }
  })
}

// 调试菜单状态
const showDebugMenu = ref(false)

// 快速完成当前页
const quickCompleteCurrentPage = () => {
  const newAnswers = { ...answers.value }

  for (const question of currentPageQuestions.value) {
    const v = valueForQuestion(question, "random")
    if (v !== undefined) newAnswers[question.id] = v
  }

  answers.value = newAnswers

  $toast.success(`已完成当前页 ${currentPageQuestions.value.length} 道题目`, '调试完成')
  window.dispatchEvent(new CustomEvent('refreshProgress'))
}

// 完成当前页为特定选项（如全部选第一个）
const completeCurrentPageWithFirstOption = () => {
  const newAnswers = { ...answers.value }

  for (const question of currentPageQuestions.value) {
    const v = valueForQuestion(question, "first")
    if (v !== undefined) newAnswers[question.id] = v
  }

  answers.value = newAnswers

  $toast.success(`当前页已全部选第一个选项`, '调试完成')
}

// 完成当前页为最后一个选项
const completeCurrentPageWithLastOption = () => {
  const newAnswers = { ...answers.value }

  for (const question of currentPageQuestions.value) {
    const v = valueForQuestion(question, "last")
    if (v !== undefined) newAnswers[question.id] = v
  }

  answers.value = newAnswers

  $toast.success(`当前页已全部选最后一个选项`, '调试完成')
}
</script>