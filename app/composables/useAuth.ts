/**
 * 站点登录态（Casdoor）。
 *
 * 站点自己不做账号体系：认证一律走 ClouderyApi 的 /identity/auth/*（与 /admin 用的是同一套），
 * 服务端用 HttpOnly + SameSite=None 的 Cookie 保存会话，所以这里只能通过
 * `/identity/auth/status` 问服务端「我是谁」，前端拿不到也存不了令牌。
 *
 * 登录用整页跳转（不是弹窗）：手机上弹窗常被拦截，整页跳转在所有平台一致。
 * OAuth 的 state 由服务端种 Cookie 并校验，前端不能携带自定义参数，
 * 因此「登录后回到哪一页」寄存在 localStorage 里（RETURN_KEY）。
 */
export interface ClouderyUser {
  id?: string
  username?: string
  email?: string
  avatar?: string
}

export type AuthStatus = 'unknown' | 'checking' | 'authed' | 'guest'

/** 登录前记住的返回路径；只能放在本地，OAuth state 被服务端占用 */
const RETURN_KEY = 'psychology-login-return'
/** 登录回调固定落在这个路径，需在 Casdoor 应用里登记为合法 redirect_uri */
export const LOGIN_PATH = '/login'

export function useAuth() {
  const config = useRuntimeConfig()
  const apiBase = (config.public.clouderyApiBase as string) || 'https://localhost:7288'

  const user = useState<ClouderyUser | null>('auth:user', () => null)
  const status = useState<AuthStatus>('auth:status', () => 'unknown')
  const isAuthed = computed(() => status.value === 'authed' && !!user.value)

  function redirectUri(): string {
    return window.location.origin + LOGIN_PATH
  }

  function rememberReturn(returnTo: string): void {
    try {
      window.localStorage.setItem(RETURN_KEY, returnTo || '/account')
    } catch {
      // 隐私模式下写入失败：退回默认页即可
    }
  }

  function takeReturn(): string {
    try {
      const saved = window.localStorage.getItem(RETURN_KEY)
      window.localStorage.removeItem(RETURN_KEY)
      return saved || '/account'
    } catch {
      return '/account'
    }
  }

  /** 问服务端当前登录状态；接口不可达时按「未登录」处理，不阻塞本机使用 */
  async function refresh(): Promise<AuthStatus> {
    if (import.meta.server) return status.value
    status.value = 'checking'
    try {
      const result = await $fetch<{ isAuthenticated: boolean; user?: ClouderyUser }>(
        apiBase + '/identity/auth/status',
        { credentials: 'include' },
      )
      if (result?.isAuthenticated) {
        user.value = result.user || {}
        status.value = 'authed'
      } else {
        user.value = null
        status.value = 'guest'
      }
    } catch {
      user.value = null
      status.value = 'guest'
    }
    return status.value
  }

  /** 跳转到 Casdoor 授权页（整页跳转，返回后由 /login 处理 code） */
  async function login(returnTo = '/account'): Promise<void> {
    if (import.meta.server) return
    rememberReturn(returnTo)

    const cfg = await $fetch<{ casdoor: { endpoint: string; clientId: string; scope: string } }>(
      apiBase + '/identity/auth/config',
    )
    const state = await $fetch<{ state: string }>(apiBase + '/identity/auth/state', {
      credentials: 'include',
    })
    const params = new URLSearchParams({
      client_id: cfg.casdoor.clientId,
      redirect_uri: redirectUri(),
      response_type: 'code',
      scope: cfg.casdoor.scope,
      state: state.state,
    })
    window.location.href = cfg.casdoor.endpoint + '/login/oauth/authorize?' + params.toString()
  }

  /**
   * 处理 Casdoor 回调：把 code 交给 ClouderyApi 换取会话 Cookie。
   * 返回登录后该去的路径。
   */
  async function completeCallback(code: string, state: string): Promise<string> {
    await $fetch(apiBase + '/identity/auth/callback', {
      method: 'POST',
      body: { code, state, redirectUri: redirectUri() },
      credentials: 'include',
    })
    await refresh()
    return takeReturn()
  }

  async function logout(): Promise<void> {
    try {
      await $fetch(apiBase + '/identity/auth/logout', { method: 'POST', credentials: 'include' })
    } catch {
      // 会话已过期或接口不可达：本地状态照清
    }
    user.value = null
    status.value = 'guest'
  }

  return { apiBase, user, status, isAuthed, refresh, login, logout, completeCallback, redirectUri }
}
