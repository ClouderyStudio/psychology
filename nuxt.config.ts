import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ['@pinia/nuxt'],

  css: ['~/assets/css/tailwind.css'],

  app: {
    head: {
      script: [
        {
          // 首屏内联脚本：在首次绘制前从 localStorage 恢复主题、字号、字体与字重，
          // 避免刷新时先亮后暗、先小后大、先默认字体再换字体、先细后粗的闪烁
          // （hydration 后由 useTheme / useFontScale / useFontFamily / useFontWeight 接管）。
          // 注意：这里的 storage key 必须与四个 composable 保持一致。
          innerHTML: [
            '(function(){try{',
            'var d=document.documentElement;',
            "var t=localStorage.getItem('psychology-theme');",
            "var a=localStorage.getItem('psychology-theme-accent');",
            "var f=localStorage.getItem('psychology-font-scale');",
            "var ff=localStorage.getItem('psychology-font-family');",
            "var fw=localStorage.getItem('psychology-font-weight');",
            "var dark=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);",
            "d.setAttribute('data-theme',dark?'dark':'light');",
            "d.setAttribute('data-accent',a||'default');",
            "d.setAttribute('data-font-scale',(f==='large'||f==='xlarge')?f:'normal');",
            "d.setAttribute('data-font-family',(ff==='sans'||ff==='serif'||ff==='kai')?ff:'default');",
            "d.setAttribute('data-font-weight',fw==='bold'?'bold':'normal');",
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

  runtimeConfig: {
    public: {
      clouderyApiBase: process.env.NUXT_PUBLIC_CLOUDERY_API_BASE || 'https://localhost:7288',
    },
  },

  compatibilityDate: '2025-07-15'
})