// API base URL - defaults to localhost:8080 for Spring Boot backend
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

// Helper to build full API URLs
export function apiUrl(path: string): string {
  // If using MSW, use relative paths
  if (import.meta.env.VITE_USE_MSW === 'true') {
    return path
  }
  // Otherwise use the backend URL
  return `${API_URL}${path}`
}

// Fetch wrapper with auth token
export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem('auth_token')

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  if (token) {
    ;(headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  }

  return fetch(apiUrl(path), {
    ...options,
    headers,
  })
}
