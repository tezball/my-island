import React, { useState, useEffect, useCallback } from 'react';
import { CreditCard, ExternalLink, Star, AlertTriangle } from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';
import { supplierService } from '../../services/supplierService';
import { supplierSubscriptionApi } from '../../services/subscriptionApi';
import { SubscriptionFormModal } from '../../components/subscription/SubscriptionForm';
import { ConnectOnboarding } from '../../components/owner/ConnectOnboarding';
import type { SupplierPreferences } from '../../types/supplier';

export const SupplierSettingsPage: React.FC = () => {
    const [settings, setSettings] = useState<SupplierPreferences>({
        emailNotifications: true,
        newClaimAlerts: true,
        weeklyReport: false,
        marketingEmails: false,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDeactivated, setIsDeactivated] = useState(false);
    const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
    const [isDeactivating, setIsDeactivating] = useState(false);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [prefs, deactivated] = await Promise.all([
                supplierService.getPreferences(),
                supplierService.isDeactivated(),
            ]);
            setSettings(prefs);
            setIsDeactivated(deactivated);
        } catch {
            setError('Failed to load settings. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleSave = async () => {
        setIsSaving(true);
        setError(null);
        try {
            const updated = await supplierService.updatePreferences(settings);
            setSettings(updated);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch {
            setError('Failed to save settings. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeactivate = async () => {
        setIsDeactivating(true);
        try {
            await supplierService.deactivateAccount();
            setIsDeactivated(true);
            setShowDeactivateConfirm(false);
        } catch {
            setError('Failed to deactivate account. Please try again.');
        } finally {
            setIsDeactivating(false);
        }
    };

    const handleReactivate = async () => {
        setIsDeactivating(true);
        try {
            await supplierService.reactivateAccount();
            setIsDeactivated(false);
        } catch {
            setError('Failed to reactivate account. Please try again.');
        } finally {
            setIsDeactivating(false);
        }
    };

    const ToggleSetting: React.FC<{
        label: string;
        description: string;
        checked: boolean;
        onChange: (checked: boolean) => void;
    }> = ({ label, description, checked, onChange }) => (
        <div className="flex items-center justify-between py-4">
            <div>
                <p className="font-medium text-[#111418] dark:text-white">{label}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    className="sr-only peer"
                    disabled={isSaving}
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-lime-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lime-500 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
            </label>
        </div>
    );

    if (isLoading) {
        return (
            <div className="max-w-2xl">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-[#111418] dark:text-white mb-2">Settings</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage your notification preferences and account settings</p>
                </div>
                <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-6 animate-pulse">
                            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                            <div className="space-y-4">
                                <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[#111418] dark:text-white mb-2">Settings</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Manage your notification preferences and account settings
                </p>
            </div>

            {isDeactivated && (
                <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 mb-2">
                        <AlertTriangle className="w-5 h-5" />
                        <span className="font-semibold">Account Deactivated</span>
                    </div>
                    <p className="text-sm text-amber-600 dark:text-amber-400">
                        Your supplier account is currently deactivated. All your offers are hidden from guests.
                    </p>
                </div>
            )}

            {showSuccess && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-medium">Settings saved successfully!</span>
                    </div>
                </div>
            )}

            {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                        <span className="font-medium">{error}</span>
                    </div>
                </div>
            )}

            {/* Notification Settings */}
            <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
                <h2 className="text-lg font-bold text-[#111418] dark:text-white mb-4">Notifications</h2>
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    <ToggleSetting
                        label="Email Notifications"
                        description="Receive email notifications for important updates"
                        checked={settings.emailNotifications}
                        onChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                    />
                    <ToggleSetting
                        label="New Claim Alerts"
                        description="Get notified when a guest claims one of your offers"
                        checked={settings.newClaimAlerts}
                        onChange={(checked) => setSettings(prev => ({ ...prev, newClaimAlerts: checked }))}
                    />
                    <ToggleSetting
                        label="Weekly Performance Report"
                        description="Receive a weekly summary of your offer performance"
                        checked={settings.weeklyReport}
                        onChange={(checked) => setSettings(prev => ({ ...prev, weeklyReport: checked }))}
                    />
                    <ToggleSetting
                        label="Marketing Emails"
                        description="Receive tips and updates about the marketplace"
                        checked={settings.marketingEmails}
                        onChange={(checked) => setSettings(prev => ({ ...prev, marketingEmails: checked }))}
                    />
                </div>
            </div>

            {/* Featured Promotion Section */}
            <FeaturedPromotionSection />

            {/* Billing Section */}
            <BillingSection />

            {/* Payout Settings Section */}
            <ConnectOnboarding userType="supplier" />

            {/* Danger Zone */}
            <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-red-200 dark:border-red-900/50 p-6 mb-6">
                <h2 className="text-lg font-bold text-red-600 dark:text-red-400 mb-4">Danger Zone</h2>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-[#111418] dark:text-white">
                            {isDeactivated ? 'Reactivate Supplier Account' : 'Deactivate Supplier Account'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {isDeactivated
                                ? 'Reactivate your account to make your business visible again'
                                : 'This will hide all your offers from guests'}
                        </p>
                    </div>
                    {isDeactivated ? (
                        <button
                            onClick={handleReactivate}
                            disabled={isDeactivating}
                            className="px-4 py-2 text-sm font-medium text-white bg-lime-500 hover:bg-lime-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isDeactivating ? 'Reactivating...' : 'Reactivate'}
                        </button>
                    ) : (
                        <button
                            onClick={() => setShowDeactivateConfirm(true)}
                            className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                        >
                            Deactivate
                        </button>
                    )}
                </div>
            </div>

            {/* Save Button */}
            <div className="mt-8">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-6 py-2.5 text-sm font-medium text-white bg-lime-500 hover:bg-lime-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? 'Saving...' : 'Save Settings'}
                </button>
            </div>

            {/* Deactivation Confirmation Modal */}
            {showDeactivateConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-[#1a2632] rounded-xl p-6 max-w-md w-full shadow-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </div>
                            <h3 className="text-lg font-bold text-[#111418] dark:text-white">
                                Deactivate Account?
                            </h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            This will:
                        </p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 mb-6 list-disc list-inside space-y-1">
                            <li>Hide your business from the marketplace</li>
                            <li>Deactivate all your active offers</li>
                            <li>Prevent guests from claiming new offers</li>
                        </ul>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                            You can reactivate your account at any time, but you will need to re-enable offers individually.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowDeactivateConfirm(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeactivate}
                                disabled={isDeactivating}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isDeactivating ? 'Deactivating...' : 'Deactivate Account'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const BillingSection: React.FC = () => {
    const { subscription, isLoading, error, refresh, redirectToPortal } = useSubscription();
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

    const handleManageBilling = async () => {
        setIsRedirecting(true);
        try {
            await redirectToPortal();
        } catch {
            // error is set in context
        } finally {
            setIsRedirecting(false);
        }
    };

    const handleSubscribe = () => {
        setShowSubscriptionModal(true);
    };

    const handleSubscriptionSuccess = () => {
        setShowSubscriptionModal(false);
        refresh();
    };

    const getStatusBadge = () => {
        if (!subscription) return null;

        const statusStyles: Record<string, string> = {
            ACTIVE: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            TRIALING: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            PAST_DUE: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
            CANCELED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
            UNPAID: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
            NONE: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
        };

        const statusLabels: Record<string, string> = {
            ACTIVE: 'Active',
            TRIALING: 'Free Trial',
            PAST_DUE: 'Past Due',
            CANCELED: 'Canceled',
            UNPAID: 'Unpaid',
            NONE: 'Not Subscribed',
        };

        return (
            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusStyles[subscription.status]}`}>
                {statusLabels[subscription.status]}
            </span>
        );
    };

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
                <div className="animate-pulse">
                    <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
                <CreditCard className="w-5 h-5 text-lime-500" />
                <h2 className="text-lg font-bold text-[#111418] dark:text-white">Billing</h2>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                    <div>
                        <p className="font-medium text-[#111418] dark:text-white">Subscription Status</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {subscription?.isTrialing
                                ? `Free trial \u2014 ${subscription.trialDaysRemaining ?? 0} days remaining`
                                : subscription?.hasActiveSubscription
                                ? 'Your subscription is active'
                                : subscription?.hasLapsedSubscription
                                ? 'Your subscription has ended'
                                : 'No active subscription'}
                        </p>
                    </div>
                    {getStatusBadge()}
                </div>

                {subscription?.currentPeriodEnd && subscription.hasActiveSubscription && (
                    <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-800">
                        <div>
                            <p className="font-medium text-[#111418] dark:text-white">
                                {subscription.cancelAtPeriodEnd ? 'Ends On' : 'Renews On'}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(subscription.currentPeriodEnd).toLocaleDateString('en-IE', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </p>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-800">
                    <div>
                        <p className="font-medium text-[#111418] dark:text-white">Monthly Plan</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">&euro;5/month</p>
                    </div>
                    {subscription?.hasActiveSubscription || subscription?.hasLapsedSubscription ? (
                        <button
                            onClick={handleManageBilling}
                            disabled={isRedirecting}
                            className="inline-flex items-center gap-2 text-sm font-medium text-lime-600 hover:text-lime-700 transition-colors disabled:opacity-50"
                        >
                            {isRedirecting ? 'Loading...' : 'Manage Billing'}
                            <ExternalLink className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubscribe}
                            className="px-4 py-2 text-sm font-medium text-white bg-lime-500 hover:bg-lime-600 rounded-lg transition-colors"
                        >
                            Subscribe Now
                        </button>
                    )}
                </div>
            </div>

            <SubscriptionFormModal
                isOpen={showSubscriptionModal}
                onClose={() => setShowSubscriptionModal(false)}
                onSuccess={handleSubscriptionSuccess}
                createSetupIntent={supplierSubscriptionApi.createSetupIntent}
                confirmSubscription={supplierSubscriptionApi.confirmSubscription}
                pricePerMonth="&euro;5"
                planName="Supplier Plan"
            />
        </div>
    );
};

const FeaturedPromotionSection: React.FC = () => {
    const [isPurchasing, setIsPurchasing] = useState<'7_DAYS' | '30_DAYS' | null>(null);
    const [supplierProfile, setSupplierProfile] = useState<{ isFeatured?: boolean; featuredUntil?: string } | null>(null);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const profile = await supplierService.getSupplierProfile('');
            if (profile) {
                // The profile doesn't have featured fields yet in the frontend type
                // We'll check if the API returns them
                setSupplierProfile(profile as unknown as { isFeatured?: boolean; featuredUntil?: string });
            }
        } catch {
            // Ignore errors
        }
    };

    const handlePurchase = async (duration: '7_DAYS' | '30_DAYS') => {
        setIsPurchasing(duration);
        try {
            const { checkoutUrl } = await supplierService.purchaseFeatured(duration);
            window.location.href = checkoutUrl;
        } catch (error) {
            console.error('Failed to create checkout session:', error);
            setIsPurchasing(null);
        }
    };

    const isFeatured = supplierProfile?.isFeatured;
    const featuredUntil = supplierProfile?.featuredUntil
        ? new Date(supplierProfile.featuredUntil)
        : null;
    const isCurrentlyFeatured = isFeatured && featuredUntil && featuredUntil > new Date();

    return (
        <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
                <Star className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-bold text-[#111418] dark:text-white">Featured Promotion</h2>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Get your business featured on the My Island marketplace and reach more guests.
            </p>

            {isCurrentlyFeatured && featuredUntil && (
                <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-medium">Your business is currently featured</span>
                    </div>
                    <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                        Featured until {featuredUntil.toLocaleDateString('en-IE', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        })}
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="font-bold text-[#111418] dark:text-white text-lg mb-1">7 Days</div>
                    <div className="text-2xl font-bold text-lime-600 dark:text-lime-400 mb-2">&euro;9.99</div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Perfect for short-term promotions
                    </p>
                    <button
                        onClick={() => handlePurchase('7_DAYS')}
                        disabled={isPurchasing !== null}
                        className="w-full px-4 py-2 text-sm font-medium text-white bg-lime-500 hover:bg-lime-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPurchasing === '7_DAYS' ? 'Loading...' : isCurrentlyFeatured ? 'Extend by 7 Days' : 'Get Featured'}
                    </button>
                </div>

                <div className="border border-lime-300 dark:border-lime-700 rounded-lg p-4 relative">
                    <div className="absolute -top-2 right-3 px-2 py-0.5 bg-lime-500 text-white text-xs font-medium rounded">
                        Best Value
                    </div>
                    <div className="font-bold text-[#111418] dark:text-white text-lg mb-1">30 Days</div>
                    <div className="text-2xl font-bold text-lime-600 dark:text-lime-400 mb-2">&euro;29.99</div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Maximum visibility for your business
                    </p>
                    <button
                        onClick={() => handlePurchase('30_DAYS')}
                        disabled={isPurchasing !== null}
                        className="w-full px-4 py-2 text-sm font-medium text-white bg-lime-500 hover:bg-lime-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPurchasing === '30_DAYS' ? 'Loading...' : isCurrentlyFeatured ? 'Extend by 30 Days' : 'Get Featured'}
                    </button>
                </div>
            </div>
        </div>
    );
};
