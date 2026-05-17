<!-- pages/about.vue -->
<template>
  <div class="min-h-screen py-12" style="background-color: var(--bg);">
    <div class="container mx-auto px-4 max-w-4xl">
      <div class="rounded-2xl overflow-hidden" 
           style="background-color: var(--card-bg); box-shadow: var(--shadow-lg);">
        
        <!-- 头部 -->
        <div class="p-8 text-center" style="background-color: var(--primary); color: white;">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
               style="background-color: rgba(255,255,255,0.2);">
            <span class="text-4xl">🧠</span>
          </div>
          <h1 class="text-3xl font-bold mb-2">关于我们</h1>
          <p style="color: rgba(255,255,255,0.9);">心灵驿站</p>
        </div>
        
        <!-- 内容 -->
        <div class="p-8 space-y-6">
          <div>
            <h2 class="text-2xl font-bold mb-3" style="color: var(--text);">我们的使命</h2>
            <p class="leading-relaxed" style="color: var(--text-secondary);">
              我们致力于提供专业、便捷、私密的心理健康测评服务，帮助更多人了解自己的心理状态，
              及时发现潜在的心理健康问题，并引导用户寻求适当的帮助。
              <br/>非常感谢云竹和Olivia，没有他们，我就无法完成这个项目。
            </p>
          </div>
          
          <div>
            <h2 class="text-2xl font-bold mb-3" style="color: var(--text);">专业量表</h2>
            <p class="leading-relaxed" style="color: var(--text-secondary);">
              平台提供多种国际通用的专业心理测评量表，包括抑郁筛查(PHQ-9)、焦虑筛查(GAD-7)、
              压力感知(PSS-10)、症状自评(SCL-90)、抑郁自评(SDS)和焦虑自评(SAS)等，
              均由专业心理学团队审核和维护。
            </p>
          </div>
          
          <div>
            <h2 class="text-2xl font-bold mb-3" style="color: var(--text);">隐私保护</h2>
            <p class="leading-relaxed" style="color: var(--text-secondary);">
              我们高度重视您的隐私安全。所有测评数据仅保存在您的浏览器中，
              不会上传到服务器，确保您的心理健康信息完全由您自己掌控。
            </p>
          </div>
          
          <div>
            <h2 class="text-2xl font-bold mb-3" style="color: var(--text);">免责声明</h2>
            <p class="leading-relaxed" style="color: var(--text-secondary);">
              本平台提供的心理测评结果仅供参考，不能替代专业医疗诊断。
              如果您感到明显的心理困扰，请及时寻求专业心理咨询师或医生的帮助。
            </p>
          </div>
          
          <div class="p-4 rounded-lg" style="background-color: var(--warning-bg);">
            <h3 class="font-semibold mb-2" style="color: var(--text);">📞 紧急求助</h3>
            <p class="text-sm" style="color: var(--warning-text);">
              如果您有自伤、伤人的念头，或感到无法应对当前困境，请立即拨打：
              <br>• 希望24热线：400-161-9995（全国心理援助）
              <br>• 北京心理危机研究与干预中心：010-82951332
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>