import React from 'react';
import { Link } from 'react-router-dom';
import { useOwnerSubscription } from '../../context/OwnerSubscriptionContext';

interface SubscriptionGateProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

/**
 * A wrapper component that gates content behind owner subscription.
 * Shows subscription prompt when not subscribed, otherwise renders children.
 */
export const SubscriptionGate: React.FC<SubscriptionGateProps> = ({ children, fallback }) => {
    const { subscription, isLoading, redirectToCheckout } = useOwnerSubscription();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-gray-500 dark:text-gray-400">Loading...</div>
            </div>
        );
    }

    if (!subscription?.hasActiveSubscription) {
        if (fallback) {
            return <>{fallback}</>;
        }

        return (
            <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-8 text-center">
                <div className="inline-flex items-center justify-center size-16 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-4">
                    <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-3xl">lock</span>
                </div>
                <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-2">
                    Subscription Required
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                    This feature requires an active subscription. Subscribe to unlock all owner features including analytics, lot management, and the ability to receive bookings.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                        onClick={redirectToCheckout}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-[#20d85f] transition-colors text-sm font-medium"
                    >
                        <span className="material-symbols-outlined text-lg">credit_card</span>
                        Subscribe Now
                    </button>
                    <Link
                        to="/faq"
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                    >
                        Learn More
                    </Link>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};
