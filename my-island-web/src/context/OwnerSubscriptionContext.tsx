import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ownerSubscriptionService } from '../services/ownerSubscriptionService';
import { ownerSubscriptionApi } from '../services/subscriptionApi';
import { SubscriptionFormModal } from '../components/subscription/SubscriptionForm';
import type { SubscriptionDto, SubscriptionStatus } from '../types/subscription';
import { useAuth } from './AuthContext';

interface OwnerSubscriptionContextType {
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

const OwnerSubscriptionContext = createContext<OwnerSubscriptionContextType | undefined>(undefined);

export const OwnerSubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSubscriptionForm, setShowSubscriptionForm] = useState(false);

  const refresh = useCallback(async () => {
    if (!user?.isOwner) {
      setSubscription(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await ownerSubscriptionService.getSubscriptionStatus();
      setSubscription(data);
    } catch (err) {
      console.error('Failed to fetch owner subscription:', err);
      setError('Failed to load subscription status');
      setSubscription(defaultSubscription);
    } finally {
      setIsLoading(false);
    }
  }, [user?.isOwner]);

  useEffect(() => {
    if (user?.isOwner) {
      refresh();
    } else {
      setSubscription(null);
    }
  }, [user?.isOwner, refresh]);

  const redirectToCheckout = async () => {
    setShowSubscriptionForm(true);
  };

  const redirectToPortal = async () => {
    try {
      const { portalUrl, devMode } = await ownerSubscriptionService.createPortalSession();
      if (devMode || !portalUrl) {
        setError('Billing portal is not available in development mode');
        return;
      }
      window.location.href = portalUrl;
    } catch (err) {
      console.error('Failed to create owner portal session:', err);
      setError('Failed to open billing portal');
      throw err;
    }
  };

  return (
    <OwnerSubscriptionContext.Provider
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
        createSetupIntent={ownerSubscriptionApi.createSetupIntent}
        confirmSubscription={ownerSubscriptionApi.confirmSubscription}
        pricePerMonth="€15"
        planName="Owner Plan"
      />
    </OwnerSubscriptionContext.Provider>
  );
};

export const useOwnerSubscription = () => {
  const context = useContext(OwnerSubscriptionContext);
  if (context === undefined) {
    throw new Error('useOwnerSubscription must be used within an OwnerSubscriptionProvider');
  }
  return context;
};
