import { http, HttpResponse, delay } from 'msw'
import { mockCurrentUser } from '../data/users'

const MOCK_TOKEN = 'mock-jwt-token'

// Helper to check if request has valid auth token
function hasValidToken(request: Request): boolean {
  const authHeader = request.headers.get('Authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7) === MOCK_TOKEN
  }
  // Also check localStorage for token (for MSW which runs in browser context)
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token') === MOCK_TOKEN
  }
  return false
}

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    await delay(500)
    const body = await request.json() as { email: string; password: string }

    if (body.email && body.password) {
      return HttpResponse.json({
        user: mockCurrentUser,
        token: MOCK_TOKEN,
      })
    }

    return HttpResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  }),

  http.post('/api/auth/logout', async () => {
    await delay(200)
    return HttpResponse.json({ success: true })
  }),

  http.get('/api/auth/me', async ({ request }) => {
    await delay(300)
    if (hasValidToken(request)) {
      return HttpResponse.json({ user: mockCurrentUser })
    }
    return HttpResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    )
  }),
]
