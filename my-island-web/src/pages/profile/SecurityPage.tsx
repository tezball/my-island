import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const SecurityPage: React.FC = () => {
    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        setShowSuccess(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setShowSuccess(false), 3000);
    };

    return (
        <main className="flex-1 flex flex-col pb-20">
            {/* Header */}
            <div className="bg-white dark:bg-[#1a2632] border-b border-gray-200 dark:border-gray-700 px-4 py-4">
                <div className="max-w-2xl mx-auto flex items-center gap-4">
                    <button
                        onClick={() => navigate('/profile')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="text-xl font-bold text-[#111418] dark:text-white">Security</h1>
                </div>
            </div>

            <div className="max-w-2xl mx-auto w-full px-4 py-6">
                {showSuccess && (
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2 text-green-700 dark:text-green-400">
                        <span className="material-symbols-outlined">check_circle</span>
                        <span>Password changed successfully!</span>
                    </div>
                )}

                {/* Change Password Section */}
                <div className="bg-white dark:bg-[#1a2632] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-[#111418] dark:text-white mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined">lock</span>
                        Change Password
                    </h2>

                    <form onSubmit={handleChangePassword} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Current Password
                            </label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-[#111418] dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Enter current password"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                New Password
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-[#111418] dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Enter new password"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-[#111418] dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Confirm new password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="w-full bg-primary hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
                        >
                            {isSaving ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>

                {/* Two-Factor Authentication */}
                <div className="mt-6 bg-white dark:bg-[#1a2632] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-gray-500">security</span>
                            <div>
                                <h3 className="font-semibold text-[#111418] dark:text-white">Two-Factor Authentication</h3>
                                <p className="text-sm text-gray-500">Add an extra layer of security</p>
                            </div>
                        </div>
                        <button className="text-primary font-semibold hover:underline">
                            Enable
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};
