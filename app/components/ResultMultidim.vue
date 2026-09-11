<template>
  <div v-if="report" class="md-report">
    <!-- 报告抬头：薄荷→天空渐变 -->
    <header class="md-hero">
      <div class="md-hero-top">
        <span class="md-hero-kicker">MULTIDIMENSIONAL SELF-ASSESSMENT</span>
        <span class="md-hero-badge">V2.2 · {{ report.modeName || '标准评估' }}</span>
      </div>
      <h3 class="md-hero-title">心理健康多维自评量表</h3>
      <p class="md-hero-sub">{{ report.summary.level }} · 覆盖 20 个核心特征维度</p>
      <div class="md-hero-meta">
        <span class="md-meta-chip">🕒 {{ formattedTime }}</span>
        <span class="md-meta-chip">📝 {{ answeredCount }} 题</span>
        <span class="md-meta-chip">{{ report.confidence.label }}</span>
        <span v-if="report.credibility" class="md-meta-chip">{{ report.credibility.level }}</span>
      </div>
    </header>

    <!-- 安全提示（自伤 / 幻觉信号） -->
    <section v-if="report.severeSignals.length" class="md-alert md-alert--danger">
      <div class="md-alert-head">
        <span class="md-alert-seal">请优先处理</span>
        <b>本次回答包含需要重视的安全信号</b>
      </div>
      <p class="md-alert-body">
        您回答中出现了 <b>{{ report.severeSignals.join("、") }}</b> 相关信号。请立即联系信任的亲友，
        或拨打全国统一心理援助热线 <a href="tel:12356">12356</a>（24 小时、免费）；若念头强烈或已有具体计划，
        请拨打 <a href="tel:120">120</a> 或前往就近医院急诊，并尽快安排精神科评估。
      </p>
    </section>

    <!-- 评估摘要 -->
    <section class="md-card">
      <h4 class="md-card-title">评估摘要</h4>
      <div class="md-summary-grid">
        <div class="md-summary-cell">
          <span class="md-summary-label">总体信号强度</span>
          <span class="md-summary-value" :class="`sv-${report.summary.levelKind}`">{{ report.summary.level }}</span>
        </div>
        <div class="md-summary-cell">
          <span class="md-summary-label">主要特征方向</span>
          <span class="md-summary-value sv-plain">{{ report.summary.traitsText }}</span>
        </div>
        <div class="md-summary-cell">
          <span class="md-summary-label">安全信号</span>
          <span class="md-summary-value" :class="`sv-${report.summary.severeKind}`">{{ report.summary.severeText }}</span>
        </div>
        <div class="md-summary-cell">
          <span class="md-summary-label">参考匹配</span>
          <span class="md-summary-value sv-plain">{{ report.summary.matchText }}</span>
        </div>
      </div>
      <p class="md-summary-note">{{ report.summary.note }}</p>
    </section>

    <!-- 回答一致性偏低提示 -->
    <div v-if="report.credibility && report.credibility.rate < 0.5" class="md-alert md-alert--warn">
      回答一致性偏低：您对同一特征的两次表述回答差异较大（一致率
      {{ Math.round(report.credibility.rate * 100) }}%，{{ report.credibility.consistent }}/{{ report.credibility.total }} 对）。
      请尽量如实、稳定地作答，结果才更具参考价值。
    </div>

    <!-- 作答效度 -->
    <section v-if="report.lie" class="md-card">
      <div class="md-lie-row">
        <span class="md-card-title" style="margin:0;">作答效度</span>
        <span class="md-lie-level" :class="{ 'is-alert': report.lie.alert }">{{ report.lie.level }}</span>
      </div>
      <p class="md-lie-detail">{{ report.lie.detail }}</p>
    </section>

    <!-- 主要特征方向 -->
    <section v-if="report.topTraits.length" class="md-chips">
      <span class="md-chips-label">主要特征方向</span>
      <span v-for="t in report.topTraits" :key="t" class="md-chip">{{ t }}</span>
    </section>

    <!-- 参考方向匹配 -->
    <section class="md-card">
      <h4 class="md-card-title">参考方向匹配</h4>
      <div v-if="report.isNormal" class="md-ok">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" /><path d="m8.5 12.5 2.5 2.5 5-5.5" />
        </svg>
        <div>
          <b>评估结果良好</b>
          <p>未发现达到提示标准的需要关注的特征信号，请保持良好生活节律。</p>
        </div>
      </div>
      <template v-else>
        <p class="md-card-hint">
          以下方向的特征吻合度达到提示阈值（≥40%），数值越高代表您的回答与该方向的特征画像越接近，仅供自我了解参考。
        </p>
        <div class="md-match-list">
          <article v-for="m in report.matches" :key="m.id" class="md-match" :class="{ 'is-severe': m.severe }">
            <span class="md-rank" :class="`r${m.rank}`">{{ m.rank }}</span>
            <div class="md-match-main">
              <div class="md-match-name">
                {{ m.name }}
                <span v-if="m.severe" class="md-tag md-tag--severe">信号较强</span>
                <span v-else class="md-tag">相关特征方向</span>
              </div>
              <p class="md-match-desc">{{ m.desc }}</p>
              <p v-if="m.reasons.length" class="md-match-reason">
                <span class="md-reason-label">匹配依据</span>{{ m.reasons.join("、") }}
              </p>
            </div>
            <span class="md-match-score">{{ m.score }}%</span>
            <div class="md-bar"><div class="md-bar-fill" :style="{ width: `${m.score}%` }"></div></div>
          </article>
        </div>
      </template>
    </section>

    <!-- 特征强度总览 -->
    <section class="md-card">
      <h4 class="md-card-title">20 项特征强度总览</h4>
      <p class="md-card-hint">条形长度代表该特征的相对信号强度，数值范围 -1.00 ~ +1.00。</p>
      <p v-if="report.traitStatsText" class="md-stats">{{ report.traitStatsText }}</p>
      <div class="md-traits">
        <div v-for="row in report.traits" :key="row.trait" class="md-trait">
          <span class="md-trait-name">{{ row.label }}</span>
          <div class="md-trait-bar">
            <div class="md-trait-fill" :class="`lv-${row.levelKind}`" :style="{ width: `${row.noData ? 0 : row.width}%` }"></div>
          </div>
          <span class="md-trait-score">{{ row.display }}</span>
          <span class="md-trait-level" :class="`lv-${row.levelKind}`">{{ row.level }}</span>
        </div>
      </div>
    </section>

    <!-- 特征剖面雷达图 -->
    <section class="md-card md-radar-card">
      <h4 class="md-card-title">特征剖面雷达图</h4>
      <p class="md-card-hint">蓝色区域为正向信号，灰色虚线为负向（否认 / 未见异常）信号。</p>
      <div class="md-radar">
        <svg :viewBox="`0 0 ${radar.size} ${radar.size}`" role="img" aria-label="20 维度特征剖面雷达图">
          <circle v-for="(g, i) in radar.grid" :key="`g${i}`" class="md-grid" :cx="radar.cx" :cy="radar.cy" :r="g" />
          <line v-for="(a, i) in radar.axes" :key="`a${i}`" class="md-axis" :x1="radar.cx" :y1="radar.cy" :x2="a.x2" :y2="a.y2" />
          <text v-for="(a, i) in radar.axes" :key="`t${i}`" class="md-axis-label" :x="a.tx" :y="a.ty"
            text-anchor="middle" :transform="`rotate(${a.rot} ${a.tx} ${a.ty})`">{{ a.label }}</text>
          <polygon class="md-poly-neg" :points="radar.negPoints" />
          <polygon class="md-poly-pos" :points="radar.posPoints" />
          <circle v-for="(d, i) in radar.posDots" :key="`pd${i}`" class="md-dot-pos" :cx="d.x" :cy="d.y" r="2.4" />
          <circle v-for="(d, i) in radar.negDots" :key="`nd${i}`" class="md-dot-neg" :cx="d.x" :cy="d.y" r="2" />
        </svg>
      </div>
    </section>

    <!-- 专业建议 -->
    <section class="md-card md-advice">
      <h4 class="md-card-title">专业建议</h4>

      <div class="md-advice-block">
        <h5 class="md-advice-sub">总体建议</h5>
        <p class="md-advice-text" :class="`a-${report.advice.overallKind}`">{{ report.advice.overall }}</p>
      </div>

      <div v-if="report.advice.targeted.length" class="md-advice-block">
        <h5 class="md-advice-sub">针对性建议</h5>
        <ul class="md-advice-list">
          <li v-for="item in report.advice.targeted" :key="item.trait" :class="{ 'is-severe': item.severe }">
            <b>{{ item.label }}：</b>{{ item.text }}
          </li>
        </ul>
      </div>

      <div class="md-advice-block">
        <h5 class="md-advice-sub">日常建议</h5>
        <ul class="md-advice-list">
          <li v-for="(item, i) in report.advice.daily" :key="`d${i}`">{{ item }}</li>
        </ul>
      </div>

      <div class="md-advice-block">
        <h5 class="md-advice-sub">复测建议</h5>
        <p class="md-advice-followup">{{ report.advice.followUp }}</p>
      </div>

      <p class="md-advice-note">{{ report.advice.note }}</p>
    </section>

    <p class="md-disclaimer">
      <b>重要提示：</b>本量表没有相关文献支持，也未经过实验或临床测试，不具备心理测量学验证，
      请勿将其结果当作临床诊断或筛查结论。各维度及分级仅用于描述本次自评中的相对特征信号，
      不等同于经过临床验证的诊断标准。本工具仅供娱乐与自我了解参考（科普教育用途），
      不构成临床诊断，不能替代专业医疗。如困扰持续存在，请咨询精神科或心理专业人员。
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  report: any;
  result?: any;
}>();

