import React from 'react';

export const AdminDashboardPage: React.FC = () => {
    return (
        <div className="max-w-4xl">
            <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="size-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-2xl">admin_panel_settings</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-[#111418] dark:text-white">Admin Dashboard</h1>
                        <p className="text-gray-500 dark:text-gray-400">Platform administration coming soon.</p>
                    </div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50 rounded-lg p-4">
                    <p className="text-sm text-red-700 dark:text-red-300">
                        This is a placeholder for the admin portal. Future features will include user management, platform analytics, and system configuration.
                    </p>
                </div>
            </div>
        </div>
    );
};
