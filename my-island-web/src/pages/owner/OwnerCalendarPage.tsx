import React from 'react';

export const OwnerCalendarPage: React.FC = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[#111418] dark:text-white">Calendar</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">View your bookings calendar</p>
            </div>

            <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-8 text-center">
                <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 mb-4">event</span>
                <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-2">Calendar Coming Soon</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto">
                    The interactive calendar view is under development. Check the Bookings page to see your reservations.
                </p>
            </div>
        </div>
    );
};