const formattedTime = computed(() => {
  const ts = props.result?.timestamp;
  return ts ? new Date(ts).toLocaleString("zh-CN") : "—";
});

const answeredCount = computed(() => {
  const answers = props.result?.answers;
  return answers && typeof answers === "object" ? Object.keys(answers).length : 65;
});

// 特征剖面雷达图：20 维度，正向为实心区域、负向为灰色虚线
const radar = computed(() => {
  const rows: any[] = props.report?.traits || [];
  const n = rows.length || 20;
  const size = 380;
  const cx = size / 2;
  const cy = size / 2 + 4;
  const R = 132;
  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const px = (i: number, r: number) => cx + Math.cos(angle(i)) * r;
  const py = (i: number, r: number) => cy + Math.sin(angle(i)) * r;

  const grid = [1, 2, 3, 4].map((g) => (R * g) / 4);

  const axes = rows.map((row, i) => {
    const tx = cx + Math.cos(angle(i)) * (R + 20);
    const ty = cy + Math.sin(angle(i)) * (R + 20);
    let rot = (angle(i) * 180) / Math.PI + 90;
    if (rot > 90 && rot < 270) rot += 180;
    return { x2: px(i, R), y2: py(i, R), tx, ty, rot, label: row.label };
  });

  const posPts: string[] = [];
  const negPts: string[] = [];
  const posDots: Array<{ x: number; y: number }> = [];
  const negDots: Array<{ x: number; y: number }> = [];

  rows.forEach((row, i) => {
    const s: number = row.noData ? 0 : row.value || 0;
    if (!s) {
      posPts.push(`${px(i, 0)},${py(i, 0)}`);
      negPts.push(`${px(i, 0)},${py(i, 0)}`);
      return;
    }
    const r = Math.min(Math.abs(s), 1) * R;
    if (s > 0) {
      posPts.push(`${px(i, r)},${py(i, r)}`);
      negPts.push(`${px(i, 0)},${py(i, 0)}`);
      posDots.push({ x: px(i, r), y: py(i, r) });
    } else {
      negPts.push(`${px(i, r)},${py(i, r)}`);
      posPts.push(`${px(i, 0)},${py(i, 0)}`);
      negDots.push({ x: px(i, r), y: py(i, r) });
    }
  });

  return {
    size,
    cx,
    cy,
    grid,
    axes,
    posPoints: posPts.join(" "),
    negPoints: negPts.join(" "),
    posDots,
    negDots,
  };
});
</script>

