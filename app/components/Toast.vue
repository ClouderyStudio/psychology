<template>
  <Teleport to="body">
    <TransitionGroup name="toast" tag="div" class="toast-container">
      <div v-for="toast in toasts" :key="toast.id" class="toast-item" :class="toast.type">
        <div class="toast-icon">
          <span v-if="toast.type === 'success'">✅</span>
          <span v-else-if="toast.type === 'error'">❌</span>
          <span v-else-if="toast.type === 'warning'">⚠️</span>
          <span v-else-if="toast.type === 'info'">ℹ️</span>
        </div>
        <div class="toast-content">
          <div class="toast-title">{{ toast.title }}</div>
          <div class="toast-message">{{ toast.message }}</div>
        </div>
        <button class="toast-close" @click="removeToast(toast.id)">✕</button>
        <div class="toast-progress" :style="{ width: progressWidth(toast) + '%' }"></div>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script setup lang="ts">
interface ToastItem {
  id: number
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration: number
  startTime: number
}

const toasts = ref<ToastItem[]>([])
let nextId = 0
let timers: Map<number, NodeJS.Timeout> = new Map()

const addToast = (options: {
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
}) => {
  const id = nextId++
  const duration = options.duration || 3000
  const toast: ToastItem = {
    id,
    type: options.type,
    title: options.title,
    message: options.message,
    duration,
    startTime: Date.now()
  }

  toasts.value.push(toast)

  // 设置自动移除
  const timer = setTimeout(() => {
    removeToast(id)
  }, duration)
  timers.set(id, timer)
}

const removeToast = (id: number) => {
  const timer = timers.get(id)
  if (timer) {
    clearTimeout(timer)
    timers.delete(id)
  }
  const index = toasts.value.findIndex(t => t.id === id)
  if (index !== -1) {
    toasts.value.splice(index, 1)
  }
}

const progressWidth = (toast: ToastItem) => {
  const elapsed = Date.now() - toast.startTime
  const remaining = Math.max(0, toast.duration - elapsed)
  return (remaining / toast.duration) * 100
}

// 开始进度条动画
onMounted(() => {
  // 每帧更新进度条
  const interval = setInterval(() => {
    toasts.value.forEach(toast => {
      const elapsed = Date.now() - toast.startTime
      if (elapsed >= toast.duration) {
        removeToast(toast.id)
      }
    })
  }, 100)

  onUnmounted(() => {
    clearInterval(interval)
  })
})

// 暴露方法给全局使用
defineExpose({
  success: (message: string, title: string = '成功', duration?: number) => {
    addToast({ type: 'success', title, message, duration })
  },
  error: (message: string, title: string = '错误', duration?: number) => {
    addToast({ type: 'error', title, message, duration })
  },
  warning: (message: string, title: string = '警告', duration?: number) => {
    addToast({ type: 'warning', title, message, duration })
  },
  info: (message: string, title: string = '提示', duration?: number) => {
    addToast({ type: 'info', title, message, duration })
  }
})
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
}

.toast-item {
  min-width: 320px;
  max-width: 400px;
  background-color: var(--card-bg);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  gap: 12px;
  box-shadow: var(--shadow-lg);
  pointer-events: auto;
  position: relative;
  overflow: hidden;
  animation: toast-slide-in 0.3s ease;
}

.toast-item.success {
  border-left: 4px solid var(--special);
}

.toast-item.error {
  border-left: 4px solid #e74c3c;
}

.toast-item.warning {
  border-left: 4px solid var(--warning-border);
}

.toast-item.info {
  border-left: 4px solid var(--primary);
}

.toast-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.toast-content {
  flex: 1;
}

.toast-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 4px;
}

.toast-message {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.4;
}

.toast-close {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: var(--text-muted);
  padding: 4px;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  transition: all 0.2s;
  flex-shrink: 0;
}

.toast-close:hover {
  background-color: var(--bg);
  color: var(--text);
}

.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background-color: currentColor;
  transition: width 0.1s linear;
}

.toast-item.success .toast-progress {
  background-color: var(--special);
}

.toast-item.error .toast-progress {
  background-color: #e74c3c;
}

.toast-item.warning .toast-progress {
  background-color: var(--warning-border);
}

.toast-item.info .toast-progress {
  background-color: var(--primary);
}

@keyframes toast-slide-in {
  from {
    opacity: 0;
    transform: translateX(100%);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 退出动画 */
.toast-move {
  transition: transform 0.3s ease;
}
</style>