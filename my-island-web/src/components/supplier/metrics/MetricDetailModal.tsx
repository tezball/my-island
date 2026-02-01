import React, { useEffect } from 'react';

interface MetricDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    icon: string;
    iconColor: string;
    isLoading: boolean;
    children: React.ReactNode;
}

export const MetricDetailModal: React.FC<MetricDetailModalProps> = ({
    isOpen,
    onClose,
    title,
    icon,
    iconColor,
    isLoading,
    children
}) => {
    // Handle Escape key
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-[#1a2632] rounded-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className={`size-8 sm:size-10 rounded-xl ${iconColor} flex items-center justify-center text-white`}>
                            <span className="material-symbols-outlined text-lg sm:text-2xl">{icon}</span>
                        </div>
                        <h2 className="text-lg sm:text-xl font-bold text-[#111418] dark:text-white">
                            {title}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(95vh-72px)] sm:max-h-[calc(90vh-88px)]">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="flex flex-col items-center gap-3">
                                <div className="size-8 border-2 border-gray-300 border-t-lime-500 rounded-full animate-spin" />
                                <span className="text-sm text-gray-500 dark:text-gray-400">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        children
                    )}
                </div>
            </div>
        </div>
    );
};
