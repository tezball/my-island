import React from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

export const BottomNav: React.FC = () => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1a2632] border-t border-gray-200 dark:border-gray-800 px-6 py-2 z-50">
            <div className="flex justify-between items-center max-w-lg mx-auto">
                <NavItem to="/" icon="search" label="Search" />
                <NavItem to="/saved" icon="favorite" label="Saved" />
                <NavItem to="/trips" icon="luggage" label="Trips" />
                <NavItem to="/profile" icon="person" label="Profile" />
            </div>
            <div className="h-4 w-full"></div>
        </nav>
    );
};

const NavItem: React.FC<{ to: string; icon: string; label: string }> = ({ to, icon, label }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) => clsx(
                "flex flex-col items-center gap-1",
                isActive ? "text-primary" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            )}
        >
            {({ isActive }) => (
                <>
                    <span className={clsx("material-symbols-outlined", isActive && "filled")}>{icon}</span>
                    <span className="text-[10px] font-medium">{label}</span>
                </>
            )}
        </NavLink>
    );
};
