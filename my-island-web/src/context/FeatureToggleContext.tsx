import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { featureToggleService } from '../services/featureToggleService';

interface FeatureToggleContextType {
  toggles: Record<string, boolean>;
  isLoading: boolean;
  isFeatureEnabled: (name: string) => boolean;
  refresh: () => Promise<void>;
}

const FeatureToggleContext = createContext<FeatureToggleContextType | undefined>(undefined);

export const FeatureToggleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toggles, setToggles] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await featureToggleService.getEnabledToggles();
      setToggles(data);
    } catch (err) {
      console.error('Failed to fetch feature toggles:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const isFeatureEnabled = useCallback(
    (name: string): boolean => toggles[name] ?? true,
    [toggles],
  );

  return (
    <FeatureToggleContext.Provider value={{ toggles, isLoading, isFeatureEnabled, refresh }}>
      {children}
    </FeatureToggleContext.Provider>
  );
};

export const useFeatureToggle = () => {
  const context = useContext(FeatureToggleContext);
  if (context === undefined) {
    throw new Error('useFeatureToggle must be used within a FeatureToggleProvider');
  }
  return context;
};
