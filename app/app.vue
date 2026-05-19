<template>
  <div class="min-h-screen flex flex-col">
    <NavBar />
    <main class="flex-grow">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </main>
    <Footer />
  </div>
</template>

<script setup>
useHead({
  title: '心理测评中心',
  meta: [
    { name: 'description', content: '专业的心理健康测评工具，提供抑郁、焦虑、压力等专业量表评估' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ]
})

if (process.client) {
  const style = document.createElement('style')
  style.textContent = `
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
      min-width: 320px;
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
    .alert-success {
      border-left: 4px solid var(--special);
    }
    .alert-error {
      border-left: 4px solid #e74c3c;
    }
    .alert-warning {
      border-left: 4px solid var(--warning-border);
    }
    .alert-info {
      border-left: 4px solid var(--primary);
    }
    .alert-confirm {
      min-width: 380px;
    }
    .alert-confirm .alert-buttons {
      display: flex;
      gap: 12px;
      margin-top: 20px;
      justify-content: flex-end;
    }
    .alert-confirm .alert-btn {
      padding: 8px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
    }
    .alert-confirm .alert-btn-confirm {
      background-color: var(--primary);
      color: white;
    }
    .alert-confirm .alert-btn-confirm:hover {
      background-color: var(--primary-dark);
    }
    .alert-confirm .alert-btn-cancel {
      background-color: var(--bg);
      color: var(--text-secondary);
    }
    .alert-confirm .alert-btn-cancel:hover {
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
  `
  document.head.appendChild(style)
}
</script>