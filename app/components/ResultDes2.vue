<template>
  <div class="rounded-lg p-6 mb-6" style="background-color: var(--card-bg); box-shadow: var(--shadow-sm)">

    <!-- 头部 -->
    <div class="flex items-center gap-3 mb-4">
      <span class="text-3xl">🌀</span>
      <div>
        <h3 class="font-bold text-lg" style="color: var(--text);">DES-II · 结果详解</h3>
        <p class="text-xs" style="color: var(--text-muted);">解离经验量表（Dissociative Experiences Scale-II）· 依公开条目整理，仅作自我筛查参考</p>
      </div>
    </div>

    <!-- 总分与等级 -->
    <section class="mb-6">
      <h4 class="font-semibold mb-3 flex items-center gap-2" style="color: var(--text);"><span>📊</span>总分与等级</h4>
      <div class="grid sm:grid-cols-2 gap-3 mb-3">
        <div class="p-4 rounded-xl text-center" style="background-color: var(--primary-light);">
          <div class="text-3xl font-bold" style="color: var(--primary);">{{ result.totalScore?.toFixed ? result.totalScore.toFixed(1) : result.totalScore }}</div>
          <div class="text-xs mt-1" style="color: var(--text-muted);">总分 = 28 题均值（0–100，表示出现该体验的时间比例）</div>
        </div>
        <div class="p-4 rounded-xl text-center" style="background-color: var(--bg);">
          <div class="font-semibold text-lg" style="color: var(--text);">{{ result.level }}</div>
          <div class="text-xs mt-1" style="color: var(--text-muted);">参考等级</div>
        </div>
      </div>
      <p class="text-sm mb-3" style="color: var(--text-secondary);">你的总分落在哪个区间，就大致说明解离体验在生活中的频繁程度（当前区间高亮）：</p>
      <div class="space-y-1.5">
        <div v-for="b in bands" :key="b.range" class="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2 p-2 rounded-lg text-sm"
          :style="b.highlight ? { backgroundColor: 'var(--primary-light)', border: '1px solid var(--primary)' } : { backgroundColor: 'var(--bg)' }">
          <span class="font-semibold whitespace-nowrap" style="color: var(--text);">{{ b.range }}</span>
          <span style="color: var(--text-secondary);">{{ b.meaning }}</span>
        </div>
      </div>
    </section>

    <!-- 三子量表 -->
    <section class="mb-6">
      <h4 class="font-semibold mb-3 flex items-center gap-2" style="color: var(--text);"><span>🧩</span>三个子量表</h4>
      <p class="text-xs mb-3" style="color: var(--text-muted);">
        三个因子覆盖全部 28 题，分组按条目内容逐条判定并在此公开。原版 DES-II 的因子分组是按原版题号定义的，与本表题号不对应，因此不能照搬；
        有公开常模的只有总分，分量表分只能用于比较本次作答内部三者的相对高低。
      </p>
      <div class="space-y-1.5">
        <div v-for="d in subs" :key="d.key" class="flex flex-col gap-1 p-3 rounded-lg sm:flex-row sm:items-center sm:justify-between" style="background-color: var(--bg);">
          <div class="min-w-0">
            <div class="font-medium text-sm" style="color: var(--text);">{{ d.name }}</div>
            <p class="text-xs mt-0.5" style="color: var(--text-muted);">{{ d.desc }}</p>
            <p v-if="d.items.length" class="text-[0.6875rem] mt-0.5" style="color: var(--text-muted);">
              含第 {{ d.items.join('、') }} 题（共 {{ d.items.length }} 题）
            </p>
          </div>
          <div class="text-right text-sm whitespace-nowrap">
            <div class="font-semibold" style="color: var(--primary);">{{ d.score }}%</div>
            <div class="text-xs" style="color: var(--text-muted);">{{ d.level }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 判读提示 -->
    <section class="mb-6">
      <h4 class="font-semibold mb-3 flex items-center gap-2" style="color: var(--text);"><span>🔎</span>判读提示</h4>
      <ul class="space-y-2 text-sm">
        <li v-for="(h, i) in hints" :key="i" class="flex gap-2" style="color: var(--text-secondary);"><span style="color: var(--primary);">▸</span><span>{{ h }}</span></li>
      </ul>
    </section>

    <!-- 参考背景与区别 -->
    <section class="mb-6">
      <h4 class="font-semibold mb-3 flex items-center gap-2" style="color: var(--text);"><span>👥</span>参考背景与与其他量表的区别</h4>
      <ul class="space-y-2 text-sm">
        <li v-for="(n, i) in refs" :key="i" class="flex gap-2" style="color: var(--text-secondary);"><span style="color: var(--primary);">·</span><span>{{ n }}</span></li>
      </ul>
    </section>

    <!-- 注意事项 -->
    <section class="mb-6">
      <h4 class="font-semibold mb-3 flex items-center gap-2" style="color: var(--text);"><span>⚠️</span>注意事项</h4>
      <ul class="space-y-2 text-sm">
        <li v-for="(c, i) in caveats" :key="i" class="flex gap-2" style="color: var(--text-secondary);"><span style="color: var(--primary);">·</span><span>{{ c }}</span></li>
      </ul>
    </section>

    <!-- 免责声明 -->
    <div class="p-4 rounded-lg text-xs" style="background-color: var(--bg); color: var(--text-muted);">
      本详解依据公开资料整理，仅用于教育与自我筛查，<b>不构成临床诊断</b>。若分数较高且伴随明显解离、失忆或人格/现实解体体验，请咨询精神科或临床心理专业人员，必要时以更细的解离量表（如 MID-60）或结构化访谈进一步评估。
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ result: any }>()

