<template>
  <div class="pa-psy">
    <!-- 主数字 -->
    <section class="pa-hero">
      <div class="pa-hero-main">
        <div class="pa-num">{{ report.psychAge }}<span class="pa-unit">岁</span></div>
        <div class="pa-badge">{{ report.descriptor }}</div>
      </div>
      <p class="pa-desc">{{ report.describe }}</p>
      <div class="pa-chips">
        <div class="pa-chip" v-if="report.chrono != null">
          <span class="pa-chip-k">生理年龄</span><b>{{ report.chrono }}</b>
        </div>
        <div class="pa-chip" v-if="report.diff != null">
          <span class="pa-chip-k">心理 vs 生理</span><b>{{ report.diffLabel }}</b>
        </div>
        <div class="pa-chip">
          <span class="pa-chip-k">概括值</span><b>6 维加权合成</b>
        </div>
      </div>
      <p class="pa-note">{{ report.heroNote }}</p>
    </section>

    <!-- 六维雷达 -->
    <section class="pa-card">
      <h3 class="pa-title">六维心理年龄画像</h3>
      <div class="pa-radar-wrap">
        <svg viewBox="0 0 260 260" class="pa-radar">
          <polygon :points="ringPoly()" fill="rgba(120,120,120,0.06)" stroke="var(--primary-light)" stroke-width="1"/>
          <line v-for="i in [0,1,2,3,4,5]" :key="'ax'+i" :x1="C" :y1="C" :x2="pt(i,100).x" :y2="pt(i,100).y" stroke="var(--primary-light)" stroke-width="1"/>
          <polygon :points="radarPoly()" fill="var(--pa-fill)" stroke="var(--primary)" stroke-width="2" stroke-linejoin="round"/>
        </svg>
        <span v-for="(d,i) in report.dims" :key="d.key" class="pa-radar-label" :style="labelPos(Number(i),d)">{{ d.short }}</span>
      </div>
    </section>

    <!-- 双轴象限 -->
    <section class="pa-card">
      <h3 class="pa-title">成熟度 × 少年感 双轴画像</h3>
      <p class="pa-sub">两条轴相互独立，可以同时很高——"看清世界"和"童心未泯"并不冲突。</p>
      <div class="pa-quad">
        <div class="pa-quad-plot">
          <div class="pa-quad-point" :style="qDot()"></div>
          <div class="pa-quad-l pa-q">赤子之心</div>
          <div class="pa-quad-r pa-q">世事洞明</div>
          <div class="pa-quad-bl pa-q">天真烂漫</div>
          <div class="pa-quad-br pa-q">迷航待航</div>
          <span class="pa-axis-x">认清世事 · <b>{{ report.maturity }}%</b></span>
          <span class="pa-axis-y">永葆童心 · <b>{{ report.youth }}%</b></span>
        </div>
      </div>
      <div class="pa-archetype">
        <h4 class="pa-archetype-title">{{ report.archetype.title }}</h4>
        <span class="pa-archetype-short">{{ report.archetype.short }}</span>
        <p class="pa-archetype-text">{{ report.archetype.text }}</p>
      </div>
    </section>

    <!-- 维度条形 + 逐维解析 -->
    <section class="pa-card">
      <h3 class="pa-title">逐维度解析</h3>
      <div v-for="d in report.dims" :key="d.key" class="pa-bar-block">
        <div class="pa-bar-head">
          <span class="pa-bar-name">{{ d.name }} · {{ d.short }}</span>
          <span class="pa-bar-meta">{{ d.age }} 岁 · <em :class="'pa-band-' + d.band">{{ d.bandLabel }}</em></span>
        </div>
        <div class="pa-bar-track">
          <div class="pa-bar-fill" :class="'pa-fill-' + d.band" :style="{ width: barPct(d) + '%' }"></div>
          <div class="pa-bar-marker" v-if="report.chrono != null" :style="{ left: markerPct() + '%' }" :title="'生理年龄 ' + report.chrono"></div>
        </div>
        <p class="pa-bar-about">{{ d.about }}</p>
        <p class="pa-bar-text">{{ d.bandText }}</p>
      </div>
      <div class="pa-bar-legend" v-if="report.chrono != null">竖线标记：你的生理年龄（{{ report.chrono }} 岁）</div>
    </section>

    <!-- 均衡度 -->
    <section class="pa-card">
      <h3 class="pa-title">维度均衡度</h3>
      <p class="pa-sub"><b class="pa-band-key">{{ report.balance.label }}</b> —— {{ report.balance.text }}</p>
    </section>

    <!-- 责任担当 -->
    <section class="pa-card">
      <h3 class="pa-title">担当力（不计入年龄）</h3>
      <p class="pa-sub"><b class="pa-band-key">{{ report.resLevel }}</b>（特质分 {{ report.resTrait }} / 5）</p>
      <p class="pa-note">{{ report.responsibilityNote }}</p>
    </section>

    <!-- 如何阅读 -->
    <section class="pa-card">
      <h3 class="pa-title">如何阅读这份报告</h3>
      <ol class="pa-how">
        <li v-for="(t,i) in report.howToRead" :key="'h'+i">{{ t }}</li>
      </ol>
    </section>

    <!-- 依据与文献 -->
    <section class="pa-card">
      <h3 class="pa-title">维度与文献依据</h3>
      <p class="pa-note">{{ report.basisIntro }}</p>
      <ul class="pa-refs">
        <li v-for="(r,i) in report.references" :key="'r'+i">
          <b>[{{ Number(i) + 1 }}]</b> {{ refText(r) }}
          <span class="pa-ref-note">{{ r.note }}</span>
        </li>
      </ul>
    </section>

    <p class="pa-disclaimer">{{ report.disclaimer }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ report: any }>()
