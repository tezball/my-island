import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { supplierService, type Offer, type Supplier, type OfferClaim } from '../../services/supplierService';
import { useAuth } from '../../context/AuthContext';

type RedeemState = 'loading' | 'valid' | 'already_redeemed' | 'expired' | 'not_found' | 'redeeming' | 'success';

interface ClaimData {
    claim: OfferClaim;
    offer: Offer;
    supplier: Supplier;
}

export const SupplierRedeemPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    useAuth(); // Ensure user is authenticated

    const [state, setState] = useState<RedeemState>('loading');
    const [claimData, setClaimData] = useState<ClaimData | null>(null);
    const [manualClaimId, setManualClaimId] = useState('');
    const [isLookingUp, setIsLookingUp] = useState(false);

    const claimIdFromUrl = searchParams.get('id');

    const lookupClaim = async (claimId: string) => {
        if (!claimId.trim()) return;

        setState('loading');
        try {
            const data = await supplierService.getClaimById(claimId.trim());

            if (!data) {
                setState('not_found');
                return;
            }

            setClaimData(data);

            // Check claim status
            if (data.claim.status === 'redeemed') {
                setState('already_redeemed');
            } else if (data.claim.status === 'expired' || new Date(data.offer.validUntil) < new Date()) {
                setState('expired');
            } else {
                setState('valid');
            }
        } catch (error) {
            console.error('Failed to fetch claim:', error);
            setState('not_found');
        }
    };

    useEffect(() => {
        if (claimIdFromUrl) {
            lookupClaim(claimIdFromUrl);
        } else {
            setState('not_found');
        }
    }, [claimIdFromUrl]);

    const handleManualLookup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!manualClaimId.trim()) return;

        setIsLookingUp(true);
        // Update URL with the claim ID
        navigate(`/supplier/redeem?id=${encodeURIComponent(manualClaimId.trim())}`, { replace: true });
        setIsLookingUp(false);
    };

    const handleRedeem = async () => {
        if (!claimData) return;

        setState('redeeming');
        try {
            await supplierService.redeemClaim(claimData.claim.id);
            setState('success');
        } catch (error) {
            console.error('Failed to redeem claim:', error);
            alert('Failed to redeem claim. Please try again.');
            setState('valid');
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-IE', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const renderContent = () => {
        switch (state) {
            case 'loading':
                return (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="inline-block size-10 border-3 border-gray-300 border-t-lime-500 rounded-full animate-spin mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">Looking up voucher...</p>
                    </div>
                );

            case 'valid':
                return (
                    <div className="space-y-6">
                        {/* Valid Badge */}
                        <div className="flex justify-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                                <span className="material-symbols-outlined">verified</span>
                                <span className="font-semibold">Valid Voucher</span>
                            </div>
                        </div>

                        {/* Voucher Details Card */}
                        {claimData && (
                            <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                                <div className="p-6">
                                    {/* Discount */}
                                    <div className="text-center mb-4">
                                        <span className="text-4xl font-bold text-lime-600 dark:text-lime-400">
                                            {claimData.offer.discountPercent}% OFF
                                        </span>
                                    </div>

                                    {/* Offer Title */}
                                    <h2 className="text-xl font-bold text-[#111418] dark:text-white text-center mb-6">
                                        {claimData.offer.title}
                                    </h2>

                                    {/* Details */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                            <span className="material-symbols-outlined text-gray-400">person</span>
                                            <span className="font-medium text-[#111418] dark:text-white">{claimData.claim.userName}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                            <span className="material-symbols-outlined text-gray-400">calendar_today</span>
                                            <span>Claimed {formatDate(claimData.claim.claimedAt)}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                            <span className="material-symbols-outlined text-gray-400">event</span>
                                            <span>Valid until {formatDate(claimData.offer.validUntil)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Redeem Button */}
                                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        onClick={handleRedeem}
                                        className="w-full py-4 bg-lime-500 hover:bg-lime-600 text-white font-bold text-lg rounded-xl transition-colors flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined">check_circle</span>
                                        Redeem Now
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 'redeeming':
                return (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="inline-block size-10 border-3 border-gray-300 border-t-lime-500 rounded-full animate-spin mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">Redeeming voucher...</p>
                    </div>
                );

            case 'success':
                return (
                    <div className="space-y-6">
                        {/* Success Badge */}
                        <div className="flex justify-center">
                            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-4xl text-green-600 dark:text-green-400">
                                    check_circle
                                </span>
                            </div>
                        </div>

                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-2">
                                Voucher Redeemed!
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400">
                                The voucher has been successfully redeemed.
                            </p>
                        </div>

                        {claimData && (
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 text-center">
                                <p className="text-lg font-semibold text-[#111418] dark:text-white">
                                    {claimData.offer.discountPercent}% OFF - {claimData.offer.title}
                                </p>
                                <p className="text-gray-500 dark:text-gray-400">
                                    {claimData.claim.userName}
                                </p>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setState('not_found');
                                    setClaimData(null);
                                    setManualClaimId('');
                                    navigate('/supplier/redeem', { replace: true });
                                }}
                                className="flex-1 py-3 bg-lime-500 hover:bg-lime-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined">qr_code_scanner</span>
                                Scan Another
                            </button>
                            <Link
                                to="/supplier"
                                className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined">dashboard</span>
                                Dashboard
                            </Link>
                        </div>
                    </div>
                );

            case 'already_redeemed':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-center">
                            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-4xl text-blue-600 dark:text-blue-400">
                                    info
                                </span>
                            </div>
                        </div>

                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-2">
                                Already Redeemed
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400">
                                This voucher has already been used.
                            </p>
                        </div>

                        {claimData && (
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Offer</span>
                                        <span className="font-medium text-[#111418] dark:text-white">{claimData.offer.title}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Customer</span>
                                        <span className="font-medium text-[#111418] dark:text-white">{claimData.claim.userName}</span>
                                    </div>
                                    {claimData.claim.redeemedAt && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Redeemed</span>
                                            <span className="font-medium text-green-600 dark:text-green-400">
                                                {formatDate(claimData.claim.redeemedAt)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {renderManualEntry()}
                    </div>
                );

            case 'expired':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-center">
                            <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-4xl text-amber-600 dark:text-amber-400">
                                    event_busy
                                </span>
                            </div>
                        </div>

                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-2">
                                Voucher Expired
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400">
                                This voucher is no longer valid.
                            </p>
                        </div>

                        {claimData && (
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Offer</span>
                                        <span className="font-medium text-[#111418] dark:text-white">{claimData.offer.title}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Expired</span>
                                        <span className="font-medium text-red-600 dark:text-red-400">
                                            {formatDate(claimData.offer.validUntil)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {renderManualEntry()}
                    </div>
                );

            case 'not_found':
            default:
                return (
                    <div className="space-y-6">
                        {claimIdFromUrl && (
                            <>
                                <div className="flex justify-center">
                                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-4xl text-gray-400">
                                            search_off
                                        </span>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-2">
                                        Voucher Not Found
                                    </h2>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        We couldn't find a voucher with that ID.
                                    </p>
                                </div>
                            </>
                        )}

                        {!claimIdFromUrl && (
                            <div className="text-center">
                                <div className="w-20 h-20 bg-lime-100 dark:bg-lime-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="material-symbols-outlined text-4xl text-lime-600 dark:text-lime-400">
                                        qr_code_scanner
                                    </span>
                                </div>
                                <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-2">
                                    Redeem Voucher
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Scan a customer's QR code or enter the claim ID below.
                                </p>
                            </div>
                        )}

                        {renderManualEntry()}
                    </div>
                );
        }
    };

    const renderManualEntry = () => (
        <div className="border-t border-dashed border-gray-200 dark:border-gray-700 pt-6 mt-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
                Enter claim ID manually
            </p>
            <form onSubmit={handleManualLookup} className="flex gap-2">
                <input
                    type="text"
                    value={manualClaimId}
                    onChange={(e) => setManualClaimId(e.target.value)}
                    placeholder="e.g. claim-1234567890"
                    className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1a2632] text-[#111418] dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                />
                <button
                    type="submit"
                    disabled={!manualClaimId.trim() || isLookingUp}
                    className="px-6 py-3 bg-lime-500 hover:bg-lime-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
                >
                    {isLookingUp ? (
                        <span className="inline-block size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        'Look Up'
                    )}
                </button>
            </form>
        </div>
    );

    return (
        <div className="max-w-md mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <Link
                    to="/supplier"
                    className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <h1 className="text-xl font-bold text-[#111418] dark:text-white">
                    Redeem Voucher
                </h1>
            </div>

            {/* Content */}
            <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                {renderContent()}
            </div>
        </div>
    );
};