<style scoped>
/* ===== 新风格：治愈系「薄荷 → 天空蓝」报告 ===== */
/* 主题色变量定义在组件外层的全局样式块中，亮/暗两套通过 :root 与
   html[data-theme="dark"] 级联，组件内只消费变量。 */
.md-report {
  text-align: left;
}

/* 抬头 */
.md-hero {
  position: relative;
  overflow: hidden;
  border-radius: var(--md-radius);
  padding: 22px 24px;
  margin-bottom: 16px;
  color: #fff;
  background: var(--md-grad);
  box-shadow: 0 10px 28px rgba(47, 158, 131, 0.22);
}

.md-hero::after {
  content: "";
  position: absolute;
  right: -60px;
  top: -80px;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.14);
}

.md-hero-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 8px;
}

.md-hero-kicker {
  font-size: 0.625rem;
  letter-spacing: 0.22em;
  opacity: 0.85;
}

.md-hero-badge {
  font-size: 0.6875rem;
  font-weight: var(--fw-semibold);
  padding: 2px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.55);
  background: rgba(255, 255, 255, 0.16);
  white-space: nowrap;
}

.md-hero-title {
  font-size: 1.375rem;
  font-weight: var(--fw-bold);
  letter-spacing: 0.02em;
  margin: 0 0 4px;
}

