<template>
  <div class="mbti-report space-y-6">
    <section class="mbti-hero">
      <div>
        <p class="mbti-eyebrow">人格类型概览</p>
        <h1 class="mbti-type">{{ level }}</h1>
        <p class="mbti-type-name">{{ report?.typeName }}</p>
      </div>
      <div class="mbti-hero-stats">
        <div>
          <span>内在</span>
          <strong>{{ report?.innerOuterProfile?.innerType || '--' }}</strong>
        </div>
        <div>
          <span>外在</span>
          <strong>{{ report?.innerOuterProfile?.outerType || '--' }}</strong>
        </div>
        <div>
          <span>一致度</span>
          <strong>{{ report?.innerOuterProfile?.consistency ?? '--' }}%</strong>
        </div>
      </div>
    </section>

    <section class="mbti-section">
      <div class="mbti-section-head">
        <div>
          <h3>相近类型参考</h3>
          <p>根据四个维度的临界变化生成，用来观察结果附近的可能类型。</p>
        </div>
      </div>
      <div class="mbti-type-strip">
        <div v-for="(type, index) in report?.nineGrid || []" :key="type + '-' + index"
          class="mbti-type-pill" :class="{ 'is-active': type === level }">
          {{ type }}
        </div>
      </div>
    </section>

    <section class="mbti-section">
      <div class="mbti-section-head">
        <div>
          <h3>心理功能分布</h3>
          <p>自然倾向更接近自发偏好，代偿倾向更接近环境适应和应对策略。</p>
        </div>
      </div>
      <div class="grid md:grid-cols-2 gap-5">
        <div class="mbti-score-panel">
          <h4>自然倾向</h4>
          <div class="space-y-3">
            <div v-for="item in report?.functionScores?.natural || []" :key="item.code">
              <div class="mbti-score-row">
                <span>{{ item.label }}</span>
                <strong>{{ item.percent }}%</strong>
              </div>
              <div class="mbti-meter">
                <div :style="{ width: (item.percent * 4) + '%', backgroundColor: 'var(--personality)' }"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="mbti-score-panel">
          <h4>适应倾向</h4>
          <div class="space-y-3">
            <div v-for="item in report?.functionScores?.compensatory || []" :key="item.code">
              <div class="mbti-score-row">
                <span>{{ item.label }}</span>
                <strong>{{ item.percent }}%</strong>
              </div>
              <div class="mbti-meter">
                <div :style="{ width: (item.percent * 4) + '%', backgroundColor: 'var(--special)' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p class="mbti-note">{{ report?.note }}</p>
    </section>

    <section class="mbti-section">
      <div class="mbti-section-head">
        <div>
          <h3>四维偏好</h3>
          <p>每一组都表示你更习惯使用的一侧，并不代表另一侧缺失。</p>
        </div>
      </div>
      <div class="mbti-preference-list">
        <div v-for="item in report?.preferences || []" :key="item.title" class="mbti-preference-item">
          <div class="font-semibold mb-3" style="color: var(--text);">{{ item.title }}</div>
          <div class="grid md:grid-cols-2 gap-3">
            <div class="mbti-choice" :class="{ 'is-selected': isPreferenceSelected(item, 'left') }">
              <div class="font-medium" style="color: var(--text);">{{ item.left }}</div>
              <p class="text-sm mt-1" style="color: var(--text-secondary);">{{ item.leftDesc }}</p>
            </div>
            <div class="mbti-choice" :class="{ 'is-selected': isPreferenceSelected(item, 'right') }">
              <div class="font-medium" style="color: var(--text);">{{ item.right }}</div>
              <p class="text-sm mt-1" style="color: var(--text-secondary);">{{ item.rightDesc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="mbti-section">
      <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
        <div>
          <h3 class="mbti-inline-title">内在与外在性格</h3>
          <p class="mbti-soft-text">{{ report?.innerOuterProfile?.summary }}</p>
        </div>
        <div class="mbti-consistency">
          <strong>{{ report?.innerOuterProfile?.consistency }}%</strong>
          <span>{{ report?.innerOuterProfile?.status }}</span>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-3 mb-5">
        <div class="mbti-identity-box">
          <p class="text-sm mb-1" style="color: var(--text-muted);">内在性格</p>
          <div class="text-3xl font-bold" style="color: var(--text);">{{
            report?.innerOuterProfile?.innerType }}</div>
          <p class="text-sm mt-1" style="color: var(--text-secondary);">{{
            report?.innerOuterProfile?.innerTypeName }}</p>
        </div>
        <div class="mbti-identity-box">
          <p class="text-sm mb-1" style="color: var(--text-muted);">外在表现</p>
          <div class="text-3xl font-bold" style="color: var(--text);">{{
            report?.innerOuterProfile?.outerType }}</div>
          <p class="text-sm mt-1" style="color: var(--text-secondary);">{{
            report?.innerOuterProfile?.outerTypeName }}</p>
        </div>
      </div>

      <div class="space-y-3">
        <div v-for="item in report?.innerOuterProfile?.dimensions || []" :key="item.key"
          class="mbti-inner-row">
          <div class="flex items-center justify-between gap-3 mb-3">
            <div>
              <div class="font-semibold" style="color: var(--text);">{{ item.title }}</div>
              <p class="text-xs" style="color: var(--text-muted);">{{ item.left }} / {{ item.right }}</p>
            </div>
            <span class="text-xs px-2 py-1 rounded-full"
              :style="{ backgroundColor: item.aligned ? 'var(--primary-light)' : 'var(--warning-bg)', color: item.aligned ? 'var(--personality)' : 'var(--warning-text)' }">
              {{ item.aligned ? '一致' : '有差异' }}
            </span>
          </div>
          <div class="grid md:grid-cols-2 gap-3">
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span style="color: var(--text-secondary);">内在 {{ item.innerLetter }}</span>
                <span style="color: var(--text-muted);">{{ item.innerPercent }}%</span>
              </div>
              <div class="mbti-meter">
                <div :style="{ width: item.innerPercent + '%', backgroundColor: 'var(--personality)' }"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span style="color: var(--text-secondary);">外在 {{ item.outerLetter }}</span>
                <span style="color: var(--text-muted);">{{ item.outerPercent }}%</span>
              </div>
              <div class="mbti-meter">
                <div :style="{ width: item.outerPercent + '%', backgroundColor: 'var(--special)' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="mbti-section">
      <h3 class="mbti-inline-title">环境适应方式</h3>
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <div class="text-2xl font-bold" style="color: var(--text);">{{ report?.mask?.name }}</div>
          <p class="mt-2" style="color: var(--text-secondary);">你在现阶段更容易调用的应对方式</p>
        </div>
        <div class="grid grid-cols-2 gap-3 text-center">
          <div class="mbti-mini-stat">
            <div class="text-xl font-bold" style="color: var(--text);">{{ report?.mask?.rarity }}</div>
            <div class="text-xs" style="color: var(--text-muted);">{{ level }}占比</div>
          </div>
          <div class="mbti-mini-stat">
            <div class="text-xl font-bold" style="color: var(--text);">{{ report?.mask?.maskRatio }}</div>
            <div class="text-xs" style="color: var(--text-muted);">适应方式占比</div>
          </div>
        </div>
      </div>
    </section>

    <section class="mbti-section">
      <h3 class="mbti-inline-title">结果说明</h3>
      <div class="space-y-4">
        <div v-for="section in mbtiProfileSections" :key="section.title">
          <h4 class="font-semibold mb-1" style="color: var(--text);">{{ section.title }}</h4>
          <p style="color: var(--text-secondary);">{{ section.text }}</p>
        </div>
      </div>
    </section>

    <section class="mbti-section">
      <h3 class="mbti-inline-title">人格构成</h3>
      <div class="grid md:grid-cols-2 gap-4">
        <div v-for="role in report?.functionStack?.roles || []" :key="role.title" class="mbti-role-box">
          <p class="text-sm" style="color: var(--text-muted);">{{ role.title }} | {{ role.subtitle }}</p>
          <div class="text-2xl font-bold my-2" style="color: var(--text);">{{ role.label }}{{ role.function }}
          </div>
          <p class="text-sm mb-2" style="color: var(--text-secondary);">{{ role.description }}</p>
          <p class="text-sm font-medium" style="color: var(--personality);">它关心的是：{{ role.question }}</p>
        </div>
      </div>
    </section>

    <section class="mbti-section">
      <h3 class="mbti-inline-title">阅读提示</h3>
      <p class="whitespace-pre-line" style="color: var(--text-secondary);">{{ mbtiUnderstanding }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ report: any; level: string }>()

const mbtiProfileSections = computed(() => {
  const profile = props.report?.profile
  if (!profile) return []
  return [
    { title: '关于你', text: profile.about },
    { title: '构想与执行', text: profile.execution },
    { title: '让远见贴近内心', text: profile.inner },
    { title: '隐藏的另一面', text: profile.hidden },
    { title: '面具与人格', text: profile.mask },
  ]
})

const mbtiUnderstanding = '一、实验背景\n我们聚焦的是心理能量层面的动力与阻力，会允许每个人的阴影功能呈现“投射后的形状”。因此，部分非阶梯状的八维分布是预期内的可能性。\n\n二、八维得分可以如何解读？\n重要：所有分数的高低都与认知能力以及发展水平无关。自然状态更接近人格底色，代偿状态更接近外界需要、自我保护、训练经历或情境代入。\n\n三、可能的误测原因\n1. 因为明显不认同一边，而强烈选择了另一边并不完全认同的选项。\n2. 近期状态较为特殊，很难区分自己的内在需求和环境的需求。\n3. 基于“我是否可以这样”作答，而没有基于“这是否完全是我”来考虑。\n\n四、九宫格是什么\n九宫格采用九种不同的人格算法进行综合比对，得出最可能的人格类型。\n\n五、人格面具与人格的关系\n人格面具代表现阶段想成为的样子，它与真我人格以及八维分布之间没有必然联系，也可能随着心境与环境发生变化。'

const isPreferenceSelected = (item: any, side: 'left' | 'right') => {
  const firstLetters: Record<'left' | 'right', string[]> = {
    left: ['E', 'S', 'T', 'J'],
    right: ['I', 'N', 'F', 'P'],
  }
  return firstLetters[side].includes(item.selected)
}
</script>

<style scoped>
.mbti-report { color: var(--text); }
.mbti-hero, .mbti-section { border: 1px solid var(--border); border-radius: 12px; background: var(--card-bg); }
.mbti-hero { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 24px; align-items: end; padding: 28px; background: linear-gradient(135deg, rgba(123,107,142,0.12), rgba(94,140,111,0.08)), var(--card-bg); }
.mbti-eyebrow { margin-bottom: 10px; color: var(--text-muted); font-size: 13px; }
.mbti-type { color: var(--text); font-size: clamp(56px, 12vw, 104px); font-weight: 800; line-height: 0.92; letter-spacing: 0; }
.mbti-type-name { margin-top: 14px; color: var(--text-secondary); font-size: 16px; }
.mbti-hero-stats { display: grid; grid-template-columns: repeat(3, minmax(82px, 1fr)); gap: 10px; }
.mbti-hero-stats div, .mbti-mini-stat, .mbti-identity-box, .mbti-score-panel, .mbti-role-box, .mbti-inner-row, .mbti-preference-item { border: 1px solid var(--border); border-radius: 10px; background: var(--card-bg); }
.mbti-hero-stats div { padding: 12px; text-align: center; }
.mbti-hero-stats span, .mbti-consistency span { display: block; color: var(--text-muted); font-size: 12px; }
.mbti-hero-stats strong { display: block; margin-top: 4px; color: var(--text); font-size: 20px; }
.mbti-section { padding: 22px; }
.mbti-section-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 18px; }
.mbti-section-head h3, .mbti-inline-title { margin: 0; color: var(--text); font-size: 18px; font-weight: 700; }
.mbti-section-head p, .mbti-soft-text, .mbti-note { color: var(--text-secondary); font-size: 14px; }
.mbti-type-strip { display: grid; grid-template-columns: repeat(9, minmax(0, 1fr)); gap: 8px; }
.mbti-type-pill { min-height: 44px; border: 1px solid var(--border); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: var(--text-secondary); background: var(--bg); font-weight: 700; }
.mbti-type-pill.is-active { border-color: var(--personality); color: #fff; background: var(--personality); }
.mbti-score-panel, .mbti-preference-item, .mbti-inner-row, .mbti-role-box { padding: 16px; }
.mbti-score-panel h4 { margin-bottom: 14px; color: var(--text); font-weight: 700; }
.mbti-score-row { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 5px; color: var(--text-secondary); font-size: 14px; }
.mbti-score-row strong { color: var(--text); font-weight: 700; }
.mbti-meter { height: 8px; overflow: hidden; border-radius: 999px; background: var(--primary-light); }
.mbti-meter div { height: 100%; border-radius: inherit; }
.mbti-note { margin-top: 16px; }
.mbti-preference-list { display: grid; gap: 14px; }
.mbti-choice { border: 1px solid var(--border); border-radius: 10px; padding: 13px; background: transparent; }
.mbti-choice.is-selected { border-color: var(--personality); background: var(--personality-light); }
.mbti-consistency { min-width: 132px; border: 1px solid var(--border); border-radius: 10px; padding: 12px; background: var(--personality-light); text-align: center; }
.mbti-consistency strong { display: block; color: var(--personality); font-size: 24px; line-height: 1; }
.mbti-identity-box, .mbti-mini-stat { padding: 14px; }
@media (max-width: 768px) {
  .mbti-hero { grid-template-columns: 1fr; padding: 22px; }
  .mbti-hero-stats, .mbti-type-strip { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
</style>
