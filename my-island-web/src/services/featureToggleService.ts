import { apiRequest } from './apiClient';
import type { FeatureToggle } from '../types/featureToggle';

export const featureToggleService = {
  getEnabledToggles: () =>
    apiRequest<Record<string, boolean>>('/feature-toggles/enabled', { requiresAuth: false }),

  getAllToggles: () =>
    apiRequest<FeatureToggle[]>('/admin/feature-toggles'),

  updateToggle: (name: string, enabled: boolean) =>
    apiRequest<FeatureToggle>(`/admin/feature-toggles/${encodeURIComponent(name)}`, {
      method: 'PUT',
      body: { enabled },
    }),
};
