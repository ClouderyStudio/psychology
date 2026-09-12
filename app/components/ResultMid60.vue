<template>
  <div class="rounded-lg p-6 mb-6" style="background-color: var(--card-bg); box-shadow: var(--shadow-sm)">

    <!-- 头部 -->
    <div class="flex items-center gap-3 mb-4">
      <span class="text-3xl">🌀</span>
      <div>
        <h3 class="font-bold text-lg" style="color: var(--text);">MID-60 · 结果详解</h3>
        <p class="text-xs" style="color: var(--text-muted);">多维解离量表（Multidimensional Inventory of Dissociation）· 依公开条目整理，仅作自我筛查参考</p>
      </div>
    </div>

    <!-- 总分与等级 -->
    <section class="mb-6">
      <h4 class="font-semibold mb-3 flex items-center gap-2" style="color: var(--text);"><span>📊</span>总分与等级</h4>
      <div class="grid sm:grid-cols-2 gap-3 mb-3">
        <div class="p-4 rounded-xl text-center" style="background-color: var(--primary-light);">
          <div class="text-3xl font-bold" style="color: var(--primary);">{{ result.totalScore?.toFixed ? result.totalScore.toFixed(1) : result.totalScore }}%</div>
          <div class="text-xs mt-1" style="color: var(--text-muted);">总分 = 60 题均值 × 10（0–100%）</div>
        </div>
        <div class="p-4 rounded-xl text-center" style="background-color: var(--bg);">
          <div class="font-semibold text-lg" style="color: var(--text);">{{ result.level }}</div>
          <div class="text-xs mt-1" style="color: var(--text-muted);">参考等级</div>
        </div>
      </div>
      <p class="text-sm mb-3" style="color: var(--text-secondary);">总分大致对应“你自觉在多大比例的时间里经历解离”的感受强度。参考区间如下（当前得分所在区间高亮）——<b>区间只描述症状强度，不是诊断结论</b>：</p>
      <div class="space-y-1.5">
        <div v-for="b in bands" :key="b.range" class="flex items-start gap-2 p-2 rounded-lg text-sm"
          :style="b.highlight ? { backgroundColor: 'var(--primary-light)', border: '1px solid var(--primary)' } : { backgroundColor: 'var(--bg)' }">
          <span class="font-semibold whitespace-nowrap" style="color: var(--text);">{{ b.range }}</span>
          <span style="color: var(--text-secondary);">{{ b.label }}</span>
        </div>
      </div>
      <p class="text-xs mt-3 mb-1.5" style="color: var(--text-muted);">各区间在文献中的对应情况（<b>文献对照，不构成诊断</b>）：</p>
      <ul class="space-y-1">
        <li v-for="b in bandReference" :key="b.range" class="flex gap-2 text-xs" style="color: var(--text-muted);">
          <span class="whitespace-nowrap font-medium">{{ b.range }}</span><span>{{ b.literature }}</span>
        </li>
      </ul>
    </section>

    <!-- 12 子量表 -->
    <section class="mb-6">
      <h4 class="font-semibold mb-3 flex items-center gap-2" style="color: var(--text);"><span>🧩</span>12 个相关子量表（按症状领域分组）</h4>
      <p class="text-sm mb-3" style="color: var(--text-secondary);">子量表分 = 该组题目均值 × 10；达到各自“临床参考线”即标记为超线。分数越高、超线子量表越多，越提示对应的症状领域值得进一步留意。分组名后的括注是文献中的诊断归类，仅用于帮助定位，不是本次结果的结论。</p>
      <p class="text-xs mb-3" style="color: var(--text-muted);">本实现的 60 题与子量表归属按公开条目整理，并经逐条语义核对后修正过归属（例如"别人说你做过某些事但你完全不记得"属近期遗忘而非人格解体）；各子量表的参考线沿用原量表数值，只作提示。判读以总分与超线项的组合为主，不要用单个子量表下结论。</p>
      <div class="space-y-3">
        <div v-for="group in groups" :key="group.title" class="rounded-lg p-3" style="background-color: var(--bg);">
          <div class="font-semibold text-sm mb-2" style="color: var(--primary);">{{ group.title }}</div>
          <div class="space-y-1.5">
            <div v-for="d in group.items" :key="d.key" class="flex flex-col gap-1 p-2 rounded-lg sm:flex-row sm:items-center sm:justify-between"
              :style="d.above ? { backgroundColor: 'var(--primary-light)' } : {}">
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="font-medium text-sm" style="color: var(--text);">{{ d.name }}</span>
                  <span v-if="d.above" class="px-1.5 py-0.5 rounded-full text-[0.625rem] font-semibold"
                    style="background-color: var(--primary); color: #fff;">超参考线</span>
                </div>
                <p class="text-xs mt-0.5" style="color: var(--text-muted);">{{ d.short }}</p>
              </div>
              <div class="text-right text-sm whitespace-nowrap">
                <span class="font-semibold" :style="{ color: d.above ? 'var(--primary)' : 'var(--text)' }">{{ d.score }}%</span>
                <span class="text-xs" style="color: var(--text-muted);"> / 参考 {{ d.cutoff }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 剖面判读 -->
    <section class="mb-6">
      <h4 class="font-semibold mb-3 flex items-center gap-2" style="color: var(--text);"><span>🔎</span>剖面判读提示</h4>
      <ul class="space-y-2 text-sm">
        <li v-for="(h, i) in hints" :key="i" class="flex gap-2" style="color: var(--text-secondary);">
          <span style="color: var(--primary);">▸</span><span>{{ h }}</span>
        </li>
      </ul>
    </section>

    <!-- 参考人群 / 常模 -->
    <section class="mb-6">
      <h4 class="font-semibold mb-3 flex items-center gap-2" style="color: var(--text);"><span>👥</span>参考人群 / 常模</h4>
      <ul class="space-y-2 text-sm">
        <li v-for="(n, i) in norms" :key="i" class="flex gap-2" style="color: var(--text-secondary);"><span style="color: var(--primary);">·</span><span>{{ n }}</span></li>
      </ul>
    </section>

    <!-- 高分解读与注意事项 -->
    <section class="mb-6">
      <h4 class="font-semibold mb-3 flex items-center gap-2" style="color: var(--text);"><span>⚠️</span>高分解读与注意事项</h4>
      <ul class="space-y-2 text-sm">
        <li v-for="(c, i) in caveats" :key="i" class="flex gap-2" style="color: var(--text-secondary);"><span style="color: var(--primary);">·</span><span>{{ c }}</span></li>
      </ul>
    </section>

    <!-- 安全提示 -->
    <section v-if="safety" class="mb-6 p-4 rounded-lg" style="background-color: #fdecea; color: #c0392b;">
      <div class="font-bold mb-1">🚨 安全提示</div>
      <p class="text-sm">您在自伤相关条目（题 22 / 44 / 58）上分数较高。若当前存在伤害自己或结束生命的想法，请尽快寻求帮助：</p>
      <p class="text-sm mt-2 whitespace-pre-line">· 全国心理援助热线：400-161-9995&#10;· 24小时心理危机热线（北京）：010-82951332&#10;· 紧急情况请拨打 120 或前往医院急诊</p>
    </section>

    <!-- 免责声明 -->
    <div class="p-4 rounded-lg text-xs" style="background-color: var(--bg); color: var(--text-muted);">
      本详解依据公开资料整理，仅用于教育与自我筛查，<b>不构成临床诊断</b>。若分数较高且合并显著痛苦或功能受损，请咨询精神科 / 临床心理专业人员，必要时进行结构化访谈（如 SCID-D、DDIS、TADS-I）或完整版 218 题 MID 进一步评估。
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ result: any }>()

