<template>
  <div class="seven-report space-y-6">
    <section class="seven-hero">
      <div class="seven-hero-desc">
        <p class="seven-eyebrow">罪德双轴 · 独立测量</p>
        <h3>你的罪德面相</h3>
        <p class="seven-soft">罪与德是两条独立的指标，可同时并存、互不抵消。</p>
      </div>
      <div class="seven-indices">
        <div class="seven-index" style="border-top-color: var(--symptom);">
          <div class="seven-index-row">
            <span style="color: var(--text-secondary);">罪孽指数</span>
            <strong>{{ report?.sinIndex }}%</strong>
          </div>
          <div class="w-full h-2 rounded-full" style="background-color: var(--primary-light);">
            <div class="h-2 rounded-full transition-all duration-500" :style="{ width: (report?.sinIndex || 0) + '%', backgroundColor: 'var(--symptom)' }"></div>
          </div>
          <div class="seven-index-tier" :style="{ backgroundColor: 'var(--symptom-light)', color: 'var(--symptom)' }">
            {{ report?.sinTier?.label }} — {{ report?.sinTier?.text }}
          </div>
        </div>
        <div class="seven-index" style="border-top-color: var(--primary);">
          <div class="seven-index-row">
            <span style="color: var(--text-secondary);">美德指数</span>
            <strong>{{ report?.virtueIndex }}%</strong>
          </div>
          <div class="w-full h-2 rounded-full" style="background-color: var(--primary-light);">
            <div class="h-2 rounded-full transition-all duration-500" :style="{ width: (report?.virtueIndex || 0) + '%', backgroundColor: 'var(--primary)' }"></div>
          </div>
          <div class="seven-index-tier" :style="{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }">
            {{ report?.virtueTier?.label }} — {{ report?.virtueTier?.text }}
          </div>
        </div>
      </div>
    </section>

    <!-- 罪德镜像雷达 -->
    <section class="seven-section">
      <div class="seven-section-head">
        <h3>罪德镜像雷达</h3>
        <p>上半为七宗罪浓度，下半为对照美德浓度；同一条竖直线上是一对「罪─德」对照。</p>
      </div>
      <div class="seven-radar-wrap">
        <svg :viewBox="'0 0 360 370'" class="seven-radar-svg">
          <circle v-for="rv in sevenRadar?.rings || []" :key="rv" :cx="sevenRadar?.cx" :cy="sevenRadar?.cy" :r="((sevenRadar?.R || 0) * rv / 100)" fill="none" stroke="var(--primary-light)" stroke-width="1" />
          <g v-for="a in sevenRadar?.axis || []" :key="a.key">
            <line :x1="sevenRadar?.cx" :y1="sevenRadar?.cy" :x2="a.sp.x" :y2="a.sp.y" stroke="var(--primary-light)" stroke-width="1" />
            <line :x1="sevenRadar?.cx" :y1="sevenRadar?.cy" :x2="a.vp.x" :y2="a.vp.y" stroke="var(--primary-light)" stroke-width="1" />
            <text :x="a.upLabel.x" :y="a.upLabel.y" text-anchor="middle" fill="var(--symptom)" font-size="11" font-weight="600">{{ a.sin?.name }}</text>
            <text :x="a.dnLabel.x" :y="a.dnLabel.y" text-anchor="middle" fill="var(--primary)" font-size="11" font-weight="600">{{ a.vir?.name }}</text>
          </g>
          <polygon :points="(sevenRadar?.sinPoly || []).join(' ')" fill="var(--symptom)" fill-opacity="0.15" stroke="var(--symptom)" stroke-width="1.5" />
          <polygon :points="(sevenRadar?.virPoly || []).join(' ')" fill="var(--primary)" fill-opacity="0.15" stroke="var(--primary)" stroke-width="1.5" />
          <template v-for="a in sevenRadar?.axis || []" :key="a.key">
            <circle :cx="a.sp.x" :cy="a.sp.y" r="3.5" fill="var(--symptom)" />
            <text :x="a.sp.x" :y="a.sp.y - 8" text-anchor="middle" fill="var(--text-secondary)" font-size="10">{{ a.sin?.pct }}</text>
            <circle :cx="a.vp.x" :cy="a.vp.y" r="3.5" fill="var(--primary)" />
            <text :x="a.vp.x" :y="a.vp.y + 12" text-anchor="middle" fill="var(--text-secondary)" font-size="10">{{ a.vir?.pct }}</text>
          </template>
        </svg>
      </div>
    </section>

    <!-- 罪与德对照表 -->
    <section class="seven-section">
      <div class="seven-section-head">
        <h3>罪与德 · 对照表</h3>
        <p>每条对照展示「一宗罪」与它相对的那条「美德」各自的浓度与档位。</p>
      </div>
      <div class="seven-compare">
        <div class="seven-compare-head"><span>罪</span><span class="seven-compare-sep">×</span><span>美德</span></div>
        <div v-for="p in sevenPairs || []" :key="p.sin?.key" class="seven-compare-row">
          <div class="seven-compare-cell">
            <div class="flex items-center gap-2">
              <span>{{ p.sin?.icon }}</span>
              <span class="font-semibold" style="color: var(--text);">{{ p.sin?.name }}</span>
              <span class="seven-band-chip" :style="{ backgroundColor: 'var(--symptom-light)', color: 'var(--symptom)' }">{{ p.sin?.bandLabel }}</span>
            </div>
            <div class="w-full h-2 rounded-full mt-2" style="background-color: var(--primary-light);">
              <div class="h-2 rounded-full" :style="{ width: (p.sin?.pct || 0) + '%', backgroundColor: 'var(--symptom)' }"></div>
            </div>
            <div class="text-xs mt-1" style="color: var(--text-secondary);">{{ p.sin?.pct }} / 100</div>
          </div>
          <div class="seven-compare-sep">×</div>
          <div class="seven-compare-cell">
            <div class="flex items-center gap-2">
              <span>{{ p.virtue?.icon }}</span>
              <span class="font-semibold" style="color: var(--text);">{{ p.virtue?.name }}</span>
              <span class="seven-band-chip" :style="{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }">{{ p.virtue?.bandLabel }}</span>
            </div>
            <div class="w-full h-2 rounded-full mt-2" style="background-color: var(--primary-light);">
              <div class="h-2 rounded-full" :style="{ width: (p.virtue?.pct || 0) + '%', backgroundColor: 'var(--primary)' }"></div>
            </div>
            <div class="text-xs mt-1" style="color: var(--text-secondary);">{{ p.virtue?.pct }} / 100</div>
          </div>
        </div>
      </div>
    </section>

    <section v-if="report?.dominantSin || report?.guardianVirtue" class="grid md:grid-cols-2 gap-4">
      <div v-if="report?.dominantSin" class="seven-highlight-box" style="border-top: 3px solid var(--symptom);">
        <div class="text-3xl mb-2">{{ report.dominantSin.icon }}</div>
        <div class="font-semibold" style="color: var(--text);">最突出的罪 · {{ report.dominantSin.name }}（{{ report.dominantSin.pct }}%）</div>
        <p class="text-sm mt-1" style="color: var(--text-secondary);">{{ report.dominantSin.note }}</p>
      </div>
      <div v-if="report?.guardianVirtue" class="seven-highlight-box" style="border-top: 3px solid var(--primary);">
        <div class="text-3xl mb-2">{{ report.guardianVirtue.icon }}</div>
        <div class="font-semibold" style="color: var(--text);">守护美德 · {{ report.guardianVirtue.name }}（{{ report.guardianVirtue.pct }}%）</div>
        <p class="text-sm mt-1" style="color: var(--text-secondary);">{{ report.guardianVirtue.note }}</p>
      </div>
    </section>

    <section v-if="report?.coexist?.length" class="seven-section">
      <div class="seven-section-head">
        <h3>罪德共存 · 双高组合</h3>
        <p>以下罪与德同时偏高（≥55）——不是矛盾，是完整。</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <div v-for="c in report.coexist" :key="c.sin" class="seven-coexist-pair">
          <span>{{ c.sinIcon }} {{ c.sinName }} {{ c.sinPct }}%</span>
          <span class="mx-1" style="color: var(--text-muted);">×</span>
          <span>{{ c.virtueIcon }} {{ c.virtueName }} {{ c.virtuePct }}%</span>
        </div>
      </div>
    </section>

    <section class="seven-section">
      <div class="seven-section-head">
        <h3>七宗罪 · 逐维解析</h3>
        <p>浓度越低表示此维度越克制，越高表示越突出。</p>
      </div>
      <div class="seven-dim-grid">
        <div v-for="item in report?.sins || []" :key="item.key" class="seven-dim-card">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <span>{{ item.icon }}</span>
              <span class="font-semibold" style="color: var(--text);">{{ item.name }}</span>
              <span class="text-xs px-1.5 py-0.5 rounded-full" :style="{ backgroundColor: 'var(--symptom-light)', color: 'var(--symptom)' }">{{ item.bandLabel }}</span>
            </div>
            <span style="color: var(--text-secondary);">{{ item.pct }}%</span>
          </div>
          <div class="w-full h-2 rounded-full mb-2" style="background-color: var(--primary-light);">
            <div class="h-2 rounded-full" :style="{ width: item.pct + '%', backgroundColor: item.band === 'high' ? 'var(--symptom)' : item.band === 'mid' ? 'var(--personality)' : 'var(--special)' }"></div>
          </div>
          <p class="text-xs" style="color: var(--text-muted);">{{ item.text }}</p>
        </div>
      </div>
    </section>

    <section class="seven-section">
      <div class="seven-section-head">
        <h3>七美德 · 逐维解析</h3>
        <p>浓度越低表示此美德尚在萌芽，越高表示越丰沛。</p>
      </div>
      <div class="seven-dim-grid">
        <div v-for="item in report?.virtues || []" :key="item.key" class="seven-dim-card">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <span>{{ item.icon }}</span>
              <span class="font-semibold" style="color: var(--text);">{{ item.name }}</span>
              <span class="text-xs px-1.5 py-0.5 rounded-full" :style="{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }">{{ item.bandLabel }}</span>
            </div>
            <span style="color: var(--text-secondary);">{{ item.pct }}%</span>
          </div>
          <div class="w-full h-2 rounded-full mb-2" style="background-color: var(--primary-light);">
            <div class="h-2 rounded-full" :style="{ width: item.pct + '%', backgroundColor: item.band === 'high' ? 'var(--primary)' : item.band === 'mid' ? 'var(--personality)' : 'var(--special)' }"></div>
          </div>
          <p class="text-xs" style="color: var(--text-muted);">{{ item.text }}</p>
        </div>
      </div>
    </section>

    <p class="seven-disclaimer">{{ report?.disclaimer }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ report: any }>()

