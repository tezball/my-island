import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PROFILE_SECTIONS = [
    { id: 'personal', label: 'Personal Details', icon: 'person', desc: 'Update your information', path: '/profile/details' },
    { id: 'security', label: 'Security', icon: 'lock', desc: 'Password and settings', path: '/profile/security' },
    { id: 'payments', label: 'Payment Details', icon: 'credit_card', desc: 'Add or remove cards', path: '/profile/payment' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications', desc: 'Manage alerts', path: '/profile/notifications' },
];

export const ProfilePage: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/signin');
    };

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <p className="mb-4 text-gray-600">Please sign in to view your profile.</p>
                <Link to="/signin" className="rounded-xl bg-primary px-6 py-3 font-bold text-white">Sign In</Link>
            </div>
        );
    }

    return (
        <main className="flex-1 flex flex-col pt-4 pb-24 bg-background-light dark:bg-background-dark min-h-screen">
            <div className="px-6 mb-8">
                <h1 className="text-3xl font-bold text-[#111418] dark:text-white mb-6">Profile</h1>

                <div className="flex items-center gap-4 mb-6">
                    <div
                        className="size-20 bg-center bg-no-repeat bg-cover rounded-full border-2 border-primary"
                        style={{ backgroundImage: `url("${user?.avatarUrl || ''}")` }}
                    ></div>
                    <div>
                        <h2 className="text-xl font-bold text-[#111418] dark:text-white">{user?.name || 'Guest'}</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{user?.email}</p>
                    </div>
                </div>

                <Link
                    to="/vouchers"
                    className="bg-gradient-to-r from-primary/10 to-emerald-100 dark:from-primary/20 dark:to-emerald-900/20 rounded-xl p-4 flex items-center justify-between mb-4 border border-primary/20"
                >
                    <div className="flex items-center gap-3">
                        <div className="size-12 rounded-full bg-primary flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-white">local_offer</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-[#111418] dark:text-white text-base">My Vouchers</h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400">View your saved offers & discounts</p>
                        </div>
                    </div>
                    <span className="material-symbols-outlined text-primary">chevron_right</span>
                </Link>

                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 flex items-center gap-3 mb-8 border border-amber-200 dark:border-amber-900/50">
                    <div className="size-10 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-white">card_giftcard</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-[#111418] dark:text-gray-200 text-sm">10% discount available</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">On your next booking over €100</p>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    {user?.role === 'admin' && (
                        <Link
                            to="/admin"
                            className="flex items-center justify-between p-4 bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-orange-200 dark:border-orange-900/50 mb-2"
                        >
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                                    <span className="material-symbols-outlined">admin_panel_settings</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#111418] dark:text-white text-base">Admin Portal</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Manage bookings & lots</p>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                        </Link>
                    )}
                    {user?.isSupplier && (
                        <Link
                            to="/supplier"
                            className="flex items-center justify-between p-4 bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-purple-200 dark:border-purple-900/50 mb-2"
                        >
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                    <span className="material-symbols-outlined">storefront</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#111418] dark:text-white text-base">Supplier Portal</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Manage offers & business</p>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                        </Link>
                    )}
                    {PROFILE_SECTIONS.map((section) => (
                        <Link
                            key={section.id}
                            to={section.path}
                            className="flex items-center justify-between p-4 bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800"
                        >
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300">
                                    <span className="material-symbols-outlined">{section.icon}</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#111418] dark:text-white text-base">{section.label}</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{section.desc}</p>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                        </Link>
                    ))}

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-4 p-4 mt-4 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors w-full text-left"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        Log out
                    </button>
                </div>
            </div>
        </main>
    );
};
