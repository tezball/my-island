import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { User } from '../data/types'
import api, { setAuthTokens, clearAuthTokens, setAuthErrorHandler, clearAuthErrorHandler } from '../lib/api'

// API Response types
interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

// Feature flag for API mode
const USE_REAL_API = import.meta.env.VITE_USE_REAL_API === 'true'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface LoginCredentials {
  email: string
  password: string
}

interface SignUpData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  acceptMarketing: boolean
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  loginWithProvider: (provider: 'google' | 'apple') => Promise<void>
  signup: (data: SignUpData) => Promise<void>
  logout: () => void
  clearError: () => void
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AUTH_STORAGE_KEY = 'my-island-auth'

// Mock user for development - will be replaced with API response
const createMockUser = (
  email: string,
  firstName: string,
  lastName: string,
  options?: { isOwner?: boolean; isSupplier?: boolean }
): User => ({
  id: crypto.randomUUID(),
  email,
  name: `${firstName} ${lastName}`,
  memberSince: new Date().toISOString(),
  isOwner: options?.isOwner ?? email.includes('owner'),
  isSupplier: options?.isSupplier ?? false,
  linkedAccounts: [],
  notificationPreferences: {
    email: true,
    push: true,
    sms: false,
    marketing: false,
  },
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  })

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY)
        if (stored) {
          const { user, expiresAt } = JSON.parse(stored)

          // If using real API, we also need valid auth tokens
          if (USE_REAL_API) {
            const accessToken = localStorage.getItem('access_token')
            if (!accessToken) {
              // Have stored user but no tokens - likely from mock mode
              // Clear the stale session
              localStorage.removeItem(AUTH_STORAGE_KEY)
              setState(prev => ({ ...prev, isLoading: false }))
              return
            }
          }

          if (new Date(expiresAt) > new Date()) {
            setState({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
            return
          }
          // Session expired, clear it
          localStorage.removeItem(AUTH_STORAGE_KEY)
          clearAuthTokens()
        }
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY)
        clearAuthTokens()
      }
      setState(prev => ({ ...prev, isLoading: false }))
    }

    checkAuth()
  }, [])

  const persistSession = (user: User) => {
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30) // 30 days
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user, expiresAt: expiresAt.toISOString() }))
  }

  const login = useCallback(async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      if (USE_REAL_API) {
        // Real API call
        const response = await api.post<AuthResponse>('/auth/login', credentials, { skipAuth: true })
        setAuthTokens(response.accessToken, response.refreshToken)
        persistSession(response.user)

        setState({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        })
      } else {
        // Mock mode for development
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Mock validation
        if (credentials.email === 'locked@test.com') {
          throw new Error('ACCOUNT_LOCKED')
        }
        if (credentials.email === 'suspended@test.com') {
          throw new Error('ACCOUNT_SUSPENDED')
        }
        if (credentials.email === 'unverified@test.com') {
          throw new Error('EMAIL_UNVERIFIED')
        }

        // Handle demo accounts with proper roles and names
        let user
        if (credentials.email === 'owner@my-island.com') {
          user = createMockUser(credentials.email, 'Sarah', "O'Brien", { isOwner: true, isSupplier: false })
        } else if (credentials.email === 'supplier@my-island.com') {
          user = createMockUser(credentials.email, 'Michael', 'Kelly', { isOwner: false, isSupplier: true })
        } else if (credentials.email === 'visitor@my-island.com') {
          user = createMockUser(credentials.email, 'Emma', 'Murphy', { isOwner: false, isSupplier: false })
        } else {
          user = createMockUser(credentials.email, 'Alex', 'Walker')
        }
        persistSession(user)

        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        })
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed'
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: message,
      }))
      throw error
    }
  }, [])

  const loginWithProvider = useCallback(async (provider: 'google' | 'apple') => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      // TODO: Replace with actual OAuth flow
      // const response = await api.post(`/auth/${provider}`)

      // Simulate OAuth
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Google SSO creates Owner account, Apple SSO creates Supplier account
      const user = provider === 'google'
        ? createMockUser('owner@gmail.com', 'Sarah', "O'Brien", { isOwner: true, isSupplier: false })
        : createMockUser('supplier@icloud.com', 'Michael', "O'Brien", { isOwner: false, isSupplier: true })
      persistSession(user)

      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'SSO login failed'
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: message,
      }))
      throw error
    }
  }, [])

  const signup = useCallback(async (data: SignUpData) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      if (USE_REAL_API) {
        // Real API call
        const response = await api.post<AuthResponse>('/auth/register', {
          email: data.email,
          password: data.password,
          name: `${data.firstName} ${data.lastName}`,
          phone: data.phone,
        }, { skipAuth: true })

        setAuthTokens(response.accessToken, response.refreshToken)
        persistSession(response.user)

        setState({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        })
      } else {
        // Mock mode for development
        await new Promise(resolve => setTimeout(resolve, 1500))

        // Mock: check if email exists
        if (data.email === 'exists@test.com') {
          throw new Error('EMAIL_EXISTS')
        }

        const user = createMockUser(data.email, data.firstName, data.lastName)
        user.phone = data.phone
        user.notificationPreferences.marketing = data.acceptMarketing

        // For signup, we don't persist session until email is verified
        // But we store the user temporarily for the verification flow
        setState({
          user,
          isAuthenticated: false, // Not authenticated until email verified
          isLoading: false,
          error: null,
        })
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Signup failed'
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: message,
      }))
      throw error
    }
  }, [])

  const logout = useCallback(() => {
    clearAuthTokens()
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    })
  }, [])

  // Register auth error handler to logout on 401/403 API responses
  useEffect(() => {
    setAuthErrorHandler(() => {
      logout()
    })
    return () => {
      clearAuthErrorHandler()
    }
  }, [logout])

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  const updateUser = useCallback((updates: Partial<User>) => {
    setState(prev => {
      if (!prev.user) return prev
      const updatedUser = { ...prev.user, ...updates }
      persistSession(updatedUser)
      return { ...prev, user: updatedUser }
    })
  }, [])

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        loginWithProvider,
        signup,
        logout,
        clearError,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
