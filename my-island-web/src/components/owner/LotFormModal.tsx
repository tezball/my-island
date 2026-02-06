import React, { useState, useEffect } from 'react';
import { ownerService, type CreateLotRequest, type UpdateLotRequest } from '../../services/ownerService';
import { getImages, type EntityImage } from '../../services/imageService';
import { ImageUpload } from '../ui/ImageUpload';
import type { Lot } from '../../types/booking';

interface LotFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    lot?: Lot | null;
    onSaved: () => void;
}

const LOT_TYPES = [
    { value: 'TENT', label: 'Tent Pitch' },
    { value: 'TOURING', label: 'Touring Pitch' },
    { value: 'GLAMPING', label: 'Glamping' },
    { value: 'CABIN', label: 'Cabin & Lodge' },
    { value: 'MOBILE_HOME', label: 'Mobile Home' },
];

function lotTypeToApi(type: Lot['type']): string {
    const map: Record<string, string> = {
        tent: 'TENT',
        touring: 'TOURING',
        glamping: 'GLAMPING',
        cabin: 'CABIN',
        'mobile-home': 'MOBILE_HOME',
    };
    return map[type] || 'TENT';
}

export const LotFormModal: React.FC<LotFormModalProps> = ({
    isOpen,
    onClose,
    lot,
    onSaved,
}) => {
    const [formData, setFormData] = useState({
        name: '',
        lotType: 'TENT',
        description: '',
        pricePerNight: 25,
        maxGuests: 4,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Two-phase create: after creating we get the lot id to upload images
    const [createdLotId, setCreatedLotId] = useState<string | null>(null);
    const [images, setImages] = useState<EntityImage[]>([]);

    const isEditMode = !!lot;
    const entityId = lot?.id ?? createdLotId;

    useEffect(() => {
        if (!isOpen) return;

        // Reset state
        setCreatedLotId(null);
        setImages([]);
        setErrors({});

        if (lot) {
            setFormData({
                name: lot.name,
                lotType: lotTypeToApi(lot.type),
                description: lot.description,
                pricePerNight: lot.pricePerNight,
                maxGuests: 4,
            });
            // Load existing images
            getImages('LOT', lot.id)
                .then(setImages)
                .catch(() => {});
        } else {
            setFormData({
                name: '',
                lotType: 'TENT',
                description: '',
                pricePerNight: 25,
                maxGuests: 4,
            });
        }
    }, [isOpen, lot]);

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (formData.pricePerNight <= 0) newErrors.pricePerNight = 'Price must be greater than 0';
        if (formData.maxGuests <= 0) newErrors.maxGuests = 'Max guests must be at least 1';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            if (isEditMode && lot) {
                const updates: UpdateLotRequest = {
                    name: formData.name.trim(),
                    lotType: formData.lotType,
                    description: formData.description.trim(),
                    pricePerNight: formData.pricePerNight,
                    maxGuests: formData.maxGuests,
                };
                await ownerService.updateLot(lot.id, updates);
                onSaved();
                onClose();
            } else {
                const data: CreateLotRequest = {
                    name: formData.name.trim(),
                    lotType: formData.lotType,
                    description: formData.description.trim(),
                    pricePerNight: formData.pricePerNight,
                    maxGuests: formData.maxGuests,
                };
                const created = await ownerService.createLot(data);
                setCreatedLotId(created.id);
            }
        } catch (err) {
            console.error('Failed to save lot:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDone = () => {
        onSaved();
        onClose();
    };

    if (!isOpen) return null;

    // Phase 2: lot created, show image upload
    if (createdLotId && !isEditMode) {
        return (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-[#1a2632] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl">
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                        <h2 className="text-xl font-bold text-[#111418] dark:text-white">
                            Add Images
                        </h2>
                        <button
                            onClick={handleDone}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg transition-colors"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            Lot created! Now add some photos to showcase it.
                        </p>
                        <ImageUpload
                            entityType="LOT"
                            entityId={createdLotId}
                            images={images}
                            onImagesChange={setImages}
                        />
                    </div>
                    <div className="flex items-center justify-end p-6 border-t border-gray-200 dark:border-gray-800">
                        <button
                            onClick={handleDone}
                            className="px-4 py-2.5 text-sm font-medium text-white bg-primary hover:bg-emerald-600 rounded-lg transition-colors"
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#1a2632] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-[#111418] dark:text-white">
                        {isEditMode ? 'Edit Lot' : 'Add New Lot'}
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
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Lot Name *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="e.g., Riverside Tent Pitch 1"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        {/* Type & Price */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Type
                                </label>
                                <select
                                    value={formData.lotType}
                                    onChange={(e) => setFormData(prev => ({ ...prev, lotType: e.target.value }))}
                                    className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                                >
                                    {LOT_TYPES.map(t => (
                                        <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Price / Night (€) *
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    step="0.01"
                                    value={formData.pricePerNight}
                                    onChange={(e) => setFormData(prev => ({ ...prev, pricePerNight: parseFloat(e.target.value) || 0 }))}
                                    className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                                />
                                {errors.pricePerNight && <p className="text-red-500 text-xs mt-1">{errors.pricePerNight}</p>}
                            </div>
                        </div>

                        {/* Max Guests */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Max Guests
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="20"
                                value={formData.maxGuests}
                                onChange={(e) => setFormData(prev => ({ ...prev, maxGuests: parseInt(e.target.value) || 1 }))}
                                className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                            />
                            {errors.maxGuests && <p className="text-red-500 text-xs mt-1">{errors.maxGuests}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                rows={3}
                                className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                                placeholder="Describe the lot..."
                            />
                        </div>

                        {/* Images (edit mode only - in create mode, images shown after lot creation) */}
                        {isEditMode && entityId && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Images
                                </label>
                                <ImageUpload
                                    entityType="LOT"
                                    entityId={entityId}
                                    images={images}
                                    onImagesChange={setImages}
                                />
                            </div>
                        )}
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
                            className="px-4 py-2.5 text-sm font-medium text-white bg-primary hover:bg-emerald-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Lot'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
