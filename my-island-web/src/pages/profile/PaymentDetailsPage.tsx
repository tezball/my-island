import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface PaymentMethod {
    id: string;
    type: 'card' | 'paypal';
    last4?: string;
    brand?: string;
    email?: string;
    isDefault: boolean;
}

export const PaymentDetailsPage: React.FC = () => {
    const navigate = useNavigate();

    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
        {
            id: '1',
            type: 'card',
            last4: '4242',
            brand: 'Visa',
            isDefault: true
        }
    ]);

    const [showAddCard, setShowAddCard] = useState(false);

    const handleSetDefault = (id: string) => {
        setPaymentMethods(prev =>
            prev.map(pm => ({
                ...pm,
                isDefault: pm.id === id
            }))
        );
    };

    const handleRemove = (id: string) => {
        setPaymentMethods(prev => prev.filter(pm => pm.id !== id));
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
                    <h1 className="text-xl font-bold text-[#111418] dark:text-white">Payment Details</h1>
                </div>
            </div>

            <div className="max-w-2xl mx-auto w-full px-4 py-6">
                {/* Saved Payment Methods */}
                <div className="space-y-4 mb-6">
                    <h2 className="text-lg font-bold text-[#111418] dark:text-white">Saved Payment Methods</h2>

                    {paymentMethods.length === 0 ? (
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
                            <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">credit_card_off</span>
                            <p className="text-gray-500">No payment methods saved</p>
                        </div>
                    ) : (
                        paymentMethods.map(pm => (
                            <div
                                key={pm.id}
                                className="bg-white dark:bg-[#1a2632] rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-8 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                                        {pm.type === 'card' ? (
                                            <span className="material-symbols-outlined text-gray-600">credit_card</span>
                                        ) : (
                                            <span className="text-blue-600 font-bold text-xs">PayPal</span>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-[#111418] dark:text-white">
                                            {pm.type === 'card' ? `${pm.brand} •••• ${pm.last4}` : pm.email}
                                        </p>
                                        {pm.isDefault && (
                                            <span className="text-xs text-primary font-semibold">Default</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {!pm.isDefault && (
                                        <button
                                            onClick={() => handleSetDefault(pm.id)}
                                            className="text-sm text-gray-500 hover:text-primary"
                                        >
                                            Set default
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleRemove(pm.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Add Payment Method */}
                {!showAddCard ? (
                    <button
                        onClick={() => setShowAddCard(true)}
                        className="w-full bg-white dark:bg-[#1a2632] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 flex items-center justify-center gap-2 text-gray-500 hover:border-primary hover:text-primary transition-colors"
                    >
                        <span className="material-symbols-outlined">add</span>
                        Add Payment Method
                    </button>
                ) : (
                    <div className="bg-white dark:bg-[#1a2632] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <h3 className="font-bold text-[#111418] dark:text-white mb-4">Add Card</h3>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Card Number
                                </label>
                                <input
                                    type="text"
                                    placeholder="1234 5678 9012 3456"
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-[#111418] dark:text-white"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Expiry Date
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="MM/YY"
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-[#111418] dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        CVV
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="123"
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-[#111418] dark:text-white"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddCard(false)}
                                    className="flex-1 bg-gray-100 dark:bg-gray-700 text-[#111418] dark:text-white font-semibold py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-primary hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-colors"
                                >
                                    Add Card
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </main>
    );
};
