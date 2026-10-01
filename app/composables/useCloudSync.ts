import {
  cloudRecordToLocalResult,
  localKeyForCloud,
  planCloudSync,
  toUploadBody,
  type CloudResult,
} from '~/utils/cloud-results'
import {
  getResultRecord,
  importCloudRecord,
  listResultRecords,
  markCloudRecord,
  removeResultRecord,
} from '~/utils/result-store'

/**
 * 登录用户的云端存档同步。
 *
 * 策略（与 ClouderyApi /exam/results 的约定一致）：
 *  - 上传：本机有而云端没有的记录；本机记录键就是上传用的 clientKey，重复上传幂等；
 *  - 下载：云端有而本机没有的记录（换设备后第一次打开就能看到全部历史）；
 *  - 两端都有：只补一个 cloudId，不动内容。
 *
 * 只有登录用户、且开关打开时才会发请求；未登录用户的一切都留在本机。
 * 同步计划由 utils/cloud-results.ts 的纯函数算出，这里只负责发请求和落盘。
 */
const AUTO_SYNC_KEY = 'psychology-cloud-sync'

export interface CloudSyncSummary {
  uploaded: number
  total: number
}

export function useCloudSync() {
  const auth = useAuth()
  const apiBase = auth.apiBase

  const syncing = useState('cloud:syncing', () => false)
  const autoSync = useState('cloud:autoSync', () => true)
  const total = useState('cloud:total', () => 0)
  const lastSyncedAt = useState<number | null>('cloud:lastSyncedAt', () => null)
  const error = useState('cloud:error', () => '')
  const ready = useState('cloud:ready', () => false)

  /** 读取本机保存的自动同步开关（仅客户端、只做一次） */
  function init(): void {
    if (ready.value || import.meta.server) return
    ready.value = true
    try {
      if (window.localStorage.getItem(AUTO_SYNC_KEY) === 'off') autoSync.value = false
    } catch {
      // 存储不可用：保持默认开启
    }
  }

  function setAutoSync(on: boolean): void {
    autoSync.value = on
    try {
      window.localStorage.setItem(AUTO_SYNC_KEY, on ? 'on' : 'off')
    } catch {
      // 忽略
    }
  }

  // 绕开 Nuxt 的 $fetch 路由类型推导：URL 是运行时拼的，泛型重载会在这里爆栈
  // （TS2321 Excessive stack depth comparing types）
  const fetchRaw = $fetch as unknown as (url: string, opts?: Record<string, any>) => Promise<any>
  function api<T>(path: string, init?: Record<string, any>): Promise<T> {
    return fetchRaw(apiBase + path, { credentials: 'include', ...(init || {}) }) as Promise<T>
  }

  /** 用云端返回的全量列表补齐本机存档（多平台共享就发生在这里） */
  function applyServerRecords(records: CloudResult[]): void {
    const local = listResultRecords()
    const localKeys = new Map(local.map((r) => [r.key, r] as const))
    const byCloudId = new Map<string, string>()
    for (const record of local) {
      const id = record.result?.cloudId
      if (typeof id === 'string' && id) byCloudId.set(id, record.key)
    }

    for (const record of records) {
      const clientKey = typeof record.clientKey === 'string' ? record.clientKey : ''
      const existingKey =
        (clientKey && localKeys.has(clientKey) ? clientKey : undefined) || byCloudId.get(record.id)

      if (!existingKey) {
        importCloudRecord(localKeyForCloud(record), cloudRecordToLocalResult(record))
        continue
      }
      if (!byCloudId.has(record.id)) markCloudRecord(existingKey, record.id)
    }

    total.value = records.length
  }

  /** 全量同步：先取回云端列表，再按计划上传/下载 */
  async function syncNow(): Promise<CloudSyncSummary | null> {
    init()
    if (import.meta.server || !auth.isAuthed.value || syncing.value) return null

    syncing.value = true
    error.value = ''
    try {
      let cloud = await api<{ results?: CloudResult[] }>('/exam/results')
      let records = Array.isArray(cloud?.results) ? cloud.results : []

      const plan = planCloudSync(listResultRecords(), records)
      if (plan.upload.length) {
        // 服务端单次上限 200 条，这里按 100 条一批，失败批次不影响其它批次
        for (let i = 0; i < plan.upload.length; i += 100) {
          const chunk = plan.upload.slice(i, i + 100)
          const res = await api<{ results?: CloudResult[] }>('/exam/results/sync', {
            method: 'POST',
            body: { records: chunk.map((item) => item.body) },
          })
          if (Array.isArray(res?.results)) {
            records = res.results
            applyServerRecords(records)
          }
        }
      }

      applyServerRecords(records)
      lastSyncedAt.value = Date.now()
      return { uploaded: plan.upload.length, total: records.length }
    } catch (e: any) {
      error.value = e?.data?.message || e?.message || '云端同步失败，请稍后重试'
      return null
    } finally {
      syncing.value = false
    }
  }

  /** 单条上传（新测评完成、备注或 AI 解读改动后触发） */
  async function uploadOne(key: string | null): Promise<boolean> {
    init()
    if (!key || import.meta.server || !auth.isAuthed.value || !autoSync.value) return false

    const result = getResultRecord(key)
    if (!result) return false
    const body = toUploadBody(key, result)
    if (!body) return false

    try {
      const res = await api<{ results?: CloudResult[] }>('/exam/results', { method: 'POST', body })
      if (Array.isArray(res?.results)) applyServerRecords(res.results)
      lastSyncedAt.value = Date.now()
      return true
    } catch (e: any) {
      error.value = e?.data?.message || e?.message || '云端上传失败'
      return false
    }
  }

  /** 手动触发一次同步（账号页/历史页按钮） */
  async function syncManually(): Promise<CloudSyncSummary | null> {
    if (!auth.isAuthed.value) return null
    setAutoSync(true)
    return syncNow()
  }

  /** 删除云端的一条记录（按云端 Id 或 clientKey） */
  async function removeCloud(idOrKey: string): Promise<boolean> {
    if (!idOrKey || !auth.isAuthed.value) return false
    try {
      await api('/exam/results/' + encodeURIComponent(idOrKey), { method: 'DELETE' })
      total.value = Math.max(0, total.value - 1)
      return true
    } catch (e: any) {
      error.value = e?.data?.message || e?.message || '删除云端记录失败'
      return false
    }
  }

  /** 云端记录列表（账号页展示用；同时刷新云端条数） */
  async function listCloud(): Promise<CloudResult[]> {
    if (!auth.isAuthed.value) return []
    try {
      const res = await api<{ results?: CloudResult[] }>('/exam/results')
      const records = Array.isArray(res?.results) ? res.results : []
      total.value = records.length
      return records
    } catch (e: any) {
      error.value = e?.data?.message || e?.message || '读取云端记录失败'
      return []
    }
  }

  /**
   * 彻底删除一条记录：云端删掉的同时也删掉本机那份。
   * 只删云端的话，本机记录下一次同步又会被传回去（看起来像删不掉）。
   */
  async function removeEverywhere(cloudId: string, clientKey?: string | null): Promise<boolean> {
    const ok = await removeCloud(cloudId)

    const local = listResultRecords()
    const target =
      (clientKey ? local.find((r) => r.key === clientKey) : undefined) ||
      local.find((r) => r.result?.cloudId === cloudId)
    if (target) removeResultRecord(target.key)

    return ok
  }

  /** 清空该账号的云端记录 */
  async function clearCloud(): Promise<number> {
    if (!auth.isAuthed.value) return 0
    try {
      const res = await api<{ deleted?: number }>('/exam/results', { method: 'DELETE' })
      total.value = 0
      return res?.deleted ?? 0
    } catch (e: any) {
      error.value = e?.data?.message || e?.message || '清空云端记录失败'
      return 0
    }
  }

  return {
    syncing,
    autoSync,
    total,
    lastSyncedAt,
    error,
    init,
    setAutoSync,
    syncNow,
    syncManually,
    uploadOne,
    listCloud,
    removeCloud,
    removeEverywhere,
    clearCloud,
  }
}
