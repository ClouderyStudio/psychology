<template>
  <nav class="sticky top-0 z-50 w-full transition-all duration-300" :class="{ 'shadow-lg': isScrolled }"
    style="background-color: var(--card-bg);">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo 和网站名称 -->
        <div class="flex items-center space-x-3 cursor-pointer" @click="goHome">
          <div class="w-8 h-8 rounded-lg flex items-center justify-center"
            style="background-color: var(--primary-light);">
            <span class="text-xl">🧠</span>
          </div>
          <span class="font-semibold text-lg hidden sm:inline" style="color: var(--text);">
            心灵驿站
          </span>
          <span class="font-semibold text-lg sm:hidden" style="color: var(--text);">
            心灵驿站
          </span>
        </div>

        <!-- 桌面端导航链接 -->
        <div class="hidden md:flex items-center space-x-6">
          <NuxtLink to="/" class="nav-link" :class="{ active: isActive('/') }">
            首页
          </NuxtLink>
          <NuxtLink to="/about" class="nav-link" :class="{ active: isActive('/about') }">
            关于我们
          </NuxtLink>
          <NuxtLink to="/resources" class="nav-link" :class="{ active: isActive('/resources') }">
            心理资源
          </NuxtLink>

          <!-- 主题切换按钮 -->
          <button @click="toggleTheme"
            class="w-8 h-8 rounded-full flex items-center justify-center transition-all"
            style="color: var(--text-secondary);"
            :title="isDark ? '切换到浅色模式' : '切换到深色模式'"
            @mouseenter="elStyle($event, { backgroundColor: 'var(--primary-light)', color: 'var(--primary)' })"
            @mouseleave="elStyle($event, { backgroundColor: 'transparent', color: 'var(--text-secondary)' })">
            <svg v-if="isDark" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>

          <!-- 主题配色选择 -->
          <div ref="accentWrap" class="relative z-40">
            <button @click="accentOpen = !accentOpen"
              class="w-8 h-8 rounded-full flex items-center justify-center transition-all"
              :style="{ backgroundColor: 'var(--primary-light)' }"
              :title="'切换主题配色（当前：' + currentAccentLabel + '）'"
              @mouseenter="elStyle($event, { boxShadow: '0 0 0 2px ' + currentAccentColor })"
              @mouseleave="elStyle($event, { boxShadow: 'none' })">
              <span class="w-4 h-4 rounded-full inline-block" :style="{ backgroundColor: currentAccentColor }"></span>
            </button>
            <div v-if="accentOpen" class="absolute right-0 top-full mt-2 w-48 rounded-xl p-3"
              style="background-color: var(--card-bg); box-shadow: var(--shadow-lg);">
              <div class="text-xs font-medium mb-2" style="color: var(--text-secondary);">主题配色（亮/暗适配）</div>
              <div class="grid grid-cols-3 gap-2">
                <button v-for="opt in accentOptions" :key="opt.id"
                  class="flex flex-col items-center gap-1 rounded-lg p-2 transition-all"
                  :style="{ backgroundColor: 'var(--bg)' }"
                  @click="setAccent(opt.id); accentOpen = false">
                  <span class="w-6 h-6 rounded-full inline-block border"
                    :style="{ backgroundColor: opt.color, borderColor: 'var(--border)', boxShadow: accent === opt.id ? '0 0 0 2px ' + opt.color : 'none' }"></span>
                  <span class="text-[11px] leading-tight text-center" style="color: var(--text);">{{ accentLabel(opt) }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- 进度指示器 -->
          <ClientOnly>
            <div v-if="hasUnfinishedTests" class="relative ml-2 cursor-pointer"
              @click.stop="showProgressPanel = !showProgressPanel">
              <div class="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                style="background-color: var(--warning-bg);"
                @mouseenter="elStyle($event, { backgroundColor: 'var(--warning-border)' })"
                @mouseleave="elStyle($event, { backgroundColor: 'var(--warning-bg)' })">
                <span class="text-sm">📋</span>
              </div>
              <span class="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center"
                style="background-color: var(--primary); color: white;">
                {{ unfinishedCount }}
              </span>
            </div>
          </ClientOnly>

          <!-- 内部测试入口 -->
          <button @click="openInternalTest" class="internal-test-entry" title="内部测试">
            <span>🔐</span> 内部测试
          </button>
        </div>

        <!-- 移动端菜单按钮 -->
        <button @click="toggleMobileMenu" class="md:hidden p-2 rounded-lg transition-colors" style="color: var(--text);"
          @mouseenter="elStyle($event, { backgroundColor: 'var(--primary-light)' })"
          @mouseleave="elStyle($event, { backgroundColor: 'transparent' })">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"></path>
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
            </path>
          </svg>
        </button>
      </div>

      <!-- 进度面板（下拉） -->
      <ClientOnly>
        <div v-if="showProgressPanel && hasUnfinishedTests" class="absolute right-0 mt-2 w-80 rounded-lg shadow-lg z-50"
          style="background-color: var(--card-bg); box-shadow: var(--shadow-lg);">
          <div class="p-4">
            <div class="flex justify-between items-center mb-3">
              <h3 class="font-semibold" style="color: var(--text);">未完成的测评</h3>
              <button @click="clearAllProgress" class="text-xs px-2 py-1 rounded transition-colors"
                style="background-color: var(--warning-bg); color: var(--warning-text);">
                清空全部
              </button>
            </div>
            <div class="space-y-2 max-h-64 overflow-y-auto">
              <div v-for="test in unfinishedTestsList" :key="test.id"
                class="p-2 rounded cursor-pointer transition-colors" @click="continueTest(test.id)"
                @mouseenter="elStyle($event, { backgroundColor: 'var(--bg)' })"
                @mouseleave="elStyle($event, { backgroundColor: 'transparent' })">
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium" style="color: var(--text);">{{ test.title }}</span>
                  <span class="text-xs" style="color: var(--text-muted);">{{ test.completed }}/{{ test.total }}题</span>
                </div>
                <div class="w-full rounded-full h-1 mt-1" style="background-color: var(--primary-light);">
                  <div class="rounded-full h-1"
                    :style="{ width: (test.completed / test.total) * 100 + '%', backgroundColor: 'var(--primary)' }">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ClientOnly>
    </div>

    <!-- 移动端菜单 -->
    <div v-if="mobileMenuOpen" class="md:hidden absolute top-16 left-0 right-0 shadow-lg"
      style="background-color: var(--card-bg);">
      <div class="flex flex-col p-4 space-y-3">
        <NuxtLink to="/" class="mobile-nav-link" :class="{ 'mobile-active': isActive('/') }"
          @click="mobileMenuOpen = false">
          首页
        </NuxtLink>
        <NuxtLink to="/about" class="mobile-nav-link" :class="{ 'mobile-active': isActive('/about') }"
          @click="mobileMenuOpen = false">
          关于我们
        </NuxtLink>
        <NuxtLink to="/resources" class="mobile-nav-link" :class="{ 'mobile-active': isActive('/resources') }"
          @click="mobileMenuOpen = false">
          心理资源
        </NuxtLink>

        <!-- 移动端内部测试入口 -->
        <button @click="openInternalTest" class="mobile-nav-link text-left">
          🔐 内部测试
        </button>

        <!-- 移动端主题切换 -->
        <button @click="toggleTheme"
          class="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors w-full text-left"
          style="color: var(--text);"
          @mouseenter="elStyle($event, { backgroundColor: 'var(--primary-light)' })"
          @mouseleave="elStyle($event, { backgroundColor: 'transparent' })">
          <svg v-if="isDark" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          <span class="text-sm">{{ isDark ? '浅色模式' : '深色模式' }}</span>
        </button>

        <!-- 移动端主题配色 -->
        <div class="pt-2 mt-1 space-y-1.5">
          <div class="text-xs font-medium" style="color: var(--text-secondary);">主题配色</div>
          <div class="flex items-center gap-2">
            <button v-for="opt in accentOptions" :key="opt.id"
              class="w-7 h-7 rounded-full flex items-center justify-center transition-all"
              :style="{ backgroundColor: opt.color, boxShadow: accent === opt.id ? '0 0 0 2px var(--text)' : 'none' }"
              :title="opt.label" @click="setAccent(opt.id)">
            </button>
          </div>
        </div>

        <!-- 移动端进度显示 -->
        <ClientOnly>
          <div v-if="hasUnfinishedTests" class="pt-2 mt-2 border-t" style="border-color: var(--primary-light);">
            <div class="text-sm font-medium mb-2" style="color: var(--text-secondary);">未完成测评 ({{ unfinishedCount }})
            </div>
            <div class="space-y-2">
              <div v-for="test in unfinishedTestsList" :key="test.id" class="p-2 rounded cursor-pointer"
                style="background-color: var(--bg);" @click="continueTest(test.id)">
                <div class="flex justify-between items-center">
                  <span class="text-sm" style="color: var(--text);">{{ test.title }}</span>
                  <span class="text-xs" style="color: var(--text-muted);">{{ test.completed }}/{{ test.total }}</span>
                </div>
                <div class="w-full rounded-full h-1 mt-1" style="background-color: var(--primary-light);">
                  <div class="rounded-full h-1"
                    :style="{ width: (test.completed / test.total) * 100 + '%', backgroundColor: 'var(--primary)' }">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ClientOnly>
      </div>
    </div>

    <!-- 内部测试密码弹窗 -->
    <Teleport to="body">
      <Transition name="internal-fade">
        <div v-if="internalTestOpen" class="internal-modal-overlay" @click="closeInternalTest">
          <div class="internal-modal-card" @click.stop>
            <div class="internal-modal-icon">🔐</div>
            <div class="internal-modal-body">
              <h3 class="internal-modal-title">内部测试</h3>
              <p class="internal-modal-message">此区域仅限内部人员访问，请输入访问密码</p>
              <input ref="passwordInput" v-model="internalPassword" type="password" class="internal-modal-input"
                placeholder="请输入密码" autocomplete="off" @keyup.enter="submitInternalPassword" />
              <p v-if="passwordError" class="internal-modal-error">⚠️ 密码错误，请重试</p>
              <div class="internal-modal-buttons">
                <button class="internal-modal-btn internal-modal-btn-cancel" @click="closeInternalTest">取消</button>
                <button class="internal-modal-btn internal-modal-btn-confirm" @click="submitInternalPassword">进入</button>
              </div>
            </div>
            <button class="internal-modal-close" @click="closeInternalTest">✕</button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </nav>
</template>

<script setup lang="ts">
const router = useRouter()
const route = useRoute()
const { $toast, $confirm } = useNuxtApp()
const { isDark, toggle: toggleTheme, accent, setAccent, accentOptions } = useTheme()

// 内部测试访问凭证由服务端 /api/internal/auth 签发，客户端无需直接读写 cookie

// 滚动状态
const isScrolled = ref(false)
// 移动端菜单状态
const mobileMenuOpen = ref(false)
// 进度面板状态
const showProgressPanel = ref(false)
// 内部测试弹窗状态
const internalTestOpen = ref(false)
const internalPassword = ref('')
const passwordError = ref(false)
const passwordInput = ref<HTMLInputElement | null>(null)
const internalAuthSubmitting = ref(false)
// 主题配色下拉状态
const accentOpen = ref(false)
const accentWrap = ref<HTMLElement | null>(null)
const accentLabel = (o: { label: string }) => (o.label.split(' · ')[0] as string) || o.label
const currentAccentColor = computed(() => accentOptions.find((o) => o.id === accent.value)?.color || '#5b8c9e')
const currentAccentLabel = computed(() => accentLabel(accentOptions.find((o) => o.id === accent.value) || { label: '天青' }))

// 打开内部测试弹窗
const openInternalTest = () => {
  internalPassword.value = ''
  passwordError.value = false
  internalTestOpen.value = true
  nextTick(() => passwordInput.value?.focus())
}

// 关闭内部测试弹窗
const closeInternalTest = () => {
  internalTestOpen.value = false
}

// 提交密码：交由服务端校验并签发 HttpOnly 凭证
const submitInternalPassword = async () => {
  if (internalAuthSubmitting.value) return
  internalAuthSubmitting.value = true
  passwordError.value = false
  try {
    await $fetch('/api/internal/auth', {
      method: 'POST',
      body: { password: internalPassword.value },
    })
    internalTestOpen.value = false
    mobileMenuOpen.value = false
    router.push('/exam')
  } catch (e: any) {
    passwordError.value = true
    $toast.error(e?.data?.statusMessage || '密码错误，请重试', '内部测试')
  } finally {
    internalAuthSubmitting.value = false
  }
}

// 未完成测评数据
const unfinishedTestsList = ref<Array<{ id: string; title: string; completed: number; total: number }>>([])
const hasUnfinishedTests = computed(() => unfinishedTestsList.value.length > 0)
const unfinishedCount = computed(() => unfinishedTestsList.value.length)

// 检查当前路由是否激活
const isActive = (path: string) => {
  return route.path === path
}

// 返回首页
const goHome = () => {
  router.push('/')
}

// 切换移动端菜单
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
  if (mobileMenuOpen.value) {
    showProgressPanel.value = false
  }
}