const dims = (props.result?.dimensionScores || {}) as Record<string, any>
const safety = !!dims.safety

const order = ['amnesia', 'alter', 'angry', 'persec', 'dpdr', 'memory-distress', 'autobio', 'flashback', 'fns', 'pnes', 'trance', 'identity'] as const
const META: Record<string, { short: string }> = {
  amnesia: { short: '近期遗忘：忘记近期做过的事、回过神来发现做过不记得的事、出现在意想不到的地方' },
  alter: { short: '替换人格意识：觉察内在有不同“部分”，各有身份、声音与视角' },
  angry: { short: '愤怒侵入：不受控制的愤怒，冷静后不记得说过/做过' },
  persec: { short: '迫害性内在声音：贬低自己、命令自伤或希望自己死去的内部声音' },
  dpdr: { short: '人格解体 / 现实解体：对自己、他人或环境不真实，脱离身体/情绪，与周围断开连接' },
  'memory-distress': { short: '记忆困扰：记忆困难造成主观痛苦、影响日常功能，或突然做不了原本熟练的事' },
  autobio: { short: '自传记忆丧失：个人经历大片空白（如童年缺失、重要事件想不起）' },
  flashback: { short: '闪回：生动地重新经历创伤记忆（画面、声音、气味）' },
  fns: { short: '功能性神经症状：无医学解释的失明、失聪、瘫痪、吞咽困难、行走困难等' },
  pnes: { short: '心因性非癫痫发作：非癫痫性的发作 / 抽搐' },
  trance: { short: '恍惚：长时间出神、觉察下降、与现实脱节' },
  identity: { short: '自我困惑：对“我是谁”不确定，难以维持一致的自我感' },
};
// 分组按症状领域命名；括号内是文献中的诊断归类，只用于帮助定位，不是本次结果的结论
const GROUPS: Array<{ title: string; keys: string[] }> = [
  { title: '记忆空白与身份相关体验（文献归类：解离性身份障碍）', keys: ['amnesia', 'alter', 'angry', 'persec'] },
  { title: '自我 / 现实脱离（文献归类：人格解体 / 现实解体）', keys: ['dpdr'] },
  { title: '记忆困扰与自传记忆（文献归类：解离性失忆）', keys: ['memory-distress', 'autobio'] },
  { title: '创伤再体验（文献归类：创伤后应激）', keys: ['flashback'] },
  { title: '无医学解释的躯体症状（文献归类：转换症状）', keys: ['fns', 'pnes'] },
  { title: '一般解离现象', keys: ['trance', 'identity'] },
];

