const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

// --- Error classes ---

export class ApiError extends Error {
    readonly statusCode?: number;

    constructor(message: string, statusCode?: number) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
    }
}

export class NetworkError extends ApiError {
    constructor(message = 'Unable to connect to the server') {
        super(message);
        this.name = 'NetworkError';
    }
}

export class AuthError extends ApiError {
    constructor(message = 'Authentication required') {
        super(message, 401);
        this.name = 'AuthError';
    }
}

export class NotFoundError extends ApiError {
    constructor(message = 'Resource not found') {
        super(message, 404);
        this.name = 'NotFoundError';
    }
}

// --- Helpers ---

function getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

async function parseErrorMessage(response: Response): Promise<string> {
    try {
        const body = await response.text();
        try {
            const json = JSON.parse(body);
            return json.message || json.error || json.detail || body;
        } catch {
            return body && body.length < 500 ? body : 'Request failed';
        }
    } catch {
        return 'Request failed';
    }
}

// --- Core request function ---

interface RequestOptions {
    method?: string;
    body?: unknown;
    requiresAuth?: boolean;
}

export async function apiRequest<T>(
    endpoint: string,
    options: RequestOptions = {},
): Promise<T> {
    const { method = 'GET', body, requiresAuth = true } = options;

    const headers: HeadersInit = requiresAuth
        ? getAuthHeaders()
        : { 'Content-Type': 'application/json' };

    let response: Response;
    try {
        response = await fetch(`${API_BASE}${endpoint}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });
    } catch {
        throw new NetworkError();
    }

    if (!response.ok) {
        if (response.status === 401) throw new AuthError();
        if (response.status === 404) throw new NotFoundError();
        const message = await parseErrorMessage(response);
        throw new ApiError(message, response.status);
    }

    // Handle 204 No Content
    if (response.status === 204) return undefined as T;

    return response.json();
}

// Re-export for image uploads and other non-JSON requests
export { API_BASE, getAuthHeaders };
