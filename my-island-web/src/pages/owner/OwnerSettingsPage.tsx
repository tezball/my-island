import React from 'react';

export const OwnerSettingsPage: React.FC = () => {
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
                        <SettingToggle label="Email notifications for new bookings" defaultChecked />
                        <SettingToggle label="SMS alerts for check-ins" defaultChecked />
                        <SettingToggle label="Weekly summary reports" />
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                    <h2 className="text-base font-bold text-[#111418] dark:text-white mb-4">Booking Preferences</h2>
                    <div className="space-y-4">
                        <SettingToggle label="Instant booking (no approval needed)" defaultChecked />
                        <SettingToggle label="Allow same-day bookings" />
                        <SettingToggle label="Require guest verification" defaultChecked />
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

const SettingToggle: React.FC<{ label: string; defaultChecked?: boolean }> = ({ label, defaultChecked }) => {
    const [checked, setChecked] = React.useState(defaultChecked || false);

    return (
        <div className="flex items-center justify-between">
            <span className="text-sm text-[#111418] dark:text-white">{label}</span>
            <button
                onClick={() => setChecked(!checked)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
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
