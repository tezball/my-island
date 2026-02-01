const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export interface OwnerPreferences {
  emailNotificationsBookings: boolean;
  weeklySummaryReports: boolean;
  instantBooking: boolean;
  allowSameDayBookings: boolean;
  requireGuestVerification: boolean;
}

export const ownerPreferencesService = {
  async getPreferences(): Promise<OwnerPreferences> {
    const response = await fetch(`${API_BASE}/owner/preferences`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch owner preferences');
    }

    return response.json();
  },

  async updatePreferences(preferences: OwnerPreferences): Promise<OwnerPreferences> {
    const response = await fetch(`${API_BASE}/owner/preferences`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(preferences),
    });

    if (!response.ok) {
      throw new Error('Failed to update owner preferences');
    }

    return response.json();
  },
};
