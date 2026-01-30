import React from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

const PAGE_TITLES: Record<string, string> = {
    '/admin': 'Dashboard',
    '/admin/bookings': 'Bookings',
    '/admin/calendar': 'Calendar',
    '/admin/lots': 'Lots & Campsites',
    '/admin/users': 'Users',
    '/admin/settings': 'Settings',
};

export const AdminLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const pageTitle = PAGE_TITLES[location.pathname] || 'Dashboard';

    const handleLogout = async () => {
        await logout();
        navigate('/signin');
    };

    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

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
                        <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-white">
                            <span className="material-symbols-outlined text-xl">admin_panel_settings</span>
                        </div>
                        <span className="text-lg font-bold text-[#111418] dark:text-white">Portal</span>
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
                    <AdminNavLink to="/admin/bookings" icon="calendar_month" label="Bookings" />
                    <AdminNavLink to="/admin/calendar" icon="date_range" label="Calendar" />
                    <AdminNavLink to="/admin/lots" icon="camping" label="Lots & Campsites" />
                    <AdminNavLink to="/admin/users" icon="group" label="Users" />
                    <AdminNavLink to="/admin/settings" icon="settings" label="Settings" />
                </div>

                <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div
                            className="size-10 bg-center bg-no-repeat bg-cover rounded-full border border-gray-200"
                            style={{ backgroundImage: `url("${user?.avatarUrl || ''}")` }}
                        ></div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-bold text-[#111418] dark:text-white truncate">{user?.name}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Administrator</span>
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
                    <div className="flex items-center gap-4">
                        <Link to="/" className="text-sm font-medium text-gray-500 hover:text-primary transition-colors flex items-center gap-1">
                            <span className="hidden md:inline">Go to Main Site</span>
                            <span className="md:hidden">Exit</span>
                            <span className="material-symbols-outlined text-lg">open_in_new</span>
                        </Link>
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto p-8">
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
                    ? "bg-primary text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-[#111418] dark:hover:text-white"
            )}
        >
            <span className="material-symbols-outlined text-xl">{icon}</span>
            {label}
        </NavLink>
    );
};
