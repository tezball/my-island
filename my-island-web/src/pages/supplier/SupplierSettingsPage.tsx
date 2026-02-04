import React, { useState, useEffect } from 'react';
import { CreditCard, ExternalLink, Star } from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';
import { supplierService } from '../../services/supplierService';
import { supplierSubscriptionApi } from '../../services/subscriptionApi';
import { SubscriptionFormModal } from '../../components/subscription/SubscriptionForm';
import { ConnectOnboarding } from '../../components/owner/ConnectOnboarding';

export const SupplierSettingsPage: React.FC = () => {
    const [settings, setSettings] = useState({
        emailNotifications: true,
        newClaimAlerts: true,
        weeklyReport: false,
        marketingEmails: false
    });
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsSaving(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
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
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-lime-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lime-500"></div>
            </label>
        </div>
    );

    return (
        <div className="max-w-2xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[#111418] dark:text-white mb-2">Settings</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Manage your notification preferences and account settings
                </p>
            </div>

            {showSuccess && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                        <span className="material-symbols-outlined">check_circle</span>
                        <span className="font-medium">Settings saved successfully!</span>
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

            {/* Account Section */}
            <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
                <h2 className="text-lg font-bold text-[#111418] dark:text-white mb-4">Account</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between py-2">
                        <div>
                            <p className="font-medium text-[#111418] dark:text-white">Change Password</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Update your account password</p>
                        </div>
                        <button className="text-sm font-medium text-lime-600 hover:text-lime-700 transition-colors">
                            Change
                        </button>
                    </div>
                    <div className="flex items-center justify-between py-2">
                        <div>
                            <p className="font-medium text-[#111418] dark:text-white">Two-Factor Authentication</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security</p>
                        </div>
                        <button className="text-sm font-medium text-lime-600 hover:text-lime-700 transition-colors">
                            Enable
                        </button>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-red-200 dark:border-red-900/50 p-6">
                <h2 className="text-lg font-bold text-red-600 dark:text-red-400 mb-4">Danger Zone</h2>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-[#111418] dark:text-white">Deactivate Supplier Account</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            This will hide all your offers from guests
                        </p>
                    </div>
                    <button className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                        Deactivate
                    </button>
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
        </div>
    );
};

const BillingSection: React.FC = () => {
    const { subscription, isLoading, refresh, redirectToPortal } = useSubscription();
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

    const handleManageBilling = async () => {
        setIsRedirecting(true);
        try {
            await redirectToPortal();
        } catch {
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
            PAST_DUE: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
            CANCELED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
            UNPAID: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
            NONE: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
        };

        const statusLabels: Record<string, string> = {
            ACTIVE: 'Active',
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

            <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                    <div>
                        <p className="font-medium text-[#111418] dark:text-white">Subscription Status</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {subscription?.hasActiveSubscription
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
                        <p className="text-sm text-gray-500 dark:text-gray-400">€15/month</p>
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
                pricePerMonth="€15"
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
                    <div className="text-2xl font-bold text-lime-600 dark:text-lime-400 mb-2">€9.99</div>
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
                    <div className="text-2xl font-bold text-lime-600 dark:text-lime-400 mb-2">€29.99</div>
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
