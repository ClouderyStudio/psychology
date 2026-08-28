/**
 * 内部测试路由守卫
 * 未通过密码验证（未持有凭证 cookie）时，禁止直接访问 /exam 相关页面。
 */
export default defineNuxtRouteMiddleware((to) => {
  const isExam = to.path === '/exam' || to.path.startsWith('/exam/')
  if (!isExam) return

  const authed = useCookie('internal_authed').value
  if (authed !== 'granted') {
    return navigateTo({ path: '/', query: { internal: '1' } })
  }
})
