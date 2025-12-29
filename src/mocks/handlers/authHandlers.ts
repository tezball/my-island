import { http, HttpResponse, delay } from 'msw'
import { mockVisitorUser, mockOwnerUser, testCredentials } from '../data/users'
import type { User } from '@/types'

const MOCK_TOKEN = 'mock-jwt-token'
const MOCK_OWNER_TOKEN = 'mock-owner-jwt-token'

// Track current logged in user
let currentUser: User | null = null

// Helper to check if request has valid auth token
function hasValidToken(request: Request): boolean {
  const authHeader = request.headers.get('Authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7)
    return token === MOCK_TOKEN || token === MOCK_OWNER_TOKEN
  }
  // Also check localStorage for token (for MSW which runs in browser context)
  if (typeof window !== 'undefined') {
    const storedToken = localStorage.getItem('auth_token')
    return storedToken === MOCK_TOKEN || storedToken === MOCK_OWNER_TOKEN
  }
  return false
}

// Helper to get current user from token
function getUserFromToken(request: Request): User | null {
  const authHeader = request.headers.get('Authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7)
    if (token === MOCK_TOKEN) return mockVisitorUser
    if (token === MOCK_OWNER_TOKEN) return mockOwnerUser
  }
  if (typeof window !== 'undefined') {
    const storedToken = localStorage.getItem('auth_token')
    if (storedToken === MOCK_TOKEN) return mockVisitorUser
    if (storedToken === MOCK_OWNER_TOKEN) return mockOwnerUser
  }
  return currentUser
}

export const authHandlers = [
  // Email/Password login - for visitor user
  http.post('/api/auth/login', async ({ request }) => {
    await delay(500)
    const body = await request.json() as { email: string; password: string }

    // Validate visitor credentials
    if (
      body.email === testCredentials.visitor.email &&
      body.password === testCredentials.visitor.password
    ) {
      currentUser = mockVisitorUser
      return HttpResponse.json({
        user: mockVisitorUser,
        token: MOCK_TOKEN,
      })
    }

    return HttpResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    )
  }),

  // Google OAuth login - for owner/admin user
  http.post('/api/auth/google', async () => {
    await delay(500)
    currentUser = mockOwnerUser
    return HttpResponse.json({
      user: mockOwnerUser,
      token: MOCK_OWNER_TOKEN,
    })
  }),

  // Google OAuth callback (alternative endpoint)
  http.get('/api/auth/google/callback', async () => {
    await delay(300)
    currentUser = mockOwnerUser
    return HttpResponse.json({
      user: mockOwnerUser,
      token: MOCK_OWNER_TOKEN,
    })
  }),

  http.post('/api/auth/logout', async () => {
    await delay(200)
    currentUser = null
    return HttpResponse.json({ success: true })
  }),

  http.get('/api/auth/me', async ({ request }) => {
    await delay(300)
    if (hasValidToken(request)) {
      const user = getUserFromToken(request)
      return HttpResponse.json({ user })
    }
    return HttpResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    )
  }),
]