const report = props.report

// 六维雷达顶点（顺序与 report.dims 一致：认知/情绪/审慎/时间观/社会/活力）
const C = 130
const R = 90
const radarVal = (d: any) => {
  const v = ((Number(d.age) || 16) - 16) / 44
  return Math.max(0, Math.min(1, v)) * 100
}
const pt = (i: number, norm: number) => {
  const r = (norm / 100) * R
  const a = ((-90 + i * 60) * Math.PI) / 180
  return { x: C + r * Math.cos(a), y: C + r * Math.sin(a) }
}
const radarPoly = () =>
  report.dims.map((d: any, i: number) => pt(i, radarVal(d)).x.toFixed(1) + ',' + pt(i, radarVal(d)).y.toFixed(1)).join(' ')
const ringPoly = () =>
  [0, 1, 2, 3, 4, 5].map((i: number) => pt(i, 100).x.toFixed(1) + ',' + pt(i, 100).y.toFixed(1)).join(' ')
const labelPos = (i: number, d: any) => {
  const p = pt(i, 126)
  return { left: p.x + 'px', top: p.y + 'px' }
}
// 双轴象限点（成熟度 x，少年感 y，左上角为原点视觉）
const qDot = () => ({ left: report.maturity + '%', top: 100 - report.youth + '%' })
// 维度条占比
const barPct = (d: any) => {
  const v = ((Number(d.age) || 16) - 16) / 44
  return Math.round(Math.max(0, Math.min(1, v)) * 100)
}
const markerPct = () => {
  const c = Number(report.chrono) || 16
  const v = (c - 16) / 44
  return Math.round(Math.max(0, Math.min(1, v)) * 100)
}
// 文献格式化
const refText = (r: any) => {
  let s = r.authors + ' (' + r.year + '). ' + r.title + '.'
  if (r.journal) s += ' ' + r.journal
  if (r.volume) s += ', ' + r.volume + (r.issue ? '(' + r.issue + ')' : '') + ':' + (r.pages || '')
  if (r.publisher) s += '. ' + r.publisher
  s += '.'
  return s
}
</script>

<style scoped>
.pa-psy { display: flex; flex-direction: column; gap: 16px; }
.pa-hero { padding: 24px; border-radius: 16px; background: linear-gradient(135deg, var(--primary), var(--special)); color: #fff; }
.pa-hero-main { display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap; }
.pa-num { font-size: 56px; font-weight: 800; line-height: 1; }
.pa-unit { font-size: 24px; margin-left: 4px; }
.pa-badge { background: rgba(255,255,255,0.22); padding: 6px 12px; border-radius: 999px; font-size: 13px; }
.pa-desc { margin: 10px 0 14px; font-size: 16px; opacity: 0.95; }
.pa-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.pa-chip { background: rgba(255,255,255,0.16); padding: 8px 12px; border-radius: 10px; font-size: 13px; display: flex; gap: 6px; align-items: baseline; }
.pa-chip-k { opacity: 0.8; }
.pa-note { font-size: 13px; margin-top: 14px; opacity: 0.92; line-height: 1.6; }
.pa-card { padding: 20px; border-radius: 16px; background: var(--card-bg); box-shadow: var(--shadow-sm); }
.pa-title { font-size: 17px; font-weight: 700; margin-bottom: 8px; color: var(--text); }
.pa-sub { font-size: 13px; color: var(--text-secondary); line-height: 1.7; margin-bottom: 8px; }
.pa-radar-wrap { position: relative; height: 300px; margin: 6px auto; max-width: 300px; }
.pa-radar { width: 260px; height: 260px; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); }
.pa-radar-label { position: absolute; transform: translate(-50%, -50%); font-size: 12px; color: var(--text-secondary); }
.pa-quad-plot { position: relative; height: 260px; border: 1px solid var(--primary-light); border-radius: 12px; background:
  linear-gradient(90deg, transparent 49.6%, var(--primary-light) 49.6%, var(--primary-light) 50.4%, transparent 50.4%),
  linear-gradient(0deg, transparent 49.6%, var(--primary-light) 49.6%, var(--primary-light) 50.4%, transparent 50.4%); }
