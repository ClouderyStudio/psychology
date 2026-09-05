/**
 * 内部测试路由守卫
 * 简单的客户端提示层：校验访问凭证是否已签发（形如 payload.signature）。
 * 真实的鉴权在服务端 /api/internal/* 中完成（HMAC 签名校验）。
 */
export default defineNuxtRouteMiddleware((to) => {
  const isExam = to.path === '/exam' || to.path.startsWith('/exam/')
  if (!isExam) return

  const authed = useCookie('internal_authed').value
  // 令牌由服务端签发，格式为 base64url.signature
  const looksAuthed = typeof authed === 'string' && authed.includes('.')
  if (!looksAuthed) {
    return navigateTo({ path: '/', query: { internal: '1' } })
  }
})
