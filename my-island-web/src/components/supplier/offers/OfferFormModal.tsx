import React, { useState, useEffect, useRef } from 'react';
import type { Offer, OfferCategory } from '../../../services/supplierService';
import { uploadImage, validateFile } from '../../../services/imageService';

interface OfferFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    offer?: Offer | null;
    onSave: (offer: Omit<Offer, 'id' | 'claimCount' | 'createdAt'>) => Promise<Offer | void>;
    supplierId: string;
}

const CATEGORIES: { value: OfferCategory; label: string }[] = [
    { value: 'FOOD', label: 'Food & Drink' },
    { value: 'ACTIVITIES', label: 'Activities' },
    { value: 'GEAR', label: 'Gear Rental' },
    { value: 'ATTRACTIONS', label: 'Attractions' },
    { value: 'TRANSPORT', label: 'Transport' }
];

export const OfferFormModal: React.FC<OfferFormModalProps> = ({
    isOpen,
    onClose,
    offer,
    onSave,
    supplierId
}) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'FOOD' as OfferCategory,
        discountPercent: 10,
        validFrom: '',
        validUntil: '',
        maxClaims: '' as string | number,
        terms: '',
        imageUrl: '',
        active: true
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isDragging, setIsDragging] = useState(false);
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isEditMode = !!offer;

    useEffect(() => {
        if (isOpen) {
            if (offer) {
                setFormData({
                    title: offer.title,
                    description: offer.description,
                    category: offer.category,
                    discountPercent: offer.discountPercent,
                    validFrom: offer.validFrom,
                    validUntil: offer.validUntil,
                    maxClaims: offer.maxClaims ?? '',
                    terms: offer.terms,
                    imageUrl: offer.imageUrl || '',
                    active: offer.active
                });
            } else {
                const today = new Date().toISOString().split('T')[0];
                const nextMonth = new Date();
                nextMonth.setMonth(nextMonth.getMonth() + 1);
                setFormData({
                    title: '',
                    description: '',
                    category: 'FOOD',
                    discountPercent: 10,
                    validFrom: today,
                    validUntil: nextMonth.toISOString().split('T')[0],
                    maxClaims: '',
                    terms: '',
                    imageUrl: '',
                    active: true
                });
            }
            setErrors({});
            setIsDragging(false);
            setPendingFile(null);
            setPreviewUrl(null);
        }
    }, [isOpen, offer]);

    // Clean up object URL on unmount or when preview changes
    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }
        if (!formData.validFrom) {
            newErrors.validFrom = 'Start date is required';
        }
        if (!formData.validUntil) {
            newErrors.validUntil = 'End date is required';
        }
        if (formData.validFrom && formData.validUntil && formData.validFrom > formData.validUntil) {
            newErrors.validUntil = 'End date must be after start date';
        }
        if (!formData.terms.trim()) {
            newErrors.terms = 'Terms are required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFileSelect = (file: File) => {
        const validationError = validateFile(file);
        if (validationError) {
            setErrors(prev => ({ ...prev, image: validationError }));
            return;
        }

        setErrors(prev => {
            const { image: _, ...rest } = prev;
            return rest;
        });

        // Clean up old preview
        if (previewUrl) URL.revokeObjectURL(previewUrl);

        const newPreviewUrl = URL.createObjectURL(file);
        setPendingFile(file);
        setPreviewUrl(newPreviewUrl);
        setFormData(prev => ({ ...prev, imageUrl: '' }));
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleRemoveImage = () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPendingFile(null);
        setPreviewUrl(null);
        setFormData(prev => ({ ...prev, imageUrl: '' }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const displayImageUrl = previewUrl || formData.imageUrl;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setIsSubmitting(true);
        try {
            const savedOffer = await onSave({
                supplierId,
                title: formData.title.trim(),
                description: formData.description.trim(),
                category: formData.category,
                discountPercent: formData.discountPercent,
                validFrom: formData.validFrom,
                validUntil: formData.validUntil,
                maxClaims: formData.maxClaims === '' ? null : Number(formData.maxClaims),
                terms: formData.terms.trim(),
                imageUrl: formData.imageUrl || undefined,
                active: formData.active
            });

            // Upload pending file if we have one and got an offer ID back
            if (pendingFile && savedOffer && savedOffer.id) {
                try {
                    await uploadImage('OFFER', savedOffer.id, pendingFile, { primary: true });
                } catch (err) {
                    console.error('Failed to upload offer image:', err);
                }
            }

            onClose();
        } catch (error) {
            console.error('Failed to save offer:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#1a2632] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-[#111418] dark:text-white">
                        {isEditMode ? 'Edit Offer' : 'Create New Offer'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
                    <div className="p-6 space-y-5">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Offer Title *
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                                placeholder="e.g., 10% Off Fresh Produce"
                            />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Description *
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                rows={3}
                                className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-lime-500 focus:border-lime-500 resize-none"
                                placeholder="Describe what the offer includes..."
                            />
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                        </div>

                        {/* Category & Discount */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Category
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as OfferCategory }))}
                                    className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Discount %
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={formData.discountPercent}
                                    onChange={(e) => setFormData(prev => ({ ...prev, discountPercent: parseInt(e.target.value) || 0 }))}
                                    className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                                />
                            </div>
                        </div>

                        {/* Valid Dates */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Valid From *
                                </label>
                                <input
                                    type="date"
                                    value={formData.validFrom}
                                    onChange={(e) => setFormData(prev => ({ ...prev, validFrom: e.target.value }))}
                                    className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                                />
                                {errors.validFrom && <p className="text-red-500 text-xs mt-1">{errors.validFrom}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Valid Until *
                                </label>
                                <input
                                    type="date"
                                    value={formData.validUntil}
                                    onChange={(e) => setFormData(prev => ({ ...prev, validUntil: e.target.value }))}
                                    className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                                />
                                {errors.validUntil && <p className="text-red-500 text-xs mt-1">{errors.validUntil}</p>}
                            </div>
                        </div>

                        {/* Max Claims */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Max Claims (leave empty for unlimited)
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={formData.maxClaims}
                                onChange={(e) => setFormData(prev => ({ ...prev, maxClaims: e.target.value }))}
                                className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                                placeholder="Unlimited"
                            />
                        </div>

                        {/* Terms */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Terms & Conditions *
                            </label>
                            <textarea
                                value={formData.terms}
                                onChange={(e) => setFormData(prev => ({ ...prev, terms: e.target.value }))}
                                rows={2}
                                className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-lime-500 focus:border-lime-500 resize-none"
                                placeholder="e.g., Valid once per customer. Cannot be combined with other offers."
                            />
                            {errors.terms && <p className="text-red-500 text-xs mt-1">{errors.terms}</p>}
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Offer Image
                            </label>

                            {displayImageUrl ? (
                                <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                    <img
                                        src={displayImageUrl}
                                        alt="Offer preview"
                                        className="w-full h-40 object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://placehold.co/400x160/e2e8f0/94a3b8?text=Image+Not+Found';
                                        }}
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-white/80 truncate max-w-[200px]">
                                                {pendingFile ? pendingFile.name : 'Uploaded image'}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="p-1.5 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                                                    title="Change image"
                                                >
                                                    <span className="material-symbols-outlined text-lg">edit</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveImage}
                                                    className="p-1.5 bg-white/20 text-white rounded-lg hover:bg-red-500/80 transition-colors"
                                                    title="Remove image"
                                                >
                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    className={`
                                        relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                                        ${isDragging
                                            ? 'border-lime-500 bg-lime-50 dark:bg-lime-900/20'
                                            : 'border-gray-300 dark:border-gray-700 hover:border-lime-400 dark:hover:border-lime-600 bg-gray-50 dark:bg-gray-800'
                                        }
                                    `}
                                >
                                    <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-500 mb-2">
                                        add_photo_alternate
                                    </span>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                        <span className="font-medium text-lime-600 dark:text-lime-400">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500">
                                        JPEG, PNG, GIF, WebP up to 10MB
                                    </p>
                                </div>
                            )}

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/gif,image/webp"
                                onChange={handleFileInputChange}
                                className="hidden"
                            />
                            {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                        </div>

                        {/* Active Toggle */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div>
                                <p className="font-medium text-[#111418] dark:text-white">Active</p>
                                <p className="text-sm text-gray-500">Make this offer visible to guests</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.active}
                                    onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-lime-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lime-500"></div>
                            </label>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2.5 text-sm font-medium text-white bg-lime-500 hover:bg-lime-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Offer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