.md-hero-sub {
  font-size: 0.8125rem;
  opacity: 0.92;
  margin: 0 0 12px;
}

.md-hero-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.md-meta-chip {
  font-size: 0.71875rem;
  padding: 3px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.28);
  font-variant-numeric: tabular-nums;
}

/* 卡片 */
.md-card {
  background: var(--md-surface);
  border: 1px solid var(--md-line);
  border-radius: var(--md-radius);
  padding: 16px 18px;
  margin-bottom: 14px;
  box-shadow: 0 2px 10px rgba(47, 100, 90, 0.05);
}

.md-card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9375rem;
  font-weight: var(--fw-bold);
  color: var(--md-ink);
  margin: 0 0 12px;
}

.md-card-title::before {
  content: "";
  width: 4px;
  height: 15px;
  border-radius: 3px;
  background: var(--md-grad);
}

.md-card-hint {
  font-size: 0.78125rem;
  color: var(--md-ink-faint);
  line-height: 1.6;
  margin: 0 0 10px;
}

/* 摘要 */
.md-summary-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 12px;
}

@media (min-width: 640px) {
  .md-summary-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}

.md-summary-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 12px;
  border-radius: 10px;
  background: linear-gradient(160deg, var(--md-mint-soft), var(--md-sky-soft));
  border: 1px solid var(--md-line);
}

.md-summary-label {
  font-size: 0.6875rem;
  color: var(--md-ink-faint);
}

.md-summary-value {
  font-size: 0.84375rem;
  font-weight: var(--fw-bold);
  line-height: 1.45;
  color: var(--md-ink-soft);
}

.md-summary-value.sv-ok { color: var(--md-ok); }
.md-summary-value.sv-warn { color: var(--md-warn); }
.md-summary-value.sv-severe { color: var(--md-severe); }
.md-summary-value.sv-plain { font-weight: var(--fw-semibold); }

.md-summary-note {
  font-size: 0.78125rem;
  line-height: 1.7;
  color: var(--md-ink-soft);
  background: var(--md-sky-soft);
  border-left: 3px solid var(--md-sky);
  border-radius: 0 10px 10px 0;
  padding: 9px 12px;
  margin: 0;
}

/* 提示条 */
.md-alert {
  border-radius: 12px;
  padding: 12px 14px;
  margin-bottom: 14px;
  font-size: 0.8125rem;
  line-height: 1.7;
}

.md-alert--danger {
  background: var(--danger-light);
  border: 1px solid var(--danger-border);
  color: var(--danger-dark);
}

