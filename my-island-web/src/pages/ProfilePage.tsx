import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PROFILE_SECTIONS = [
    { id: 'personal', label: 'Personal Details', icon: 'person', desc: 'Update your information', path: '/profile/details' },
    { id: 'security', label: 'Security', icon: 'lock', desc: 'Password and settings', path: '/profile/security' },
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
            <div className="px-6 mb-8 max-w-7xl mx-auto w-full">
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

                <Link
                    to="/journal"
                    className="bg-gradient-to-r from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20 rounded-xl p-4 flex items-center justify-between mb-4 border border-cyan-200 dark:border-cyan-800/50"
                >
                    <div className="flex items-center gap-3">
                        <div className="size-12 rounded-full bg-cyan-500 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-white">explore</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-[#111418] dark:text-white text-base">Travel Journal</h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Track your Irish adventures</p>
                        </div>
                    </div>
                    <span className="material-symbols-outlined text-cyan-500">chevron_right</span>
                </Link>

                <div className="flex flex-col gap-2">
                    {(user?.isOwner || user?.isStaff) && (
                        <Link
                            to="/owner"
                            className="flex items-center justify-between p-4 bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-blue-200 dark:border-blue-900/50 mb-2"
                        >
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                    <span className="material-symbols-outlined">cabin</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#111418] dark:text-white text-base">Owner Portal</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {user?.isOwner ? 'Manage your property & bookings' : 'Staff access'}
                                    </p>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                        </Link>
                    )}
                    {(user?.isSupplier || user?.isStaff) && (
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
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {user?.isSupplier ? 'Manage offers & business' : 'Staff access'}
                                    </p>
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

                    {!user?.isStaff && (!user?.isOwner || !user?.isSupplier) && (
                        <>
                            <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3 px-1">Grow with My Island</h3>
                            </div>

                            {!user?.isOwner && (
                                <Link
                                    to="/become-a-host"
                                    className="flex items-center justify-between p-4 bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-blue-200 dark:border-blue-800/50"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                            <span className="material-symbols-outlined">cabin</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[#111418] dark:text-white text-base">Become a Host</h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Earn money by listing your campsite</p>
                                        </div>
                                    </div>
                                    <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                                </Link>
                            )}

                            {!user?.isSupplier && (
                                <Link
                                    to="/become-a-supplier"
                                    className="flex items-center justify-between p-4 bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-purple-200 dark:border-purple-800/50"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="size-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                            <span className="material-symbols-outlined">storefront</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[#111418] dark:text-white text-base">Become a Supplier</h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Offer local services & deals to campers</p>
                                        </div>
                                    </div>
                                    <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                                </Link>
                            )}
                        </>
                    )}
                </div>
            </div>
        </main>
    );
};
