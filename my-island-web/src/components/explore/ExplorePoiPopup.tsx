import React from 'react';
import type { MapMarker } from '../../types/explore';
import type { VisitStatus } from '../../types/discovery';
import { useAuth } from '../../context/AuthContext';

const CATEGORY_LABELS: Record<string, string> = {
    TRAIL: 'Trail',
    LANDMARK: 'Landmark',
    BEACH: 'Beach',
    WATERFALL: 'Waterfall',
    CASTLE: 'Castle',
    MOUNTAIN: 'Mountain',
    LAKE: 'Lake',
    ISLAND: 'Island',
    HERITAGE: 'Heritage',
    VIEWPOINT: 'Viewpoint',
};

const CATEGORY_ICONS: Record<string, string> = {
    TRAIL: 'hiking',
    LANDMARK: 'landscape',
    BEACH: 'beach_access',
    WATERFALL: 'water',
    CASTLE: 'castle',
    MOUNTAIN: 'terrain',
    LAKE: 'water',
    ISLAND: 'sailing',
    HERITAGE: 'account_balance',
    VIEWPOINT: 'visibility',
};

const DIFFICULTY_COLORS: Record<string, string> = {
    EASY: 'bg-green-100 text-green-700',
    MODERATE: 'bg-amber-100 text-amber-700',
    DIFFICULT: 'bg-orange-100 text-orange-700',
    STRENUOUS: 'bg-red-100 text-red-700',
};

interface ExplorePoiPopupProps {
    marker: MapMarker;
    onUpdateVisit?: (poiId: string, status: VisitStatus) => void;
    onRemoveVisit?: (poiId: string) => void;
}

export const ExplorePoiPopup: React.FC<ExplorePoiPopupProps> = ({ marker, onUpdateVisit, onRemoveVisit }) => {
    const { user } = useAuth();
    const cat = marker.poiCategory || '';

    return (
        <div className="min-w-[220px]">
            <h3 className="font-bold text-sm text-gray-900 mb-1">{marker.name}</h3>
            {cat && (
                <p className="text-xs text-cyan-600 flex items-center gap-1 mb-1">
                    <span className="material-symbols-outlined text-xs">{CATEGORY_ICONS[cat] || 'explore'}</span>
                    {CATEGORY_LABELS[cat] || cat}
                </p>
            )}
            <p className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                <span className="material-symbols-outlined text-xs">location_on</span>
                {[marker.town, marker.county].filter(Boolean).join(', ')}
            </p>
            {marker.difficulty && (
                <span className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded mb-1 ${DIFFICULTY_COLORS[marker.difficulty] || ''}`}>
                    {marker.difficulty}
                </span>
            )}
            {marker.distanceKm != null && (
                <p className="text-xs text-gray-500 mb-1">
                    {marker.distanceKm} km
                </p>
            )}
            <div className="flex items-center gap-3 mb-1">
                {marker.websiteUrl && (
                    <a
                        href={marker.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-cyan-600 hover:underline flex items-center gap-0.5"
                    >
                        <span className="material-symbols-outlined text-xs">open_in_new</span>
                        Website
                    </a>
                )}
                <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${marker.latitude},${marker.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline flex items-center gap-0.5"
                >
                    <span className="material-symbols-outlined text-xs">directions</span>
                    Directions
                </a>
            </div>
            {user && onUpdateVisit && onRemoveVisit && (
                <div className="flex gap-1 mt-2 pt-2 border-t border-gray-100">
                    {marker.visitStatus === 'VISITED' ? (
                        <button
                            onClick={() => onRemoveVisit(marker.id)}
                            className="text-[10px] px-2 py-1 rounded bg-green-100 text-green-700 font-semibold hover:bg-green-200 transition-colors"
                        >
                            Visited
                        </button>
                    ) : marker.visitStatus === 'PLANNED' ? (
                        <>
                            <button
                                onClick={() => onUpdateVisit(marker.id, 'VISITED')}
                                className="text-[10px] px-2 py-1 rounded bg-amber-100 text-amber-700 font-semibold hover:bg-amber-200 transition-colors"
                            >
                                Planned
                            </button>
                            <button
                                onClick={() => onRemoveVisit(marker.id)}
                                className="text-[10px] px-2 py-1 rounded bg-gray-100 text-gray-500 font-semibold hover:bg-gray-200 transition-colors"
                            >
                                Remove
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => onUpdateVisit(marker.id, 'PLANNED')}
                                className="text-[10px] px-2 py-1 rounded bg-gray-100 text-gray-600 font-semibold hover:bg-amber-100 hover:text-amber-700 transition-colors"
                            >
                                Plan
                            </button>
                            <button
                                onClick={() => onUpdateVisit(marker.id, 'VISITED')}
                                className="text-[10px] px-2 py-1 rounded bg-gray-100 text-gray-600 font-semibold hover:bg-green-100 hover:text-green-700 transition-colors"
                            >
                                Visited
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};