.pa-quad-point { position: absolute; width: 14px; height: 14px; border-radius: 50%; background: var(--primary);
  border: 3px solid #fff; box-shadow: 0 0 0 2px var(--primary); transform: translate(-50%, -50%); }
.pa-q { position: absolute; font-size: 13px; font-weight: 600; opacity: 0.75; }
.pa-quad-l { left: 12px; top: 12px; }
.pa-quad-r { right: 12px; top: 12px; }
.pa-quad-bl { left: 12px; bottom: 12px; }
.pa-quad-br { right: 12px; bottom: 12px; }
.pa-axis-x { position: absolute; left: 50%; bottom: 8px; transform: translateX(-50%); font-size: 12px; color: var(--text-secondary); }
.pa-axis-y { position: absolute; left: 8px; top: 50%; transform: translateY(-50%) rotate(-90deg); transform-origin: left center; font-size: 12px; color: var(--text-secondary); }
.pa-archetype { margin-top: 14px; padding: 14px; border-radius: 12px; background: var(--bg); }
.pa-archetype-title { font-size: 15px; font-weight: 700; color: var(--primary); }
.pa-archetype-short { font-size: 12px; color: var(--text-secondary); margin-left: 8px; }
.pa-archetype-text { font-size: 14px; line-height: 1.7; margin-top: 8px; color: var(--text); }
.pa-bar-block { margin-bottom: 16px; }
.pa-bar-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px; }
.pa-bar-name { font-weight: 600; font-size: 14px; }
.pa-bar-meta { font-size: 12px; color: var(--text-secondary); }
.pa-bar-track { position: relative; height: 10px; border-radius: 999px; background: var(--primary-light); }
.pa-bar-fill { height: 100%; border-radius: 999px; }
.pa-fill-young { background: linear-gradient(90deg, var(--special), #7ed6a5); }
.pa-fill-balanced { background: var(--primary); }
.pa-fill-old { background: linear-gradient(90deg, #9a7bd8, #7c5cbf); }
.pa-bar-marker { position: absolute; top: -3px; bottom: -3px; width: 2px; background: #333; border-radius: 1px; }
.pa-bar-about { font-size: 12px; color: var(--text-secondary); margin: 6px 0 4px; }
.pa-bar-text { font-size: 13px; line-height: 1.7; color: var(--text); }
.pa-bar-legend { font-size: 12px; color: var(--text-muted); margin-top: 4px; }
.pa-band-young, .pa-band-old, .pa-band-balanced { font-style: normal; font-weight: 600; }
.pa-band-young { color: #0c9a58; }
.pa-band-balanced { color: var(--primary); }
.pa-band-old { color: #7c5cbf; }
.pa-band-key { color: var(--primary); font-weight: 700; }
.pa-how { padding-left: 20px; margin: 6px 0; }
.pa-how li { font-size: 13px; line-height: 1.8; color: var(--text); margin-bottom: 4px; }
.pa-refs { list-style: none; padding: 0; margin: 10px 0 0; }
.pa-refs li { font-size: 12px; line-height: 1.7; color: var(--text-secondary); padding-bottom: 10px; border-bottom: 1px dashed var(--primary-light); margin-bottom: 10px; }
.pa-refs li:last-child { border-bottom: 0; margin-bottom: 0; }
.pa-ref-note { display: block; margin-top: 4px; color: var(--text); background: var(--bg); border-radius: 8px; padding: 6px 8px; }
.pa-disclaimer { font-size: 12px; color: var(--text-muted); line-height: 1.7; padding: 0 4px; }
</style>