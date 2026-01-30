import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Header: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    return (
        <header className="bg-white dark:bg-[#1a2632] sticky top-0 z-50 shadow-sm border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center p-4 max-w-7xl mx-auto w-full">
                {isAuthenticated && user ? (
                    <>
                        <div className="flex size-10 shrink-0 items-center">
                            <div
                                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-gray-200"
                                aria-label={`User profile avatar for ${user.name}`}
                                style={{ backgroundImage: `url("${user.avatarUrl}")` }}
                            >
                            </div>
                        </div>
                        <div className="flex flex-col ml-3 flex-1">
                            <span className="text-xs text-gray-500 font-medium">Welcome back,</span>
                            <h2 className="text-[#111418] dark:text-white text-base font-bold leading-tight tracking-[-0.015em]">{user.name}</h2>
                        </div>
                        <div className="flex items-center justify-end gap-3">
                            {!user.isSupplier && !user.isOwner && (
                                <Link
                                    to="/become-a-host"
                                    className="hidden md:inline-flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-bold text-[#111418] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors mr-2"
                                >
                                    Become a Host
                                </Link>
                            )}
                            <button className="flex items-center justify-center rounded-full size-10 bg-transparent text-[#111418] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <span className="material-symbols-outlined text-2xl">notifications</span>
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-between w-full">
                        <Link to="/">
                            <h2 className="text-[#111418] dark:text-white text-lg font-bold">My Island</h2>
                        </Link>
                        <Link to="/signin" className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-[#20d85f] transition-colors">
                            Sign In
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
};
