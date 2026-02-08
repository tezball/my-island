import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Test accounts for development - all use password "password"
const TEST_USERS = [
    // Subscribed Owners
    { email: 'norevalley@myisland.com', password: 'password', label: 'Nore Valley Park (Owner - Subscribed)' },
    { email: 'hello@burrenglampingvillage.ie', password: 'password', label: 'Burren Glamping Village (Owner - Subscribed)' },
    // Subscribed Suppliers
    { email: 'farmshop@greenacres.ie', password: 'password', label: 'Green Acres Farm Shop (Supplier - Subscribed)' },
    { email: 'info@aillweefarmshop.ie', password: 'password', label: 'Aillwee Farm Shop & Cheese (Supplier - Subscribed)' },
    { email: 'info@murphygeneralstore.ie', password: 'password', label: 'Murphy General Store (Supplier - Subscribed)' },
    // No Subscription (for testing subscription gates)
    { email: 'bookings@loughdergcamping.ie', password: 'password', label: 'Lough Derg Lakeside (Owner - No Sub)' },
    { email: 'hello@dinglekayak.ie', password: 'password', label: 'Dingle Kayak Adventures (Supplier - No Sub)' },
    // Guest
    { email: 'family@example.com', password: 'password', label: 'Murphy Family (Guest)' },
];

export const SignInPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to sign in');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative mx-auto flex h-screen max-w-md w-full flex-col overflow-hidden bg-white dark:bg-[#1a2632] shadow-xl sm:rounded-xl sm:h-[90vh] sm:my-[5vh]">
            <header className="flex items-center justify-between px-4 py-3 shrink-0">
                <Link to="/" className="flex size-10 items-center justify-center rounded-full text-[#111418] dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
                </Link>
                <h2 className="text-[#111418] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Sign In</h2>
                <div className="size-10"></div>
            </header>

            <main className="flex-1 overflow-y-auto no-scrollbar px-6 pt-8 pb-24">
                <div className="mb-8">
                    <h1 className="text-[#111418] dark:text-white text-[28px] leading-9 font-bold tracking-tight mb-2">
                        Welcome back
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-relaxed">
                        Sign in to access your saved trips and profile.
                    </p>
                </div>

                {/* Mock User Dropdown for Testing */}
                <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                    <label className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2 block">
                        Test Users (Auto-fill)
                    </label>
                    <div className="relative">
                        <select
                            className="w-full rounded-lg border-blue-200 dark:border-blue-800 bg-white dark:bg-[#1a2632] py-3 px-4 text-sm text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none"
                            onChange={(e) => {
                                const selectedUser = TEST_USERS.find(u => u.email === e.target.value);
                                if (selectedUser) {
                                    setEmail(selectedUser.email);
                                    setPassword(selectedUser.password);
                                }
                            }}
                            value={email}
                        >
                            <option value="" disabled>Select a test user...</option>
                            {TEST_USERS.map((user) => (
                                <option key={user.email} value={user.email}>
                                    {user.label}
                                </option>
                            ))}
                        </select>
                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xl">expand_more</span>
                    </div>
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
                            />
                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xl">mail</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[#111418] dark:text-white text-sm font-semibold" htmlFor="password">Password</label>
                        <div className="relative">
                            <input
                                className="block w-full rounded-xl border-0 bg-background-light dark:bg-background-dark py-4 px-4 text-[#111418] dark:text-white ring-1 ring-inset ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-[#1a2632] transition-all placeholder:text-gray-400 sm:text-sm sm:leading-6 pr-12"
                                id="password"
                                placeholder="Enter your password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button className="absolute right-0 top-0 h-full px-4 flex items-center justify-center text-gray-500 hover:text-[#111418] dark:hover:text-white transition-colors" type="button">
                                <span className="material-symbols-outlined text-xl">visibility_off</span>
                            </button>
                        </div>
                        <Link to="/forgot-password" className="text-primary hover:text-[#20d85f] text-xs font-bold transition-colors self-end mt-1">Forgot Password?</Link>
                    </div>
                </form>
            </main>

            <div className="absolute bottom-0 left-0 w-full bg-white dark:bg-[#1a2632] border-t border-gray-100 dark:border-white/5 p-4 pb-8">
                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex w-full items-center justify-center rounded-xl bg-primary py-4 px-4 text-center text-base font-bold text-white hover:bg-[#20d85f] active:scale-[0.99] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
                <div className="mt-4 text-center">
                    <span className="text-[#111418] dark:text-gray-300 text-sm font-medium">Don't have an account? </span>
                    <Link to="/signup" className="text-primary hover:text-[#20d85f] text-sm font-bold transition-colors">Sign up</Link>
                </div>
            </div>
        </div>
    );
};
