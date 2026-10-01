<template>
  <div class="min-h-screen py-12" style="background-color: var(--bg);">
    <div class="container mx-auto px-4 max-w-3xl">
      <ClientOnly>
        <div class="text-center mb-10">
          <h1 class="text-3xl md:text-4xl font-bold mb-3" style="color: var(--text);">
            我的<span style="color: var(--primary);">账号</span>
          </h1>
          <p class="text-base" style="color: var(--text-secondary);">
            登录后测评记录会保存在云端，换设备也能看到同一份历史
          </p>
        </div>

        <!-- 状态未知/查询中 -->
        <div v-if="auth.status.value === 'unknown' || auth.status.value === 'checking'"
          class="text-center py-12" style="color: var(--text-secondary);">
          正在确认登录状态…
        </div>

        <!-- 未登录 -->
        <div v-else-if="!auth.isAuthed.value" class="rounded-2xl p-8 text-center"
          style="background-color: var(--card-bg); box-shadow: var(--shadow-sm);">
          <div class="text-5xl mb-4">🔐</div>
          <div class="text-xl font-medium mb-2" style="color: var(--text);">尚未登录</div>
          <p class="text-sm mb-6 leading-relaxed" style="color: var(--text-secondary);">
            登录（Casdoor）后，本机已有的测评记录会一并同步到云端；<br />
            不登录也可以继续使用，记录只保存在当前设备上。
          </p>
          <button class="px-6 py-2.5 rounded-lg font-medium transition-all"
            :style="{ backgroundColor: 'var(--primary)', color: 'white', boxShadow: 'var(--shadow-sm)' }"
            @click="startLogin">
            登录 / 注册
          </button>
        </div>

        <!-- 已登录 -->
        <div v-else class="space-y-6">
          <!-- 用户信息 -->
          <div class="rounded-2xl p-6 flex items-center justify-between flex-wrap gap-4"
            style="background-color: var(--card-bg); box-shadow: var(--shadow-sm);">
            <div class="flex items-center gap-4">
              <img v-if="auth.user.value?.avatar" :src="auth.user.value?.avatar" alt="头像"
                class="w-12 h-12 rounded-full object-cover" />
              <div v-else class="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                style="background-color: var(--primary-light);">👤</div>
              <div>
                <div class="font-semibold" style="color: var(--text);">
                  {{ auth.user.value?.username || '已登录用户' }}
                </div>
                <div class="text-xs" style="color: var(--text-muted);">
                  {{ auth.user.value?.email || 'Casdoor 账号' }}
                </div>
              </div>
            </div>
            <button class="text-xs px-3 py-1.5 rounded-lg transition-colors"
              style="background-color: var(--bg); color: var(--text-secondary);" @click="doLogout">
              退出登录
            </button>
          </div>

          <!-- 同步面板 -->
          <div class="rounded-2xl p-6" style="background-color: var(--card-bg); box-shadow: var(--shadow-sm);">
            <div class="flex items-center justify-between flex-wrap gap-3 mb-4">
              <h2 class="font-semibold text-lg" style="color: var(--text);">云端同步</h2>
              <button class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                :disabled="cloud.syncing.value"
                :style="{
                  backgroundColor: cloud.syncing.value ? 'var(--bg)' : 'var(--primary)',
                  color: cloud.syncing.value ? 'var(--text-muted)' : 'white',
                  cursor: cloud.syncing.value ? 'wait' : 'pointer',
                }"
                @click="syncNow">
                {{ cloud.syncing.value ? '同步中…' : '立即同步' }}
              </button>
            </div>

            <div class="grid grid-cols-2 gap-3 mb-4">
              <div class="rounded-xl p-3 text-center" style="background-color: var(--bg);">
                <div class="text-2xl font-semibold" style="color: var(--primary);">{{ localCount }}</div>
                <div class="text-xs mt-1" style="color: var(--text-secondary);">本机记录</div>
              </div>
              <div class="rounded-xl p-3 text-center" style="background-color: var(--bg);">
                <div class="text-2xl font-semibold" style="color: var(--primary);">{{ cloud.total.value }}</div>
                <div class="text-xs mt-1" style="color: var(--text-secondary);">云端记录</div>
              </div>
            </div>

            <label class="flex items-center gap-2 text-sm mb-2 cursor-pointer" style="color: var(--text);">
              <input type="checkbox" :checked="cloud.autoSync.value" @change="toggleAutoSync(($event.target as HTMLInputElement).checked)" />
              自动同步（完成测评后立即上传，打开站点时自动补齐其它设备的记录）
            </label>

            <p class="text-xs" style="color: var(--text-muted);">
              {{ lastSyncedText }}
            </p>

            <p v-if="cloud.error.value" class="text-xs mt-3 rounded-lg p-3"
              style="background-color: var(--warning-bg); color: var(--warning-text);">
              ⚠️ {{ cloud.error.value }}
            </p>
          </div>

          <!-- 云端记录列表 -->
          <div class="rounded-2xl p-6" style="background-color: var(--card-bg); box-shadow: var(--shadow-sm);">
            <div class="flex items-center justify-between flex-wrap gap-3 mb-4">
              <h2 class="font-semibold text-lg" style="color: var(--text);">云端记录</h2>
              <button v-if="cloudRecords.length" class="text-xs px-3 py-1.5 rounded-lg transition-colors"
                style="background-color: var(--warning-bg); color: var(--warning-text);" @click="clearCloudRecords">
                清空云端记录
              </button>
            </div>

            <p v-if="loadingRecords" class="text-sm py-6 text-center" style="color: var(--text-secondary);">
              读取中…
            </p>
            <p v-else-if="!cloudRecords.length" class="text-sm py-6 text-center" style="color: var(--text-secondary);">
              云端还没有记录。完成一份量表后会自动上传，也可以点「立即同步」把本机记录传上去。
            </p>
            <div v-else class="space-y-2">
              <div v-for="item in cloudRecords" :key="item.id"
                class="flex items-center justify-between gap-3 p-3 rounded-xl" style="background-color: var(--bg);">
                <div class="min-w-0">
                  <div class="text-sm font-medium truncate" style="color: var(--text);">
                    {{ item.testTitle || item.testId }}
                  </div>
                  <div class="text-xs" style="color: var(--text-muted);">{{ formatTime(item.savedAt || item.updatedAt) }}</div>
                </div>
                <div class="flex items-center gap-2 flex-shrink-0">
                  <NuxtLink :to="'/result?key=' + encodeURIComponent(item.clientKey || '')"
                    class="text-xs px-3 py-1.5 rounded-lg transition-colors"
                    style="background-color: var(--primary-light); color: var(--primary);">
                    查看
                  </NuxtLink>
                  <button class="text-xs px-3 py-1.5 rounded-lg transition-colors"
                    style="background-color: var(--card-bg); color: var(--warning-text);" @click="removeOne(item)">
                    删除
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import { listResultRecords } from '~/utils/result-store'
import type { CloudResult } from '~/utils/cloud-results'

