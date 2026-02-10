import React from 'react';
import { Link } from 'react-router-dom';
import type { MapMarker } from '../../types/explore';

const CATEGORY_LABELS: Record<string, string> = {
    FOOD: 'Food & Drink',
    ACTIVITIES: 'Activities',
    GEAR: 'Camping Gear',
    ATTRACTIONS: 'Attractions',
    TRANSPORT: 'Transport',
};

const CATEGORY_ICONS: Record<string, string> = {
    FOOD: 'restaurant',
    ACTIVITIES: 'hiking',
    GEAR: 'backpack',
    ATTRACTIONS: 'attractions',
    TRANSPORT: 'directions_car',
};

interface ExploreSupplierPopupProps {
    marker: MapMarker;
}

export const ExploreSupplierPopup: React.FC<ExploreSupplierPopupProps> = ({ marker }) => {
    return (
        <div className="min-w-[200px]">
            <div className="flex items-center gap-2 mb-1">
                {marker.logo ? (
                    <img src={marker.logo} alt="" className="w-6 h-6 rounded-full object-cover" />
                ) : (
                    <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="material-symbols-outlined text-purple-600 text-xs">storefront</span>
                    </div>
                )}
                <h3 className="font-bold text-sm text-gray-900">{marker.businessName || marker.name}</h3>
            </div>
            {marker.category && (
                <p className="text-xs text-purple-600 flex items-center gap-1 mb-1">
                    <span className="material-symbols-outlined text-xs">{CATEGORY_ICONS[marker.category] || 'store'}</span>
                    {CATEGORY_LABELS[marker.category] || marker.category}
                </p>
            )}
            <p className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                <span className="material-symbols-outlined text-xs">location_on</span>
                {marker.location || `${marker.town}, ${marker.county}`}
            </p>
            {marker.rating != null && marker.rating > 0 && (
                <p className="text-xs flex items-center gap-0.5 mb-1">
                    <span className="material-symbols-outlined text-amber-400 text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="font-semibold">{marker.rating.toFixed(1)}</span>
                    {marker.reviewCount != null && (
                        <span className="text-gray-400">({marker.reviewCount})</span>
                    )}
                </p>
            )}
            <Link
                to={`/marketplace/supplier/${marker.id}`}
                className="text-xs font-semibold text-purple-600 hover:underline"
            >
                View Supplier &rarr;
            </Link>
        </div>
    );
};
