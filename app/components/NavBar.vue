<!-- components/NavBar.vue -->
<template>
  <nav class="sticky top-0 z-50 w-full transition-all duration-300"
       :class="{ 'shadow-lg': isScrolled }"
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
            心理测评
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
          
          <!-- 进度指示器 -->
          <ClientOnly>
            <div v-if="hasUnfinishedTests" 
                 class="relative ml-2 cursor-pointer"
                 @click.stop="showProgressPanel = !showProgressPanel">
              <div class="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                   style="background-color: var(--warning-bg);"
                   @mouseenter="e => e.target.style.backgroundColor = 'var(--warning-border)'"
                   @mouseleave="e => e.target.style.backgroundColor = 'var(--warning-bg)'">
                <span class="text-sm">📋</span>
              </div>
              <span class="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center"
                    style="background-color: var(--primary); color: white;">
                {{ unfinishedCount }}
              </span>
            </div>
          </ClientOnly>
        </div>
        
        <!-- 移动端菜单按钮 -->
        <button @click="toggleMobileMenu" 
                class="md:hidden p-2 rounded-lg transition-colors"
                style="color: var(--text);"
                @mouseenter="e => e.target.style.backgroundColor = 'var(--primary-light)'"
                @mouseleave="e => e.target.style.backgroundColor = 'transparent'">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M4 6h16M4 12h16M4 18h16"></path>
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <!-- 进度面板（下拉） -->
      <ClientOnly>
        <div v-if="showProgressPanel && hasUnfinishedTests" 
             class="absolute right-0 mt-2 w-80 rounded-lg shadow-lg z-50"
             style="background-color: var(--card-bg); box-shadow: var(--shadow-lg);">
          <div class="p-4">
            <div class="flex justify-between items-center mb-3">
              <h3 class="font-semibold" style="color: var(--text);">未完成的测评</h3>
              <button @click="clearAllProgress" 
                      class="text-xs px-2 py-1 rounded transition-colors"
                      style="background-color: var(--warning-bg); color: var(--warning-text);">
                清空全部
              </button>
            </div>
            <div class="space-y-2 max-h-64 overflow-y-auto">
              <div v-for="test in unfinishedTestsList" :key="test.id"
                   class="p-2 rounded cursor-pointer hover:bg-gray-50 transition-colors"
                   @click="continueTest(test.id)">
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium" style="color: var(--text);">{{ test.title }}</span>
                  <span class="text-xs" style="color: var(--text-muted);">{{ test.completed }}/{{ test.total }}题</span>
                </div>
                <div class="w-full rounded-full h-1 mt-1" style="background-color: var(--primary-light);">
                  <div class="rounded-full h-1" 
                       :style="{ width: (test.completed / test.total) * 100 + '%', backgroundColor: 'var(--primary)' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ClientOnly>
    </div>
    
    <!-- 移动端菜单 -->
    <div v-if="mobileMenuOpen" 
         class="md:hidden absolute top-16 left-0 right-0 shadow-lg"
         style="background-color: var(--card-bg);">
      <div class="flex flex-col p-4 space-y-3">
        <NuxtLink to="/" class="mobile-nav-link" :class="{ 'mobile-active': isActive('/') }" @click="mobileMenuOpen = false">
          首页
        </NuxtLink>
        <NuxtLink to="/about" class="mobile-nav-link" :class="{ 'mobile-active': isActive('/about') }" @click="mobileMenuOpen = false">
          关于我们
        </NuxtLink>
        <NuxtLink to="/resources" class="mobile-nav-link" :class="{ 'mobile-active': isActive('/resources') }" @click="mobileMenuOpen = false">
          心理资源
        </NuxtLink>
        
        <!-- 移动端进度显示 -->
        <ClientOnly>
          <div v-if="hasUnfinishedTests" class="pt-2 mt-2 border-t" style="border-color: var(--primary-light);">
            <div class="text-sm font-medium mb-2" style="color: var(--text-secondary);">未完成测评 ({{ unfinishedCount }})</div>
            <div class="space-y-2">
              <div v-for="test in unfinishedTestsList" :key="test.id"
                   class="p-2 rounded cursor-pointer"
                   style="background-color: var(--bg);"
                   @click="continueTest(test.id)">
                <div class="flex justify-between items-center">
                  <span class="text-sm" style="color: var(--text);">{{ test.title }}</span>
                  <span class="text-xs" style="color: var(--text-muted);">{{ test.completed }}/{{ test.total }}</span>
                </div>
                <div class="w-full rounded-full h-1 mt-1" style="background-color: var(--primary-light);">
                  <div class="rounded-full h-1" 
                       :style="{ width: (test.completed / test.total) * 100 + '%', backgroundColor: 'var(--primary)' }"></div>
                </div>
              </div>
            </div>
          </div>
        </ClientOnly>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const router = useRouter()
const route = useRoute()
const { $toast, $confirm } = useNuxtApp()

// 滚动状态
const isScrolled = ref(false)
// 移动端菜单状态
const mobileMenuOpen = ref(false)
// 进度面板状态
const showProgressPanel = ref(false)

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
  }
  document.addEventListener('click', handleClickOutside)
  
  onUnmounted(() => {
    window.removeEventListener('scroll', () => {})
    window.removeEventListener('storage', () => {})
    window.removeEventListener('clearAllProgress', () => {})
    window.removeEventListener('refreshProgress', () => {})
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
</style>