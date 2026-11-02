import { computed, signal } from '@preact/signals'
import {
  api,
  unwrap,
  type SigninRequest,
  type SignupRequest,
  type SigninResponse,
} from '@/lib/api'
import { queryClient } from '@/lib/queryClient'

const TOKEN_KEY = 'token'

type SessionUser = SigninResponse['user']

interface Session {
  user: SessionUser
  token: string
}

/**
 * Session state. Signals are module-level so any component can read them; a
 * component that reads `.value` while rendering re-renders when it changes.
 * Server data (the users list) lives in TanStack Query, not here.
 */
export const user = signal<SessionUser | null>(null)
export const token = signal<string | null>(null)
// Session restoration happens in initializeAuth, which validates the stored
// token before trusting it.
export const loading = signal(true)

export const isAuthenticated = computed(() => user.value !== null)

function applySession(session: Session | null) {
  user.value = session?.user ?? null
  token.value = session?.token ?? null
  loading.value = false
}

function persistSession(session: Session) {
  localStorage.setItem(TOKEN_KEY, session.token)
  applySession(session)
}

export async function signup(credentials: SignupRequest) {
  const response = await api.auth.signup.$post({ json: credentials })
  persistSession(await unwrap<Session>(response))
}

export async function signin(credentials: SigninRequest) {
  const response = await api.auth.signin.$post({ json: credentials })
  persistSession(await unwrap<Session>(response))
}

export function signout() {
  localStorage.removeItem(TOKEN_KEY)
  applySession(null)
  // Drop cached server data so the next user never sees the previous one's.
  queryClient.clear()
}

/**
 * Restores a session from localStorage. The token is re-validated server-side
 * on every request; this call just confirms it is still good before the UI
 * decides between the app and the sign-in page.
 */
export async function initializeAuth() {
  const stored = localStorage.getItem(TOKEN_KEY)
  if (!stored) return applySession(null)

  try {
    const response = await api.users.me.$get(
      {},
      { headers: { Authorization: `Bearer ${stored}` } },
    )
    const body = await unwrap<{ user: SessionUser }>(response)
    applySession({ token: stored, user: body.user })
  } catch {
    localStorage.removeItem(TOKEN_KEY)
    applySession(null)
  }
}
