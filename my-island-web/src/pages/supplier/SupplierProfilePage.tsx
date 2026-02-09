import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supplierService, type Supplier, type OfferCategory } from '../../services/supplierService';
import { getImages, type EntityImage } from '../../services/imageService';
import { ImageUpload } from '../../components/ui/ImageUpload';

const CATEGORIES: { value: OfferCategory; label: string }[] = [
    { value: 'FOOD', label: 'Food & Drink' },
    { value: 'ACTIVITIES', label: 'Activities' },
    { value: 'GEAR', label: 'Gear Rental' },
    { value: 'ATTRACTIONS', label: 'Attractions' },
    { value: 'TRANSPORT', label: 'Transport' }
];

export const SupplierProfilePage: React.FC = () => {
    const { user } = useAuth();
    const [supplier, setSupplier] = useState<Supplier | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [imageError, setImageError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [supplierImages, setSupplierImages] = useState<EntityImage[]>([]);
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [geoLoading, setGeoLoading] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        businessName: '',
        description: '',
        logo: '',
        category: 'FOOD' as OfferCategory,
        location: '',
        contactEmail: '',
        contactPhone: ''
    });

    useEffect(() => {
        const loadProfile = async () => {
            if (!user) return;
            try {
                const data = await supplierService.getSupplierProfile(user.id);
                if (data) {
                    setSupplier(data);
                    setFormData({
                        businessName: data.businessName,
                        description: data.description,
                        logo: data.logo,
                        category: data.category,
                        location: data.location,
                        contactEmail: data.contactEmail,
                        contactPhone: data.contactPhone
                    });
                    setLatitude(data.latitude != null ? String(data.latitude) : '');
                    setLongitude(data.longitude != null ? String(data.longitude) : '');
                    try {
                        const imgs = await getImages('SUPPLIER', data.id);
                        setSupplierImages(imgs);
                    } catch {
                        setSupplierImages([]);
                    }
                }
            } catch (error) {
                console.error('Failed to load profile:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadProfile();
    }, [user]);

    const handleFileSelect = (file: File) => {
        if (!file.type.startsWith('image/')) {
            setImageError('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setImageError('Image must be less than 5MB');
            return;
        }

        setImageError(null);

        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            setFormData(prev => ({ ...prev, logo: result }));
        };
        reader.readAsDataURL(file);
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleRemoveLogo = () => {
        setFormData(prev => ({ ...prev, logo: '' }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!supplier) return;

        setSaveError(null);

        if (!latitude || !longitude) {
            setSaveError('Latitude and longitude are required. Use the "Use current location" button or enter coordinates manually.');
            return;
        }

        setIsSaving(true);
        try {
            await supplierService.updateSupplierProfile(supplier.id, {
                ...formData,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
            });
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            console.error('Failed to save profile:', error);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[#111418] dark:text-white mb-2">Business Profile</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    This information will be shown to guests browsing your offers
                </p>
            </div>

            {showSuccess && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                        <span className="material-symbols-outlined">check_circle</span>
                        <span className="font-medium">Profile saved successfully!</span>
                    </div>
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
                {/* Logo Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Business Logo
                    </label>
                    <div className="flex items-start gap-6">
                        <div className="relative group">
                            <div className="size-24 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-700">
                                {formData.logo ? (
                                    <img
                                        src={formData.logo}
                                        alt="Business logo"
                                        className="size-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://placehold.co/96x96/e2e8f0/94a3b8?text=Logo';
                                        }}
                                    />
                                ) : (
                                    <span className="material-symbols-outlined text-4xl text-gray-400">storefront</span>
                                )}
                            </div>
                            {formData.logo && (
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="p-1.5 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                                        title="Change logo"
                                    >
                                        <span className="material-symbols-outlined text-lg">edit</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleRemoveLogo}
                                        className="p-1.5 bg-white text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
                                        title="Remove logo"
                                    >
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 pt-1">
                            {!formData.logo ? (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-lime-400 dark:hover:border-lime-600 hover:text-lime-600 dark:hover:text-lime-400 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-lg">add_photo_alternate</span>
                                    Upload Logo
                                </button>
                            ) : (
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        {formData.logo.startsWith('data:') ? 'Custom uploaded logo' : 'Current logo'}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="inline-flex items-center gap-1.5 text-sm text-lime-600 dark:text-lime-400 hover:text-lime-700 dark:hover:text-lime-300 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-lg">sync</span>
                                        Change logo
                                    </button>
                                </div>
                            )}
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                PNG, JPG, GIF up to 5MB. Square images work best.
                            </p>
                            {imageError && <p className="text-red-500 text-xs mt-1">{imageError}</p>}
                        </div>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileInputChange}
                        className="hidden"
                    />
                </div>

                {/* Business Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Business Name *
                    </label>
                    <input
                        type="text"
                        value={formData.businessName}
                        onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                        placeholder="e.g. The Green Campsite"
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-lime-500 focus:border-lime-500 resize-none"
                        placeholder="Tell guests about your business..."
                    />
                </div>

                {/* Category */}
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

                {/* Location */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Location
                    </label>
                    <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                        placeholder="e.g., Bennettsbridge, Co. Kilkenny"
                    />
                </div>

                {/* Location Coordinates */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Location Coordinates *
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                        Right-click your location on Google Maps to copy coordinates, or use your current location
                    </p>

                    <button
                        type="button"
                        disabled={geoLoading}
                        onClick={() => {
                            if (!navigator.geolocation) {
                                setSaveError('Geolocation is not supported by your browser.');
                                return;
                            }
                            setGeoLoading(true);
                            navigator.geolocation.getCurrentPosition(
                                (pos) => {
                                    setLatitude(pos.coords.latitude.toFixed(6));
                                    setLongitude(pos.coords.longitude.toFixed(6));
                                    setGeoLoading(false);
                                },
                                (err) => {
                                    setSaveError('Could not get location: ' + err.message);
                                    setGeoLoading(false);
                                },
                                { enableHighAccuracy: true, timeout: 10000 }
                            );
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 mb-3 text-sm font-medium text-lime-600 border border-lime-500 rounded-lg hover:bg-lime-50 dark:hover:bg-lime-900/20 transition-colors disabled:opacity-50"
                    >
                        {geoLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-lime-500" />
                                Getting location...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-lg">my_location</span>
                                Use current location
                            </>
                        )}
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Latitude *</label>
                            <input
                                type="number"
                                step="0.000001"
                                placeholder="e.g. 52.6541"
                                value={latitude}
                                onChange={(e) => setLatitude(e.target.value)}
                                className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Longitude *</label>
                            <input
                                type="number"
                                step="0.000001"
                                placeholder="e.g. -7.2448"
                                value={longitude}
                                onChange={(e) => setLongitude(e.target.value)}
                                className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Contact Email
                        </label>
                        <input
                            type="email"
                            value={formData.contactEmail}
                            onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                            className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                            placeholder="e.g. contact@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Contact Phone
                        </label>
                        <input
                            type="tel"
                            value={formData.contactPhone}
                            onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                            className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                            placeholder="e.g. +353 87 123 4567"
                        />
                    </div>
                </div>

                {saveError && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                            <span className="material-symbols-outlined">error</span>
                            <span className="text-sm font-medium">{saveError}</span>
                        </div>
                    </div>
                )}

                {/* Save Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="px-6 py-2.5 text-sm font-medium text-white bg-lime-500 hover:bg-lime-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>

            {/* Business Photos */}
            {supplier && (
                <div className="mt-10">
                    <h2 className="text-xl font-bold text-[#111418] dark:text-white mb-2">Business Photos</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                        Upload photos of your business to show on your public profile
                    </p>
                    <ImageUpload
                        entityType="SUPPLIER"
                        entityId={supplier.id}
                        images={supplierImages}
                        onImagesChange={setSupplierImages}
                        maxImages={8}
                    />
                </div>
            )}

            {/* View Public Profile Link */}
            {supplier && (
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <Link
                        to={`/marketplace/supplier/${supplier.id}`}
                        className="inline-flex items-center gap-2 text-lime-600 dark:text-lime-400 hover:text-lime-700 dark:hover:text-lime-300 font-medium transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">visibility</span>
                        View Public Profile
                        <span className="material-symbols-outlined text-lg">open_in_new</span>
                    </Link>
                </div>
            )}
        </div>
    );
};
