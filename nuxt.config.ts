import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ['@pinia/nuxt'],

  css: ['~/assets/css/tailwind.css'],

  app: {
    head: {
      // 默认简体；繁体由 useHanVariant 在客户端改成 zh-Hant-TW / zh-Hant-HK
      htmlAttrs: { lang: 'zh-Hans' },
      script: [
        {
          // 首屏内联脚本：在首次绘制前从 localStorage 恢复主题、字号、字体、字重、字形与无障碍偏好，
          // 避免刷新时先亮后暗、先小后大、先默认字体再换字体、先细后粗、先简体再繁体的闪烁
          // （hydration 后由 useTheme / useFontScale / useFontFamily / useFontWeight / useHanVariant / useA11yPrefs 接管）。
          // 注意：这里的 storage key 必须与六个 composable 保持一致。
          // 字形的文本替换要等挂载后才能做（否则破坏 hydration），此处只负责提前切字体栈与 lang。
          innerHTML: [
            '(function(){try{',
            'var d=document.documentElement;',
            "var t=localStorage.getItem('psychology-theme');",
            "var a=localStorage.getItem('psychology-theme-accent');",
            "var f=localStorage.getItem('psychology-font-scale');",
            "var ff=localStorage.getItem('psychology-font-family');",
            "var fw=localStorage.getItem('psychology-font-weight');",
            "var hv=localStorage.getItem('psychology-variant');",
            "var rm=localStorage.getItem('psychology-reduced-motion');",
            "var dark=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);",
            "d.setAttribute('data-theme',dark?'dark':'light');",
            "d.setAttribute('data-accent',a||'default');",
            "d.setAttribute('data-font-scale',(f==='large'||f==='xlarge')?f:'normal');",
            "d.setAttribute('data-font-family',(ff==='sans'||ff==='serif'||ff==='kai')?ff:'default');",
            "d.setAttribute('data-font-weight',fw==='bold'?'bold':'normal');",
            // 取值必须与 composables/useHanVariant.ts 的 hanVariantOptions 保持一致
            "d.setAttribute('data-variant',(hv==='hant-tw'||hv==='hant-hk')?'hant':'hans');",
            "d.lang=hv==='hant-tw'?'zh-Hant-TW':(hv==='hant-hk'?'zh-Hant-HK':'zh-Hans');",
            // 与 composables/useA11yPrefs.ts 的 A11Y_MOTION_KEY 保持一致
            "d.setAttribute('data-reduced-motion',(rm==='reduce'||rm==='no-preference')?rm:'auto');",
            '}catch(e){}})();',
          ].join(''),
          tagPriority: 'critical',
        },
      ],
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  // 纯静态内容页在构建期预渲染成 HTML：爬虫拿到的是完整静态文档，
  // 不依赖运行时 SSR，也不受接口抖动影响（量表目录页只读本地量表清单）。
  routeRules: {
    '/': { prerender: true },
    '/scales': { prerender: true },
    '/about': { prerender: true },
    '/resources': { prerender: true },
    '/privacy': { prerender: true },
  },

  runtimeConfig: {
    public: {
      // SEO 用站点公开地址（canonical / og:url / sitemap 拼接）；换域名时设这个环境变量
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://pt.cldery.com',
      clouderyApiBase: process.env.NUXT_PUBLIC_CLOUDERY_API_BASE || 'https://localhost:7288',
    },
  },

  compatibilityDate: '2025-07-15'
})