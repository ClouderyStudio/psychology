// 无障碍偏好：与字号、字体、字重并列的阅读辅助设置。
// 目前只有一项——「减少动态效果」，且与「外观」一样是三档：
//   auto（跟随系统，默认）/ reduce（始终减少）/ no-preference（始终不减少）。
// 开启后页面过渡、自动滚动与闪烁动画全部压到接近瞬时，自动前进（一页一题模式）也会被关闭。
// 系统层面的 prefers-reduced-motion 默认始终受尊重；显式选「常规动态」才会覆盖系统设置。
//
// 与其它偏好 composable 一样：模块级 ref + localStorage + html 属性，应用级单例。
const A11Y_MOTION_KEY = 'psychology-reduced-motion';

// 三档语义与 storage / html 属性取值一一对应：
//   auto          → 跟随系统（不写存储，「跟随系统」是默认态）
//   reduce        → 始终减少动态效果
//   no-preference → 始终不减少（覆盖系统设置）
export type MotionMode = 'auto' | 'reduce' | 'no-preference';

export const motionModeOptions: { id: MotionMode; label: string; desc: string }[] = [
  { id: 'auto', label: '跟随系统', desc: '跟随系统的减少动态效果设置' },
  { id: 'reduce', label: '减少动态', desc: '始终关闭页面过渡与自动前进' },
  { id: 'no-preference', label: '常规动态', desc: '不受系统设置影响，保留完整动画' },
];

const motionMode = ref<MotionMode>('auto');

function normalizeMode(mode: unknown): MotionMode {
  return mode === 'reduce' || mode === 'no-preference' ? mode : 'auto';
}

function applyMotionMode(mode: MotionMode) {
  if (import.meta.server) return;
  document.documentElement.setAttribute('data-reduced-motion', mode);
}

function setMotionMode(mode: MotionMode) {
  motionMode.value = normalizeMode(mode);
  applyMotionMode(motionMode.value);
  try {
    // 「跟随系统」不落存储：清掉旧值即可回到默认态
    if (motionMode.value === 'auto') localStorage.removeItem(A11Y_MOTION_KEY);
    else localStorage.setItem(A11Y_MOTION_KEY, motionMode.value);
  } catch {
    // 隐私模式等场景下 localStorage 不可用，忽略即可，当前会话仍然生效
  }
}

function init() {
  if (import.meta.server) return;
  try {
    motionMode.value = normalizeMode(localStorage.getItem(A11Y_MOTION_KEY));
  } catch {
    motionMode.value = 'auto';
  }
  applyMotionMode(motionMode.value);
}

// 实际是否要减少动态效果：显式档位优先，auto 时才回落到系统偏好。
function prefersReducedMotion(): boolean {
  if (import.meta.server) return false;
  if (motionMode.value === 'reduce') return true;
  if (motionMode.value === 'no-preference') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useA11yPrefs() {
  return {
    motionMode,
    setMotionMode,
    motionModeOptions,
    init,
    prefersReducedMotion,
  };
}