// 继续测评
const continueTest = (testId: string) => {
  // 关闭面板
  mobileMenuOpen.value = false
  showProgressPanel.value = false

  const answerStore = useAnswerStore()

  answerStore.setCurrentTest(testId)

  router.push(`/test/${testId}`)

  $toast.info('正在加载您的进度...', '继续测评')
}

// 清空所有进度
const clearAllProgress = () => {
  if (typeof window === 'undefined') return

  $confirm({
    title: '确认清空',
    message: '确定要清空所有测评的进度吗？此操作不可恢复。',
    onConfirm: () => {
      const keys = Object.keys(sessionStorage)
      let clearedCount = 0
      keys.forEach(key => {
        if (key.startsWith('test_') && key.endsWith('_answers')) {
          sessionStorage.removeItem(key)
          clearedCount++
        }
      })
      // 立即清空本地列表
      unfinishedTestsList.value = []
      // 触发自定义事件，通知首页刷新
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('clearAllProgress'))
      }
      $toast.success(`已清空 ${clearedCount} 个测评的进度`, '完成')
      showProgressPanel.value = false
    }
  })
}

// 加载未完成的测评
const loadUnfinishedTests = async () => {
  if (typeof window === 'undefined') return

  try {
    const { data } = await useFetch('/api/tests/list')
    const testList = (data.value as any)?.data || []

    const unfinished: Array<{ id: string; title: string; completed: number; total: number }> = []

    for (const test of testList) {
      try {
        const saved = sessionStorage.getItem(`test_${test.id}_answers`)
        if (saved) {
          const answers = JSON.parse(saved)
          const completed = Object.keys(answers).length
          if (completed > 0 && completed <= test.questionsCount) {
            unfinished.push({
              id: test.id,
              title: test.title,
              completed,
              total: test.questionsCount
            })
          }
        }
      } catch (e) {
        console.error(`加载测评 ${test.id} 进度失败`, e)
      }
    }

    unfinishedTestsList.value = unfinished
  } catch (error) {
    console.error('获取测评列表失败', error)
  }
}

