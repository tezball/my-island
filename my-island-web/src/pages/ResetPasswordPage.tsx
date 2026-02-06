import React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ResetPasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const { resetPassword } = useAuth();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!token) return;

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setIsLoading(true);

        try {
            await resetPassword(token, password);
            setSuccess(true);
            setTimeout(() => {
                navigate('/signin');
            }, 2000);
        } catch {
            setError('Invalid or expired reset link. Please request a new one.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="relative mx-auto flex h-screen max-w-md w-full flex-col overflow-hidden bg-white dark:bg-[#1a2632] shadow-xl sm:rounded-xl sm:h-[90vh] sm:my-[5vh]">
                <main className="flex flex-1 flex-col items-center justify-center p-6 text-center">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                        <span className="material-symbols-outlined text-4xl text-red-600 dark:text-red-400">error</span>
                    </div>
                    <h1 className="text-[#111418] dark:text-white text-2xl font-bold mb-2">
                        Invalid Reset Link
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        This password reset link is invalid. Please request a new one.
                    </p>
                    <Link to="/forgot-password" className="text-primary font-semibold hover:underline">
                        Request new reset link
                    </Link>
                </main>
            </div>
        );
    }

    if (success) {
        return (
            <div className="relative mx-auto flex h-screen max-w-md w-full flex-col overflow-hidden bg-white dark:bg-[#1a2632] shadow-xl sm:rounded-xl sm:h-[90vh] sm:my-[5vh]">
                <main className="flex flex-1 flex-col items-center justify-center p-6 text-center">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                        <span className="material-symbols-outlined text-4xl text-green-600 dark:text-green-400">check_circle</span>
                    </div>
                    <h1 className="text-[#111418] dark:text-white text-2xl font-bold mb-2">
                        Password Reset Successful
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Redirecting to sign in...
                    </p>
                </main>
            </div>
        );
    }

    return (
        <div className="relative mx-auto flex h-screen max-w-md w-full flex-col overflow-hidden bg-white dark:bg-[#1a2632] shadow-xl sm:rounded-xl sm:h-[90vh] sm:my-[5vh]">
            <header className="flex items-center justify-between px-4 py-3 shrink-0">
                <Link to="/signin" className="flex size-10 items-center justify-center rounded-full text-[#111418] dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
                </Link>
                <h2 className="text-[#111418] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Reset Password</h2>
                <div className="size-10"></div>
            </header>

            <main className="flex-1 overflow-y-auto no-scrollbar px-6 pt-8 pb-24">
                <div className="mb-8">
                    <h1 className="text-[#111418] dark:text-white text-[28px] leading-9 font-bold tracking-tight mb-2">
                        Create new password
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-relaxed">
                        Your new password must be different from previous used passwords.
                    </p>
                </div>

                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    {error && (
                        <div className="p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[#111418] dark:text-white text-sm font-semibold" htmlFor="password">New Password</label>
                        <div className="relative">
                            <input
                                className="block w-full rounded-xl border-0 bg-background-light dark:bg-background-dark py-4 px-4 text-[#111418] dark:text-white ring-1 ring-inset ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-[#1a2632] transition-all placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                id="password"
                                placeholder="Min. 8 characters"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[#111418] dark:text-white text-sm font-semibold" htmlFor="confirmPassword">Confirm Password</label>
                        <div className="relative">
                            <input
                                className="block w-full rounded-xl border-0 bg-background-light dark:bg-background-dark py-4 px-4 text-[#111418] dark:text-white ring-1 ring-inset ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-[#1a2632] transition-all placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                id="confirmPassword"
                                placeholder="Confirm new password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </form>
            </main>

            <div className="absolute bottom-0 left-0 w-full bg-white dark:bg-[#1a2632] border-t border-gray-100 dark:border-white/5 p-4 pb-8">
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || !password || !confirmPassword}
                    className="flex w-full items-center justify-center rounded-xl bg-primary py-4 px-4 text-center text-base font-bold text-white hover:bg-[#20d85f] active:scale-[0.99] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Resetting...' : 'Reset Password'}
                </button>
            </div>
        </div>
    );
};
