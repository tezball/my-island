import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ForgotPasswordPage: React.FC = () => {
    const { requestPasswordReset } = useAuth();
    const [email, setEmail] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [isSubmitted, setIsSubmitted] = React.useState(false);
    const [error, setError] = React.useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await requestPasswordReset(email);
            setIsSubmitted(true);
        } catch (err) {
            setError('Failed to send reset link. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="relative mx-auto flex h-screen max-w-md w-full flex-col overflow-hidden bg-white dark:bg-[#1a2632] shadow-xl sm:rounded-xl sm:h-[90vh] sm:my-[5vh]">
                <header className="flex items-center justify-between px-4 py-3 shrink-0">
                    <Link to="/signin" className="flex size-10 items-center justify-center rounded-full text-[#111418] dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
                    </Link>
                    <div className="size-10"></div>
                </header>

                <main className="flex-1 px-6 pt-8 pb-24 text-center">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                        <span className="material-symbols-outlined text-4xl text-green-600 dark:text-green-400">mark_email_read</span>
                    </div>
                    <h1 className="text-[#111418] dark:text-white text-[28px] leading-9 font-bold tracking-tight mb-4">
                        Check your email
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-relaxed mb-8">
                        We have sent a password reset link to <span className="font-semibold text-[#111418] dark:text-white">{email}</span>.
                    </p>
                    <Link to="/signin" className="inline-flex w-full items-center justify-center rounded-xl bg-primary py-4 px-4 text-center text-base font-bold text-white hover:bg-[#20d85f] active:scale-[0.99] transition-all shadow-sm">
                        Back to Sign In
                    </Link>
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
                <h2 className="text-[#111418] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Forgot Password</h2>
                <div className="size-10"></div>
            </header>

            <main className="flex-1 overflow-y-auto no-scrollbar px-6 pt-8 pb-24">
                <div className="mb-8">
                    <h1 className="text-[#111418] dark:text-white text-[28px] leading-9 font-bold tracking-tight mb-2">
                        Reset your password
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-relaxed">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    {error && (
                        <div className="p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[#111418] dark:text-white text-sm font-semibold" htmlFor="email">Email Address</label>
                        <div className="relative">
                            <input
                                className="peer block w-full rounded-xl border-0 bg-background-light dark:bg-background-dark py-4 px-4 text-[#111418] dark:text-white ring-1 ring-inset ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-[#1a2632] transition-all placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                id="email"
                                placeholder="name@example.com"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xl">mail</span>
                        </div>
                    </div>
                </form>
            </main>

            <div className="absolute bottom-0 left-0 w-full bg-white dark:bg-[#1a2632] border-t border-gray-100 dark:border-white/5 p-4 pb-8">
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || !email}
                    className="flex w-full items-center justify-center rounded-xl bg-primary py-4 px-4 text-center text-base font-bold text-white hover:bg-[#20d85f] active:scale-[0.99] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Sending Link...' : 'Send Reset Link'}
                </button>
            </div>
        </div>
    );
};