const dims = (props.result?.dimensionScores || {}) as Record<string, any>
const total = Number(props.result?.totalScore) || 0;

const BANDS = [
  { min: 0, max: 11, range: "0–11 低", meaning: "普通范围内，多数人偶有轻微、短暂的解离体验（走神、沉浸等），一般没有临床意义。" },
  { min: 12, max: 19, range: "12–19 轻度", meaning: "存在一些解离体验，但通常达不到临床显著程度；多见于日常的忘事与注意力分散。" },
  { min: 20, max: 29, range: "20–29 中度", meaning: "解离体验较频繁，可能与压力或创伤史相关，建议结合功能受损情况综合判断。" },
  { min: 30, max: 45, range: "30–45 高", meaning: "解离体验明显偏多，常提示需要进一步评估，可能与症状性解离或创伤后表现相关。" },
  { min: 46, max: 100, range: "≥46 显著", meaning: "达到筛查提示的显著水平，强烈建议寻求精神科/临床心理的专业评估。" },
].map((b) => ({ ...b, highlight: total >= b.min && total <= b.max }));
const bands = BANDS;

const order = ['amnesia', 'dpdr', 'absorption']
const META: Record<string, { name: string; desc: string }> = {
  amnesia: { name: "记忆缺失 (Amnesia)", desc: "对日常事件出现片段性遗忘或记忆空白：不记得走过的路、说过的话、做过的事。" },
  dpdr: { name: "人格/现实解体 (DP/DR)", desc: "自我脱离、像在旁观自己，或外界不真实、像隔着一层。" },
  absorption: { name: "吸收沉浸 (Absorption)", desc: "在想象、音乐或活动中深度投入与心流；单独偏高常属正常的沉浸体验。" },
}
const subs = order.map((k) => ({
  key: k,
  name: (dims[k]?.name as string) || META[k]?.name || k,
  desc: META[k]?.desc || "",
  score: ((dims[k]?.score ?? 0) as number).toFixed(1),
  level: (dims[k]?.level as string) || "",
  items: (dims[k]?.items as number[]) || [],
}));

const amn = Number(dims.amnesia?.score) || 0;
const dp = Number(dims.dpdr?.score) || 0;
const abs = Number(dims.absorption?.score) || 0;
const hints: string[] = [];
if (total < 20) hints.push("总分较低：当前解离体验多以日常走神、沉浸等普通现象为主，一般不必过度担忧；若有实际困扰仍可留意。");
if (amn >= 30 || dp >= 30) hints.push("记忆缺失或人格/现实解体偏高：更提示可能与病理性解离（如解离性失忆、人格/现实解体）相关，值得专业评估。");
if (abs >= 45 && amn < 30 && dp < 30) hints.push("吸收沉浸明显高于其他两项：多为对想象/音乐/活动的深度沉浸（心流），通常属于正常体验，不必急于定性为病理。");
if (amn >= 30 && dp >= 30) hints.push("记忆缺失与人格/现实解体同时偏高：组合更提示成体系的解离症状，建议结合创伤史与功能受损由专业人员进一步评估。");
if (hints.length === 0) hints.push("当前子量表分布未见明显病理指向；仍建议结合主观痛苦与功能受损综合看待。");

const refs = [
  "DES-II 是最常用的解离筛查工具之一，用于粗略估计解离体验的强度；但它的吸收子量表常偏高，分数高不等于患病。",
  "与 MID-60 相比：DES-II 覆盖面较粗，常漏检较轻的解离性失忆、人格/现实解体及轻度 OSDD；若需要更细的 12 子量表剖面，可再用 MID-60 评估。",
  "分数分档（参照 NovoPsych 2024）仅用于筛查与研究，不同研究阈值略有差异（如 Carlson & Putnam, 1993）。",
];
const caveats = [
  "本量表 0-100 表示该体验出现的时间比例；分数越高说明越频繁，偶尔出现应给较低分。",
  "若你正进行主动性的想象/内在对话训练，或已是多意识体体系（DID/OSDD 等），本量表部分题目就是你的日常体验，分数可能失真，需结合自身实际多方评估。",
  "分数高不等于临床诊断；需由专业人员结合访谈、病史与功能受损情况综合判断。",
];
</script>

<style scoped></style>
