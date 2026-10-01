// 此文件由 scripts/generate-build-time.js 自动生成
// 构建时间：2026/10/01 17:21:41
// 请勿手动修改

export const buildInfo = {
  "timestamp": "2026-10-01T09:21:41.697Z",
  "formattedTime": "2026/10/01 17:21:41",
  "version": "1.0.0"
}

export default defineNuxtPlugin(() => {
    return {
        provide: {
            buildInfo
        }
    }
})
