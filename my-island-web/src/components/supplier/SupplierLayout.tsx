import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SubscriptionProvider } from '../../context/SubscriptionContext';
import { QRScanner } from './QRScanner';
import { SubscriptionBanner } from './SubscriptionBanner';
import { useAllStaffPermissions } from '../../hooks/useStaffPermission';
import clsx from 'clsx';

const PAGE_TITLES: Record<string, string> = {
    '/supplier': 'Dashboard',
    '/supplier/offers': 'My Offers',
    '/supplier/redeem': 'Redeem Voucher',
    '/supplier/reviews': 'Reviews',
    '/supplier/profile': 'Business Profile',
    '/supplier/staff': 'Staff',
    '/supplier/settings': 'Settings',
    '/supplier/support': 'Support',
};

const SupplierLayoutContent: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const perms = useAllStaffPermissions('supplier');
    const pageTitle = PAGE_TITLES[location.pathname] || (location.pathname.startsWith('/supplier/offers/') ? 'Offer Details' : 'Supplier Portal');

    const handleLogout = async () => {
        await logout();
        navigate('/signin');
    };

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScannerOpen, setIsScannerOpen] = useState(false);

    const handleScan = (claimId: string) => {
        setIsScannerOpen(false);
        navigate(`/supplier/redeem?id=${encodeURIComponent(claimId)}`);
    };

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
                        <div className="size-8 rounded-lg bg-lime-500 flex items-center justify-center text-white">
                            <span className="material-symbols-outlined text-xl">storefront</span>
                        </div>
                        <span className="text-lg font-bold text-[#111418] dark:text-white">Supplier</span>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="md:hidden text-gray-500 hover:text-[#111418] dark:text-gray-400 dark:hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1" onClick={() => setIsMobileMenuOpen(false)}>
                    {perms.dashboard?.canRead !== false && <SupplierNavLink to="/supplier" icon="dashboard" label="Dashboard" end />}
                    {perms.offers?.canRead !== false && <SupplierNavLink to="/supplier/offers" icon="local_offer" label="My Offers" />}
                    {perms.redeem?.canRead !== false && <SupplierNavLink to="/supplier/redeem" icon="qr_code_scanner" label="Redeem Voucher" />}
                    {perms.reviews?.canRead !== false && <SupplierNavLink to="/supplier/reviews" icon="rate_review" label="Reviews" />}
                    {perms.profile?.canRead !== false && <SupplierNavLink to="/supplier/profile" icon="store" label="Business Profile" />}
                    {perms.staff?.canRead !== false && <SupplierNavLink to="/supplier/staff" icon="group" label="Staff" />}
                    {perms.settings?.canRead !== false && <SupplierNavLink to="/supplier/settings" icon="settings" label="Settings" />}
                    <SupplierNavLink to="/supplier/support" icon="support_agent" label="Support" />

                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <p className="px-3 text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Browse</p>
                        <Link
                            to="/marketplace"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-[#111418] dark:hover:text-white transition-all duration-200"
                        >
                            <span className="material-symbols-outlined text-xl">storefront</span>
                            View All Offers
                        </Link>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div
                            className="size-10 bg-center bg-no-repeat bg-cover rounded-full border border-gray-200"
                            style={{ backgroundImage: `url("${user?.avatarUrl || ''}")` }}
                        ></div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-bold text-[#111418] dark:text-white truncate">{user?.name}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {user?.isSupplier ? 'Supplier' : user?.staffPermissions?.supplier?.role ? `Staff \u00b7 ${user.staffPermissions.supplier.role.charAt(0) + user.staffPermissions.supplier.role.slice(1).toLowerCase()}` : 'Staff'}
                            </span>
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
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsScannerOpen(true)}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-lime-500 hover:bg-lime-600 text-white font-semibold text-sm rounded-lg transition-colors"
                        >
                            <span className="material-symbols-outlined text-lg">qr_code_scanner</span>
                            <span className="hidden sm:inline">Scan Voucher</span>
                        </button>
                        <Link to="/" className="text-sm font-medium text-gray-500 hover:text-lime-500 transition-colors flex items-center gap-1">
                            <span className="hidden md:inline">Go to Main Site</span>
                            <span className="md:hidden">Exit</span>
                            <span className="material-symbols-outlined text-lg">open_in_new</span>
                        </Link>
                    </div>
                </header>
                <SubscriptionBanner />
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <Outlet />
                </div>
            </main>

            {/* QR Scanner Modal */}
            <QRScanner
                isOpen={isScannerOpen}
                onScan={handleScan}
                onClose={() => setIsScannerOpen(false)}
            />
        </div>
    );
};

export const SupplierLayout: React.FC = () => {
    return (
        <SubscriptionProvider>
            <SupplierLayoutContent />
        </SubscriptionProvider>
    );
};

const SupplierNavLink: React.FC<{ to: string; icon: string; label: string; end?: boolean }> = ({ to, icon, label, end }) => {
    return (
        <NavLink
            to={to}
            end={end}
            className={({ isActive }) => clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                    ? "bg-lime-500 text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-[#111418] dark:hover:text-white"
            )}
        >
            <span className="material-symbols-outlined text-xl">{icon}</span>
            {label}
        </NavLink>
    );
};
