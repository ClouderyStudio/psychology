<template>
  <div class="pa-report space-y-6">
    <!-- 概述 -->
    <section class="pa-hero">
      <div class="pa-hero-desc">
        <p class="pa-eyebrow">心理年龄测验 · 七维模型</p>
        <div class="pa-hero-main">
          <div class="pa-num">{{ report.psychAge }}<span class="pa-unit">岁</span></div>
          <span class="pa-badge">{{ report.descriptor }}</span>
        </div>
        <p class="pa-desc">{{ report.describe }}</p>
        <p class="pa-soft">{{ report.heroNote }}</p>
      </div>
      <div class="pa-hero-stats">
        <div class="pa-stat" v-if="report.chrono != null" style="border-top-color: var(--special);">
          <div class="pa-stat-row"><span style="color: var(--text-secondary);">生理年龄</span><strong>{{ report.chrono }}</strong></div>
          <div class="pa-stat-tip" style="background-color: var(--special-light); color: var(--special-dark);">身份证上的年龄</div>
        </div>
        <div class="pa-stat" v-if="report.diff != null" style="border-top-color: var(--primary);">
          <div class="pa-stat-row"><span style="color: var(--text-secondary);">心理 vs 生理</span><strong>{{ report.diffLabel }}</strong></div>
          <div class="pa-stat-tip" style="background-color: var(--primary-light); color: var(--primary);">心理年龄相对生理年龄</div>
        </div>
        <div class="pa-stat" style="border-top-color: var(--symptom);">
          <div class="pa-stat-row"><span style="color: var(--text-secondary);">概括值</span><strong>6 维加权</strong></div>
          <div class="pa-stat-tip" style="background-color: var(--symptom-light); color: var(--symptom-dark);">由 6 个年龄维度合成</div>
        </div>
      </div>
    </section>

    <!-- 六维雷达 -->
    <section class="pa-section">
      <div class="pa-section-head">
        <h3>六维心理年龄画像</h3>
        <p>六个维度各自对应的心理年龄（16—60 岁区间），越靠近外周越年轻。</p>
      </div>
      <div class="pa-radar-wrap">
        <svg viewBox="0 0 260 260" class="pa-radar">
          <polygon :points="ringPoly()" fill="var(--primary)" fill-opacity="0.05" stroke="var(--primary-light)" stroke-width="1"/>
          <line v-for="i in [0,1,2,3,4,5]" :key="'ax'+i" :x1="C" :y1="C" :x2="pt(i,100).x" :y2="pt(i,100).y" stroke="var(--primary-light)" stroke-width="1"/>
          <polygon :points="radarPoly()" fill="var(--primary)" fill-opacity="0.18" stroke="var(--primary)" stroke-width="2" stroke-linejoin="round"/>
        </svg>
        <span v-for="(d,i) in report.dims" :key="d.key" class="pa-radar-label" :style="labelPos(Number(i),d)">{{ d.short }}</span>
      </div>
    </section>

    <!-- 双轴象限 -->
    <section class="pa-section">
      <div class="pa-section-head">
        <h3>成熟度 × 少年感 双轴画像</h3>
        <p>两条轴相互独立，可以同时很高——「看清世界」与「童心未泯」并不冲突。</p>
      </div>
      <div class="pa-quad-wrap">
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

    <!-- 逐维度解析 -->
    <section class="pa-section">
      <div class="pa-section-head">
        <h3>逐维度解析</h3>
        <p>每个维度的心理年龄与成长建议（竖线为你填写的生理年龄位置，如已填写）。</p>
      </div>
      <div class="pa-dims">
        <div v-for="d in report.dims" :key="d.key" class="pa-dim">
          <div class="pa-dim-head">
            <span class="pa-dim-name">{{ d.name }} · {{ d.short }}</span>
            <span class="pa-dim-meta">{{ d.age }} 岁 · <em :class="'pa-band-' + d.band">{{ d.bandLabel }}</em></span>
          </div>
          <div class="w-full h-2 rounded-full" style="background-color: var(--primary-light);">
            <div class="h-2 rounded-full" :class="'pa-fill-' + d.band" :style="{ width: barPct(d) + '%' }"></div>
          </div>
          <p class="pa-bar-about">{{ d.about }}</p>
          <p class="pa-bar-text" style="color: var(--text-secondary);">{{ d.bandText }}</p>
        </div>
      </div>
    </section>

    <!-- 均衡度 -->
    <section class="pa-section">
      <div class="pa-section-head">
        <h3>维度均衡度</h3>
        <p>你 6 个维度的心理年龄彼此差异有多大。</p>
      </div>
      <div class="pa-callout">
        <b class="pa-band-key">{{ report.balance.label }}</b>
        <p style="color: var(--text-secondary);">{{ report.balance.text }}</p>
      </div>
    </section>

    <!-- 担当力 -->
    <section class="pa-section">
      <div class="pa-section-head">
        <h3>担当力（不计入年龄）</h3>
        <p>责任感是「担当」而不是「年龄」——它反映你靠不靠谱、扛不扛事。</p>
      </div>
      <div class="pa-callout">
        <b class="pa-band-key">{{ report.resLevel }}</b><span style="color: var(--text-muted); font-size: 0.8rem;">（特质分 {{ report.resTrait }} / 5）</span>
        <p style="color: var(--text-secondary);">{{ report.responsibilityNote }}</p>
      </div>
    </section>

    <!-- 如何阅读 -->
    <section class="pa-section">
      <div class="pa-section-head">
        <h3>如何阅读这份报告</h3>
      </div>
      <ol class="pa-how">
        <li v-for="(t,i) in report.howToRead" :key="'h'+i">{{ t }}</li>
      </ol>
    </section>

    <!-- 依据与文献 -->
    <section class="pa-section">
      <div class="pa-section-head">
        <h3>维度与文献依据</h3>
        <p>{{ report.basisIntro }}</p>
      </div>
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
const pstr = (p: any) => p.x.toFixed(1) + ',' + p.y.toFixed(1)
const radarPoly = () => report.dims.map((d: any, i: number) => pstr(pt(i, radarVal(d)))).join(' ')
const ringPoly = () => [0, 1, 2, 3, 4, 5].map((i: number) => pstr(pt(i, 100))).join(' ')
const labelPos = (i: number, d: any) => {
  const p = pt(i, 126)
  return { left: p.x + 'px', top: p.y + 'px' }
}
// 双轴象限点（成熟度 x，少年感 y）
const qDot = () => ({ left: report.maturity + '%', top: (100 - report.youth) + '%' })
// 维度条占比（16—60 岁区间）
const barPct = (d: any) => {
  const v = ((Number(d.age) || 16) - 16) / 44
  return Math.round(Math.max(0, Math.min(1, v)) * 100)
}
const markerPct = () => {
  const c = Number(report.chrono) || 16
  const v = (c - 16) / 44
  return Math.round(Math.max(0, Math.min(1, v)) * 100)
}
// 文献格式化（GB/T 7714 概述）
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
.pa-report { }
/* 概述：左文右指标 */
.pa-hero { display: grid; grid-template-columns: 1fr 1.3fr; gap: 1rem; align-items: stretch; }
.pa-hero-desc h3, .pa-hero-main { }
.pa-eyebrow { color: var(--primary); font-size: 0.75rem; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 0.5rem; }
.pa-hero-main { display: flex; align-items: baseline; gap: 0.6rem; flex-wrap: wrap; }
.pa-num { font-size: 3.25rem; font-weight: 800; line-height: 1; color: var(--text); }
.pa-unit { font-size: 1.4rem; margin-left: 4px; color: var(--text); }
.pa-badge { background-color: var(--primary-light); color: var(--primary); font-size: 0.8rem; font-weight: 600; padding: 0.35rem 0.75rem; border-radius: 999px; }
.pa-desc { margin: 0.6rem 0 0.4rem; font-size: 1.05rem; color: var(--text); }
.pa-soft { color: var(--text-secondary); font-size: 0.85rem; line-height: 1.7; }
.pa-hero-stats { display: grid; grid-template-columns: 1fr; gap: 0.6rem; }
.pa-stat { border-top: 4px solid; background-color: var(--bg); padding: 1rem; border-radius: 0.75rem; }
.pa-stat-row { display: flex; justify-content: space-between; align-items: baseline; }
.pa-stat-row strong { font-size: 1.4rem; color: var(--text); }
.pa-stat-tip { margin-top: 0.5rem; font-size: 0.75rem; line-height: 1.5; padding: 0.35rem 0.6rem; border-radius: 0.5rem; }
/* 区块 */
.pa-section { background-color: var(--bg); border-radius: 0.75rem; padding: 1.25rem; }
.pa-section-head { margin-bottom: 0.75rem; }
.pa-section-head h3 { font-weight: 700; color: var(--text); font-size: 1.05rem; }
.pa-section-head p { color: var(--text-muted); font-size: 0.8rem; margin-top: 0.25rem; line-height: 1.6; }
.pa-callout { color: var(--text); line-height: 1.7; font-size: 0.9rem; }
.pa-callout p { margin-top: 0.4rem; }
/* 雷达 */
.pa-radar-wrap { position: relative; width: 260px; height: 260px; margin: 0 auto; }
.pa-radar { position: absolute; inset: 0; width: 260px; height: 260px; }
.pa-radar-label { position: absolute; transform: translate(-50%, -50%); font-size: 0.75rem; color: var(--text-secondary); white-space: nowrap; }
@media (max-width: 380px) { .pa-radar-wrap { transform: scale(0.82); } }
/* 双轴象限 */
.pa-quad-wrap { display: flex; justify-content: center; }
.pa-quad-plot { position: relative; width: 100%; max-width: 300px; height: 260px; border: 1px solid var(--primary-light); border-radius: 0.75rem; background:
  linear-gradient(90deg, transparent 49.6%, var(--primary-light) 49.6%, var(--primary-light) 50.4%, transparent 50.4%),
  linear-gradient(0deg, transparent 49.6%, var(--primary-light) 49.6%, var(--primary-light) 50.4%, transparent 50.4%); }