onMounted(() => {
  // 被内部测试路由守卫拦回首页时，自动弹出密码框
  if (route.query.internal === '1') {
    openInternalTest()
    router.replace({ path: '/', query: {} })
  }

  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 10
  })
  loadUnfinishedTests()

  // 监听 storage 事件
  window.addEventListener('storage', (e) => {
    if (e.key && e.key.startsWith('test_') && e.key.endsWith('_answers')) {
      loadUnfinishedTests()
    }
  })

  // 监听清空全部事件
  window.addEventListener('clearAllProgress', () => {
    loadUnfinishedTests()
  })

  // 监听刷新进度事件
  window.addEventListener('refreshProgress', () => {
    loadUnfinishedTests()
  })

  // 点击其他地方关闭进度面板
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (!target.closest('.relative') && !target.closest('.md\\:hidden')) {
      showProgressPanel.value = false
    }
    if (accentWrap.value && !accentWrap.value.contains(target)) {
      accentOpen.value = false
    }
  }
  document.addEventListener('click', handleClickOutside)

  onUnmounted(() => {
    window.removeEventListener('scroll', () => { })
    window.removeEventListener('storage', () => { })
    window.removeEventListener('clearAllProgress', () => { })
    window.removeEventListener('refreshProgress', () => { })
    document.removeEventListener('click', handleClickOutside)
  })
})

