import React, { useState } from 'react';

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
