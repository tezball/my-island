import React, { useState, useEffect } from 'react';
import { ownerService } from '../../services/ownerService';
import { PricingRuleModal } from '../../components/owner/PricingRuleModal';
import type { SeasonalPricingRule, CreateSeasonalPricingRuleRequest } from '../../types/booking';

const LOT_TYPE_LABELS: Record<string, string> = {
    TENT: 'Tent Pitch',
    TOURING: 'Touring Pitch',
    GLAMPING: 'Glamping',
    CABIN: 'Cabin & Lodge',
    MOBILE_HOME: 'Mobile Home',
};

export const OwnerPricingPage: React.FC = () => {
    const [rules, setRules] = useState<SeasonalPricingRule[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        loadRules();
    }, []);

    const loadRules = async () => {
        try {
            const data = await ownerService.getPricingRules();
            setRules(data);
        } catch (error) {
            console.error('Failed to load pricing rules:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async (data: CreateSeasonalPricingRuleRequest) => {
        await ownerService.createPricingRule(data);
        await loadRules();
    };

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        try {
            await ownerService.deletePricingRule(id);
            setRules(prev => prev.filter(r => r.id !== id));
        } catch (error) {
            console.error('Failed to delete pricing rule:', error);
        } finally {
            setDeletingId(null);
        }
    };

    // Group rules by lot type
    const grouped = rules.reduce<Record<string, SeasonalPricingRule[]>>((acc, rule) => {
        const key = rule.lotType;
        if (!acc[key]) acc[key] = [];
        acc[key].push(rule);
        return acc;
    }, {});

    const formatDate = (dateStr: string) => {
        return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IE', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#111418] dark:text-white">Seasonal Pricing</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Manage pricing rules for different seasons</p>
                </div>
                <div className="animate-pulse space-y-4">
                    <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                    <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#111418] dark:text-white">Seasonal Pricing</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Set different prices for peak seasons, holidays, and special periods</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-emerald-600 transition-colors"
                >
                    Add Rule
                </button>
            </div>

            {rules.length === 0 ? (
                <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-8 text-center">
                    <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-gray-600 mb-3 block">payments</span>
                    <h3 className="text-base font-medium text-[#111418] dark:text-white mb-1">No pricing rules yet</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Create seasonal pricing rules to automatically adjust rates for peak seasons, holidays, and special events.
                        Without rules, lots use their base price per night.
                    </p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-emerald-600 transition-colors"
                    >
                        Create First Rule
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {Object.entries(grouped).map(([lotType, typeRules]) => (
                        <div key={lotType} className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800">
                            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                                <h2 className="text-base font-bold text-[#111418] dark:text-white">
                                    {LOT_TYPE_LABELS[lotType] || lotType}
                                </h2>
                            </div>
                            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                {typeRules.map(rule => (
                                    <div key={rule.id} className="px-6 py-4 flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-[#111418] dark:text-white">{rule.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                {formatDate(rule.startDate)} — {formatDate(rule.endDate)}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4 ml-4">
                                            <span className="text-sm font-semibold text-primary">
                                                &euro;{rule.pricePerNight.toFixed(2)}/night
                                            </span>
                                            <button
                                                onClick={() => handleDelete(rule.id)}
                                                disabled={deletingId === rule.id}
                                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                                                title="Delete rule"
                                            >
                                                <span className="material-symbols-outlined text-lg">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <PricingRuleModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleCreate}
            />
        </div>
    );
};
