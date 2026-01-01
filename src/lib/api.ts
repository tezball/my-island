/**
 * API Service Layer
 *
 * Centralized HTTP client for all API requests.
 * Handles authentication headers, error handling, and response parsing.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'
const AUTH_STORAGE_KEY = 'my-island-auth'

interface ApiError extends Error {
  status: number
  code?: string
  details?: Record<string, unknown>
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
  skipAuth?: boolean
}

function createApiError(message: string, status: number, code?: string): ApiError {
  const error = new Error(message) as ApiError
  error.status = status
  error.code = code
  return error
}

const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

function getAuthToken(): string | null {
  try {
    // First, try to get actual JWT token (for real API integration)
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)
    if (accessToken) {
      return accessToken
    }

    // Fallback to legacy auth storage (for mock data compatibility)
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (stored) {
      const { user, expiresAt } = JSON.parse(stored)
      if (new Date(expiresAt) > new Date() && user) {
        return user.id
      }
    }
  } catch {
    // Invalid stored data
  }
  return null
}

export function setAuthTokens(accessToken: string, refreshToken?: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  }
}

export function clearAuthTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { body, skipAuth = false, headers: customHeaders, ...fetchOptions } = options

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...customHeaders,
  }

  // Add auth token if available and not skipped
  if (!skipAuth) {
    const token = getAuthToken()
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
    }
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })

    // Handle no content responses
    if (response.status === 204) {
      return undefined as T
    }

    const data = await response.json().catch(() => null)

    if (!response.ok) {
      throw createApiError(
        data?.message || `HTTP ${response.status}`,
        response.status,
        data?.code
      )
    }

    return data as T
  } catch (error) {
    if (error instanceof Error && 'status' in error) {
      throw error
    }

    // Network or parsing error
    throw createApiError(
      error instanceof Error ? error.message : 'Network error',
      0,
      'NETWORK_ERROR'
    )
  }
}

// Convenience methods
export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'POST', body }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'PUT', body }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'PATCH', body }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
}

// Error type guard
export function isApiError(error: unknown): error is ApiError {
  return error instanceof Error && 'status' in error
}

// Common error codes
export const ErrorCodes = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  ACCOUNT_SUSPENDED: 'ACCOUNT_SUSPENDED',
  EMAIL_UNVERIFIED: 'EMAIL_UNVERIFIED',
  EMAIL_EXISTS: 'EMAIL_EXISTS',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
} as const

export default api
