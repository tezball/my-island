import React from 'react';
import { Link } from 'react-router-dom';
import type { MapMarker } from '../../types/explore';

interface ExploreMarkerPopupProps {
    marker: MapMarker;
}

export const ExploreMarkerPopup: React.FC<ExploreMarkerPopupProps> = ({ marker }) => {
    return (
        <div className="min-w-[200px]">
            <h3 className="font-bold text-sm text-gray-900 mb-1">{marker.name}</h3>
            <p className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                <span className="material-symbols-outlined text-xs">location_on</span>
                {marker.town}{marker.town && marker.county ? ', ' : ''}{marker.county}
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
            {marker.lotCount != null && marker.lotCount > 0 && (
                <p className="text-xs text-gray-600 mb-2">
                    {marker.lotCount} {marker.lotCount === 1 ? 'pitch' : 'pitches'}
                </p>
            )}
            <Link
                to={`/campsite/${marker.id}`}
                className="text-xs font-semibold text-primary hover:underline"
            >
                View Details &rarr;
            </Link>
        </div>
    );
};
