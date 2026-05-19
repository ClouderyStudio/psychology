<template>
  <div class="min-h-screen py-12" style="background-color: var(--bg);">
    <div class="container mx-auto px-4 max-w-4xl">
      <div class="rounded-2xl overflow-hidden" 
           style="background-color: var(--card-bg); box-shadow: var(--shadow-lg);">
        
        <!-- 头部 -->
        <div class="p-8 text-center" style="background-color: var(--special); color: white;">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
               style="background-color: rgba(255,255,255,0.2);">
            <span class="text-4xl">📚</span>
          </div>
          <h1 class="text-3xl font-bold mb-2">心理资源</h1>
          <p style="color: rgba(255,255,255,0.9);">专业帮助与自助资源</p>
        </div>
        
        <!-- 内容 -->
        <div class="p-8 space-y-6">
          <!-- 求助热线 -->
          <div>
            <h2 class="text-2xl font-bold mb-4" style="color: var(--text);">📞 心理援助热线</h2>
            <div class="space-y-3">
              <div class="p-4 rounded-lg" style="background-color: var(--bg);">
                <h3 class="font-semibold mb-1" style="color: var(--text);">希望24热线</h3>
                <p class="text-lg font-mono" style="color: var(--primary);">400-161-9995</p>
                <p class="text-sm" style="color: var(--text-muted);">全国心理危机干预热线，24小时服务</p>
              </div>
              
              <div class="p-4 rounded-lg" style="background-color: var(--bg);">
                <h3 class="font-semibold mb-1" style="color: var(--text);">北京心理危机研究与干预中心</h3>
                <p class="text-lg font-mono" style="color: var(--primary);">010-82951332</p>
                <p class="text-sm" style="color: var(--text-muted);">专业心理危机干预服务</p>
              </div>
              
              <div class="p-4 rounded-lg" style="background-color: var(--bg);">
                <h3 class="font-semibold mb-1" style="color: var(--text);">青少年心理援助热线</h3>
                <p class="text-lg font-mono" style="color: var(--primary);">12355</p>
                <p class="text-sm" style="color: var(--text-muted);">共青团青少年服务台</p>
              </div>
            </div>
          </div>
          
          <!-- 专业平台 -->
          <div>
            <h2 class="text-2xl font-bold mb-4" style="color: var(--text);">💻 专业心理咨询平台</h2>
            <div class="grid md:grid-cols-2 gap-4">
              <div class="p-4 rounded-lg cursor-pointer transition-all hover:transform hover:-translate-y-1"
                   style="background-color: var(--primary-light); box-shadow: var(--shadow-sm);"
                   @click="openLink('https://www.jiandanxinli.com')">
                <h3 class="font-semibold mb-1" style="color: var(--text);">简单心理</h3>
                <p class="text-sm" style="color: var(--text-secondary);">专业的心理咨询平台，提供在线咨询服务</p>
              </div>
              
              <div class="p-4 rounded-lg cursor-pointer transition-all hover:transform hover:-translate-y-1"
                   style="background-color: var(--personality-bg); box-shadow: var(--shadow-sm);"
                   @click="openLink('https://www.xinli001.com/')">
                <h3 class="font-semibold mb-1" style="color: var(--text);">壹心理</h3>
                <p class="text-sm" style="color: var(--text-secondary);">心理健康服务平台，提供科普文章和咨询服务</p>
              </div>
            </div>
          </div>
          
          <!-- 自助资源 -->
          <div>
            <h2 class="text-2xl font-bold mb-4" style="color: var(--text);">📖 自助资源推荐</h2>
            <div class="space-y-3">
              <div class="p-4 rounded-lg" style="background-color: var(--special-bg);">
                <h3 class="font-semibold mb-2" style="color: var(--text);">正念冥想</h3>
                <p class="text-sm" style="color: var(--text-secondary);">
                  推荐App：潮汐、Calm、Headspace<br>
                  每天10分钟的正念练习可以有效缓解焦虑和压力
                </p>
              </div>
              
              <div class="p-4 rounded-lg" style="background-color: var(--special-bg);">
                <h3 class="font-semibold mb-2" style="color: var(--text);">自助书籍</h3>
                <p class="text-sm" style="color: var(--text-secondary);">
                  《伯恩斯新情绪疗法》- 认知行为疗法经典<br>
                  《当下的力量》- 正念与心灵成长<br>
                  《也许你该找个人聊聊》- 心理治疗故事
                </p>
              </div>
              
              <div class="p-4 rounded-lg" style="background-color: var(--special-bg);">
                <h3 class="font-semibold mb-2" style="color: var(--text);">在线课程</h3>
                <p class="text-sm" style="color: var(--text-secondary);">
                  中国大学MOOC：心理学与生活、积极心理学<br>
                  Coursera：The Science of Well-Being
                </p>
              </div>
            </div>
          </div>
          
          <!-- 紧急情况 -->
          <div class="p-4 rounded-lg" style="background-color: var(--warning-bg); border-left: 4px solid var(--warning-border);">
            <h3 class="font-semibold mb-2" style="color: var(--text);">⚠️ 紧急情况</h3>
            <p class="text-sm" style="color: var(--warning-text);">
              如果您或您认识的人处于危机状态，请立即拨打当地紧急电话(120)或前往最近的医院急诊室。
              不要独自承受，寻求帮助是勇敢的表现。
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $confirm } = useNuxtApp()

const openLink = (url: string) => {
  $confirm({
    title: '确认',
    message: `您即将打开以下不属于我们的链接：\n${url}\n是否继续？`,
    onConfirm: () => {
      window.open(url, '_blank')
    }})
}
</script>