// 监听路由变化，关闭菜单并刷新进度
watch(() => route.path, () => {
  mobileMenuOpen.value = false
  showProgressPanel.value = false
  // 路由变化时刷新进度
  loadUnfinishedTests()
})

// 暴露方法给父组件
defineExpose({
  refreshProgress: loadUnfinishedTests
})
</script>

<style scoped>
.nav-link {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border-radius: 0.5rem;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
  color: var(--text-secondary);
}

.nav-link:hover {
  background-color: var(--primary-light);
  color: var(--primary);
}

.nav-link.active {
  color: var(--primary);
  font-weight: 600;
  background-color: var(--primary-light);
}

.mobile-nav-link {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border-radius: 0.5rem;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
  color: var(--text-secondary);
}

.mobile-nav-link:hover {
  background-color: var(--primary-light);
  color: var(--primary);
}

.mobile-nav-link.mobile-active {
  color: var(--primary);
  font-weight: 600;
  background-color: var(--primary-light);
}

/* 内部测试入口按钮 */
.internal-test-entry {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: 4px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-muted);
  border: 1px dashed var(--primary-light);
  background: none;
  cursor: pointer;
  transition: all 0.2s;
}

.internal-test-entry:hover {
  color: var(--primary);
  background-color: var(--primary-light);
  border-color: var(--primary);
}

