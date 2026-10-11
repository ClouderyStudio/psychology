import {
  bisBuilder,
  bpnsBuilder,
  epqBuilder,
  epqRscBuilder,
  ipipEisBuilder,
  sixteenPFBuilder,
  temperamentBuilder,
} from './personality'
import {
  asrmBuilder,
  bpaqBuilder,
  des2Builder,
  gad7Builder,
  mid60Builder,
  ocirBuilder,
  panicBuilder,
  phobiaBuilder,
  phq9Builder,
  pssBuilder,
  ptsdBuilder,
  sasBuilder,
  sdsBuilder,
  sepanxBuilder,
  sdq20Builder,
  siossBuilder,
  socialBuilder,
  agoraBuilder,
  ybocsBuilder,
} from './symptom'
import {
  asrsBuilder,
  auditBuilder,
  eat26Builder,
  igdsBuilder,
  psqiBuilder,
  scoffBuilder,
} from './screening'
import {
  ecrrBuilder,
  hsprBuilder,
  rsesBuilder,
  sccsBuilder,
  spnqBuilder,
  swlsBuilder,
} from './special'

export interface DimensionItem {
  key: string
  name: string
  icon?: string
  value: number
  display: string
  level?: string
  desc?: string
}

export interface DimensionHighlightCard {
  label: string
  freq: string
  endorsedCount: number
}

export interface DimensionConfig {
  icon: string
  title: string
  subtitle: string
  hint: string
  color: string
  columns: string
  items: DimensionItem[]
  highlightCard: DimensionHighlightCard | null
}

export type DimensionBuilder = (s: any) => Partial<DimensionConfig>

// testId -> builder；result.vue 的 enrichedScale 白名单里每个 id 都必须在此登记
export const dimensionBuilders: Record<string, DimensionBuilder> = {
  epq: epqBuilder,
  'epq-rsc': epqRscBuilder,
  temperament: temperamentBuilder,
  bpns: bpnsBuilder,
  'ipip-eis': ipipEisBuilder,
  sixteenPF: sixteenPFBuilder,
  sccs: sccsBuilder,
  bis: bisBuilder,
  sioss: siossBuilder,
  bpaq: bpaqBuilder,
  pss: pssBuilder,
  sds: sdsBuilder,
  sas: sasBuilder,
  rses: rsesBuilder,
  asrm: asrmBuilder,
  des2: des2Builder,
  sdq20: sdq20Builder,
  ybocs: ybocsBuilder,
  ocir: ocirBuilder,
  ptsd: ptsdBuilder,
  panic: panicBuilder,
  social: socialBuilder,
  phobia: phobiaBuilder,
  agora: agoraBuilder,
  sepanx: sepanxBuilder,
  audit: auditBuilder,
  igds: igdsBuilder,
  eat26: eat26Builder,
  scoff: scoffBuilder,
  asrs: asrsBuilder,
  ecrr: ecrrBuilder,
  psqi: psqiBuilder,
  swls: swlsBuilder,
  hspr: hsprBuilder,
  spnq: spnqBuilder,
  mid60: mid60Builder,
  phq9: phq9Builder,
  gad7: gad7Builder,
}

const FALLBACK: DimensionConfig = {
  title: '',
  icon: '📊',
  color: 'var(--primary)',
  hint: '',
  subtitle: '',
  items: [],
  columns: 'repeat(auto-fill, minmax(240px, 1fr))',
  highlightCard: null,
}

export function buildDimensionConfig(testId: string, scores: any): DimensionConfig {
  const s = scores || {}
  const builder = dimensionBuilders[testId]
  if (!builder) return { ...FALLBACK, items: [], highlightCard: null }
  const partial = builder(s)
  return {
    title: partial.title ?? FALLBACK.title,
    icon: partial.icon ?? FALLBACK.icon,
    color: partial.color ?? FALLBACK.color,
    hint: partial.hint ?? FALLBACK.hint,
    subtitle: partial.subtitle ?? FALLBACK.subtitle,
    items: partial.items ?? [],
    columns: partial.columns ?? FALLBACK.columns,
    highlightCard: partial.highlightCard ?? null,
  }
}
