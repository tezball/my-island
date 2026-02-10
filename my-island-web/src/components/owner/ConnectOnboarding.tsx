import React, { useState, useEffect } from 'react';
import { Building, CheckCircle, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { ownerSubscriptionApi, supplierSubscriptionApi, type ConnectStatus } from '../../services/subscriptionApi';

interface ConnectOnboardingProps {
    userType: 'owner' | 'supplier';
}

export const ConnectOnboarding: React.FC<ConnectOnboardingProps> = ({ userType }) => {
    const [status, setStatus] = useState<ConnectStatus | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isStartingOnboarding, setIsStartingOnboarding] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const api = userType === 'owner' ? ownerSubscriptionApi : supplierSubscriptionApi;

    useEffect(() => {
        loadConnectStatus();
    }, []);

    const loadConnectStatus = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await api.getConnectStatus();
            setStatus(data);
        } catch (err) {
            console.error('Failed to load connect status:', err);
            setError('Failed to load payout status');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStartOnboarding = async () => {
        setIsStartingOnboarding(true);
        setError(null);

        const baseUrl = window.location.origin;
        const returnUrl = `${baseUrl}/${userType}/settings?connect=success`;
        const refreshUrl = `${baseUrl}/${userType}/settings?connect=refresh`;

        try {
            const { url, devMode } = await api.startConnectOnboarding(returnUrl, refreshUrl);

            if (devMode) {
                // In dev mode, the URL is a local redirect with success param
                window.location.href = url;
            } else {
                window.location.href = url;
            }
        } catch (err) {
            console.error('Failed to start onboarding:', err);
            setError('Failed to start payout setup');
            setIsStartingOnboarding(false);
        }
    };

    // Check URL params for connect status on mount
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const connectStatus = params.get('connect');

        if (connectStatus === 'success') {
            // Refresh status after successful onboarding
            loadConnectStatus();
            // Clean URL
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
        } else if (connectStatus === 'refresh') {
            // User needs to continue onboarding
            handleStartOnboarding();
        }
    }, []);

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <div className="animate-pulse">
                    <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-4">
                <Building className={`w-5 h-5 ${userType === 'owner' ? 'text-primary' : 'text-lime-500'}`} />
                <h2 className="text-base font-bold text-[#111418] dark:text-white">Payout Settings</h2>
            </div>

            {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                        <AlertCircle className="w-4 h-4" />
                        <p className="text-sm">{error}</p>
                    </div>
                </div>
            )}

            {status?.payoutsEnabled ? (
                // Payouts enabled - show success state
                <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <div>
                            <p className="font-medium text-green-700 dark:text-green-300">Payouts enabled</p>
                            <p className="text-sm text-green-600 dark:text-green-400">
                                Your account is set up to receive payments
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between py-2">
                        <div>
                            <p className="font-medium text-[#111418] dark:text-white">Stripe Dashboard</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Manage your payouts and view transaction history
                            </p>
                        </div>
                        <a
                            href="https://dashboard.stripe.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-2 text-sm font-medium ${userType === 'owner' ? 'text-primary hover:text-emerald-600' : 'text-lime-600 hover:text-lime-700'} transition-colors`}
                        >
                            Open Dashboard
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            ) : status?.hasConnectAccount && !status.onboardingComplete ? (
                // Account created but onboarding incomplete
                <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        <div>
                            <p className="font-medium text-amber-700 dark:text-amber-300">Setup incomplete</p>
                            <p className="text-sm text-amber-600 dark:text-amber-400">
                                Please complete your payout account setup
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleStartOnboarding}
                        disabled={isStartingOnboarding}
                        className={`w-full px-4 py-2.5 text-sm font-medium text-white ${userType === 'owner' ? 'bg-primary hover:bg-emerald-600' : 'bg-lime-500 hover:bg-lime-600'} rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                    >
                        {isStartingOnboarding ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            <>
                                Continue Setup
                                <ExternalLink className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            ) : (
                // No account yet
                <div className="space-y-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Set up your payout account to receive payments{userType === 'owner' ? ' from bookings' : ' from offer redemptions'}. We use Stripe to securely process payments.
                    </p>

                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                        <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Secure bank account verification
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Automatic payouts to your bank
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Detailed transaction reporting
                        </li>
                    </ul>

                    <button
                        onClick={handleStartOnboarding}
                        disabled={isStartingOnboarding}
                        className={`w-full px-4 py-2.5 text-sm font-medium text-white ${userType === 'owner' ? 'bg-primary hover:bg-emerald-600' : 'bg-lime-500 hover:bg-lime-600'} rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                    >
                        {isStartingOnboarding ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            <>
                                Set Up Payouts
                                <ExternalLink className="w-4 h-4" />
                            </>
                        )}
                    </button>

                    <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                        You'll be redirected to Stripe to complete setup
                    </p>
                </div>
            )}
        </div>
    );
};
