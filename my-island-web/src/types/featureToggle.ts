export interface FeatureToggle {
  id: number;
  name: string;
  enabled: boolean;
  description: string | null;
  category: string | null;
  updatedBy: number | null;
  updatedAt: string;
}
