import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import type { Offer, Supplier, OfferClaim } from '../../services/supplierService';

type VoucherWithDetails = OfferClaim & { offer: Offer; supplier: Supplier };

interface VoucherQRModalProps {
    voucher: VoucherWithDetails;
    isOpen: boolean;
    onClose: () => void;
}

export const VoucherQRModal: React.FC<VoucherQRModalProps> = ({ voucher, isOpen, onClose }) => {
    if (!isOpen) return null;

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-IE', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // Generate redemption URL for QR code
    const redemptionUrl = `${window.location.origin}/supplier/redeem?id=${encodeURIComponent(voucher.id)}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-[#1a2632] rounded-2xl shadow-xl max-w-sm w-full overflow-hidden">
                {/* Header */}
                <div className="bg-primary text-white p-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold">Your Voucher</h2>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    <p className="text-sm text-white/80 mt-1">Show this code to the supplier to redeem</p>
                </div>

                {/* QR Code Section */}
                <div className="p-6 flex flex-col items-center">
                    <div className="bg-white p-4 rounded-xl shadow-inner mb-4">
                        <QRCodeSVG
                            value={redemptionUrl}
                            size={180}
                            level="H"
                            includeMargin={false}
                        />
                    </div>

                    {/* Claim ID */}
                    <div className="text-center mb-4">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Claim ID</p>
                        <p className="font-mono text-sm font-medium text-[#111418] dark:text-white bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg">
                            {voucher.id}
                        </p>
                    </div>
                </div>

                {/* Voucher Details */}
                <div className="border-t border-dashed border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-primary font-bold">{voucher.offer.discountPercent}%</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-[#111418] dark:text-white truncate">
                                {voucher.offer.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {voucher.supplier.businessName}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                                <span className="material-symbols-outlined text-sm">event</span>
                                Valid until {formatDate(voucher.offer.validUntil)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border-t border-amber-100 dark:border-amber-900/30">
                    <div className="flex gap-2">
                        <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 flex-shrink-0">
                            info
                        </span>
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                            Present this QR code to the supplier. They will scan it to confirm your discount.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
