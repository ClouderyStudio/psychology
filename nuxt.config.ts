import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ['@pinia/nuxt'],

  css: ['~/assets/css/tailwind.css'],

  app: {
    head: {
      script: [
        {
          // 首屏内联脚本：在首次绘制前从 localStorage 恢复主题与字号，
          // 避免刷新时先亮后暗、先小后大的闪烁（hydration 后由 useTheme / useFontScale 接管）。
          // 注意：这里的 storage key 必须与 useTheme.ts、useFontScale.ts 保持一致。
          innerHTML: [
            '(function(){try{',
            'var d=document.documentElement;',
            "var t=localStorage.getItem('psychology-theme');",
            "var a=localStorage.getItem('psychology-theme-accent');",
            "var f=localStorage.getItem('psychology-font-scale');",
            "var dark=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);",
            "d.setAttribute('data-theme',dark?'dark':'light');",
            "d.setAttribute('data-accent',a||'default');",
            "d.setAttribute('data-font-scale',(f==='large'||f==='xlarge')?f:'normal');",
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