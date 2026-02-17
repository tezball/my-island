import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

const PAGE_TITLES: Record<string, string> = {
    '/admin': 'Dashboard',
    '/admin/users': 'Users',
    '/admin/bookings': 'Bookings',
    '/admin/owners': 'Owners',
    '/admin/suppliers': 'Suppliers',
    '/admin/reviews': 'Reviews',
    '/admin/subscriptions': 'Subscriptions',
    '/admin/financial': 'Financial',
    '/admin/leads': 'Leads CRM',
    '/admin/audit': 'Audit Log',
    '/admin/feature-toggles': 'Feature Toggles',
    '/admin/support': 'Support Tickets',
};

export const AdminLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const basePath = '/' + location.pathname.split('/').slice(1, 3).join('/');
    const pageTitle = PAGE_TITLES[location.pathname] || PAGE_TITLES[basePath] || 'Admin Portal';

    const handleLogout = async () => {
        await logout();
        navigate('/signin');
    };

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden relative">
            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="absolute inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={clsx(
                "w-64 bg-white dark:bg-[#1a2632] border-r border-gray-200 dark:border-gray-800 flex flex-col shrink-0 transition-transform duration-300 absolute md:relative z-50 h-full",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}>
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-red-500 flex items-center justify-center text-white">
                            <span className="material-symbols-outlined text-xl">admin_panel_settings</span>
                        </div>
                        <span className="text-lg font-bold text-[#111418] dark:text-white">Admin</span>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="md:hidden text-gray-500 hover:text-[#111418] dark:text-gray-400 dark:hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1" onClick={() => setIsMobileMenuOpen(false)}>
                    <AdminNavLink to="/admin" icon="dashboard" label="Dashboard" end />
                    <AdminNavLink to="/admin/users" icon="group" label="Users" />
                    <AdminNavLink to="/admin/bookings" icon="event_note" label="Bookings" />
                    <AdminNavLink to="/admin/owners" icon="cottage" label="Owners" />
                    <AdminNavLink to="/admin/suppliers" icon="storefront" label="Suppliers" />
                    <AdminNavLink to="/admin/reviews" icon="reviews" label="Reviews" />
                    <AdminNavLink to="/admin/subscriptions" icon="card_membership" label="Subscriptions" />
                    <AdminNavLink to="/admin/financial" icon="payments" label="Financial" />
                    <AdminNavLink to="/admin/leads" icon="contact_phone" label="Leads CRM" />
                    <AdminNavLink to="/admin/audit" icon="history" label="Audit Log" />
                    <AdminNavLink to="/admin/feature-toggles" icon="toggle_on" label="Feature Toggles" />
                    <AdminNavLink to="/admin/support" icon="support_agent" label="Support Tickets" />
                </div>

                <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-[#111418] dark:hover:text-white transition-all duration-200 mb-2"
                    >
                        <span className="material-symbols-outlined text-xl">home</span>
                        Main Site
                    </Link>
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div
                            className="size-10 bg-center bg-no-repeat bg-cover rounded-full border border-gray-200"
                            style={{ backgroundImage: `url("${user?.avatarUrl || ''}")` }}
                        ></div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-bold text-[#111418] dark:text-white truncate">{user?.name}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Platform Admin</span>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                    >
                        <span className="material-symbols-outlined text-xl">logout</span>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden w-full">
                <header className="h-16 bg-white dark:bg-[#1a2632] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 md:px-8 shrink-0">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="md:hidden p-2 -ml-2 text-gray-500 hover:text-[#111418] dark:text-gray-400 dark:hover:text-white rounded-lg transition-colors"
                        >
                            <span className="material-symbols-outlined text-2xl">menu</span>
                        </button>
                        <h1 className="text-xl font-bold text-[#111418] dark:text-white truncate">{pageTitle}</h1>
                    </div>
                    <Link to="/" className="text-sm font-medium text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1">
                        <span className="hidden md:inline">Go to Main Site</span>
                        <span className="md:hidden">Exit</span>
                        <span className="material-symbols-outlined text-lg">open_in_new</span>
                    </Link>
                </header>
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

const AdminNavLink: React.FC<{ to: string; icon: string; label: string; end?: boolean }> = ({ to, icon, label, end }) => {
    return (
        <NavLink
            to={to}
            end={end}
            className={({ isActive }) => clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                    ? "bg-red-500 text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-[#111418] dark:hover:text-white"
            )}
        >
            <span className="material-symbols-outlined text-xl">{icon}</span>
            {label}
        </NavLink>
    );
};