const groups = GROUPS.map((g) => ({
  title: g.title,
  items: g.keys.map((k) => ({
    key: k,
    name: dims[k]?.name || k,
    short: META[k]?.short || '',
    score: (dims[k]?.score ?? 0).toFixed(1),
    cutoff: dims[k]?.cutoff ?? 0,
    above: !!dims[k]?.above,
  })),
}));

const total = Number(props.result?.totalScore) || 0;
const bands = [
  { min: 0, max: 6, range: '0–6', label: '解离体验极低' },
  { min: 7, max: 14, range: '7–14', label: '解离体验偏低' },
  { min: 15, max: 20, range: '15–20', label: '轻度解离体验' },
  { min: 21, max: 30, range: '21–30', label: '中度解离体验' },
  { min: 31, max: 40, range: '31–40', label: '较重解离体验' },
  { min: 41, max: 63, range: '41–63', label: '重度解离体验' },
  { min: 64, max: 79, range: '64–79', label: '极重度解离体验' },
  { min: 80, max: 100, range: '80+', label: '极重度解离体验（异常高，须重点面询澄清）' },
].map((b) => ({ ...b, highlight: total >= b.min && total <= b.max }));

// 各区间在文献中的对应情况：随结果下发，只作对照，不构成诊断结论
const bandReference = (dims.bandReference || []) as Array<{ range: string; literature: string }>;

const aboveSet = new Set(order.filter((k) => dims[k]?.above));
const hints: string[] = [];
if (aboveSet.has('flashback') && aboveSet.has('dpdr')) hints.push('闪回与自我 / 现实脱离同时超线：创伤后再体验与现实脱离常同时出现，值得结合创伤史由专业人员评估。');
if (aboveSet.has('amnesia') && (aboveSet.has('alter') || aboveSet.has('angry') || aboveSet.has('persec'))) hints.push('记忆空白与身份相关体验（内在不同部分 / 愤怒或声音侵入）同时超线：这是文献中与解离性身份障碍关联度最高的组合，需由专业人员面询确认，请勿据此自行判断。');
if (aboveSet.has('memory-distress') || aboveSet.has('autobio')) hints.push('记忆困扰 / 自传记忆丧失超线：需区分日常健忘、注意力问题与成片的记忆空白，后者才提示解离性失忆方向。');
if (aboveSet.has('fns') || aboveSet.has('pnes')) hints.push('功能性神经症状超线：应先由医生排除躯体 / 神经系统病因，再考虑转换症状。');
if (aboveSet.has('trance') || aboveSet.has('identity')) hints.push('恍惚 / 自我困惑超线：属于一般解离现象，是否有临床意义需结合总分与面询。');
if (hints.length === 0) hints.push('当前各子量表均未超参考线，暂无明确解离症状指向；若仍有明显困扰，建议持续关注。');

const norms = [
  '社区（非临床）样本平均约为 12.9%（SD≈13.3）；解离在 18–20 岁左右最高，随年龄逐渐下降。',
  'DID 临床样本平均约为 56.8%；完整版 218 题 MID 中：DID≈51、OSDD-1≈39。',
  '约 10% 的人一生中可能符合某种解离障碍的标准；多数功能性解离属于对创伤/高压的适应反应。',
  '与 DES-II 相比：DES-II 对 DID 很敏感，但常漏诊较轻的解离性失忆、人格解体/现实解体及轻度 OSDD；MID-60 覆盖面更广、每个子量表都有临床参考线。',
];
const caveats = [
  '本量表 0–10 大致表示该体验占总时间的比例；偶尔出现也应给较低分而非 0，“0”仅供完全不存在时选择。',
  '总分很高（尤其 >80）也可能源于：把日常健忘/注意力不集中（如 ADHD）误当失忆、自闭个体对“时间比例”类题目的理解差异、强烈求助意愿甚至故意夸大等，需经面询澄清。',
  '子量表超线只是提示方向，不一定等于患病——需专业人员结合访谈、病史与功能受损情况综合判断。',
];
</script>

<style scoped></style>
