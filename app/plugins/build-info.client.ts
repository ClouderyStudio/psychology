// 此文件由 scripts/generate-build-time.js 自动生成
// 构建时间：2026/05/22 23:15:26
// 请勿手动修改

export const buildInfo = {
  "timestamp": "2026-05-22T15:15:26.013Z",
  "formattedTime": "2026/05/22 23:15:26",
  "version": "1.0.0"
}

export default defineNuxtPlugin(() => {
    return {
        provide: {
            buildInfo
        }
    }
})
