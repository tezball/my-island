import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { subscriptionService } from '../services/subscriptionService';
import { supplierSubscriptionApi } from '../services/subscriptionApi';
import { SubscriptionFormModal } from '../components/subscription/SubscriptionForm';
import type { SubscriptionDto, SubscriptionStatus } from '../types/subscription';
import { useAuth } from './AuthContext';
import { useFeatureToggle } from './FeatureToggleContext';

interface SubscriptionContextType {
  subscription: SubscriptionDto | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  redirectToCheckout: () => Promise<void>;
  redirectToPortal: () => Promise<void>;
}

const defaultSubscription: SubscriptionDto = {
  status: 'NONE' as SubscriptionStatus,
  currentPeriodEnd: null,
  cancelAtPeriodEnd: false,
  hasActiveSubscription: false,
  hasLapsedSubscription: false,
  needsSubscription: true,
  isTrialing: false,
  trialDaysRemaining: null,
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { isFeatureEnabled } = useFeatureToggle();
  const [subscription, setSubscription] = useState<SubscriptionDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSubscriptionForm, setShowSubscriptionForm] = useState(false);

  const refresh = useCallback(async () => {
    if (!user?.isSupplier) {
      setSubscription(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await subscriptionService.getSubscriptionStatus();
      // When subscription enforcement is disabled, override to grant access
      if (!isFeatureEnabled('SUBSCRIPTION_ENFORCEMENT')) {
        setSubscription({ ...data, hasActiveSubscription: true, needsSubscription: false });
      } else {
        setSubscription(data);
      }
    } catch (err) {
      console.error('Failed to fetch subscription:', err);
      setError('Failed to load subscription status');
      if (!isFeatureEnabled('SUBSCRIPTION_ENFORCEMENT')) {
        setSubscription({ ...defaultSubscription, hasActiveSubscription: true, needsSubscription: false });
      } else {
        setSubscription(defaultSubscription);
      }
    } finally {
      setIsLoading(false);
    }
  }, [user?.isSupplier, isFeatureEnabled]);

  useEffect(() => {
    if (user?.isSupplier) {
      refresh();
    } else {
      setSubscription(null);
    }
  }, [user?.isSupplier, refresh]);

  const redirectToCheckout = async () => {
    setShowSubscriptionForm(true);
  };

  const redirectToPortal = async () => {
    try {
      const { portalUrl, devMode } = await subscriptionService.createPortalSession();
      if (devMode || !portalUrl) {
        setError('Billing portal is not available in development mode');
        return;
      }
      window.location.href = portalUrl;
    } catch (err) {
      console.error('Failed to create portal session:', err);
      setError('Failed to open billing portal');
      throw err;
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        isLoading,
        error,
        refresh,
        redirectToCheckout,
        redirectToPortal,
      }}
    >
      {children}
      <SubscriptionFormModal
        isOpen={showSubscriptionForm}
        onClose={() => setShowSubscriptionForm(false)}
        onSuccess={async () => {
          setShowSubscriptionForm(false);
          await refresh();
        }}
        createSetupIntent={supplierSubscriptionApi.createSetupIntent}
        confirmSubscription={supplierSubscriptionApi.confirmSubscription}
        pricePerMonth="€5"
        planName="Supplier Plan"
      />
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
