/**
 * 供模板 hover 事件使用的样式工具。
 * Vue 模板表达式不支持 "as" 类型断言，因此把类型收窄放在函数内，
 * 模板里调用 elStyle($event, { ... }) 即可安全设置样式。
 */
export function elStyle(e: Event, styles: Record<string, string>): void {
  const el = e.currentTarget as HTMLElement | null;
  if (el) {
    Object.assign(el.style, styles);
  }
}
