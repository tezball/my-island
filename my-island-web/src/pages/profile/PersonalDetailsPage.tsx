import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const PersonalDetailsPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState('+353 87 123 4567');
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        setShowSuccess(true);
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
                    <h1 className="text-xl font-bold text-[#111418] dark:text-white">Personal Details</h1>
                </div>
            </div>

            <div className="max-w-2xl mx-auto w-full px-4 py-6">
                {showSuccess && (
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2 text-green-700 dark:text-green-400">
                        <span className="material-symbols-outlined">check_circle</span>
                        <span>Your changes have been saved successfully!</span>
                    </div>
                )}

                <form onSubmit={handleSave} className="space-y-6">
                    {/* Avatar */}
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
                            {name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <button
                            type="button"
                            className="text-primary font-semibold hover:underline"
                        >
                            Change photo
                        </button>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-[#111418] dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Enter your name"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-[#111418] dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Enter your email"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-[#111418] dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Enter your phone number"
                        />
                    </div>

                    {/* Save Button */}
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full bg-primary hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </main>
    );
};
