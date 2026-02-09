import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ownerService, type Owner } from '../../services/ownerService';
import { ImageUpload } from '../../components/ui/ImageUpload';
import { getImages, type EntityImage } from '../../services/imageService';

export const OwnerPropertyPage: React.FC = () => {
    const { user } = useAuth();
    const [owner, setOwner] = useState<Owner | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [images, setImages] = useState<EntityImage[]>([]);

    // Form fields
    const [propertyName, setPropertyName] = useState('');
    const [county, setCounty] = useState('');
    const [town, setTown] = useState('');
    const [description, setDescription] = useState('');
    const [phone, setPhone] = useState('');
    const [website, setWebsite] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [geoLoading, setGeoLoading] = useState(false);

    useEffect(() => {
        const loadOwner = async () => {
            if (!user) return;
            try {
                const data = await ownerService.getOwnerProfile(user.id);
                if (data) {
                    setOwner(data);
                    setPropertyName(data.propertyName || '');
                    setCounty(data.county || '');
                    setTown(data.town || '');
                    setDescription(data.description || '');
                    setPhone(data.contactPhone || '');
                    setWebsite(data.website || '');
                    setLatitude(data.latitude != null ? String(data.latitude) : '');
                    setLongitude(data.longitude != null ? String(data.longitude) : '');

                    // Load property images
                    try {
                        const imgs = await getImages('OWNER', data.id);
                        setImages(imgs);
                    } catch {
                        // No images yet
                    }
                }
            } catch (error) {
                console.error('Failed to load owner profile:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadOwner();
    }, [user]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!owner) return;

        setIsSaving(true);
        setSaveMessage(null);

        if (!latitude || !longitude) {
            setSaveMessage({ type: 'error', text: 'Latitude and longitude are required. Use the "Use current location" button or enter coordinates manually.' });
            setIsSaving(false);
            return;
        }

        try {
            await ownerService.updateOwnerProfile({
                propertyName,
                county,
                town,
                description,
                phone,
                website,
                latitude: latitude ? parseFloat(latitude) : null,
                longitude: longitude ? parseFloat(longitude) : null,
            });
            setSaveMessage({ type: 'success', text: 'Property details saved successfully.' });
        } catch (error) {
            setSaveMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to save.' });
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

    if (!owner) {
        return (
            <div className="p-8 text-center text-gray-500">
                Owner profile not found.
            </div>
        );
    }

    const inputClass = 'w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a2632] text-[#111418] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary';
    const labelClass = 'block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1';

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#111418] dark:text-white">Property Details</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your property information and photos</p>
                </div>
                <Link
                    to={`/campsite/${owner.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors"
                >
                    <span className="material-symbols-outlined text-lg">visibility</span>
                    View as Guest
                </Link>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                {/* Basic Info */}
                <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
                    <h2 className="text-lg font-bold text-[#111418] dark:text-white">Basic Information</h2>

                    <div>
                        <label className={labelClass}>Property Name *</label>
                        <input
                            type="text"
                            value={propertyName}
                            onChange={(e) => setPropertyName(e.target.value)}
                            required
                            className={inputClass}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>County</label>
                            <input
                                type="text"
                                value={county}
                                onChange={(e) => setCounty(e.target.value)}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Town</label>
                            <input
                                type="text"
                                value={town}
                                onChange={(e) => setTown(e.target.value)}
                                className={inputClass}
                            />
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className={inputClass}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Phone</label>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Website</label>
                            <input
                                type="text"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                className={inputClass}
                            />
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
                    <h2 className="text-lg font-bold text-[#111418] dark:text-white">Location *</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Right-click your property on Google Maps to copy coordinates, or use your current location
                    </p>

                    <button
                        type="button"
                        disabled={geoLoading}
                        onClick={() => {
                            if (!navigator.geolocation) {
                                setSaveMessage({ type: 'error', text: 'Geolocation is not supported by your browser.' });
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
                                    setSaveMessage({ type: 'error', text: 'Could not get location: ' + err.message });
                                    setGeoLoading(false);
                                },
                                { enableHighAccuracy: true, timeout: 10000 }
                            );
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors disabled:opacity-50"
                    >
                        {geoLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                                Getting location...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-lg">my_location</span>
                                Use current location
                            </>
                        )}
                    </button>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Latitude *</label>
                            <input
                                type="number"
                                step="0.000001"
                                placeholder="e.g. 52.6541"
                                value={latitude}
                                onChange={(e) => setLatitude(e.target.value)}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Longitude *</label>
                            <input
                                type="number"
                                step="0.000001"
                                placeholder="e.g. -7.2448"
                                value={longitude}
                                onChange={(e) => setLongitude(e.target.value)}
                                className={inputClass}
                            />
                        </div>
                    </div>
                </div>

                {/* Property Images */}
                <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
                    <h2 className="text-lg font-bold text-[#111418] dark:text-white">Property Images</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Upload photos of your property. The primary image will be shown on your campsite listing.
                    </p>
                    <ImageUpload
                        entityType="OWNER"
                        entityId={owner.id}
                        images={images}
                        onImagesChange={setImages}
                    />
                </div>

                {/* Save */}
                {saveMessage && (
                    <div className={`px-4 py-3 rounded-lg text-sm font-medium ${
                        saveMessage.type === 'success'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                            : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                        {saveMessage.text}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium disabled:opacity-50"
                >
                    {isSaving ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined text-lg">save</span>
                            Save Changes
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};