// 罪─德对照列表（每对罪←→德）
const sevenPairs = computed(() => {
  const r = props.report
  const pairs = (r?.pairs as any[]) || []
  return pairs.map((p: any[]) => ({
    sin: (r?.sins as any[])?.find((s: any) => s.key === p[0]) || null,
    virtue: (r?.virtues as any[])?.find((v: any) => v.key === p[1]) || null,
  }))
})

// 罪德镜像雷达（上半=罪，下半=德）
const sevenRadar = computed(() => {
  const r = props.report
  if (!r) return null
  const N = 7
  const cx = 180, cy = 185, Rr = 150
  const clamp = (v: any) => Math.max(0, Math.min(100, Number(v) || 0))
  const sinAng = (i: number) => Math.PI + (i + 0.5) * Math.PI / N
  const virAng = (i: number) => (i + 0.5) * Math.PI / N
  const pt = (a: number, v: any) => {
    const rad = Rr * clamp(v) / 100
    return { x: Math.round(cx + rad * Math.cos(a)), y: Math.round(cy + rad * Math.sin(a)) }
  }
  const sins = (r.sins as any[]) || []
  const virtues = (r.virtues as any[]) || []
  const pairs = (r.pairs as any[]) || []
  const axis = pairs.map((p: any[], i: number) => {
    const sin = sins.find((s: any) => s.key === p[0])
    const vir = virtues.find((s: any) => s.key === p[1])
    const sp = pt(sinAng(i), sin?.pct)
    const vp = pt(virAng(i), vir?.pct)
    return {
      key: i, sin, vir,
      sp,
      vp,
      upLabel: { x: Math.round(cx + (Rr + 22) * Math.cos(sinAng(i))), y: Math.round(cy + (Rr + 22) * Math.sin(sinAng(i))) },
      dnLabel: { x: Math.round(cx + (Rr + 22) * Math.cos(virAng(i))), y: Math.round(cy + (Rr + 22) * Math.sin(virAng(i))) },
    }
  })
  const sinPoly = pairs.map((_: any, i: number) => {
    const p = pt(sinAng(i), sins.find((s: any) => s.key === pairs[i][0])?.pct)
    return p.x + ',' + p.y
  })
  const virPoly = pairs.map((_: any, i: number) => {
    const p = pt(virAng(i), virtues.find((s: any) => s.key === pairs[i][1])?.pct)
    return p.x + ',' + p.y
  })
  return { cx, cy, R: Rr, rings: [20, 40, 60, 80], axis, sinPoly, virPoly }
})
</script>