.md-alert--warn {
  background: var(--warning-bg);
  border: 1px solid var(--warning-border);
  color: var(--warning-text);
}

.md-alert-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.md-alert-seal {
  font-size: 0.6875rem;
  font-weight: var(--fw-bold);
  letter-spacing: 0.08em;
  padding: 2px 8px;
  border-radius: 6px;
  background: var(--danger);
  color: #fff;
}

.md-alert-body { margin: 0; }
.md-alert-body a { color: inherit; font-weight: var(--fw-bold); text-decoration: underline; }

/* 效度 */
.md-lie-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 6px;
}

.md-lie-level {
  font-size: 0.75rem;
  font-weight: var(--fw-bold);
  padding: 3px 10px;
  border-radius: 999px;
  color: #2f8f6b;
  background: var(--md-mint-soft);
  border: 1px solid var(--md-mint);
}

.md-lie-level.is-alert {
  color: #fff;
  background: #c0453d;
  border-color: #c0453d;
}

.md-lie-detail {
  margin: 0;
  font-size: 0.78125rem;
  line-height: 1.7;
  color: var(--md-ink-soft);
}

/* 特征 chips */
.md-chips {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
}

.md-chips-label {
  font-size: 0.75rem;
  color: var(--md-ink-faint);
}

.md-chip {
  font-size: 0.78125rem;
  font-weight: var(--fw-semibold);
  color: var(--md-mint);
  background: var(--md-mint-soft);
  border: 1px solid var(--md-mint);
  border-radius: 999px;
  padding: 3px 12px;
}

/* 结果正常 */
.md-ok {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 12px;
  background: var(--md-mint-soft);
  border: 1px solid var(--md-mint);
}

.md-ok svg { width: 26px; height: 26px; color: var(--md-mint); flex-shrink: 0; }
.md-ok b { font-size: 0.9375rem; color: var(--md-mint); }
.md-ok p { margin: 4px 0 0; font-size: 0.78125rem; color: var(--md-ink-soft); line-height: 1.6; }

/* 参考方向匹配 */
.md-match-list { display: flex; flex-direction: column; gap: 10px; }

.md-match {
  position: relative;
  display: grid;
  grid-template-columns: 34px 1fr auto;
  grid-template-areas:
    "rank main score"
    "bar bar bar";
  gap: 6px 12px;
  align-items: center;
  padding: 14px 16px 12px;
  border-radius: 14px;
  background: var(--md-surface);
  border: 1px solid var(--md-line);
  box-shadow: 0 4px 14px rgba(47, 100, 90, 0.06);
  transition: transform 0.18s ease-out, box-shadow 0.18s ease-out;
}

.md-match:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(47, 100, 90, 0.12);
}

.md-match.is-severe {
  border-color: var(--danger-border);
  background: var(--danger-light);
}

.md-rank {
  grid-area: rank;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9375rem;
  font-weight: var(--fw-bold);
  color: #fff;
  background: var(--md-grad);
}

