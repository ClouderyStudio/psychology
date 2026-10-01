/**
 * 云端存档的自动同步挂钩（仅客户端）。
 *
 * 两个触发点：
 *  1. 打开站点：先问一次登录状态，已登录且没关自动同步就补一次全量同步
 *     （换设备后第一次打开，历史记录就是这样补齐的）；
 *  2. 本机存档变化：新测评完成、备注或 AI 解读改动都会广播
 *     `psychology:result-saved`（见 utils/result-store.ts），登录时随手把这一条传上去。
 *
 * 未登录、关掉自动同步、或 ClouderyApi 不可达时都静默跳过，不影响本机使用。
 */
export default defineNuxtPlugin(() => {
  const auth = useAuth()
  const cloud = useCloudSync()

  cloud.init()

  window.addEventListener('psychology:result-saved', (event: Event) => {
    const detail = (event as CustomEvent<{ key?: string }>).detail
    void cloud.uploadOne(detail?.key ?? null)
  })

  void auth.refresh().then(() => {
    if (auth.isAuthed.value && cloud.autoSync.value) void cloud.syncNow()
  })
})
