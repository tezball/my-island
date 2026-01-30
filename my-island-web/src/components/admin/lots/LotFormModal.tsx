import React, { useState, useEffect } from 'react';
import type { Lot } from '../../../services/adminService';

interface LotFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    lot?: Lot | null; // null/undefined = create mode
    onSave: (lot: Omit<Lot, 'id'>) => Promise<void>;
    ownerId: string;
}

const LOT_TYPES: { value: Lot['type']; label: string }[] = [
    { value: 'tent', label: 'Tent' },
    { value: 'rv', label: 'RV' },
    { value: 'cabin', label: 'Cabin' },
    { value: 'lodge', label: 'Lodge' },
    { value: 'mobile-home', label: 'Mobile Home' }
];

// Campsite-level amenities (shared facilities available to all guests)
const CAMPSITE_AMENITIES = [
    'Free Showers',
    'Pet Farm Access',
    'River Walk',
    'Crazy Golf',
    'Bread Baking',
    'Pedal Go-Karts',
    'Playground',
    'Camp Store',
    'Laundry',
    'WiFi',
    'Shared Kitchen'
];

// Lot-level amenities (specific to individual pitch/unit)
const LOT_AMENITIES = [
    'Electric Hookup',
    'Water Hookup',
    'Private Fire Pit',
    'River View',
    'Picnic Table',
    'Heating',
    'Private Deck',
    'Private Shower',
    'Living Area',
    'Private BBQ',
    'Built-in Kitchen'
];

export const LotFormModal: React.FC<LotFormModalProps> = ({
    isOpen,
    onClose,
    lot,
    onSave,
    ownerId
}) => {
    const [formData, setFormData] = useState({
        name: '',
        type: 'tent' as Lot['type'],
        pricePerNight: 30,
        description: '',
        lotAmenities: [] as string[],
        campsiteAmenities: [] as string[],
        imageUrl: '',
        isAvailable: true
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const isEditMode = !!lot;

    // Reset form when modal opens/closes or lot changes
    useEffect(() => {
        if (isOpen) {
            if (lot) {
                setFormData({
                    name: lot.name,
                    type: lot.type,
                    pricePerNight: lot.pricePerNight,
                    description: lot.description,
                    lotAmenities: [...lot.lotAmenities],
                    campsiteAmenities: [...lot.campsiteAmenities],
                    imageUrl: lot.imageUrl || '',
                    isAvailable: lot.isAvailable
                });
            } else {
                setFormData({
                    name: '',
                    type: 'tent',
                    pricePerNight: 30,
                    description: '',
                    lotAmenities: [],
                    campsiteAmenities: [],
                    imageUrl: '',
                    isAvailable: true
                });
            }
            setErrors({});
        }
    }, [isOpen, lot]);

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        if (formData.pricePerNight < 1) {
            newErrors.pricePerNight = 'Price must be at least €1';
        }
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setIsSubmitting(true);
        try {
            await onSave({
                ownerId,
                name: formData.name.trim(),
                type: formData.type,
                pricePerNight: formData.pricePerNight,
                description: formData.description.trim(),
                lotAmenities: formData.lotAmenities,
                campsiteAmenities: formData.campsiteAmenities,
                imageUrl: formData.imageUrl.trim() || undefined,
                isAvailable: formData.isAvailable
            });
            onClose();
        } catch (error) {
            console.error('Failed to save lot:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleLotAmenity = (amenity: string) => {
        setFormData(prev => ({
            ...prev,
            lotAmenities: prev.lotAmenities.includes(amenity)
                ? prev.lotAmenities.filter(a => a !== amenity)
                : [...prev.lotAmenities, amenity]
        }));
    };

    const toggleCampsiteAmenity = (amenity: string) => {
        setFormData(prev => ({
            ...prev,
            campsiteAmenities: prev.campsiteAmenities.includes(amenity)
                ? prev.campsiteAmenities.filter(a => a !== amenity)
                : [...prev.campsiteAmenities, amenity]
        }));
    };

    if (!isOpen) return null;

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
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    <div className="space-y-5">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className={`w-full px-4 py-2.5 text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white ${
                                    errors.name ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                                } focus:ring-2 focus:ring-primary focus:border-primary`}
                                placeholder="e.g., Riverside Tent Spot"
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                        </div>

                        {/* Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Lot['type'] }))}
                                className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                            >
                                {LOT_TYPES.map(type => (
                                    <option key={type.value} value={type.value}>{type.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Price per Night (€) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={formData.pricePerNight}
                                onChange={(e) => setFormData(prev => ({ ...prev, pricePerNight: parseInt(e.target.value) || 0 }))}
                                className={`w-full px-4 py-2.5 text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white ${
                                    errors.pricePerNight ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                                } focus:ring-2 focus:ring-primary focus:border-primary`}
                            />
                            {errors.pricePerNight && <p className="mt-1 text-sm text-red-500">{errors.pricePerNight}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                className={`w-full px-4 py-2.5 text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white resize-none ${
                                    errors.description ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                                } focus:ring-2 focus:ring-primary focus:border-primary`}
                                placeholder="Describe this lot..."
                            />
                            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                        </div>

                        {/* Image URL */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Image URL
                            </label>
                            <input
                                type="url"
                                value={formData.imageUrl}
                                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                                className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="https://..."
                            />
                        </div>

                        {/* Lot Amenities */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Lot Amenities
                            </label>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                Specific to this pitch/unit
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {LOT_AMENITIES.map(amenity => (
                                    <button
                                        key={amenity}
                                        type="button"
                                        onClick={() => toggleLotAmenity(amenity)}
                                        className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                                            formData.lotAmenities.includes(amenity)
                                                ? 'bg-primary text-white border-primary'
                                                : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary'
                                        }`}
                                    >
                                        {amenity}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Campsite Amenities */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Campsite Amenities
                            </label>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                Shared facilities available to guests
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {CAMPSITE_AMENITIES.map(amenity => (
                                    <button
                                        key={amenity}
                                        type="button"
                                        onClick={() => toggleCampsiteAmenity(amenity)}
                                        className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                                            formData.campsiteAmenities.includes(amenity)
                                                ? 'bg-primary text-white border-primary'
                                                : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary'
                                        }`}
                                    >
                                        {amenity}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Availability Toggle */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div>
                                <p className="font-medium text-[#111418] dark:text-white">Available for booking</p>
                                <p className="text-sm text-gray-500">Toggle this lot's availability</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isAvailable}
                                    onChange={(e) => setFormData(prev => ({ ...prev, isAvailable: e.target.checked }))}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Add Lot'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