<style scoped>
.seven-report { }
.seven-hero { display: grid; grid-template-columns: 1fr 1.4fr; gap: 1rem; }
.seven-hero-desc h3 { font-size: 1.5rem; font-weight: 700; color: var(--text); }
.seven-eyebrow { color: var(--primary); font-size: 0.75rem; letter-spacing: 0.05em; text-transform: uppercase; }
.seven-soft { color: var(--text-secondary); font-size: 0.875rem; }
.seven-indices { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
.seven-index { border-top: 4px solid; background-color: var(--bg); padding: 1rem; border-radius: 0.75rem; }
.seven-index-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
.seven-index-row strong { font-size: 1.5rem; color: var(--text); }
.seven-index-tier { margin-top: 0.6rem; font-size: 0.8rem; line-height: 1.5; padding: 0.5rem 0.75rem; border-radius: 0.5rem; }
.seven-highlight-box { background-color: var(--bg); border-radius: 0.75rem; padding: 1rem; }
.seven-section-head { margin-bottom: 0.75rem; }
.seven-section-head h3 { font-weight: 700; color: var(--text); }
.seven-section-head p { color: var(--text-muted); font-size: 0.8rem; margin-top: 0.25rem; }
.seven-dim-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 0.75rem; }
.seven-dim-card { background-color: var(--bg); border-radius: 0.75rem; padding: 0.9rem; }
.seven-coexist-pair { background-color: var(--card-bg); border: 1px solid var(--primary-light); border-radius: 0.5rem; padding: 0.4rem 0.8rem; font-size: 0.85rem; color: var(--text); }
.seven-disclaimer { font-size: 0.75rem; color: var(--text-muted); border-left: 3px solid var(--warning-border); padding-left: 0.75rem; }
@media (max-width: 768px) {
  .seven-hero { grid-template-columns: 1fr; }
  .seven-indices { grid-template-columns: 1fr; }
}
/* 罪德镜像雷达 + 对照表 */
.seven-radar-wrap { background-color: var(--bg); border-radius: 0.75rem; padding: 1rem; display: flex; justify-content: center; }
.seven-radar-svg { width: 100%; max-width: 400px; height: auto; }
.seven-compare { display: flex; flex-direction: column; gap: 0.5rem; }
.seven-compare-head, .seven-compare-row { display: grid; grid-template-columns: 1fr 40px 1fr; align-items: center; gap: 0.5rem; }
.seven-compare-head { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; }
.seven-compare-cell { background-color: var(--bg); border-radius: 0.5rem; padding: 0.5rem 0.75rem; }
.seven-compare-sep { text-align: center; color: var(--text-muted); font-weight: 700; }
.seven-band-chip { font-size: 0.7rem; padding: 0 0.4rem; border-radius: 999px; line-height: 1.4; }
@media (max-width: 420px) {
  .seven-compare-head, .seven-compare-row { grid-template-columns: 1fr 28px 1fr; }
}
</style>
