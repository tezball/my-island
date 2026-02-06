const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export type EntityType = 'LOT' | 'OFFER' | 'SUPPLIER' | 'OWNER' | 'USER';

export interface EntityImage {
    id: number;
    entityType: string;
    entityId: number;
    s3Key: string;
    url: string;
    filename: string;
    contentType: string;
    fileSize: number;
    displayOrder: number;
    isPrimary: boolean;
    altText: string | null;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function validateFile(file: File): string | null {
    if (!ALLOWED_TYPES.includes(file.type)) {
        return 'File must be a JPEG, PNG, GIF, or WebP image.';
    }
    if (file.size > MAX_FILE_SIZE) {
        return 'File must be less than 10MB.';
    }
    return null;
}

function getAuthToken(): string {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');
    return token;
}

export async function uploadImage(
    entityType: EntityType,
    entityId: string,
    file: File,
    options?: { primary?: boolean; altText?: string }
): Promise<EntityImage> {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append('file', file);

    const params = new URLSearchParams();
    if (options?.primary) params.set('primary', 'true');
    if (options?.altText) params.set('altText', options.altText);

    const queryString = params.toString();
    const url = `${API_BASE}/images/${entityType}/${entityId}${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
    });

    if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(text || `Upload failed (${response.status})`);
    }

    return response.json();
}

export async function getImages(entityType: EntityType, entityId: string): Promise<EntityImage[]> {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE}/images/${entityType}/${entityId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        if (response.status === 404) return [];
        throw new Error(`Failed to fetch images (${response.status})`);
    }

    return response.json();
}

export async function deleteImage(imageId: number): Promise<void> {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE}/images/${imageId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error(`Failed to delete image (${response.status})`);
    }
}

export async function setPrimaryImage(imageId: number): Promise<EntityImage> {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE}/images/${imageId}/primary`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error(`Failed to set primary image (${response.status})`);
    }

    return response.json();
}
