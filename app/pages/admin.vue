<template>
  <div class="min-h-screen" style="background-color: var(--bg);">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div class="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <NuxtLink to="/" class="text-sm" style="color: var(--primary);">← 返回首页</NuxtLink>
          <h1 class="text-2xl font-bold mt-1" style="color: var(--text);">📝 试卷后台管理</h1>
          <p class="text-sm" style="color: var(--text-muted);">试卷数据存储于 ClouderyApi 数据库，经鉴权管理</p>
        </div>
        <div class="text-right">
          <div v-if="auth === 'authed'" class="text-sm mb-1" style="color: var(--text-secondary);">当前账号：{{ user?.username }}</div>
          <button v-if="auth === 'authed'" @click="logout" class="px-3 py-1.5 rounded-lg text-sm" style="background-color: var(--primary-light); color: var(--primary);">退出登录</button>
          <button v-else-if="auth === 'unauth'" @click="login" class="px-3 py-1.5 rounded-lg text-sm" style="background-color: var(--primary); color: white;">使用 Cloud 账号登录</button>
        </div>
      </div>

      <div v-if="auth === 'checking'" class="text-center py-16" style="color: var(--text-muted);">正在检查登录状态…</div>

      <div v-else-if="auth === 'unauth' || auth === 'unknown'" class="p-10 text-center rounded-xl" style="background-color: var(--card-bg);">
        <div class="text-4xl mb-3">🔐</div>
        <p class="mb-1 font-medium" style="color: var(--text);">请先登录</p>
        <p class="text-sm mb-4" style="color: var(--text-muted);">使用 Cloudery 账号登录后，管理员可管理内部试卷。</p>
        <button @click="login" class="px-5 py-2 rounded-lg font-medium" style="background-color: var(--primary); color: white;">前往登录</button>
      </div>

      <div v-else>
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-semibold" style="color: var(--text);">试卷列表（{{ papers.length }}）</h2>
          <button @click="openCreate" class="px-3 py-1.5 rounded-lg text-sm font-medium" style="background-color: var(--special); color: white;">＋ 新增试卷</button>
        </div>
        <div v-if="loading" class="text-center py-10" style="color: var(--text-muted);">加载中…</div>
        <div v-else-if="error" class="p-4 rounded-lg mb-4" style="background-color: var(--warning-bg); color: var(--warning-text);">{{ error }}</div>
        <div v-else class="space-y-2">
          <div v-for="p in papers" :key="p.id" class="flex items-center justify-between p-4 rounded-xl" style="background-color: var(--card-bg);">
            <div>
              <div class="font-semibold" style="color: var(--text);">{{ p.name }}</div>
              <div class="text-xs mt-0.5" style="color: var(--text-muted);">ID: {{ p.id }} · {{ p.sections?.length || 0 }} 个章节</div>
            </div>
            <div class="flex items-center gap-2">
              <button @click="openEdit(p)" class="px-3 py-1 rounded-lg text-sm" style="background-color: var(--primary-light); color: var(--primary);">编辑</button>
              <button @click="removePaper(p)" class="px-3 py-1 rounded-lg text-sm" style="background-color: var(--symptom-light); color: var(--symptom);">删除</button>
            </div>
          </div>
          <p v-if="!papers.length" class="text-center py-8" style="color: var(--text-muted);">暂无试卷，点击“新增试卷”创建。</p>
        </div>
        <div v-if="editorOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4" style="background-color: rgba(0,0,0,0.5);">
          <div class="rounded-xl w-full max-w-2xl p-6 space-y-3" style="background-color: var(--card-bg);">
            <div class="flex items-center justify-between">
              <h3 class="font-bold" style="color: var(--text);">{{ editing ? '编辑试卷' : '新增试卷' }}</h3>
              <button @click="editorOpen = false" style="color: var(--text-muted);">✕</button>
            </div>
            <div><label class="text-sm block mb-1" style="color: var(--text-secondary);">试卷 ID</label><input v-model="formId" :disabled="editing" class="w-full px-3 py-2 rounded-lg" style="background-color: var(--bg); color: var(--text);" placeholder="如 A / B" /></div>
            <div><label class="text-sm block mb-1" style="color: var(--text-secondary);">试卷名称</label><input v-model="formName" class="w-full px-3 py-2 rounded-lg" style="background-color: var(--bg); color: var(--text);" placeholder="如 计算机 A卷" /></div>
            <div><label class="text-sm block mb-1" style="color: var(--text-secondary);">内容（JSON：sections 数组）</label><textarea v-model="formJson" rows="14" class="w-full px-3 py-2 rounded-lg font-mono text-xs" style="background-color: var(--bg); color: var(--text);"></textarea></div>
            <p v-if="saveError" class="text-sm p-2 rounded" style="background-color: var(--warning-bg); color: var(--warning-text);">{{ saveError }}</p>
            <div class="flex justify-end gap-2 pt-1">
              <button @click="editorOpen = false" class="px-4 py-2 rounded-lg text-sm" style="background-color: var(--bg); color: var(--text-secondary);">取消</button>
              <button @click="save" :disabled="saving" class="px-4 py-2 rounded-lg text-sm font-medium" style="background-color: var(--primary); color: white;">{{ saving ? '保存中…' : '保存' }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const base = (config.public.clouderyApiBase as string) || 'https://localhost:7288'
const route = useRoute()

function loginRedirectUri() {
  return window.location.origin + '/admin?login_return=1'
}

async function handleLoginCallback() {
  const code = route.query.code as string | undefined
  const state = route.query.state as string | undefined
  if (!code || !state) return
  try {
    await $fetch(base + '/identity/auth/callback', {
      method: 'POST',
      body: { code, state, redirectUri: loginRedirectUri() },
      credentials: 'include',
    })
    if (window.opener) { window.close() }
    else { auth.value = 'authed'; loadPapers() }
  } catch (e: any) {
    error.value = '登录回调失败：' + (e?.data?.message || e?.message || '未知错误')
  }
}

const auth = ref<'unknown' | 'checking' | 'authed' | 'unauth'>('unknown')
const user = ref<any>(null)
const papers = ref<any[]>([])
const loading = ref(false)
const error = ref('')
const editorOpen = ref(false)
const editing = ref(false)
const formId = ref('')
const formName = ref('')
const formJson = ref('')
const saveError = ref('')
const saving = ref(false)
let pollTimer: any = null

async function checkAuth() {
  try {
    const r = await $fetch<{ isAuthenticated: boolean; user?: any }>(base + '/identity/auth/status', { credentials: 'include' })
    if (r?.isAuthenticated) {
      auth.value = 'authed'
      user.value = r.user || null
      stopPolling()
      loadPapers()
    } else {
      auth.value = 'unauth'
    }
  } catch {
    auth.value = 'unknown'
  }
}
function stopPolling() { if (pollTimer) { clearInterval(pollTimer); pollTimer = null } }

async function login() {
  try {
    const cfg = await $fetch<{ casdoor: { endpoint: string; clientId: string; scope: string }; callbackUri: string }>(base + '/identity/auth/config')
    const s = await $fetch<{ state: string }>(base + '/identity/auth/state', { credentials: 'include' })
    const p = new URLSearchParams({ client_id: cfg.casdoor.clientId, redirect_uri: loginRedirectUri(), response_type: 'code', scope: cfg.casdoor.scope, state: s.state })
    window.open(cfg.casdoor.endpoint + '/login/oauth/authorize?' + p.toString(), '_blank')
    stopPolling()
    pollTimer = setInterval(checkAuth, 3000)
  } catch (e: any) {
    error.value = '发起登录失败：' + (e?.data?.message || e?.message || '请检查 ClouderyApi 是否运行')
  }
}

async function logout() {
  try { await $fetch(base + '/identity/auth/logout', { method: 'POST', credentials: 'include' }) } catch {}
  auth.value = 'unauth'
  user.value = null
  papers.value = []
}

async function loadPapers() {
  if (loading.value) return
  loading.value = true
  error.value = ''
  try {
    papers.value = await $fetch<any[]>(base + '/exam/ExamPapers')
  } catch (e: any) {
    error.value = '获取试卷失败：' + (e?.data?.message || e?.message || 'ClouderyApi 不可用')
  } finally { loading.value = false }
}

function openCreate() {
  editing.value = false
  formId.value = ''
  formName.value = ''
  formJson.value = "[\n  {\n    \"title\": \"一、题型\",\n    \"pointsPerQuestion\": 1,\n    \"questions\": [\n      { \"text\": \"题目内容\", \"answer\": \"A\" }\n    ]\n  }\n]"
  saveError.value = ''
  editorOpen.value = true
}

function openEdit(p: any) {
  editing.value = true
  formId.value = p.id
  formName.value = p.name
  formJson.value = JSON.stringify(p.sections || [], null, 2)
  saveError.value = ''
  editorOpen.value = true
}

async function save() {
  let sections: any
  try { sections = JSON.parse(formJson.value) } catch { saveError.value = 'JSON 格式有误，请检查'; return }
  if (!Array.isArray(sections)) { saveError.value = '内容必须是 sections 数组'; return }
  if (!formName.value.trim()) { saveError.value = '请填写试卷名称'; return }
  saving.value = true
  saveError.value = ''
  try {
    const body = { id: formId.value || undefined, name: formName.value.trim(), sections }
    if (editing.value) {
      await $fetch(base + '/exam/ExamPapers/' + formId.value, { method: 'PUT', body, credentials: 'include' })
    } else {
      await $fetch(base + '/exam/ExamPapers', { method: 'POST', body, credentials: 'include' })
    }
    editorOpen.value = false
    loadPapers()
  } catch (e: any) {
    if (e?.statusCode === 401) auth.value = 'unauth'
    else if (e?.statusCode === 403) saveError.value = '无管理员权限，操作被拒绝'
    else saveError.value = '保存失败：' + (e?.data?.message || e?.message || '未知错误')
  } finally { saving.value = false }
}

async function removePaper(p: any) {
  if (!window.confirm('确定删除试卷「' + p.name + '」吗？')) return
  try {
    await $fetch(base + '/exam/ExamPapers/' + p.id, { method: 'DELETE', credentials: 'include' })
    loadPapers()
  } catch (e: any) {
    if (e?.statusCode === 403) error.value = '无管理员权限，操作被拒绝'
    else error.value = '删除失败：' + (e?.data?.message || e?.message || '未知错误')
  }
}

onMounted(() => { checkAuth(); handleLoginCallback() })
onBeforeUnmount(stopPolling)
</script>