.pa-quad-point { position: absolute; width: 14px; height: 14px; border-radius: 50%; background-color: var(--primary);
  border: 3px solid var(--bg); box-shadow: 0 0 0 2px var(--primary); transform: translate(-50%, -50%); z-index: 2; }
.pa-q { position: absolute; font-size: 0.85rem; font-weight: 600; color: var(--text-muted); }
.pa-quad-l { left: 12px; top: 12px; }
.pa-quad-r { right: 12px; top: 12px; }
.pa-quad-bl { left: 12px; bottom: 12px; }
.pa-quad-br { right: 12px; bottom: 12px; }
.pa-axis-x { position: absolute; left: 50%; bottom: 8px; transform: translateX(-50%); font-size: 0.75rem; color: var(--text-secondary); }
.pa-axis-y { position: absolute; left: 10px; top: 50%; transform: translateY(-50%) rotate(-90deg); transform-origin: left center; font-size: 0.75rem; color: var(--text-secondary); }
.pa-archetype { margin-top: 1rem; padding: 1rem; border: 1px solid var(--primary-light); border-radius: 0.75rem; }
.pa-archetype-title { display: inline; font-size: 1rem; font-weight: 700; color: var(--primary); }
.pa-archetype-short { font-size: 0.8rem; color: var(--text-secondary); margin-left: 0.5rem; }
.pa-archetype-text { font-size: 0.9rem; line-height: 1.8; margin-top: 0.6rem; color: var(--text); }
/* 逐维 */
.pa-dims { display: flex; flex-direction: column; gap: 1.1rem; }
.pa-dim { position: relative; }
.pa-dim-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.4rem; }
.pa-dim-name { font-weight: 600; font-size: 0.95rem; color: var(--text); }
.pa-dim-meta { font-size: 0.8rem; color: var(--text-secondary); }
.pa-bar-marker { position: absolute; top: 1.75rem; bottom: 0; width: 2px; background-color: var(--text); opacity: 0.85; transform: translateX(-1px); }
.pa-bar-about { font-size: 0.8rem; color: var(--text-muted); margin: 0.5rem 0 0.35rem; }
.pa-bar-text { font-size: 0.85rem; line-height: 1.7; color: var(--text-secondary); }
.pa-fill-young { background-color: var(--special); }
.pa-fill-balanced { background-color: var(--primary); }
.pa-fill-old { background-color: var(--symptom-dark); }
.pa-band-young, .pa-band-old, .pa-band-balanced { font-style: normal; font-weight: 600; }
.pa-band-young { background-color: var(--special-light); color: var(--special-dark); }
.pa-band-balanced { background-color: var(--primary-light); color: var(--primary); }
.pa-band-old { background-color: var(--symptom-light); color: var(--symptom-dark); }
.pa-band-young, .pa-band-balanced, .pa-band-old { padding: 0.1rem 0.5rem; border-radius: 999px; font-size: 0.75rem; }
.pa-band-key { color: var(--primary); font-weight: 700; }
/* 如何阅读 */
.pa-how { list-style: none; padding: 0; margin: 0; }
.pa-how li { font-size: 0.9rem; line-height: 1.8; color: var(--text); padding: 0.5rem 0.75rem; border-left: 3px solid var(--primary-light); background-color: var(--card-bg); border-radius: 0 0.5rem 0.5rem 0; margin-bottom: 0.5rem; }
/* 文献 */
.pa-refs { list-style: none; padding: 0; margin: 0; }
.pa-refs li { font-size: 0.8rem; line-height: 1.7; color: var(--text-secondary); padding-bottom: 0.75rem; border-bottom: 1px dashed var(--primary-light); margin-bottom: 0.75rem; }
.pa-refs li:last-child { border-bottom: 0; margin-bottom: 0; }
.pa-ref-note { display: block; margin-top: 0.4rem; color: var(--text); font-size: 0.82rem; }
/* 免责 */
.pa-disclaimer { font-size: 0.75rem; color: var(--text-muted); line-height: 1.7; border-left: 3px solid var(--warning-border); padding-left: 0.75rem; }
@media (max-width: 768px) {
  .pa-hero { grid-template-columns: 1fr; }
}
</style>