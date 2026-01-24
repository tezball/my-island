import React, { useState } from 'react';

export const AdminSettingsPage: React.FC = () => {

    const [siteName, setSiteName] = useState('Nore Valley Park');
    const [siteDescription, setSiteDescription] = useState('Family-friendly campsite in beautiful Kilkenny');
    const [contactEmail, setContactEmail] = useState('info@norevalleypark.ie');
    const [contactPhone, setContactPhone] = useState('+353 56 772 7229');
    const [bookingEnabled, setBookingEnabled] = useState(true);
    const [autoConfirm, setAutoConfirm] = useState(false);
    const [minStay, setMinStay] = useState('1');
    const [maxStay, setMaxStay] = useState('14');
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    return (
        <div className="p-6 max-w-4xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#111418]">Settings</h1>
                <p className="text-gray-500">Manage your campsite settings and preferences</p>
            </div>

            {showSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
                    <span className="material-symbols-outlined">check_circle</span>
                    <span>Settings saved successfully!</span>
                </div>
            )}

            {/* General Settings */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
                <h2 className="text-lg font-bold text-[#111418] mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-gray-500">settings</span>
                    General Settings
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                        <input
                            type="text"
                            value={siteName}
                            onChange={(e) => setSiteName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
                        <textarea
                            value={siteDescription}
                            onChange={(e) => setSiteDescription(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                        />
                    </div>
                </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
                <h2 className="text-lg font-bold text-[#111418] mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-gray-500">contact_mail</span>
                    Contact Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                        <input
                            type="email"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                        <input
                            type="tel"
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            {/* Booking Settings */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
                <h2 className="text-lg font-bold text-[#111418] mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-gray-500">calendar_month</span>
                    Booking Settings
                </h2>

                <div className="space-y-4">
                    <div className="flex items-center justify-between py-2">
                        <div>
                            <p className="font-medium text-[#111418]">Enable Bookings</p>
                            <p className="text-sm text-gray-500">Allow customers to make bookings</p>
                        </div>
                        <button
                            onClick={() => setBookingEnabled(!bookingEnabled)}
                            className={`relative w-12 h-6 rounded-full transition-colors ${bookingEnabled ? 'bg-primary' : 'bg-gray-300'}`}
                        >
                            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${bookingEnabled ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between py-2">
                        <div>
                            <p className="font-medium text-[#111418]">Auto-confirm Bookings</p>
                            <p className="text-sm text-gray-500">Automatically confirm new bookings</p>
                        </div>
                        <button
                            onClick={() => setAutoConfirm(!autoConfirm)}
                            className={`relative w-12 h-6 rounded-full transition-colors ${autoConfirm ? 'bg-primary' : 'bg-gray-300'}`}
                        >
                            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${autoConfirm ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Stay (nights)</label>
                            <input
                                type="number"
                                min="1"
                                value={minStay}
                                onChange={(e) => setMinStay(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Stay (nights)</label>
                            <input
                                type="number"
                                min="1"
                                value={maxStay}
                                onChange={(e) => setMaxStay(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-primary hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                    {isSaving ? 'Saving...' : 'Save Settings'}
                </button>
            </div>
        </div>
    );
};
