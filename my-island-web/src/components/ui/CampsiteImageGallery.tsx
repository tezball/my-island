import { useState, useEffect, useCallback } from 'react';
import type { EntityImage } from '../../services/imageService';

interface CampsiteImageGalleryProps {
    images: EntityImage[];
    campsiteName: string;
    embedded?: boolean;
}

export const CampsiteImageGallery: React.FC<CampsiteImageGalleryProps> = ({ images, campsiteName, embedded }) => {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    if (images.length === 0) return null;

    // Sort: primary first, then by displayOrder
    const sorted = [...images].sort((a, b) => {
        if (a.isPrimary && !b.isPrimary) return -1;
        if (!a.isPrimary && b.isPrimary) return 1;
        return a.displayOrder - b.displayOrder;
    });

    const openLightbox = (index: number) => setLightboxIndex(index);
    const closeLightbox = () => setLightboxIndex(null);

    const goNext = useCallback(() => {
        setLightboxIndex(prev => prev === null ? null : (prev + 1) % sorted.length);
    }, [sorted.length]);

    const goPrev = useCallback(() => {
        setLightboxIndex(prev => prev === null ? null : (prev - 1 + sorted.length) % sorted.length);
    }, [sorted.length]);

    // Keyboard navigation + body scroll lock for lightbox
    useEffect(() => {
        if (lightboxIndex === null) return;
        document.body.style.overflow = 'hidden';
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeLightbox();
            else if (e.key === 'ArrowRight') goNext();
            else if (e.key === 'ArrowLeft') goPrev();
        };
        window.addEventListener('keydown', handleKey);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKey);
        };
    }, [lightboxIndex, goNext, goPrev]);

    // Preview grid: show up to 5 images in a bento layout
    const previewImages = sorted.slice(0, 5);
    const remaining = sorted.length - 5;

    return (
        <>
            <div className={embedded ? 'mt-6' : 'mb-10 bg-white dark:bg-[#1a2632] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800'}>
                {!embedded && <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-4">Photos</h2>}

                {/* Bento grid */}
                {sorted.length === 1 && (
                    <div
                        className="rounded-xl overflow-hidden cursor-pointer"
                        onClick={() => openLightbox(0)}
                    >
                        <img
                            src={sorted[0].url}
                            alt={sorted[0].altText || campsiteName}
                            className="w-full h-64 md:h-96 object-cover hover:opacity-90 transition-opacity"
                        />
                    </div>
                )}

                {sorted.length === 2 && (
                    <div className="grid grid-cols-2 gap-2 rounded-xl overflow-hidden">
                        {sorted.map((img, i) => (
                            <div key={img.id} className="cursor-pointer" onClick={() => openLightbox(i)}>
                                <img
                                    src={img.url}
                                    alt={img.altText || campsiteName}
                                    className="w-full h-56 md:h-72 object-cover hover:opacity-90 transition-opacity"
                                />
                            </div>
                        ))}
                    </div>
                )}

                {sorted.length === 3 && (
                    <div className="grid grid-cols-2 gap-2 rounded-xl overflow-hidden">
                        <div className="row-span-2 cursor-pointer" onClick={() => openLightbox(0)}>
                            <img
                                src={sorted[0].url}
                                alt={sorted[0].altText || campsiteName}
                                className="w-full h-full min-h-56 md:min-h-72 object-cover hover:opacity-90 transition-opacity"
                            />
                        </div>
                        {sorted.slice(1).map((img, i) => (
                            <div key={img.id} className="cursor-pointer" onClick={() => openLightbox(i + 1)}>
                                <img
                                    src={img.url}
                                    alt={img.altText || campsiteName}
                                    className="w-full h-28 md:h-36 object-cover hover:opacity-90 transition-opacity"
                                />
                            </div>
                        ))}
                    </div>
                )}

                {sorted.length === 4 && (
                    <div className="grid grid-cols-3 gap-2 rounded-xl overflow-hidden">
                        <div className="col-span-2 row-span-2 cursor-pointer" onClick={() => openLightbox(0)}>
                            <img
                                src={sorted[0].url}
                                alt={sorted[0].altText || campsiteName}
                                className="w-full h-full min-h-56 md:min-h-80 object-cover hover:opacity-90 transition-opacity"
                            />
                        </div>
                        {sorted.slice(1).map((img, i) => (
                            <div key={img.id} className="cursor-pointer" onClick={() => openLightbox(i + 1)}>
                                <img
                                    src={img.url}
                                    alt={img.altText || campsiteName}
                                    className="w-full h-28 md:h-[calc((20rem-0.5rem)/3+0.167rem)] object-cover hover:opacity-90 transition-opacity"
                                />
                            </div>
                        ))}
                    </div>
                )}

                {sorted.length >= 5 && (
                    <div className="grid grid-cols-4 grid-rows-2 gap-2 rounded-xl overflow-hidden h-64 md:h-96">
                        <div className="col-span-2 row-span-2 cursor-pointer" onClick={() => openLightbox(0)}>
                            <img
                                src={previewImages[0].url}
                                alt={previewImages[0].altText || campsiteName}
                                className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                            />
                        </div>
                        {previewImages.slice(1).map((img, i) => (
                            <div key={img.id} className="relative cursor-pointer" onClick={() => openLightbox(i + 1)}>
                                <img
                                    src={img.url}
                                    alt={img.altText || campsiteName}
                                    className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                                />
                                {/* "Show all" overlay on last preview image */}
                                {i === 3 && remaining > 0 && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center hover:bg-black/40 transition-colors">
                                        <span className="text-white font-semibold text-lg">+{remaining} more</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Show all button */}
                {sorted.length > 3 && (
                    <button
                        onClick={() => openLightbox(0)}
                        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">photo_library</span>
                        Show all {sorted.length} photos
                    </button>
                )}
            </div>

            {/* Lightbox Modal */}
            {lightboxIndex !== null && (
                <div
                    className="fixed inset-0 bg-black/95 z-50 flex flex-col overflow-hidden"
                    onClick={closeLightbox}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 text-white" onClick={e => e.stopPropagation()}>
                        <span className="text-sm font-medium">
                            {lightboxIndex + 1} / {sorted.length}
                        </span>
                        <button
                            onClick={closeLightbox}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    {/* Image */}
                    <div className="flex-1 flex items-center justify-center px-4 relative" onClick={e => e.stopPropagation()}>
                        {sorted.length > 1 && (
                            <button
                                onClick={goPrev}
                                className="absolute left-2 md:left-6 p-2 md:p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white"
                            >
                                <span className="material-symbols-outlined text-2xl md:text-3xl">chevron_left</span>
                            </button>
                        )}

                        <img
                            src={sorted[lightboxIndex].url}
                            alt={sorted[lightboxIndex].altText || campsiteName}
                            className="max-h-[calc(100vh-10rem)] max-w-full object-contain rounded-lg"
                        />

                        {sorted.length > 1 && (
                            <button
                                onClick={goNext}
                                className="absolute right-2 md:right-6 p-2 md:p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white"
                            >
                                <span className="material-symbols-outlined text-2xl md:text-3xl">chevron_right</span>
                            </button>
                        )}
                    </div>

                    {/* Thumbnail strip */}
                    {sorted.length > 1 && (
                        <div className="p-4 flex justify-center gap-2 overflow-x-auto" onClick={e => e.stopPropagation()}>
                            {sorted.map((img, i) => (
                                <button
                                    key={img.id}
                                    onClick={() => setLightboxIndex(i)}
                                    className={`flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                                        i === lightboxIndex
                                            ? 'border-white opacity-100'
                                            : 'border-transparent opacity-50 hover:opacity-80'
                                    }`}
                                >
                                    <img
                                        src={img.url}
                                        alt={img.altText || campsiteName}
                                        className="w-14 h-14 md:w-16 md:h-16 object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};
