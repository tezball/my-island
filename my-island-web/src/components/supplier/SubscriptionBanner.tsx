import React from 'react';
import { AlertTriangle, CreditCard } from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';

export const SubscriptionBanner: React.FC = () => {
  const { subscription, redirectToCheckout, redirectToPortal, isLoading } = useSubscription();

  if (isLoading || !subscription) {
    return null;
  }

  // Show nothing for active subscriptions
  if (subscription.hasActiveSubscription && !subscription.cancelAtPeriodEnd) {
    return null;
  }

  // Determine banner type and message
  let bannerType: 'warning' | 'error' = 'warning';
  let message = '';
  let actionText = 'Subscribe Now';
  let actionFn = redirectToCheckout;

  if (subscription.needsSubscription) {
    bannerType = 'warning';
    message = 'Activate your subscription to start using supplier features.';
    actionText = 'Subscribe Now';
    actionFn = redirectToCheckout;
  } else if (subscription.cancelAtPeriodEnd && subscription.hasActiveSubscription) {
    bannerType = 'warning';
    const endDate = subscription.currentPeriodEnd
      ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
      : 'soon';
    message = `Your subscription will end on ${endDate}. Renew to keep your offers active.`;
    actionText = 'Manage Billing';
    actionFn = redirectToPortal;
  } else if (subscription.status === 'PAST_DUE') {
    bannerType = 'error';
    message = 'Payment failed. Please update your payment method to avoid service interruption.';
    actionText = 'Update Payment';
    actionFn = redirectToPortal;
  } else if (subscription.status === 'CANCELED' || subscription.status === 'UNPAID') {
    bannerType = 'error';
    message = 'Your subscription has ended. Resubscribe to continue using supplier features.';
    actionText = 'Resubscribe';
    actionFn = redirectToCheckout;
  }

  if (!message) {
    return null;
  }

  const bgColor = bannerType === 'error' ? 'bg-red-50' : 'bg-amber-50';
  const borderColor = bannerType === 'error' ? 'border-red-200' : 'border-amber-200';
  const textColor = bannerType === 'error' ? 'text-red-800' : 'text-amber-800';
  const iconColor = bannerType === 'error' ? 'text-red-500' : 'text-amber-500';
  const buttonBg = bannerType === 'error' ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-600 hover:bg-amber-700';

  return (
    <div className={`${bgColor} ${borderColor} border-b px-4 py-3`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className={`w-5 h-5 ${iconColor} flex-shrink-0`} />
          <p className={`${textColor} text-sm font-medium`}>{message}</p>
        </div>
        <button
          onClick={actionFn}
          className={`${buttonBg} text-white px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 whitespace-nowrap transition-colors`}
        >
          <CreditCard className="w-4 h-4" />
          {actionText}
        </button>
      </div>
    </div>
  );
};
