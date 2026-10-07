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
            <span class="text-4xl">🔒</span>
          </div>
          <h1 class="text-3xl font-bold mb-2">隐私政策</h1>
          <p style="color: rgba(255, 255, 255, 0.9)">
            你的作答与测评结果，默认只留在你自己的设备上
          </p>
        </div>

        <!-- 内容 -->
        <div class="p-8 space-y-8">
          <!-- 生效日期 -->
          <p class="text-sm" style="color: var(--text-muted)">
            生效日期：2026 年 10 月 7 日 · 最近更新：2026 年 10 月 7 日
          </p>

          <!-- 一句话概括 -->
          <div
            class="p-4 rounded-lg"
            style="
              background-color: var(--primary-light);
              border-left: 4px solid var(--primary);
            "
          >
            <h3
              class="font-semibold mb-2 flex items-center gap-2"
              style="color: var(--text)"
            >
              <span>💡</span> 一句话概括
            </h3>
            <p class="text-sm leading-relaxed" style="color: var(--text-secondary)">
              心理测评属于高度敏感的个人信息。我们尽量做到「数据不出设备」：
              作答内容与测评结果默认只保存在你自己的浏览器里；
              只有在<b>提交评分</b>、<b>开启云同步</b>、<b>点击 AI 分析</b>
              这三种你主动触发的情况下，相关数据才会被发送出去。
            </p>
          </div>

          <!-- 我们收集什么 -->
          <div>
            <h2
              class="text-2xl font-bold mb-3 flex items-center gap-2"
              style="color: var(--text)"
            >
              <span>📦</span> 我们收集与不收集什么
            </h2>
            <p class="leading-relaxed mb-3" style="color: var(--text-secondary)">
              <b>不需要注册</b>即可使用全部量表。我们不采集你的姓名、手机号、
              证件号、地理位置或设备标识，也没有接入任何统计分析、广告或行为追踪代码
              （站内不存在 Google Analytics、百度统计、Sentry、热力图等第三方脚本）。
            </p>
            <p class="leading-relaxed" style="color: var(--text-secondary)">
              我们接触到的信息，全部由你在使用过程中主动产生，包括：
              作答选项、量表得分与自动生成的报告、你在结果页填写的备注与称谓，
              以及用于记住外观的界面偏好设置。
            </p>
          </div>

          <!-- 数据存在哪里 -->
          <div>
            <h2
              class="text-2xl font-bold mb-3 flex items-center gap-2"
              style="color: var(--text)"
            >
              <span>💾</span> 数据存在哪里
            </h2>
            <p class="leading-relaxed mb-3" style="color: var(--text-secondary)">
              默认且必要的存储位置就是<b>你的浏览器本机</b>：
            </p>
            <ul
              class="space-y-3 text-sm leading-relaxed"
              style="color: var(--text-secondary)"
            >
              <li>
                <b style="color: var(--text)">作答中的答案</b> ——
                存放在浏览器的 sessionStorage，键名为
                <code class="privacy-code">test_&lt;量表ID&gt;_answers</code>。
                关闭标签页或浏览器后自动清除，不留痕迹。
              </li>
              <li>
                <b style="color: var(--text)">测评结果</b> ——
                存放在浏览器的 localStorage，键名为
                <code class="privacy-code">test_&lt;量表ID&gt;_result_&lt;时间戳&gt;</code>。
                每个量表最多保留 20 条、全部量表合计最多 200 条，超出后自动淘汰最旧的记录。
              </li>
              <li>
                <b style="color: var(--text)">界面偏好</b> ——
                同样存放在 localStorage，键名前缀为
                <code class="privacy-code">psychology-</code>
                （主题、主题色、字号、字体、字重、繁简字形、云同步开关）。
                这些只用于记住你的外观设置，与测评内容本身无关。
              </li>
            </ul>
            <p class="text-sm leading-relaxed mt-3" style="color: var(--text-muted)">
              清除方式：使用浏览器的「清除站点数据」可一次性清空以上全部内容；
              也可以在本站「历史记录」页逐条删除或一键清空。
            </p>
          </div>

          <!-- 数据何时离开设备 -->
          <div>
            <h2
              class="text-2xl font-bold mb-3 flex items-center gap-2"
              style="color: var(--text)"
            >
              <span>📡</span> 数据何时会离开你的设备
            </h2>
            <p class="leading-relaxed mb-3" style="color: var(--text-secondary)">
              只有下面三种情况，且都需要你主动触发：
            </p>

            <div class="space-y-4">
              <div class="p-4 rounded-lg" style="background-color: var(--bg)">
                <div class="font-semibold mb-1" style="color: var(--text)">
                  1. 提交评分（每次做完一份量表都会发生）
                </div>
                <p class="text-sm leading-relaxed" style="color: var(--text-secondary)">
                  浏览器把你的作答发送到本站服务端（<code class="privacy-code">POST /api/submit</code>），
                  服务端据此完成评分并把结果返回给浏览器。服务端<b>不写数据库、不持久化存储</b>，
                  也不会保存或回传你的作答明细 —— 请求结束后数据即被释放。
                  为防止滥用，该接口按来源 IP 做频率限制（10 分钟内最多 30 次）。
                </p>
              </div>

              <div class="p-4 rounded-lg" style="background-color: var(--bg)">
                <div class="font-semibold mb-1" style="color: var(--text)">
                  2. 云同步（默认关闭，需你登录后手动开启）
                </div>
                <p class="text-sm leading-relaxed" style="color: var(--text-secondary)">
                  登录云术账号并打开「云同步」开关后，测评结果会保存到云端
                  （ClouderyApi 的 <code class="privacy-code">/exam/results</code> 系列接口），
                  方便你在不同设备上查看。你可以随时关闭同步、删除单条记录，
                  或在账号页「清空云端记录」一次性删除全部云端数据。
                </p>
              </div>

              <div class="p-4 rounded-lg" style="background-color: var(--bg)">
                <div class="font-semibold mb-1" style="color: var(--text)">
                  3. AI 分析（需你阅读提示后主动点击按钮）
                </div>
                <p class="text-sm leading-relaxed" style="color: var(--text-secondary)">
                  结果页<b>不会自动运行 AI 分析</b>。首次进入时会先展示一段说明，
                  只有你点下「我已了解，开始分析」，页面才会把该次测评的分数信息发送到
                  <code class="privacy-code">POST /exam/result-analysis</code>，
                  由服务端转交大模型生成解读文字。发送内容包括量表标识、得分与满分、
                  等级、严重度、维度分以及个人画像字段；
                  <b>你填写的备注默认不会发送</b>，只有你主动勾选「包含我的备注」时才会一并发送。
                  点过「暂不需要」或尚未点击时，分数、等级和建议仍照常显示，数据不会离开你的设备；
                  同意是<b>按量表分别记录</b>的，换一个量表会重新询问；这一记录只存在本机浏览器
                  （localStorage），可以随浏览器数据一起清除。
                </p>
              </div>
            </div>

            <p class="text-sm leading-relaxed mt-3" style="color: var(--text-muted)">
              另外，结果页的「导出 PNG / PDF」完全在你的浏览器内完成
              （html2canvas + jsPDF 本地渲染），不会上传任何数据。
            </p>
          </div>

          <!-- AI 分析提醒 -->
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
              <span>🤖</span> 关于 AI 分析
            </h3>
            <p class="text-sm leading-relaxed" style="color: var(--warning-text)">
              AI 解读由第三方大模型生成，属于可选功能。如果你不希望任何分数离开你的设备，
              <b>请不要点击 AI 分析按钮</b> —— 这不会影响你查看自己的分数、等级与建议。
            </p>
          </div>

          <!-- 账号与 Cookie -->
          <div>
            <h2
              class="text-2xl font-bold mb-3 flex items-center gap-2"
              style="color: var(--text)"
            >
              <span>🔐</span> 账号与 Cookie
            </h2>
            <p class="leading-relaxed" style="color: var(--text-secondary)">
              本站没有自建账号体系，登录与退出完全由云术账号服务
              （ClouderyApi 的 <code class="privacy-code">/identity/auth/*</code>）提供。
              登录状态由该服务设置的认证 Cookie 维持，本站自身不写入任何用于追踪、
              统计或广告的 Cookie。未登录状态下，站内不使用 Cookie 存储你的测评数据。
            </p>
          </div>

          <!-- 第三方 -->
          <div>
            <h2
              class="text-2xl font-bold mb-3 flex items-center gap-2"
              style="color: var(--text)"
            >
              <span>🌐</span> 涉及的第三方服务
            </h2>
            <ul
              class="space-y-1 text-sm leading-relaxed"
              style="color: var(--text-secondary)"
            >
              <li>• <b style="color: var(--text)">云术账号与云服务（ClouderyApi）</b>：云同步、AI 分析中转、登录认证。</li>
              <li>• <b style="color: var(--text)">大模型服务商</b>：仅在生成 AI 解读文字时接收前述分数信息。</li>
              <li>• <b style="color: var(--text)">q1.qlogo.cn</b>：仅「关于我们」页的贡献者头像图片从该域名加载。</li>
            </ul>
            <p class="text-sm leading-relaxed mt-3" style="color: var(--text-muted)">
              本站是 AGPL-3.0 开源项目，代码完全公开，欢迎你自行核对以上全部数据流向。
            </p>
          </div>

          <!-- 删除数据 -->
          <div>
            <h2
              class="text-2xl font-bold mb-3 flex items-center gap-2"
              style="color: var(--text)"
            >
              <span>🗑️</span> 如何删除你的数据
            </h2>
            <ul
              class="space-y-1 text-sm leading-relaxed"
              style="color: var(--text-secondary)"
            >
              <li>• <b style="color: var(--text)">本机数据</b>：「历史记录」页 → 清空全部；或使用浏览器清除站点数据。</li>
              <li>• <b style="color: var(--text)">云端数据</b>：「账号」页 → 删除单条记录 / 清空云端记录 / 关闭云同步。</li>
              <li>• <b style="color: var(--text)">其他副本</b>：没有。因为服务端不持久化存储测评数据，删除本机与云端记录后，我们这里不存在可被恢复的副本。</li>
            </ul>
          </div>

          <!-- 未成年人 -->
          <div>
            <h2
              class="text-2xl font-bold mb-3 flex items-center gap-2"
              style="color: var(--text)"
            >
              <span>👶</span> 未成年人
            </h2>
            <p class="leading-relaxed" style="color: var(--text-secondary)">
              若你未满 14 周岁，请在监护人知情并陪同的情况下使用本站，
              并由监护人协助理解测评结果。未成年人的作答与结果同样只保存在本机；
              如需使用云同步，请先取得监护人同意。
            </p>
          </div>

          <!-- 政策变更 -->
          <div>
            <h2
              class="text-2xl font-bold mb-3 flex items-center gap-2"
              style="color: var(--text)"
            >
              <span>🔄</span> 政策变更
            </h2>
            <p class="leading-relaxed" style="color: var(--text-secondary)">
              如果本站的数据处理方式发生变化（例如新增了会外发数据的服务），
              我们会同步更新本页面并修改顶部的「最近更新」日期。
              本政策与站内实际数据流向保持一致。
            </p>
          </div>

          <!-- 联系我们 -->
          <div>
            <h2
              class="text-2xl font-bold mb-3 flex items-center gap-2"
              style="color: var(--text)"
            >
              <span>📮</span> 联系我们
            </h2>
            <p class="leading-relaxed" style="color: var(--text-secondary)">
              对本政策或你的数据有任何疑问，欢迎通过
              <a
                href="mailto:admin@cldery.com"
                class="privacy-mail"
                style="color: var(--primary)"
                >admin@cldery.com</a
              >
              与我们联系。
            </p>
          </div>

          <!-- 免责声明 -->
          <div class="p-4 rounded-lg" style="background-color: var(--warning-bg)">
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

<script setup lang="ts">
useHead({
  title: "隐私政策 - 心灵驿站",
  meta: [
    {
      name: "description",
      content:
        "心灵驿站隐私政策：作答与测评结果默认只保存在你的浏览器本机，仅在提交评分、开启云同步或使用 AI 分析时才会发送数据。",
    },
  ],
});
</script>

<style scoped>
.privacy-code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.85em;
  padding: 0.1em 0.35em;
  border-radius: 0.25rem;
  background-color: var(--bg);
  color: var(--text);
  word-break: break-all;
}

.privacy-mail {
  transition: opacity 0.2s ease;
  text-decoration: underline;
}

.privacy-mail:hover {
  opacity: 0.8;
}
</style>
