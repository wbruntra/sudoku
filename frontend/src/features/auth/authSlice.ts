import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  api,
  unwrap,
  type SigninRequest,
  type SigninResponse,
  type SignupRequest,
} from '@/lib/api'

const TOKEN_KEY = 'token'

type SessionUser = SigninResponse['user']

interface AuthState {
  isAuthenticated: boolean
  user: SessionUser | null
  token: string | null
  loading: boolean
  error: string | null
}

interface Session {
  user: SessionUser
  token: string
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  // Session restoration happens in initializeAuth, which validates expiry
  // before trusting the stored token.
  loading: true,
  error: null,
}

export const signup = createAsyncThunk<Session, SignupRequest>(
  'auth/signup',
  async (credentials) => {
    const response = await api.auth.signup.$post({ json: credentials })
    const body = await unwrap<Session>(response)
    localStorage.setItem(TOKEN_KEY, body.token)
    return body
  },
)

export const signin = createAsyncThunk<Session, SigninRequest>(
  'auth/signin',
  async (credentials) => {
    const response = await api.auth.signin.$post({ json: credentials })
    const body = await unwrap<Session>(response)
    localStorage.setItem(TOKEN_KEY, body.token)
    return body
  },
)

export const signout = createAsyncThunk('auth/signout', async () => {
  localStorage.removeItem(TOKEN_KEY)
})

/**
 * Restores a session from localStorage. The token is re-validated server-side
 * on every request; the local expiry check just avoids a pointless round trip.
 */
export const initializeAuth = createAsyncThunk<Session | null>('auth/initializeAuth', async () => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (!token) return null

  try {
    const response = await api.users.me.$get({}, { headers: { Authorization: `Bearer ${token}` } })
    const body = await unwrap<{ user: SessionUser }>(response)
    return { token, user: body.user }
  } catch {
    localStorage.removeItem(TOKEN_KEY)
    return null
  }
})

function applySession(state: AuthState, session: Session | null) {
  state.loading = false
  state.isAuthenticated = session !== null
  state.user = session?.user ?? null
  state.token = session?.token ?? null
  state.error = null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signout.fulfilled, (state) => applySession(state, null))
      .addCase(initializeAuth.fulfilled, (state, action) => applySession(state, action.payload))
      .addCase(initializeAuth.rejected, (state) => applySession(state, null))
      // signup and signin share identical pending/fulfilled/rejected handling.
      .addMatcher(
        (action) => [signup.pending.type, signin.pending.type].includes(action.type),
        (state) => {
          state.loading = true
          state.error = null
        },
      )
      .addMatcher(
        (action) => [signup.fulfilled.type, signin.fulfilled.type].includes(action.type),
        (state, action: { payload: Session }) => applySession(state, action.payload),
      )
      .addMatcher(
        (action) => [signup.rejected.type, signin.rejected.type].includes(action.type),
        (state, action: { error: { message?: string } }) => {
          state.loading = false
          state.error = action.error.message || 'Authentication failed'
        },
      )
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
