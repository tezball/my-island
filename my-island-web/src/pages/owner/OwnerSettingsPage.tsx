import React, { useState, useEffect } from 'react';
import { CreditCard, ExternalLink } from 'lucide-react';
import { useOwnerSubscription } from '../../context/OwnerSubscriptionContext';
import { ownerPreferencesService } from '../../services/ownerPreferencesService';
import type { OwnerPreferences } from '../../services/ownerPreferencesService';

export const OwnerSettingsPage: React.FC = () => {
    const [preferences, setPreferences] = useState<OwnerPreferences | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadPreferences();
    }, []);

    const loadPreferences = async () => {
        try {
            const data = await ownerPreferencesService.getPreferences();
            setPreferences(data);
        } catch (error) {
            console.error('Failed to load preferences:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggle = async (key: keyof OwnerPreferences) => {
        if (!preferences) return;

        const newPreferences = {
            ...preferences,
            [key]: !preferences[key],
        };

        setPreferences(newPreferences);
        setIsSaving(true);

        try {
            await ownerPreferencesService.updatePreferences(newPreferences);
        } catch (error) {
            console.error('Failed to save preferences:', error);
            // Revert on error
            setPreferences(preferences);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#111418] dark:text-white">Settings</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your account settings</p>
                </div>
                <div className="animate-pulse space-y-4">
                    <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                    <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[#111418] dark:text-white">Settings</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your account settings</p>
            </div>

            <div className="space-y-4">
                <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                    <h2 className="text-base font-bold text-[#111418] dark:text-white mb-4">Notifications</h2>
                    <div className="space-y-4">
                        <SettingToggle
                            label="Email notifications for new bookings"
                            checked={preferences?.emailNotificationsBookings ?? true}
                            onChange={() => handleToggle('emailNotificationsBookings')}
                            disabled={isSaving}
                        />
                        <SettingToggle
                            label="Weekly summary reports"
                            checked={preferences?.weeklySummaryReports ?? false}
                            onChange={() => handleToggle('weeklySummaryReports')}
                            disabled={isSaving}
                        />
                    </div>
                </div>

                {/* Billing Section */}
                <BillingSection />

                <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                    <h2 className="text-base font-bold text-[#111418] dark:text-white mb-4">Booking Preferences</h2>
                    <div className="space-y-4">
                        <SettingToggle
                            label="Instant booking (no approval needed)"
                            checked={preferences?.instantBooking ?? true}
                            onChange={() => handleToggle('instantBooking')}
                            disabled={isSaving}
                        />
                        <SettingToggle
                            label="Allow same-day bookings"
                            checked={preferences?.allowSameDayBookings ?? false}
                            onChange={() => handleToggle('allowSameDayBookings')}
                            disabled={isSaving}
                        />
                        <SettingToggle
                            label="Require guest verification"
                            checked={preferences?.requireGuestVerification ?? true}
                            onChange={() => handleToggle('requireGuestVerification')}
                            disabled={isSaving}
                        />
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                    <h2 className="text-base font-bold text-[#111418] dark:text-white mb-4">Payment Settings</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Configure your payout preferences
                    </p>
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
                        <span className="material-symbols-outlined text-lg">account_balance</span>
                        Configure Payouts
                    </button>
                </div>
            </div>
        </div>
    );
};

const BillingSection: React.FC = () => {
    const { subscription, isLoading, redirectToCheckout, redirectToPortal } = useOwnerSubscription();
    const [isRedirecting, setIsRedirecting] = useState(false);

    const handleManageBilling = async () => {
        setIsRedirecting(true);
        try {
            await redirectToPortal();
        } catch {
            setIsRedirecting(false);
        }
    };

    const handleSubscribe = async () => {
        setIsRedirecting(true);
        try {
            await redirectToCheckout();
        } catch {
            setIsRedirecting(false);
        }
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
            <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <div className="animate-pulse">
                    <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-4">
                <CreditCard className="w-5 h-5 text-primary" />
                <h2 className="text-base font-bold text-[#111418] dark:text-white">Billing</h2>
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
                        <p className="text-sm text-gray-500 dark:text-gray-400">€20/month</p>
                    </div>
                    {subscription?.hasActiveSubscription || subscription?.hasLapsedSubscription ? (
                        <button
                            onClick={handleManageBilling}
                            disabled={isRedirecting}
                            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-emerald-600 transition-colors disabled:opacity-50"
                        >
                            {isRedirecting ? 'Loading...' : 'Manage Billing'}
                            <ExternalLink className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubscribe}
                            disabled={isRedirecting}
                            className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-emerald-600 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {isRedirecting ? 'Loading...' : 'Subscribe Now'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

interface SettingToggleProps {
    label: string;
    checked: boolean;
    onChange: () => void;
    disabled?: boolean;
}

const SettingToggle: React.FC<SettingToggleProps> = ({ label, checked, onChange, disabled }) => {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm text-[#111418] dark:text-white">{label}</span>
            <button
                onClick={onChange}
                disabled={disabled}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 ${
                    checked ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                }`}
            >
                <span
                    className={`inline-block size-4 transform rounded-full bg-white shadow-sm transition-transform ${
                        checked ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
            </button>
        </div>
    );
};
