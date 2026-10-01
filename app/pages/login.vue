<template>
  <div class="min-h-screen py-12" style="background-color: var(--bg);">
    <div class="container mx-auto px-4 max-w-xl">
      <ClientOnly>
        <div class="rounded-2xl p-8 text-center" style="background-color: var(--card-bg); box-shadow: var(--shadow-sm);">
          <div class="text-4xl mb-3">👤</div>
          <h1 class="text-2xl font-bold mb-2" style="color: var(--text);">
            登录<span style="color: var(--primary);">心灵驿站</span>
          </h1>
          <p class="text-sm mb-6" style="color: var(--text-secondary);">
            用 Casdoor 账号登录，测评记录就能在多台设备之间共享
          </p>

          <!-- 正在跳转 / 处理回调 -->
          <div v-if="phase === 'working'" class="py-6">
            <div class="text-base" style="color: var(--text-secondary);">正在登录，请稍候…</div>
          </div>

          <!-- 出错 -->
          <div v-else-if="phase === 'error'" class="py-2">
            <div class="rounded-xl p-4 mb-5 text-sm text-left"
              style="background-color: var(--warning-bg); color: var(--warning-text);">
              ⚠️ {{ errorMessage }}
            </div>
            <button class="px-6 py-2.5 rounded-lg font-medium transition-all w-full mb-3"
              :style="{ backgroundColor: 'var(--primary)', color: 'white' }" @click="startLogin">
              重新登录
            </button>
            <button class="px-6 py-2.5 rounded-lg text-sm transition-all w-full"
              style="background-color: var(--bg); color: var(--text-secondary);" @click="goBack">
              先不登录，返回继续使用
            </button>
          </div>

          <!-- 未登录：入口 + 说明 -->
          <div v-else>
            <div class="text-left rounded-xl p-4 mb-6 text-sm space-y-2"
              style="background-color: var(--bg); color: var(--text-secondary);">
              <div>✅ 登录后：换一台手机或电脑，也能看到全部历史记录</div>
              <div>✅ 记录只存在你自己的账号下，接口按登录用户隔离，别人读不到</div>
              <div>✅ 不登录也能照常用：结果仍然保存在本设备，随时可以再登录上传</div>
              <div>⏳ 首次登录会把本机已有记录一并同步到云端</div>
            </div>
            <button class="px-6 py-2.5 rounded-lg font-medium transition-all w-full mb-3"
              :style="{ backgroundColor: 'var(--primary)', color: 'white', boxShadow: 'var(--shadow-sm)' }"
              @click="startLogin">
              使用 Casdoor 登录
            </button>
            <button class="px-6 py-2.5 rounded-lg text-sm transition-all w-full"
              style="background-color: var(--bg); color: var(--text-secondary);" @click="goBack">
              返回
            </button>
          </div>
        </div>

        <p class="text-xs text-center mt-6" style="color: var(--text-muted);">
          登录由 ClouderyApi 的身份服务（Casdoor）完成，本站不接触你的账号密码。
        </p>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const auth = useAuth()
const cloud = useCloudSync()

const phase = ref<'idle' | 'working' | 'error'>('idle')
const errorMessage = ref('')
const returnTo = ref('/account')

function describeError(e: any, fallback: string): string {
  return e?.data?.message || e?.data?.statusMessage || e?.message || fallback
}

/** 处理 Casdoor 回调：URL 里带 code/state 时才动作 */
async function handleCallback(): Promise<void> {
  const code = route.query.code as string | undefined
  const state = route.query.state as string | undefined
  const oauthError = (route.query.error_description || route.query.error) as string | undefined

  if (oauthError) {
    phase.value = 'error'
    errorMessage.value = '授权未完成：' + oauthError
    return
  }
  if (!code || !state) return

  phase.value = 'working'
  try {
    const target = await auth.completeCallback(code, state)
    // 登录成功后立刻补一次全量同步，让历史记录在这台设备上就位
    await cloud.syncNow()
    await navigateTo(target, { replace: true })
  } catch (e: any) {
    phase.value = 'error'
    errorMessage.value = describeError(e, '登录回调失败，请重新登录')
  }
}

async function startLogin(): Promise<void> {
  phase.value = 'working'
  errorMessage.value = ''
  try {
    await auth.login(returnTo.value)
  } catch (e: any) {
    phase.value = 'error'
    errorMessage.value = describeError(e, '发起登录失败，请检查网络后重试')
  }
}

function goBack(): void {
  if (window.history.length > 1) window.history.back()
  else navigateTo('/')
}

onMounted(() => {
  cloud.init()
  // 从别的页面点「登录」过来时带回跳地址
  const from = route.query.return as string | undefined
  if (from && from.startsWith('/')) returnTo.value = from

  if (route.query.code || route.query.state || route.query.error) void handleCallback()
})
</script>
