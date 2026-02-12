import React, { useState, useEffect } from 'react';
import { ownerService } from '../../services/ownerService';
import type { ModificationRequest } from '../../types/booking';

export const OwnerModificationRequestsPage: React.FC = () => {
    const [requests, setRequests] = useState<ModificationRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [declineRequestId, setDeclineRequestId] = useState<string | null>(null);
    const [declineReason, setDeclineReason] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        try {
            const data = await ownerService.getPendingModificationRequests();
            setRequests(data);
        } catch (err) {
            console.error('Failed to load modification requests:', err);
            setError('Failed to load modification requests');
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateStr: string): string => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-IE', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const handleApprove = async (requestId: string) => {
        setActionLoading(requestId);
        setError(null);
        try {
            await ownerService.resolveModificationRequest(requestId, true);
            setRequests(prev => prev.filter(r => r.id !== requestId));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to approve request');
        } finally {
            setActionLoading(null);
        }
    };

    const handleDecline = async () => {
        if (!declineRequestId) return;
        setActionLoading(declineRequestId);
        setError(null);
        try {
            await ownerService.resolveModificationRequest(declineRequestId, false, declineReason || undefined);
            setRequests(prev => prev.filter(r => r.id !== declineRequestId));
            setDeclineRequestId(null);
            setDeclineReason('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to decline request');
        } finally {
            setActionLoading(null);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#111418] dark:text-white">Modification Requests</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Review and manage guest booking modification requests</p>
                </div>
                <div className="animate-pulse space-y-4">
                    <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                    <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[#111418] dark:text-white">Modification Requests</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Review and manage guest booking modification requests</p>
            </div>

            {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
                    {error}
                </div>
            )}

            {requests.length === 0 ? (
                <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-3xl text-gray-400">edit_note</span>
                    </div>
                    <h3 className="text-lg font-semibold text-[#111418] dark:text-white mb-1">No pending requests</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Guest modification requests will appear here when submitted.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {requests.map(request => (
                        <div key={request.id} className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="font-semibold text-[#111418] dark:text-white">{request.guestName}</h3>
                                    <p className="text-sm text-gray-500">Booking #{request.bookingId} &middot; {request.currentLotName}</p>
                                    <p className="text-xs text-gray-400 mt-1">Requested {formatDate(request.createdAt)}</p>
                                </div>
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                    <span className="material-symbols-outlined text-xs">schedule</span>
                                    Pending
                                </span>
                            </div>

                            {/* Changes */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                {request.requestedCheckInDate && (
                                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                        <p className="text-xs text-gray-500 mb-1">Check-in</p>
                                        <p className="text-sm text-gray-400 line-through">{formatDate(request.currentCheckInDate)}</p>
                                        <p className="text-sm font-medium text-[#111418] dark:text-white">{formatDate(request.requestedCheckInDate)}</p>
                                    </div>
                                )}
                                {request.requestedCheckOutDate && (
                                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                        <p className="text-xs text-gray-500 mb-1">Check-out</p>
                                        <p className="text-sm text-gray-400 line-through">{formatDate(request.currentCheckOutDate)}</p>
                                        <p className="text-sm font-medium text-[#111418] dark:text-white">{formatDate(request.requestedCheckOutDate)}</p>
                                    </div>
                                )}
                                {request.requestedLotId && request.requestedLotId !== request.currentLotId && (
                                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                        <p className="text-xs text-gray-500 mb-1">Lot Change</p>
                                        <p className="text-sm text-gray-400 line-through">{request.currentLotName}</p>
                                        <p className="text-sm font-medium text-[#111418] dark:text-white">{request.requestedLotName || `Lot #${request.requestedLotId}`}</p>
                                    </div>
                                )}
                            </div>

                            {/* Price Impact */}
                            <div className="flex items-center gap-4 mb-4 py-3 border-t border-gray-100 dark:border-gray-800">
                                <div>
                                    <span className="text-sm text-gray-500">Price impact: </span>
                                    <span className={`text-sm font-semibold ${
                                        request.priceDifference > 0 ? 'text-green-600' : request.priceDifference < 0 ? 'text-red-600' : 'text-gray-600'
                                    }`}>
                                        {request.priceDifference > 0 ? '+' : ''}&euro;{request.priceDifference.toFixed(2)}
                                    </span>
                                </div>
                                {request.estimatedNewPrice > 0 && (
                                    <div>
                                        <span className="text-sm text-gray-500">New total: </span>
                                        <span className="text-sm font-semibold text-[#111418] dark:text-white">&euro;{request.estimatedNewPrice.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>

                            {/* Reason */}
                            {request.reason && (
                                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Guest's reason</p>
                                    <p className="text-sm text-[#111418] dark:text-white">{request.reason}</p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleApprove(request.id)}
                                    disabled={actionLoading === request.id}
                                    className="flex-1 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-emerald-600 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {actionLoading === request.id ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    ) : (
                                        <span className="material-symbols-outlined text-lg">check</span>
                                    )}
                                    Approve
                                </button>
                                <button
                                    onClick={() => { setDeclineRequestId(request.id); setDeclineReason(''); }}
                                    disabled={actionLoading === request.id}
                                    className="flex-1 py-2.5 text-sm font-semibold text-red-600 border border-red-300 dark:text-red-400 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-lg">close</span>
                                    Decline
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Decline Reason Dialog */}
            {declineRequestId && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#1a2632] rounded-2xl shadow-2xl max-w-sm w-full p-6">
                        <h3 className="text-lg font-semibold text-[#111418] dark:text-white mb-2">Decline Modification</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            Optionally provide a reason for declining this request. The guest will be notified.
                        </p>
                        <textarea
                            value={declineReason}
                            onChange={e => setDeclineReason(e.target.value)}
                            rows={3}
                            placeholder="Reason for declining (optional)"
                            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111418] dark:text-white text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none mb-4"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeclineRequestId(null)}
                                className="flex-1 py-2.5 text-sm font-semibold text-[#111418] dark:text-white border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDecline}
                                disabled={actionLoading === declineRequestId}
                                className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors disabled:opacity-50"
                            >
                                Decline Request
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