.md-rank.r2 { background: linear-gradient(135deg, #57a9a0, #6fa9cc); }
.md-rank.r3 { background: linear-gradient(135deg, #8fc0b8, #a3c6dd); }

.md-match-main { grid-area: main; min-width: 0; }

.md-match-name {
  font-size: 0.90625rem;
  font-weight: var(--fw-bold);
  color: var(--md-ink);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.md-match.is-severe .md-match-name { color: var(--danger); }

.md-tag {
  font-size: 0.65625rem;
  font-weight: var(--fw-semibold);
  color: var(--md-ink-faint);
  border: 1px solid var(--md-line);
  border-radius: 6px;
  padding: 1px 6px;
}

.md-tag--severe {
  color: var(--danger);
  border-color: var(--danger-border);
  background: var(--danger-light);
}

.md-match-desc {
  margin: 3px 0 0;
  font-size: 0.78125rem;
  color: var(--md-ink-faint);
  line-height: 1.55;
}

.md-match-reason {
  margin: 6px 0 0;
  font-size: 0.78125rem;
  color: var(--md-ink-soft);
  line-height: 1.6;
}

.md-reason-label {
  display: inline-block;
  margin-right: 6px;
  padding: 1px 8px;
  border-radius: 6px;
  font-size: 0.6875rem;
  font-weight: var(--fw-semibold);
  color: var(--md-sky);
  background: var(--md-sky-soft);
  border: 1px solid var(--md-sky);
}

.md-match-score {
  grid-area: score;
  font-size: 1.0625rem;
  font-weight: var(--fw-bold);
  color: var(--md-sky);
  font-variant-numeric: tabular-nums;
}

.md-match.is-severe .md-match-score { color: var(--danger); }

.md-bar {
  grid-area: bar;
  height: 6px;
  border-radius: 999px;
  background: var(--md-mint-soft);
  overflow: hidden;
  margin-top: 8px;
}

.md-bar-fill {
  height: 100%;
  border-radius: 999px;
  background: var(--md-grad);
  animation: mdGrow 0.7s ease-out both;
}

.md-match.is-severe .md-bar-fill { background: linear-gradient(135deg, #d2675e, #c0453d); }

/* 特征总览 */
.md-stats {
  margin: 0 0 10px;
  font-size: 0.75rem;
  color: var(--md-ink-soft);
  background: var(--md-mint-soft);
  border: 1px dashed var(--md-mint);
  border-radius: 10px;
  padding: 7px 12px;
  line-height: 1.6;
}

.md-traits { display: flex; flex-direction: column; }

.md-trait {
  display: grid;
  grid-template-columns: 88px 1fr 52px 62px;
  gap: 10px;
  align-items: center;
  padding: 7px 2px;
  border-bottom: 1px solid var(--md-line);
  font-size: 0.78125rem;
}

.md-trait:last-child { border-bottom: none; }

.md-trait-name {
  font-weight: var(--fw-semibold);
  color: var(--md-ink-soft);
  font-size: 0.75rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.md-trait-bar {
  height: 8px;
  border-radius: 999px;
  background: var(--md-mint-soft);
  overflow: hidden;
}

.md-trait-fill {
  height: 100%;
  border-radius: 999px;
  animation: mdGrow 0.7s ease-out both;
}

.md-trait-fill.lv-none { background: var(--md-mint); }
.md-trait-fill.lv-mild { background: linear-gradient(90deg, #6fb8d8, var(--md-sky)); }
.md-trait-fill.lv-moderate { background: linear-gradient(90deg, #e0b062, #c98a2a); }
.md-trait-fill.lv-severe,
.md-trait-fill.lv-extreme { background: linear-gradient(90deg, #d2675e, #b23b34); }

.md-trait-score {
  text-align: right;
  color: var(--md-ink-faint);
  font-size: 0.71875rem;
  font-variant-numeric: tabular-nums;
}

.md-trait-level {
  text-align: center;
  font-size: 0.65625rem;
  font-weight: var(--fw-bold);
  padding: 2px 4px;
  border-radius: 6px;
  white-space: nowrap;
}

.md-trait-level.lv-none { color: var(--md-mint); background: var(--md-mint-soft); border: 1px solid var(--md-mint); }
.md-trait-level.lv-mild { color: var(--md-sky); background: var(--md-sky-soft); border: 1px solid var(--md-sky); }
.md-trait-level.lv-moderate { color: #b07a1f; background: var(--warning-bg); border: 1px solid #d8b06a; }
.md-trait-level.lv-severe { color: var(--danger); background: var(--danger-light); border: 1px solid var(--danger-border); }
.md-trait-level.lv-extreme { color: #fff; background: #b23b34; border: 1px solid #b23b34; }

/* 雷达图 */
.md-radar { display: flex; justify-content: center; padding: 4px 0; }
.md-radar svg { width: 100%; max-width: 420px; height: auto; }

.md-grid { fill: none; stroke: var(--md-line); stroke-width: 1; }
.md-axis { stroke: var(--md-line); stroke-width: 1; }
.md-axis-label { fill: var(--md-ink-faint); font-size: 8.5px; }
.md-poly-pos { fill: var(--md-mint); fill-opacity: 0.18; stroke: var(--md-mint); stroke-width: 1.8; }
.md-poly-neg { fill: none; stroke: var(--md-ink-faint); stroke-width: 1.1; stroke-dasharray: 3 3; }
.md-dot-pos { fill: var(--md-sky); }
.md-dot-neg { fill: var(--md-ink-faint); }

/* 建议 */
.md-advice-block { margin-bottom: 14px; }
.md-advice-block:last-of-type { margin-bottom: 0; }

.md-advice-sub {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8125rem;
  font-weight: var(--fw-bold);
  color: var(--md-ink-soft);
  margin: 0 0 6px;
}

.md-advice-sub::before {
  content: "";
  width: 6px;
  height: 6px;
  border-radius: 2px;
  background: var(--md-grad);
}

.md-advice-text {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.75;
  color: var(--md-ink-soft);
  padding: 10px 12px;
  border-radius: 10px;
  background: var(--md-sky-soft);
}

.md-advice-text.a-danger {
  background: var(--danger-light);
  border: 1px solid var(--danger-border);
  color: var(--danger-dark);
}

.md-advice-list { margin: 0; padding: 0; list-style: none; }

.md-advice-list li {
  position: relative;
  padding: 3px 0 3px 16px;
  font-size: 0.8125rem;
  line-height: 1.7;
  color: var(--md-ink-soft);
}

.md-advice-list li::before {
  content: "";
  position: absolute;
  left: 2px;
  top: 11px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--md-mint);
}

.md-advice-list li.is-severe { color: var(--danger); }
.md-advice-list li.is-severe::before { background: var(--danger); }
.md-advice-list li.is-severe b { color: var(--danger); }

.md-advice-followup {
  margin: 6px 0 0;
  font-size: 0.78125rem;
  line-height: 1.7;
  color: var(--md-ink-soft);
  padding: 10px 12px;
  background: var(--md-mint-soft);
  border-left: 3px solid var(--md-mint);
  border-radius: 0 10px 10px 0;
}

.md-advice-note {
  margin: 14px 0 0;
  padding-top: 10px;
  border-top: 1px dashed var(--md-line);
  font-size: 0.71875rem;
  line-height: 1.65;
  color: var(--md-ink-faint);
}

.md-disclaimer {
  margin: 4px 0 0;
  font-size: 0.71875rem;
  line-height: 1.7;
  color: var(--md-ink-faint);
}

@keyframes mdGrow {
  from { transform: scaleX(0); transform-origin: left center; }
  to { transform: scaleX(1); transform-origin: left center; }
}

@media print {
  .md-hero { box-shadow: none; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .md-card, .md-match { break-inside: avoid; }
}
</style>

<!-- 主题色变量（全局；--md- 前缀避免与其他样式冲突）。
     亮色定义在 :root，暗色由 html[data-theme="dark"] 覆盖，组件内只消费变量。 -->
<style>
:root {
  --md-mint: #2f9e83;
  --md-sky: #3b8fc4;
  --md-mint-soft: rgba(47, 158, 131, 0.1);
  --md-sky-soft: rgba(59, 143, 196, 0.1);
  --md-grad: linear-gradient(135deg, #2f9e83 0%, #3b8fc4 100%);
  --md-ok: #2f8f6b;
  --md-warn: #b07a1f;
  --md-severe: #c0453d;
  --md-ink: var(--text);
  --md-ink-soft: var(--text-secondary);
  --md-ink-faint: var(--text-muted);
  --md-line: var(--border);
  --md-surface: var(--card-bg);
  --md-radius: 16px;
}

html[data-theme="dark"] {
  --md-mint: #6fd3b5;
  --md-sky: #74bfe8;
  --md-mint-soft: rgba(111, 211, 181, 0.14);
  --md-sky-soft: rgba(116, 191, 232, 0.14);
  --md-grad: linear-gradient(135deg, #1f7a63 0%, #28658c 100%);
  --md-ok: #6fd3b5;
  --md-warn: #e0b062;
  --md-severe: #ef8f86;
}
</style>