const { $confirm, $toast } = useNuxtApp()
const auth = useAuth()
const cloud = useCloudSync()

const localCount = ref(0)
const cloudRecords = ref<CloudResult[]>([])
const loadingRecords = ref(false)

const lastSyncedText = computed(() => {
  const at = cloud.lastSyncedAt.value
  if (!at) return '还没有同步过'
  return '上次同步：' + new Date(at).toLocaleString('zh-CN')
})

function formatTime(value?: string | null): string {
  if (!value) return '时间未知'
  const parsed = Date.parse(value)
  return Number.isFinite(parsed) ? new Date(parsed).toLocaleString('zh-CN') : '时间未知'
}

function refreshLocalCount(): void {
  localCount.value = listResultRecords().length
}

async function loadCloudRecords(): Promise<void> {
  if (!auth.isAuthed.value) return
  loadingRecords.value = true
  try {
    cloudRecords.value = await cloud.listCloud()
  } finally {
    loadingRecords.value = false
    refreshLocalCount()
  }
}

async function startLogin(): Promise<void> {
  try {
    await auth.login('/account')
  } catch (e: any) {
    $toast.error(e?.data?.message || e?.message || '发起登录失败，请稍后重试', '登录')
  }
}

async function doLogout(): Promise<void> {
  await auth.logout()
  cloudRecords.value = []
  refreshLocalCount()
  $toast.success('已退出登录，记录仍保留在本机', '完成')
}

async function syncNow(): Promise<void> {
  const summary = await cloud.syncNow()
  await loadCloudRecords()
  if (summary) $toast.success('同步完成：上传 ' + summary.uploaded + ' 条，云端共 ' + summary.total + ' 条', '完成')
  else if (cloud.error.value) $toast.error(cloud.error.value, '同步失败')
}

function toggleAutoSync(on: boolean): void {
  cloud.setAutoSync(on)
  if (on) void cloud.syncNow().then(() => loadCloudRecords())
  else $toast.info('已关闭自动同步，本机记录不再自动上传', '云端同步')
}

function removeOne(item: CloudResult): void {
  $confirm({
    title: '删除记录',
    message: '确定要删除这条记录吗？云端与本机上都会删除，操作不可恢复。',
    onConfirm: async () => {
      await cloud.removeEverywhere(item.id, item.clientKey)
      cloudRecords.value = cloudRecords.value.filter((r) => r.id !== item.id)
      refreshLocalCount()
      $toast.success('已删除该条记录', '完成')
    },
  })
}

function clearCloudRecords(): void {
  $confirm({
    title: '清空云端记录',
    message: '确定要清空云端的所有记录吗？本机记录不受影响，但下次同步可能重新上传本机记录。',
    onConfirm: async () => {
      const deleted = await cloud.clearCloud()
      cloudRecords.value = []
      $toast.success('已清空云端 ' + deleted + ' 条记录', '完成')
    },
  })
}

onMounted(async () => {
  cloud.init()
  refreshLocalCount()
  if (auth.status.value === 'unknown') await auth.refresh()
  if (auth.isAuthed.value) await loadCloudRecords()
})
</script>
