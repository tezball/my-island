import React, { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { authService } from '../services/authService';

export const VerifyEmailPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const hasVerified = useRef(false);

    useEffect(() => {
        if (!token) {
            setStatus('error');
            return;
        }

        // Prevent duplicate API call from React StrictMode double-invoke.
        // The verify endpoint consumes the token, so a second call would fail.
        if (hasVerified.current) return;
        hasVerified.current = true;

        authService.verifyEmail(token)
            .then(() => setStatus('success'))
            .catch(() => setStatus('error'));
    }, [token]);

    return (
        <div className="relative mx-auto flex h-screen max-w-md w-full flex-col overflow-hidden bg-white dark:bg-[#1a2632] shadow-xl sm:rounded-xl sm:h-[90vh] sm:my-[5vh]">
            <main className="flex flex-1 flex-col items-center justify-center p-6 text-center">
                {status === 'loading' && (
                    <>
                        <div className="mb-6 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-primary" />
                        <p className="text-gray-500 dark:text-gray-400">Verifying your email...</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                            <span className="material-symbols-outlined text-4xl text-green-600 dark:text-green-400">check_circle</span>
                        </div>
                        <h1 className="text-[#111418] dark:text-white text-2xl font-bold mb-2">
                            Email Verified!
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Your email address has been successfully verified.
                        </p>
                        <Link
                            to="/"
                            className="inline-block rounded-xl bg-primary px-6 py-3 text-base font-bold text-white hover:bg-[#20d85f] transition-colors"
                        >
                            Go to Home
                        </Link>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                            <span className="material-symbols-outlined text-4xl text-red-600 dark:text-red-400">error</span>
                        </div>
                        <h1 className="text-[#111418] dark:text-white text-2xl font-bold mb-2">
                            Verification Failed
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            This verification link is invalid or has expired.
                        </p>
                        <Link
                            to="/"
                            className="text-primary font-semibold hover:underline"
                        >
                            Go to Home
                        </Link>
                    </>
                )}
            </main>
        </div>
    );
};
