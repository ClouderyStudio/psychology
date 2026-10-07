// 此文件由 scripts/generate-build-time.js 自动生成
// 构建时间：2026/10/07 16:39:37
// 请勿手动修改

export const buildInfo = {
  "timestamp": "2026-10-07T08:39:37.061Z",
  "formattedTime": "2026/10/07 16:39:37",
  "version": "1.0.0"
}

export default defineNuxtPlugin(() => {
    return {
        provide: {
            buildInfo
        }
    }
})
