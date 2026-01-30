import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface NotificationSetting {
    id: string;
    title: string;
    description: string;
    enabled: boolean;
}

export const NotificationsPage: React.FC = () => {
    const navigate = useNavigate();

    const [settings, setSettings] = useState<NotificationSetting[]>([
        {
            id: 'booking_confirmations',
            title: 'Booking Confirmations',
            description: 'Receive notifications when your booking is confirmed',
            enabled: true
        },
        {
            id: 'booking_reminders',
            title: 'Booking Reminders',
            description: 'Get reminded about upcoming trips',
            enabled: true
        },
        {
            id: 'price_alerts',
            title: 'Price Alerts',
            description: 'Be notified when prices drop for saved places',
            enabled: false
        },
        {
            id: 'promotions',
            title: 'Promotions & Offers',
            description: 'Receive special offers and discounts',
            enabled: true
        },
        {
            id: 'newsletter',
            title: 'Newsletter',
            description: 'Weekly updates about new campsites and features',
            enabled: false
        }
    ]);

    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);

    const toggleSetting = (id: string) => {
        setSettings(prev =>
            prev.map(s =>
                s.id === id ? { ...s, enabled: !s.enabled } : s
            )
        );
    };

    return (
        <main className="flex-1 flex flex-col pb-20">
            {/* Header */}
            <div className="bg-white dark:bg-[#1a2632] border-b border-gray-200 dark:border-gray-700 px-4 py-4">
                <div className="max-w-2xl mx-auto flex items-center gap-4">
                    <button
                        onClick={() => navigate('/profile')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="text-xl font-bold text-[#111418] dark:text-white">Notifications</h1>
                </div>
            </div>

            <div className="max-w-2xl mx-auto w-full px-4 py-6 space-y-6">
                {/* Notification Channels */}
                <div className="bg-white dark:bg-[#1a2632] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-[#111418] dark:text-white mb-4">Notification Channels</h2>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-gray-500">mail</span>
                                <div>
                                    <p className="font-medium text-[#111418] dark:text-white">Email Notifications</p>
                                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setEmailNotifications(!emailNotifications)}
                                className={`relative w-12 h-6 rounded-full transition-colors ${emailNotifications ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
                            >
                                <span
                                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${emailNotifications ? 'left-7' : 'left-1'}`}
                                />
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-gray-500">notifications</span>
                                <div>
                                    <p className="font-medium text-[#111418] dark:text-white">Push Notifications</p>
                                    <p className="text-sm text-gray-500">Receive push notifications on your device</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setPushNotifications(!pushNotifications)}
                                className={`relative w-12 h-6 rounded-full transition-colors ${pushNotifications ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
                            >
                                <span
                                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${pushNotifications ? 'left-7' : 'left-1'}`}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Notification Types */}
                <div className="bg-white dark:bg-[#1a2632] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-[#111418] dark:text-white mb-4">Notification Types</h2>

                    <div className="space-y-4">
                        {settings.map(setting => (
                            <div key={setting.id} className="flex items-center justify-between py-2">
                                <div>
                                    <p className="font-medium text-[#111418] dark:text-white">{setting.title}</p>
                                    <p className="text-sm text-gray-500">{setting.description}</p>
                                </div>
                                <button
                                    onClick={() => toggleSetting(setting.id)}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${setting.enabled ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
                                >
                                    <span
                                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${setting.enabled ? 'left-7' : 'left-1'}`}
                                    />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
};
