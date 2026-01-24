import React, { useState } from 'react';

interface LotBulkActionsBarProps {
    selectedCount: number;
    onClearSelection: () => void;
    onSetAvailable: () => Promise<void>;
    onSetUnavailable: () => Promise<void>;
    onDelete: () => Promise<void>;
}

export const LotBulkActionsBar: React.FC<LotBulkActionsBarProps> = ({
    selectedCount,
    onClearSelection,
    onSetAvailable,
    onSetUnavailable,
    onDelete
}) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    if (selectedCount === 0) return null;

    const handleAction = async (action: () => Promise<void>) => {
        setIsProcessing(true);
        try {
            await action();
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDelete = async () => {
        setIsProcessing(true);
        try {
            await onDelete();
            setShowDeleteConfirm(false);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            {/* Bulk Actions Bar */}
            <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-white dark:bg-[#1a2632] border-t border-gray-200 dark:border-gray-800 shadow-lg z-40">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClearSelection}
                            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            title="Clear selection"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        <span className="text-sm font-medium text-[#111418] dark:text-white">
                            {selectedCount} lot{selectedCount > 1 ? 's' : ''} selected
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleAction(onSetAvailable)}
                            disabled={isProcessing}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 disabled:opacity-50 transition-colors"
                        >
                            <span className="material-symbols-outlined text-lg">check_circle</span>
                            <span className="hidden sm:inline">Set Available</span>
                        </button>

                        <button
                            onClick={() => handleAction(onSetUnavailable)}
                            disabled={isProcessing}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 disabled:opacity-50 transition-colors"
                        >
                            <span className="material-symbols-outlined text-lg">cancel</span>
                            <span className="hidden sm:inline">Set Unavailable</span>
                        </button>

                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            disabled={isProcessing}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 disabled:opacity-50 transition-colors"
                        >
                            <span className="material-symbols-outlined text-lg">delete</span>
                            <span className="hidden sm:inline">Delete</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#1a2632] rounded-2xl w-full max-w-md p-6 shadow-2xl">
                        <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full mx-auto mb-4">
                            <span className="material-symbols-outlined text-2xl text-red-600">warning</span>
                        </div>

                        <h3 className="text-lg font-bold text-center text-[#111418] dark:text-white mb-2">
                            Delete {selectedCount} Lot{selectedCount > 1 ? 's' : ''}?
                        </h3>

                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
                            This action cannot be undone. Are you sure you want to permanently delete the selected lot{selectedCount > 1 ? 's' : ''}?
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={isProcessing}
                                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isProcessing}
                                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                            >
                                {isProcessing ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