/* 内部测试密码弹窗 */
.internal-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--overlay-bg, rgba(58, 53, 64, 0.5));
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.internal-modal-card {
  background-color: var(--card-bg);
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  max-width: 380px;
  display: flex;
  gap: 16px;
  box-shadow: var(--shadow-xl);
  animation: internal-modal-in 0.3s ease;
}

.internal-modal-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.internal-modal-body {
  flex: 1;
}

.internal-modal-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 8px;
}

.internal-modal-message {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 16px;
}

.internal-modal-input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid var(--primary-light);
  background-color: var(--bg);
  color: var(--text);
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.internal-modal-input:focus {
  border-color: var(--primary);
}

.internal-modal-error {
  margin-top: 8px;
  font-size: 13px;
  color: var(--warning-text);
}

.internal-modal-buttons {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 16px;
}

.internal-modal-btn {
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.internal-modal-btn-confirm {
  background-color: var(--primary);
  color: white;
}

.internal-modal-btn-confirm:hover {
  background-color: var(--primary-dark);
}

.internal-modal-btn-cancel {
  background-color: var(--bg);
  color: var(--text-secondary);
}

.internal-modal-btn-cancel:hover {
  background-color: var(--primary-light);
}

.internal-modal-close {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: var(--text-muted);
  padding: 4px;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  transition: all 0.2s;
  flex-shrink: 0;
}

.internal-modal-close:hover {
  background-color: var(--bg);
  color: var(--text);
}

@keyframes internal-modal-in {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.internal-fade-enter-active,
.internal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.internal-fade-enter-from,
.internal-fade-leave-to {
  opacity: 0;
}

.internal-fade-enter-active .internal-modal-card,
.internal-fade-leave-active .internal-modal-card {
  transition: transform 0.3s ease;
}

.internal-fade-enter-from .internal-modal-card {
  transform: translateY(-20px);
}

.internal-fade-leave-to .internal-modal-card {
  transform: translateY(-20px);
}
</style>