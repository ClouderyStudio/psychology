<template>
  <Teleport to="body">
    <Transition name="alert-fade">
      <div v-if="visible" class="alert-container" @click="handleOverlayClick">
        <div class="alert-card" @click.stop>
          <div class="alert-icon">❓</div>
          <div class="alert-content">
            <h3 class="alert-title">{{ title || '确认' }}</h3>
            <p class="alert-message">{{ message }}</p>
            <div class="alert-buttons">
              <button class="alert-btn alert-btn-cancel" @click="handleCancel">
                {{ cancelText || '取消' }}
              </button>
              <button class="alert-btn alert-btn-confirm" @click="handleConfirm">
                {{ confirmText || '确定' }}
              </button>
            </div>
          </div>
          <button class="alert-close" @click="handleCancel">✕</button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const visible = ref(true)

const handleConfirm = () => {
  emit('confirm')
  visible.value = false
  setTimeout(() => {
    emit('cancel')
  }, 300)
}

const handleCancel = () => {
  emit('cancel')
  visible.value = false
}

const handleOverlayClick = () => {
  handleCancel()
}
</script>

<style scoped>
.alert-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(58, 53, 64, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.alert-card {
  background-color: var(--card-bg);
  border-radius: 16px;
  padding: 24px;
  min-width: 380px;
  max-width: 420px;
  display: flex;
  gap: 16px;
  box-shadow: var(--shadow-xl);
  animation: alert-slide-in 0.3s ease;
}

.alert-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 8px;
}

.alert-message {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 20px;
}

.alert-close {
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

.alert-close:hover {
  background-color: var(--bg);
  color: var(--text);
}

.alert-buttons {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.alert-btn {
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.alert-btn-confirm {
  background-color: var(--primary);
  color: white;
}

.alert-btn-confirm:hover {
  background-color: var(--primary-dark);
}

.alert-btn-cancel {
  background-color: var(--bg);
  color: var(--text-secondary);
}

.alert-btn-cancel:hover {
  background-color: var(--primary-light);
}

@keyframes alert-slide-in {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.alert-fade-enter-active,
.alert-fade-leave-active {
  transition: opacity 0.3s ease;
}

.alert-fade-enter-from,
.alert-fade-leave-to {
  opacity: 0;
}

.alert-fade-enter-active .alert-card,
.alert-fade-leave-active .alert-card {
  transition: transform 0.3s ease;
}

.alert-fade-enter-from .alert-card {
  transform: translateY(-20px);
}

.alert-fade-leave-to .alert-card {
  transform: translateY(-20px);
}
</style>